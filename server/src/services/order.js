import Order from "../models/order.js";
import Customer from "../models/customer.js";

export const createOrder = async (data) => {
  const { customer, total } = data;
  if (!customer) throw new Error("Customer is required");
  if (total === undefined || total < 0)
    throw new Error("Valid total is required");

  const order = await Order.create(data);
  return order.populate("customer", "fullName contact");
};

export const getAll = async (userId) => {
  const customerIds = await Customer.find({ createdBy: userId }).distinct("_id");
  return Order.find({ customer: { $in: customerIds } })
    .sort({ createdAt: -1 })
    .populate("customer", "fullName contact");
};

export const getById = async (id) => {
  const order = await Order.findById(id).populate("customer", "fullName contact");
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  return order;
};

export const updateOrder = async (id, data) => {
  const order = await Order.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("customer", "fullName contact");
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  return order;
};
