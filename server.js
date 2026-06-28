const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تخدم الملفات من المجلد الرئيسي للمشروع مباشرة
app.use(express.static(path.join(__dirname)));

// الاتصال بقاعدة البيانات
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/FatEngineering';
mongoose.connect(dbURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ DB Connection Error:', err.message));

// 1. تعريف الهيكل بأسماء واضحة ومطابقة للفرونت
const AppointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  serviceType: { type: String, required: true },
  visitDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// 2. الـ API الذي يستقبل الحجز
app.post('/api/maintenance', async (req, res) => {
  try {
    const { clientName, serviceType, visitDate, arrivalTime } = req.body;

    const newAppointment = new Appointment({
      clientName,
      serviceType,
      visitDate,
      arrivalTime
    });

    await newAppointment.save();
    res.status(201).json({ success: true, message: 'تم حفظ الحجز بنجاح!' });
  } catch (error) {
    console.error('Error saving appointment:', error.message);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر الداخلي' });
  }
});

// تخديم الصفحة الرئيسية لـ Render
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));