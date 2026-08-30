"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [pin, setPin] = useState('')
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAgreed) return alert("You must agree to the terms first.")
    if (!file) return alert("Take a photo or choose one from your gallery.")
    if (pin !== '1209') return alert("Invalid PIN.")

    const formData = new FormData()
    formData.append('file', file)
    formData.append('message', message)
    formData.append('pin', pin)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) router.push('/gallery')
      else alert("Access Denied.")
    } catch (err) {
      alert("Network transmission failed.")
    }
  }

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header">
        <h1>Wedding Cam</h1>
        <button className="btn-secondary" onClick={() => router.push('/gallery')}>
          Gallery &rarr;
        </button>
      </header>

      <div className="scroll-track" style={{ justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <label className="card" style={{ padding: '16px', display: 'flex', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={hasAgreed} onChange={(e) => setHasAgreed(e.target.checked)} style={{ transform: 'scale(1.2)', accentColor: 'var(--accent-green)' }}/>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              I agree to upload this photo to the newlyweds&apos; private drive and confirm I have the right to share it.
            </span>
          </label>

          <label className="card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', cursor: hasAgreed ? 'pointer' : 'not-allowed', opacity: hasAgreed ? 1 : 0.5 }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              {file ? file.name : "Tap to Camera or Gallery"}
            </span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={!hasAgreed}/>
          </label>

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Message</label>
            <textarea className="input-field" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={250} rows={3} style={{ resize: 'none', marginTop: '8px' }} placeholder="Write something nice..."/>
          </div>

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Table PIN</label>
            <input type="password" className="input-field pin-input" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} style={{ marginTop: '8px' }}/>
          </div>

        </form>
      </div>

      <footer className="glass-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={!hasAgreed}>
          Upload Photo
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