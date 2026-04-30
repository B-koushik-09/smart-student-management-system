const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Student = require('../models/Student');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Electrical', 'Information Technology', 'Chemical', 'Biotechnology'
];

const dummyStudents = [
  { name: 'Arjun Sharma', rollNumber: 'CS2021001', department: 'Computer Science', email: 'arjun@example.com', phone: '9876543210', year: 3, cgpa: 8.5, status: 'active' },
  { name: 'Priya Patel', rollNumber: 'EC2022015', department: 'Electronics', email: 'priya@example.com', phone: '9876543211', year: 2, cgpa: 9.1, status: 'active' },
  { name: 'Rahul Verma', rollNumber: 'ME2020042', department: 'Mechanical', email: 'rahul@example.com', phone: '9876543212', year: 4, cgpa: 7.8, status: 'graduated' },
  { name: 'Ananya Iyer', rollNumber: 'IT2021088', department: 'Information Technology', email: 'ananya@example.com', phone: '9876543213', year: 3, cgpa: 8.9, status: 'active' },
  { name: 'Vikram Singh', rollNumber: 'CE2023005', department: 'Civil', email: 'vikram@example.com', phone: '9876543214', year: 1, cgpa: 8.2, status: 'active' },
  { name: 'Sneha Reddy', rollNumber: 'EE2021112', department: 'Electrical', email: 'sneha@example.com', phone: '9876543215', year: 3, cgpa: 7.5, status: 'inactive' },
  { name: 'Karthik Raja', rollNumber: 'CH2020021', department: 'Chemical', email: 'karthik@example.com', phone: '9876543216', year: 4, cgpa: 8.0, status: 'graduated' },
  { name: 'Ishani Gupta', rollNumber: 'BT2022077', department: 'Biotechnology', email: 'ishani@example.com', phone: '9876543217', year: 2, cgpa: 9.4, status: 'active' },
  { name: 'Aditya Das', rollNumber: 'CS2021009', department: 'Computer Science', email: 'aditya@example.com', phone: '9876543218', year: 3, cgpa: 8.3, status: 'active' },
  { name: 'Meera Nair', rollNumber: 'IT2022055', department: 'Information Technology', email: 'meera@example.com', phone: '9876543219', year: 2, cgpa: 8.7, status: 'active' },
  { name: 'Siddharth Malhotra', rollNumber: 'CS2023012', department: 'Computer Science', email: 'sid@example.com', phone: '9876543220', year: 1, cgpa: 7.9, status: 'active' },
  { name: 'Zara Khan', rollNumber: 'EC2021045', department: 'Electronics', email: 'zara@example.com', phone: '9876543221', year: 3, cgpa: 8.6, status: 'active' },
  { name: 'Kabir Batra', rollNumber: 'ME2022033', department: 'Mechanical', email: 'kabir@example.com', phone: '9876543222', year: 2, cgpa: 7.2, status: 'active' },
  { name: 'Riya Sen', rollNumber: 'CE2020011', department: 'Civil', email: 'riya@example.com', phone: '9876543223', year: 4, cgpa: 9.5, status: 'graduated' },
  { name: 'Aryan Goel', rollNumber: 'EE2023099', department: 'Electrical', email: 'aryan@example.com', phone: '9876543224', year: 1, cgpa: 8.1, status: 'active' },
  { name: 'Tanya Mehra', rollNumber: 'CH2021056', department: 'Chemical', email: 'tanya@example.com', phone: '9876543225', year: 3, cgpa: 8.8, status: 'active' },
  { name: 'Dev Choudhury', rollNumber: 'BT2023044', department: 'Biotechnology', email: 'dev@example.com', phone: '9876543226', year: 1, cgpa: 7.4, status: 'active' },
  { name: 'Sanya Mirza', rollNumber: 'CS2020101', department: 'Computer Science', email: 'sanya@example.com', phone: '9876543227', year: 4, cgpa: 9.2, status: 'graduated' },
  { name: 'Rohan Joshi', rollNumber: 'IT2023002', department: 'Information Technology', email: 'rohan@example.com', phone: '9876543228', year: 1, cgpa: 8.4, status: 'active' },
  { name: 'Kriti Sanon', rollNumber: 'ME2021022', department: 'Mechanical', email: 'kriti@example.com', phone: '9876543229', year: 3, cgpa: 7.7, status: 'active' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find an admin user to be the creator
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Creating a default admin: admin@smartsms.com / 123456');
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@smartsms.com',
        password: 'password123', // Will be hashed by model pre-save hook
        role: 'admin'
      });
    }

    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing student data');

    // Add dummy students
    const studentsToInsert = dummyStudents.map(s => ({
      ...s,
      createdBy: adminUser._id
    }));

    await Student.insertMany(studentsToInsert);
    console.log(`Successfully seeded ${studentsToInsert.length} students!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
