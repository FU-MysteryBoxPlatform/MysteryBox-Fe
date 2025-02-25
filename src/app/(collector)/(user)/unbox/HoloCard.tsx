"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HoloImageCard({ img }: { img?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const rotateX = (mousePosition.y / window.innerHeight - 0.5) * 30;
  const rotateY = (mousePosition.x / window.innerWidth - 0.5) * 30;

  return (
    <div>
      <div
        className="relative w-64 h-96 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <Image
          src={img ?? "/images/card.png"}
          alt="Holo card image"
          width={256}
          height={384}
          className="object-cover w-full h-full"
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0) 70%
            )`,
          }}
        ></div>
        <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      </div>
    </div>
  );
}
