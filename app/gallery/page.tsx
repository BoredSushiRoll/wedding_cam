"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

type Photo = {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
};

export default function Gallery() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) throw new Error("Fetch failed");
        
        const data = await response.json();
        setPhotos(data.items || []);
      } catch (error) {
        console.error("Failed to load gallery data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header">
        <h1>Gallery</h1>
        <button className="btn-secondary" onClick={() => router.push('/')}>&larr; Upload</button>
      </header>

      <div className="scroll-track" style={{ paddingTop: '40px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Accessing Ledger...</p>
          </div>
        ) : photos.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>No photos uploaded yet.</p>
          </div>
        ) : (
          photos.map((post) => (
            <div 
              key={post.id} 
              className="card" 
              style={{ cursor: 'pointer' }} 
              onClick={() => router.push(`/gallery/${post.id}`)}
            >
              <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#000', pointerEvents: 'none', userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`/api/image/${post.id}`} 
                  alt="Wedding moment" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  draggable="false" 
                />
              </div>
              
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
                {post.message && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '15px', lineHeight: '1.4', color: 'var(--text-main)' }}>
                    {post.message}
                  </p>
                )}
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, display: 'block', textAlign: 'left' }}>
                  {post.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="glass-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="btn-primary" onClick={() => router.push('/')}>
          Take Another Photo
        </button>
        
        {/* The Signature Link */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
          <a 
            href="https://www.instagram.com/rares_dragan/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none',
              color: 'rgba(255, 255, 255, 0.7)', 
              textShadow: '0px 1px 4px rgba(0,0,0,0.9)', 
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Made by Rareș Drăgan
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" x2="6" y1="2" y2="4" />
              <line x1="10" x2="10" y1="2" y2="4" />
              <line x1="14" x2="14" y1="2" y2="4" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  )
}