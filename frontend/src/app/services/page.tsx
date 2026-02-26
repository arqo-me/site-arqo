import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Услуги | ARQO",
    description: "Разработка дизайна интерьеров, премиальный ремонт квартир под ключ, комплектация и авторский надзор.",
};

export default async function ServicesPage() {
    const [servicesRes, citiesRes] = await Promise.all([
        fetchAPI('/services'),
        fetchAPI('/cities'),
    ]);
    const services = servicesRes?.data || [];
    const cities = citiesRes?.data || [];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24">
                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-light tracking-tighter uppercase mb-8 flex flex-col">
                        <span>Наши</span>
                        <span className="opacity-40 ml-[10%]">Услуги.</span>
                    </h1>
                    <p className="max-w-xl text-lg font-light leading-relaxed text-foreground/80 hairline-top pt-8 mt-12">
                        Полный цикл реализации интерьера премиального уровня: от архитектурной концепции и 3D-визуализации до финишного декорирования и интеграции "умного дома".
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-black">
                    {services && services.length > 0 ? services.map((service: any, index: number) => (
                        <Link
                            href={`/services/${service.slug}`}
                            key={service.documentId}
                            className={`group flex flex-col p-12 hover:bg-foreground hover:text-background transition-colors duration-500 border-b border-black md:border-r ${index % 3 === 2 ? 'md:border-r-0' : ''}`}
                        >
                            <div className="text-xs font-medium tracking-widest text-muted group-hover:text-background/70 mb-12 uppercase flex justify-between items-center">
                                <span>0{index + 1} / Направление</span>
                                <ArrowRight strokeWidth={1} className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-500" />
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-light mb-6 tracking-tight uppercase">{service.title}</h2>
                            <p className="text-sm opacity-70 mb-12 font-light leading-relaxed line-clamp-3">{service.seoDescription}</p>

                            <div className="flex justify-between items-end mt-auto pt-8">
                                <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-colors duration-500 shrink-0">
                                    <ArrowRight strokeWidth={1} className="w-5 h-5" />
                                </div>
                                <div className="text-sm tracking-tight font-medium text-right ml-4 uppercase">
                                    {service.pricingData?.basePrice || 'Индивидуально'}
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-12 text-center text-muted">Загрузка услуг... Убедитесь, что Strapi запущен.</div>
                    )}
                </div>

                {/* SEO Cross-Link Grid: Service × Geo */}
                {services.length > 0 && cities.length > 0 && (
                    <section className="mt-24 border-t border-black pt-16">
                        <h2 className="text-sm font-medium tracking-widest text-muted uppercase mb-10">Наши услуги по локациям Москвы</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                            {services.map((service: any) => (
                                <div key={service.documentId}>
                                    <h3 className="text-lg font-light tracking-tight uppercase mb-4">{service.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {cities.map((city: any) => (
                                            <Link
                                                href={`/services/${service.slug}/${city.slug}`}
                                                key={city.documentId}
                                                className="text-[10px] border border-black/20 px-3 py-1.5 uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
                                            >
                                                {city.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

