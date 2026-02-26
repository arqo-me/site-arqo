'use client';

import Link from 'next/link';
import { useModal } from './ModalContext';

export default function Header() {
    const { openModal } = useModal();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 text-foreground mix-blend-difference invert pointer-events-none">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between pointer-events-auto">
                <Link href="/" className="text-3xl font-light tracking-[0.2em] uppercase">ARQO</Link>
                <div className="flex items-center gap-12">
                    <nav className="hidden lg:flex gap-12 text-sm uppercase tracking-widest font-light">
                        <Link href="/projects" className="hover:opacity-70 transition-opacity">Проекты</Link>
                        <Link href="/services" className="hover:opacity-70 transition-opacity">Услуги</Link>
                        <Link href="/team" className="hover:opacity-70 transition-opacity">О нас</Link>
                        <Link href="/blog" className="hover:opacity-70 transition-opacity">Журнал</Link>
                        <Link href="/contacts" className="hover:opacity-70 transition-opacity">Контакты</Link>
                    </nav>
                    <button
                        onClick={openModal}
                        className="hidden md:block py-2 px-5 border border-black/20 hover:border-black text-xs uppercase tracking-[0.1em] transition-colors rounded-full"
                    >
                        Оставить заявку
                    </button>
                </div>
            </div>
        </header>
    );
}
