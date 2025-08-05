export default function Solution() {
  return (
    <section id="solution-section" className="bg-black text-white h-screen px-6 md:px-12 flex items-center font-mono">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">
            Claims that take days<br />
            Now take minutes.
          </h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Insurance claims often get delayed due to manual processing, disconnected systems,
            and fragmented documentation. Our AI tool automates claim intake, document analysis, and
            decision-making so insurers can focus on what matters most: the customer.
          </p>
        </div>

        {/* Right: Video Graph */}
        <div className="flex justify-center items-center">
          <div className="w-full h-[300px] md:h-[400px] bg-white/5 rounded-xl flex items-center justify-center text-white/30 text-sm">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full rounded-xl"
            >
              <source src="/time.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}