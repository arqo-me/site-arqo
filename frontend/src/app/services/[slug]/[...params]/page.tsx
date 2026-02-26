import { notFound } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LeadButton from '@/components/LeadButton';

export const revalidate = 10;

export async function generateStaticParams() {
    try {
        const [servicesData, categoriesData, citiesData] = await Promise.all([
            fetchAPI('/services', { fields: ['slug'] }),
            fetchAPI('/service-categories', { fields: ['slug'] }),
            fetchAPI('/cities', { fields: ['slug'] })
        ]);

        if (!servicesData?.data) return [];

        const params: any[] = [];

        servicesData.data.forEach((service: any) => {
            if (categoriesData?.data) {
                categoriesData.data.forEach((category: any) => {
                    params.push({ slug: service.slug, params: [category.slug] });
                });
            }

            if (citiesData?.data) {
                citiesData.data.forEach((city: any) => {
                    params.push({ slug: service.slug, params: [city.slug] });
                });
            }

            if (categoriesData?.data && citiesData?.data) {
                categoriesData.data.forEach((category: any) => {
                    citiesData.data.slice(0, 3).forEach((city: any) => {
                        params.push({
                            slug: service.slug,
                            params: [category.slug, city.slug]
                        });
                    });
                });
            }
        });

        return params;
    } catch (error) {
        console.warn("Could not fetch API during build, returning empty static params.");
        return [];
    }
}

async function resolveParams(paramsArray: string[]) {
    const result: { category: any, city: any } = { category: null, city: null };

    if (paramsArray.length === 1) {
        const slug = paramsArray[0];
        const [catRes, cityRes] = await Promise.all([
            fetchAPI('/service-categories', { filters: { slug: { $eq: slug } } }),
            fetchAPI('/cities', { filters: { slug: { $eq: slug } } })
        ]);
        if (catRes?.data?.length > 0) result.category = catRes.data[0];
        else if (cityRes?.data?.length > 0) result.city = cityRes.data[0];
    }
    else if (paramsArray.length === 2) {
        const [catRes, cityRes] = await Promise.all([
            fetchAPI('/service-categories', { filters: { slug: { $eq: paramsArray[0] } } }),
            fetchAPI('/cities', { filters: { slug: { $eq: paramsArray[1] } } })
        ]);
        if (catRes?.data?.length > 0) result.category = catRes.data[0];
        if (cityRes?.data?.length > 0) result.city = cityRes.data[0];
    }

    return result;
}

export async function generateMetadata({ params }: { params: { slug: string, params: string[] } }) {
    const serviceRes = await fetchAPI('/services', { filters: { slug: { $eq: params.slug } } });
    const service = serviceRes?.data?.[0];

    if (!service) return { title: 'ARQO | Service not found' };

    const resolved = await resolveParams(params.params);
    const { category, city } = resolved;

    if (!category && !city) return { title: 'ARQO | Not found' };

    let seoTitle = `${service.title}`;
    let seoLocative = city ? city.nameLocative : 'в Москве';

    if (category && city) {
        if (category.type === 'room') seoTitle = `${service.title} (${category.name.toLowerCase()}) ${seoLocative} | ARQO`;
        else if (category.type === 'property_type') seoTitle = `${service.title} в ${category.name.toLowerCase()}х ${seoLocative} | ARQO`;
        else if (category.type === 'style') seoTitle = `${service.title} в стиле ${category.name.toLowerCase()} ${seoLocative} | ARQO`;
    }
    else if (category) {
        if (category.type === 'room') seoTitle = `${service.title} (${category.name.toLowerCase()}) под ключ | ARQO`;
        else if (category.type === 'property_type') seoTitle = `${service.title} в ${category.name.toLowerCase()}х | ARQO`;
        else if (category.type === 'style') seoTitle = `${service.title} в стиле ${category.name.toLowerCase()} | ARQO`;
    }
    else if (city) {
        seoTitle = `${service.title} ${seoLocative} | Бюро ARQO`;
    }

    return {
        title: seoTitle,
        description: service.seoDescription ? `${service.seoDescription} ${city ? `Работаем ${city.nameLocative.toLowerCase()}.` : ''}` : `Профессиональные услуги: ${seoTitle}`,
    };
}

