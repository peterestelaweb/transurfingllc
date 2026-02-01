---
name: github-backup
description: Automates the process of creating a perfect backup to GitHub using git add, commit, and push.
---

# GitHub Backup Skill

This skill ensures a **perfect exact copy** of the local codebase is uploaded to GitHub by strictly following the 3 mandatory stages.

## ⚠️ Critical Rules

If you miss any of these steps, the copy on GitHub will NOT be exact:
1.  **git add .** (Staging)
2.  **git commit** (Confirming)
3.  **git push** (Uploading)

## Workflow

When the user asks for a backup, sync, or upload to GitHub, FOLLOW THIS EXACT PROCESS:

### 1. Explain the Process
Always reinforce the user's learning by explaining what you are about to do:

> "Voy a ejecutar los 3 pasos de Git para sincronizar con GitHub:"
>
> *   "📦 **Paso 1:** `git add .` → Agrega todos los cambios al área de staging"
> *   "✅ **Paso 2:** `git commit` → Confirma los cambios con un mensaje"
> *   "🚀 **Paso 3:** `git push` → Sube los commits a GitHub"

### 2. Execute the Script
Run the automated script with a descriptive message. **NEVER use generic messages** like "updates" or "changes".

**Construct a good commit message:**
*   ✅ "Fix: corregir error de validación en formulario"
*   ✅ "Add: nueva función de búsqueda de productos"
*   ✅ "Update: mejorar rendimiento de análisis de PDFs"

**Command:**
```bash
.agent/skills/github-backup/scripts/backup.sh "TYPE: Description of changes"
```

### 3. Confirm Result
If the script succeeds, confirm to the user:
> "✨ ¡Backup completado! Tu repositorio está sincronizado con GitHub."

## Manual Fallback
If the script fails or cannot be run, execute the commands manually in order:

```bash
git add .
git commit -m "Your descriptive message"
git push
```
