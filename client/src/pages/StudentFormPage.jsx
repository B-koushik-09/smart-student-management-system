import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Electrical', 'Information Technology', 'Chemical', 'Biotechnology'
];

const initialForm = {
  name: '', rollNumber: '', department: 'Computer Science',
  email: '', phone: '', year: 1, cgpa: 0, status: 'active', address: ''
};

export default function StudentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/students/${id}`)
        .then(res => setForm(res.data.student))
        .catch(() => { toast.error('Student not found'); navigate('/students'); })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'year' || name === 'cgpa' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNumber || !form.email || !form.phone) {
      return toast.error('Please fill all required fields');
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      return toast.error('Phone must be a 10-digit number');
    }
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/students/${id}`, form);
        toast.success('Student updated successfully');
      } else {
        await API.post('/students', form);
        toast.success('Student added successfully');
      }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-5 h-5" /> Back to Students
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 max-w-3xl"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="John Doe" id="student-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Roll Number *</label>
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className="input-field" placeholder="CS2024001" id="student-roll" disabled={isEdit} style={isEdit ? { opacity: 0.6 } : {}} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Department *</label>
              <select name="department" value={form.department} onChange={handleChange} className="input-field" id="student-department">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="john@college.edu" id="student-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="9876543210" maxLength={10} id="student-phone" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className="input-field" id="student-year">
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">CGPA</label>
              <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange} className="input-field" min="0" max="10" step="0.01" id="student-cgpa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field" id="student-status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="input-field min-h-[80px] resize-none" placeholder="Student address..." id="student-address" rows={3} />
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary" id="student-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </span>
              ) : (isEdit ? 'Update Student' : 'Add Student')}
            </motion.button>
            <button type="button" onClick={() => navigate('/students')} className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 text-sm font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
