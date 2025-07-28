# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# 📦 Estructura del Proyecto

Este proyecto es una aplicación web desarrollada en **JavaScript** utilizando **React** como biblioteca principal. También se integran las siguientes herramientas:

- **React Router** para la navegación entre vistas
- **Axios** para realizar peticiones HTTP
- **Context API** para el manejo de estado global
- **Hooks personalizados** para encapsular lógica reutilizable

---

# 🧩 Componentes Principales

- `App`: Componente raíz que define las rutas principales
- `Login`, `Register`, `Dashboard`, `Profile`, `Settings`: Vistas clave de la aplicación
- `Navbar`, `Sidebar`, `Footer`: Componentes de interfaz reutilizables
- `PrivateRoute`: Componente que protege rutas privadas verificando autenticación

---

# 🔐 Autenticación

- Uso de **tokens JWT** almacenados en `localStorage`
- Verificación de expiración del token y redirección al login si es inválido
- **Interceptors de Axios** para añadir el token automáticamente a cada petición

---

# 🧠 Estado Global

- Implementación de `AuthContext` para manejar el estado de autenticación
- Hook personalizado `useAuth` para acceder fácilmente al contexto
- Otros hooks personalizados:
  - `useForm`
  - `useFetch`
  - `useToggle`

---

# 🗂️ Rutas

Definidas con `BrowserRouter`, `Routes` y `Route`.

- **Rutas públicas**:

  - `/login`
  - `/register`

- **Rutas privadas**:
  - `/dashboard`
  - `/profile`
  - `/settings`

---

# 📡 Comunicación con Backend

- Configuración de Axios con una **base URL**
- Peticiones HTTP:
  - `GET`
  - `POST`
  - `PUT`
  - `DELETE`
- Manejo de errores con `try/catch` y mensajes amigables al usuario

---

# 🎨 Estilos

- Uso de **CSS modular** o **styled-components** (según el fragmento)
- Soporte para **tema claro/oscuro** con toggle en la vista `Settings`

---

# 🧪 Validaciones

- Validación de formularios en `Login` y `Register` usando **expresiones regulares**
- Mensajes de error dinámicos según el campo y su estado

---

# 📊 Manejo de Datos

- `Dashboard` muestra datos estadísticos con gráficos (posiblemente usando **Chart.js**)
- Paginación y filtros para listas de usuarios o elementos
