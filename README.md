# 🏢 SIRH Molino App

Sistema Integral de Recursos Humanos desarrollado con React + Vite + Firebase

## 📋 Descripción

SIRH Molino App es una aplicación web moderna para la gestión integral de recursos humanos, que incluye administración de empleados y contratos. Utiliza Firebase para autenticación y almacenamiento de datos.

## ✨ Características

### 🔐 Autenticación
- Login con email y contraseña (Firebase Auth)
- Recuperación de contraseña
- Rutas protegidas
- Persistencia de sesión

### 👥 Gestión de Empleados
- CRUD completo de empleados
- Campos: Documento, Nombre, Apellido, Edad, Género, Cargo, Correo, Contacto, Estado
- Visualización en tabla responsive
- Estados visuales (Activo/Retirado)
- Búsqueda y filtrado

### 📄 Gestión de Contratos
- CRUD completo de contratos por empleado
- Relación 1-N (empleado → contratos)
- Tipos: Indefinido, Fijo, Obra o Labor, Prestación de Servicios, etc.
- Campos: Tipo, Fechas, Salario, Estado, Descripción
- Formato de moneda colombiana (COP)

### 📊 Dashboard
- Vista general de estadísticas
- Navegación rápida
- Sidebar con menú
- Acciones rápidas

## 🚀 Tecnologías

- **React** 19.2.0
- **Vite** 7.1.9
- **Firebase** 12.4.0 (Auth + Firestore)
- **React Router DOM** 7.9.4
- **Bun** (Package Manager)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Entrar al directorio
cd sirh-molino-app

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz con:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### Firebase Setup

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password)
3. Crear base de datos Firestore
4. Configurar reglas de seguridad (ver abajo)
5. Copiar credenciales al archivo `.env`

### Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{employeeId} {
      allow read, write: if request.auth != null;
      
      match /contracts/{contractId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

## 🎯 Uso

```bash
# Modo desarrollo
bun run dev

# Build para producción
bun run build

# Preview del build
bun run preview

# Linting
bun run lint
```

La aplicación estará disponible en: **http://localhost:5173**

## 📁 Estructura del Proyecto

```
sirh-molino-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ContractModal.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EmployeeDetailPage.jsx
│   │   ├── EmployeeListPage.jsx
│   │   ├── EmployeeModal.jsx
│   │   ├── EmployeeTable.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── ProtectedRoute.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
```

## 🛣️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/login` | Página de inicio de sesión |
| `/` | Dashboard principal |
| `/employees` | Lista de empleados |
| `/employees/:id` | Detalles del empleado y contratos |

## 📚 Documentación

- [AUTH_GUIDE.md](./AUTH_GUIDE.md) - Guía de autenticación
- [SPRINT2_GUIDE.md](./SPRINT2_GUIDE.md) - Documentación del Sprint 2
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumen de implementación

## 🎨 Capturas

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Gestión de Empleados
![Empleados](docs/screenshots/employees.png)

### Detalles y Contratos
![Contratos](docs/screenshots/contracts.png)

## 🔒 Seguridad

- Todas las rutas principales están protegidas con autenticación
- Las operaciones de Firestore requieren usuario autenticado
- Validación de datos en el frontend
- Reglas de seguridad en Firestore

## 🐛 Problemas Conocidos

Ninguno reportado actualmente.

## 🗺️ Roadmap

- [ ] Búsqueda avanzada de empleados
- [ ] Filtros por cargo, estado, etc.
- [ ] Paginación de tablas
- [ ] Exportación a Excel/PDF
- [ ] Reportes y estadísticas
- [ ] Sistema de permisos por rol
- [ ] Notificaciones en tiempo real
- [ ] Adjuntos y documentos
- [ ] Historial de cambios

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 👨‍💻 Autor

Desarrollado para Molino App

## 🙏 Agradecimientos

- Firebase por la plataforma backend
- React y Vite por las herramientas de desarrollo
- La comunidad open source

---

**Versión:** 0.0.0  
**Última actualización:** Octubre 2025
