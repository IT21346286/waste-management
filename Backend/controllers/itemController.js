import Item from '../models/Item.js'; 

// Add a new item
export const addItem = async (req, res) => {
  try {
    const { itemName, itemCategory, itemPrice, description } = req.body;
    const image = req.file ? req.file.path : ''; // Handle image path if uploaded

    const newItem = new Item({
      itemName,
      itemCategory,
      itemPrice,
      description,
      image,
      user: req.user._id, // Set the user field to the authenticated user's ID
    });

    await newItem.save(); // Save the new item to the database
    res.status(201).json(newItem); // Send the created item in the response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server error
  }
};


// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate("user", "name email avatar"); // Populate the user field with name, email, and avatar
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get items posted by the logged-in user 
export const getMyItems = async (req, res) => { 
  try { 
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("user", "name email avatar"); // Populate the user field with name, email, and avatar 
    res.status(200).json(items); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  } 
};


// Get item by ID - to display in edit form
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate("user", "name email avatar");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update items posted by the logged-in user 
export const updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const { itemName, itemCategory, itemPrice, description } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    console.log("Request Body:", req.body); // Log request body 
    console.log("File:", req.file); // Log file if uploaded

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.itemName = itemName || item.itemName;
    item.itemCategory = itemCategory || item.itemCategory;
    item.itemPrice = itemPrice || item.itemPrice;
    item.description = description || item.description;
    item.image = image || item.image;

    const updatedItem = await item.save();
    console.log("Updated Item:", updatedItem); // Log updated item
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error.message);
    next(error);
  }
};

// Delete items posted by the logged-in user 
export const deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.remove();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
