"use client"

import { useRouter } from 'next/navigation'

// MOCK DATA (Exported so we don't have to rewrite it in the dynamic route)
export const mockDatabase = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    message: "To the best couple ever! Wishing you a lifetime of happiness.",
    timestamp: "2 mins ago"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    message: "", 
    timestamp: "15 mins ago"
  },
  {
    id: "3",
    // Swapped the broken URL from your screenshot with a working one
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
    message: "The open bar is fantastic =))))))",
    timestamp: "1 hour ago"
  }
]

export default function Gallery() {
  const router = useRouter()

  return (
    // h-[100dvh] locks the frame to the exact device height, ignoring mobile browser search bars
    <main className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-gray-900 border-x border-gray-800">
      
      {/* STICKY HEADER */}
      <header className="flex-none flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 shadow-md z-10">
        <h1 className="text-xl font-bold text-white">Guest Gallery</h1>
        <button 
          onClick={() => router.push('/')}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          &larr; Back to Upload
        </button>
      </header>

      {/* SCROLLABLE FEED (The Middle Track) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {mockDatabase.map((post) => (
          <div 
            key={post.id} 
            onClick={() => router.push(`/gallery/${post.id}`)}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl cursor-pointer hover:border-gray-500 transition-colors"
          >
            <div 
              className="relative w-full bg-black select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()} 
            >
              <img 
                src={post.imageUrl} 
                alt="Wedding moment" 
                className="w-full h-auto object-cover max-h-[60vh]"
                draggable="false"
              />
            </div>

            {post.message ? (
              <div className="p-4 bg-gray-900 border-t border-gray-700">
                <p className="text-gray-200 text-base">{post.message}</p>
                <span className="text-gray-500 text-xs mt-2 block">{post.timestamp}</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 flex justify-end">
                <span className="text-gray-600 text-xs">{post.timestamp}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* STICKY FOOTER */}
      <footer className="flex-none p-4 bg-gray-800 border-t border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-10">
        <button 
          onClick={() => router.push('/')}
          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors text-lg"
        >
          Take Another Photo
        </button>
      </footer>

    </main>
  )
}