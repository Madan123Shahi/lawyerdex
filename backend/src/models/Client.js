import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: "User",
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    savedLawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lawyer" }],
  },
  { timestamps: true },
);

export default mongoose.model("Client", clientSchema);
