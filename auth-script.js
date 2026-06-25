const toggleLogin = document.getElementById('toggleLogin');
const toggleSignUp = document.getElementById('toggleSignUp');
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');

const authToast = document.getElementById('authToast');
const authToastText = document.getElementById('authToastText');

// عند الضغط على زر "تسجيل الدخول" العلوى
toggleLogin.addEventListener('click', () => {
    toggleLogin.classList.add('active');
    toggleSignUp.classList.remove('active');
    loginForm.classList.remove('hidden');
    signUpForm.classList.add('hidden');
});

// عند الضغط على زر "إنشاء حساب" العلوى
toggleSignUp.addEventListener('click', () => {
    toggleSignUp.classList.add('active');
    toggleLogin.classList.remove('active');
    signUpForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// تفعيل إشعار منبثق في أقصى الزاوية السفلية لإتمام العمليات
function showNotification(message) {
    authToastText.innerText = message;
    authToast.classList.add('active');
    
    setTimeout(() => {
        authToast.classList.remove('active');
    }, 4000);
}

// مراقبة إرسال نموذج تسجيل الدخول
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    showNotification(`تم تسجيل الدخول بنجاح باستخدام: ${email}`);
    loginForm.reset();
});

// مراقبة إرسال نموذج تسجيل الدخول والتوجيه لصفحة الحجز
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // إظهار الإشعار العصري في الزاوية
    showNotification(`تم تسجيل الدخول بنجاح باستخدام: ${email}`);
    loginForm.reset();

    // الانتظار ثانية ونصف ليقرأ المستخدم الإشعار ثم نقله لصفحة الحجز
    setTimeout(() => {
        window.location.href = 'index.html'; 
    }, 1500);
});

// مراقبة إرسال نموذج إنشاء الحساب والتوجيه لصفحة الحجز
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    
    // إظهار الإشعار العصري في الزاوية
    showNotification(`أهلاً بك ${name}، تم إنشاء حسابك في FatEngineering!`);
    signUpForm.reset();

    // الانتظار ثانية ونصف ليقرأ المستخدم الإشعار ثم نقله لصفحة الحجز
    setTimeout(() => {
        window.location.href = 'index.html'; 
    }, 1500);
});