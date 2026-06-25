document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const toast = document.getElementById('toastNotification');

    // دالة مطورة ومضمونة لإظهار الإشعار بتنسيق داخلي مباشر
    function showToast(message, isSuccess = true) {
        toast.textContent = message;
        
        // تطبيق التنسيقات مباشرة عبر الجافا سكربت لضمان ظهورها فوراً
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.backgroundColor = isSuccess ? '#2ecc71' : '#e74c3c';
        toast.style.color = 'white';
        toast.style.padding = '15px 30px';
        toast.style.borderRadius = '8px';
        toast.style.fontFamily = 'Cairo, sans-serif';
        toast.style.fontSize = '16px';
        toast.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        toast.style.zIndex = '1000';
        toast.style.transition = 'all 0.5s ease-in-out';
        
        // تأثير الظهور (الانتقال الحركي)
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        // إخفاء الإشعار تلقائياً بعد 3 ثوانٍ
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName')?.value || '';
            const serviceType = document.getElementById('serviceType')?.value || '';
            const appointmentDate = document.getElementById('appointmentDate')?.value || '';
            const appointmentTime = document.getElementById('appointmentTime')?.value || '';

            try {
                const response = await fetch('http://localhost:3000/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName, serviceType, appointmentDate, appointmentTime })
                });

                const result = await response.json();

                if (result.success) {
                    // 🎉 استخدام الإشعار الذكي بدلاً من الـ alert التقليدي
                    showToast('🎉 تم تسجيل حجزك بنجاح في المنصة الذكية!');
                    
                    // تنظيف الحقول وإعادة تصفير الفورم بشكل أنيق
                    appointmentForm.reset(); 
                } else {
                    showToast('❌ فشل حفظ الحجز: ' + result.message, false);
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('❌ حدث خطأ أثناء الاتصال بالخادم!', false);
            }
        });
    }
});