export default async function DynamicServicePage({ params }: { params: { slug: string, params: string[] } }) {
    const serviceRes = await fetchAPI('/services', {
        filters: { slug: { $eq: params.slug } },
        populate: ['employees', 'projects', 'reviews']
    });

    const service = serviceRes?.data?.[0];
    if (!service) notFound();

    const resolved = await resolveParams(params.params);
    const { category, city } = resolved;

    if (!category && !city) notFound();

    let dynamicTitle = service.title;
    let dynamicDesc = service.seoDescription || '';

    const seoLocative = city ? (city.nameLocative || 'в Москве') : '';

    if (category && city) {
        if (category.type === 'room') dynamicTitle = `${service.title}: ${category.name} ${seoLocative}`;
        else if (category.type === 'property_type') dynamicTitle = `${service.title} в ${category.name.toLowerCase()}х ${seoLocative}`;
        else if (category.type === 'style') dynamicTitle = `${category.name}: ${service.title} ${seoLocative}`;

        dynamicDesc = `Комплексная реализация проекта типа «${category.name.toLowerCase()}» с учетом всех особенностей недвижимости ${seoLocative.toLowerCase()}. ${city.seoText || ''} ${dynamicDesc}`;
    }
    else if (category) {
        if (category.type === 'room') dynamicTitle = `${service.title}: ${category.name}`;
        else if (category.type === 'property_type') dynamicTitle = `${service.title} в ${category.name.toLowerCase()}х`;
        else if (category.type === 'style') dynamicTitle = `${category.name}: ${service.title}`;

        dynamicDesc = `Специализированное решение для проекта типа «${category.name.toLowerCase()}». ${dynamicDesc}`;
    }
    else if (city) {
        dynamicTitle = `${service.title} ${seoLocative}`;
        dynamicDesc = `${city.seoText || ''} ${dynamicDesc}`;
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-background selection:bg-black selection:text-white text-foreground">
            <main className="container mx-auto px-6 relative z-10 pt-16">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-black">
                    <div className="max-w-2xl">
                        <div className="text-sm font-medium tracking-widest text-muted mb-8 uppercase flex gap-4">
                            <Link href="/services" className="hover:text-black transition-colors">Спектр услуг</Link>
                            {category && <span>/ {category.name}</span>}
                            {city && <span>/ {city.name}</span>}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light leading-none tracking-tight uppercase mb-8">
                            {dynamicTitle}
                        </h1>
                        <p className="text-xl font-light leading-relaxed text-foreground/80 max-w-xl">
                            {dynamicDesc}
                        </p>
                    </div>

                    {!service.pricingData?.packages ? (
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
                            <LeadButton type="icon" text="Обсудить ваш проект" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-start md:items-end min-w-[320px] justify-between">
                            <div className="text-xs font-medium tracking-[0.2em] text-muted mb-8 uppercase">С чего начать?</div>
                            <LeadButton type="icon" text="Выбрать пакет услуг" />
                        </div>
                    )}
                </div>

                {/* БЛОК ПАКЕТОВ УСЛУГ (ТАРИФЫ) */}
                {service.pricingData?.packages && service.pricingData.packages.length > 0 && (
                    <div className="mb-24 mt-12 border-t border-black pt-16">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="text-3xl font-light tracking-tight uppercase">Выберите свой формат</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {service.pricingData.packages.map((pkg: any, idx: number) => (
                                <div key={idx} className="border border-black/10 p-8 flex flex-col h-full hover:border-black transition-colors duration-500 bg-black/5">
                                    <h3 className="text-xl font-medium tracking-tight uppercase mb-2">{pkg.title}</h3>
                                    <div className="text-3xl font-light tracking-tight uppercase mb-8 pb-8 border-b border-black/10">{pkg.price}</div>

                                    <ul className="flex flex-col gap-4 mb-12 flex-grow">
                                        {pkg.features.map((feature: string, i: number) => (
                                            <li key={i} className="text-sm font-light leading-snug tracking-wide flex items-start gap-3">
                                                <span className="opacity-40 mt-1 uppercase text-xs">/</span>
                                                <span className="text-foreground/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto pt-6 border-t border-black/10 flex flex-col gap-6">
                                        <div className="text-[10px] uppercase tracking-widest font-medium text-muted">
                                            {pkg.terms}
                                        </div>
                                        <LeadButton type="default" text="Оставить заявку" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ПРОЦЕСС / ЭТАПЫ (если есть) */}
                {service.stages && service.stages.length > 0 && (
                    <div className="mb-24">
                        <h2 className="text-3xl font-light tracking-tight uppercase mb-12">Как мы работаем</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {service.stages.map((stage: any, idx: number) => (
                                <div key={idx} className="border-t border-black pt-6">
                                    <div className="text-xs font-medium tracking-widest text-muted uppercase mb-4">Этап 0{idx + 1}</div>
                                    <h3 className="text-xl font-medium tracking-tight uppercase mb-4">{stage.title}</h3>
                                    <p className="text-sm font-light text-foreground/80 leading-relaxed">{stage.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ГАЛЕРЕЯ (если есть) */}
                {service.gallery && service.gallery.length > 0 && (
                    <div className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.gallery.map((imgUrl: string, idx: number) => (
                                <div key={idx} className="relative aspect-[4/3] w-full bg-black/5 overflow-hidden">
                                    <img src={imgUrl} alt={`Галерея ${service.title} - ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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

                {/* ОТЗЫВЫ */}
                {service.reviews && service.reviews.length > 0 && (
                    <div className="mt-32 mb-24 pb-16 border-t border-black pt-16">
                        <h2 className="text-3xl font-light tracking-tight uppercase mb-12">Отзывы клиентов</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {service.reviews.map((review: any) => (
                                <div key={review.documentId} className="flex flex-col h-full bg-black/5 p-8 relative">
                                    <div className="text-4xl absolute -top-4 -left-2 text-black/10 font-serif leading-none">"</div>
                                    <p className="text-sm font-light leading-relaxed text-foreground/90 italic flex-grow mb-8 relative z-10">
                                        «{review.text}»
                                    </p>
                                    <div className="border-t border-black/10 pt-6 mt-auto">
                                        <div className="font-medium tracking-wide uppercase text-sm mb-1">{review.clientName}</div>
                                        <div className="text-xs uppercase tracking-widest text-muted flex items-center justify-between">
                                            <span>Локация: {review.location || 'Москва'}</span>
                                            <span className="text-black/40">★ {review.rating}/5</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
