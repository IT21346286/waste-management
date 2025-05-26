import mongoose from 'mongoose'; // Import mongoose

const { Schema } = mongoose; // Destructure Schema from mongoose

const itemSchema = new Schema({
  itemName: { type: String, required: true },
  itemCategory: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Store image path or URL
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who posted the item
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item; // Export the model
