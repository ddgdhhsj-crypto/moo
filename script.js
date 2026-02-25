/* =================== script.js =================== */
// الوضع الليلي
document.querySelectorAll('#toggleTheme').forEach(btn => {
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });
});