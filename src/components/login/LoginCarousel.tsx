"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    img: "/images/austral-logo.png",
    title: "Bienvenido a Austral Seguros",
    desc: "Gestión moderna y segura para tus clientes y pólizas.",
  },
  {
    img: "/images/austral-logo.png",
    title: "Automatiza tu trabajo",
    desc: "Herramientas inteligentes para brokers y equipos comerciales.",
  },
  {
    img: "/images/austral-logo.png",
    title: "Soporte y acompañamiento",
    desc: "Nuestro equipo te ayuda a crecer y digitalizar tu negocio.",
  },
];

export function LoginCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Autoplay logic
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Update selected index for dots
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      <div className="flex-1 flex flex-col justify-center w-full">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-full max-w-2xl px-8 py-16">
            <div ref={emblaRef} className="overflow-hidden rounded-3xl">
              <div className="flex">
                {SLIDES.map((slide, i) => (
                  <div
                    className="min-w-0 flex-[0_0_100%] flex flex-col items-center justify-center gap-8 p-12"
                    key={i}
                  >
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg"
                    />
                    <h3 className="text-3xl font-extrabold text-blue-900 text-center drop-shadow-sm tracking-tight">
                      {slide.title}
                    </h3>
                    <p className="text-lg text-gray-700 text-center max-w-md">
                      {slide.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full border border-blue-400 transition-all duration-200 ${
                    selectedIndex === i ? "bg-blue-600" : ""
                  }`}
                  onClick={() => emblaApi && emblaApi.scrollTo(i)}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
