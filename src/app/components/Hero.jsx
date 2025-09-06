'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/industrial_video.mp4';
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Force play on mobile devices
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log('Autoplay failed:', error)
          // Fallback: try to play when user interacts
          const handleInteraction = async () => {
            try {
              await video.play()
              document.removeEventListener('touchstart', handleInteraction)
              document.removeEventListener('click', handleInteraction)
            } catch (err) {
              console.log('Manual play failed:', err)
            }
          }
          document.addEventListener('touchstart', handleInteraction)
          document.addEventListener('click', handleInteraction)
        }
      }
      
      // Try to play immediately
      playVideo()
    }
  }, [])
  
  return (
    <section className="relative h-screen w-full overflow-hidden font-mono">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Subtle Blur Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-5xl md:text-6xl font-medium tracking-tight">
          AI-Powered Automation
        </h1>
        <h2 className="text-white text-5xl md:text-6xl font-medium tracking-tight mt-2">
        for Insurance Claims Processing
        </h2>
      </div>
    </section>
  );
}