import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  gender: String,
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    enum: [
      "user",
      "premium",
      "admin"
    ]
  },
});

userSchema.pre("find", function () {
  this.populate("cart");
});

userSchema.plugin(mongoosePaginate);

export const userModel = model(userCollection, userSchema);
