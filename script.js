// كود التعامل مع الفورم وإرسال البيانات
const maintenanceForm = document.getElementById('maintenanceForm'); // تأكد أن هذا الـ ID يطابق الـ form في الـ HTML

if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // سحب القيم من خانات الإدخال بناءً على الـ ID في الـ HTML
        const clientName = document.getElementById('clientName').value;
        const serviceType = document.getElementById('serviceType').value;
        const visitDate = document.getElementById('visitDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;

        try {
            // إرسال البيانات برابط نسبي ليعمل محلياً وعلى Render بدون مشاكل
            const response = await fetch('/api/maintenance', {
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
                alert('🎉 تم تأكيد طلب الصيانة الفوري بنجاح!');
                maintenanceForm.reset(); // تفريغ الفورم بعد النجاح
            } else {
                alert('❌ حدث خطأ أثناء الحجز: ' + data.message);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('❌ حدث خطأ أثناء الاتصال بالخادم!');
        }
    });
}