# 👤 Sistema de Perfiles de Usuario con Avatares - SIRH Molino App

## ✅ Características Implementadas

### 📁 Estructura de Archivos Creados/Modificados

1. **`src/config/avatars.js`** - ✨ NUEVO
   - Array de 15 avatares divertidos estilo cartoon
   - Funciones auxiliares para gestión de avatares

2. **`src/components/DashboardPage.jsx`** - ✏️ MODIFICADO
   - Sistema de perfiles de usuario con Firestore
   - useEffect para cargar/crear perfiles automáticamente
   - Integración de avatar en el sidebar

3. **`src/components/DashboardPage.css`** - ✏️ MODIFICADO
   - Estilos para avatar circular con hover effect
   - Skeleton loader para estado de carga
   - Diseño mejorado del header del sidebar

---

## 🎨 Array de Avatares (avatars.js)

### Fuente de Avatares
**DiceBear API** - Servicio gratuito de generación de avatares SVG

### Estilos Incluidos (15 avatares totales):

1. **Avataaars** (5 avatares)
   - Estilo: Cartoon characters similar a Sketch
   - Seeds: Felix, Aneka, Luna, Max, Bella

2. **Bottts** (3 avatares)
   - Estilo: Robots lindos
   - Seeds: Fluffy, Cuddles, Snickers

3. **Adventurer** (3 avatares)
   - Estilo: Personajes de aventura
   - Seeds: Princess, Cooper, Chloe

4. **Big Smile** (2 avatares)
   - Estilo: Caras felices
   - Seeds: Happy, Sunshine

5. **Lorelei** (2 avatares)
   - Estilo: Ilustraciones lindas
   - Seeds: Whiskers, Mittens

### Funciones Exportadas

```javascript
// 1. Array principal
export const FUN_AVATARS = [...]

// 2. Obtener avatar aleatorio
export const getRandomAvatar = () => {...}

// 3. Obtener avatar determinístico por email
export const getAvatarByEmail = (email) => {...}
```

---

## 🔥 Integración con Firestore

### Colección: `users`

**Estructura del documento:**
```javascript
{
  email: string,                    // Email del usuario
  profilePictureUrl: string,        // URL del avatar asignado
  createdAt: string (ISO 8601),     // Timestamp de creación
  displayName: string               // Nombre para mostrar
}
```

**ID del documento:** `auth.currentUser.uid`

---

## 🔄 Flujo de Creación de Perfil

### useEffect Hook en DashboardPage.jsx

```javascript
useEffect(() => {
  if (user) {
    getUserProfile();
  }
}, [user]);
```

### Función getUserProfile()

**Paso 1: Verificar si existe el perfil**
```javascript
const userDocRef = doc(db, 'users', user.uid);
const userDocSnap = await getDoc(userDocRef);
```

**Paso 2a: Si existe → Cargar datos**
```javascript
if (userDocSnap.exists()) {
  setUserProfile(userDocSnap.data());
}
```

**Paso 2b: Si NO existe → Crear perfil nuevo**
```javascript
else {
  const newUserProfile = {
    email: user.email,
    profilePictureUrl: getRandomAvatar(),
    createdAt: new Date().toISOString(),
    displayName: user.displayName || user.email.split('@')[0],
  };
  
  await setDoc(userDocRef, newUserProfile);
  setUserProfile(newUserProfile);
}
```

---

## 🎨 Diseño Visual del Avatar

### Ubicación
**Sidebar Header** - Parte superior izquierda del dashboard

### Componente HTML
```jsx
<div className="user-profile-section">
  {loadingProfile ? (
    <div className="avatar-skeleton"></div>
  ) : (
    <img 
      src={userProfile?.profilePictureUrl} 
      alt="Avatar" 
      className="user-avatar"
    />
  )}
  <div className="user-info-text">
    <h2>SIRH Molino</h2>
    <p className="user-info">{userProfile?.displayName}</p>
    <span className="user-email-small">{user?.email}</span>
  </div>
</div>
```

### Características CSS

**Avatar:**
- ✅ Tamaño: 50x50px
- ✅ Forma: Circular (border-radius: 50%)
- ✅ Borde: 3px blanco semi-transparente
- ✅ Hover effect: Scale 1.1 + cambio de color de borde
- ✅ Transiciones suaves (0.3s ease)

**Skeleton Loader:**
- ✅ Animación shimmer durante carga
- ✅ Gradiente blanco semi-transparente
- ✅ Mismo tamaño que avatar final
- ✅ Animación infinita 1.5s

