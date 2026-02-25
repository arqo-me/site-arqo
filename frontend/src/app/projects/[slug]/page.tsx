import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await fetchAPI('/projects', {
        filters: { slug: { $eq: slug } },
    });

    const project = data?.[0];

    return {
        title: project ? `${project.title} | ARQO Портфолио` : "Проект не найден",
        description: project?.description || "Проект ARQO.",
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;

    const { data } = await fetchAPI('/projects', {
        filters: { slug: { $eq: slug } },
        populate: ['service', 'employees']
    });

    const project = data?.[0];

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-light mb-8">Проект не найден</h1>
                <Link href="/projects" className="border-b border-black pb-1 uppercase tracking-widest text-sm">Вернуться к портфолио</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            <header className="fixed top-0 left-0 right-0 z-50 text-foreground mix-blend-difference invert">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-light tracking-[0.2em] uppercase">ARQO</Link>
                    <nav className="hidden md:flex gap-12 text-sm uppercase tracking-widest font-light">
                        <Link href="/projects" className="flex items-center gap-2 hover:opacity-70 transition-opacity"><ArrowLeft className="w-4 h-4" /> Назад к проектам</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto relative z-10 pt-16">

                {/* HERO TITLE & INFO */}
                <div className="px-6 mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-black pb-12">
                    <div className="max-w-4xl">
                        <div className="text-sm font-medium tracking-widest text-muted mb-8 uppercase flex gap-4">
                            <span>ARQO / Портфолио</span>
                            <span className="opacity-40">{project.location}</span>
                        </div>
                        <h1 className="text-[6vw] md:text-[5vw] leading-[0.9] font-light tracking-tighter uppercase mb-12">
                            {project.title}
                        </h1>
                        <p className="text-2xl font-light leading-relaxed text-foreground/80 max-w-3xl">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end min-w-[320px]">
                        <div className="text-xs font-medium tracking-[0.2em] text-muted mb-8 uppercase">Сводка по объекту</div>
                        <div className="w-full border-t border-black pt-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted uppercase tracking-widest">Услуга</span>
                                <span className="text-lg font-light tracking-tight">{project.service?.title || 'Архитектура и ремонт'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted uppercase tracking-widest">Объем работ</span>
                                <span className="text-lg font-light tracking-tight">{project.scope}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted uppercase tracking-widest">Сроки</span>
                                <span className="text-lg font-light tracking-tight">{project.timeline}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN IMAGE FULL BLEED */}
                {project.mainImage && (
                    <div className="w-full h-screen mb-24 bg-black/5">
                        <img
                            src={project.mainImage}
                            alt={`${project.title} Main`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* ARCHITECTURAL GALLERY */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                        {project.gallery.map((imgUrl: string, index: number) => (
                            <div key={index} className={`relative aspect-square w-full bg-black/5 overflow-hidden ${index === 0 ? 'md:aspect-video md:col-span-2' : ''}`}>
                                <img
                                    src={imgUrl}
                                    alt={`${project.title} Gallery Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Team Members Section */}
                {project.employees && project.employees.length > 0 && (
                    <section className="px-6 pt-24 border-t border-black/10">
                        <div className="text-sm font-medium tracking-widest text-muted mb-12 uppercase">Команда проекта</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {project.employees.map((emp: any) => (
                                <Link href={`/team/${emp.slug}`} key={emp.documentId} className="group flex flex-col gap-4 border-l border-black pl-6 hover:opacity-100 transition-opacity">
                                    <h3 className="text-xl font-medium tracking-tight uppercase group-hover:underline underline-offset-4">{emp.name}</h3>
                                    <div className="text-xs uppercase tracking-widest text-muted">{emp.role}</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="px-6 mt-32 pt-12 border-t border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="text-2xl font-light tracking-tight uppercase">Хотите подобный интерьер?</div>
                    <button className="flex items-center gap-4 group cursor-pointer w-full md:w-auto">
                        <span className="text-sm uppercase tracking-[0.2em] font-medium border-b border-black pb-1 transition-all">Обсудить ваш проект</span>
                        <div className="w-16 h-16 rounded-full border border-black flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                            <ArrowRight strokeWidth={1} className="w-6 h-6" />
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
}
