"use client"

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

type Photo = {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
  signature?: string; 
};

export default function SinglePhotoView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [post, setPost] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSinglePhoto() {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        const found = data.items?.find((p: Photo) => p.id === resolvedParams.id);
        setPost(found || null);
      } catch (error) {
        console.error("Failed to fetch photo:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSinglePhoto();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}>
        Se preia poza...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
        Poza nu există în baza de date.
      </div>
    );
  }

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header">
        <h1 style={{ margin: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>Vizualizare</h1>
        <button 
          onClick={() => router.push('/gallery')}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Înapoi la Galerie
        </button>
      </header>

      <div className="scroll-track" style={{ justifyContent: 'center' }}>
        
        {/* THE POLAROID CARD */}
        <div className="card" style={{ 
          padding: '16px 16px 24px 16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          backgroundColor: 'var(--bg-card)' 
        }}>
          
          {/* The Photo (Tight Hug Frame - No more black bars) */}
          <div style={{ 
            pointerEvents: 'none', 
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'transparent'
          }} onContextMenu={(e) => e.preventDefault()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`/api/image/${post.id}`} 
              alt="Wedding moment" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '60vh', 
                width: 'auto', 
                height: 'auto', 
                objectFit: 'contain',
                borderRadius: '4px',
                border: '1px solid rgba(44, 58, 41, 0.1)', /* Subtle physical photo edge */
                display: 'block' 
              }} 
              draggable="false" 
            />
          </div>
          
          {/* The Ink (Resting on white cardstock) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(post.message || post.signature) && (
              <div style={{ borderLeft: '2px solid var(--accent-green)', paddingLeft: '12px' }}>
                {post.message && (
                  <p style={{ margin: '0 0 6px 0', fontSize: '16px', lineHeight: '1.5', fontStyle: 'italic', color: 'var(--text-main)' }}>
                    &quot;{post.message}&quot;
                  </p>
                )}
                {post.signature && (
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--accent-green)' }}>
                    — {post.signature}
                  </p>
                )}
              </div>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', textAlign: 'left' }}>
              {post.timestamp}
            </span>
          </div>

        </div>
      </div>

      <footer className="glass-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="btn-primary" onClick={() => router.push('/')}>
          Încarcă Altă Poză
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
              gap: '4px', 
              textDecoration: 'none',
              color: 'var(--text-muted)',
              textShadow: '0px 1px 2px rgba(255,255,255,0.5)', 
              fontSize: '10px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px', 
              fontWeight: 600,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span>Made by</span>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: 'var(--accent-green)', 
              textDecoration: 'underline', 
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px'
            }}>
              Rareș Drăgan
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                <line x1="6" x2="6" y1="2" y2="4" />
                <line x1="10" x2="10" y1="2" y2="4" />
                <line x1="14" x2="14" y1="2" y2="4" />
              </svg>
            </span>
          </a>
        </div>
      </footer>
    </main>
  )
}