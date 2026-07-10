import Customer from "../models/customer.js";
import Transaction from "../models/transaction.js";

const applyToBalance = (balance, amount, type) =>
  type === "credit" ? balance + amount : balance - amount;

const reverseFromBalance = (balance, amount, type) =>
  type === "credit" ? balance - amount : balance + amount;

export const createTransaction = async (data, userId) => {
  const { customerId, amount, type, description, date } = data;

  if (!customerId) throw new Error("Customer is required");
  if (!amount || amount <= 0) throw new Error("Valid amount is required");
  if (!type || !["credit", "debit"].includes(type))
    throw new Error("Invalid transaction type");

  const customer = await Customer.findOne({ _id: customerId, createdBy: userId });
  if (!customer) throw new Error("Customer not found");

  const transaction = await Transaction.create({
    customer: customerId,
    amount,
    type,
    description,
    date: date || new Date(),
  });

  customer.accountBalance = applyToBalance(
    customer.accountBalance,
    amount,
    type,
  );
  customer.transactionHistory.push(transaction._id);
  await customer.save();

  return transaction;
};

export const getAll = async (customerId, userId) => {
  const userCustomerIds = await Customer.find({ createdBy: userId }).distinct("_id");
  const filter = { customer: { $in: userCustomerIds } };
  return Transaction.find(filter).sort({ date: -1 });
};

export const updateTransaction = async (id, data, userId) => {
  if (!id) throw new Error("Id is required");

  const transaction = await Transaction.findById(id);
  if (!transaction) throw new Error("Transaction not found");

  const customer = await Customer.findOne({ _id: transaction.customer, createdBy: userId });
  if (!customer) throw new Error("Customer not found");

  customer.accountBalance = reverseFromBalance(
    customer.accountBalance,
    transaction.amount,
    transaction.type,
  );

  const newAmount = data.amount ?? transaction.amount;
  const newType = data.type ?? transaction.type;

  if (!newAmount || newAmount <= 0) throw new Error("Valid amount is required");
  if (!["credit", "debit"].includes(newType))
    throw new Error("Invalid transaction type");

  transaction.amount = newAmount;
  transaction.type = newType;
  transaction.description = data.description ?? transaction.description;
  transaction.date = data.date ?? transaction.date;
  await transaction.save();

  customer.accountBalance = applyToBalance(
    customer.accountBalance,
    newAmount,
    newType,
  );
  await customer.save();

  return transaction;
};

export const deleteTransaction = async (id, userId) => {
  if (!id) throw new Error("Id is required");

  const transaction = await Transaction.findById(id);
  if (!transaction) throw new Error("Transaction not found");

  const customer = await Customer.findOne({ _id: transaction.customer, createdBy: userId });
  if (!customer) throw new Error("Customer not found");

  customer.accountBalance = reverseFromBalance(
    customer.accountBalance,
    transaction.amount,
    transaction.type,
  );
  customer.transactionHistory = customer.transactionHistory.filter(
    (transactionId) => transactionId.toString() !== id,
  );
  await customer.save();

  await Transaction.findByIdAndDelete(id);

  return transaction;
};
