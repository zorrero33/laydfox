# Arquitectura técnica — UE 5.8

## Decisión de motor

Motor principal: **Unreal Engine 5.8 para Windows 11**.

Motivo: el objetivo pide iluminación global dinámica, reflejos, materiales PBR, gran fidelidad de escenarios, animación facial/corporal, herramientas de IA y un juego de PC. Unreal proporciona Lumen, Nanite, Virtual Shadow Maps, Niagara, Chaos, Control Rig, IK Rig, Motion Matching, Enhanced Input, AI Perception y MetaSounds. Godot 4 admite importación glTF 2.0 y exportación a escritorio, pero no ofrece el conjunto Nanite/Lumen de Unreal; queda como alternativa si el hardware/editor no permite UE. No se cambia a Godot solo para hacer una web más fácil.

## Arquitectura por capas

### Runtime / C++

- `UTurnoStorySubsystem`: capítulos, objetivos, variables de historia, banderas de pistas, decisiones y eventos únicos.
- `UPlayerInventoryComponent`: objetos, pistas, llaves, pruebas, consumibles y metadatos.
- `UTurnoInteractionInterface`: contrato común para puertas, documentos, mecanismos, contenedores y personajes.
- `AEvidenceActor`: documentos, fotos, cintas y evidencias inspeccionables.
- `UTurnoSaveGame`: capítulo, checkpoint, objetos, pistas, puertas, eventos resueltos, ajustes y decisiones.
- `ATurnoPlayerCharacter`: cámara, movimiento, correr, agacharse, interacción y animación de manos.
- `ULightResourceComponent`: linterna, batería, estados, recarga y UI.
- `AGhostCharacter` + `AGhostAIController`: navegación, percepción, objetivo, último punto visto y estado narrativo.
- `UParanormalEventSubsystem`: selección ponderada de eventos según capítulo, ubicación, estrés y encuentros ya vistos.
- `UTurnoAudioSubsystem`: capas ambientales, eventos, reverberación, oclusión y mezcla dinámica.

### Blueprints / contenido

Blueprints para variantes de puertas, props, mecanismos, encuentros guionizados, secuencias Level Sequence, luces y eventos. Mantener la lógica de estado y persistencia en C++ para evitar reglas duplicadas en cientos de Blueprints.

## IA de Alma

Estados base: Observación, Curiosidad, Aparición, Seguimiento, Advertencia, Ayuda, Engaño, Recuerdo, Búsqueda, Persecución, Desaparición y Reposo.

Percepción:
- Sight: cono y distancia configurables por capítulo.
- Hearing: pasos, sprint, puertas, objetos caídos y respiración.
- Memoria: último lugar donde vio al jugador, objetos que el jugador examinó, encuentros previos y pistas narrativas descubiertas.
- Decisión: la niña puede guiar o manipular; no debe convertirse en perseguidor permanente.

Plan de IA: State Tree/Behavior Tree para estados de alto nivel, Blackboard para memoria, AI Perception para estímulos y EQS para puntos de aparición, escondites y rutas de observación. Los sustos guionizados tienen cooldown y condiciones narrativas; los aleatorios se ponderan por director y no repiten un evento ya visto.

## Enemigos

Cada enemigo se implementa como un perfil de comportamiento con percepción, velocidad, rutas, animaciones, sonido, debilidades, reglas de ataque y reglas de despawn. No compartir un único “chase AI” para todas las criaturas.

La defensa del jugador es limitada y contextual: linterna, ocultación, puertas, distracciones y herramientas de emergencia. El combate no será el bucle principal.

## Render y materiales

- Lumen para iluminación global/reflejos en calidad alta.
- Nanite para arquitectura y props estáticos compatibles; no asumirlo para esqueletos animados.
- Virtual Shadow Maps, TSR y escalado de resolución según equipo.
- Materiales PBR: base color, normal, roughness, metallic, AO; suciedad por máscaras y capas de desgaste.
- Niagara para polvo, partículas, vapor y eventos sobrenaturales.
- Volúmenes/fog con límites de rendimiento y áreas controladas.
- Presets gráficos configurables; no forzar ray tracing hardware en calidad baja.

## Animación

- Control Rig e IK Rig para esqueleto, manos, contacto y retargeting.
- Motion Matching o locomoción por estados según el rig disponible.
- Animación facial mediante blendshapes/curvas/Control Rig.
- MetaHuman no se asumirá adecuado para Alma por ser una niña; se requiere diseño y rig infantil creado expresamente.
- Los actores humanos deben tener rig completo y probar skin weights, manos, cuello, ojos, boca y deformaciones antes de integrarlos.

## Audio

MetaSounds y Audio Components con:
- atenuación 3D;
- oclusión por geometría;
- reverberación por volumen/estancia;
- bancos de pasos por superficie;
- stems musicales con intensidad por estado;
- voces y susurros direccionales;
- silencio intencionado como recurso.

## Datos y guardado

Los datos de capítulos, documentos, encuentros y objetos se definen en Data Assets/Data Tables con IDs estables. El guardado serializa IDs y flags; no guarda punteros a actores. Cada evento importante debe ser idempotente y restaurarse desde el último checkpoint.

## Pruebas

- Automation tests para inventario, flags de historia y puzles.
- PIE tests para puertas, colisión, interacción, muerte/reintento y guardado.
- AI tests para visión, audición, pérdida de objetivo, búsqueda y cooldown.
- Pruebas en Windows en calidad baja/media/alta/ultra.
- No se declara una compilación o prueba pasada sin el resultado de Unreal Automation/Build.

## Perfil de rendimiento objetivo

Objetivo inicial: 60 FPS a 1080p en calidad media/alta en hardware recomendado; 30 FPS como mínimo de aceptación en calidad alta en equipos más modestos. LOD/HLOD, culling, instancing, streaming por ala y presupuesto por actor. Medir antes de subir resolución de texturas o densidad de partículas.