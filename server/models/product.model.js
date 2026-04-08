import mongoose from 'mongoose';

const categoryOptions = [
  'Fruits & Vegetables',
  'Meat & Seafood',
  'Breakfast & Bakery',
  'Beverages',
  'Bread & Bakery',
  'Frozen Food',
  'Biscuits & Snacks',
  'Baby & pregnancy',
  'Healtcare',
  'Grocery & Staples',
];

const sectionOptions = ['Latest Products', 'New Arrivals'];

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: categoryOptions,
      required: [true, 'Category is required'],
      default: 'Fruits & Vegetables',
    },
    section: {
      type: String,
      enum: sectionOptions,
      required: [true, 'Section is required'],
      default: 'Latest Products',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      default: 0,
    },
    sales: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
