import * as transactionService from "../services/transaction.js";

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.user.id);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAll(req.query.customerId, req.user.id);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
