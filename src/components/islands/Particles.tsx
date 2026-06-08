import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

// Themed tsparticles constellation for the hero background.
// Skipped entirely on small screens and when reduced motion is preferred.
// Hover detection is on the window, and the canvas is pointer-events:none,
// so it never blocks clicks on the hero content.
export default function HeroParticles() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window.innerWidth < 768) return;

    setEnabled(true);
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 80, density: { enable: true } },
        color: { value: ['#7c3aed', '#06b6d4'] },
        links: { enable: true, distance: 140, color: '#06b6d4', opacity: 0.25, width: 1 },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: true,
          outModes: { default: 'out' },
        },
        opacity: { value: 0.5 },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: { enable: true, mode: 'repulse' },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
        },
      },
    }),
    []
  );

  if (!enabled || !ready) return null;

  return (
    <Particles
      id="hero-particles"
      options={options}
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
