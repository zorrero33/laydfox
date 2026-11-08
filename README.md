# EL TURNO DE LAS 03:17

Experiencia de terror psicológico 3D para navegador, publicada de forma estática con GitHub Pages.

## Jugar

**URL pública:** https://zorrero33.github.io/laydfox/

La página carga Three.js desde el archivo local `vendor/three.min.js`. El juego no depende de una CDN externa para el motor.

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
- Ocho capítulos narrativos, tres finales principales y un recuerdo secreto desbloqueable.
- Guardado/carga local en el navegador.
- Ajustes de volumen y sensibilidad de ratón.

## Verificación técnica de esta revisión

- La web se ha abierto con Chromium y WebGL activado: carga Three.js, inicia una partida y muestra el HUD.
- Se han probado el inventario, pausa, ajustes, guardado F5 y carga F9.
- El flujo de campaña se ha recorrido mediante pruebas automatizadas de los eventos de juego: las ocho fases, las puertas bloqueadas, la cinta, la nota 03:17, el generador, la cerradura del director y el final de la verdad con recuerdo secreto.
- En esas pruebas no se detectaron errores JavaScript ni recursos fallidos. Esto no sustituye una prueba de juego manual en distintos ordenadores y navegadores.

## Estado y límites conocidos

Esta es una **versión web jugable de la historia**, no la entrega AAA final descrita en la biblia de producción.

El hospital y la mayor parte del atrezo siguen usando geometría procedural de Three.js. Alma y el celador ya cargan mallas GLB 3D locales (17 piezas por personaje y materiales propios del modelo), con modelos procedurales de respaldo; sin embargo, esos GLB no contienen esqueletos (`skins`) ni animaciones exportadas, por lo que se desplazan y giran como una sola figura. No son modelos humanos fotorrealistas ni tienen animación facial. No hay captura de movimiento, doblaje, modelos GLB hospitalarios comerciales integrados, ni campaña de 8–12 capítulos. La campaña web actual mantiene seis capítulos y tres finales. Los rigs esqueléticos, la animación corporal avanzada, los modelos fotorrealistas, las cinemáticas y los recursos de audio/voz completos siguen pendientes.

Además de la auditoría estática, esta revisión sí se ha ejecutado en Chromium con WebGL SwiftShader. La prueba cubre el arranque, la interfaz, las funciones de guardado/carga y el flujo automatizado de los ocho capítulos. No se ha realizado todavía una prueba manual prolongada en el equipo del jugador ni una matriz de compatibilidad con todos los navegadores y tarjetas gráficas.

## Proyecto de PC

La producción separada de Unreal Engine está en la rama `pc-ue5-dev`:

https://github.com/zorrero33/laydfox/tree/pc-ue5-dev/PCGame

Esta rama no sustituye la página web ni se compila automáticamente como ejecutable.

## Licencia del motor

Three.js r160 está incluido con su aviso de licencia MIT en `vendor/THREE-LICENSE.txt`. Los elementos procedurales de este proyecto son propios; no se afirma que los assets pendientes estén descargados o integrados.
