require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickserve', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const Admin = require('./models/Admin');
const Restaurant = require('./models/Restaurant');

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase();
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only (JPEG, JPG, PNG)!');
    }
  }
});

// Routes
app.post('/api/admin/register', upload.single('coverImage'), async (req, res) => {
  try {
    // Step 1 validation
    const { username, email, password, confirmPassword, step } = req.body;
    
    if (step === '1') {
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match!" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
      
      // Check if username or email exists
      const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
      if (existingAdmin) {
        return res.status(400).json({ 
          error: existingAdmin.username === username ? 
            'Username already exists' : 'Email already exists' 
        });
      }
      
      return res.json({ success: true, message: 'Proceed to step 2' });
    }
    
    // Step 2 validation
    const { restaurantName, address, cuisineType, phoneNumber } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Restaurant image is required' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create restaurant
    const restaurant = new Restaurant({
      name: restaurantName,
      cuisine: cuisineType,
      rating: 0,
      deliveryTime: '30-45 min',
      minOrder: 200,
      address,
      phoneNumber,
      image: req.file.filename,
      menuItems: []
    });
    
    const savedRestaurant = await restaurant.save();
    
    // Create admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      restaurantId: savedRestaurant._id,
      profileData: {
        restaurantName,
        address,
        cuisineType,
        phoneNumber,
        coverImage: req.file.filename
      }
    });
    
    await admin.save();
    
    res.json({ 
      success: true, 
      admin: {
        username: admin.username,
        email: admin.email,
        restaurantId: admin.restaurantId
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
