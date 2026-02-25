let tasbihCount = Number(localStorage.getItem('tasbihCount')) || 0;
document.getElementById('tasbihCount').textContent = tasbihCount;

document.getElementById('startTasbih').addEventListener('click', () => {
    tasbihCount++;
    document.getElementById('tasbihCount').textContent = tasbihCount;
    localStorage.setItem('tasbihCount', tasbihCount);
});

document.getElementById('resetTasbih').addEventListener('click', () => {
    tasbihCount = 0;
    document.getElementById('tasbihCount').textContent = tasbihCount;
    localStorage.setItem('tasbihCount', tasbihCount);
});

const azkarList = [
    "سبحان الله",
    "الحمد لله",
    "الله أكبر",
    "لا إله إلا الله"
];
let currentIndex = 0;
function showZikr() {
    document.getElementById('currentAzkar').textContent = azkarList[currentIndex];
    currentIndex = (currentIndex + 1) % azkarList.length;
}
setInterval(showZikr, 3000);
showZikr();