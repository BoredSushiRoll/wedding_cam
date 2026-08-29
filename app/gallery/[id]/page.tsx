"use client"

import { useRouter } from 'next/navigation'
import { mockDatabase } from '../page' // Pull the mock data from the parent gallery
import { use } from 'react' // React hook to unwrap the params promise

export default function SinglePhotoView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  
  // Next 15 requires unwrapping the params object using React.use()
  const resolvedParams = use(params)
  
  // Find the exact photo in the database
  const post = mockDatabase.find(p => p.id === resolvedParams.id)

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Photo not found</h1>
        <button onClick={() => router.push('/gallery')} className="text-green-500 underline">Go back</button>
      </div>
    )
  }

  return (
    <main className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-gray-900 border-x border-gray-800">
      
      {/* STICKY HEADER */}
      <header className="flex-none flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 shadow-md z-10">
        <button 
          onClick={() => router.push('/gallery')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          &larr; Back to Gallery
        </button>
      </header>

      {/* SINGLE IMAGE CONTAINER */}
      <div className="flex-1 overflow-y-auto bg-black flex flex-col justify-center">
        <div 
          className="relative w-full select-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()} 
        >
          <img 
            src={post.imageUrl} 
            alt="Wedding moment" 
            className="w-full h-auto object-contain max-h-[80vh]"
            draggable="false"
          />
        </div>
        
        {post.message && (
          <div className="p-6 bg-gray-900 border-t border-gray-700">
            <p className="text-gray-100 text-lg leading-relaxed">{post.message}</p>
            <span className="text-gray-500 text-sm mt-3 block">{post.timestamp}</span>
          </div>
        )}
      </div>

      {/* STICKY FOOTER */}
      <footer className="flex-none p-4 bg-gray-800 border-t border-gray-700 flex gap-4 z-10">
        <button 
          onClick={() => router.push('/')}
          className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
        >
          Take Another Photo
        </button>
      </footer>

    </main>
  )
}