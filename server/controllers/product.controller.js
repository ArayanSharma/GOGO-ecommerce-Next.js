import ProductModel from '../models/product.model.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';

  if (imageUrl.includes('res.cloudinary.com')) {
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length > 1) {
      const afterUpload = urlParts[1];
      const withoutVersion = afterUpload.replace(/^v\d+\//, '');
      return withoutVersion.replace(/\.[^.]+$/, '');
    }
  }

  return imageUrl.replace(/\.[^.]+$/, '');
};

export const createProductController = async (req, res) => {
  try {
    const { product, category, section, price, sales, stock, image } = req.body;

    if (!product?.trim()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Product name is required',
      });
    }

    const newProduct = await ProductModel.create({
      product: product.trim(),
      category,
      section,
      price: Number(price),
      sales: Number(sales),
      stock: Number(stock),
      image: image?.trim() || '',
    });

    return res.status(201).json({
      success: true,
      error: false,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to create product',
    });
  }
};

export const uploadProductImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'No image file uploaded',
      });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        success: false,
        error: true,
        message: 'Cloudinary is not configured on the server',
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'gogo/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Image uploaded successfully',
      data: {
        filename: uploadResult.public_id,
        url: uploadResult.secure_url,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    const message = String(error?.message || '');
    const cloudinaryAuthIssue = /invalid signature|authentication|unauthorized|401/i.test(message);

    return res.status(500).json({
      success: false,
      error: true,
      message: cloudinaryAuthIssue
        ? 'Cloudinary authentication failed. Check CLOUDINARY_URL / CLOUDINARY_API_SECRET.'
        : message || 'Failed to upload image',
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to fetch products',
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Product ID is required',
      });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to fetch product',
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, category, section, price, sales, stock, image } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Product ID is required',
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        product: product?.trim(),
        category,
        section,
        price: Number(price),
        sales: Number(sales),
        stock: Number(stock),
        image: image?.trim() || '',
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to update product',
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Product ID is required',
      });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Product not found',
      });
    }

    if (deletedProduct.image && isCloudinaryConfigured) {
      try {
        const publicId = getCloudinaryPublicId(deletedProduct.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting product image from Cloudinary:', cloudinaryError);
      }
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to delete product',
    });
  }
};
