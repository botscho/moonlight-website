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
});
