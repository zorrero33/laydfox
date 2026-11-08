# EL TURNO DE LAS 03:17

Experiencia de terror psicológico 3D para navegador, publicada de forma estática con GitHub Pages.

## Jugar

**URL pública:** https://zorrero33.github.io/laydfox/

La página carga Three.js y GLTFLoader desde archivos locales de `vendor/`. Los modelos de Alma y del celador se reconstruyen desde los dos fragmentos GLB locales de `assets/`; no se descarga contenido desde una CDN ni desde una URL temporal de 3D Jutsu para iniciar la partida.

## Controles

- WASD: moverse.
- Ratón: mirar (clic dentro del juego para capturar el puntero).
- Mayús: correr.
- Ctrl: agacharse.
- E: interactuar.
- F: linterna.
- Tab: inventario y diario.
- F5: guardar.
- F9: cargar.
- Esc: pausa y ajustes.

## Contenido de la versión web actual

- Escenario 3D WebGL construido con Three.js.
- Hospital conectado con recepción, enfermería, pediatría/habitación 317, archivo médico, morgue, sótano técnico y dirección.
- Atrezo médico procedural: camas, camillas, monitores, soportes IV, carros, armarios, estanterías, mesas, generador y señalética.
- Modelos GLB locales de Alma y del celador, integrados como mallas 3D estáticas compuestas por 17 piezas cada uno; modelos procedurales de reserva si el GLB no carga.
- Movimiento en primera persona, correr, agacharse, colisiones, puertas deslizantes y escondite.
- Linterna con batería y resistencia de carrera.
- Inventario/diario de pruebas, documentos y pistas.
- Puzle eléctrico con secuencia 1-3-2.
- Código final de acceso 0317.
- Apariciones de Alma, persecución del celador, eventos de 03:17 y audio procedural.
- Ocho capítulos narrativos, tres finales principales y un recuerdo secreto desbloqueable tras reunir las tres pistas de Alma.
- Guardado/carga local en el navegador.
- Ajustes de volumen y sensibilidad de ratón.

## Verificación técnica de esta revisión

- La web se ha abierto con Chromium y WebGL activado: cargan Three.js, GLTFLoader y ambos modelos GLB locales.
- Se ha probado el inicio de partida, el HUD, la apertura/cierre del inventario, los menús de pausa/ajustes y el nuevo comportamiento de Esc para pausar y reanudar.
- Se han probado guardado F5, carga F9 y actualización de objetivos después de leer el contrato.
- El flujo automatizado recorre los ocho capítulos, sus puertas y bloqueos, el puzle eléctrico, la cinta, la nota 03:17, el generador, el código del despacho, los tres finales y el recuerdo secreto.
- Se ha comprobado el diseño a 390 px de ancho sin desbordamiento horizontal.
- En estas pruebas no se detectaron errores JavaScript ni peticiones fallidas. No equivalen a una prueba manual prolongada en el ordenador del jugador ni a una matriz completa de compatibilidad.

## Estado y límites conocidos

Esta es una **versión web jugable de la historia**, no la entrega AAA final descrita en la biblia de producción.

El hospital y la mayor parte del atrezo siguen usando geometría procedural de Three.js. Alma y el celador cargan mallas GLB 3D locales de 17 piezas cada personaje, con sus materiales y modelos procedurales de respaldo. Los modelos no contienen esqueletos (`skins`) ni animaciones exportadas: se desplazan y giran como una figura rígida. No son humanos fotorrealistas ni tienen animación facial, captura de movimiento o doblaje.

La campaña web contiene **ocho capítulos** y tres finales, además del recuerdo secreto de Alma. No llega todavía a los **30 puzles independientes** del documento de producción: incluye el cuadro eléctrico 1→3→2, el código 0317 y varias pruebas, documentos y bloqueos de progresión. Las cinemáticas completas, los rigs esqueléticos, la animación corporal avanzada, los modelos fotorrealistas y una banda sonora/voz profesional siguen pendientes.

La experiencia se ha comprobado en Chromium con WebGL SwiftShader, incluidas las cargas locales de los personajes, los controles, la interfaz, guardado/carga, el recorrido automatizado de la campaña y los finales. No se ha realizado todavía una prueba manual prolongada en el ordenador del jugador ni una matriz completa de compatibilidad con todos los navegadores y tarjetas gráficas. Los controles principales están orientados a teclado y ratón; no hay un esquema táctil de móvil.

## Proyecto de PC

La producción separada de Unreal Engine está en la rama `pc-ue5-dev`:

https://github.com/zorrero33/laydfox/tree/pc-ue5-dev/PCGame

Esta rama no sustituye la página web ni se compila automáticamente como ejecutable.

## Licencia del motor

Three.js r160 está incluido con su aviso de licencia MIT en `vendor/THREE-LICENSE.txt`. Los elementos procedurales de este proyecto son propios; no se afirma que los assets pendientes estén descargados o integrados.
