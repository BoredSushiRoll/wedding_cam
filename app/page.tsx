"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

export default function Home() {
  const router = useRouter()
  
  const [files, setFiles] = useState<File[]>([])
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('') 
  const [pin, setPin] = useState('')
  const [hasAgreed, setHasAgreed] = useState(false)
  
  const [isUploading, setIsUploading] = useState(false) 
  const [progressText, setProgressText] = useState("Încarcă Poza")

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      
      if (selected.length > 10) {
        alert("Poți selecta maxim 10 poze o dată.")
        setFiles(selected.slice(0, 10))
      } else {
        setFiles(selected)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasAgreed) return alert("Trebuie să fii de acord cu termenii.")
    if (files.length === 0) return alert("Selectează cel puțin o poză.")
    if (pin !== '1209') return alert("PIN incorect!")
    if (isUploading) return 

    setIsUploading(true)

    try {
      const options = {
        maxSizeMB: 3, 
        maxWidthOrHeight: 1920, 
        useWebWorker: false, // Keep this false to protect the mobile main thread
      }
      
      // PHASE 1: EAGER COMPRESSION 
      // Read all files NOW before the OS revokes the security token
      const compressedPayloads = []
      
      for (let i = 0; i < files.length; i++) {
        setProgressText(`Procesare... ${i + 1}/${files.length}`)
        const compressedFile = await imageCompression(files[i], options)
        compressedPayloads.push(compressedFile)
      }

      // PHASE 2: NETWORK TRANSMISSION
      // Send the safely compressed cache to Vercel
      for (let i = 0; i < compressedPayloads.length; i++) {
        setProgressText(`Încărcare... ${i + 1}/${compressedPayloads.length}`)
        
        const formData = new FormData()
        formData.append('file', compressedPayloads[i])
        formData.append('message', message)
        formData.append('signature', signature) 
        formData.append('pin', pin)
        
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        
        if (!res.ok) {
          throw new Error(`Upload failed for file ${i + 1}`)
        }

        // Tiny network breather
        if (i < compressedPayloads.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      // Circuit complete. Route to gallery.
      router.push('/gallery')
      
    } catch (err) {
      console.error("CRITICAL BATCH UPLOAD ERROR:", err)
      alert("A apărut o eroare la încărcare. Verifică conexiunea.")
      setIsUploading(false)
      setProgressText("Încarcă Poza")
    }
  }

  return (
    <main className="app-container animate-fade-in">
      <header className="glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>Crowd Cam</h1>
        <button 
          className="btn-secondary" 
          onClick={() => router.push('/gallery')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          Galerie
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
              Sunt de acord să încărc poza în drive-ul mirilor și confirm că dețin drepturile pentru poză.
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', opacity: hasAgreed ? 1 : 0.5, pointerEvents: hasAgreed ? 'auto' : 'none' }}>
            
            <div 
              className="card" 
              onClick={() => cameraInputRef.current?.click()}
              style={{ flex: 1, height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>Cameră Telefon</span>
            </div>

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
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>Galerie Telefon</span>
            </div>

          </div>

          {files.length > 0 && (
            <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontSize: '13px', fontWeight: 'bold' }}>
              Selectat: {files.length} {files.length === 1 ? 'poză' : 'poze'}
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            style={{ display: 'none' }} 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
          />
          <input 
            type="file" 
            accept="image/*" 
            multiple
            style={{ display: 'none' }} 
            ref={galleryInputRef} 
            onChange={handleFileChange} 
          />

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Mesaj Pentru Miri (Opțional)</label>
            <textarea className="input-field" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={250} rows={3} style={{ resize: 'none', marginTop: '8px' }} placeholder="Scrie aici mesajul..."/>
          </div>

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>Semnătură (Opțional)</label>
            <input type="text" className="input-field" value={signature} onChange={(e) => setSignature(e.target.value)} maxLength={50} style={{ marginTop: '8px' }} placeholder="Un nume, o poreclă, un inside joke..."/>
          </div>

          <div>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold' }}>PIN De La Masă</label>
            <input 
              type="password" 
              className="input-field pin-input" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = '____'}
              maxLength={4} 
              style={{ marginTop: '8px' }} 
              placeholder="____"
            />
          </div>

        </form>
      </div>

      <footer className="glass-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={!hasAgreed || isUploading} 
        >
          {isUploading ? progressText : "Încarcă Poza"}
        </button>
        
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