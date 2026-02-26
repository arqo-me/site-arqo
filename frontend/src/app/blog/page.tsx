import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Блог по дизайну и архитектуре | ARQO",
    description: "Статьи от ведущих архитекторов и строителей ARQO о премиальном ремонте, дизайне интерьеров и комплектации.",
};

export default async function BlogIndexPage() {
    const { data: articles } = await fetchAPI('/articles', {
        populate: ['author']
    });

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            

            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24">
                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.85] font-light tracking-tighter uppercase mb-8 flex flex-col">
                        <span>Architectural</span>
                        <span className="opacity-40 ml-[10%]">Journal.</span>
                    </h1>
                    <p className="max-w-xl text-lg font-light leading-relaxed text-foreground/80 hairline-top pt-8 mt-12">
                        Авторский блог экспертов ARQO. Мы разбираем ошибки планировок, анализируем тренды минимализма и делимся секретами инженерных сетей умного дома.
                    </p>
                </div>

                <div className="flex flex-col border-t border-black border-b">
                    {articles && articles.map((article: any, index: number) => (
                        <Link href={`/blog/${article.slug}`} key={article.documentId} className={`group flex flex-col md:flex-row gap-8 justify-between items-start md:items-center py-12 px-8 hover:bg-black hover:text-white transition-colors duration-500 ${index !== 0 ? 'border-t border-black/10' : ''}`}>
                            <div className="max-w-3xl">
                                <h2 className="text-3xl lg:text-4xl font-light mb-6 tracking-tight leading-none group-hover:underline underline-offset-8">{article.title}</h2>
                                <p className="text-sm opacity-70 mb-4 font-light leading-relaxed line-clamp-2">{article.content?.replace(/<[^>]*>/g, '')}</p>

                                {article.author && (
                                    <div className="text-xs uppercase tracking-widest text-muted mt-6 flex items-center gap-4">
                                        От: {article.author.name} <span className="opacity-40">/ {article.author.role}</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 shrink-0">
                                <ArrowRight strokeWidth={1} className="w-6 h-6" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
