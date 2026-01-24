// Dynamische Galerie-Loader für Moonlight Website
// Lädt automatisch alle Bilder und Videos aus der generierten gallery-data.json

async function loadGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) {
        console.log('Gallery grid not found on this page');
        return;
    }

    try {
        // JSON-Datei laden
        const response = await fetch('assets/galerie/gallery-data.json');
        
        if (!response.ok) {
            throw new Error('Gallery data not found. Run generate-gallery.py first!');
        }
        
        const data = await response.json();
        
        // Galerie leeren (bestehende hardcodierte Items entfernen)
        galleryGrid.innerHTML = '';
        
        // Alle Items kombinieren und sortieren (neueste zuerst)
        const allItems = [...data.images, ...data.videos].sort((a, b) => {
            return new Date(b.modified) - new Date(a.modified);
        });
        
        // Items generieren
        allItems.forEach((item, index) => {
            const galleryItem = createGalleryItem(item, index);
            galleryGrid.appendChild(galleryItem);
        });
        
        console.log(`✅ Gallery loaded: ${data.stats.image_count} images, ${data.stats.video_count} videos`);
        
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ff0080;">
                <h3>⚠️ Galerie konnte nicht geladen werden</h3>
                <p>Bitte führe <code>python generate-gallery.py</code> aus.</p>
            </div>
        `;
    }
}

function createGalleryItem(item, index) {
    const div = document.createElement('div');
    
    // Jedes 5. Item wird breiter (gallery-item-wide)
    const isWide = (index + 1) % 5 === 0;
    div.className = item.type === 'video' ? 'gallery-item gallery-video' : 
                   isWide ? 'gallery-item gallery-item-wide' : 'gallery-item';
    
    if (item.type === 'image') {
        // Bild-Element
        div.innerHTML = `
            <img src="${item.path}" alt="Moonlight Lounge - ${item.filename}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-caption">
                    <h3>Moonlight Lounge</h3>
                    <p>Einzigartige Momente</p>
                </div>
            </div>
        `;
    } else {
        // Video-Element
        div.innerHTML = `
            <video muted loop playsinline>
                <source src="${item.path}" type="video/${item.path.split('.').pop()}">
                Dein Browser unterstützt keine Videos.
            </video>
            <div class="gallery-overlay">
                <div class="gallery-caption">
                    <h3>Moonlight Lounge</h3>
                    <p>Einzigartige Momente</p>
                </div>
            </div>
            <div class="video-play-icon">▶</div>
        `;
        
        // Video hover/click events
        const video = div.querySelector('video');
        const playIcon = div.querySelector('.video-play-icon');
        
        div.addEventListener('mouseenter', () => {
            video.play();
            playIcon.style.opacity = '0';
        });
        
        div.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            playIcon.style.opacity = '1';
        });
        
        div.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playIcon.style.opacity = '0';
            } else {
                video.pause();
                playIcon.style.opacity = '1';
            }
        });
    }
    
    return div;
}

// Gallery beim Laden der Seite initialisieren
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
} else {
    loadGallery();
}
