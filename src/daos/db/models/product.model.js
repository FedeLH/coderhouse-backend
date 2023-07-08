import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  category: {
    type: String,
    enum: [
      "accesorios",
      "auriculares",
      "teclados",
      "placas de video",
      "monitores",
      "parlantes",
      "mouses",
      "microfonos",
      "notebooks",
      "motherboards",
      "gabinetes",
    ],
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnails: {
    type: [String],
    default: ["https://placehold.co/300x200"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: "admin"
  }
});

productSchema.plugin(mongoosePaginate);

export const productModel = model(productCollection, productSchema);
