# Misincol Backend API (NestJS)

Backend REST API modular desarrollado con **NestJS** para la plataforma **Misincol (Plan de Desarrollo Ministerial)**.

---

## 🚀 Requisitos
- Node.js >= 20.x
- npm >= 10.x

---

## 📦 Instalación
```bash
npm install
```

---

## 🛠️ Ejecución y Desarrollo
```bash
# Desarrollo con recarga automática
npm run start:dev

# Compilación de producción
npm run build

# Ejecución en producción
npm run start:prod
```

---

## 🏛️ Estructura de Módulos (Vertical Slicing)
- `src/common/validators/`: Validadores de dominio con `class-validator` (validación de coherencia entre Pilar y Etapa).
- `src/modules/plans/`: Módulo de gestión de fases ministeriales, objetivos dinámicos y actividades territoriales.
- `src/modules/teams/`: Supervisión de equipos y métricas consolidadas.
