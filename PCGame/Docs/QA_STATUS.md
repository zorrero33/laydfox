# QA y estado verificable

Fecha: 7 de noviembre de 2026  
Rama: `pc-ue5-dev`

## Comprobaciones realizadas

Última verificación estática de la rama:
- JSON del descriptor Unreal: válido.
- Módulo registrado: `ElTurno0317`.
- Plugin innecesario `GameplayCameras`: retirado; queda Enhanced Input habilitado.
- F5/F9 aparecen en líneas separadas de configuración.
- Sin concatenación accidental en `DefaultInput.ini`.
- Llaves equilibradas en los CPP principales revisados.
- El test de inventario existe como fuente, pero no se ha ejecutado.

| Comprobación | Resultado | Evidencia / alcance |
|---|---|---|
| Descriptor `.uproject` | PASS | JSON parseado correctamente tras quitar plugin no utilizado |
| Estructura GitHub | PASS | Targets, Build.cs, clases, configuración, documentación y tests aparecen en el árbol de la rama |
| `.generated.h` | PASS parcial | Último include de los headers revisados; no es un UHT run |
| Balance de llaves C++ | PASS parcial | Archivos CPP principales revisados; no equivale a compilar |
| Controles | PASS | WASD, ratón, E, F, Shift, Ctrl, F5 y F9 separados en `DefaultInput.ini` |
| Inventario de pruebas | SOURCE | Test Automation para no duplicar evidencia y restauración; no ejecutado |
| Escena 3D Jutsu | PASS estructural | Revisión 7, 352 objetos, 27 materiales, cámara de subnivel y dos luces animadas |
| Importación GLB | PASS estructural | Cinco entidades importadas desde catálogo Jutsu y colocadas en la escena |
| Render 960×540 | PASS técnico | El proceso Blender/EEVEE terminó y publicó artefacto; el PNG no se pudo inspeccionar visualmente en este canal |
| Build Unreal Windows | BLOCKED | Unreal Editor/Build Tool y toolchain Windows no están instalados en el entorno de esta sesión |
| Ejecutable PC | NOT BUILT | No existe .exe ni paquete Windows |
| Gameplay QA | NOT RUN | Sin editor/ejecutable no se ha podido jugar dentro de Unreal |
| Rig final de Alma/celador | NOT READY | No hay malla humana final ni armature/rig facial; las formas previas se mantienen como placeholder |
| Licencia de assets Jutsu | PENDING | El catálogo no expone licencia individual; no aprobar para distribución comercial |
| Recursos Fab/CC0 | NOT DOWNLOADED | URLs y términos registrados; no están integrados en Content |

## Código fuente añadido

- Movimiento FPS, correr, agacharse y cámara.
- Linterna con batería.
- Interacción por trazado desde cámara e interfaz de interacción.
- Actor de evidencia inspeccionable.
- Inventario de IDs de evidencia.
- Subsistema de capítulo/banderas.
- Guardado/carga de transform, capítulo, pistas, batería y banderas.
- Controlador de celador con AI Perception de vista y oído y último lugar conocido.
- Test de automatización para unicidad/restauración de evidencia.

## Bloqueos críticos antes de una build jugable

1. Instalar/abrir UE 5.8 y compilar C++/UHT.
2. Crear mapa Unreal con el GLB del hospital y navegación/collision.
3. Importar personajes humanos con licencias aprobadas, skeleton, facial rig y animaciones.
4. Conectar UI real de menú, diario, inventario, pausa, subtítulos y ajustes.
5. Terminar AI State Tree/Behavior Tree, director paranormal y eventos con cooldown.
6. Integrar audio con oclusión/reverb y voces.
7. Crear campaña, finales y puzles como Data Assets y testearlos.
8. Ejecutar Automation Tests y una pasada completa de juego en Windows.

**No se declara esta fase como build aprobada.** Se aprueba únicamente el registro, la arquitectura y la existencia de la base de código/escena 3D descrita arriba.