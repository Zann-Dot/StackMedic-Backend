import { model, Schema } from "mongoose";
import crypto from "crypto";

const MemberSchema = new Schema(
    {
        clerkUserId: { type: String, required: true },
        email: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "developer"],
            default: "developer",
        },
    },
    { _id: false },
);

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        ownerClerkId: {
            type: String,
            required: true,
            index: true,
        },
        members: [MemberSchema],
        apiKey: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true },
);

ProjectSchema.pre("save", async function () {
    this.apiKey = `sm_live_${crypto.randomBytes(16).toString("hex")}`;
});

export const Project = model("Project", ProjectSchema);
