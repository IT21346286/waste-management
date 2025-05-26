import express from 'express';
import multer from 'multer';
import path from 'path';
import { addDonation, getAllDonations, getMyDonations, getDonationById, updateDonation, deleteDonation } from '../controllers/donationController.js'; // Import controllers correctly
import { authGuard } from '../middleware/authMiddleware.js'; // Ensure this middleware exists

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify directory for storing files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename for uploaded files
  }
});

const upload = multer({ storage: storage });

// Route to add an donation with authentication and file upload
router.post('/add-donation', authGuard, upload.single('image'), addDonation);

// Route to get all donations
router.get('/all-donations', getAllDonations);

// Route to get donations posted by the logged-in user
router.get('/my-donations', authGuard, getMyDonations);

// Add this route for getting donation by ID - to display in edit form
router.get('/:donationId', authGuard, getDonationById); 

// Route to update donations posted by the logged-in user
//router.route("/:donationId").put(authGuard, updateDonation).delete(authGuard, deleteDonation);
router.put('/:donationId', authGuard, upload.single('image'), updateDonation); // Ensure multer middleware is here

// Route to delete donations posted by the logged-in user
router.delete('/:donationId', authGuard, deleteDonation);


export default router;
