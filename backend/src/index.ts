import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('🚀 Checking API Permissions...');

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
            { action: 'api::review.review.find' },
            { action: 'api::review.review.findOne' },
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

    if (process.env.SKIP_SEED === 'true') {
      console.log('🚀 SKIP_SEED is set to true. Bypassing ARQO Content Upgrade Seed sequence...');
      return;
    }

    console.log('🚀 Starting ARQO Content Upgrade Seed sequence...');

    // 1. Seed Services
    let seededServices: any[] = [];
    const services = [
      {
        title: 'Ремонт квартир', slug: 'apartment-renovation',
        seoDescription: 'Капитальный ремонт квартир с соблюдением всех технологических норм и ГОСТов.',
        pricingData: { basePrice: 'От 25 000 руб./м²', features: ['Демонтаж и возведение перегородок', 'Выравнивание геометрии стен', 'Электромонтажные работы', 'Сантехнические работы', 'Чистовая отделка'], terms: 'Поэтапная оплата по факту выполненных работ.' },
        detailedDescription: 'Мы выполняем комплексный ремонт квартир любой сложности. Наша главная ценность — прозрачное ценообразование, строгий технический надзор на каждом этапе и сдача объекта точно в срок.',
        stages: [
          { title: "Замеры и смета", description: "Точный обмер помещения и составление фиксированной сметы." },
          { title: "Черновая отделка", description: "Инженерия, стяжка, штукатурка и возведение новых перегородок." },
          { title: "Чистовая отделка", description: "Покраска стен, укладка напольных покрытий, монтаж дверей." },
          { title: "Сдача объекта", description: "Финальный клининг и передача ключей заказчику." }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200',
          'https://images.unsplash.com/photo-1541889025-a182daee4106?q=80&w=1200'
        ]
      },
      {
        title: 'Премиальный ремонт', slug: 'premium-fit-out',
        seoDescription: 'Элитный ремонт "Под ключ" с многоуровневым контролем качества и интеграцией сложных инженерных систем.',
        pricingData: { basePrice: 'От 45 000 руб./м²', features: ['Независимый технадзор', 'Сложная инженерия и "Умный дом"', 'Работа с камнем и шпоном', 'Высокоточная отделка', 'Координация смежных подрядчиков', 'Клининг перед сдачей'], terms: 'Фиксированная смета.' },
        detailedDescription: 'Собственный штат строителей позволяет нам гарантировать безупречное исполнение самых сложных узлов примыканий, интеграцию систем "Умный дом", приточных вентиляций и работу с эксклюзивными материалами.',
        stages: [
          { title: "Подготовка", description: "Организация стройплощадки, защита мест общего пользования, закупка черновых материалов." },
          { title: "Скрытые работы", description: "Прокладка сетей электрики, сантехники, систем вентиляции и кондиционирования." },
          { title: "Выравнивание", description: "Оштукатуривание стен, стяжка пола под разные уровни чистых покрытий." },
          { title: "Идеальная чистовая", description: "Монтаж теневых профилей, укладка крупноформатного керамогранита, декоративная штукатурка." }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200',
          'https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=1200'
        ]
      },
      {
        title: 'Дизайн интерьера', slug: 'interior-design',
        seoDescription: 'Профессиональный дизайн интерьера квартир. Три прозрачных тарифа от планировочного решения до полного комплекта чертежей.',
        pricingData: {
          packages: [
            { title: "Базовый", price: "3 700 руб./м²", features: ["Планировочное решение", "Базовые чертежи"], terms: "Оплата по договоренности" },
            { title: "Комфорт", price: "4 500 руб./м²", features: ["Планировочное решение (40% оплаты)", "3D визуализации (60% оплаты)"], terms: "100% Предоплата за каждый этап" },
            { title: "Премиум", price: "5 000 руб./м²", features: ["Планировочное решение (30%)", "3D визуализации (35%)", "Рабочие чертежи и смета комплектации (35%)"], terms: "Поэтапная оплата" }
          ],
          basePrice: 'От 3 700 руб./м²'
        },
        detailedDescription: 'Мы предлагаем гибкий подход к дизайну интерьера, чтобы вы могли выбрать именно тот объем услуг, который вам нужен: от базовых чертежей для строителей до реалистичных 3D-визуализаций с полным подбором мебели.',
        stages: [
          { title: "Планировка", description: "Разработка нескольких вариантов эргономичных планировок под ваш стиль жизни." },
          { title: "Визуализация", description: "Создание 3D-моделей (для тарифов Комфорт и Премиум)." },
          { title: "Рабочая документация", description: "Оформление полного пакета строительных чертежей." },
          { title: "Комплектация (доп. услуга)", description: "Смета на материалы и мебель с артикулами." }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
          'https://images.unsplash.com/photo-1598928331169-dc382583e7ff?q=80&w=1200'
        ]
      },
      {
        title: 'Premium Дизайн Интерьеров', slug: 'premium-interior-design',
        seoDescription: 'Эксклюзивный дизайн-проект с детальной проработкой каждого узла, подбором редких материалов и авторским надзором.',
        pricingData: { basePrice: 'От 8 000 руб./м²', features: ['Глубокая аналитика образа жизни', 'Сложные текстуры и "теплый" минимализм', 'Полный комплект рабочих чертежей', 'Подбор мебели премиальных брендов', 'Спецификация с бюджетом', 'Авторский надзор включен'], terms: 'Аванс 50%. Срок от 1.5 месяцев.' },
        detailedDescription: 'Дизайн студии ARQO — это отказ от стерильности в пользу "теплого минимализма". Мы проектируем пространства, которые стареют красиво: используем натуральный камень, дерево, латунь и фактурные ткани. Все узлы примыканий разрабатываются индивидуально.',
        stages: [
          { title: "Анкетирование", description: "Глубокое погружение во вкусы, привычки и сценарии жизни владельцев." },
          { title: "Концепция и 3D", description: "Создаем фотореалистичные 3D-модели вашего будущего интерьера." },
          { title: "Проектирование", description: "Детальные чертежи сложной инженерии, систем вентиляции и заказных панелей стен." },
          { title: "Спецификация и надзор", description: "Полный список материалов и контроль за реализацией идеи на стройке." }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
          'https://images.unsplash.com/photo-1598928506311-c55dd10403fd?q=80&w=1200'
        ]
      },
      {
        title: 'Архитектурное проектирование', slug: 'architectural-design',
        seoDescription: 'Проектирование частных домов и загородных резиденций. Создаем объекты, формирующие современный ландшафт.',
        pricingData: { basePrice: 'От 5000 руб./м²', features: ['Концептуальный эскиз', 'Архитектурные решения (АР)', 'Конструктивные решения (КР)', 'Генеральный план участка', '3D визуализация экстерьера', 'Увязка с ландшафтом'], terms: 'Оплата в 4 этапа. Срок от 2 месяцев.' },
        detailedDescription: 'Мы разрабатываем архитектурные концепции с глубоким вниманием к контексту участка, инсоляции и образу жизни заказчика. Наша цель — создать не просто дом, а продуманную экосистему для жизни, где каждая линия имеет обоснование.',
        stages: [
          { title: "Аналитика участка", description: "Изучение рельефа, топосъемка, формирование детального задания на проектирование." },
          { title: "Эскизный проект", description: "Разработка объемно-пространственных решений, посадка здания на участок." },
          { title: "Архитектурный проект", description: "Детальная проработка фасадов, планировок, 3D-визуализация экстерьера." },
          { title: "Рабочая документация", description: "Выпуск чертежей АР и КР (конструктивные решения) для монолитчиков и строителей." }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200'
        ]
      }
    ];
    for (const service of services) {
      let existingUser = await strapi.documents('api::service.service').findFirst({ filters: { slug: service.slug } });
      if (!existingUser) {
        seededServices.push(await strapi.documents('api::service.service').create({ data: service, status: 'published' }));
      } else {
        seededServices.push(existingUser);
      }
    }

    // 1.5 Seed Service Categories (SEO Tags)
    let seededCategories: any[] = [];
    const categories = [
      // Уровень 1: Комнаты
      { name: 'Ванная комната', slug: 'bathroom', type: 'room', description: 'Комплексный ремонт и дизайн ванных комнат.', services: [seededServices[0]?.documentId, seededServices[1]?.documentId, seededServices[2]?.documentId] },
      { name: 'Кухня', slug: 'kitchen', type: 'room', description: 'Ремонт и проектирование кухонного пространства.', services: [seededServices[0]?.documentId, seededServices[2]?.documentId] },
      { name: 'Гостиная', slug: 'living-room', type: 'room', description: 'Дизайн интерьера и ремонт гостиных комнат.', services: [seededServices[0]?.documentId, seededServices[2]?.documentId, seededServices[3]?.documentId] },
      { name: 'Детская', slug: 'kids-room', type: 'room', description: 'Безопасный ремонт и эко-дизайн детских.', services: [seededServices[0]?.documentId, seededServices[2]?.documentId] },
      { name: 'Спальня', slug: 'bedroom', type: 'room', description: 'Создание приватных зон для отдыха.', services: [seededServices[0]?.documentId, seededServices[1]?.documentId, seededServices[2]?.documentId, seededServices[3]?.documentId] },

      // Уровень 2: Типы недвижимости
      { name: 'Новостройка', slug: 'novostroyka', type: 'property_type', description: 'Ремонт квартир в новостройках с нуля.', services: [seededServices[0]?.documentId, seededServices[1]?.documentId, seededServices[2]?.documentId] },
      { name: 'Вторичка', slug: 'vtorichka', type: 'property_type', description: 'Капитальный ремонт квартир на вторичном рынке с демонтажом.', services: [seededServices[0]?.documentId, seededServices[1]?.documentId] },
      { name: 'Загородный дом', slug: 'house', type: 'property_type', description: 'Дизайн интерьера и обустройство загородных домов, коттеджей и таунхаусов.', services: [seededServices[1]?.documentId, seededServices[2]?.documentId, seededServices[3]?.documentId, seededServices[4]?.documentId] },
      { name: 'Квартира-студия', slug: 'studio', type: 'property_type', description: 'Ремонт и дизайн компактных квартир-студий.', services: [seededServices[0]?.documentId, seededServices[2]?.documentId] },
      { name: 'Апартаменты', slug: 'apartments', type: 'property_type', description: 'Премиум ремонт и дизайн коммерческих апартаментов.', services: [seededServices[1]?.documentId, seededServices[3]?.documentId] },
      { name: 'Таунхаус', slug: 'townhouse', type: 'property_type', description: 'Дизайн и реализация проектов в таунхаусах.', services: [seededServices[1]?.documentId, seededServices[2]?.documentId, seededServices[3]?.documentId] },

      // Уровень 2: Стили
      { name: 'Минимализм', slug: 'minimalism', type: 'style', description: 'Интерьеры в стиле "Теплый" или строгий минимализм.', services: [seededServices[2]?.documentId, seededServices[3]?.documentId] },
      { name: 'Неоклассика', slug: 'neoclassic', type: 'style', description: 'Дизайн интерьеров в современном классическом стиле.', services: [seededServices[2]?.documentId, seededServices[3]?.documentId] },
      { name: 'Лофт', slug: 'loft', type: 'style', description: 'Стиль лофт с обилием бетона, металла и натурального дерева.', services: [seededServices[2]?.documentId] },
      { name: 'Скандинавский', slug: 'scandinavian', type: 'style', description: 'Светлые, практичные интерьеры в скандинавском стиле.', services: [seededServices[2]?.documentId] },
      { name: 'Джапанди', slug: 'japandi', type: 'style', description: 'Синтез японской философии wabi-sabi и скандинавского уюта.', services: [seededServices[2]?.documentId, seededServices[3]?.documentId] }
    ];

    for (const category of categories) {
      let existingCategory = await strapi.documents('api::service-category.service-category').findFirst({ filters: { slug: category.slug } });
      if (!existingCategory) {
        seededCategories.push(await strapi.documents('api::service-category.service-category').create({ data: category as any, status: 'published' }));
      } else {
        seededCategories.push(existingCategory);
      }
    }


    // 2. Seed Employees
    let seededEmployees: any[] = [];
    const employees = [
      { name: 'Александр Вознесенский', slug: 'aleksandr-voznesensky', role: 'СЕО и Главный архитектор', bio: 'Основатель бюро. Сторонник регенеративной архитектуры. Создает пространства, которые не только выглядят эффектно, но и улучшают жизнь владельцев. Автор более 200 масштабных проектов.', experience: '18 лет', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
      { name: 'Елена Маркова', slug: 'elena-markova', role: 'Арт-директор, Дизайн интерьеров', bio: 'Эксперт по созданию "тихой роскоши". Превращает холодный бетон в обволакивающее пространство с помощью тактильных материалов и сложных сценариев освещения.', experience: '12 лет', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
      { name: 'Михаил Строев', slug: 'mikhail-stroev', role: 'Руководитель департамента реализации', bio: 'Фанат точности и технологий. Внедрил BIM-технологии на этап стройки и систему оптического контроля геометрии стен. Отвечает за каждый миллиметр на объекте.', experience: '22 года', photoUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop' },
      { name: 'София Ланж', slug: 'sofia-lange', role: 'Ведущий декоратор и комплектатор', bio: 'Обладает исключительной насмотренностью. Находит винтажные предметы искусства на аукционах и безошибочно интегрирует их в суперсовременные интерьеры.', experience: '9 лет', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' }
    ];
    for (const emp of employees) {
      let existingUser = await strapi.documents('api::employee.employee').findFirst({ filters: { slug: emp.slug } });
      if (!existingUser) {
        seededEmployees.push(await strapi.documents('api::employee.employee').create({ data: emp, status: 'published' }));
      } else {
        seededEmployees.push(existingUser);
      }
    }


    // 3. Seed Projects
    const projects = [
      {
        title: 'Резиденция "Symbiosis" на Новой Риге', slug: 'symbiosis-residence', description: 'Дом площадью 1200 м² с концепцией регенеративного дизайна. Здание частично интегрировано в холм, что обеспечивает естественную терморегуляцию. Использованы переработанные материалы, локальный камень и обустроена система сбора дождевой воды.', scope: 'Архитектура с нуля, Дизайн, Реализация, Ландшафт', timeline: '2.5 года', location: 'Новорижское шоссе',
        service: seededServices[0]?.documentId, employees: [seededEmployees[0]?.documentId, seededEmployees[2]?.documentId].filter(id => id),
        mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop']
      },
      {
        title: 'Апартаменты "Tactile Sky" в Сити', slug: 'tactile-sky-moscow-city', description: 'Полный отказ от белого и серого холода типичных высоток. Использован "теплый" минимализм: обилие терракоты, шпон ореха, декоративная штукатурка из глины и льняные драпировки. Площадь: 140 м².', scope: 'Дизайн интерьера, Комплектация', timeline: '6 месяцев', location: 'Башня ОКО, Москва-Сити',
        service: seededServices[1]?.documentId, employees: [seededEmployees[1]?.documentId, seededEmployees[3]?.documentId].filter(id => id),
        mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1598928506311-c55dd10403fd?q=80&w=1200&auto=format&fit=crop']
      },
      {
        title: 'Вилла "Heritage" Рублево-Успенское', slug: 'heritage-villa', description: 'Адаптивное переосмысление старой постройки 90-х годов под новые требования. Трансформировали закрытый "замок" в дом, наполненный светом, за счет расширения оконных проемов и создания атриума.', scope: 'Реконструкция, Архитектура, Дизайн', timeline: '1.5 года', location: 'Рублево-Успенское шоссе',
        service: seededServices[3]?.documentId, employees: [seededEmployees[0]?.documentId, seededEmployees[1]?.documentId].filter(id => id),
        mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop']
      },
      {
        title: 'Бутик-отель "Raw Edge" Хамовники', slug: 'raw-edge-boutique', description: 'Коммерческий проект на 15 номеров в историческом здании. Сохранение открытой кирпичной кладки, индустриальный металл с патиной и умные отельные системы следующего поколения.', scope: 'B2B Концепт, Дизайн, Интеграция Умного Здания', timeline: '9 месяцев', location: 'Хамовники',
        service: seededServices[1]?.documentId, employees: [seededEmployees[0]?.documentId, seededEmployees[3]?.documentId].filter(id => id),
        mainImage: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e0d?q=80&w=1200&auto=format&fit=crop', gallery: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop']
      }
    ];
    for (const proj of projects) {
      let existingUser = await strapi.documents('api::project.project').findFirst({ filters: { slug: proj.slug } });
      if (!existingUser) {
        await strapi.documents('api::project.project').create({ data: proj, status: 'published' });
      }
    }

    // 4. Seed City GEO targets (50+ locations)
    const cities = [
      // --- Районы Москвы ---
      { name: 'Москва', slug: 'moscow', nameLocative: 'в Москве', seoText: 'ARQO — архитектурное бюро с полным циклом: от дизайн-проекта до ремонта под ключ. Работаем по всей Москве — от комфорт-класса до бизнес-сегмента.' },
      { name: 'Хамовники', slug: 'khamovniki', nameLocative: 'в Хамовниках', seoText: 'Ремонт и дизайн квартир в Хамовниках. Знаем нюансы планировок местных домов, работаем с управляющими компаниями и соблюдаем все регламенты.' },
      { name: 'Москва-Сити', slug: 'moscow-city', nameLocative: 'в Москва-Сити', seoText: 'Дизайн и ремонт апартаментов в башнях Москва-Сити. Знаем особенности инженерных систем высотных зданий и панорамного остекления.' },
      { name: 'Замоскворечье', slug: 'zamoskvorechye', nameLocative: 'в Замоскворечье', seoText: 'Ремонт квартир в Замоскворечье — одном из старейших районов Москвы. Уважаем историю зданий, создаём современный комфорт.' },
      { name: 'Остоженка', slug: 'ostozhenka', nameLocative: 'на Остоженке', seoText: 'Дизайн и ремонт на Остоженке. Работаем с клубными домами и историческими зданиями «золотой мили» Москвы.' },
      { name: 'Патриаршие Пруды', slug: 'patriarshie-prudy', nameLocative: 'на Патриарших Прудах', seoText: 'Ремонт квартир на Патриарших Прудах. Реконструкция исторических особняков и современный дизайн интерьеров в клубных домах района.' },
      { name: 'Пресня', slug: 'presnya', nameLocative: 'на Пресне', seoText: 'Дизайн и ремонт на Пресне. Создаём функциональные интерьеры для жителей современных жилых комплексов Пресненского района.' },
      { name: 'Басманный', slug: 'basmannyj', nameLocative: 'в Басманном районе', seoText: 'Ремонт квартир в Басманном районе Москвы. Работаем с квартирами в новостройках и историческом фонде рядом с Садовым кольцом.' },
      { name: 'Даниловский', slug: 'danilovskij', nameLocative: 'в Даниловском районе', seoText: 'Дизайн и ремонт в Даниловском районе — быстро развивающейся части ЮАО с новыми жилыми комплексами и лофт-кварталами.' },
      { name: 'Раменки', slug: 'ramenki', nameLocative: 'в Раменках', seoText: 'Ремонт квартир в Раменках. Работаем с квартирами на Мичуринском проспекте и в новых домах Западного округа.' },
      { name: 'Тропарёво-Никулино', slug: 'troparevo-nikulino', nameLocative: 'в Тропарёво-Никулино', seoText: 'Дизайн интерьеров и ремонт в Тропарёво-Никулино. Зеленый район на юго-западе Москвы с развитой инфраструктурой.' },
      // --- ЖК Новая Москва (комфорт / комфорт+) ---
      { name: 'ЖК Саларьево Парк', slug: 'salaryevo-park', nameLocative: 'в ЖК «Саларьево Парк»', seoText: 'Ремонт квартир в ЖК «Саларьево Парк». Жилой район у метро «Филатов Луг» с полной инфраструктурой. Мы знаем планировки ПИК и предлагаем оптимальные решения.' },
      { name: 'ЖК Прокшино', slug: 'prokshino', nameLocative: 'в ЖК «Прокшино»', seoText: 'Дизайн и ремонт в ЖК «Прокшино» от А101, в 7,6 км от МКАД. Рядом метро и скоростная трасса СБВ. Предлагаем комплексный ремонт под ключ.' },
      { name: 'ЖК Скандинавия', slug: 'skandinaviya', nameLocative: 'в ЖК «Скандинавия»', seoText: 'Ремонт в ЖК «Скандинавия» (А101) — комфорт и бизнес-класс на юго-западе Новой Москвы. Знаем особенности планировок и помогаем выбрать оптимальный дизайн.' },
      { name: 'ЖК Переделкино Ближнее', slug: 'peredelkino-blizhnee', nameLocative: 'в ЖК «Переделкино Ближнее»', seoText: 'Дизайн и ремонт в «Переделкино Ближнее». Город-парк рядом с метро «Рассказовка». Делаем ремонт с учётом панельных и монолитных серий.' },
      { name: 'ЖК Рассказово', slug: 'rasskazovo', nameLocative: 'в ЖК «Рассказово»', seoText: 'Ремонт квартир в ЖК «Рассказово» у метро «Рассказовка». Уникальная архитектура в стиле Москвы 30-х годов, требующая чуткого подхода к интерьеру.' },
      { name: 'ЖК Бунинские Кварталы', slug: 'buninskie-kvartaly', nameLocative: 'в «Бунинских Кварталах»', seoText: 'Ремонт под ключ в ЖК «Бунинские Кварталы» (А101). Экологичный юго-запад, хорошая транспортная доступность. Оптимизируем пространство любой планировки.' },
      { name: 'ЖК Дзен-кварталы', slug: 'dzen-kvartaly', nameLocative: 'в «Дзен-кварталах»', seoText: 'Дизайн интерьера в «Дзен-кварталах» (А101). Стиль Japandi — скандинавская функциональность и восточная созерцательность. Создаём интерьеры в духе концепции ЖК.' },
      { name: 'ЖК FOREVILLE', slug: 'foreville', nameLocative: 'в ЖК «FOREVILLE»', seoText: 'Ремонт в ЖК «FOREVILLE» — город в лесу. Монолитно-кирпичные дома с рейтингом 5.0. Предлагаем комплексный ремонт, учитывающий экологическую концепцию проекта.' },
      { name: 'ЖК Новое Летово', slug: 'novoe-letovo', nameLocative: 'в ЖК «Новое Летово»', seoText: 'Дизайн и ремонт квартир в ЖК «Новое Летово». Территория, где природа соединяется с городским пространством. Делаем квартиры уютными и функциональными.' },
      { name: 'ЖК Филатов Луг', slug: 'filatov-lug', nameLocative: 'в ЖК «Филатов Луг»', seoText: 'Ремонт квартир в ЖК «Филатов Луг» — доступный квартал в Новой Москве, в 6 км от МКАД, с видами на лесопарк.' },
      { name: 'ЖК Эко Бунино', slug: 'eko-bunino', nameLocative: 'в ЖК «Эко Бунино»', seoText: 'Ремонт в «Эко Бунино» от Группы Самолет. Квартал в окружении леса в Новой Москве. Реализуем дизайн-проекты, подчёркивающие связь с природой.' },
      { name: 'ЖК Алхимово', slug: 'alhimovo', nameLocative: 'в ЖК «Алхимово»', seoText: 'Дизайн и ремонт в ЖК «Алхимово» (Самолет). Квартал на берегу Десны, продуманный до мелочей. Помогаем создать уютное пространство в любой планировке.' },
      { name: 'ЖК Детали', slug: 'detali', nameLocative: 'в ЖК «Детали»', seoText: 'Ремонт в ЖК «Детали» — проект бизнес-класса с авторскими лобби и ландшафтным дизайном. Создаём интерьеры, достойные архитектуры комплекса.' },
      { name: 'ЖК Деснаречье', slug: 'desnarechye', nameLocative: 'в ЖК «Деснаречье»', seoText: 'Ремонт квартир в «Деснаречье» (А101). Три квартала на юго-западе Москвы в окружении рек и лесов. Комплексный подход к ремонту и дизайну.' },
      { name: 'ЖК Новые Ватутинки', slug: 'novye-vatutinki', nameLocative: 'в «Новых Ватутинках»', seoText: 'Ремонт квартир в «Новых Ватутинках» — микрорайон на берегу реки Десна. Рядом парк «Андерсен». Предлагаем готовые решения для разных планировок.' },
      { name: 'ЖК 1-й Саларьевский', slug: 'pervyj-salaryevskij', nameLocative: 'в ЖК «1-й Саларьевский»', seoText: 'Ремонт квартир в «1-м Саларьевском» от 1-го ДСК. Новая Москва, 5 минут от метро «Саларьево», 2 км от МКАД.' },
      { name: 'ЖК Тропарево Парк', slug: 'troparevo-park', nameLocative: 'в ЖК «Тропарёво Парк»', seoText: 'Ремонт апартаментов в «Тропарёво Парк» бизнес-класса на Ленинском проспекте, на границе с Тропарёвским лесопарком.' },
      { name: 'ЖК Юнино', slug: 'yunino', nameLocative: 'в ЖК «Юнино»', seoText: 'Ремонт в ЖК «Юнино» (ПИК) у станции МЦД-2 «Щербинка». Новая Москва, 9 км от МКАД.' },
      { name: 'ЖК Ольховый Квартал', slug: 'olhovyj-kvartal', nameLocative: 'в «Ольховом Квартале»', seoText: 'Дизайн и ремонт в «Ольховом Квартале» (Самолет) на юго-западе Москвы. До трёх станций метро пешком, окружение — зелёный лесопарк.' },
      { name: 'ЖК Родные Кварталы', slug: 'rodnye-kvartaly', nameLocative: 'в «Родных Кварталах»', seoText: 'Ремонт под ключ в «Родных Кварталах» (А101). Экологически чистая локация рядом с Ульяновским лесопарком.' },
      { name: 'ЖК Квартал Западный', slug: 'kvartal-zapadnyj', nameLocative: 'в «Квартале Западном»', seoText: 'Ремонт в «Квартале Западном» (Самолет) — комфорт-класс с видом на реку и собственным ландшафтным садом.' },
      { name: 'ЖК Новые Смыслы', slug: 'novye-smysly', nameLocative: 'в ЖК «Новые Смыслы»', seoText: 'Дизайн и ремонт в ЖК «Новые Смыслы» — комфорт-класс на юге Коммунарки, 700 м от метро «Потапово».' },
      { name: 'ЖК Внуково Кантри Клаб', slug: 'vnukovo-country-club', nameLocative: 'в ЖК «Внуково Кантри Клаб»', seoText: 'Ремонт в «Внуково Кантри Клаб» — монолитно-кирпичный клубный комплекс у метро «Рассказовка». Загородный формат с городскими коммуникациями.' },
      { name: 'ЖК Первый Московский', slug: 'pervyj-moskovskij', nameLocative: 'в «Первом Московском»', seoText: 'Ремонт квартир в «Первом Московском» — город-парк в Новой Москве, 7 км от МКАД. Полная инфраструктура и метро рядом.' },
      { name: 'ЖК 1-й Ясеневский', slug: 'pervyj-yasenevskij', nameLocative: 'в ЖК «1-й Ясеневский»', seoText: 'Дизайн и ремонт в «1-м Ясеневском» — комфорт-плюс класс, 63 га Троицкого лесопарка и школа с бассейном в пешей доступности.' },
      // --- ЖК Москва (бизнес-класс) ---
      { name: 'ЖК ЗилАРТ', slug: 'zilart', nameLocative: 'в ЖК «ЗилАРТ»', seoText: 'Дизайн и ремонт в ЖК «ЗилАРТ» — культурно-деловой кластер на бывшем заводе ЗИЛ. Масштабный проект с уникальной инфраструктурой.' },
      { name: 'ЖК Символ', slug: 'simvol', nameLocative: 'в ЖК «Символ»', seoText: 'Ремонт квартир в ЖК «Символ» — инновационный квартал бизнес-класса с интеграцией технологий и образования.' },
      { name: 'ЖК Остров', slug: 'ostrov', nameLocative: 'в ЖК «Остров»', seoText: 'Дизайн и ремонт в ЖК «Остров» — уникальный проект на полуострове в Мнёвниковской пойме со своей станцией метро «Терехово».' },
      { name: 'ЖК Сердце Столицы', slug: 'serdtse-stolitsy', nameLocative: 'в «Сердце Столицы»', seoText: 'Ремонт в ЖК «Сердце Столицы» — город в городе с собственной школой, фитнес-клубом и 2 гектарами благоустроенной территории.' },
      { name: 'ЖК Level Причальный', slug: 'level-prichalnyj', nameLocative: 'в «Level Причальный»', seoText: 'Дизайн и ремонт в «Level Причальный» (Level Group) — бизнес-класс в Хорошёво-Мнёвниках рядом с метро Шелепиха.' },
      { name: 'ЖК Headliner', slug: 'headliner', nameLocative: 'в ЖК «Headliner»', seoText: 'Ремонт квартир в ЖК «Headliner» — рядом с «Москва-Сити» в ЦАО. Современная архитектура и высокий инвестиционный потенциал.' },
      { name: 'ЖК Селигер Сити', slug: 'seliger-city', nameLocative: 'в «Селигер Сити»', seoText: 'Дизайн и ремонт в «Селигер Сити» — крупный жилой проект САО с парками, школами и коммерческими объектами.' },
      // --- Подмосковье ---
      { name: 'Барвиха', slug: 'barvikha', nameLocative: 'в Барвихе', seoText: 'Ремонт и дизайн загородных домов в Барвихе. Интеграция архитектуры в ландшафт соснового леса.' },
      { name: 'Новая Рига', slug: 'novaya-riga', nameLocative: 'на Новой Риге', seoText: 'Архитектурное проектирование и ремонт резиденций на Новой Риге. Загородный дом под ключ с продуманными инженерными системами.' },
      { name: 'Рублево-Успенское', slug: 'rublevo-uspenskoe', nameLocative: 'на Рублёво-Успенском', seoText: 'Проектирование и строительство домов на Рублёво-Успенском шоссе. Внимание к приватности и интеграции в ландшафт.' },
      { name: 'Красногорск', slug: 'krasnogorsk', nameLocative: 'в Красногорске', seoText: 'Дизайн и ремонт квартир в Красногорске. Один из ключевых городов Подмосковья с развитой инфраструктурой и транспортной доступностью.' },
      { name: 'Одинцово', slug: 'odintsovo', nameLocative: 'в Одинцово', seoText: 'Ремонт квартир и домов в Одинцово. Современные жилые комплексы и загородные резиденции западного направления.' },
      { name: 'Мытищи', slug: 'mytishchi', nameLocative: 'в Мытищах', seoText: 'Дизайн интерьеров и ремонт квартир в Мытищах. Быстро развивающийся город с новостройками комфорт и бизнес-класса.' },
      { name: 'Химки', slug: 'himki', nameLocative: 'в Химках', seoText: 'Ремонт и дизайн квартир в Химках — ближайший пригород Москвы с множеством новостроек и удобной транспортной сетью.' },
      { name: 'Реутов', slug: 'reutov', nameLocative: 'в Реутове', seoText: 'Дизайн интерьеров и ремонт в Реутове. Компактный город со своим метро и широким выбором новостроек.' },
      { name: 'Балашиха', slug: 'balashiha', nameLocative: 'в Балашихе', seoText: 'Ремонт квартир в Балашихе. Крупнейший город Подмосковья с активным строительством жилья комфорт-класса.' },
    ];
    for (const city of cities) {
      let existingUser = await strapi.documents('api::city.city').findFirst({ filters: { slug: city.slug } });
      if (!existingUser) {
        await strapi.documents('api::city.city').create({ data: city, status: 'published' });
      }
    }

    // 4.5 Seed Reviews
    const reviews = [
      {
        clientName: 'Алексей М.',
        text: 'Команда ARQO полностью взяла на себя реализацию проекта. Мы живем в другом городе и доверили им всё — от закупки материалов до технического надзора. Приехали в полностью готовую квартиру. Качество уровня 10/10.',
        rating: 5,
        location: 'ЖК "Символ"',
        service: seededServices[3]?.documentId // Fit-out
      },
      {
        clientName: 'Екатерина С.',
        text: 'Заказывали дизайн-проект квартиры в Хамовниках. Архитекторы очень чутко уловили наш вкус. Предложили теплый минимализм, сложные фактуры. Избавили от лишних коридоров. Очень довольны.',
        rating: 5,
        location: 'Хамовники',
        service: seededServices[1]?.documentId // Interior Design
      },
      {
        clientName: 'Дмитрий В.',
        text: 'Работали с ARQO по комплектации загородного дома. Организовали прямые поставки из Италии и сэкономили нам около 15% бюджета по сравнению с ценами московских салонов. Логистика сработала четко.',
        rating: 5,
        location: 'Новая Рига',
        service: seededServices[2]?.documentId // Procurement
      },
      {
        clientName: 'Ольга Р.',
        text: 'Ребята не просто делают ремонт, они строят архитектуру внутри квартиры. Сложные световые линии, идеальные теневые профили, скрытые двери — всё выполнено безукоризненно.',
        rating: 5,
        location: 'ЖК "Саларьево Парк"',
        service: seededServices[3]?.documentId // Fit-out
      },
      {
        clientName: 'Игорь К.',
        text: 'Заказывали архитектурное проектирование дома с нуля. Получили не просто красивую картинку, а глубоко проработанный проект с детальными спецификациями. Сейчас идет стройка, пока без сюрпризов.',
        rating: 4,
        location: 'Барвиха',
        service: seededServices[0]?.documentId // Architecture
      }
    ];
    for (const review of reviews) {
      let existingReview = await strapi.documents('api::review.review').findFirst({ filters: { clientName: review.clientName } });
      if (!existingReview) {
        await strapi.documents('api::review.review').create({ data: review, status: 'published' });
      }
    }


    // 5. Seed Articles - News & Trends 2026
    const articles = [
      {
        title: 'Конец эпохи белого: Встречаем "Теплый" Минимализм 2026',
        slug: 'warm-minimalism-2026-trends',
        content: `<h3>Почему стерильные интерьеры больше не актуальны?</h3>
        <p>Год 2026 окончательно закрепил уход от холодного, музейного минимализма. Люди устали от пространств, где страшно оставить след жизни. На смену белому и серому пришел "теплый минимализм" или "максимализм со смыслом".</p>
        <p><strong>Главные отличия:</strong></p>
        <ul>
            <li><strong>Текстуры вместо цвета.</strong> Мы используем терракотовую плитку, неровный натуральный камень, фактурные ткани (букле, крупный лен).</li>
            <li><strong>Винтаж и ремесло.</strong> Больше нет идеальных симметричных тумб. Есть уникальные предметы с историей и медленный декор ("slow decorating").</li>
            <li><strong>Глубокая палитра.</strong> Цвета становятся сложнее: кремовые, карамельные тона, глубокий цвет земли.</li>
        </ul>
        <p>В проектах ARQO мы комбинируем строгую, выверенную геометрию пространства с этими тактильными, живыми материалами, создавая интерьеры, в которых хочется жить долго.</p>`,
        author: seededEmployees[1]?.documentId
      },
      {
        title: 'Не просто экология: Эпоха Регенеративного Дизайна',
        slug: 'regenerative-architectural-design',
        content: `<h3>Дома, которые лечат планету</h3>
        <p>Архитектура претерпела колоссальный сдвиг. Долгие годы мы говорили о "нулевом выбросе" (net-zero) и использовании энергоэффективных систем. Но в 2026 году стало очевидно: создавать строения, которые "просто не наносят вреда" — недостаточно.</p>
        <p>Мы вступили в эру <strong>регенеративной архитектуры</strong>. Это подход, при котором здание не просто экономит энергию, а восстанавливает окружающую среду.</p>
        <ul>
            <li>Сбор и очистка дождевой воды для полива;</li>
            <li>Использование материалов с отрицательным углеродным следом (например, конопляный бетон (hempcrete) или панели из мицелия);</li>
            <li>Фасады, улавливающие CO2 из городского воздуха;</li>
        </ul>
        <p>Мы в бюро интегрируем эти принципы с самых ранних этапов эскизирования.</p>`,
        author: seededEmployees[0]?.documentId
      },
      {
        title: 'Hyper-smart здания: ИИ как невидимый сервис',
        slug: 'hyper-smart-buildings-ai',
        content: `<h3>Умный дом перестал быть игрушкой</h3>
        <p>Забудьте о включении лампочки со смартфона через Bluetooth. Современный умный дом 2026 года работает незаметно и предиктивно.</p>
        <p>Мы проектируем инженерные решения, где ИИ сам анализирует паттерны поведения жильцов и микроклимат.</p>
        <p><strong>Как это работает на практике:</strong> Алгоритмы анализируют данные с погодных станций, положение солнца, уровни CO2 и летучих органических соединений (VOC) в доме. К моменту, когда вы только просыпаетесь, система уже скорректировала работу приточных клапанов, опустила шторы на южной стороне, чтобы избежать перегрева через час, и настроила циркадное освещение.</p>
        <p>Наша команда обеспечивает бесшовную интеграцию KNX и профайлов ИИ прямо в черновую стадию проекта.</p>`,
        author: seededEmployees[2]?.documentId
      }
    ];

    for (const article of articles) {
      let existingUser = await strapi.documents('api::article.article').findFirst({ filters: { slug: article.slug } });
      if (!existingUser) {
        await strapi.documents('api::article.article').create({ data: article, status: 'published' });
      }
    }

    console.log('✅ Articles Seeded Successfully.');
    console.log('✅ MAX EXPANSION Data Seed Complete.');
  },
};
