#!/usr/bin/env python3
"""
Galerie-Generator für Moonlight Website
Scannt den assets/galerie/ Ordner und erstellt automatisch eine JSON-Datei
mit allen Bildern und Videos für die dynamische Galerie-Anzeige.
"""

import os
import json
from pathlib import Path
from datetime import datetime

# Konfiguration
GALLERY_DIR = "assets/galerie"
OUTPUT_FILE = "assets/galerie/gallery-data.json"
SUPPORTED_IMAGES = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
SUPPORTED_VIDEOS = {'.mp4', '.webm', '.mov'}

def get_file_info(filepath):
    """Extrahiert Dateiinformationen"""
    stat = os.stat(filepath)
    filename = os.path.basename(filepath)
    name_without_ext = os.path.splitext(filename)[0]
    
    # Datum aus Dateiname extrahieren (falls Format: YYYY-MM-DD-name.jpg)
    parts = name_without_ext.split('-')
    date_str = None
    if len(parts) >= 3:
        try:
            # Versuche Datum zu parsen
            datetime.strptime(f"{parts[0]}-{parts[1]}-{parts[2]}", "%Y-%m-%d")
            date_str = f"{parts[2]}.{parts[1]}.{parts[0]}"
        except:
            pass
    
    return {
        'filename': filename,
        'path': filepath.replace('\\', '/'),
        'size': stat.st_size,
        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
        'date': date_str,
        'title': name_without_ext.replace('-', ' ').replace('_', ' ').title()
    }

def scan_gallery_folder():
    """Scannt den Galerie-Ordner und kategorisiert Dateien"""
    gallery_path = Path(GALLERY_DIR)
    
    if not gallery_path.exists():
        print(f"❌ Fehler: Ordner '{GALLERY_DIR}' nicht gefunden!")
        return None
    
    images = []
    videos = []
    
    # Alle Dateien im Ordner durchgehen
    for file_path in sorted(gallery_path.iterdir()):
        if not file_path.is_file():
            continue
        
        ext = file_path.suffix.lower()
        
        if ext in SUPPORTED_IMAGES:
            info = get_file_info(str(file_path))
            info['type'] = 'image'
            images.append(info)
            print(f"📷 Bild gefunden: {info['filename']}")
            
        elif ext in SUPPORTED_VIDEOS:
            info = get_file_info(str(file_path))
            info['type'] = 'video'
            videos.append(info)
            print(f"🎥 Video gefunden: {info['filename']}")
    
    return {
        'generated': datetime.now().isoformat(),
        'total_items': len(images) + len(videos),
        'images': images,
        'videos': videos,
        'stats': {
            'image_count': len(images),
            'video_count': len(videos)
        }
    }

def save_gallery_data(data):
    """Speichert die Galerie-Daten als JSON"""
    output_path = Path(OUTPUT_FILE)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Galerie-Daten gespeichert: {OUTPUT_FILE}")
    print(f"📊 Statistik: {data['stats']['image_count']} Bilder, {data['stats']['video_count']} Videos")

def main():
    print("🎨 Moonlight Galerie-Generator")
    print("=" * 50)
    
    # Galerie scannen
    gallery_data = scan_gallery_folder()
    
    if gallery_data is None:
        return 1
    
    if gallery_data['total_items'] == 0:
        print("\n⚠️  Keine Bilder oder Videos gefunden!")
        print(f"Lege Dateien in '{GALLERY_DIR}' ab.")
        return 1
    
    # Daten speichern
    save_gallery_data(gallery_data)
    
    print("\n💡 Jetzt kannst du committen und pushen!")
    print("   git add .")
    print("   git commit -m \"Update gallery\"")
    print("   git push")
    
    return 0

if __name__ == "__main__":
    exit(main())
