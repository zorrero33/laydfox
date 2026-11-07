# Auditoría del proyecto — 7 de noviembre de 2026

## 1. Repositorio GitHub

Repositorio: https://github.com/zorrero33/laydfox  
Rama de la experiencia web: `main`  
Rama separada de desarrollo PC: `pc-ue5-dev`

La raíz contiene `.nojekyll`, `README.md`, `index.html` y `vendor/three.min.js` con su aviso de licencia MIT. El `index.html` actual tiene aproximadamente 30,8 KB y utiliza su propio contexto WebGL y shaders; no importa `vendor/three.min.js` ni carga scripts externos. La experiencia tiene controles FPS, HUD, inventario, objetos interactivos, progresión de seis etapas, linterna/batería, un perseguidor, guardado local y sonido procedural mediante Web Audio.

**Conclusión:** es una experiencia WebGL jugable en navegador, útil como referencia de historia y mecánicas, pero no es un ejecutable de PC, no es un proyecto Unreal y no representa el objetivo AAA final.

## 2. Entorno de trabajo de esta sesión

El entorno de ejecución disponible es Debian 13. En la auditoría de comandos no se encontraron instalaciones ejecutables de Unreal Editor, Godot, Unity ni Blender. Por tanto no se puede compilar ni ejecutar desde aquí una build Windows de Unreal, ni afirmar que se han superado pruebas de juego dentro del motor.

Epic recomienda para Unreal un equipo Windows 11 con 32 GB de RAM y 8 GB o más de VRAM; Linux tiene requisitos propios y una lista de distribuciones/SDK probados. La selección final de motor se hace para el PC Windows objetivo, no para fingir que este contenedor ya tiene el editor instalado.

## 3. Escena 3D recuperada

Proyecto 3D Jutsu seleccionado:  
https://higgsfield.ai/3d-jutsu/cb894303-39d2-4283-8ba3-bd8027ab1fc9

Se seleccionó el proyecto con historial y artefactos existentes (no un segundo proyecto homónimo que estaba vacío). La revisión inicial tenía 305 objetos, 299 mallas, 17 partes geométricas para Alma, 17 para el celador, cero objetos de tipo armature y dos acciones asociadas a piezas de ropa. Esto **no** equivale a personajes humanos riggeados ni a animaciones corporales completas.

### Cambios guardados en revisión 7

- Se importaron desde el catálogo 3D Jutsu: First Aid Cabinet, Corridor Straight, Blast Door, Security Camera y Alarm Beacon.
- Se alinearon los pivotes de los recursos a escala métrica.
- Se incorporó un módulo de corredor técnico de 4 × 4 × 2,8 m.
- Se crearon materiales procedurales de hormigón húmedo, vinilo mojado, acero oxidado, esmalte hospitalario, carcasa de cámara, alarma roja, difusor fluorescente y señalización.
- Se añadieron conducciones, bandeja de cables, umbral de seguridad, drenaje, placas y luminarias.
- Se añadieron dos luces animadas para fallo fluorescente y derrame rojo de alarma.
- Se creó la cámara `CAM_SUBLEVEL_B02`.
- La escena quedó con 352 objetos y 27 materiales.
- La operación de render de prueba terminó a 960×540 sin excepción.

**Limitación de verificación:** el render PNG se generó y se almacenó en el proyecto, pero no se pudo visualizar desde este canal. Por tanto se verifica la ejecución y los datos de escena, no el acabado artístico del render. La licencia individual de los cinco recursos del catálogo no aparece expuesta; quedan como contenido provisional y no deben distribuirse comercialmente hasta confirmar derechos.

## 4. Investigación de recursos

### Candidatos con licencia clara

- Fab — *Modular 3D hospital environment*: listado gratuito, 25 assets y texturas, incluye Blender/FBX; la página del autor permite uso comercial/no comercial y modificaciones dentro de proyectos, pero prohíbe revender o redistribuir los assets por separado. No se ha descargado.
- Poly Haven: sus recursos se publican bajo CC0; adecuados para materiales, HDRI y props compatibles. Ninguna textura de Poly Haven está integrada todavía.
- MakeHuman: los assets gráficos principales y modelos generados se indican como CC0, aptos para juegos comerciales. No se ha generado ningún personaje en esta entrega.
- Fab Standard License: permite incorporar y modificar assets en proyectos distribuidos comercialmente, pero no redistribuir el asset de forma independiente. La licencia concreta y el precio se revisan por listing.

### Candidatos que necesitan valoración

- Fab — *Modular Hospital Interior Environment*: listado de 230 assets con Nanite/Lumen y soporte de UE 5.1–5.8; el precio actual no quedó verificado y no se ha comprado ni descargado.
- Sketchfab — *Hospital Hallway* de tobys3d: CC Attribution; 8,2 millones de triángulos según su ficha. Requeriría atribución y optimización/LOD; no es candidato para integrar tal cual.
- Sketchfab — *Game character, Girl. Rigged, textured, animated* de gbarzu: CC Attribution, 23,3k triángulos, texturas alrededor de 2K y rig basado en Mixamo según ficha. Es estilizado y no se considera la Alma definitiva.
- Sketchfab — *Male Model Rigged* de lnsnick: CC Attribution, low-poly y con idle; no es un personaje fotorrealista final.
- Khronos glTF Sample Assets: cada modelo tiene su licencia/atribución propia; no se asume que toda la biblioteca comparta la misma licencia.

## 5. Decisiones y bloqueos abiertos

1. Unreal 5.8 es el motor elegido para PC; la compilación está bloqueada hasta disponer de UE 5.8 y toolchain Windows.
2. Las figuras geométricas de Alma y el celador deben reemplazarse por mallas humanas orgánicas, rig facial/corporal, pesos y animaciones.
3. Los modelos del catálogo Jutsu no se enviarán con el juego comercial mientras la licencia individual no esté confirmada.
4. El paquete hospitalario gratuito de Fab es el candidato de entorno prioritario para descargar e integrar después de acceder a Fab con la cuenta autorizada.
5. Se necesita una herramienta de autoría/rigging instalada (Blender/MakeHuman) o un asset humano con licencia y rig verificados.
6. El juego web no se elimina: queda como referencia de mecánicas e historia, no como entrega final de PC.