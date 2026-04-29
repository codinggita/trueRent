require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Property = require('./src/models/Property');
const User = require('./src/models/User');

const data = [
  {
    "title": "1BHK Studio in Mumbai",
    "description": "Compact studio apartment ideal for working professionals. Close to railway station.",
    "price": 18000,
    "location": "Andheri East, Mumbai",
    "propertyType": "Studio",
    "bedrooms": 1,
    "bathrooms": 1,
    "furnishing": "Fully Furnished",
    "area": 500,
    "amenities": ["WiFi", "Lift", "Security"],
    "images": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1e525044c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-29T17:25:49.456Z",
    "updatedAt": "2026-04-29T17:25:49.456Z"
  },
  {
    "title": "3BHK Luxury Villa",
    "description": "Spacious villa with garden and parking. Perfect for families.",
    "price": 55000,
    "location": "Whitefield, Bangalore",
    "propertyType": "Villa",
    "bedrooms": 3,
    "bathrooms": 3,
    "furnishing": "Semi-Furnished",
    "area": 2500,
    "amenities": ["Parking", "Garden", "Security", "Power Backup"],
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-28T10:15:30.000Z",
    "updatedAt": "2026-04-28T10:15:30.000Z"
  },
  {
    "title": "2BHK Flat near IT Park",
    "description": "Modern apartment with all amenities near IT hub.",
    "price": 22000,
    "location": "Hinjewadi, Pune",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "furnishing": "Unfurnished",
    "area": 1100,
    "amenities": ["Gym", "Lift", "Security"],
    "images": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "isAvailable": false,
    "isFlagged": false,
    "createdAt": "2026-04-27T08:00:00.000Z",
    "updatedAt": "2026-04-27T08:00:00.000Z"
  },
  {
    "title": "PG for Girls",
    "description": "Safe and secure PG accommodation with meals included.",
    "price": 9000,
    "location": "North Campus, Delhi",
    "propertyType": "PG",
    "bedrooms": 1,
    "bathrooms": 1,
    "furnishing": "Fully Furnished",
    "area": 300,
    "amenities": ["Food", "WiFi", "Security", "Laundry"],
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-26T12:45:00.000Z",
    "updatedAt": "2026-04-26T12:45:00.000Z"
  },
  {
    "title": "4BHK Independent House",
    "description": "Large independent house with terrace and parking.",
    "price": 40000,
    "location": "Bopal, Ahmedabad",
    "propertyType": "House",
    "bedrooms": 4,
    "bathrooms": 3,
    "furnishing": "Semi-Furnished",
    "area": 3000,
    "amenities": ["Parking", "Terrace", "Water Supply"],
    "images": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "isAvailable": true,
    "isFlagged": true,
    "createdAt": "2026-04-25T09:20:10.000Z",
    "updatedAt": "2026-04-25T09:20:10.000Z"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // get a user
    const user = await User.findOne();
    if (!user) {
       console.log('No users found to assign properties to. Please create a user first.');
       process.exit(1);
    }

    const propertiesToInsert = data.map(p => {
       return {
         ...p,
         owner: user._id,
         image: p.images && p.images.length > 0 ? p.images[0] : null
       };
    });

    await Property.insertMany(propertiesToInsert);
    console.log('Properties added successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
