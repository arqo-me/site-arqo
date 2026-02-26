'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from './ModalContext';

export default function LeadModal() {
    const { isOpen, closeModal } = useModal();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStatus('idle');
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Мокируем отправку формы
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                closeModal();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            ></div>

            <div className="relative bg-background w-full max-w-lg p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={closeModal}
                    className="absolute top-6 right-6 text-foreground/50 hover:text-foreground transition-colors p-2"
                    aria-label="Закрыть"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="mb-10">
                    <h2 className="text-3xl font-light uppercase tracking-tight mb-3">Обсудить проект</h2>
                    <p className="text-foreground/60 font-light text-sm">
                        Оставьте свои контакты, и наш ведущий архитектор свяжется с вами для обсуждения деталей.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="py-12 text-center text-green-700 animate-in fade-in slide-in-from-bottom-4">
                        <svg className="w-16 h-16 mx-auto mb-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-2xl font-light uppercase mb-2">Заявка отправлена</h3>
                        <p className="text-sm font-light opacity-70 text-black">Мы свяжемся с вами в ближайшее время!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Ваше имя</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b border-black/20 pb-3 font-light focus:outline-none focus:border-black transition-colors"
                                placeholder="Иван Иванов"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Телефон</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-transparent border-b border-black/20 pb-3 font-light focus:outline-none focus:border-black transition-colors"
                                placeholder="+7 (999) 000-00-00"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Что нужно сделать?</label>
                            <textarea
                                rows={2}
                                className="w-full bg-transparent border-b border-black/20 pb-3 font-light focus:outline-none focus:border-black transition-colors resize-none"
                                placeholder="Например: дизайн проект квартиры 100 кв.м."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="mt-6 w-full py-4 bg-black text-white uppercase text-xs tracking-[0.2em] font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
                        </button>
                        <p className="text-[10px] text-muted text-center leading-relaxed">
                            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
