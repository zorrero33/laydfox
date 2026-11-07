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
- Personajes 3D procedurales provisionales de Alma y el celador.
- Movimiento en primera persona, correr, agacharse, colisiones, puertas deslizantes y escondite.
- Linterna con batería y resistencia de carrera.
- Inventario/diario de pruebas, documentos y pistas.
- Puzle eléctrico con secuencia 1-3-2.
- Código final de acceso 0317.
- Apariciones de Alma, persecución del celador, eventos de 03:17 y audio procedural.
- Seis capítulos narrativos y tres finales.
- Guardado/carga local en el navegador.
- Ajustes de volumen y sensibilidad de ratón.

## Estado y límites conocidos

Esta es una **versión web jugable de la historia**, no la entrega AAA final descrita en la biblia de producción.

Los escenarios y personajes de esta versión usan geometría procedural de Three.js. Alma y el celador no tienen todavía mallas humanas fotorrealistas, esqueletos completos ni animación facial. No hay captura de movimiento, doblaje, modelos GLB hospitalarios comerciales integrados, ni campaña de 8–12 capítulos. La campaña web actual mantiene seis capítulos y tres finales. Los modelos y recursos fotorrealistas siguen pendientes.

Se han comprobado estáticamente la sintaxis JavaScript, la existencia de los elementos de interfaz usados por el código, el cierre de CSS y las rutas relativas locales. **No se ha podido ejecutar una prueba de navegador real ni validar la experiencia en distintos equipos desde este entorno.** Por eso, el enlace corresponde al despliegue configurado en GitHub Pages, pero la carga final y la experiencia de juego deben confirmarse abriendo la página en un navegador.

## Proyecto de PC

La producción separada de Unreal Engine está en la rama `pc-ue5-dev`:

https://github.com/zorrero33/laydfox/tree/pc-ue5-dev/PCGame

Esta rama no sustituye la página web ni se compila automáticamente como ejecutable.

## Licencia del motor

Three.js r160 está incluido con su aviso de licencia MIT en `vendor/THREE-LICENSE.txt`. Los elementos procedurales de este proyecto son propios; no se afirma que los assets pendientes estén descargados o integrados.
