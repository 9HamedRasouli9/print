import * as invoiceService from "../services/invoice.js";

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAll(req.user.id);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getById(req.params.id);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
