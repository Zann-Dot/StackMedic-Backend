import { Schema, model } from "mongoose";

const ErrorLogSchema = new Schema(
  {
    rawError: { type: String, required: true },
    description: { type: String, required: true },
    title: { type: String, required: true },
    language: { type: String, required: true },
    explanation: { type: String, required: true },
    errorType: {
      type: String,
      enum: ["Syntax", "Runtime", "Network", "Database", "Unknown"],
      default: "Unknown",
    },
    codeFix: { type: String, required: true },
  },
  { timestamps: true },
);

export default model("ErrorLogs", ErrorLogSchema);
