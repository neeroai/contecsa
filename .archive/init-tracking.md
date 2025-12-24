# Initialize Project Tracking

Copy tracking templates (PRD.md, plan.md, todos.md) to project root.

**Usage**: `/init-tracking [feature-name]`

---

**Instructions**:

1. Determine current project root (look for package.json, .git, or pyproject.toml)

2. Copy templates from `/Users/mercadeo/neero/docs-global/templates/project-tracking/` to project root:
   - PRD.md → ./PRD.md
   - plan.md → ./plan.md
   - todos.md → ./todos.md

3. Replace placeholders:
   - `[Feature Name]` → feature name from argument (or ask user)
   - `[Tu nombre]` → Luis Gabriel Cervantes or Javier Polo (detect from git config)
   - `[YYYY-MM-DD]` → today's date
   - Keep all other content as-is

4. Report to user:
   ```
   ✅ Tracking initialized in [project-root]

   Created:
   - PRD.md (problema + solución)
   - plan.md (pasos + stack + horas)
   - todos.md (checkboxes simple)

   Next: Edit PRD.md con tu feature details
   ```

5. Open PRD.md in editor for user to fill

---

**Philosophy**: KISS - Templates caben en 1 pantalla, máximo 40 líneas cada uno
