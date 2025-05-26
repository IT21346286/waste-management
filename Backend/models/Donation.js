import mongoose from 'mongoose'; // Import mongoose

const { Schema } = mongoose; // Destructure Schema from mongoose

const donationSchema = new Schema({
  donationName: { type: String, required: true },
  donationCategory: { type: String, required: true },
  donationCondition: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Store image path or URL
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who posted the item
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation; // Export the model
