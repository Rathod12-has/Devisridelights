// Register the Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered"));
}

let deferredPrompt;
const installBtn = document.getElementById('install-app-btn');

// This event fires when the browser confirms the site is "Installable"
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // The button starts as 'display: none', this makes it visible
    installBtn.style.display = 'block'; 
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    }
});
