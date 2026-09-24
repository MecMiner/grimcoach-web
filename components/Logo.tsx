// src/components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({ className = "", showSubtitle = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 rounded-2xl ${className}`}
    >
      <div className="relative">
        {/* Container que mantém a proporção 1:1 original da arte */}
        <div className="relative w-12 h-12 transition-transform duration-200 group-hover:scale-105">
          <Image
            src="/icon.jpg"
            alt="GrimCoach Mascote"
            fill
            sizes="48px"
            priority
            className="object-contain"
          />
        </div>

        {/* Indicador pulsante verde de status ativo */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981] border-2 border-white" />
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-[#0F172A]">
            Grim<span className="text-[#4F46E5]">Coach</span>
          </span>
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]">
            Beta
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 leading-tight">
            Mímica Facial & Biofeedback
          </span>
        )}
      </div>
    </Link>
  );
}