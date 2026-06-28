const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// 1️⃣ تشغيل إعدادات البيئة (للقراءة محلياً من ملف .env)
dotenv.config();

const app = express();

// 2️⃣ الـ Middlewares الأساسية لضمان عمل واجهتك وحمايتها
app.use(cors()); // لتجنب مشاكل الـ CORS بين الفرونت والباك
app.use(express.json()); // لقراءة البيانات القادمة بصيغة JSON من الـ Form
app.use(express.urlencoded({ extended: true })); // لقراءة بيانات الـ Forms التقليدية

// 3️⃣ تخديم الملفات الثابتة (الفرونت إيند: CSS, JS, الصور، وصفحات الـ HTML)
// تأكد أن ملفات واجهتك الأمامية موجودة داخل مجلد اسمه 'public' أو عدل الاسم بالأسفل
app.use(express.static(path.join(__dirname, 'public')));

// 4️⃣ 🌐 الاتصال الذكي بقاعدة البيانات (السحابية على ريندر، والمحلية كبديل)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/FatEngineering';

mongoose.connect(dbURI)
  .then(() => {
    console.log('======================================================');
    console.log('✅ تم الاتصال بنجاح بقاعدة بيانات MongoDB السحابية (Atlas)!');
    console.log('======================================================');
  })
  .catch((err) => {
    console.error('❌ خطأ فادح في الاتصال بقاعدة البيانات: ', err.message);
  });

// 5️⃣ 📋 الـ Schemas والـ Models (مثال لهيكل طلب الصيانة أو المواعيد)
// عدّل الحقول هنا بناءً على المدخلات المو جودة في واجهتك (الاسم، الخدمة، التاريخ، إلخ)
const AppointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  serviceType: { type: String, required: true },
  visitDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// 6️⃣ 🛠️ الـ Routes (نقاط استقبال البيانات من الفرونت إيند)

// أ) استقبال طلب صيانة جديد وحفظه في الـ Atlas
app.post('/api/maintenance', async (req, res) => {
  try {
    const { clientName, serviceType, visitDate, arrivalTime } = req.body;

    // إنشاء سجل جديد في قاعدة البيانات
    const newAppointment = new Appointment({
      clientName,
      serviceType,
      visitDate,
      arrivalTime
    });

    await newAppointment.save();
    
    // إرسال رد نجاح للفرونت إيند لكي يخفي الرسالة الحمراء ويظهر نجاحاً
    res.status(201).json({ success: true, message: 'تم تسجيل طلب الصيانة بنجاح!' });
  } catch (error) {
    console.error('حدث خطأ أثناء الحفظ:', error.message);
    res.status(500).json({ success: false, message: 'حدث خطأ داخلي في السيرفر!' });
  }
});

// ب) تخديم الصفحة الرئيسية عند دخول أي شخص للرابط
app.get('*', (path, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7️⃣ 🚀 تشغيل السيرفر على البورت الديناميكي لـ Render
const PORT = process.env.PORT || 10000; // ريندر يفضل بورت 10000 تلقائياً
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل الآن بنجاح وعالمياً على المنفذ: ${PORT}`);
});