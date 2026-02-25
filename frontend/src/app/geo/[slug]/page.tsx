import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await fetchAPI('/cities', {
        filters: { slug: { $eq: slug } },
    });
    const city = data?.[0];
    return {
        title: city ? `Элитный дизайн и ремонт: ${city.name} | ARQO` : "Локация не найдена",
        description: city?.seoText || "ARQO — лидер премиального ремонта и архитектуры.",
    };
}

export default async function GeoLandingPage({ params }: Props) {
    const { slug } = await params;

    const [cityRes, servicesRes, projectsRes] = await Promise.all([
        fetchAPI('/cities', { filters: { slug: { $eq: slug } } }),
        fetchAPI('/services'),
        fetchAPI('/projects', { populate: ['service'] }) // fetch all, ideally filter by city later
    ]);

    const city = cityRes.data?.[0];
    const services = servicesRes.data;
    const projects = projectsRes.data?.slice(0, 4); // Limit to 4 for the landing page grid

    if (!city) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-light mb-8">Локация не найдена</h1>
                <Link href="/" className="border-b border-black pb-1 uppercase tracking-widest text-sm">На главную</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            <header className="fixed top-0 left-0 right-0 z-50 text-foreground mix-blend-difference invert">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-light tracking-[0.2em] uppercase">ARQO</Link>
                    <nav className="hidden md:flex gap-12 text-sm uppercase tracking-widest font-light">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity"><ArrowLeft className="w-4 h-4" /> На главную</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto relative z-10 pt-16">
                {/* Hyperlocal Hero */}
                <div className="px-6 mb-24 border-b border-black pb-16">
                    <div className="text-sm font-medium tracking-widest text-muted mb-8 uppercase flex gap-4">
                        <span>Архитектура & Дизайн</span>
                        <span className="opacity-40">{city.name}</span>
                    </div>
                    <h1 className="text-[7vw] md:text-[6vw] leading-[0.9] font-light tracking-tighter uppercase mb-12 max-w-5xl">
                        Премиальный интерьер <br />
                        <span className="opacity-50">в {city.name}</span>
                    </h1>
                    <p className="text-2xl font-light leading-relaxed text-foreground/80 max-w-3xl">
                        {city.seoText}
                    </p>
                </div>

                {/* Proof of Work - Local Projects (Mockup) */}
                <section className="px-6 mb-32">
                    <h2 className="text-3xl font-light tracking-tight uppercase mb-12">Реализованные объекты ARQO</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects && projects.map((project: any) => (
                            <Link href={`/projects/${project.slug}`} key={project.documentId} className="group block mb-8">
                                <div className="relative aspect-[4/3] w-full overflow-hidden mb-6 bg-black/5">
                                    {project.mainImage && (
                                        <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-light tracking-tight transition-colors group-hover:underline underline-offset-4">{project.title}</h3>
                                <div className="text-sm text-muted uppercase tracking-widest mt-2">{project.location}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Call to Action specific to Location */}
                <div className="px-6 py-24 bg-black text-white text-center">
                    <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-8">Планируете ремонт в {city.name}?</h2>
                    <p className="text-lg opacity-70 mb-12 max-w-2xl mx-auto font-light">Запишитесь на встречу с нашими архитекторами. Мы проконсультируем по планировкам и техническим регламентам ваших жилых комплексов.</p>
                    <Link href="/contacts" className="inline-block border border-white px-8 py-4 uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-colors duration-500">
                        Обсудить проект
                    </Link>
                </div>
            </main>
        </div>
    );
}
