import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    transactionHistory: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Customer", customerSchema);
