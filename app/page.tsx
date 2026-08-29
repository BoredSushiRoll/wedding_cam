"use client"

import { useState } from 'react'

export default function Home() {
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
    
    if (!hasAgreed) {
      alert("You must agree to the terms first.")
      return
    }
    if (!file) {
      alert("Take a photo or choose one from your gallery.")
      return
    }
    if (pin.length !== 4) {
      alert("Invalid PIN.")
      return
    }

    // Pack the data for HTTP transport
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);
    formData.append('pin', pin);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Payload hit the server successfully!");
        // Reset the UI for the next drunk guest
        setFile(null);
        setMessage('');
        setPin('');
        setHasAgreed(false);
      } else {
        alert(`Access Denied: ${data.error}`);
      }
    } catch (err) {
      alert("Network transmission failed.");
    }
  }

  return (
    <main className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 mt-10">
      <h1 className="text-2xl font-bold text-center text-white mb-6">Wedding Cam</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* The Consent Gate */}
        <label className="flex items-start gap-3 p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer">
          <input 
            type="checkbox" 
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 accent-green-500"
          />
          <span className="text-sm text-gray-300 leading-tight">
            I agree to upload this photo to the newlyweds&apos; private drive and confirm I have the right to share it.
          </span>
        </label>

        {/* Camera / File Picker */}
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${hasAgreed ? 'border-gray-500 hover:border-green-500 cursor-pointer bg-gray-900' : 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'}`}>
          <span className="text-gray-400 font-semibold px-4 text-center">
            {file ? file.name : "Tap to Camera or Gallery"}
          </span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={!hasAgreed}
          />
        </label>

        {/* Guest Message */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Message for the Newlyweds</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={250}
            rows={3}
            placeholder="Write something nice... (max 250 chars)"
            className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-green-500 resize-none"
          />
          <span className="text-xs text-right mt-1 text-gray-500">{message.length}/250</span>
        </div>

        {/* Security PIN */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Table PIN</label>
          <input 
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            placeholder="****"
            className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-center tracking-widest text-xl"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={!hasAgreed}
          className={`w-full py-3 mt-2 font-bold rounded-lg transition-colors ${hasAgreed ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          Upload Photo
        </button>

      </form>
    </main>
  )
}