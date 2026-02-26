'use client';

import { useModal } from './ModalContext';
import { ArrowRight } from "lucide-react";

type LeadButtonProps = {
    className?: string;
    text?: string;
    type?: 'default' | 'icon' | 'outline';
};

export default function LeadButton({ className = '', text = 'Обсудить проект', type = 'default' }: LeadButtonProps) {
    const { openModal } = useModal();

    if (type === 'icon') {
        return (
            <button onClick={openModal} className={`mt-8 flex items-center gap-4 group ${className}`}>
                <span className="text-sm uppercase tracking-[0.2em] font-medium border-b border-black pb-1 transition-all">
                    {text}
                </span>
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                    <ArrowRight strokeWidth={1} className="w-4 h-4" />
                </div>
            </button>
        );
    }

    if (type === 'outline') {
        return (
            <button onClick={openModal} className={`inline-block border px-8 py-4 uppercase tracking-[0.2em] text-sm transition-colors duration-500 ${className}`}>
                {text}
            </button>
        );
    }

    return (
        <button onClick={openModal} className={className}>
            {text}
        </button>
    );
}
