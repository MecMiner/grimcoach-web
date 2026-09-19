import { Smile } from "lucide-react";

export default function Logo() {
    return (
        <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 rounded-xl"
        >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#3730A3] shadow-md shadow-[#4F46E5]/25 group-hover:scale-105 transition-transform duration-200">
            <Smile className="w-6 h-6 text-white transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-white"></span>
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
            <span className="text-[11px] font-medium text-slate-500 leading-tight">
                Mímica Facial & Biofeedback
            </span>
        </div>
    </a>
    );
}