import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Props {
  name: string;
  role: string;
  tagline: string;
  children?: ReactNode;
}

export default function HeroAnimation({ name, role, tagline, children }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.from('.hero-line', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <p className="hero-line text-accent-2 font-display tracking-widest uppercase text-sm">{role}</p>
      <h1 className="hero-line text-5xl sm:text-7xl font-bold mt-4 bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
        {name}
      </h1>
      <p className="hero-line text-muted text-lg mt-6 max-w-xl">{tagline}</p>
      {children}
    </div>
  );
}
