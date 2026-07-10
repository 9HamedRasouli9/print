import Customer from "../models/customer.js";

export const createCustomer = async (data, userId) => {
  const { fullName } = data;

  if (!fullName) throw new Error("Name is Required");

  const customer = await Customer.create({ ...data, createdBy: userId });

  return customer;
};

export const getAll = async (userId) => {
  const customers = await Customer.find({ createdBy: userId });
  return customers;
};

export const deleteCustomer = async (id, userId) => {
  if (!id) throw new Error("Id is Required");

  const customer = await Customer.findOneAndDelete({ _id: id, createdBy: userId });
  if (!customer) throw new Error("Customer Not Found");

  return customer;
};

export const updateCustomer = async (id, data, userId) => {
  if (!id) throw new Error("Id is Required");

  const customer = await Customer.findOneAndUpdate(
    { _id: id, createdBy: userId },
    data,
    { new: true, runValidators: true },
  );
  if (!customer) throw new Error("Customer Not Found");
  return customer;
};
