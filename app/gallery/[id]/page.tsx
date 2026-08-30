"use client"

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

type Photo = {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
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
        // Scan the live database for the ID in the URL
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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px' }}>
        Accessing Ledger...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'var(--text-main)' }}>
        Photo not found in database.
      </div>
    );
  }

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header">
        <button 
          onClick={() => router.push('/gallery')}
          className="btn-secondary"
        >
          &larr; Back to Gallery
        </button>
      </header>

      <div className="scroll-track" style={{ justifyContent: 'center', padding: '80px 0 100px 0', backgroundColor: '#000' }}>
        <div style={{ pointerEvents: 'none', userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`/api/image/${post.id}`} 
            alt="Wedding moment" 
            style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', display: 'block' }} 
            draggable="false" 
          />
        </div>
        
        <div style={{ padding: '24px', backgroundColor: '#000' }}>
          {post.message && (
            <p style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: '1.6', borderLeft: '2px solid var(--accent-green)', paddingLeft: '16px', fontStyle: 'italic', color: 'var(--text-main)' }}>
              &quot;{post.message}&quot;
            </p>
          )}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', textAlign: 'left' }}>
            {post.timestamp}
          </span>
        </div>
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