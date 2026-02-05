# 🚀 Hero Section "Timeline Jump" - Setup Completo

**Status:** ✅ Preparado para empezar creación de assets  
**Rama Git:** `hero-slide-seccion`  
**Fecha:** 2026-02-05

---

## 📂 Estructura Creada

```
/Users/maykacenteno/Desktop/WEBS EN LOCAL/TRANSURFING/
├── videos/                          ✅ Carpeta para el video final
├── images/hero-animation/           ✅ Carpeta para frames de Whisk
├── WHISK_PROMPTS.md                 ✅ Prompts listos para copiar
├── FLOW_GUIDE.md                    ✅ Guía paso a paso de Flow
├── hero-section-new.html            ✅ Código de implementación
└── README_HERO_IMPLEMENTATION.md    📄 Este archivo
```

---

## 🎯 Workflow Completo

### Fase 1: Generar Assets en Whisk (TU TRABAJO) ⏱️ 1-2 horas

1. **Abrir:** `WHISK_PROMPTS.md`
2. **Ir a:** https://labs.google/fx/tools/whisk/
3. **Copiar y pegar** cada prompt
4. **Generar** 3-5 variaciones de cada frame
5. **Descargar** los mejores frames
6. **Guardar** en `images/hero-animation/` con estos nombres:
   - `frame-a-inicio-gris.jpg` (inicio, gris apagado)
   - `frame-b-final-naranja.jpg` (final, naranja explosivo)
   - `frame-c-transicion-25.jpg` (opcional)
   - `frame-d-transicion-50.jpg` (opcional)
   - `frame-e-transicion-75.jpg` (opcional)
   - `fallback.jpg` (copia de frame-b para fallback)

---

### Fase 2: Crear Video en Flow (TU TRABAJO) ⏱️ 30-60 min

1. **Abrir:** `FLOW_GUIDE.md`
2. **Ir a:** https://labs.google/fx/tools/video-fx/
3. **Subir frames** en orden: A → (C) → (D) → (E) → B
4. **Configurar:**
   - Frame rate: 30 fps
   - Duración: 6-8 segundos
   - Motion blur: Activado
   - Interpolación: Smooth
5. **Exportar** como MP4
6. **Guardar** como `videos/transurfing-timeline-jump.mp4`

**Opcional:** Si el video > 10 MB, optimizar con FFmpeg (comando en FLOW_GUIDE.md)

---

### Fase 3: Implementar en el Sitio (ANTIGRAVITY) ⏱️ 30 min

**Una vez tengas el video listo, dime y yo:**

1. Reemplazo la hero section en `index.html` con el código de `hero-section-new.html`
2. Agrego fallbacks y optimizaciones
3. Testing de performance
4. Ajusto responsiveness

---

## ✅ Checklist de Progreso

### Assets Creation
- [ ] Frame A generado en Whisk
- [ ] Frame B generado en Whisk
- [ ] Frames intermedios generados (opcional)
- [ ] Frames descargados y guardados
- [ ] Fallback.jpg creado (copia de Frame B)

### Video Creation
- [ ] Frames subidos a Flow
- [ ] Video configurado (30fps, 6-8s)
- [ ] Preview revisado y aprobado
- [ ] Video exportado como MP4
- [ ] Video guardado en `videos/`
- [ ] Video optimizado (si es necesario)

### Implementation
- [ ] Video final en `videos/transurfing-timeline-jump.mp4`
- [ ] Fallback en `images/hero-animation/fallback.jpg`
- [ ] Código implementado en `index.html`
- [ ] Testing desktop (Chrome, Safari, Firefox)
- [ ] Testing móvil
- [ ] Performance check (Lighthouse)
- [ ] Commit en rama `hero-slide-seccion`

---

## 📖 Documentos de Referencia

| Archivo | Propósito | Cuándo Usar |
|---------|-----------|-------------|
| `WHISK_PROMPTS.md` | Prompts listos para Whisk | **AHORA** - Fase 1 |
| `FLOW_GUIDE.md` | Configuración de Flow | Fase 2 - Después de Whisk |
| `hero-section-new.html` | Código de implementación | Fase 3 - Cuando tengas video |
| `implementation_plan.md` | Plan técnico completo | Referencia general |
| `task.md` | Checklist del proyecto | Seguimiento de progreso |

---

## 🎨 Assets Necesarios - Resumen Visual

### Frame A - "Realidad Limitada"
```
🎨 Colores: Gris apagado, plateado
⚡ Energía: Mínima, estático
🎬 Concepto: Túnel hyperspace lento, oscuro
```

### Frame B - "Realidad Abundante"
```
🎨 Colores: Naranja #FF6B00 explosivo
⚡ Energía: Máxima, radiante
🎬 Concepto: Explosión warp speed, luz brillante
```

### Video Final
```
📹 Formato: MP4, H.264
⏱️ Duración: 6-8 segundos
📐 Resolución: 1920x1080 (Full HD)
💾 Tamaño: < 10 MB
🔄 Loop: Seamless (opcional)
```

---

## 💡 Tips Importantes

### Para Whisk:
- ✅ Menciona siempre el color #FF6B00 para consistencia
- ✅ Usa "photorealistic", "8K", "cinematic" para mejor calidad
- ✅ Genera múltiples variaciones y elige la mejor
- ✅ Landscape 16:9 aspect ratio

### Para Flow:
- ✅ Solo 2 frames (A y B) es suficiente, Flow crea intermedios
- ✅ Motion blur es CRÍTICO para efecto warp speed
- ✅ 30fps es sweet spot (calidad vs tamaño)
- ✅ Preview antes de exportar

### Para Implementación:
- ✅ Video DEBE ser `muted` para autoplay
- ✅ Fallback image es importante para móviles
- ✅ Test en Safari (es más restrictivo con video autoplay)

---

## 🆘 Si Tienes Problemas

### "Whisk no genera lo que quiero"
→ Ajusta el prompt, sé más específico
→ Prueba las variaciones alternativas del WHISK_PROMPTS.md
→ Muéstrame lo que genera para sugerencias

### "Flow hace transición muy rápida"
→ Aumenta duración a 8-10 segundos
→ Añade frames intermedios (C, D, E)
→ Usa interpolación "Ultra Smooth"

### "El video es muy pesado"
→ Usa el comando FFmpeg en FLOW_GUIDE.md
→ Reduce bitrate a 2 Mbps
→ Considera 1280x720 para versión móvil

---

## ⏭️ SIGUIENTE PASO INMEDIATO

### 👉 **EMPIEZA AQUÍ:**

1. Abre `WHISK_PROMPTS.md`
2. Ve a https://labs.google/fx/tools/whisk/
3. Copia el primer prompt de Frame A
4. Genera imágenes
5. Repite con Frame B

**Tiempo estimado para completar Whisk:** 1-2 horas  
**Avísame cuando tengas los frames listos!** 🚀

---

**¿Listo para empezar?** El siguiente paso es abrir WHISK_PROMPTS.md y comenzar a generar los frames. ¡Buena suerte! 🎨
