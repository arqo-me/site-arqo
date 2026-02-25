import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('🚀 Starting ARQO MAX EXPANSION Bootstrap sequence...');

    // SET PUBLIC PERMISSIONS
    const enablePublicAPI = async () => {
      try {
        const publicRole = await strapi.documents('plugin::users-permissions.role').findFirst({
          filters: { type: 'public' },
        });

        if (publicRole) {
          const apiPermissions = [
            { action: 'api::service.service.find' },
            { action: 'api::service.service.findOne' },
            { action: 'api::employee.employee.find' },
            { action: 'api::employee.employee.findOne' },
            { action: 'api::project.project.find' },
            { action: 'api::project.project.findOne' },
            { action: 'api::city.city.find' },
            { action: 'api::city.city.findOne' },
            { action: 'api::article.article.find' },
            { action: 'api::article.article.findOne' },
          ];

          for (const perm of apiPermissions) {
            const existingPerm = await strapi.db.query('plugin::users-permissions.permission').findOne({
              where: { role: publicRole.id, action: perm.action },
            });

            if (!existingPerm) {
              await strapi.db.query('plugin::users-permissions.permission').create({
                data: {
                  action: perm.action,
                  role: publicRole.id,
                },
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to set permissions:', err);
      }
    };
    await enablePublicAPI();

    // 1. Seed Services
    let seededServices: any[] = [];
    const existingServices = await strapi.documents('api::service.service').findMany();
    if (existingServices.length === 0) {
      const services = [
        {
          title: 'Пакет ПРЕМИУМ', slug: 'paket-premium',
          seoDescription: 'Полный комплекс услуг по дизайну и ремонту премиум-класса от ARQO. Включает 3D визуализацию, подбор мебели и авторский надзор.',
          pricingData: { basePrice: 'От 8000 руб./м2', features: ['Планировочное решение', '3D визуализация', 'Рабочие чертежи', 'Авторский надзор'], terms: 'Предоплата: 100% поэтапно.' }
        },
        {
          title: 'Пакет КОМФОРТ', slug: 'paket-komfort',
          seoDescription: 'Базовый набор услуг для создания индивидуального пространства. Отличный выбор для квартир бизнес-класса.',
          pricingData: { basePrice: 'От 4500 руб./м2', features: ['Планировочное решение', 'Рабочие чертежи', 'Спецификация материалов'], terms: 'Индивидуальный расчет' }
        },
        {
          title: 'Комплектация объекта', slug: 'komplektatsiya',
          seoDescription: 'Подбор мебели, света и чистовых материалов под проект. Работа напрямую с фабриками Италии и Германии.',
          pricingData: { basePrice: 'Индивидуально', features: ['Выезд в шоурумы', 'Поиск аналогов', 'Контроль доставок', 'Управление бюджетом'], terms: 'Процент от сэкономленного бюджета или фикс' }
        },
        {
          title: 'Ремонт премиум-класса', slug: 'remont',
          seoDescription: 'Высококачественные строительно-монтажные и отделочные работы премиум-уровня силами штатных бригад узкого профиля.',
          pricingData: { basePrice: 'От 35000 руб./м2', features: ['Черновые работы', 'Технический надзор', 'Инженерные сети', 'Умный дом'], terms: 'Фиксированная смета в договоре' }
        },
        {
          title: 'Архитектурное проектирование', slug: 'arch-design',
          seoDescription: 'Проектирование загородных резиденций, вилл и усадеб с нуля. Разработка КЖ, КД и архитектурного облика.',
          pricingData: { basePrice: 'От 3000 руб./м2', features: ['Эскизный проект', 'Конструктивные решения', 'Генеральный план'], terms: 'Поэтапная оплата' }
        }
      ];
      for (const service of services) {
        seededServices.push(await strapi.documents('api::service.service').create({ data: service, status: 'published' }));
      }
    } else { seededServices = existingServices; }

    // 2. Seed Employees
    let seededEmployees: any[] = [];
    const existingEmployees = await strapi.documents('api::employee.employee').findMany();
    if (existingEmployees.length === 0) {
      const employees = [
        { name: 'Александр Вознесенский', slug: 'aleksandr-voznesensky', role: 'Главный архитектор', bio: 'Автор более 100 реализованных проектов в топовых ЖК Москвы.', experience: '15 лет', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
        { name: 'Екатерина Романова', slug: 'ekaterina-romanova', role: 'Ведущий дизайнер интерьеров', bio: 'Победитель премии AD Design Award. Магистр минимализма.', experience: '10 лет', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' },
        { name: 'Михаил Строев', slug: 'mikhail-stroev', role: 'Руководитель строительных проектов', bio: 'Внедрил систему многоуровневого внутреннего технадзора.', experience: '20 лет', photoUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop' },
        { name: 'Анна Ли', slug: 'anna-lee', role: 'Специалист по комплектации', bio: 'Знает все секретные шоурумы Милана и Парижа. Экономит до 30% бюджета заказчика.', experience: '8 лет', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
        { name: 'Дмитрий Волков', slug: 'dmitry-volkov', role: 'Инженер Умного Дома', bio: 'Интегратор систем KNX, Control4.', experience: '12 лет', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop' }
      ];
      for (const emp of employees) {
        seededEmployees.push(await strapi.documents('api::employee.employee').create({ data: emp, status: 'published' }));
      }
    } else { seededEmployees = existingEmployees; }

    // 3. Seed Projects
    const existingProjects = await strapi.documents('api::project.project').findMany();
    if (existingProjects.length === 0 && seededServices.length > 0 && seededEmployees.length > 0) {
      const projects = [
        {
          title: 'Пентхаус в ЖК Хамовники', slug: 'penthouse-khamovniki', description: 'Комплексная реализация пентхауса площадью 250 м2.', scope: 'Архитектурный проект, дизайн, комплектация, ремонт под ключ.', timeline: '8 месяцев', location: 'Москва, Хамовники',
          service: seededServices[0]?.documentId, employees: [seededEmployees[0]?.documentId, seededEmployees[1]?.documentId].filter(id => id),
          mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1600607687931-cebf0746e48e?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop']
        },
        {
          title: 'Апартаменты в Москва-Сити', slug: 'apartments-moscow-city', description: 'Современный функциональный минимализм на 55 этаже башни ОКО.', scope: 'Дизайн-проект, авторский надзор.', timeline: '5 месяцев', location: 'Башня ОКО, Москва-Сити',
          service: seededServices[1]?.documentId, employees: [seededEmployees[1]?.documentId, seededEmployees[3]?.documentId].filter(id => id),
          mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55dd10403fd?q=80&w=1200&auto=format&fit=crop']
        },
        {
          title: 'Резиденция на Новой Риге', slug: 'novaya-riga-residence', description: 'Загородный дом 800 кв.м. Архитектура в стиле Фрэнка Ллойда Райта с панорамным остеклением и ландшафтным дизайном.', scope: 'Строительство с нуля, дизайн интерьера.', timeline: '1.5 года', location: 'Новорижское шоссе',
          service: seededServices[4]?.documentId, employees: [seededEmployees[0]?.documentId, seededEmployees[2]?.documentId].filter(id => id),
          mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop']
        },
        {
          title: 'Лофт на Патриарших', slug: 'patriarch-ponds-loft', description: 'Реновация исторического здания с сохранением кирпичной кладки 19 века. Интеграция современных скрытых систем умного дома.', scope: 'Проект реконструкции, Инженерия, Дизайн', timeline: '12 месяцев', location: 'Патриаршие пруды',
          service: seededServices[3]?.documentId, employees: [seededEmployees[1]?.documentId, seededEmployees[4]?.documentId].filter(id => id),
          mainImage: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e0d?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607688969-a5bf12f12fca?q=80&w=1200&auto=format&fit=crop']
        }
      ];
      for (const proj of projects) {
        await strapi.documents('api::project.project').create({ data: proj, status: 'published' });
      }
    }

    // 4. Seed City GEO targets
    const existingCities = await strapi.documents('api::city.city').findMany();
    if (existingCities.length === 0) {
      const cities = [
        { name: 'Москва', slug: 'moscow', seoText: 'ARQO — лидер премиального ремонта и архитектуры в Москве. Наши объекты находятся в лучших ЖК столицы: Хамовники, Пресня, Замоскворечье.' },
        { name: 'Хамовники', slug: 'khamovniki', seoText: 'Мы знаем все архитектурные нюансы премиальных жилых комплексов в Хамовниках. Обеспечиваем бесшовный ремонт с учетом строгих регламентов управляющих компаний элитных домов.' },
        { name: 'Рублево-Успенское', slug: 'rublevo-uspenskoe', seoText: 'Проектирование и строительство усадеб на Рублево-Успенском шоссе. Особое внимание приватности и интеграции дома в ландшафт.' },
        { name: 'Москва-Сити', slug: 'moscow-city', seoText: 'Создаем захватывающие дух панорамные интерьеры в башнях Москва-Сити. Знаем особенности работы с инженерными системами высотных зданий.' },
        { name: 'Новая Рига', slug: 'novaya-riga', seoText: 'Архитектурное проектирование просторных резиденций на Новой Риге. Ваш идеальный загородный дом под ключ.' }
      ];
      for (const city of cities) {
        await strapi.documents('api::city.city').create({ data: city, status: 'published' });
      }
    }

    // 5. Seed Articles
    const existingArticles = await strapi.documents('api::article.article').findMany();
    if (existingArticles.length === 0 && seededEmployees.length > 0) {
      const articles = [
        { title: 'Как избежать ошибок при покупке квартиры в бетоне?', slug: 'oshibki-kvartira-beton', content: 'Покупка квартиры без отделки в элитном ЖК таит в себе множество нюансов. В этой статье наш главный архитектор разбирает 5 критических ошибок, которые могут стоить вам миллионов рублей на этапе ремонта. От проверки трасс кондиционирования до оценки высоты стяжки.', author: seededEmployees[0]?.documentId },
        { title: 'Тренды минимализма 2026: Возвращение текстур', slug: 'trends-minimalism-2026', content: 'Голый минимализм уступает место "теплому". Мы используем больше натурального дерева, неровного камня и сложных глубоких оттенков. В проектах ARQO мы комбинируем строгую геометрию с тактильными материалами премиум-класса.', author: seededEmployees[1]?.documentId },
        { title: 'Умный дом: Игрушка или необходимость?', slug: 'smart-home-necessity', content: 'Интеграция KNX и DALI перестала быть экзотикой. Сегодня умный дом — это базовая инфраструктура любой премиальной квартиры, позволяющая управлять климатом, светом и шторами с одного iPad. Как заложить кабели до заливки пола — читайте в статье.', author: seededEmployees[4]?.documentId }
      ];
      for (const article of articles) {
        await strapi.documents('api::article.article').create({ data: article, status: 'published' });
      }
      console.log('✅ Seeded Articles (Blog)!');
    }

    console.log('✅ MAX EXPANSION Data Seed Complete.');
  },
};
