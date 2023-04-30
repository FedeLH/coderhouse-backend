import { Schema, model } from "mongoose";

const cartCollection = "carts";

const cartSchema = new Schema({
  products: [
    {
      pid: {
        type: Schema.Types.ObjectId,
        ref: "products",
        unique: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate("products.pid");
});

export const cartModel = model(cartCollection, cartSchema);
