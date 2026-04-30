require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Property = require('./src/models/Property');
const User = require('./src/models/User');

const data = [
  {
    "title": "Modern 2BHK with Balcony",
    "description": "Spacious 2BHK featuring a private balcony and modular kitchen. Located in a quiet residential area.",
    "price": 45000,
    "location": "Bandra West, Mumbai",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "furnishing": "Semi-Furnished",
    "area": 950,
    "amenities": ["Gym", "Parking", "CCTV", "Garden"],
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-29T18:10:00.000Z",
    "updatedAt": "2026-04-29T18:10:00.000Z"
  },
  {
    "title": "Luxury Penthouse Suite",
    "description": "High-end penthouse with a sea view. Premium interiors and state-of-the-art smart home features.",
    "price": 120000,
    "location": "Worli, Mumbai",
    "propertyType": "Penthouse",
    "bedrooms": 3,
    "bathrooms": 3,
    "furnishing": "Fully Furnished",
    "area": 1800,
    "amenities": ["Swimming Pool", "Clubhouse", "Intercom", "Power Backup"],
    "images": [
      "https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&w=800&q=80",
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-29T18:15:20.000Z",
    "updatedAt": "2026-04-29T18:15:20.000Z"
  },
  {
    "title": "Cozy 1RK for Students",
    "description": "Budget-friendly 1RK close to university campus and local markets. Includes gas connection.",
    "price": 12000,
    "location": "Powai, Mumbai",
    "propertyType": "Studio",
    "bedrooms": 0,
    "bathrooms": 1,
    "furnishing": "Unfurnished",
    "area": 350,
    "amenities": ["Water Supply", "Security", "Fire Alarm"],
    "images": [
      "https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=800&q=80",
    "isAvailable": true,
    "isFlagged": false,
    "createdAt": "2026-04-29T18:20:45.000Z",
    "updatedAt": "2026-04-29T18:20:45.000Z"
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
         owner: user._id
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
