import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await fetchAPI('/employees', {
        filters: { slug: { $eq: slug } },
    });
    const profile = data?.[0];
    return {
        title: profile ? `${profile.name} — ${profile.role} | ARQO` : "Профиль эксперта",
        description: profile?.bio,
    };
}

export default async function EmployeeDetailPage({ params }: Props) {
    const { slug } = await params;

    const { data } = await fetchAPI('/employees', {
        filters: { slug: { $eq: slug } },
        populate: ['projects', 'services']
    });

    const profile = data?.[0];

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-light mb-8">Сотрудник не найден</h1>
                <Link href="/team" className="border-b border-black pb-1 uppercase tracking-widest text-sm">Назад к команде</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

                    {/* Left Column - Image */}
                    <div className="md:col-span-5 relative aspect-[3/4] w-full bg-black/5">
                        {profile.photoUrl && (
                            <img
                                src={profile.photoUrl}
                                alt={profile.name}
                                className="w-full h-full object-cover grayscale"
                            />
                        )}
                    </div>

                    {/* Right Column - Info */}
                    <div className="md:col-span-7 flex flex-col justify-center h-full">
                        <div className="text-sm font-medium tracking-widest text-muted mb-8 uppercase flex gap-4">
                            <span>ARQO / Эксперты</span>
                            <span className="opacity-40">{profile.role}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light leading-none tracking-tight uppercase mb-8">
                            {profile.name}
                        </h1>
                        <p className="text-xl font-light leading-relaxed text-foreground/80 max-w-2xl mb-12">
                            {profile.bio}
                        </p>

                        <div className="flex flex-col gap-1 border-t border-black pt-8 w-full max-w-sm">
                            <span className="text-xs text-muted uppercase tracking-widest">Профессиональный стаж</span>
                            <span className="text-2xl font-light tracking-tight">{profile.experience}</span>
                        </div>

                        {/* Associated Projects */}
                        {profile.projects && profile.projects.length > 0 && (
                            <div className="mt-16">
                                <h3 className="text-xs font-medium tracking-widest text-muted uppercase mb-6">Реализованные объекты</h3>
                                <ul className="flex flex-col gap-4">
                                    {profile.projects.map((proj: any) => (
                                        <li key={proj.documentId}>
                                            <Link href={`/projects/${proj.slug}`} className="text-xl font-light underline decoration-black/20 hover:decoration-black uppercase tracking-tight transition-colors">
                                                {proj.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
