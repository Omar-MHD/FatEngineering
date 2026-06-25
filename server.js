const express = require('express');
const path = require('path');
const fs = require('fs'); // مكتبة إدارة الملفات في النظام

const app = express();
const PORT = process.env.PORT || 3000;

// تحديد مسار ملف حفظ البيانات على جهازك
const filePath = path.join(__dirname, 'appointments.json');

// تفعيل ميزة قراءة البيانات القادمة من الاستمارات (Forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// إخبار الخادم بأن يقدم ملفات الواجهة تلقائياً
app.use(express.static(path.join(__dirname)));

// 1. استقبال الحجوزات وحفظها في ملف JSON محلي
app.post('/api/booking', (req, res) => {
    try {
        const { fullName, serviceType, appointmentDate, appointmentTime } = req.body;
        
        const newAppointment = {
            id: Date.now(), // معرّف فريد يعتمد على الوقت بالملي ثانية
            fullName,
            serviceType,
            date: appointmentDate,
            time: appointmentTime,
            createdAt: new Date()
        };

        let appointments = [];

        // التحقق مما إذا كان الملف موجوداً مسبقاً لقراءة البيانات القديمة منه
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            // إذا كان الملف غير فارغ، قم بتحويل النص إلى مصفوفة
            if (fileData.trim() !== '') {
                appointments = JSON.parse(fileData);
            }
        }

        // إضافة الحجز الجديد للمصفوفة
        appointments.push(newAppointment);

        // كتابة المصفوفة المحدثة داخل الملف بشكل منسق ومقروء
        fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf-8');
        
        console.log("📥 تم حفظ حجز جديد في ملف appointments.json بنجاح:", newAppointment);
        res.json({ success: true, message: "تم حفظ الحجز بنجاح محلياً!" });

    } catch (error) {
        console.error("❌ خطأ أثناء حفظ الحجز محلياً:", error);
        res.status(500).json({ success: false, message: "حدث خطأ في الخادم المحلي" });
    }
});

// 2. جلب كافة الحجوزات من الملف المحلي لعرضها
app.get('/api/appointments', (req, res) => {
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        if (fileData.trim() !== '') {
            return res.json(JSON.parse(fileData));
        }
    }
    res.json([]);
});

// مسار خاص لفتح لوحة التحكم بسهولة
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم الميكانيكي الذكي يعمل الآن محلياً ومستقر 100% على: http://localhost:${PORT}`);
});