'use client';

import { HeaderProps, NavItem } from "@/types";
import { HeartHandshake, Menu, Smile, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";


export const Header: React.FC<HeaderProps> = ({ onOpenContributeModal }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks: NavItem[] = [
    { label: "O Projeto", href: "/#sobre" },
    { label: "Metodologia", href: "#metodologia" },
    { label: "Como Funciona", href: "#como-funciona", },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
        ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
        : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Logo/>
        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Ações Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Botão de Contribuição / Ajude-nos a melhorar */}
          <button
            type="button"
            onClick={onOpenContributeModal}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#4F46E5] bg-indigo-50/80 border border-indigo-200/70 hover:bg-indigo-100 hover:border-indigo-300 transition-all active:scale-95 shadow-sm"
          >
            <HeartHandshake className="w-4 h-4 text-[#4F46E5] group-hover:scale-110 transition-transform" />
            <span>Ajude-nos a melhorar</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4F46E5] text-white">
              Enviar Vídeo
            </span>
          </button>

          {/* CTA Principal de Acesso */}
          <a
            href="#comecar"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#F97316] hover:bg-orange-600 shadow-md shadow-[#F97316]/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Acessar App</span>
          </a>
        </div>

        {/* Gatilho Menu Mobile */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="p-2.5 rounded-xl text-[#0F172A] bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenContributeModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#4F46E5] bg-indigo-50 border border-indigo-200"
            >
              <HeartHandshake className="w-4 h-4 text-[#4F46E5]" />
              <span>Ajude-nos a melhorar (Enviar Vídeo)</span>
            </button>

            <a
              href="#comecar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#F97316] shadow-md shadow-[#F97316]/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Acessar App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
