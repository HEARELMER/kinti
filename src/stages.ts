/**
 * Datos educativos y estructura de etapas para "Kinti: una aventura por el Perú"
 * Diseñado pedagógicamente para estudiantes de secundaria con rigor histórico.
 */

export interface Discovery {
  id: string;
  name: string;
  shortLabel: string;
  x: number; // Posición horizontal en el escenario (en píxeles)
  bottomPercent: number; // Porcentaje de altura desde la base del escenario
  icon: string;
  dialogueSpeaker: string;
  dialogueText: string;
  didacticDetail: string;
  visualEffectClass: string;
}

export interface MatchPair {
  elementId: string;
  elementLabel: string;
  elementIcon: string;
  functionId: string;
  functionLabel: string;
  hint: string;
}

export interface ChoiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCorrect: boolean;
  feedback: string;
}

export interface SentenceBlankSlot {
  id: string;
  label: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    note?: string;
  }[];
}

export type ActivityType = 'matching' | 'destination_choice' | 'sentence_completion';

export interface StageActivity {
  type: ActivityType;
  title: string;
  instruction: string;
  // Matching activity (Caral)
  matchPairs?: MatchPair[];
  // Destination choice activity (Inca)
  destinationOptions?: ChoiceOption[];
  successExplanation?: string;
  // Sentence completion activity (Independencia)
  sentenceTemplate?: string; // "_____ proclamó la independencia del Perú en Lima el _____."
  slots?: SentenceBlankSlot[];
  postSuccessNote?: string;
}

