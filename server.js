const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// تشغيل إعدادات البيئة للقراءة محلياً من ملف .env
dotenv.config();

const app = express();

// الـ Middlewares الأساسية وحل مشاكل الـ CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تخديم الملفات الثابتة (HTML, CSS, JS) من المجلد الرئيسي مباشرة
app.use(express.static(path.join(__dirname)));

// 🌐 الاتصال الذكي بقاعدة البيانات (السحابية على ريندر، والمحلية كبديل على اللاب)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/FatEngineering';

mongoose.connect(dbURI)
  .then(() => {
    console.log('======================================================');
    console.log('✅ تم الاتصال بنجاح بقاعدة بيانات MongoDB السحابية (Atlas)!');
    console.log('======================================================');
  })
  .catch((err) => {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات: ', err.message);
  });

// 📋 تعريف الهيكل (Schema) الخاص بطلب الصيانة
const AppointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  serviceType: { type: String, required: true },
  visitDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// 🛠️ الـ API الرئيسي لاستقبال طلبات الحجز من المتصفح وحفظها
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
    res.status(201).json({ success: true, message: 'تم تسجيل طلب الصيانة بنجاح!' });
  } catch (error) {
    console.error('حدث خطأ أثناء الحفظ:', error.message);
    res.status(500).json({ success: false, message: 'حدث خطأ داخلي في السيرفر!' });
  }
});

// تخديم الصفحة الرئيسية عند دخول الرابط مباشرة
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل السيرفر على البورت الخاص بـ Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن بنجاح على المنفذ: ${PORT}`);
});