// Cookie-Banner für Google Analytics

// Cookie-Banner HTML erstellen
function createCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <p>🍪 Diese Website verwendet Cookies, um die Nutzung zu analysieren und das Angebot zu verbessern.</p>
            </div>
            <div class="cookie-buttons">
                <button id="cookie-accept" class="cookie-btn cookie-accept">Akzeptieren</button>
                <button id="cookie-reject" class="cookie-btn cookie-reject">Ablehnen</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
    
    // Event Listener für Buttons
    document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
    document.getElementById('cookie-reject').addEventListener('click', rejectCookies);
}

// Cookies akzeptieren
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideBanner();
    
    // Google Analytics aktivieren
    if (typeof gtag === 'function') {
        gtag('config', 'G-M2PW462GL4');
    }
}

// Cookies ablehnen
function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    hideBanner();
}

// Banner ausblenden
function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
    }
}

// Banner beim Laden der Seite anzeigen (falls noch nicht entschieden)
window.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        createCookieBanner();
    } else if (consent === 'accepted' && typeof gtag === 'function') {
        // Analytics laden wenn bereits akzeptiert
        gtag('config', 'G-M2PW462GL4');
    }
});