export interface Stage {
  id: number;
  slug: string;
  name: string;
  periodBadge: string;
  yearSubtitle: string;
  mission: string;
  sceneryImage: string;
  worldWidth: number;
  kintiStartX: number;
  portalX: number;
  fragmentColor: string;
  fragmentTitle: string;
  fragmentDescription: string;
  discoveries: Discovery[];
  activity: StageActivity;
  summaryMemory: string;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    slug: 'caral',
    name: 'Caral',
    periodBadge: 'Destino 1 · 3000 a.C.',
    yearSubtitle: 'Barranca · Valle de Supe',
    mission: 'Descubre cómo vivían los habitantes de Caral.',
    sceneryImage: 'assets/escenario_caral.png',
    worldWidth: 1900,
    kintiStartX: 120,
    portalX: 1780,
    fragmentColor: '#FBBF24', // Dorado
    fragmentTitle: 'Fragmento de la Sabiduría Solar',
    fragmentDescription: 'Simboliza la arquitectura monumental y el florecimiento del valle de Supe.',
    summaryMemory: 'En Caral (3000 a.C.), la civilización más antigua de América, el trabajo colectivo y el agua del río Supe permitieron levantar centros ceremoniales y campos fértiles en pleno desierto.',
    discoveries: [
      {
        id: 'caral-rio',
        name: 'Río y cultivos',
        shortLabel: 'Río y cultivos',
        x: 460,
        bottomPercent: 26,
        icon: 'water',
        dialogueSpeaker: 'Poblador de Supe',
        dialogueText: '“El agua del valle permitía cultivar en un entorno desértico.”',
        didacticDetail: 'Aprovecharon el caudal del río Supe con canales de regadío para sembrar algodón, zapallo, camote y frijoles en tierras áridas.',
        visualEffectClass: 'fx-water-ripple',
      },
      {
        id: 'caral-plaza',
        name: 'Plaza circular',
        shortLabel: 'Plaza circular',
        x: 980,
        bottomPercent: 32,
        icon: 'circle',
        dialogueSpeaker: 'Poblador de Supe',
        dialogueText: '“Las plazas eran espacios de encuentro y actividades ceremoniales.”',
        didacticDetail: 'Las plazas circulares hundidas congregaban a las comunidades para celebraciones cívicas y rituales acompañados con flautas de hueso de pelícano.',
        visualEffectClass: 'fx-plaza-glow',
      },
      {
        id: 'caral-edificios',
        name: 'Grandes construcciones',
        shortLabel: 'Construcciones',
        x: 1480,
        bottomPercent: 40,
        icon: 'pyramid',
        dialogueSpeaker: 'Poblador de Supe',
        dialogueText: '“Los grandes edificios muestran la organización y el trabajo colectivo de sus habitantes.”',
        didacticDetail: 'Construyeron pirámides con shicras (bolsas vegetales de fibra que contenían piedras), demostrando ingeniería antisísmica y orden comunitario.',
        visualEffectClass: 'fx-pyramid-shine',
      },
    ],
    activity: {
      type: 'matching',
      title: 'Relaciona elementos y funciones',
      instruction: 'Selecciona primero un elemento de Caral y luego su función correspondiente:',
      matchPairs: [
        {
          elementId: 'elem-rio',
          elementLabel: 'Río y valle',
          elementIcon: 'water',
          functionId: 'func-cultivos',
          functionLabel: 'Agua para los cultivos',
          hint: 'Recuerda qué elemento llevaba agua para regar la tierra en medio del desierto.',
        },
        {
          elementId: 'elem-plaza',
          elementLabel: 'Plaza circular',
          elementIcon: 'circle',
          functionId: 'func-ceremonias',
          functionLabel: 'Encuentros y ceremonias',
          hint: 'Las plazas eran espacios amplios donde la comunidad se reunía para ritos y festividades.',
        },
        {
          elementId: 'elem-edificios',
          elementLabel: 'Grandes construcciones',
          elementIcon: 'pyramid',
          functionId: 'func-organizacion',
          functionLabel: 'Trabajo organizado',
          hint: 'Levantar pirámides y terrazas monumentales requirió la coordinación de miles de personas.',
        },
      ],
      successExplanation: '¡Excelente relación histórica! Has comprobado cómo el río, las plazas y las pirámides reflejaban la vida y organización de Caral.',
    },
  },
  {
    id: 1,
    slug: 'inca',
    name: 'Mundo Inca',
    periodBadge: 'Destino 2 · Siglo XV',
    yearSubtitle: 'Cordillera de los Andes · Tahuantinsuyo',
    mission: 'Ayuda a un chasqui a entregar un mensaje.',
    sceneryImage: 'assets/escenario_inca.png',
    worldWidth: 1900,
    kintiStartX: 120,
    portalX: 1780,
    fragmentColor: '#14B8A6', // Turquesa
    fragmentTitle: 'Fragmento de la Red Andina',
    fragmentDescription: 'Representa el Qhapaq Ñan, la comunicación veloz de los chasquis y la tecnología agrícola.',
    summaryMemory: 'En el Tahuantinsuyo (s. XV), el Qhapaq Ñan integró miles de kilómetros de territorio andino mediante el relevo ágil de los chasquis y la ingeniería de andenes agrícolas.',
    discoveries: [
      {
        id: 'inca-camino',
        name: 'Qhapaq Ñan',
        shortLabel: 'Qhapaq Ñan',
        x: 480,
        bottomPercent: 26,
        icon: 'road',
        dialogueSpeaker: 'Chasqui Wayna',
        dialogueText: '“Esta red de caminos conectaba distintos territorios del Tahuantinsuyo.”',
        didacticDetail: 'El Qhapaq Ñan articuló más de 30,000 kilómetros uniendo la costa, sierra y selva alta con puentes colgantes, empedrados y tambos de descanso.',
        visualEffectClass: 'fx-road-gold',
      },
      {
        id: 'inca-chasqui',
        name: 'Chasqui',
        shortLabel: 'Chasqui',
        x: 1000,
        bottomPercent: 32,
        icon: 'running',
        dialogueSpeaker: 'Chasqui Wayna',
        dialogueText: '“Los chasquis transportaban mensajes y se relevaban a lo largo del camino.”',
        didacticDetail: 'Corredores entrenados llevaban quipus con datos y mensajes orales oficiales. Cada chasqui corría un tramo corto y entregaba el mensaje a su relevo.',
        visualEffectClass: 'fx-chasqui-dash',
      },
      {
        id: 'inca-andenes',
        name: 'Andenes',
        shortLabel: 'Andenes',
        x: 1500,
        bottomPercent: 38,
        icon: 'terraces',
        dialogueSpeaker: 'Chasqui Wayna',
        dialogueText: '“Las terrazas permitían cultivar en las laderas de las montañas.”',
        didacticDetail: 'Los andenes creaban plataformas escalonadas que evitaban la erosión de las laderas, retenían calor nocturno y multiplicaban el alimento del imperio.',
        visualEffectClass: 'fx-terrace-green',
      },
    ],
    activity: {
      type: 'destination_choice',
      title: 'El relevo del mensaje',
      instruction: '¿A quién debe entregar el chasqui el mensaje para que siga su recorrido con máxima rapidez?',
      destinationOptions: [
        {
          id: 'opt-otro-chasqui',
          title: 'Otro chasqui en un punto de relevo',
          description: 'Un compañero preparado en un tambo para continuar la carrera sin descanso.',
          icon: 'running',
          isCorrect: true,
          feedback: '¡Correcto! El sistema de postas funcionaba mediante relevos inmediatos: un chasqui descansaba mientras el siguiente salía corriendo a gran velocidad.',
        },
        {
          id: 'opt-terraza',
          title: 'Una terraza de cultivo (andén)',
          description: 'Dejar el quipu sobre una planta de maíz o papa en la ladera.',
          icon: 'terraces',
          isCorrect: false,
          feedback: 'Los andenes eran espacios agrícolas de producción de alimentos, no estaciones de comunicación.',
        },
        {
          id: 'opt-roca',
          title: 'Una roca junto al camino',
          description: 'Dejar el mensaje apoyado en una piedra del Qhapaq Ñan.',
          icon: 'stone',
          isCorrect: false,
          feedback: 'El mensaje necesita una persona entrenada que lo memorice o transporte de inmediato para no perderse.',
        },
      ],
      successExplanation: 'El chasqui entregó el quipu a su relevo en el tambo y la información continúa velozmente por la cordillera andina hacia el Cusco.',
    },
  },
  {
    id: 2,
    slug: 'independencia',
    name: 'Independencia',
    periodBadge: 'Destino 3 · 1821',
    yearSubtitle: 'Plaza Mayor de Lima · Emancipación',
    mission: 'Reúne las pistas de un momento histórico.',
    sceneryImage: 'assets/escenario_independencia.png',
    worldWidth: 1900,
    kintiStartX: 120,
    portalX: 1780,
    fragmentColor: '#FB7185', // Coral
    fragmentTitle: 'Fragmento de la Libertad Cívica',
    fragmentDescription: 'Representa la proclamación cívica de Lima y el proceso hacia la independencia.',
    summaryMemory: 'El 28 de julio de 1821 en la Plaza Mayor de Lima, José de San Martín proclamó la independencia del Perú, abriendo una etapa crucial que se consolidó en los años siguientes.',
    discoveries: [
      {
        id: 'indep-personaje',
        name: 'Personaje',
        shortLabel: 'San Martín',
        x: 480,
        bottomPercent: 30,
        icon: 'person',
        dialogueSpeaker: 'Mariana (Vecina de Lima 1821)',
        dialogueText: '“José de San Martín proclamó la independencia del Perú en Lima.”',
        didacticDetail: 'El libertador lideró la Expedición Libertadora y el 28 de julio de 1821 subió al tabladillo en la Plaza Mayor ante una multitud congregada.',
        visualEffectClass: 'fx-libertador-glow',
      },
      {
        id: 'indep-fecha',
        name: 'Fecha',
        shortLabel: '28 de julio de 1821',
        x: 1000,
        bottomPercent: 32,
        icon: 'calendar',
        dialogueSpeaker: 'Mariana (Vecina de Lima 1821)',
        dialogueText: '“La proclamación se realizó el 28 de julio de 1821.”',
        didacticDetail: 'Ese sábado de invierno limeño se leyó la solemne declaración en cuatro plazas de la ciudad: Plaza Mayor, La Merced, Santa Ana y la Inquisición.',
        visualEffectClass: 'fx-calendar-shine',
      },
      {
        id: 'indep-lugar',
        name: 'Lugar',
        shortLabel: 'Plaza Mayor',
        x: 1480,
        bottomPercent: 34,
        icon: 'plaza',
        dialogueSpeaker: 'Mariana (Vecina de Lima 1821)',
        dialogueText: '“La Plaza Mayor de Lima fue uno de los escenarios de la proclamación.”',
        didacticDetail: 'Rodeada de casonas y balcones de madera, la Plaza Mayor albergó a ciudadanos de diversos orígenes en una jornada de esperanza y júbilo.',
        visualEffectClass: 'fx-balcony-sparkle',
      },
    ],
    activity: {
      type: 'sentence_completion',
      title: 'Completa la frase histórica',
      instruction: 'Selecciona el personaje y la fecha correctos para reconstruir el hecho histórico:',
      sentenceTemplate: '{slot1} proclamó la independencia del Perú en Lima el {slot2}.',
      slots: [
        {
          id: 'slot1',
          label: 'Personaje histórico',
          options: [
            {
              id: 'san-martin',
              text: 'José de San Martín',
              isCorrect: true,
              note: 'Libertador y protector del Perú en 1821.',
            },
            {
              id: 'miguel-grau',
              text: 'Miguel Grau',
              isCorrect: false,
              note: 'Héroe naval de la Guerra del Pacífico (1879), décadas después.',
            },
            {
              id: 'francisco-pizarro',
              text: 'Francisco Pizarro',
              isCorrect: false,
              note: 'Conquistador español del siglo XVI (1532).',
            },
          ],
        },
        {
          id: 'slot2',
          label: 'Fecha exacta',
          options: [
            {
              id: '28-julio-1821',
              text: '28 de julio de 1821',
              isCorrect: true,
              note: 'Día solemne de la proclamación en la Plaza Mayor de Lima.',
            },
            {
              id: '9-diciembre-1824',
              text: '9 de diciembre de 1824',
              isCorrect: false,
              note: 'Fecha de la Batalla de Ayacucho, que selló militarmente la independencia.',
            },
            {
              id: '28-julio-1921',
              text: '28 de julio de 1921',
              isCorrect: false,
              note: 'Centenario de la independencia, un siglo después.',
            },
          ],
        },
      ],
      postSuccessNote: 'La proclamación fue un momento clave; el proceso de independencia continuó después de 1821.',
      successExplanation: '¡Frase completada con rigor histórico!',
    },
  },
];

