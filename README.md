# Programador de Turnos (Front)

Dashboard construido en **Next.js** que se conecta con el backend [`programador_turnos`](https://github.com/jveinti2/programador_turnos) para administrar y visualizar la programación de turnos de manera dinámica y asistida por IA.

## ✨ Funcionalidades principales

- Cambio dinámico de cliente
- Visualización de estadísticas generales
- Personalización de reglas del motor de turnos
- Configuración del **LLM post-procesador**
- Módulo de programación: generación con LLM, ajustes manuales y validaciones
- Visualizador de turnos y estados

---

## 🚀 Getting Started

### Requisitos previos

- Node.js ≥ 18
- npm, yarn o pnpm
- Acceso y configuración del backend `programador_turnos`

### Instalación

```bash
pnpm install
# o
npm install
```

### Desarrollo local

```bash
pnpm dev
# o
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

>

```bash
# Si se llega a tener un error al abrir, puedes probar deshabilitando el bloequo de node por defecto por politicar de empresa con
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
```

---

## ⚙️ Configuración de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> 🔒 **Importante:** no subir este archivo al control de versiones.

---

## 🧩 Estructura del proyecto

```
src/
 ├─ components/        # Componentes reutilizables
 ├─ modules/           # Módulos principales (programación, visualizador, etc.)
 ├─ services/          # Conexión con el backend y APIs
 ├─ hooks/             # Custom hooks
 └─ utils/             # Funciones auxiliares y helpers
```

---

## 🧠 Integración con IA

El front consume un end point que se conecta con un **LLM post-procesador** configurable, que optimiza y ajusta los resultados generados por el backend antes de mostrarlos en la interfaz.  
Desde el dashboard es posible personalizar prompts, reglas y comportamiento del modelo.

---

## 🧰 Scripts útiles

| Comando      | Descripción                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Inicia el entorno de desarrollo      |
| `pnpm build` | Compila la app para producción       |
| `pnpm start` | Corre el servidor en modo producción |

---

## 🧑‍💻 Contribuir

1. Crear una nueva rama desde `develop`
2. Hacer commit siguiendo las convenciones del proyecto
3. Abrir un Pull Request
4. La rama se eliminará automáticamente tras el merge

---

## 🪪 Licencia

MIT © jveinti2
