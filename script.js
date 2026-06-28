const maintenanceForm = document.getElementById('maintenanceForm');

if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientName = document.getElementById('clientName').value;
        const serviceType = document.getElementById('serviceType').value;
        const visitDate = document.getElementById('visitDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;

        try {
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
                alert('🎉 تم تأكيد طلب الصيانة الفوري بنجاح وحفظه سحابياً!');
                maintenanceForm.reset();
            } else {
                alert('❌ حدث خطأ أثناء الحجز: ' + data.message);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('❌ حدث خطأ أثناء الاتصال بالخادم!');
        }
    });
}