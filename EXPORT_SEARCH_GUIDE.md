# 📊 Guía de Funcionalidades: Búsqueda y Exportación

## 🎯 Resumen de Implementación

Se han agregado dos funcionalidades clave al sistema SIRH Molino:

1. **Sistema de Búsqueda de Empleados** - Filtrado en tiempo real
2. **Exportación de Reportes** - PDF y Excel para empleados y contratos

---

## 🔍 Sistema de Búsqueda

### Características

- **Búsqueda en tiempo real** mientras el usuario escribe
- **Campos de búsqueda**: Nombre, Apellido y Nro. Documento
- **Contador dinámico** muestra resultados filtrados vs. total
- **Botón de limpieza rápida** (✕) para resetear la búsqueda
- **Estado vacío personalizado** cuando no hay resultados

### Ubicación
- **EmployeeListPage** (`/employees`)

### Componentes Modificados

**EmployeeListPage.jsx**
```jsx
- useState para almacenar searchTerm
- Input de búsqueda con ícono 🔍
- Botón de limpieza de búsqueda
- Integración con EmployeeTable
```

**EmployeeTable.jsx**
```jsx
- Recibe props: searchTerm, onFilteredDataChange
- Filtra empleados basado en searchTerm
- Notifica cambios a componente padre
- Muestra mensajes contextuales según filtros
```

### Estilos (EmployeeListPage.css)

```css
.controls-section     /* Contenedor de búsqueda y exportación */
.search-container     /* Input con ícono y botón limpiar */
.search-input         /* Campo de búsqueda con focus rosa */
.btn-clear-search     /* Botón ✕ para limpiar */
```

---

## 📄 Sistema de Exportación

### Características

#### Exportación PDF
- **Librería**: jsPDF + jsPDF-AutoTable
- **Título personalizado** con fecha de generación
- **Colores del tema Strawberry Dessert** (rojo/rosa)
- **Formato de tabla profesional** con encabezados y filas alternas

**Para Empleados:**
- Documento
- Nombre Completo
- Cargo
- Estado

**Para Contratos:**
- Tipo Contrato
- Fecha Inicio
- Fecha Fin
- Salario (formateado)

#### Exportación Excel
- **Librería**: xlsx (SheetJS)
- **Formato .xlsx** estándar
- **Columnas auto-dimensionadas**
- **Datos completos** (más columnas que el PDF)

**Para Empleados:**
- Documento, Nombre, Apellido, Cargo, Email, Teléfono, Dirección, Fecha Contratación, Estado

**Para Contratos:**
- Tipo Contrato, Fecha Inicio, Fecha Fin, Salario, Descripción

### Componente Principal: ExportControls

**ExportControls.jsx**
```jsx
Props:
  - data: Array de objetos a exportar
  - type: 'employees' | 'contracts'
  - title: Título del reporte

Funciones:
  - handleExportPDF(): Genera y descarga PDF
  - handleExportExcel(): Genera y descarga XLSX
```

**ExportControls.css**
```css
.btn-export-pdf     /* Botón rojo/rosa gradient */
.btn-export-excel   /* Botón verde gradient */
```

### Ubicaciones

1. **EmployeeListPage** (`/employees`)
   - Exporta lista completa o filtrada de empleados
   - Archivos generados:
     - `Reporte_Empleados_YYYY-MM-DD.pdf`
     - `Reporte_Empleados.xlsx`

2. **EmployeeDetailPage** (`/employees/:id`)
   - Exporta contratos del empleado específico
   - Archivos generados:
     - `Reporte_Contratos_YYYY-MM-DD.pdf`
     - `Reporte_Contratos.xlsx`

---

## 📦 Dependencias Instaladas

```bash
bun add jspdf jspdf-autotable xlsx
```

**Versiones:**
- `jspdf@3.0.3` - Generación de PDFs
- `jspdf-autotable@5.0.2` - Tablas automáticas en PDF
- `xlsx@0.18.5` - Manipulación de archivos Excel

---

## 🎨 Diseño UI/UX

### Tema Strawberry Dessert

**Botones de Exportación:**
- **PDF**: Gradiente rojo/rosa (`--primary-red` → `--primary-pink`)
- **Excel**: Gradiente verde (`--success-green`)
- **Íconos**: 📄 PDF, 📊 Excel

