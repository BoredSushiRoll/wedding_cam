"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

export default function Home() {
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('') // The new state variable
  const [pin, setPin] = useState('')
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // The hardware lock

  // Pointers to the hidden file inputs
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation checks
    if (!hasAgreed) return alert("You must agree to the terms first.")
    if (!file) return alert("Take a photo or choose one from your gallery.")
    if (pin !== '1209') return alert("Invalid PIN.")
    if (isUploading) return // Failsafe for rapid double-clicking

    // Lock the UI
    setIsUploading(true)

    try {
      // THE COMPRESSION ENGINE
      const options = {
        maxSizeMB: 3, 
        maxWidthOrHeight: 1920, 
        useWebWorker: true, 
      }
      
      const compressedFile = await imageCompression(file, options)

      // Build the payload with the crushed file
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('message', message)
      formData.append('signature', signature) // Pushing signature to backend
      formData.append('pin', pin)

      // Transmit to Vercel
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      
      if (res.ok) {
        router.push('/gallery')
      } else {
        alert("Access Denied.")
        setIsUploading(false) 
      }
    } catch (err) {
      console.error(err)
      alert("Network transmission or compression failed.")
      setIsUploading(false)
    }
  }

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>Wedding Cam</h1>
        <button 
          className="btn-secondary" 
          onClick={() => router.push('/gallery')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          Gallery
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
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

          {/* DUAL-INPUT UI BLOCK */}
          <div style={{ display: 'flex', gap: '12px', opacity: hasAgreed ? 1 : 0.5, pointerEvents: hasAgreed ? 'auto' : 'none' }}>
            
            {/* Camera Trigger */}
            <div 
              className="card" 
              onClick={() => cameraInputRef.current?.click()}
              style={{ flex: 1, height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>Camera</span>
            </div>

            {/* Gallery Trigger */}
            <div 
              className="card" 
              onClick={() => galleryInputRef.current?.click()}
              style={{ flex: 1, height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>Gallery</span>
            </div>

          </div>

          {/* Filename Readout */}
          {file && (
            <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontSize: '13px', fontWeight: 'bold' }}>
              Selected: {file.name}
            </div>
          )}

          {/* HIDDEN HARDWARE INPUTS */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" // iOS/Android OS Camera intercept
            style={{ display: 'none' }} 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            accept="image/*" // OS Gallery picker
            style={{ display: 'none' }} 
            ref={galleryInputRef} 
            onChange={handleFileChange} 
          />
          {/* END DUAL-INPUT BLOCK */}

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Message</label>
            <textarea className="input-field" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={250} rows={3} style={{ resize: 'none', marginTop: '8px' }} placeholder="Write something nice..."/>
          </div>

          {/* SIGNATURE BLOCK */}
          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Signature (Optional)</label>
            <input type="text" className="input-field" value={signature} onChange={(e) => setSignature(e.target.value)} maxLength={50} style={{ marginTop: '8px' }} placeholder="Your name(s)..."/>
          </div>

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Table PIN</label>
            <input type="password" className="input-field pin-input" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} style={{ marginTop: '8px' }}/>
          </div>

        </form>
      </div>

      <footer className="glass-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={!hasAgreed || isUploading} // Locks button physically
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
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
              color: 'rgba(255, 255, 255, 0.7)', 
              textShadow: '0px 1px 4px rgba(0,0,0,0.9)', 
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