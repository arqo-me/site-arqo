'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-16 px-6 mt-auto">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="text-4xl font-light tracking-[0.2em] uppercase block mb-6">ARQO</Link>
                    <p className="text-sm font-light opacity-60 max-w-xs">
                        Архитектурное бюро. Создаем премиальные пространства, продуманные до миллиметра.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="text-xs uppercase tracking-widest font-medium opacity-40 mb-6">Навигация</h4>
                    <ul className="flex flex-col gap-4 text-sm font-light">
                        <li><Link href="/projects" className="hover:opacity-70 transition-opacity">Проекты</Link></li>
                        <li><Link href="/services" className="hover:opacity-70 transition-opacity">Услуги</Link></li>
                        <li><Link href="/team" className="hover:opacity-70 transition-opacity">Команда</Link></li>
                        <li><Link href="/blog" className="hover:opacity-70 transition-opacity">Журнал</Link></li>
                        <li><Link href="/contacts" className="hover:opacity-70 transition-opacity">Контакты</Link></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="text-xs uppercase tracking-widest font-medium opacity-40 mb-6">Контакты</h4>
                    <ul className="flex flex-col gap-4 text-sm font-light">
                        <li>
                            <a href="tel:+74950000000" className="hover:opacity-70 transition-opacity text-lg">+7 (495) 000-00-00</a>
                        </li>
                        <li>
                            <a href="mailto:hello@arqo.me" className="hover:opacity-70 transition-opacity">hello@arqo.me</a>
                        </li>
                        <li className="opacity-60 mt-2">
                            Москва, Пресненская наб., 12<br />Башня Федерация
                        </li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="text-xs uppercase tracking-widest font-medium opacity-40 mb-6">Соцсети</h4>
                    <ul className="flex flex-col gap-4 text-sm font-light">
                        <li><a href="#" className="hover:opacity-70 transition-opacity flex items-center gap-3">Telegram</a></li>
                        <li><a href="#" className="hover:opacity-70 transition-opacity flex items-center gap-3">WhatsApp</a></li>
                        <li><a href="#" className="hover:opacity-70 transition-opacity flex items-center gap-3">Instagram</a></li>
                        <li><a href="#" className="hover:opacity-70 transition-opacity flex items-center gap-3">Behance</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-light opacity-40">
                <p>&copy; {new Date().getFullYear()} ARQO. Все права защищены.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:opacity-100 transition-opacity">Политика конфиденциальности</Link>
                </div>
            </div>
        </footer>
    );
}
