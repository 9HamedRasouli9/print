import * as customerService from "../services/customer.js";

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body, req.user.id);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const customers = await customerService.getAll(req.user.id);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};
