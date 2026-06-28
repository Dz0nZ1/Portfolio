import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Props {
  name: string;
  role: string;
  tagline: string;
  available: string;
  children?: ReactNode;
}

export default function HeroAnimation({ name, role, tagline, available, children }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.from('.hero-line', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.12,
      });
    },
    { scope: container }
  );

  const [first, ...rest] = name.split(' ');
  const last = rest.join(' ');

  return (
    <div ref={container}>
      <div className="hero-line inline-flex items-center gap-2 border-2 border-accent-2 px-3 py-1.5 mb-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping bg-accent-2 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 bg-accent-2"></span>
        </span>
        <span className="kicker text-accent-2">{available}</span>
      </div>

      <p className="hero-line kicker text-muted mb-4">{role}</p>

      <h1 className="hero-line font-display font-bold leading-[0.85] text-6xl sm:text-8xl lg:text-9xl uppercase">
        <span className="glitch block" data-text={first}>{first}</span>
        <span
          className="glitch block text-transparent"
          data-text={last}
          style={{ WebkitTextStroke: '2px var(--color-fg)' }}
        >
          {last}
        </span>
      </h1>

      <p className="hero-line text-muted text-base sm:text-lg mt-8 max-w-xl font-mono leading-relaxed">
        {tagline}
      </p>

      {children}
    </div>
  );
}
