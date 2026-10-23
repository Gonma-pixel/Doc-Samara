import { DentalService, Testimonial } from '../types';

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'carillas-estetica',
    title: 'Diseño de Sonrisa & Carillas',
    category: 'estetica',
    categoryLabel: 'Estética Dental',
    shortDesc: 'Carillas ultrafinas de porcelana pura o composite estratificado para una armonía dental perfecta.',
    fullDesc: 'Tratamiento de alta precisión donde la Dra. Samara planifica digitalmente cada detalle facial antes de iniciar. Las carillas de disilicato de litio respetan el esmalte natural sin desgastes innecesarios, devolviendo brillo, proporción y blancura duradera.',
    duration: '60 - 90 min por sesión',
    sessions: '2 a 3 sesiones',
    discomfortLevel: '0/10 (Procedimiento mínimamente invasivo sin dolor)',
    keyBenefits: [
      'Simulación 3D digital previa para ver tu resultado final antes de empezar',
      'Porcelana biomimética con translucidez y textura idéntica al diente natural',
      'Resistencia a manchas de café, té o vino con durabilidad de más de 15 años',
      'Cierre de diastemas (espacios) y alineación visual inmediata'
    ],
    techUsed: ['Escáner Intraoral 3D', 'Software DSD (Digital Smile Design)', 'Fresado CAD/CAM'],
    idealFor: 'Personas con dientes manchados, desgastados, pequeños o con espacios que buscan una sonrisa radiante y natural.'
  },
  {
    id: 'ortodoncia-invisible',
    title: 'Ortodoncia Invisible',
    category: 'estetica',
    categoryLabel: 'Alineación Dental',
    shortDesc: 'Alineadores transparentes removibles, cómodos e imperceptibles con tecnología de escaneo 3D.',
    fullDesc: 'Corrige la posición de tus dientes sin brackets metálicos ni heridas. Mediante un mapa computarizado milimétrico, se diseñan una serie de férulas ultra transparentes que mueven gradualmente cada pieza a su posición ideal con máxima higiene.',
    duration: 'Revisiones cada 4 a 6 semanas (30 min)',
    sessions: 'Tratamiento completo de 6 a 14 meses según el caso',
    discomfortLevel: '1/10 (Ligera presión durante las primeras 24h con cada nuevo alineador)',
    keyBenefits: [
      '100% invisibles en el día a día y removibles para comer y cepillarte con total libertad',
      'Sin llagas, sin alambres que pinchen y sin restricciones alimenticias',
      'Visualización de todo el progreso en video 3D antes del primer par',
      'Menor tiempo de consulta y visitas más espaciadas'
    ],
    techUsed: ['Escáner Óptico de Alta Definición', 'Biopolímeros médicos multicapa'],
    idealFor: 'Adultos y jóvenes que desean alinear sus dientes discretamente sin alterar su vida social o profesional.'
  },
  {
    id: 'blanqueamiento-laser',
    title: 'Blanqueamiento Dental Láser',
    category: 'estetica',
    categoryLabel: 'Brillo & Luminosidad',
    shortDesc: 'Aclara hasta 6 tonos en una sola sesión clínica mediante luz activada y protectores de esmalte.',
    fullDesc: 'Un protocolo exclusivo de la Dra. Samara que combina peróxido medicinal estabilizado con fotoactivación LED fría. Elimina pigmentaciones profundas acumuladas durante años protegiendo la pulpa y evitando la sensibilidad dental pos-tratamiento.',
    duration: '45 - 60 minutos',
    sessions: '1 sesión clínica + kit de mantenimiento en casa',
    discomfortLevel: '0/10 (Fórmula enriquecida con nano-hidroxiapatita anti-sensibilidad)',
    keyBenefits: [
      'Resultados visibles al instante desde el primer minuto al salir del consultorio',
      'Seguro para el esmalte: no altera la estructura molecular del diente',
      'Sellado de túbulos dentinarios para una experiencia 100% confortable',
      'Guía personalizada de nutrición y cuidados post-blanqueamiento'
    ],
    techUsed: ['Lámpara LED médica de longitud de onda selectiva', 'Gel con nitrato de potasio'],
    idealFor: 'Quienes desean una sonrisa más blanca, joven y radiante para un evento especial o rejuvenecimiento facial.'
  },
  {
    id: 'implantes-carga',
    title: 'Implantes & Cirugía Guiada',
    category: 'rehabilitacion',
    categoryLabel: 'Rehabilitación Oral',
    shortDesc: 'Reposición de piezas perdidas con titanio grado médico y coronas de circonio sobre implante.',
    fullDesc: 'Recupera la capacidad masticatoria y la estética de una pieza dental completa. Empleamos cirugía guiada por tomografía computarizada (CBCT), lo que permite colocar el implante sin incisiones amplias ni puntos traumáticos, con cicatrización ultrarrápida.',
    duration: '45 min por implante',
    sessions: 'Planificación + Colocación + Corona definitiva',
    discomfortLevel: '0/10 (Anestesia local computerizada sin pinchazo doloroso)',
    keyBenefits: [
      'Sensación, fuerza y apariencia exactamente idéntica a tus dientes biológicos',
      'Previene la reabsorción del hueso maxilar y el envejecimiento del tercio inferior del rostro',
      'Integración ósea garantizada con marcas líderes certificadas mundialmente',
      'Posibilidad de carga inmediata (diente provisional en el mismo día)'
    ],
    techUsed: ['Tomografía Volumétrica 3D', 'Guías Quirúrgicas Impresas en Resina Médica', 'Circonio Monolítico'],
    idealFor: 'Pacientes con una o varias piezas ausentes o con dientes no restaurables que buscan una solución definitiva y estable para toda la vida.'
  },
  {
    id: 'endodoncia-microscopica',
    title: 'Endodoncia Microscópica',
    category: 'rehabilitacion',
    categoryLabel: 'Salud Pulpar',
    shortDesc: 'Preservación de dientes con daño en el nervio mediante microscopio quirúrgico y desinfección láser.',
    fullDesc: 'Salvar tu diente natural es siempre la prioridad de la Dra. Samara. Gracias al microscopio con magnificación 20x, se localizan conductos anatómicos complejos que a simple vista pasan desapercibidos, limpiando minuciosamente la infección con sellado biocompatible.',
    duration: '60 - 75 minutos',
    sessions: 'Normalmente 1 sola sesión',
    discomfortLevel: '0/10 (Tratamiento indoloro gracias a la microinstrumentación rotatoria)',
    keyBenefits: [
      'Conserva tu raíz y hueso propio evitando la necesidad de extracción',
      'Alivio inmediato del dolor agudo o inflamación pulpar',
      'Sellado tridimensional termoplástico que impide la recolonización bacteriana',
      'Control radiográfico digital con mínima exposición a rayos'
    ],
    techUsed: ['Microscopio Dental Óptico', 'Limas Rotatorias NiTi de memoria elástica', 'Localizador apical digital'],
    idealFor: 'Personas con dolor pulsátil, sensibilidad extrema o caries profundas que amenazan la raíz dental.'
  },
  {
    id: 'limpieza-airflow',
    title: 'Profilaxis Profunda & Airflow',
    category: 'preventiva',
    categoryLabel: 'Prevención & Salud',
    shortDesc: 'Eliminación de biofilm, sarro y manchas con ultrasonido inteligente y micropartículas de eritritol.',
    fullDesc: 'Una experiencia de spa dental: el sistema Airflow utiliza un chorro tibio de aire, agua purificada y polvo ultrafino biodegradable que desorganiza la placa bacteriana incluso debajo de la encía sin rayar el esmalte ni producir dolor.',
    duration: '40 minutos',
    sessions: '1 sesión semestral recomendada',
    discomfortLevel: '0/10 (Agua a temperatura corporal que elimina la sensación de frío)',
    keyBenefits: [
      'Remoción completa de manchas causadas por café, tabaco, té o infusiones',
      'Prevención activa contra la gingivitis y la periodontitis (sangrado de encías)',
      'Sensación de frescura, limpieza y suavidad extrema en todas las superficies',
      'Incluye fluoración protectora y asesoría de cepillado técnico'
    ],
    techUsed: ['Sistema Airflow Suizo', 'Ultrasonido Piezoeléctrico', 'Cámara Intraoral de diagnóstico'],
    idealFor: 'Mantenimiento regular de toda persona que desee mantener sus encías sanas y su aliento fresco.'
  },
  {
    id: 'odontopediatria-samara',
    title: 'Odontopediatría Respetuosa',
    category: 'infantil',
    categoryLabel: 'Odontología Infantil',
    shortDesc: 'Cuidado dental amoroso, sin lágrimas ni miedo, diseñado para que los niños amen ir al dentista.',
    fullDesc: 'La Dra. Samara crea un espacio de confianza y calma donde cada pequeño aprende a cuidar su sonrisa jugando. Realizamos sellantes de fosas para blindar contra caries, aplicaciones de flúor bioactivo y seguimiento del desarrollo de los maxilares.',
    duration: '35 - 45 minutos',
    sessions: 'Control periódico cada 6 meses',
    discomfortLevel: '0/10 (Técnicas de manejo de conducta positivo y estimulación lúdica)',
    keyBenefits: [
      'Cero traumas infantiles: ambiente cálido con juegos y explicaciones amigables',
      'Prevención temprana de maloclusiones y malos hábitos de deglución o respiración',
      'Sellantes protectores que reducen hasta un 80% el riesgo de caries en molares',
      'Certificado de valentía y premio especial para cada niño'
    ],
    techUsed: ['Materiales bioactivos liberadores de flúor', 'Lentes de realidad aumentada / pantallas infantiles'],
    idealFor: 'Bebés, niños y adolescentes desde la aparición del primer diente de leche.'
  },
  {
    id: 'rehabilitacion-completa',
    title: 'Rehabilitación Oral & Zirconio',
    category: 'rehabilitacion',
    categoryLabel: 'Reconstrucción Funcional',
    shortDesc: 'Restauración integral de la masticación, estética y altura facial en casos de desgaste severo.',
    fullDesc: 'Para pacientes con bruxismo acentuado, pérdida de dimensión vertical o múltiples piezas deterioradas. Diseñamos una oclusión equilibrada con prótesis fijas sobre dientes o implantes confeccionadas en zirconio multicapa de máxima biocompatibilidad.',
    duration: 'Planificado en fases coordinadas',
    sessions: 'Evaluación exhaustiva y 3 a 4 fases',
    discomfortLevel: '0/10 (Planificado con sedación consciente si el paciente lo prefiere)',
    keyBenefits: [
      'Alivio de dolores en la articulación temporomandibular (ATM), cuello y cabeza',
      'Recuperación de la juventud del rostro al restablecer el soporte labial',
      'Materiales cerámicos libres de metal que nunca dejan bordes oscuros en la encía',
      'Garantía clínica por escrito'
    ],
    techUsed: ['Articulador Virtual 3D', 'Zirconio Translúcido Multicapa', 'Férulas de Michigan digitales'],
    idealFor: 'Personas con desgaste dental generalizado por bruxismo o pérdidas dentales múltiples.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    patientName: 'Valeria Mendoza',
    treatment: 'Diseño de Sonrisa & Carillas',
    text: 'Tenía pánico al dentista desde niña y escondía mi sonrisa en las fotos. La Dra. Samara me escuchó con una empatía increíble. El proceso fue completamente sin dolor y el resultado superó todo lo que soñé: mis carillas se ven 100% naturales.',
    rating: 5,
    timeAgo: 'Hace 2 semanas',
    verified: true
  },
  {
    id: 't2',
    patientName: 'Carlos Eduardo Ramos',
    treatment: 'Ortodoncia Invisible',
    text: 'Por mi trabajo en reuniones ejecutivas no quería brackets tradicionales. Con los alineadores invisibles de la Dra. Samara nadie notó que los llevaba puestos. En 9 meses mis dientes quedaron perfectamente alineados.',
    rating: 5,
    timeAgo: 'Hace 1 mes',
    verified: true
  },
  {
    id: 't3',
    patientName: 'Mariana & su hijo Lucas (6 años)',
    treatment: 'Odontopediatría Respetuosa',
    text: 'Lucas lloraba en cualquier consultorio médico. Con la Dra. Samara entró curioso y salió sonriendo con su cepillo de superhéroe. Ahora él mismo me pide ir a su revisión dental. La paciencia de la doctora es infinita.',
    rating: 5,
    timeAgo: 'Hace 3 semanas',
    verified: true
  },
  {
    id: 't4',
    patientName: 'Dr. Alejandro Silva',
    treatment: 'Blanqueamiento Láser & Airflow',
    text: 'Como médico aprecio la rigurosidad clínica, esterilización y tecnología de punta. El blanqueamiento no me generó nada de sensibilidad y el tono quedó impecable. La clínica transmite una paz absoluta.',
    rating: 5,
    timeAgo: 'Hace 1 mes',
    verified: true
  }
];

