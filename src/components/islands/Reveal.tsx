import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
}

export default function Reveal({ children }: Props) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.from(el.current, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 80%',
        },
      });
    },
    { scope: el }
  );

  return <div ref={el}>{children}</div>;
}
