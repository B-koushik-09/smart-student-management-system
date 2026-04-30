const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const { logActivity } = require('../utils/logger');

// @desc    Get all students (with search, filter, pagination)
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by name, roll number, or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { rollNumber: searchRegex },
        { email: searchRegex }
      ];
    }

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by year
    if (req.query.year) {
      query.year = parseInt(req.query.year);
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const order = req.query.order === 'asc' ? 1 : -1;
      sort = { [req.query.sortBy]: order };
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching student'
    });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
exports.createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => e.msg)
      });
    }

    // Check for duplicate roll number
    const existingStudent = await Student.findOne({ rollNumber: req.body.rollNumber.toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists'
      });
    }

    // Check for duplicate email
    const existingEmail = await Student.findOne({ email: req.body.email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    const student = await Student.create({
      ...req.body,
      createdBy: req.user.id
    });

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'create',
      entity: 'student',
      entityId: student._id,
      details: `Added student "${student.name}" (${student.rollNumber})`,
      metadata: { department: student.department, year: student.year },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Create student error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating student'
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
exports.updateStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => e.msg)
      });
    }

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const oldName = student.name;
    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'update',
      entity: 'student',
      entityId: student._id,
      details: `Updated student "${oldName}" (${student.rollNumber})`,
      metadata: { updatedFields: Object.keys(req.body) },
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating student'
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentName = student.name;
    const studentRoll = student.rollNumber;
    await Student.findByIdAndDelete(req.params.id);

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'delete',
      entity: 'student',
      entityId: req.params.id,
      details: `Deleted student "${studentName}" (${studentRoll})`,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting student'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/students/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const graduatedStudents = await Student.countDocuments({ status: 'graduated' });

    // Department-wise count
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Year-wise count
    const yearStats = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Recent entries
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name rollNumber department email createdAt');

    // Average CGPA
    const avgCGPA = await Student.aggregate([
      { $match: { cgpa: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$cgpa' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        totalDepartments: departmentStats.length,
        departmentStats,
        yearStats,
        recentStudents,
        averageCGPA: avgCGPA.length > 0 ? avgCGPA[0].avg.toFixed(2) : '0.00'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// @desc    Export students as CSV
// @route   GET /api/students/export/csv
// @access  Private (Admin)
exports.exportStudentsCSV = async (req, res) => {
  try {
    let query = {};
    if (req.query.department) query.department = req.query.department;
    if (req.query.year) query.year = parseInt(req.query.year);
    if (req.query.status) query.status = req.query.status;

    const students = await Student.find(query)
      .sort({ rollNumber: 1 })
      .select('name rollNumber department email phone year cgpa status address createdAt');

    // Build CSV
    const headers = ['Name', 'Roll Number', 'Department', 'Email', 'Phone', 'Year', 'CGPA', 'Status', 'Address', 'Created At'];
    const csvRows = [headers.join(',')];

    students.forEach(s => {
      const row = [
        `"${s.name}"`,
        s.rollNumber,
        `"${s.department}"`,
        s.email,
        s.phone,
        s.year,
        s.cgpa,
        s.status,
        `"${(s.address || '').replace(/"/g, '""')}"`,
        new Date(s.createdAt).toISOString().split('T')[0]
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'export',
      entity: 'student',
      details: `Exported ${students.length} student records as CSV`,
      metadata: { count: students.length, filters: req.query },
      ipAddress: req.ip
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_export_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting students'
    });
  }
};
