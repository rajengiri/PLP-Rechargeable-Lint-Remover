export function ReelSection() {
  return (
    <section id="demo" className="overflow-hidden bg-ink px-5 py-20 text-white sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="eyebrow !text-[#f2a979]">See it in action</span>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            A satisfying refresh in a few simple passes.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
            Watch the uploaded product demonstration. The video stays paused until you choose to play it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/75">
            <span className="rounded-full border border-white/15 px-4 py-2">Click to play</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Sound controlled by you</span>
            <span className="rounded-full border border-white/15 px-4 py-2">No autoplay</span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="phone-shell">
            <video
              className="phone-screen"
              controls
              preload="metadata"
              playsInline
              poster="/images/lint-remover-quiet.png"
              aria-label="Lint remover product demonstration"
            >
              <source src="/videos/lint-remover-demo.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
