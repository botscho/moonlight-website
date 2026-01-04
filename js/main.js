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
});
