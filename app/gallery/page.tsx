"use client"

import { useRouter } from 'next/navigation'

export const mockDatabase = [
  { id: "1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", message: "To the best couple ever! Wishing you a lifetime of happiness.", timestamp: "2 mins ago" },
  { id: "2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", message: "", timestamp: "15 mins ago" },
  { id: "3", imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", message: "The open bar is fantastic =))))))", timestamp: "1 hour ago" },
  { id: "4", imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80", message: "We are shutting this place down tonight!", timestamp: "2 hours ago" },
  { id: "5", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80", message: "", timestamp: "3 hours ago" },
  { id: "6", imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80", message: "Beautiful ceremony. So happy for you two.", timestamp: "4 hours ago" },
  { id: "7", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80", message: "Dancing shoes are officially on!", timestamp: "5 hours ago" }
]

export default function Gallery() {
  const router = useRouter()

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header">
        <h1>Gallery</h1>
        <button className="btn-secondary" onClick={() => router.push('/')}>&larr; Upload</button>
      </header>

      <div className="scroll-track">
        {mockDatabase.map((post) => (
          <div 
            key={post.id} 
            className="card" 
            style={{ cursor: 'pointer' }} 
            onClick={() => router.push(`/gallery/${post.id}`)}
          >
            <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#000', pointerEvents: 'none', userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
              <img 
                src={post.imageUrl} 
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
        ))}
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