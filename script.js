const maintenanceForm = document.getElementById('maintenanceForm');
const statusMessage = document.getElementById('statusMessage');

if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // سحب البيانات من حقول الإدخال بدقة
        const clientName = document.getElementById('clientName').value;
        const serviceType = document.getElementById('serviceType').value;
        const visitDate = document.getElementById('visitDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;

        try {
            // إرسال الطلب مباشرة برابط موقعك على Render لضمان الاتصال القطعي
            const response = await fetch('https://fatengineering.onrender.com/api/maintenance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientName: clientName,
                    serviceType: serviceType,
                    visitDate: visitDate,
                    arrivalTime: arrivalTime
                })
            });

            const data = await response.json();

            if (data.success) {
                showStatus('🎉 تم تأكيد طلب الصيانة الفوري بنجاح وحفظه سحابياً!', 'success');
                maintenanceForm.reset(); // تفريغ الخانات بعد نجاح العملية
            } else {
                showStatus('❌ حدث خطأ أثناء الحجز: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            showStatus('❌ حدث خطأ أثناء الاتصال بالخادم!', 'error');
        }
    });
}

// دالة ذكية لإظهار وإخفاء التنبيهات بأسفل الشاشة وتلوينها
function showStatus(text, type) {
    if(statusMessage) {
        statusMessage.textContent = text;
        statusMessage.className = `status-popup ${type}`; // إضافة كلاس التلوين (success أو error)
        statusMessage.classList.remove('hidden');
        
        // إخفاء الرسالة تلقائياً بعد 4 ثوانٍ
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 4000);
    }
}