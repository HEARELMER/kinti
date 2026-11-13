# 🪶 Kinti: una aventura por el Perú

**“Kinti: una aventura por el Perú”** es un videojuego web 2D de exploración e inmersión histórica diseñado para estudiantes de secundaria. Desarrollado con un enfoque pedagógico riguroso, minimalismo visual cálido y mecánicas fluidas de navegación lateral sin dependencias de motores pesados ni backends.

El jugador acompaña a **Kinti**, un pequeño colibrí aventurero que viaja por tres grandes hitos de la historia del Perú para recuperar los tres fragmentos de la **Medalla del Tiempo**.

---

## 🚀 Comandos del Proyecto (Bun)

Instalación de dependencias:
```bash
bun install
```

Iniciar servidor de desarrollo:
```bash
bun run dev
```

Compilar para producción (TypeScript + Vite):
```bash
bun run build
```

Previsualizar la compilación de producción:
```bash
bun run preview
```

---

## 🛠️ Tecnologías Utilizadas

- **Runtime y gestor de paquetes:** [Bun](https://bun.sh/) (v1.4.2+)
- **Bundler y entorno:** [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Interfaz y Escenarios:** HTML semántico y CSS moderno estructurado (transformaciones GPU aceleradas `translate3d`, `scaleX`, variables CSS).
- **Recursos locales:** Ilustraciones y sprites vectoriales locales exportados e integrados desde Stitch (Kinti, escenarios de Caral, Mundo Inca, Independencia 1821 y la Medalla del Tiempo).
- **Audio nativo:** Sintetizador Web Audio API puro, sin archivos MP3/WAV externos, garantizando funcionamiento 100% offline y sin latencias de red.
- **Persistencia:** `localStorage` nativo con fallback en memoria (guarda automáticamente etapa actual, fragmentos recolectados y preferencia de sonido).

---

## 🎮 Controles y Jugabilidad

### Teclado (Escritorio)
- **Moverse a la izquierda:** Tecla `A` o Flecha `◀`
- **Moverse a la derecha:** Tecla `D` o Flecha `▶`
- **Explorar / Interactuar:** Tecla `E`, `Espacio` o `Enter`
- **Pausar / Reanudar:** Tecla `Escape`

### Controles Táctiles (Móviles / Tablets)
- **D-Pad inferior:** Botones táctiles `◀` y `▶` con soporte para pulsación continua (`pointerdown`/`pointerup`/`pointercancel`).
- **Botón contextual `✦ Explorar`:** Se ilumina dinámicamente en color coral/pulsante al aproximarse a un punto de descubrimiento o al portal.
- **Toque directo:** Permite tocar directamente los nodos de descubrimiento en pantalla al estar cerca de ellos.

---

## 🏛️ Estructura del Recorrido Educativo

Cada época sigue un ciclo pedagógico de 5 pasos:
1. **Misión inicial:** Presentación del objetivo histórico.
2. **Exploración libre:** Recorrido del escenario con cámara de seguimiento suave y descubrimiento de tres elementos clave.
3. **Actividad educativa contextualizada:** Evaluación formativa basada en lo recién explorado.
4. **Recompensa:** Entrega del fragmento cronológico con animación hacia el indicador superior.
5. **Portal temporal:** Desbloqueo del portal para viajar a la siguiente época.

### Etapa 1: Caral (3000 a.C.)
- **Misión:** “Descubre cómo vivían los habitantes de Caral”.
- **Descubrimientos:**
  1. *Río y cultivos:* El agua del valle de Supe permitía cultivar en un entorno desértico.
  2. *Plaza circular:* Espacios de congregación cívica, música y ritos ceremoniales.
  3. *Grandes construcciones:* Pirámides y plataformas edificadas con tecnología de *shicras*, prueba de trabajo colectivo y organización comunitaria.
- **Actividad final:** Relacionar elementos con sus funciones históricas mediante selección táctil. Retroalimentación constructiva y pistas inmediatas en caso de error.

### Etapa 2: Mundo Inca (Siglo XV)
- **Misión:** “Ayuda a un chasqui a entregar un mensaje”.
- **Descubrimientos:**
  1. *Qhapaq Ñan:* La monumental red de caminos de más de 30,000 km que unió los cuatro suyos del Tahuantinsuyo.
  2. *Chasqui:* Mensajeros corredores que transportaban quipus y recados oficiales mediante un sistema ágil de postas.
  3. *Andenes:* Terrazas agrícolas escalonadas que permitían sembrar en pendientes montañosas y regular el microclima.
- **Actividad final:** Decidir a quién entregar el mensaje para que continúe a máxima velocidad (*A otro chasqui en un punto de relevo / tambo*).

### Etapa 3: Independencia (1821)
- **Misión:** “Reúne las pistas de un momento histórico”.
- **Descubrimientos:**
  1. *Personaje:* José de San Martín proclamó solemnemente la independencia en Lima.
  2. *Fecha:* 28 de julio de 1821, conmemoración cívica en las plazas de la capital.
  3. *Lugar:* La Plaza Mayor de Lima, rodeada de balcones coloniales y multitud ciudadana.
- **Actividad final:** Completar la frase histórica seleccionando el personaje y la fecha correctos, con aclaración formativa de que la proclamación fue un hito central cuyo proceso bélico e institucional continuó hasta las batallas de Junín y Ayacucho (1824).

### Pantalla Final
- Ensamble de la **Medalla del Tiempo** completa (los 3 fragmentos unidos).
- Mensaje: *“¡Completaste el viaje!”*.
- Tres recuerdos clave de lo aprendido.
- Opción de reiniciar la aventura de forma limpia.

---

## 📚 Rigor Histórico y Fuentes Consultadas

El juego incluye una sección accesible llamada **“Sobre el contenido”** que documenta las instituciones y fuentes oficiales verificadas:
1. **Zona Arqueológica Caral (ZAC):** Unidad Ejecutora 003 del Ministerio de Cultura del Perú (investigaciones sobre el valle de Supe y arquitectura monumental).
2. **Proyecto Especial Qhapaq Ñan - Sede Nacional:** Ministerio de Cultura del Perú (declarado Patrimonio Mundial UNESCO en 2014; red vial andina y sistema de postas).
3. **Proyecto Especial Bicentenario / Biblioteca Nacional del Perú / Archivo General de la Nación:** Documentación histórica sobre el Acta y Proclamación de la Independencia en julio de 1821.

---

## 📁 Organización del Código

```text
public/
  assets/
    escenario_caral.png           # Escenario recortado sin bandas blancas
    escenario_inca.png            # Escenario andino recortado
    escenario_independencia.png   # Plaza Mayor de Lima recortada
    kinti.png                     # Sprite de Kinti con transparencia alfa
    portal_inicio.png             # Kinti con portal en pantalla de inicio
    medalla_completa.png          # Medalla del Tiempo ensamblada
src/
  audio.ts                        # Sintetizador nativo Web Audio API
  game.ts                         # Motor del juego, físicas, cámara y modales
  main.ts                         # Inicialización de la aplicación
  stages.ts                       # Definiciones pedagógicas y fuentes históricas
  storage.ts                      # Persistencia en localStorage con fallback
  styles.css                      # Sistema de diseño, paleta, HUD y animaciones
index.html                        # Estructura base de la aplicación web
package.json                      # Configuración de dependencias y scripts de Bun
tsconfig.json                    # Configuración TypeScript
vite.config.ts                    # Configuración de Vite (rutas relativas)
README.md                         # Documentación del proyecto
```
