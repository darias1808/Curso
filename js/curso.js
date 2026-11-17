/*
  Contenido del curso, en el orden del esquema.
  Cada sección tiene pasos a pantalla completa. Tipos de paso:
    portada · video · lectura · faq · documento · enlace · mapa · parejas · vf · clasificar · opcion · completar · palabra · ordenar · fin
  Para publicar las evaluaciones, el foro o la encuesta, pega el enlace en "url" del paso de tipo "enlace".
*/
window.CURSO = {
  titulo: "Curso de Ética Profesional",
  institucion: "Colegio de Ciencias Económicas de Costa Rica",
  clave: "curso-etica-v1", // nombre con el que se guarda el avance en el navegador
  secciones: [
    {
      id: "s1",
      numero: "1",
      titulo: "Información importante",
      pasos: [
        {
          tipo: "portada",
          id: "s1-portada",
          texto: "Conoce cómo funciona el curso, cómo saber si aprobaste y qué sigue después: la juramentación. Desliza hacia arriba o usa la flecha para avanzar.",
        },
        {
          tipo: "faq",
          id: "s1-faq",
          titulo: "Preguntas frecuentes",
          preguntas: [
            {
              p: "¿Cuál es la duración del curso virtual?",
              r: ["El curso tiene una duración aproximada de 5 horas; sin embargo, la Oficina de Incorporaciones, mediante la convocatoria remitida a su correo personal, le indicará el horario establecido para que pueda realizarlo."],
            },
            {
              p: "¿Cuántas veces puedo ingresar a la Plataforma Virtual para realizar el curso?",
              r: ["Usted podrá ingresar las veces que desee durante las 24 horas del día, siempre y cuando sea durante los días establecidos por la Oficina de Incorporaciones (esta información la podrá encontrar en la convocatoria)."],
            },
            {
              p: "¿Cómo estoy seguro de si aprobé las actividades?",
              r: [
                "Las actividades de los módulos tendrán una nota mínima para ser aprobadas; esta nota la encontrará en las instrucciones de cada actividad.",
                "Usted tendrá 3 intentos para contestar correctamente.",
                "En caso de que no conteste correctamente en los 3 intentos establecidos, no podrá aprobar el curso y deberá esperar a ser convocado en el próximo mes (si es su primera convocatoria).",
                "La barra de avance le permitirá identificar si aprobó o no cada actividad.",
              ],
            },
            {
              p: "¿Dónde puedo encontrar las respuestas de cada actividad asignada?",
              r: ["Las respuestas las encontrará en los diferentes videos y lecturas correspondientes a cada módulo."],
            },
            {
              p: "¿Cómo puedo estar seguro de si finalicé el curso?",
              r: ["La barra de avance, en la parte superior, se completa a medida que termina cada sección. Desde el botón «Índice» puede ver qué secciones completó y cuáles tiene pendientes."],
            },
            {
              p: "¿La plataforma me enviará un mensaje automático de finalización del curso?",
              r: ["No. La plataforma no remite mensajes automáticos de finalización; la barra de avance es el indicador principal para saber si finalizó el curso o si tiene tareas pendientes."],
            },
            {
              p: "¿Después de finalizar el curso, qué procede?",
              r: ["Deberá esperar a que la Oficina de Incorporaciones le convoque formalmente a la juramentación virtual."],
            },
            {
              p: "¿Cuáles son los requerimientos para la juramentación virtual?",
              r: [
                "Deberá tener descargada la aplicación ZOOM con suficiente antelación.",
                "La cuenta de ZOOM deberá ser personal; no se aprobará la incorporación al Colegio si se utilizan cuentas de terceras personas.",
                "El día de la juramentación deberá tener buena conexión a internet, y es obligatorio mantener la cámara encendida.",
              ],
            },
            {
              p: "¿Cuál es el medio de notificación de la convocatoria a la juramentación?",
              r: ["La convocatoria se remitirá a su correo electrónico personal (el facilitado en el formulario de incorporación) y, adicionalmente, se le enviará un mensaje de texto."],
            },
            {
              p: "¿Cuál es la duración del evento de juramentación virtual?",
              r: ["El evento tiene una duración aproximada de 1 hora."],
            },
            {
              p: "¿Cómo obtendré mi certificado y carnet de incorporación?",
              r: [
                "El certificado y el carnet de incorporación se emitirán únicamente de manera digital, una vez que cumpla con el requisito de juramentación; estas credenciales le serán notificadas por correo electrónico.",
                "El certificado será emitido con firma digital, por lo que tendrá validez legal para todos sus efectos.",
              ],
            },
          ],
        },
        {
          tipo: "ordenar",
          id: "s1-ordenar",
          pregunta: "¿Qué sigue después de terminar el curso?",
          instruccion: "Toca los pasos en el orden en que pasan.",
          items: [
            "Termino todas las actividades del curso",
            "Me llega la convocatoria al correo personal y por mensaje de texto",
            "Me conecto a la juramentación virtual en ZOOM, con la cámara encendida",
            "Recibo el certificado y el carnet digitales por correo",
          ],
        },
      ],
    },
    {
      id: "s2",
      numero: "2",
      titulo: "Video institucional",
      pasos: [
        {
          tipo: "portada",
          id: "s2-portada",
          sub: "En esta sección",
          texto: "Conoce la historia, la estructura y los servicios del Colegio de Ciencias Económicas de Costa Rica.",
        },
        {
          tipo: "video",
          id: "institucional",
          titulo: "Conoce el Colegio",
          fuente: "media/video/institucional.mp4",
          portada: "media/img/institucional.jpg",
          subtitulos: "media/subtitulos/institucional.vtt",
          leer: { titulo: "Video institucional", texto: "Presentación del Colegio de Ciencias Económicas de Costa Rica." },
        },
        {
          tipo: "palabra",
          id: "s2-palabra",
          pregunta: "Completa la palabra",
          instruccion: "Toca las letras en orden para completar cada frase.",
          frases: [
            { antes: "Desde 2019, el Colegio cuenta con el", palabra: "CIDE", despues: ", su Centro de Innovación y Desarrollo Empresarial." },
            { antes: "En la plataforma digital Mi", palabra: "COLEGIO", mostrar: "Colegio", despues: "puede pagar la colegiatura y emitir su carnet." },
          ],
        },
      ],
    },
    {
      id: "s3",
      numero: "3",
      titulo: "Revista",
      pasos: [
        {
          tipo: "portada",
          id: "s3-portada",
          sub: "En esta sección",
          texto: "La revista de bienvenida del Colegio para las personas que se incorporan.",
        },
        {
          tipo: "documento",
          id: "revista",
          titulo: "Revista Punto 3",
          texto: "La bienvenida del Colegio a las personas que se incorporan: beneficios, servicios y deberes de la colegiatura.",
          archivo: "media/docs/revista-punto3.pdf",
          detalle: "PDF · 16 MB",
        },
      ],
    },
    {
      id: "s4",
      numero: "4",
      titulo: "Fiscalía",
      pasos: [
        {
          tipo: "portada",
          id: "s4-portada",
          sub: "En esta sección",
          texto: "La Fiscalía del Colegio explica qué es un colegio profesional, el ejercicio ilegal de la profesión y cómo presentar una denuncia.",
        },
        {
          tipo: "video",
          id: "fiscalia",
          titulo: "La Fiscalía del Colegio",
          fuente: "media/video/fiscalia.mp4",
          portada: "media/img/fiscalia.jpg",
          subtitulos: "media/subtitulos/fiscalia.vtt",
          leer: {
            titulo: "La Fiscalía",
            texto: "Qué es un colegio profesional, la Ley 9529 y la Fiscalía, el ejercicio ilegal de la profesión, las causas de suspensión, cómo presentar una denuncia y preguntas frecuentes sobre la incorporación.",
          },
        },
        {
          tipo: "palabra",
          id: "s4-palabra",
          pregunta: "Completa la palabra",
          instruccion: "Toca las letras en orden para completar cada frase.",
          frases: [
            { antes: "No basta con tener un título universitario: para ejercer hay que estar", palabra: "AGREMIADO", mostrar: "agremiado", despues: "al colegio profesional." },
            { antes: "La Fiscalía no es un órgano", palabra: "SANCIONADOR", mostrar: "sancionador", despues: ": la sanción la impone la Junta Directiva." },
          ],
        },
      ],
    },
    {
      id: "s5",
      numero: "5",
      titulo: "Bienvenida: Módulos de Ética Profesional",
      pasos: [
        {
          tipo: "portada",
          id: "s5-portada",
          sub: "En esta sección",
          texto: "Te damos la bienvenida a los tres módulos de ética: social, ambiental y profesional.",
        },
        {
          tipo: "video",
          id: "intro",
          titulo: "Bienvenida al curso de Ética Profesional",
          fuentes: { vertical: "media/video/intro-vertical.mp4", horizontal: "media/video/intro-horizontal.mp4" },
          portadas: { vertical: "media/img/intro-vertical.jpg", horizontal: "media/img/intro-horizontal.jpg" },
          leer: {
            titulo: "Tres ejes",
            texto: "El curso se basa en tres ejes temáticos que sostienen el desarrollo integral de un profesional: la ética social, la ética ambiental y la ética profesional.",
          },
        },
      ],
    },
    {
      id: "s51",
      numero: "5.1",
      titulo: "Ética Social",
      pasos: [
        {
          tipo: "portada",
          id: "s51-portada",
          texto: "Reconocer los valores universales de la ética social y aplicarlos al convivir y trabajar con personas distintas.",
        },
        {
          tipo: "video",
          id: "m1-v1",
          titulo: "La primera semana de Valeria",
          fuentes: { vertical: "media/video/m1-v1-vertical.mp4", horizontal: "media/video/m1-v1-horizontal.mp4" },
          portadas: { vertical: "media/img/m1-v1-vertical.jpg", horizontal: "media/img/m1-v1-horizontal.jpg" },
          leer: "m1-l1",
        },
        {
          tipo: "lectura",
          id: "m1-l1",
          titulo: "Los valores, nuestro GPS",
          texto:
            "Los valores forman parte de nosotros: marcan lo que, para cada persona, es correcto o no, y por eso influyen en la relación que tenemos con quienes nos rodean. Funcionan como el GPS que usamos en un viaje: nos van guiando a la hora de tomar decisiones, en cada acción que realizamos aquí y ahora. Además, orientan nuestro comportamiento para pasar del «sentirse bien» al «vivir bien», y reflejan nuestros intereses, sentimientos y convicciones más importantes. Cuando actuamos de forma coherente con ellos nos sentimos seguros, fuertes y motivados. Por eso, ante una decisión difícil, vale la pena preguntarse: ¿estoy siendo coherente con mis valores?",
          fuente: "Lectura 5.1, «El arte de vivir desde los valores» (Coaching con Laura, 2020).",
        },
        {
          tipo: "parejas",
          id: "m1-p1",
          pregunta: "¿Qué valor puso en práctica Valeria?",
          instruccion: "Une cada situación con su valor.",
          izquierda: [
            { texto: "Avisó del error en el informe y pidió ayuda", correcta: "honestidad" },
            { texto: "Dio su opinión en la reunión, con datos", correcta: "libertad" },
            { texto: "No le respondió mal al cliente molesto", correcta: "tolerancia" },
            { texto: "Ayudó al compañero nuevo con el sistema", correcta: "bondad" },
          ],
          derecha: [
            { id: "tolerancia", texto: "Tolerancia" },
            { id: "honestidad", texto: "Honestidad" },
            { id: "bondad", texto: "Bondad" },
            { id: "libertad", texto: "Libertad" },
          ],
          verEnVideo: { paso: "m1-v1", t: 32.8 },
        },
        {
          tipo: "video",
          id: "m1-v2",
          titulo: "Cuatro generaciones, un mismo equipo",
          fuentes: { vertical: "media/video/m1-v2-vertical.mp4", horizontal: "media/video/m1-v2-horizontal.mp4" },
          portadas: { vertical: "media/img/m1-v2-vertical.jpg", horizontal: "media/img/m1-v2-horizontal.jpg" },
          leer: "m1-l2",
        },
        {
          tipo: "lectura",
          id: "m1-l2",
          titulo: "Los valores, base para vivir en comunidad",
          texto:
            "Los valores también son la base para vivir en comunidad y relacionarnos con las demás personas: regulan nuestra conducta para el bienestar colectivo y para una convivencia armoniosa. Cada persona, de acuerdo con sus experiencias, construye un sentido propio de los valores. Aunque a todos nos enseñen que la honestidad es deseable, la forma en que la interpretamos y la vivimos será distinta para cada quien. Por eso, aunque los valores se expresan en ideas y conceptos, lo que más apreciamos de los demás es su comportamiento: lo que realmente hacen en el día a día.",
          fuente: "Lectura 5.1, «El arte de vivir desde los valores» (Coaching con Laura, 2020).",
        },
        {
          tipo: "vf",
          id: "m1-p2",
          pregunta: "¿Verdadero o falso?",
          afirmaciones: [
            { texto: "Todas las personas de la generación Z son autodidactas.", correcta: false },
            { texto: "Cuando Ana enseñó y Diego automatizó el reporte, aplicaron el aprendizaje mutuo.", correcta: true },
            { texto: "«Relaciones sobre jerarquía» significa ignorar los puestos.", correcta: false },
          ],
          verEnVideo: { paso: "m1-v2", t: 87.7 },
        },
        {
          tipo: "video",
          id: "tolerancia",
          titulo: "La tolerancia es la base de la convivencia",
          fuente: "media/video/tolerancia.mp4",
          portada: "media/img/tolerancia.jpg",
          subtitulos: "media/subtitulos/tolerancia.vtt",
          leer: { titulo: "Tolerancia", texto: "Video complementario sobre la tolerancia como base de la convivencia." },
        },
        {
          tipo: "enlace",
          id: "m1-eval",
          etiqueta: "Evaluación",
          titulo: "Cuestionario de evaluación · Módulo 1",
          texto: "Resuelve casos prácticos con un asistente de IA. Al terminar, te dirá si aprobaste el módulo.",
          boton: "Ir a la evaluación",
          url: "",
        },
      ],
    },
    {
      id: "s52",
      numero: "5.2",
      titulo: "Ética Ambiental",
      pasos: [
        {
          tipo: "portada",
          id: "s52-portada",
          texto: "Comprender la huella de carbono, la carbono neutralidad y el Programa Bandera Azul Ecológica, y aplicar prácticas sostenibles en la oficina y en el hogar.",
        },
        {
          tipo: "video",
          id: "m2-v1",
          titulo: "¿Y nosotros cuánto contaminamos?",
          fuentes: { vertical: "media/video/m2-v1-vertical.mp4", horizontal: "media/video/m2-v1-horizontal.mp4" },
          portadas: { vertical: "media/img/m2-v1-vertical.jpg", horizontal: "media/img/m2-v1-horizontal.jpg" },
          leer: "m2-l1",
        },
        {
          tipo: "lectura",
          id: "m2-l1",
          titulo: "Desarrollo sostenible: tres pilares",
          texto:
            "El desarrollo sostenible es el desarrollo que satisface las necesidades del presente sin comprometer la capacidad de las generaciones futuras para satisfacer las suyas, según la definición del Informe Brundtland (1987). Busca un equilibrio entre tres pilares: la sostenibilidad económica, que pretende reducir la pobreza extrema y garantizar un empleo justo para todos; la sostenibilidad ambiental, que protege el equilibrio natural del planeta limitando el impacto de las actividades humanas; y la sostenibilidad social, que garantiza el acceso a los recursos y servicios básicos para todos. En otras palabras, un desarrollo económicamente eficiente, ecológicamente sostenible y socialmente equitativo.",
          fuente: "Lectura 5.2, «Desarrollo sostenible: definición, objetivos y ejemplos» (Climate Consulting by Selectra, 2023).",
        },
        {
          tipo: "clasificar",
          id: "m2-p1",
          pregunta: "En la oficina de Valeria, ¿qué reduce la huella de carbono y qué la aumenta?",
          instruccion: "Manda cada acción a su lado.",
          grupos: [
            { id: "reduce", texto: "Reduce", icono: "↓" },
            { id: "aumenta", texto: "Aumenta", icono: "↑" },
          ],
          items: [
            { texto: "Medir cada mes el consumo de luz y agua", correcta: "reduce" },
            { texto: "Imprimir todos los correos «por si acaso»", correcta: "aumenta" },
            { texto: "Organizar viajes compartidos al trabajo", correcta: "reduce" },
            { texto: "Dejar computadoras y aires encendidos de noche", correcta: "aumenta" },
            { texto: "Cambiar a equipos más eficientes", correcta: "reduce" },
          ],
          verEnVideo: { paso: "m2-v1", t: 71.3 },
        },
        {
          tipo: "video",
          id: "m2-v2",
          titulo: "La bandera que se gana",
          fuentes: { vertical: "media/video/m2-v2-vertical.mp4", horizontal: "media/video/m2-v2-horizontal.mp4" },
          portadas: { vertical: "media/img/m2-v2-vertical.jpg", horizontal: "media/img/m2-v2-horizontal.jpg" },
          leer: "m2-l2",
        },
        {
          tipo: "lectura",
          id: "m2-l2",
          titulo: "La Agenda 2030 y los ODS",
          texto:
            "En septiembre de 2015, las Naciones Unidas aprobaron la Agenda 2030 para el Desarrollo Sostenible, una hoja de ruta con 17 Objetivos de Desarrollo Sostenible (ODS). Estos objetivos buscan conciliar el crecimiento económico, el equilibrio medioambiental y el progreso social, para que todas las personas tengan las mismas oportunidades y puedan llevar una vida mejor sin comprometer el planeta. Entre ellos están el fin de la pobreza, el agua limpia, la energía asequible y no contaminante, la producción y el consumo responsables y la acción por el clima. Los países se comprometieron a movilizar los medios necesarios para cumplirlos.",
          fuente: "Lectura 5.2, «Desarrollo sostenible: definición, objetivos y ejemplos» (Climate Consulting by Selectra, 2023).",
        },
        {
          tipo: "opcion",
          id: "m2-p2",
          etiqueta: "Caso",
          pregunta: "¿Qué harías?",
          caso: "Tu jefatura quiere anunciar mañana en redes que la empresa es «carbono neutral», pero nunca han medido sus emisiones. ¿Qué le recomiendas?",
          opciones: [
            { id: "a", texto: "Publicarlo: todas las empresas lo dicen." },
            { id: "b", texto: "Primero hacer el inventario de gases de efecto invernadero, y anunciarlo solo con el certificado.", correcta: true },
            { id: "c", texto: "Plantar unos árboles esta semana y publicarlo." },
          ],
          verEnVideo: { paso: "m2-v2", t: 55.5 },
        },
        {
          tipo: "video",
          id: "m2-v3",
          titulo: "Y en mi casa, ¿qué?",
          fuentes: { vertical: "media/video/m2-v3-vertical.mp4", horizontal: "media/video/m2-v3-horizontal.mp4" },
          portadas: { vertical: "media/img/m2-v3-vertical.jpg", horizontal: "media/img/m2-v3-horizontal.jpg" },
          leer: "m2-l3",
        },
        {
          tipo: "lectura",
          id: "m2-l3",
          titulo: "La huella de carbono personal",
          texto:
            "La población mundial sigue creciendo, y con ella aumentan las necesidades y el consumo de cada persona. Si no tenemos en cuenta el cambio climático, este puede hacer retroceder los logros alcanzados en desarrollo. Por eso, invertir en desarrollo sostenible ayuda a enfrentar el cambio climático y a reducir las emisiones de gases de efecto invernadero. Y todo empieza con un proceso de concientización: calcular nuestra huella de carbono personal nos permite saber qué hábitos de consumo tienen un impacto ambiental negativo y limitarlos. Es una oportunidad para que cada consumidor reduzca su propia huella.",
          fuente: "Lectura 5.2, «Desarrollo sostenible: definición, objetivos y ejemplos» (Climate Consulting by Selectra, 2023).",
        },
        {
          tipo: "completar",
          id: "m2-p3",
          pregunta: "Completa el plan de Valeria",
          instruccion: "Toca la opción que completa cada parte.",
          frases: [
            { antes: "Para ir al trabajo, voy a usar", despues: ".", opciones: ["mi carro, solo", "bicicleta o transporte público"], correcta: 1 },
            { antes: "Los restos de comida van al", despues: ".", opciones: ["compost", "basurero"], correcta: 0 },
            { antes: "Antes de comprar ropa, me pregunto si", despues: ".", opciones: ["realmente la necesito", "está de moda"], correcta: 0 },
          ],
          verEnVideo: { paso: "m2-v3", t: 38.6 },
        },
        {
          tipo: "enlace",
          id: "m2-eval",
          etiqueta: "Evaluación",
          titulo: "Cuestionario de evaluación · Módulo 2",
          texto: "Resuelve casos prácticos con un asistente de IA. Al terminar, te dirá si aprobaste el módulo.",
          boton: "Ir a la evaluación",
          url: "",
        },
        {
          tipo: "enlace",
          id: "m2-foro",
          etiqueta: "Foro",
          titulo: "Mi punto de vista",
          texto: "Comparte tu opinión sobre la ética ambiental en tu vida profesional y personal.",
          boton: "Ir al foro",
          url: "",
        },
      ],
    },
    {
      id: "s53",
      numero: "5.3",
      titulo: "Ética en la Carrera Profesional",
      pasos: [
        {
          tipo: "portada",
          id: "s53-portada",
          texto: "Reconocer los beneficios y deberes de estar colegiado y actuar según el Reglamento de Ética Profesional del Colegio.",
        },
        {
          tipo: "video",
          id: "m3-v1",
          titulo: "¿Para qué colegiarme?",
          fuentes: { vertical: "media/video/m3-v1-vertical.mp4", horizontal: "media/video/m3-v1-horizontal.mp4" },
          portadas: { vertical: "media/img/m3-v1-vertical.jpg", horizontal: "media/img/m3-v1-horizontal.jpg" },
          leer: "m3-deberes",
        },
        {
          tipo: "mapa",
          id: "m3-mapa",
          titulo: "Descubre tu Colegio: sedes y beneficios",
          src: "mapa/index.html",
        },
        {
          tipo: "lectura",
          id: "m3-deberes",
          titulo: "Su colegiatura también trae deberes",
          texto:
            "El pago de la cuota empieza el mes siguiente a la incorporación y vence el día 30 de cada mes. Según la Ley del Colegio (n.º 9529), después de 60 días de atraso se cobra un cargo moratorio, y si el atraso supera seis meses, la persona colegiada puede quedar suspendida del ejercicio profesional.",
          fuente: "Revista Punto 3, Colegio de Ciencias Económicas de Costa Rica.",
        },
        {
          tipo: "parejas",
          id: "m3-p1",
          pregunta: "¿Qué razón para estar colegiado vivió Diego?",
          instruccion: "Une cada situación con su razón.",
          izquierda: [
            { texto: "Lo llamaron por la bolsa de empleo", correcta: "servicios" },
            { texto: "Llevó un curso gratis", correcta: "actualizacion" },
            { texto: "El CIDE apoyó su negocio", correcta: "emprendimiento" },
            { texto: "Un cliente confió más en su firma", correcta: "prestigio" },
            { texto: "Hizo contactos en la Semana del Colegiado", correcta: "comunidad" },
          ],
          derecha: [
            { id: "prestigio", texto: "Prestigio" },
            { id: "comunidad", texto: "Comunidad" },
            { id: "servicios", texto: "Servicios" },
            { id: "emprendimiento", texto: "Emprendimiento" },
            { id: "actualizacion", texto: "Actualización" },
          ],
          verEnVideo: { paso: "m3-v1", t: 49.6 },
        },
        {
          tipo: "video",
          id: "m3-v2",
          titulo: "Lo que no se cuenta",
          fuentes: { vertical: "media/video/m3-v2-vertical.mp4", horizontal: "media/video/m3-v2-horizontal.mp4" },
          portadas: { vertical: "media/img/m3-v2-vertical.jpg", horizontal: "media/img/m3-v2-horizontal.jpg" },
          leer: "m3-l2",
        },
        {
          tipo: "lectura",
          id: "m3-l2",
          titulo: "El Reglamento de Ética Profesional",
          texto:
            "El Reglamento de Ética Profesional del Colegio regula la conducta de las personas colegiadas en el ejercicio de la profesión y en sus relaciones con colegas, empleadores, clientes y la sociedad. Establece que el ejercicio profesional debe ser siempre probo, leal, veraz, ético y de buena fe (artículo 5). Obliga a guardar el secreto profesional: no revelar los datos que se conozcan por el trabajo, salvo con autorización del cliente o por requerimiento de una autoridad competente, y en ese caso informar a la Fiscalía; aun así, se pueden consultar dudas de criterio sin identificar a las personas o empresas (artículo 8). Y pide cimentar la reputación en la integridad moral, la honradez, la laboriosidad y la capacidad profesional (artículo 18).",
          fuente: "Lectura 5.3, «Reglamento de Ética Profesional», Colegio de Ciencias Económicas de Costa Rica.",
        },
        {
          tipo: "clasificar",
          id: "m3-p2",
          pregunta: "Secreto profesional: ¿Valeria puede compartirlo o lo guarda?",
          instruccion: "Manda cada situación a su lado.",
          grupos: [
            { id: "puede", texto: "Puede", icono: "✓" },
            { id: "guarda", texto: "La guarda", icono: "🔒" },
          ],
          items: [
            { texto: "Un cliente le pide las cifras de ventas de otro cliente", correcta: "guarda" },
            { texto: "El cliente autoriza por escrito compartir sus estados financieros con el banco", correcta: "puede" },
            { texto: "Una autoridad legalmente competente se la solicita formalmente", correcta: "puede" },
            { texto: "Comenta las deudas de un cliente en una reunión familiar", correcta: "guarda" },
            { texto: "Consulta una duda de criterio con un colega, sin decir nombres ni empresas", correcta: "puede" },
          ],
          verEnVideo: { paso: "m3-v2", t: 17.1 },
        },
        {
          tipo: "video",
          id: "testimonio",
          titulo: "Testimonio de Gabriela Romero",
          fuente: "media/video/testimonio.mp4",
          portada: "media/img/testimonio.jpg",
          subtitulos: "media/subtitulos/testimonio.vtt",
          leer: { titulo: "Testimonio", texto: "Una persona colegiada comparte su experiencia en el Colegio." },
        },
        {
          tipo: "enlace",
          id: "m3-eval",
          etiqueta: "Evaluación",
          titulo: "Cuestionario de evaluación · Módulo 3",
          texto: "Resuelve casos prácticos con un asistente de IA. Al terminar, te dirá si aprobaste el módulo.",
          boton: "Ir a la evaluación",
          url: "",
        },
      ],
    },
    {
      id: "s6",
      numero: "6",
      titulo: "Encuesta de satisfacción",
      pasos: [
        {
          tipo: "portada",
          id: "s6-portada",
          sub: "En esta sección",
          texto: "Cuéntanos qué te pareció el curso.",
        },
        {
          tipo: "enlace",
          id: "encuesta",
          etiqueta: "Encuesta",
          titulo: "¿Cómo te pareció el curso?",
          texto: "Tu opinión nos ayuda a mejorar. Responder toma unos minutos.",
          boton: "Responder la encuesta",
          url: "",
        },
        {
          tipo: "fin",
          id: "fin",
          titulo: "¡Curso completado!",
          texto: "Ahora espera la convocatoria de la Oficina de Incorporaciones para la juramentación virtual. Te llegará al correo personal y por mensaje de texto.",
        },
      ],
    },
  ],
};
