// Detect if on mobile and on index page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on index.html (or root)
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname.split('/').pop() === '';
    
    // Add class to body if on mobile and index page
    if (isIndexPage && window.innerWidth <= 768) {
        document.body.classList.add('mobile-home');
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (isIndexPage) {
            if (window.innerWidth <= 768) {
                document.body.classList.add('mobile-home');
            } else {
                document.body.classList.remove('mobile-home');
            }
        }
    });
    
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown-menu');
    
    if (menuToggle && mobileDropdown) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const dropdownLinks = document.querySelectorAll('.mobile-dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileDropdown.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !mobileDropdown.contains(event.target)) {
                menuToggle.classList.remove('active');
                mobileDropdown.classList.remove('active');
            }
        });
    }

    // Automatisches Löschen vergangener Events
    removeExpiredEvents();
    
    // Automatisches Verstecken des Turnier-Links
    hideTournamentLinkAfterEvent();
});

// Funktion zum Verstecken des Turnier-Links nach dem Event (24.01.2026 um 1 Uhr)
function hideTournamentLinkAfterEvent() {
    const now = new Date();
    const hideDate = new Date('2026-01-24T01:00:00'); // 24.01.2026, 01:00 Uhr
    
    if (now >= hideDate) {
        // Sidebar Link verstecken
        const sidebarLink = document.getElementById('turnier-nav-link');
        if (sidebarLink) {
            sidebarLink.style.display = 'none';
        }
        
        // Mobile Link verstecken
        const mobileLink = document.getElementById('turnier-mobile-link');
        if (mobileLink) {
            mobileLink.style.display = 'none';
        }
    }
}

// Funktion zum Entfernen vergangener Events
function removeExpiredEvents() {
    const now = new Date();
    
    const eventCards = document.querySelectorAll('.event-card[data-event-date]');
    
    eventCards.forEach(card => {
        const eventDateStr = card.getAttribute('data-event-date');
        if (eventDateStr) {
            const eventDate = new Date(eventDateStr);
            // Event wird am Folgetag um 3 Uhr gelöscht
            // Beispiel: Event am 30.01. wird am 31.01. um 3:00 Uhr gelöscht
            eventDate.setDate(eventDate.getDate() + 1); // +1 Tag
            eventDate.setHours(3, 0, 0, 0); // 3:00 Uhr morgens
            
            // Wenn Löschzeitpunkt vorbei ist, Event entfernen
            if (now >= eventDate) {
                card.remove();
            }
        }
    });
}
