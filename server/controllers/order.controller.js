import OrderModel from '../models/order.js';
import UserModel from '../models/user.model.js';

const generateOrderNumber = () => {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `GOGO-${stamp}-${rand}`;
};

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const quantity = Math.max(1, Number(item?.quantity || 1));
      const price = Math.max(0, Number(item?.price || 0));
      return {
        productId: String(item?.id || item?.productId || ''),
        name: String(item?.name || item?.product || 'Product'),
        image: String(item?.image || ''),
        quantity,
        price,
        subTotal: Number((price * quantity).toFixed(2)),
      };
    })
    .filter((item) => item.productId);
};

export const createOrderController = async (req, res) => {
  try {
    const { userEmail, items, deliveryAddress, paymentMethod, subtotal, shipping, tax, totalAmount } = req.body;

    if (!userEmail || typeof userEmail !== 'string') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'User email is required',
      });
    }

    const normalizedItems = normalizeItems(items);
    if (normalizedItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'At least one order item is required',
      });
    }

    if (!deliveryAddress?.name || !deliveryAddress?.phone || !deliveryAddress?.address) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Complete delivery address is required',
      });
    }

    const computedSubtotal = Number(
      normalizedItems.reduce((sum, item) => sum + Number(item.subTotal || 0), 0).toFixed(2)
    );

    const safeShipping = Math.max(0, Number(shipping ?? 0));
    const safeTax = Math.max(0, Number(tax ?? 0));
    const safeSubtotal = Math.max(0, Number(subtotal ?? computedSubtotal));
    const safeTotal = Math.max(0, Number(totalAmount ?? safeSubtotal + safeShipping + safeTax));

    const existingUser = await UserModel.findOne({ email: String(userEmail).trim().toLowerCase() }).select('_id');

    const order = await OrderModel.create({
      orderNumber: generateOrderNumber(),
      user: existingUser?._id || null,
      userEmail: String(userEmail).trim().toLowerCase(),
      items: normalizedItems,
      deliveryAddress: {
        type: deliveryAddress.type || 'Home',
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
        city: deliveryAddress.city || '',
        state: deliveryAddress.state || '',
        zipCode: deliveryAddress.zipCode || '',
        nearBy: deliveryAddress.nearBy || '',
      },
      paymentMethod: paymentMethod || 'COD',
      subtotal: safeSubtotal,
      shipping: safeShipping,
      tax: safeTax,
      totalAmount: safeTotal,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      orderStatus: 'placed',
    });

    return res.status(201).json({
      success: true,
      error: false,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to create order',
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Failed to fetch orders',
    });
  }
};
