import * as orderService from "../services/order.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const order = await orderService.getById(req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
