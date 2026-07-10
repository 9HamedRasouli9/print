import mongoose from "mongoose";

const printJobSchema = new mongoose.Schema(
  {
    jobNumber: {
      type: String,
      unique: true,
    },
    jobName: {
      type: String,
      required: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "printing", "completed", "paused", "error"],
      default: "queued",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    copies: {
      type: Number,
      default: 1,
      min: 1,
    },
    pages: {
      type: Number,
      default: 1,
      min: 1,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

printJobSchema.pre("save", async function (next) {
  if (!this.jobNumber) {
    const count = await mongoose.model("PrintJob").countDocuments();
    this.jobNumber = `PJ-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

export default mongoose.model("PrintJob", printJobSchema);