**Búsqueda:**
- **Ícono**: 🔍
- **Focus**: Borde rosa con sombra suave
- **Botón limpiar**: Hover con fondo crema

### Estados Interactivos
- **Hover**: Transform translateY(-2px) con sombra
- **Disabled**: Opacidad 0.5 cuando no hay datos
- **Responsive**: Columnas en mobile, fila en desktop

---

## 🔧 Uso Técnico

### Integración en EmployeeListPage

```jsx
import ExportControls from './ExportControls';
import { useState } from 'react';

const [searchTerm, setSearchTerm] = useState('');
const [filteredEmployees, setFilteredEmployees] = useState([]);

<ExportControls 
  data={filteredEmployees} 
  type="employees"
  title="Reporte de Empleados"
/>

<EmployeeTable 
  searchTerm={searchTerm}
  onFilteredDataChange={setFilteredEmployees}
/>
```

### Integración en EmployeeDetailPage

```jsx
import ExportControls from './ExportControls';

<ExportControls 
  data={contracts} 
  type="contracts"
  title={`Contratos de ${employee.NOMBRE} ${employee.APELLIDO}`}
/>
```

---

## ✅ Funcionalidades Completadas

- ✅ Input de búsqueda en tiempo real
- ✅ Filtrado por nombre, apellido y documento
- ✅ Contador dinámico de resultados
- ✅ Botón de limpieza de búsqueda
- ✅ Exportación PDF de empleados
- ✅ Exportación Excel de empleados
- ✅ Exportación PDF de contratos
- ✅ Exportación Excel de contratos
- ✅ Estados vacíos personalizados
- ✅ Botones deshabilitados sin datos
- ✅ Diseño responsive
- ✅ Integración con tema Strawberry Dessert

---

## 🎯 Casos de Uso

### Caso 1: Buscar y Exportar Empleados Activos
1. Ir a `/employees`
2. Escribir "activo" en búsqueda (si aplica por nombre)
3. Click en "Exportar a PDF" o "Exportar a Excel"
4. Archivo descargado con empleados filtrados

### Caso 2: Exportar Contratos de un Empleado
1. Ir a `/employees/:id`
2. Revisar lista de contratos
3. Click en "Exportar a PDF" o "Exportar a Excel"
4. Archivo descargado con contratos del empleado

### Caso 3: Búsqueda por Documento
1. Ir a `/employees`
2. Escribir número de documento en búsqueda
3. Ver resultado específico
4. Exportar si es necesario

---

## 📱 Responsive Design

### Desktop (> 768px)
- Controles en fila horizontal
- Búsqueda a la izquierda, exportación a la derecha
- Botones con padding generoso

### Mobile (≤ 768px)
- Controles en columna vertical
- Búsqueda ocupa 100% ancho
- Botones de exportación apilados
- Botones con ancho completo

---

## 🚀 Próximas Mejoras Sugeridas

1. **Filtros Avanzados**
   - Filtro por cargo
   - Filtro por estado (activo/inactivo)
   - Rango de fechas de contratación

2. **Exportación Mejorada**
   - Selección de columnas a exportar
   - Plantillas de reporte personalizadas
   - Exportación con gráficos

3. **Búsqueda Avanzada**
   - Búsqueda fuzzy (tolerancia a errores)
   - Búsqueda por múltiples campos simultáneos
   - Historial de búsquedas recientes

4. **Optimización**
   - Paginación de resultados
   - Lazy loading de empleados
   - Cache de búsquedas

---

## 📝 Notas Técnicas

### Performance
- El filtrado se ejecuta en cliente (in-memory)
- Para grandes volúmenes (>1000 registros), considerar backend filtering
- Los exports son síncronos, pueden bloquear UI con datos masivos

### Compatibilidad
- PDF funciona en todos navegadores modernos
- Excel requiere soporte de Blob API
- Downloads automáticos necesitan permisos del navegador

### Seguridad
- No hay validación de datos antes de exportar
- Considerar sanitización de campos en futuras versiones
- Los archivos se generan client-side (no se envían al servidor)

---

**Última actualización**: Octubre 2025  
**Sprint**: 3 - Búsqueda y Reportes  
**Autor**: Sistema SIRH Molino  
