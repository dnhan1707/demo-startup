export default function Header() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-30">
      <nav className="flex items-center justify-between px-6 py-2 w-[90vw] max-w-5xl rounded-full backdrop-blur-sm bg-white/10 border border-white/20 shadow-md font-mono">
        <span className="text-white text-sm font-medium tracking-wide">
          AI Decision Tool
        </span>
        <button className="bg-white text-black text-sm px-4 py-1 border border-white/30 rounded-full hover:bg-black hover:text-white transition-colors duration-200">
          Request Demo
        </button>
      </nav>
    </header>
  );
}