import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
    title: "Контакты | ARQO Москва",
    description: "Свяжитесь с нами для обсуждения вашего дизайн-проекта или элитного ремонта в Москве.",
};

export default function ContactsPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24">
                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-light tracking-tighter uppercase mb-8 flex flex-col">
                        <span>Наши</span>
                        <span className="opacity-40 ml-[10%]">Офисы.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 border-t border-black pt-24">

                    {/* INFO COLUMN */}
                    <div className="flex flex-col gap-16">
                        <div>
                            <h2 className="text-3xl font-light uppercase tracking-tight mb-8 flex items-center gap-4">
                                <MapPin className="w-8 h-8 opacity-50" />
                                Штаб-квартира
                            </h2>
                            <p className="text-xl font-light leading-relaxed">
                                Москва, Пресненская наб., 12<br />
                                БЦ «Федерация», Башня Восток, 45 этаж
                            </p>
                        </div>

                        <div className="h-px border-b border-black/10 border-dashed w-full" />

                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-widest text-muted">Телефон для связи</span>
                                <a href="tel:+74950000000" className="text-2xl font-light tracking-widest hover:underline">+7 (495) 000-00-00</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs uppercase tracking-widest text-muted">Почта (Проекты и тендеры)</span>
                                <a href="mailto:hello@arqostudio.ru" className="text-2xl font-light tracking-widest hover:underline">hello@arqostudio.ru</a>
                            </div>
                        </div>

                        <div className="h-px border-b border-black/10 border-dashed w-full" />

                        <div>
                            <span className="text-xs uppercase tracking-widest text-muted flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4" /> Часы работы
                            </span>
                            <p className="font-light">Пн-Пт: 10:00 - 19:00<br />По предварительной записи</p>
                        </div>
                    </div>

                    {/* FORM COLUMN */}
                    <div className="bg-black text-white p-12 md:p-16">
                        <h3 className="text-4xl font-light uppercase mb-12 tracking-tight">Начать проект</h3>
                        <form className="flex flex-col gap-12">
                            <div className="relative">
                                <input type="text" id="name" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 text-white font-light text-xl pt-4 pb-2 focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                                <label htmlFor="name" className="absolute left-0 top-4 text-white/50 text-sm uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">Ваше имя</label>
                            </div>

                            <div className="relative">
                                <input type="tel" id="phone" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 text-white font-light text-xl pt-4 pb-2 focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                                <label htmlFor="phone" className="absolute left-0 top-4 text-white/50 text-sm uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">Номер телефона</label>
                            </div>

                            <div className="relative">
                                <input type="text" id="object" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 text-white font-light text-xl pt-4 pb-2 focus:outline-none focus:border-white transition-colors placeholder-transparent" />
                                <label htmlFor="object" className="absolute left-0 top-4 text-white/50 text-sm uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">Название ЖК / Локация</label>
                            </div>

                            <button type="submit" className="flex items-center gap-4 group mt-12 w-max cursor-pointer">
                                <span className="text-sm uppercase tracking-[0.2em] font-medium border-b border-white pb-1 transition-all">Отправить заявку</span>
                                <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500">
                                    <ArrowRight strokeWidth={1} className="w-6 h-6" />
                                </div>
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}