export const FAQ_ITEMS = [
  {
    question: '¿Los tratamientos con la Dra. Samara duelen?',
    answer: 'No. En nuestra clínica aplicamos un estricto protocolo de "Odontología Cero Dolor". Contamos con anestesia local computarizada guiada que administra el fármaco a velocidad microscópica, eliminando la sensación del pinchazo clásico. Además, empleamos tecnología láser y magnificación que minimizan la invasión tisular.'
  },
  {
    question: '¿Cómo funciona la primera consulta de diagnóstico?',
    answer: 'La primera consulta dura aproximadamente 45 minutos. Incluye escaneo intraoral 3D de alta definición, serie fotográfica clínica, evaluación de salud gingival y una conversación pausada con la Dra. Samara para comprender tus objetivos. Saldrás con un plan de tratamiento claro, con tiempos y opciones personalizadas.'
  },
  {
    question: '¿Qué garantía tienen las carillas y los implantes?',
    answer: 'Nuestras carillas de porcelana y coronas de zirconio cuentan con garantía de materiales y adaptación clínica. Los implantes de titanio son de gamas europeas líderes con garantía de osteointegración de por vida en condiciones normales de higiene y revisiones periódicas.'
  },
  {
    question: '¿Puedo pagar en cuotas o con seguro dental?',
    answer: 'Sí. Ofrecemos planes de financiamiento sin intereses en cuotas flexibles con tarjetas de crédito y emitimos facturación médica detallada para el reembolso con tu compañía aseguradora nacional o internacional.'
  },
  {
    question: '¿Cómo llegar a la clínica de la Dra. Samara?',
    answer: 'Nuestra clínica está ubicada en una zona céntrica y segura con estacionamiento privado para pacientes. Atendemos de lunes a viernes de 8:30 a 20:00 y sábados de 9:00 a 14:00.'
  }
];
