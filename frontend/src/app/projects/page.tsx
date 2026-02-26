import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Портфолио проектов | ARQO",
    description: "Реализованные проекты по дизайну и ремонту квартир премиум-класса от компании ARQO в лучших ЖК Москвы.",
};

export default async function ProjectsPage() {
    const { data: projects } = await fetchAPI('/projects', {
        populate: ['service']
    });

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24">
                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-light tracking-tighter uppercase mb-8 flex flex-col">
                        <span>Наши</span>
                        <span className="opacity-40 ml-[10%]">Проекты.</span>
                    </h1>
                    <p className="max-w-xl text-lg font-light leading-relaxed text-foreground/80 hairline-top pt-8 mt-12">
                        Каждый проект ARQO — это воплощение архитектурной точности и безупречного вкуса. Изучите наши избранные работы в премиальных локациях Москвы.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
                    {projects && projects.length > 0 ? projects.map((project: any, index: number) => (
                        <Link
                            href={`/projects/${project.slug}`}
                            key={project.documentId}
                            className={`group flex flex-col p-12 hover:bg-foreground hover:text-background transition-colors duration-500 border-b border-black md:border-r ${index % 2 === 1 ? 'md:border-r-0' : ''}`}
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden mb-12 bg-black/5">
                                {project.mainImage && (
                                    <img
                                        src={project.mainImage}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                    />
                                )}
                            </div>

                            <div className="text-xs font-medium tracking-widest text-muted group-hover:text-background/70 mb-8 uppercase flex justify-between items-center">
                                <span>{project.location}</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-light mb-6 tracking-tight leading-none">{project.title}</h2>
                            <p className="text-sm opacity-70 mb-8 font-light leading-relaxed line-clamp-2">{project.description}</p>

                            <div className="mt-8 flex gap-2">
                                <span className="text-[10px] border border-current px-3 py-1 uppercase tracking-widest">
                                    {project.timeline}
                                </span>
                            </div>

                            <div className="flex justify-between items-end mt-auto pt-16">
                                <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-colors duration-500 shrink-0">
                                    <ArrowRight strokeWidth={1} className="w-6 h-6" />
                                </div>
                                <div className="text-sm tracking-tight font-medium text-right ml-4 uppercase">
                                    {project.service?.title || 'Архитектура и ремонт'}
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-12 text-center text-muted">Проекты не найдены.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
