import Customer from "../models/customer.js";

export const createCustomer = async (data) => {
  const { fullName } = data;
  // validation logic

  if (!fullName) throw new Error("Name is Required");

  // create customer
  const customer = await Customer.create(data);

  return customer;
};

export const getAll = async () => {
  const customers = await Customer.find();
  return customers;
};

export const DeleteCustomer = async (id) => {
  // validation
  if (!id) throw new Error("Id is Required");

  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw new Error("Customer Not Found");

  return customer;
};

export const UpdateCustomer = async (id, data) => {
  if (!id) throw new Error("Id is Required");

  const customer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!customer) throw new Error("Customer Not Found");
  return customer;
};
