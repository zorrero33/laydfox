# EL TURNO DE LAS 03:17 — PC / Unreal Engine

Esta carpeta inicia la rama de producción del juego de PC. Está separada de la experiencia WebGL existente en la raíz del repositorio.

## Motor decidido

**Unreal Engine 5.8, Windows 11, C++ + Blueprints.** Se elige por el objetivo de terror cinematográfico en PC: Lumen, Nanite para entornos estáticos, Virtual Shadow Maps, Niagara, Chaos, Enhanced Input, AI Perception y herramientas de animación. No se usa Godot como motor principal porque el objetivo prioritario exige el conjunto de iluminación y producción cinematográfica de Unreal.

## Estado real de esta entrega

- Proyecto C++ y módulos iniciales: en construcción.
- Proyecto Unreal compilado en este entorno: **no**; Unreal Editor, Unreal Build Tool y toolchain de Windows no están instalados aquí.
- Ejecutable Windows: **no existe todavía**.
- Escenario 3D en 3D Jutsu: existe una escena de Hospital Santa Aurelia con revisión 7 y export GLB/Blend disponible desde el proyecto 3D enlazado en el informe de auditoría.
- Modelos humanos finales: pendientes. Las piezas geométricas previas de Alma y del celador son placeholders y no se consideran modelos finales.
- Assets del catálogo 3D Jutsu: importados para prototipado de entorno, pero su licencia individual no está expuesta; no se autorizan aún para una build comercial.

No se debe etiquetar esta carpeta como juego terminado hasta compilar, jugar y superar QA en Unreal.

## Abrir el proyecto

1. Instalar Unreal Engine 5.8 desde Epic Games Launcher en Windows 11.
2. Instalar Visual Studio 2022 o Visual Studio 2026 con el workload de desarrollo C++ para juegos.
3. Abrir `ElTurno0317.uproject`.
4. Permitir la generación de archivos de proyecto y compilar el módulo `ElTurno0317`.
5. Crear/abrir el mapa principal cuando se incorpore el contenido 3D final.

## Controles iniciales previstos

WASD mover · Ratón mirar · Mayús correr · Ctrl agacharse · E interactuar · F linterna · Tab inventario/diario · Esc pausa.

## Estructura

- `Source/ElTurno0317`: C++ de juego.
- `Docs`: auditoría, arquitectura, contenido, licencias y producción.
- `Content/Environments`: mapas y escenarios Unreal.
- `Content/Characters`: esqueletos, personajes y animaciones.
- `Content/Audio`: voces, ambientes y efectos.
- `Content/UI`: widgets y recursos de interfaz.

## Proyecto web anterior

La página pública `https://zorrero33.github.io/laydfox/` se mantiene en la rama `main`. Esta rama `pc-ue5-dev` no modifica el despliegue de GitHub Pages.

## Siguiente hito

Compilar el módulo C++ en Unreal 5.8, crear un mapa de prueba real, importar un entorno con licencia aprobada, y validar interacción/guardado/IA en una sesión de juego.