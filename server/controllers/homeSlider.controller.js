import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import HomeSlider from "../models/homeSlider.moder.js";

export const createSlide = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title?.trim() || !description?.trim() || !image?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, description and image are required"
      });
    }

    const slide = await HomeSlider.create({
      title: title.trim(),
      description: description.trim(),
      image: image.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Slide created successfully",
      data: slide
    });
  } catch (error) {
    console.error("Error creating slide:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create slide"
    });
  }
};

export const getSlides = async (req, res) => {
  try {
    const slides = await HomeSlider.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: slides
    });
  } catch (error) {
    console.error("Error fetching slides:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch slides"
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No image file uploaded" 
      });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        success: false, 
        message: "Cloudinary is not configured on the server"
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gogo/sliders",
          resource_type: "image"
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
      message: "Image uploaded successfully",
      data: {
        filename: uploadResult.public_id,
        url: uploadResult.secure_url,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    const message = String(error?.message || "");
    const cloudinaryAuthIssue = /invalid signature|authentication|unauthorized|401/i.test(message);
    res.status(500).json({
      success: false,
      message: cloudinaryAuthIssue
        ? "Cloudinary authentication failed. Check that CLOUDINARY_URL or CLOUDINARY_API_SECRET contains the real secret, not a placeholder or masked value."
        : message || "Failed to upload image"
    });
  }
};
export const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Slider ID is required"
      });
    }

    if (!title?.trim() || !description?.trim() || !image?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, description and image are required"
      });
    }

    // Get the old slide to check if image changed
    const oldSlide = await HomeSlider.findById(id);
    
    const updatedSlide = await HomeSlider.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        image: image.trim()
      },
      { new: true }
    );
    
    // Delete old image from Cloudinary if image was changed
    if (oldSlide && oldSlide.image !== image.trim() && isCloudinaryConfigured) {
      try {
        let publicId;
        
        if (oldSlide.image.includes('res.cloudinary.com')) {
          const urlParts = oldSlide.image.split('/upload/');
          if (urlParts.length > 1) {
            const afterUpload = urlParts[1];
            const withoutVersion = afterUpload.replace(/^v\d+\//, '');
            publicId = withoutVersion.replace(/\.[^.]+$/, '');
          }
        } else {
          publicId = oldSlide.image.replace(/\.[^.]+$/, '');
        }
        
        if (publicId) {
          console.log('Deleting old image from Cloudinary with public_id:', publicId);
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue even if Cloudinary deletion fails
      }
    }

    if (!updatedSlide) {
      return res.status(404).json({
        success: false,
        message: "Slider not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slide updated successfully",
      data: updatedSlide
    });
  } catch (error) {
    console.error("Error updating slide:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update slide"
    });
  }
};

export const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Slider ID is required"
      });
    }

    const slide = await HomeSlider.findByIdAndDelete(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slider not found"
      });
    }

    // Delete the image from Cloudinary
    if (slide.image && isCloudinaryConfigured) {
      try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud/image/upload/v12345/gogo/sliders/filename.jpg
        // We need to extract: gogo/sliders/filename
        let publicId;
        
        if (slide.image.includes('res.cloudinary.com')) {
          // Extract from full URL
          const urlParts = slide.image.split('/upload/');
          if (urlParts.length > 1) {
            const afterUpload = urlParts[1];
            // Remove version prefix (v123456789/)
            const withoutVersion = afterUpload.replace(/^v\d+\//, '');
            // Remove file extension
            publicId = withoutVersion.replace(/\.[^.]+$/, '');
          }
        } else {
          // Assume it's already a public_id
          publicId = slide.image.replace(/\.[^.]+$/, '');
        }
        
        if (publicId) {
          console.log('Deleting image from Cloudinary with public_id:', publicId);
          await cloudinary.uploader.destroy(publicId);
          console.log('Image deleted successfully from Cloudinary');
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue even if Cloudinary deletion fails - slider is already deleted from DB
      }
    }

    return res.status(200).json({
      success: true,
      message: "Slide deleted successfully",
      data: slide
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete slide"
    });
  }
}; 
