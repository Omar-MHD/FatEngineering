const maintenanceForm = document.getElementById('maintenanceForm');

if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // سحب البيانات من حقول الإدخال بناءً على الـ ID في الـ HTML
        const clientName = document.getElementById('clientName').value;
        const serviceType = document.getElementById('serviceType').value;
        const visitDate = document.getElementById('visitDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;

        try {
            // إرسال البيانات برابط موقعك على Render لضمان الاتصال القطعي
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
                alert('🎉 تم تأكيد طلب الصيانة الفوري بنجاح وحفظه سحابياً!');
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