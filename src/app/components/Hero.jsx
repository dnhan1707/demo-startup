export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden font-mono">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/industrial_video.mp4" type="video/mp4" />
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
          for Every Decision
        </h2>
      </div>
    </section>
  );
}