import * as customerService from "../services/customer.js";

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const customers = await customerService.getAll();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.DeleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {

  try {
    const customer = await customerService.UpdateCustomer(
      req.params.id,
      req.body,
    );
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};
