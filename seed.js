// seed.js
// Run this ONCE to add sample services, users, and bookings to the database
// Command: node seed.js
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config();

const mongoose = require('mongoose');
const Service  = require('./models/Service');
const User     = require('./models/User');
const Booking  = require('./models/Booking');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI is not set. Add it to your environment or .env file.');
  process.exit(1);
}

// Connect to database
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Mongo connection error:', err));

// Sample services to insert
const sampleServices = [
  {
    name: 'AC Repair & Service',
    description: 'Installation, repair and maintenance of all AC brands by certified technicians.',
    price: 'Starting from Rs. 1,500',
    image: 'https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWMlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Electrician',
    description: 'Wiring, socket installation, panel repair and all electrical work done safely.',
    price: 'Starting from Rs. 800',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80'
  },
  {
    name: 'Plumbing',
    description: 'Pipe leaks, tap repair, drain cleaning and full bathroom fitting services.',
    price: 'Starting from Rs. 1,000',
    image: 'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Home Cleaning',
    description: 'Deep cleaning of rooms, kitchen, bathroom and sofa shampooing.',
    price: 'Starting from Rs. 2,000',
    image: 'https://plus.unsplash.com/premium_photo-1667520405114-47d3677f966e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvbWUlMjBjbGVhbmluZ3xlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Mobile Repair',
    description: 'Screen replacement, battery change and water damage repair for all phone brands.',
    price: 'Starting from Rs. 500',
    image: 'https://images.unsplash.com/photo-1639776738932-956082f0b704?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vYmlsZSUyMHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    name: 'Carpentry',
    description: 'Furniture assembly, door repair, cabinet fixing and custom woodwork.',
    price: 'Starting from Rs. 1,200',
    image: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FycGVudHJ5fGVufDB8fDB8fHww'
  }
];

const sampleUsers = [
  { name: 'Neha Patel', email: 'neha.patel@example.com', password: 'Password123' },
  { name: 'Rohit Sharma', email: 'rohit.sharma@example.com', password: 'Password123' },
  { name: 'Aisha Khan', email: 'aisha.khan@example.com', password: 'Password123' },
  { name: 'Sameer Singh', email: 'sameer.singh@example.com', password: 'Password123' },
  { name: 'Priya Gupta', email: 'priya.gupta@example.com', password: 'Password123' }
];

const sampleBookings = [
  {
    userEmail: 'neha.patel@example.com',
    name: 'Neha Patel',
    email: 'neha.patel@example.com',
    phone: '9876543210',
    service: 'Home Cleaning',
    address: 'Flat 5B, Green Oaks Apartments, Pune',
    status: 'Pending',
    createdAt: new Date('2026-06-05T10:15:00Z')
  },
  {
    userEmail: 'rohit.sharma@example.com',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    phone: '9123456780',
    service: 'Plumbing',
    address: '12 Sunrise Lane, Worli, Mumbai',
    status: 'Confirmed',
    createdAt: new Date('2026-06-04T14:20:00Z')
  },
  {
    userEmail: 'aisha.khan@example.com',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    phone: '9988776655',
    service: 'Electrician',
    address: '24 Lotus Street, Kandivali East, Mumbai',
    status: 'Pending',
    createdAt: new Date('2026-06-06T08:40:00Z')
  },
  {
    userEmail: 'sameer.singh@example.com',
    name: 'Sameer Singh',
    email: 'sameer.singh@example.com',
    phone: '9045671230',
    service: 'AC Repair & Service',
    address: '45 Horizon Towers, Koregaon Park, Pune',
    status: 'Confirmed',
    createdAt: new Date('2026-06-03T16:05:00Z')
  },
  {
    userEmail: 'priya.gupta@example.com',
    name: 'Priya Gupta',
    email: 'priya.gupta@example.com',
    phone: '9033221144',
    service: 'Carpentry',
    address: '9 Amber Heights, Baner, Pune',
    status: 'Completed',
    createdAt: new Date('2026-06-02T11:50:00Z')
  },
  {
    userEmail: 'neha.patel@example.com',
    name: 'Neha Patel',
    email: 'neha.patel@example.com',
    phone: '9876543210',
    service: 'Mobile Repair',
    address: 'Flat 5B, Green Oaks Apartments, Pune',
    status: 'Confirmed',
    createdAt: new Date('2026-06-01T09:30:00Z')
  },
  {
    userEmail: 'rohit.sharma@example.com',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    phone: '9123456780',
    service: 'Home Cleaning',
    address: '12 Sunrise Lane, Worli, Mumbai',
    status: 'Cancelled',
    createdAt: new Date('2026-06-01T18:25:00Z')
  }
];

async function seedDatabase() {
  try {
    await Service.deleteMany({});
    await Booking.deleteMany({});

    const savedServices = await Service.insertMany(sampleServices);
    console.log('✅ Seeded', savedServices.length, 'services');

    const userDocs = [];
    for (const sampleUser of sampleUsers) {
      const existing = await User.findOne({ email: sampleUser.email });
      if (existing) {
        userDocs.push(existing);
      } else {
        const newUser = new User(sampleUser);
        await newUser.save();
        userDocs.push(newUser);
      }
    }
    console.log('✅ Seeded', userDocs.length, 'users');

    const bookingsToInsert = sampleBookings.map((booking) => {
      const user = userDocs.find((u) => u.email === booking.userEmail);
      return {
        user: user ? user._id : null,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        service: booking.service,
        address: booking.address,
        status: booking.status,
        createdAt: booking.createdAt
      };
    }).filter((booking) => booking.user !== null);

    const savedBookings = await Booking.insertMany(bookingsToInsert);
    console.log('✅ Seeded', savedBookings.length, 'bookings');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
