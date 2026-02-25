/* =================== prayer.js =================== */

// عناصر الصفحة
const cityName = document.getElementById('cityName');
const fajr = document.getElementById('fajr');
const dhuhr = document.getElementById('dhuhr');
const asr = document.getElementById('asr');
const maghrib = document.getElementById('maghrib');
const isha = document.getElementById('isha');
const nextPrayerCountdown = document.getElementById('nextPrayerCountdown');

// دالة لتحويل الوقت إلى صيغة 12 ساعة
function formatTime12Hour(time24) {
    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12; // تحويل 0 -> 12
    return `${hours}:${minutes.toString().padStart(2,'0')} ${ampm}`;
}

// دالة لحساب العد التنازلي
function countdownPrayer(nextPrayerTime) {
    const interval = setInterval(() => {
        const now = new Date();
        const diff = nextPrayerTime - now;

        if(diff <= 0){
            clearInterval(interval);
            nextPrayerCountdown.textContent = "الآن وقت الصلاة!";
            return;
        }

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        nextPrayerCountdown.textContent = `${hours}س ${minutes}د ${seconds}ث`;
    }, 1000);
}

// دالة لجلب مواقيت الصلاة من API
function fetchPrayerTimes(lat, lon) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    fetch(`https://api.aladhan.com/v1/timings/${Math.floor(today.getTime()/1000)}?latitude=${lat}&longitude=${lon}&method=2`)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            cityName.textContent = data.data.meta.timezone || 'موقعك';

            // تحويل جميع الأوقات لصيغة 12 ساعة
            fajr.textContent = formatTime12Hour(timings.Fajr);
            dhuhr.textContent = formatTime12Hour(timings.Dhuhr);
            asr.textContent = formatTime12Hour(timings.Asr);
            maghrib.textContent = formatTime12Hour(timings.Maghrib);
            isha.textContent = formatTime12Hour(timings.Isha);

            // تحديد الصلاة القادمة
            const now = new Date();
            const prayerTimes = [
                {name:'الفجر', time:timings.Fajr},
                {name:'الظهر', time:timings.Dhuhr},
                {name:'العصر', time:timings.Asr},
                {name:'المغرب', time:timings.Maghrib},
                {name:'العشاء', time:timings.Isha}
            ];

            let nextPrayer = null;
            for(let p of prayerTimes){
                const [h,m] = p.time.split(':').map(Number);
                const prayerDate = new Date();
                prayerDate.setHours(h, m, 0, 0);
                if(prayerDate > now){
                    nextPrayer = {name:p.name, time:prayerDate};
                    break;
                }
            }

            // لو فاتت كل الصلوات اليوم، نأخذ الفجر غدًا
            if(!nextPrayer){
                const [h,m] = timings.Fajr.split(':').map(Number);
                const prayerDate = new Date();
                prayerDate.setDate(prayerDate.getDate() + 1);
                prayerDate.setHours(h, m, 0, 0);
                nextPrayer = {name:'الفجر', time:prayerDate};
            }

            // ابدأ العد التنازلي
            nextPrayerCountdown.textContent = `الصلاة القادمة: ${nextPrayer.name}`;
            countdownPrayer(nextPrayer.time);
        })
        .catch(err => {
            console.error(err);
            nextPrayerCountdown.textContent = "حدث خطأ في جلب مواقيت الصلاة";
        });
}

// طلب الموقع من المستخدم
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        pos => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
        err => {
            console.error(err);
            nextPrayerCountdown.textContent = "تعذر الحصول على موقعك";
        }
    );
} else {
    nextPrayerCountdown.textContent = "المتصفح لا يدعم تحديد الموقع";
}