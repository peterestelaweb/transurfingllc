# 🎬 Guía de Flow - Animación Timeline Jump

**Proyecto:** Transurfing LLC Hero Section  
**Fecha:** 2026-02-05  
**Prerequisito:** Tener frames generados de Whisk

---

## 📋 Paso a Paso en Flow

### 1️⃣ Acceder a Flow

**URL:** https://labs.google/fx/tools/video-fx/

**Requisitos:**
- Cuenta de Google
- Frames de Whisk descargados (mínimo Frame A y Frame B)

---

### 2️⃣ Subir Frames

**Orden de subida:**
```
1. frame-a-inicio-gris.jpg
2. frame-c-transicion-25.jpg (opcional)
3. frame-d-transicion-50.jpg (opcional)
4. frame-e-transicion-75.jpg (opcional)
5. frame-b-final-naranja.jpg
```

**Tip:** Si solo tienes Frame A y Frame B, Flow generará los intermedios automáticamente.

---

### 3️⃣ Configuración Recomendada

#### Configuración Básica (Solo Frame A → B)

```
Frame Rate: 30 fps
Duración: 5-6 segundos
Interpolación: Smooth
Motion Blur: Activado (Alta intensidad)
Resolución: 1920x1080 (Full HD)
```

#### Configuración Avanzada (Con frames intermedios)

```
Frame Rate: 30 fps
Duración: 6-8 segundos
Interpolación: Ultra Smooth
Motion Blur: Activado (Media-Alta)
Resolución: 1920x1080 o 2560x1440
Easing: Ease-in-out (aceleración gradual)
```

---

### 4️⃣ Prompts de Movimiento para Flow

Si Flow permite agregar prompts de texto para guiar la animación, usa:

**Prompt Principal:**
```
Camera flying extremely fast through a tunnel of light, 
streaks accelerating from slow to maximum velocity, 
colors shifting smoothly from grey to intense glowing orange, 
explosive acceleration feeling, warp speed energy
```

**Prompts Alternativos:**

**Opción 1 - Más descriptivo:**
```
First-person perspective traveling through a hyperspace tunnel,
starting slow in grey dull tones then accelerating rapidly,
environment transforming to vibrant orange #FF6B00 light streaks,
motion blur increasing, sensation of breaking through barriers
```

**Opción 2 - Cinematográfico:**
```
Cinematic warp speed sequence, grey static tunnel morphing into 
explosive orange light burst, dramatic acceleration effect,
Star Wars style hyperspace jump, smooth transition with intense energy
```

---

### 5️⃣ Ajustes de Timing

**Distribución de tiempo sugerida (video de 6 segundos):**

```
0:00 - 0:30s  → Frame A (gris) - Apertura calmada
0:30 - 1:00s  → Inicio aceleración sutil
1:00 - 2:00s  → Transición activa (gris → naranja)
2:00 - 4:00s  → Aceleración máxima (naranja intenso)
4:00 - 6:00s  → Frame B sostiene - Explosión de energía
```

**Para loop seamless:**
- Añadir fade out en Frame B (últimos 0.5s)
- Añadir fade in en Frame A (primeros 0.5s)
- Flow puede crear transición A→B→A para loop continuo

---

### 6️⃣ Exportar Video

**Configuración de Export:**

```
Formato: MP4
Codec: H.264 (mejor compatibilidad web)
Bitrate: 5-8 Mbps (balance calidad/tamaño)
Resolución: 1920x1080 (Full HD)
Frame Rate: 30 fps
Tamaño objetivo: < 10 MB
```

**Nombre de archivo:**
```
transurfing-timeline-jump.mp4
```

**Guardar en:**
```
/Users/maykacenteno/Desktop/WEBS EN LOCAL/TRANSURFING/videos/
```

---

### 7️⃣ Post-Procesamiento (Opcional)

Si el video es muy pesado (> 10 MB), optimizar con FFmpeg:

```bash
cd "/Users/maykacenteno/Desktop/WEBS EN LOCAL/TRANSURFING/videos"

ffmpeg -i transurfing-timeline-jump.mp4 \
  -vcodec h264 \
  -acodec aac \
  -b:v 2M \
  -maxrate 2M \
  -bufsize 4M \
  -movflags +faststart \
  transurfing-timeline-jump-optimized.mp4
```

**Esto reduce el tamaño sin perder calidad visible.**

---

## ✅ Checklist de Flow

- [ ] Acceder a Flow (https://labs.google/fx/tools/video-fx/)
- [ ] Subir Frame A (inicio gris)
- [ ] Subir Frame B (final naranja)
- [ ] Subir frames intermedios (si los tienes)
- [ ] Configurar 30 fps
- [ ] Activar motion blur
- [ ] Configurar duración 5-8 segundos
- [ ] Agregar prompt de movimiento (si aplica)
- [ ] Preview de la animación
- [ ] Ajustar timings si es necesario
- [ ] Exportar como MP4 en H.264
- [ ] Descargar video
- [ ] Guardar en carpeta `videos/`
- [ ] Verificar tamaño < 10 MB
- [ ] Optimizar con FFmpeg si es necesario
- [ ] ✅ Video listo para implementar

---

## 🎯 Qué Buscar en el Preview

**Criterios de Calidad:**

✅ **Transición suave:** No debería haber "saltos" entre frames
✅ **Aceleración progresiva:** No debe sentirse constante, sino acelerando
✅ **Colores correctos:** Gris apagado → Naranja #FF6B00 vibrante
✅ **Motion blur convincente:** Efecto warp speed realista
✅ **Centro bien definido:** Espacio para texto del hero
✅ **Loop seamless:** Si es para loop, que A→B→A fluya

**Si algo no se ve bien:**
- Ajusta la intensidad del motion blur
- Cambia el easing (aceleración)
- Prueba con más frames intermedios
- Regenera en Whisk con prompts ajustados

---

## 📊 Configuraciones Alternativas

### Versión Corta (3-4 segundos)
```
Frame Rate: 30 fps
Duración: 3.5 segundos
Interpolación: Fast
Motion Blur: Alta
Uso: Para usuarios con conexión lenta
```

### Versión Larga (10 segundos)
```
Frame Rate: 30 fps
Duración: 10 segundos
Interpolación: Ultra Smooth
Motion Blur: Media
Uso: Para experiencia más contemplativa
```

### Versión Loop Perfecto
```
Frame Rate: 30 fps
Frames: A → B → A
Duración: 8 segundos
Interpolación: Smooth
Uso: Loop continuo sin cortes visibles
```

---

## 🆘 Troubleshooting

### "El video se ve entrecortado"
→ Aumenta el frame rate a 60 fps
→ Activa motion blur
→ Añade más frames intermedios

### "La transición es muy abrupta"
→ Genera frames C, D, E en Whisk
→ Usa interpolación "Ultra Smooth"
→ Aumenta la duración total

### "Los colores no se ven correctos"
→ Verifica que los frames de Whisk usen #FF6B00
→ Ajusta el color grading en Flow (si disponible)
→ Post-procesa con Adobe After Effects

### "El archivo es muy pesado"
→ Usa el comando FFmpeg para optimizar
→ Reduce bitrate a 2 Mbps
→ Considera resolución 1280x720 para móvil

---

## ⏭️ Siguiente Paso: Implementación

Una vez tengas `transurfing-timeline-jump.mp4` listo:

1. Verificar que está en `/videos/`
2. Crear fallback image (Frame B estático): `/images/hero-animation/fallback.jpg`
3. Implementar código HTML/CSS/JS según `implementation_plan.md`

---

**¡El video está casi listo! 🚀**