---

## 📊 Estado de la Aplicación

### Estados Locales Agregados

```javascript
const [userProfile, setUserProfile] = useState(null);
const [loadingProfile, setLoadingProfile] = useState(true);
```

### Imports Agregados

```javascript
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getRandomAvatar } from '../config/avatars';
```

---

## 🚀 Funcionamiento

### Primera Vez (Nuevo Usuario)

1. Usuario inicia sesión
2. `useEffect` se ejecuta con `user` disponible
3. `getUserProfile()` verifica en Firestore
4. **Documento NO existe** → Primera vez
5. Genera avatar aleatorio de `FUN_AVATARS`
6. Crea documento en `users/{uid}` con `setDoc`
7. Avatar aparece en sidebar
8. ✅ Perfil creado permanentemente

### Siguientes Veces (Usuario Existente)

1. Usuario inicia sesión
2. `useEffect` se ejecuta
3. `getUserProfile()` encuentra documento existente
4. Carga datos con `getDoc`
5. Muestra el **mismo avatar** asignado anteriormente
6. ✅ Perfil persistente

---

## 🎯 Ventajas de esta Implementación

### ✅ Automático
- No requiere intervención del usuario
- Avatar asignado en el primer login

### ✅ Persistente
- Avatar guardado en Firestore
- Siempre el mismo avatar para cada usuario

### ✅ Divertido
- 15 avatares cartoon variados
- Estilo amigable y profesional

### ✅ Escalable
- Fácil agregar más avatares al array
- Posibilidad de cambiar avatar después

### ✅ Gratuito
- DiceBear API es libre y gratuita
- No requiere credenciales

---

## 🔮 Mejoras Futuras (Opcional)

1. **Selector de Avatar**
   - Permitir al usuario elegir su avatar
   - Modal con grid de todos los avatares disponibles

2. **Upload de Imagen**
   - Permitir subir foto personalizada
   - Integrar con Firebase Storage

3. **Más Información de Perfil**
   - Nombre completo, teléfono, departamento
   - Página de configuración de perfil

4. **Avatar en Más Lugares**
   - Mostrar en navbar de todas las páginas
   - Mostrar en comentarios/observaciones

5. **Gamificación**
   - Desbloquear avatares especiales
   - Avatares por logros/antigüedad

---

## 📝 Ejemplo de Documento en Firestore

### Colección: `users`
### Documento ID: `kJ3n4k5j6n7k8n9k0` (UID de Firebase Auth)

```json
{
  "email": "admin@molino.com",
  "profilePictureUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "createdAt": "2025-10-14T15:30:00.000Z",
  "displayName": "admin"
}
```

---

## 🐛 Manejo de Errores

### Console Logs
```javascript
// Éxito al crear perfil
console.log('✅ New user profile created with fun avatar!');

// Error en la operación
console.error('Error fetching/creating user profile:', error);
```

### Try-Catch
- ✅ Envuelve toda la operación en try-catch
- ✅ `finally` asegura que `loadingProfile` se desactive

---

## 🎨 Tema Visual

### Colores (Strawberry Dessert)
- Borde avatar: Blanco semi-transparente (rgba(255, 255, 255, 0.3))
- Hover: Color crema (var(--accent-cream))
- Background skeleton: Gradiente blanco animado

### Tipografía
- Display Name: 13px, font-weight 600
- Email: 10px, opacity 0.7
- Title: 18px, font-weight 700

---

## ✅ Checklist de Implementación

- [x] Crear `src/config/avatars.js`
- [x] Exportar array `FUN_AVATARS` con 15+ URLs
- [x] Usar DiceBear API gratuita
- [x] Crear función `getRandomAvatar()`
- [x] Modificar `DashboardPage.jsx`
- [x] Agregar imports de Firestore (`doc`, `getDoc`, `setDoc`)
- [x] Crear `useEffect` que ejecute en login
- [x] Implementar función `getUserProfile()`
- [x] Verificar documento en colección `users`
- [x] Crear documento si no existe con `setDoc`
- [x] Asignar avatar aleatorio del array
- [x] Guardar email y profilePictureUrl
- [x] Mostrar avatar en sidebar
- [x] Crear estilos CSS para avatar circular
- [x] Implementar skeleton loader
- [x] Agregar hover effects
- [x] Verificar sin errores de compilación

---

**Fecha de Implementación:** Octubre 14, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Completado y Funcionando  
**Colección Firestore:** `users`  
**Servicio de Avatares:** DiceBear API v7.x
