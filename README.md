# Curso de Ética Profesional

Sitio web del curso virtual de Ética Profesional para las personas que se incorporan al Colegio de Ciencias Económicas de Costa Rica.

El curso se recorre como un feed de videos cortos: se desliza hacia arriba para pasar al siguiente paso. Funciona igual en celular y en PC. No necesita cuentas ni servidor; el avance se guarda en el navegador de cada persona.

## Estructura del curso

El orden sigue el esquema del curso:

1. Información importante (preguntas frecuentes)
2. Video institucional
3. Revista Punto 3
4. Fiscalía
5. Bienvenida a los módulos de ética
   - 5.1 Ética Social: 2 videos, 2 lecturas, 2 preguntas, video de tolerancia y evaluación
   - 5.2 Ética Ambiental: 3 videos, 3 lecturas, 3 preguntas, evaluación y foro «Mi punto de vista»
   - 5.3 Ética en la Carrera Profesional: 2 videos, el mapa interactivo «Descubre tu Colegio» (sedes y beneficios), 2 lecturas, 2 preguntas, testimonio y evaluación
6. Encuesta de satisfacción

## Cómo funciona

- **Avance:** solo se pasa al siguiente paso cuando el actual está completo. Un video se completa al verlo entero y una pregunta al responderla.
- **Videos:** en celular se usa la versión vertical y en PC la horizontal.
- **Botones de cada video:**
  - **Leer** muestra la lectura relacionada.
  - **Transcripción** muestra el texto completo del video.
  - **Sonido** activa o quita el audio.
  - **Subtítulos** solo aparece en los videos institucionales; los videos del curso ya traen los subtítulos dentro de la imagen.
- **Índice:** el botón ☰ muestra el estado de cada sección y permite volver a cualquier sección ya alcanzada.

## Accesibilidad

- Se puede usar solo con teclado:
  - las flechas ↑ y ↓ cambian de paso;
  - la barra espaciadora reproduce o pausa el video;
  - <kbd>Tab</kbd> recorre los botones;
  - <kbd>Esc</kbd> cierra los paneles.
- Todos los videos tienen transcripción, y los institucionales también tienen subtítulos.
- Los lectores de pantalla anuncian:
  - cada cambio de paso;
  - si una respuesta es correcta o no;
  - cuándo se puede continuar.
- Las respuestas no dependen solo del color: llevan ✓ o ✗ y un texto.
- Se respeta la preferencia de «reducir movimiento»: con ella activada, no hay animaciones y los videos no se reproducen solos.
- Hay un enlace para saltar al contenido.

## Editar el contenido

Todo el texto está en [`js/curso.js`](js/curso.js): secciones, lecturas, preguntas y enlaces.

Para las evaluaciones, el foro y la encuesta, pega el enlace en el campo `url` del paso de tipo `"enlace"`. Por ejemplo, el enlace de la Gema de Gemini va en `m1-eval`, `m2-eval` y `m3-eval`. Mientras `url` esté vacío, la tarjeta muestra «disponible pronto» y no bloquea el avance.

## Probar en tu computadora

Los subtítulos no cargan si se abre `index.html` con doble clic, así que conviene usar un servidor local:

```bash
python -m http.server 8000
```

Luego abre <http://localhost:8000> en el navegador.

## Mapa «Descubre tu Colegio»

La carpeta `mapa/` es una copia del SCORM del mapa (proyecto `Videos/mapa-beneficios`). Dentro del sitio funciona como un paso más: se completa cuando se descubren todos los puntos, y la voz se pausa al cambiar de paso. Si se cambia el mapa, hay que copiar de nuevo su carpeta `paquete/` aquí, sin el `imsmanifest.xml`.

## Medios

Los videos, portadas, subtítulos y transcripciones se generan con [`herramientas/preparar_medios.py`](herramientas/preparar_medios.py) a partir de los archivos originales.

- **Compresión:** los videos institucionales se comprimen a 720p.
- **Transcripciones automáticas:** las de los videos institucionales están hechas en local y conviene revisar los nombres propios.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube esta carpeta.
2. En el repositorio, entra a **Settings → Pages**.
3. Elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`.

El sitio queda en `https://<usuario>.github.io/<repositorio>/`.
