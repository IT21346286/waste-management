import Donation from '../models/Donation'; // Use ES Module import

// Add a new donation
export const addDonation = async (req, res) => {
  try {
    const { donationName, donationCategory, donationCondition, description } = req.body;
    const image = req.file ? req.file.path : ''; // Handle image path if uploaded

    const newDonation = new Donation({
      donationName,
      donationCategory,
      donationCondition,
      description,
      image,
      user: req.user._id, // Set the user field to the authenticated user's ID
    });

    await newDonation.save(); // Save the new donation to the database
    res.status(201).json(newDonation

    ); // Send the created donation in the response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server error
  }
};


// Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).populate("user", "name email avatar"); // Populate the user field with name, email, and avatar
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get donations posted by the logged-in user 
export const getMyDonations = async (req, res) => { 
  try { 
    const donations = await Donation.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("user", "name email avatar"); // Populate the user field with name, email, and avatar 
    res.status(200).json(donations); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};


// Get donation by ID - to display in edit form
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId).populate("user", "name email avatar");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update donations posted by the logged-in user 
export const updateDonation = async (req, res, next) => {
  try {
    const donationId = req.params.donationId;
    const { donationName, donationCategory, donationCondition, description } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    console.log("Request Body:", req.body); // Log request body 
    console.log("File:", req.file); // Log file if uploaded

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    donation.donationName = donationName || donation.donationName;
    donation.donationCategory = donationCategory || donation.donationCategory;
    donation.DonationCondition = donationCondition || donation.donationCondition;
    donation.description = description || donation.description;
    donation.image = image || donation.image;

    const updatedDonation = await donation.save();
    console.log("Updated Donation:", updatedDonation); // Log updated donation
    res.json(updatedDonation);
  } catch (error) {
    console.error("Error updating donation:", error.message);
    next(error);
  }
};

// Delete donations posted by the logged-in user 
export const deleteDonation = async (req, res, next) => {
  try {
    const donationId = req.params.donationId;
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await donation.remove();
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    next(error);
  }
};
