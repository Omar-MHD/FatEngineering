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

// 1. تخديم الملفات الثابتة من المجلد الرئيسي مباشرة (مهم جداً أن يكون في الأعلى)
app.use(express.static(__dirname));

// رابط قاعدة البيانات السحابية
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/FatEngineering';

mongoose.connect(dbURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ DB Connection Error:', err.message));

// هيكل قاعدة البيانات لطلب الصيانة
const AppointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  serviceType: { type: String, required: true },
  visitDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// استقبال طلبات الحجز من المتصفح وحفظها
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
    return res.status(201).json({ success: true, message: 'تم الحفظ بنجاح!' });
  } catch (error) {
    console.error('Error saving:', error.message);
    return res.status(500).json({ success: false, message: 'خطأ داخلي في السيرفر' });
  }
});

// 2. تخديم صفحة index.html فقط عند طلب الرابط الرئيسي للموقع '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// المنفذ الخاص بـ Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));