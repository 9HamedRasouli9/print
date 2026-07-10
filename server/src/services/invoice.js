import Invoice from "../models/invoice.js";
import Customer from "../models/customer.js";
import Transaction from "../models/transaction.js";

export const createInvoice = async (data) => {
  const { customer, items, dueDate, paidAmount, discount = 0 } = data;
  if (!customer) throw new Error("Customer is required");
  if (!dueDate) throw new Error("Due date is required");

  // Calculate total from items
  const subtotal = (items || []).reduce(
    (sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0),
    0,
  );

  const totalAmount = subtotal - discount;

  if (totalAmount <= 0) throw new Error("Invoice total must be greater than 0");

  const invoice = await Invoice.create({
    ...data,
    amount: totalAmount,
  });

  // If customer paid an amount, create a debit transaction and update balance
  if (paidAmount && paidAmount > 0) {
    const customerDoc = await Customer.findById(customer);
    if (customerDoc) {
      const transaction = await Transaction.create({
        customer,
        amount: paidAmount,
        type: "debit",
        description: `پرداخت فاکتور ${invoice.invoiceNumber}`,
        date: new Date(),
      });

      customerDoc.accountBalance -= paidAmount;
      customerDoc.transactionHistory.push(transaction._id);
      await customerDoc.save();
    }
  }

  return invoice.populate("customer", "fullName contact");
};

export const getAll = async (userId) => {
  const customerIds = await Customer.find({ createdBy: userId }).distinct("_id");
  return Invoice.find({ customer: { $in: customerIds } })
    .sort({ createdAt: -1 })
    .populate("customer", "fullName contact")
    .populate("order", "orderNumber");
};

export const getById = async (id) => {
  const invoice = await Invoice.findById(id).populate([
    "customer",
    "order",
  ]);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.status = 404;
    throw error;
  }
  return invoice;
};

export const updateInvoice = async (id, data) => {
  const invoice = await Invoice.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(["customer", "order"]);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.status = 404;
    throw error;
  }
  return invoice;
};

export const deleteInvoice = async (id) => {
  const invoice = await Invoice.findByIdAndDelete(id);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.status = 404;
    throw error;
  }
  return invoice;
};
