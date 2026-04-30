const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  rollNumber: {
    type: String,
    required: [function() { return this.status !== 'pending'; }, 'Roll number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: [function() { return this.status !== 'pending'; }, 'Department is required'],
    enum: {
      values: [
        'Computer Science',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
        'Information Technology',
        'Chemical',
        'Biotechnology'
      ],
      message: '{VALUE} is not a valid department'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [function() { return this.status !== 'pending'; }, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  year: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: 1
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot exceed 10'],
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'inactive', 'graduated'],
    default: 'pending'
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for searching
studentSchema.index({ name: 'text', rollNumber: 'text', email: 'text' });

module.exports = mongoose.model('Student', studentSchema);
