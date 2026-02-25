# ARQO — Корпоративный сайт (Архитектура & Дизайн Интерьеров)

[![Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20Strapi-black)]()
[![Lang](https://img.shields.io/badge/Language-TypeScript-blue)]()
[![Design](https://img.shields.io/badge/Design-Tailwind%20CSS-38bdf8)]()
[![DB](https://img.shields.io/badge/Database-SQLite%20(dev)-lightgrey)]()

> **Контекст:** Проект был полностью воссоздан с нуля после потери файлов при переименовании папки. Цель при восстановлении — пересобрать лучше, чем было. Итог: значительно более масштабный, SEO-прокачанный и визуально совершенный сайт.

## О проекте

Корпоративный сайт компании **ARQO** — студии элитного ремонта, дизайна интерьеров и архитектурного проектирования в Москве. Основная идея — "сеть доверия": клиент видит не безликую компанию, а конкретного архитектора, его проекты и экспертные статьи.

## 📁 Структура

```
site-arqo/
├── backend/          # Headless CMS — Strapi v5
│   └── src/
│       ├── api/      # Content Types (Service, Employee, Project, City, Article)
│       └── index.ts  # Bootstrap & Seed Script (автоматически наполняет БД)
└── frontend/         # Next.js 15 (App Router, SSR, TypeScript)
    └── src/
        ├── app/      # Все страницы (маршруты)
        └── lib/
            └── api.ts # Обертка для fetch из Strapi
```

## 🚀 Быстрый старт (на новом устройстве)

### 1. Backend (Strapi)
```bash
cd backend
npm install
npm run develop
```
> ⚡ При первом запуске Strapi автоматически через `src/index.ts` (bootstrap):
> - Создаст SQLite базу данных в `.tmp/data.db`
> - Заполнит её данными (проекты, сотрудники, услуги, статьи, города)
> - Настроит публичные API права.
>
> Создай первого admin-пользователя через: **http://localhost:1337/admin**

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Открой: **http://localhost:3000**

## 🗂 Реализованные страницы

| Маршрут | Описание |
|---|---|
| `/` | Главная: Hero, О нас, Услуги, Проекты, Команда, Футер |
| `/projects` | Сетка портфолио с Unsplash-картинками |
| `/projects/[slug]` | Детальная страница кейса (галерея, команда, объем) |
| `/services` | Список направлений с ценами |
| `/services/[slug]` | Детальная страница услуги (из Strapi pricingData) |
| `/team` | Команда архитекторов |
| `/team/[slug]` | Профиль эксперта (биография, проекты, услуги) |
| `/blog` | Архитектурный журнал |
| `/blog/[slug]` | Статья с автором из команды |
| `/geo/[slug]` | 🔑 SEO-лендинги под районы: `/geo/khamovniki`, `/geo/moscow-city` и т.д. |
| `/contacts` | Контакты + форма захвата лидов |

## 🏗 Архитектура данных Strapi

```
Service ─────┬──── Employee ─── Project
 (Услуга)    │     (Сотрудник)  (Проект)
             │          │
             │      Article
             │     (Статья в блоге, автор = Employee)
             │
City (SEO-локации: Хамовники, Москва-Сити, Новая Рига...)
```

Все связи двунаправлены. Со страницы проекта видны и услуга, и исполнитель; с профиля сотрудника — все его проекты и услуги.

## 🎨 Дизайн-система

- **Цветовая палитра:** Off-white фон (`#F9F8F6`) + графитовый текст (`#1A1A1A`)
- **Типография:** Inter (ультратонкие начертания `font-light`, крупные заголовки `tracking-tighter`)
- **Компоненты:** Glassmorphism-навигация, инвертируемый header через `mix-blend-difference`
- **Сетка:** Архитектурный сеточный фон (`.grid-bg` в CSS)
- **Анимации:** Framer Motion, hover-эффекты (scale, grayscale, color invert)

## 🔌 Технологии

| Слой | Технология |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Strapi v5 (headless CMS), Node.js |
| **DB (dev)** | SQLite (создается автоматически) |
| **Icons** | Lucide React |
| **HTTP** | `qs` библиотека для сериализации Strapi-фильтров |

## 📊 SEO-стратегия

- Гиперлокальные страницы под районы Москвы (`/geo/[slug]`)
- Авторский журнал для информационных запросов (`/blog`)
- Динамический `generateMetadata` на каждой странице Next.js
- Реляционная модель данных для построения "сети доверия"

## 📌 Следующие задачи (TODO)

- [ ] Sitemap.xml и robots.txt
- [ ] Schema.org разметка (LocalBusiness, Person, Article)
- [ ] Оптимизация изображений (next/image + WebP)
- [ ] Форма контактов (реальная отправка, напр. SendGrid)
- [ ] Наполнение реальным контентом (фотографии, тексты, проекты)
- [ ] SEO-перекрестные маршруты `/services/[service]/[city]`

## 📂 Важные файлы

- [`backend/src/index.ts`](backend/src/index.ts) — вся логика сидирования + права API
- [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts) — обертка для fetch из Strapi
- [`frontend/src/app/page.tsx`](frontend/src/app/page.tsx) — главная страница (отправная точка)
