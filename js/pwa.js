// PWA Handler
document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // Install Prompt Logic
    let deferredPrompt;
    const installBtn = document.createElement('button');
    installBtn.id = 'pwaInstallBtn';
    installBtn.className = 'pwa-install-btn hidden';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    document.body.appendChild(installBtn);

    // Style the button dynamically if not in CSS
    installBtn.style.cssText = `
        position: fixed;
        bottom: 90px; /* Above game toggle */
        right: 20px;
        background: var(--primary);
        color: var(--bg-primary);
        border: none;
        padding: 10px 20px;
        border-radius: 50px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 2999;
        display: none;
        align-items: center;
        gap: 8px;
        transition: transform 0.3s;
    `;

    installBtn.addEventListener('mouseover', () => installBtn.style.transform = 'translateY(-2px)');
    installBtn.addEventListener('mouseout', () => installBtn.style.transform = 'translateY(0)');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        installBtn.style.display = 'flex';

        installBtn.addEventListener('click', (e) => {
            // Hide our user interface that shows our A2HS button
            installBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });
});
