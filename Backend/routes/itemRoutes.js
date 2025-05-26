import express from 'express';
import multer from 'multer';
import path from 'path';
import { addItem, getAllItems, getMyItems, getItemById, updateItem, deleteItem } from '../controllers/itemController'; // Import controllers correctly
import { authGuard } from '../middleware/authMiddleware'; // Ensure this middleware exists

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

// Route to add an item with authentication and file upload
router.post('/add-item', authGuard, upload.single('image'), addItem);

// Route to get all items
router.get('/all-items', getAllItems);

// Route to get items posted by the logged-in user
router.get('/my-items', authGuard, getMyItems);

// Add this route for getting item by ID - to display in edit form
router.get('/:itemId', authGuard, getItemById); 

// Route to update items posted by the logged-in user
//router.route("/:itemId").put(authGuard, updateItem).delete(authGuard, deleteItem);
router.put('/:itemId', authGuard, upload.single('image'), updateItem); // Ensure multer middleware is here

// Route to delete items posted by the logged-in user
router.delete('/:itemId', authGuard, deleteItem);


export default router;