export interface HistoricalSource {
  entity: string;
  topic: string;
  detail: string;
  referenceUrlText: string;
}

export const HISTORICAL_SOURCES: HistoricalSource[] = [
  {
    entity: 'Zona Arqueológica Caral (ZAC)',
    topic: 'Civilización Caral (3000 a.C.)',
    detail: 'Unidad Ejecutora 003 del Ministerio de Cultura del Perú. Investigaciones sobre la arquitectura cívico-ceremonial, la plaza circular hundida, la técnica constructiva de shicras y la agricultura de regadío en el valle de Supe.',
    referenceUrlText: 'zonacaral.gob.pe · Ministerio de Cultura',
  },
  {
    entity: 'Proyecto Especial Qhapaq Ñan - Sede Nacional',
    topic: 'Red Vial Incaica y Sistema de Chasquis (S. XV)',
    detail: 'Ministerio de Cultura del Perú. Documentación del sistema vial andino declarado Patrimonio Mundial por la UNESCO en 2014, el funcionamiento de postas y tambos, y la tecnología de andenes.',
    referenceUrlText: 'qhapaqnan.cultura.pe · Ministerio de Cultura',
  },
  {
    entity: 'Proyecto Especial Bicentenario / Biblioteca Nacional del Perú (BNP)',
    topic: 'Proclamación de la Independencia (1821)',
    detail: 'Archivo General de la Nación y BNP. Acta de la Declaración de la Independencia de Lima (15 de julio de 1821) y documentos históricos de la proclamación del 28 de julio de 1821 por José de San Martín.',
    referenceUrlText: 'bicentenario.gob.pe · bnp.gob.pe',
  },
];
