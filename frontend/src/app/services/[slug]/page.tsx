import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

// Next.js dynamic OpenGraph metadata
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await fetchAPI('/services', {
        filters: { slug: { $eq: slug } },
    });

    const service = data?.[0];

    return {
        title: service ? `${service.title} | Услуги ARQO` : "Услуга не найдена",
        description: service?.seoDescription || "Описание услуги недоступно.",
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;

    const { data } = await fetchAPI('/services', {
        filters: { slug: { $eq: slug } },
        populate: ['employees', 'projects']
    });

    const service = data?.[0];

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-light mb-8">Услуга не найдена</h1>
                <Link href="/services" className="border-b border-black pb-1 uppercase tracking-widest text-sm">Вернуться к списку услуг</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            <header className="fixed top-0 left-0 right-0 z-50 text-foreground mix-blend-difference invert">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-light tracking-[0.2em] uppercase">ARQO</Link>
                    <nav className="hidden md:flex gap-12 text-sm uppercase tracking-widest font-light">
                        <Link href="/services" className="flex items-center gap-2 hover:opacity-70 transition-opacity"><ArrowLeft className="w-4 h-4" /> Назад к услугам</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-black">
                    <div className="max-w-2xl">
                        <div className="text-sm font-medium tracking-widest text-muted mb-8 uppercase flex gap-4">
                            <span>ARQO / Направления</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light leading-none tracking-tight uppercase mb-8">
                            {service.title}
                        </h1>
                        <p className="text-xl font-light leading-relaxed text-foreground/80 max-w-xl">
                            {service.seoDescription}
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end min-w-[320px]">
                        <div className="text-xs font-medium tracking-[0.2em] text-muted mb-8 uppercase">Инвестиции в проект</div>
                        <div className="w-full border-t border-black pt-8 flex flex-col gap-6">

                            {/* Base Price */}
                            <div className="text-3xl font-light tracking-tight uppercase">{service.pricingData?.basePrice || 'По запросу'}</div>

                            {/* Features List */}
                            {service.pricingData?.features && service.pricingData.features.length > 0 && (
                                <ul className="flex flex-col gap-3 mt-4">
                                    {service.pricingData.features.map((feature: string, i: number) => (
                                        <li key={i} className="text-sm font-light leading-snug tracking-wide flex items-start gap-4">
                                            <span className="opacity-40 mt-1 uppercase text-xs">/</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Terms of payment */}
                            {service.pricingData?.terms && (
                                <div className="text-[10px] uppercase tracking-widest font-medium text-muted mt-8 mb-4 border-t border-black/10 pt-6">
                                    {service.pricingData.terms}
                                </div>
                            )}
                        </div>
                        <button className="mt-8 flex items-center gap-4 group">
                            <span className="text-sm uppercase tracking-[0.2em] font-medium border-b border-black pb-1 transition-all">Обсудить ваш проект</span>
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                                <ArrowRight strokeWidth={1} className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* RELATIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    {/* Projects utilizing this service */}
                    {service.projects && service.projects.length > 0 && (
                        <div>
                            <h3 className="text-xs font-medium tracking-widest text-muted uppercase mb-12">Реализованные объекты</h3>
                            <ul className="flex flex-col gap-8">
                                {service.projects.map((proj: any) => (
                                    <li key={proj.documentId} className="border-b border-black/10 pb-6 border-dashed">
                                        <Link href={`/projects/${proj.slug}`} className="flex justify-between items-center group">
                                            <span className="text-2xl font-light tracking-tight uppercase transition-colors">{proj.title}</span>
                                            <ArrowRight strokeWidth={1} className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Team Members */}
                    {service.employees && service.employees.length > 0 && (
                        <div>
                            <h3 className="text-xs font-medium tracking-widest text-muted uppercase mb-12">Эксперты направления</h3>
                            <ul className="flex flex-col gap-8">
                                {service.employees.map((emp: any) => (
                                    <li key={emp.documentId} className="border-b border-black/10 pb-6 border-dashed">
                                        <Link href={`/team/${emp.slug}`} className="flex justify-between items-center group">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-2xl font-light tracking-tight uppercase transition-colors">{emp.name}</span>
                                                <span className="text-xs uppercase tracking-widest text-muted">{emp.role}</span>
                                            </div>
                                            <ArrowRight strokeWidth={1} className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
