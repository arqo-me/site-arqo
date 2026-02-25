import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const [projectsData, servicesData, teamData] = await Promise.all([
    fetchAPI('/projects', { pagination: { limit: 2 }, populate: '*' }),
    fetchAPI('/services', { pagination: { limit: 4 } }),
    fetchAPI('/employees', { pagination: { limit: 3 } })
  ]);

  const projects = projectsData?.data || [];
  const services = servicesData?.data || [];
  const team = teamData?.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-black selection:text-white pb-24">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="text-4xl font-light tracking-[0.2em] uppercase">ARQO</Link>
          <nav className="hidden md:flex gap-12 text-sm uppercase tracking-widest font-medium">
            <Link href="/projects" className="hover:opacity-60 transition-opacity">Проекты</Link>
            <Link href="/services" className="hover:opacity-60 transition-opacity">Услуги</Link>
            <Link href="/team" className="hover:opacity-60 transition-opacity">О нас</Link>
            <Link href="/contacts" className="hover:opacity-60 transition-opacity">Москва</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-end pb-32 px-6 pt-32 overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687931-cebf0746e48e?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Architectural Interior"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
          <h1 className="text-[12vw] md:text-[8vw] leading-[0.8] font-light tracking-tighter uppercase max-w-5xl">
            Архитектура. <br />
            <span className="opacity-40">Ремонт.</span> <br />
            Искусство.
          </h1>
          <div className="max-w-xs flex flex-col gap-8 md:mb-4">
            <p className="text-lg font-light leading-relaxed">
              Мы создаем бескомпромиссные премиальные интерьеры в Москве. От точного архитектурного проекта до ремонта под ключ с авторским надзором.
            </p>
            <Link href="/projects" className="flex items-center gap-4 group w-fit">
              <span className="text-xs uppercase tracking-[0.2em] font-medium border-b border-black pb-1">Смотреть проекты</span>
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                <ArrowRight strokeWidth={1} className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT EXPERTISE */}
      <section className="container mx-auto px-6 py-32 border-b border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xs font-medium tracking-widest text-muted uppercase">01 / Наш Подход</h2>
          </div>
          <div className="md:col-span-8 flex flex-col gap-12">
            <h3 className="text-3xl md:text-5xl font-light leading-tight tracking-tight">
              ARQO — это синергия строгой архитектурной школы и премиального строительного сервиса.
            </h3>
            <p className="text-xl font-light text-muted leading-relaxed max-w-3xl">
              Мы не просто "делаем ремонт". Мы проектируем геометрию жизни. Наш процесс включает
              создание точных планировочных решений, фотореалистичную 3D-визуализацию, комплектацию
              эксклюзивными материалами и реализацию силами собственных строительных бригад под
              жестким техническим надзором.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-32 border-b border-black/10 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-24">
            <h2 className="text-[6vw] md:text-[4vw] leading-none font-light uppercase tracking-tighter">Наши <span className="opacity-50">Направления</span></h2>
            <Link href="/services" className="hidden md:flex items-center gap-4 group">
              <span className="text-white text-xs uppercase tracking-[0.2em] border-b border-white pb-1">Все услуги</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/20">
            {services.map((service: any, index: number) => (
              <Link href={`/services/${service.slug}`} key={service.documentId} className={`group flex flex-col p-8 border-b border-white/20 md:border-r hover:bg-white hover:text-black transition-all duration-500 ${index % 4 === 3 ? 'md:border-r-0' : ''}`}>
                <div className="text-xs font-medium tracking-widest text-white/50 group-hover:text-black/50 mb-16 uppercase">0{index + 2}.</div>
                <h3 className="text-2xl font-light mb-6">{service.title}</h3>
                <p className="text-sm opacity-60 font-light line-clamp-3 mb-12">{service.seoDescription}</p>
                <div className="mt-auto flex justify-between items-end">
                  <div className="text-xs uppercase tracking-widest">{service.pricingData?.basePrice || 'Индивидуально'}</div>
                  <ArrowUpRight strokeWidth={1} className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="container mx-auto px-6 py-32 border-b border-black/10">
        <div className="flex justify-between items-end mb-24">
          <h2 className="text-[6vw] md:text-[4vw] leading-none font-light uppercase tracking-tighter">Избранные <span className="opacity-40">Проекты</span></h2>
          <Link href="/projects" className="hidden md:flex items-center gap-4 group">
            <span className="text-xs uppercase tracking-[0.2em] border-b border-black pb-1">Смотреть портфолио</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project: any) => (
            <Link href={`/projects/${project.slug}`} key={project.documentId} className="group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden mb-8 bg-black/5">
                {project.mainImage && (
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                  />
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-light tracking-tight mb-2 uppercase">{project.title}</h3>
                  <p className="text-sm uppercase tracking-widest text-muted">{project.location}</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <ArrowUpRight strokeWidth={1} className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEAM EXPERTISE */}
      <section className="container mx-auto px-6 py-32">
        <div className="flex justify-between items-end mb-24">
          <div className="max-w-2xl">
            <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-8">04 / Экспертиза</h2>
            <h3 className="text-4xl md:text-5xl font-light leading-tight tracking-tight">Люди, создающие <br /><span className="italic opacity-50">архитектурное наследие.</span></h3>
          </div>
          <Link href="/team" className="hidden md:flex items-center gap-4 group">
            <span className="text-xs uppercase tracking-[0.2em] border-b border-black pb-1">Вся команда</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member: any) => (
            <Link href={`/team/${member.slug}`} key={member.documentId} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden mb-6 bg-black/5">
                {member.photoUrl && (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                  />
                )}
              </div>
              <h4 className="text-xl font-medium tracking-tight uppercase">{member.name}</h4>
              <p className="text-sm uppercase tracking-widest text-muted mt-2 border-t border-black/10 pt-2">{member.role}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-24 px-6 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <div className="text-6xl font-light tracking-[0.2em] uppercase mb-12">ARQO</div>
            <div className="text-sm font-light opacity-60 max-w-sm">
              Премиальная архитектура и ремонт квартир в Москве. Искусство создавать пространства для жизни.
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm font-light uppercase tracking-widest text-right">
            <a href="#" className="hover:opacity-60 transition-opacity">+7 (495) 000-00-00</a>
            <a href="#" className="hover:opacity-60 transition-opacity">hello@arqo.ru</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Москва, Пресненская наб. 12</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
