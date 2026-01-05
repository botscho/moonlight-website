#!/usr/bin/env python3
"""
Moonlight Lounge - Automatische Galerie-Aktualisierung
Wirft einfach neue Bilder/Videos in assets/galerie/ und führe dieses Script aus!
"""

import os
from pathlib import Path

# Unterstützte Dateitypen
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov'}

# Pfade
GALLERY_FOLDER = Path('assets/galerie')
HTML_FILE = Path('galerie.html')

def get_media_files():
    """Liest alle Bild- und Videodateien aus dem Galerie-Ordner"""
    media_files = []
    
    if not GALLERY_FOLDER.exists():
        print(f"❌ Ordner {GALLERY_FOLDER} nicht gefunden!")
        return media_files
    
    for file in sorted(GALLERY_FOLDER.iterdir()):
        if file.is_file():
            ext = file.suffix.lower()
            if ext in IMAGE_EXTENSIONS:
                media_files.append(('image', file.name))
            elif ext in VIDEO_EXTENSIONS:
                media_files.append(('video', file.name))
    
    return media_files

def generate_gallery_html(media_files):
    """Generiert den HTML-Code für die Galerie"""
    html_items = []
    
    for i, (media_type, filename) in enumerate(media_files):
        # Jedes 5. Bild wird breiter dargestellt (gallery-item-wide)
        wide_class = ' gallery-item-wide' if (i + 1) % 5 == 0 else ''
        
        if media_type == 'image':
            html = f'''                <!-- Bild {i+1} -->
                <div class="gallery-item{wide_class}">
                    <img src="assets/galerie/{filename}" alt="Moonlight Lounge - {filename}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-caption">
                            <h3>Moonlight Lounge</h3>
                            <p>Einzigartige Momente</p>
                        </div>
                    </div>
                </div>
'''
        else:  # video
            html = f'''                <!-- Video {i+1} -->
                <div class="gallery-item{wide_class}">
                    <video src="assets/galerie/{filename}" controls loading="lazy">
                        Ihr Browser unterstützt keine Videos.
                    </video>
                    <div class="gallery-overlay">
                        <div class="gallery-caption">
                            <h3>Moonlight Lounge</h3>
                            <p>Video</p>
                        </div>
                    </div>
                </div>
'''
        html_items.append(html)
    
    return '\n'.join(html_items)

def update_gallery_page(gallery_html):
    """Aktualisiert die galerie.html mit dem neuen Galerie-Code"""
    if not HTML_FILE.exists():
        print(f"❌ Datei {HTML_FILE} nicht gefunden!")
        return False
    
    # Lese die aktuelle HTML-Datei
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Finde den Galerie-Bereich (zwischen <!-- Galerie Grid --> und </div> vor Info-Box)
    start_marker = '            <!-- Galerie Grid -->\n            <div class="gallery-grid">'
    end_marker = '            </div>\n\n            <!-- Info-Box -->'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print("❌ Galerie-Bereich in HTML nicht gefunden!")
        print(f"Start gefunden: {start_idx != -1}, End gefunden: {end_idx != -1}")
        return False
    
    # Ersetze den Galerie-Inhalt
    new_content = (
        content[:start_idx + len(start_marker)] +
        '\n' + gallery_html +
        '            ' +  # Einrückung vor </div>
        content[end_idx:]
    )
    
    # Schreibe die aktualisierte Datei
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    print("🎨 Moonlight Lounge - Galerie-Aktualisierung")
    print("=" * 50)
    
    # Schritt 1: Medien-Dateien einlesen
    media_files = get_media_files()
    
    if not media_files:
        print("⚠️  Keine Bilder oder Videos in assets/galerie/ gefunden!")
        print("📂 Füge Dateien hinzu und führe das Script erneut aus.")
        return
    
    print(f"✅ {len(media_files)} Dateien gefunden:")
    for media_type, filename in media_files:
        icon = "🖼️" if media_type == 'image' else "🎬"
        print(f"   {icon} {filename}")
    
    # Schritt 2: HTML generieren
    print("\n📝 Generiere HTML...")
    gallery_html = generate_gallery_html(media_files)
    
    # Schritt 3: galerie.html aktualisieren
    print("💾 Aktualisiere galerie.html...")
    if update_gallery_page(gallery_html):
        print("\n🎉 Galerie erfolgreich aktualisiert!")
        print(f"📊 {len(media_files)} Medien-Elemente eingefügt")
        print("\n✨ Teste jetzt die Galerie im Live Server!")
    else:
        print("\n❌ Fehler beim Aktualisieren der Galerie")

if __name__ == '__main__':
    main()
