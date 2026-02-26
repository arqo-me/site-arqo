import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Команда экспертов ARQO",
    description: "Наши архитекторы, дизайнеры и руководители строительных проектов.",
};

export default async function TeamPage() {
    const { data: team } = await fetchAPI('/employees');

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24">
                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-light tracking-tighter uppercase mb-8 flex flex-col">
                        <span className="opacity-40 ml-[5%]">Эксперты</span>
                        <span>ARQO.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black">
                    {team && team.length > 0 ? team.map((employee: any, index: number) => (
                        <Link
                            href={`/team/${employee.slug}`}
                            key={employee.documentId}
                            className={`group flex flex-col p-12 hover:bg-foreground hover:text-background transition-colors duration-500 border-b border-black md:border-r ${index % 3 === 2 ? 'md:border-r-0' : ''}`}
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden mb-8 bg-black/5">
                                {employee.photoUrl && (
                                    <img
                                        src={employee.photoUrl}
                                        alt={employee.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                    />
                                )}
                            </div>

                            <div className="text-xs font-medium tracking-widest text-muted group-hover:text-background/70 mb-4 uppercase flex justify-between items-center">
                                <span>{employee.experience} Опыта</span>
                            </div>

                            <h2 className="text-3xl font-light mb-2 tracking-tight">{employee.name}</h2>
                            <div className="text-sm font-medium tracking-widest text-muted group-hover:text-background/70 uppercase">
                                {employee.role}
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-12 text-center text-muted">Сотрудники не найдены.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
