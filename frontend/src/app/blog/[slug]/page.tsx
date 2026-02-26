import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await fetchAPI('/articles', {
        filters: { slug: { $eq: slug } },
    });
    const article = data?.[0];
    return {
        title: article ? `${article.title} | Блог ARQO` : "Статья не найдена",
        description: "Журнал об архитектуре и ремонте.",
    };
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    const { data } = await fetchAPI('/articles', {
        filters: { slug: { $eq: slug } },
        populate: ['author']
    });

    const article = data?.[0];

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-light mb-8">Статья не найдена</h1>
                <Link href="/blog" className="border-b border-black pb-1 uppercase tracking-widest text-sm">Читать журнал</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto max-w-4xl relative z-10 pt-16 px-6">
                <div className="text-xs font-medium tracking-widest text-muted mb-12 uppercase flex gap-4">
                    <span>Journal</span>
                    <span className="opacity-40">Статья</span>
                </div>

                <h1 className="text-5xl md:text-6xl leading-[1.1] font-light tracking-tight mb-16">
                    {article.title}
                </h1>

                {article.author && (
                    <div className="flex items-center gap-6 mb-16 border-t border-b border-black/10 py-6">
                        {article.author.photoUrl && (
                            <img src={article.author.photoUrl} alt={article.author.name} className="w-16 h-16 rounded-full object-cover grayscale" />
                        )}
                        <div>
                            <div className="text-sm uppercase tracking-widest font-medium">{article.author.name}</div>
                            <div className="text-xs text-muted mt-1 uppercase">{article.author.role}</div>
                        </div>
                    </div>
                )}

                <article
                    className="prose prose-lg prose-neutral max-w-none text-foreground/90 font-light leading-relaxed mb-32"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

            </main>
        </div>
    );
}
