import PrintJob from "../models/printJob.js";
import Customer from "../models/customer.js";

export const createPrintJob = async (data) => {
  const { jobName, customer } = data;
  if (!jobName) throw new Error("Job name is required");
  if (!customer) throw new Error("Customer is required");

  const printJob = await PrintJob.create(data);
  return printJob.populate("customer", "fullName contact");
};

export const getAll = async (userId) => {
  const customerIds = await Customer.find({ createdBy: userId }).distinct("_id");
  return PrintJob.find({ customer: { $in: customerIds } })
    .sort({ createdAt: -1 })
    .populate("customer", "fullName contact");
};

export const getById = async (id) => {
  const printJob = await PrintJob.findById(id).populate(
    "customer",
    "fullName contact",
  );
  if (!printJob) {
    const error = new Error("Print job not found");
    error.status = 404;
    throw error;
  }
  return printJob;
};

export const updatePrintJob = async (id, data) => {
  const printJob = await PrintJob.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("customer", "fullName contact");
  if (!printJob) {
    const error = new Error("Print job not found");
    error.status = 404;
    throw error;
  }
  return printJob;
};

export const deletePrintJob = async (id) => {
  const printJob = await PrintJob.findByIdAndDelete(id);
  if (!printJob) {
    const error = new Error("Print job not found");
    error.status = 404;
    throw error;
  }
  return printJob;
};
