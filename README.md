# Micromarket PWA

Micromarket PWA es un sistema completo de gestión para micromercados, desarrollado como una aplicación web progresiva (PWA) con Next.js, React y TailwindCSS. Permite la administración de ventas, productos, clientes, cajeros y reportes, integrando funcionalidades de agenda de pedidos, generación de tickets y reportes en PDF, y manejo de usuarios con almacenamiento local.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos y Páginas](#módulos-y-páginas)
- [Flujo de Datos y Almacenamiento](#flujo-de-datos-y-almacenamiento)
- [Dependencias](#dependencias)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción General

Micromarket PWA es una solución digital para la gestión de micromercados, orientada a la administración de productos, clientes, ventas, cajeros y reportes. El sistema está diseñado para funcionar tanto en escritorio como en dispositivos móviles, aprovechando las capacidades de las PWA (instalación, offline, etc.).

---

## Características Principales

- **Gestión de Pedidos y Ventas:** Registro, listado y entrega de pedidos, ventas directas y agendadas.
- **Gestión de Productos:** Alta, edición, eliminación y listado de productos, con control de stock.
- **Gestión de Clientes:** Registro, edición y búsqueda de clientes.
- **Gestión de Cajeros:** Alta, edición y eliminación de cajeros, con control de turnos y credenciales.
- **Reportes:** Generación de reportes de ventas, tickets en PDF, almacenamiento y descarga de reportes.
- **Autenticación:** Login de cajeros con persistencia en localStorage.
- **PWA:** Instalación en dispositivos, manifest.json, iconos y soporte offline.
- **UI Moderna:** Componentes reutilizables con TailwindCSS y shadcn/ui.
- **Almacenamiento Local:** Persistencia de datos en localStorage para funcionamiento offline.

---

## Estructura del Proyecto

```
micromarket-pwa/
│
├── app/                        # Páginas principales y rutas Next.js
│   ├── dashboard/              # Página principal de pedidos
│   ├── products/               # Tienda y gestión de productos
│   │   └── list/               # CRUD de productos
│   ├── clients/                # Gestión de clientes
│   │   └── edit/               # Edición de clientes
│   ├── reports/                # Reportes y tickets
│   │   └── saved/              # Reportes guardados
│   ├── cashiers/               # Gestión de cajeros
│   ├── login/                  # Autenticación de cajeros
│   ├── layout.tsx              # Layout global y configuración PWA
│   └── globals.css             # Estilos globales (Tailwind)
│
├── components/                 # Componentes reutilizables
│   ├── sidebar.tsx             # Menú lateral de navegación
│   └── ui/                     # Componentes de interfaz (shadcn/ui)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       ├── table.tsx
│       └── ...otros componentes UI
│
├── public/                     # Archivos estáticos
│   ├── icon-192x192.png        # Icono PWA
│   ├── icon-512x512.png        # Icono PWA
│   └── manifest.json           # Manifest PWA
│
├── styles/                     # (Opcional) Archivos de estilos adicionales
│
├── package.json                # Dependencias y scripts
├── tailwind.config.js          # Configuración TailwindCSS
├── postcss.config.js           # Configuración PostCSS
└── README.md                   # Este archivo
```

---

## Módulos y Páginas

- **/dashboard:** Lista y gestiona pedidos por entregar y entregados. Permite marcar pedidos como entregados y ver detalles.
- **/products:** Tienda para ventas directas y agendadas. Carrito de compras, control de stock y agendamiento de pedidos.
- **/products/list:** Listado y administración CRUD de productos.
- **/clients:** Listado, búsqueda y registro de clientes.
- **/clients/edit:** Edición de datos de clientes existentes.
- **/reports:** Visualización de ventas, selección de ventas para reportes, generación de tickets y reportes en PDF.
- **/reports/saved:** Listado de reportes guardados, previsualización, descarga y eliminación.
- **/cashiers:** Gestión de cajeros, turnos, credenciales y CRUD.
- **/login:** Autenticación de cajeros.

---

## Flujo de Datos y Almacenamiento

- **Persistencia:** Todos los datos (productos, clientes, cajeros, ventas, pedidos, reportes) se almacenan en `localStorage` del navegador.
- **Autenticación:** El cajero logueado se guarda en `localStorage` bajo la clave `cajero_logueado`.
- **Pedidos y Ventas:** Al vender/agendar, se actualizan los arrays `ventas` y `pedidos` en localStorage.
- **Reportes:** Los reportes generados se almacenan en `reportes_guardados` (localStorage) con metadatos y URL del PDF.
- **Sincronización:** Los componentes usan `useEffect` para cargar y guardar datos en localStorage en cada cambio.

---

## Dependencias

- **Next.js**: Framework principal para SSR y rutas.
- **React**: Librería de UI.
- **TailwindCSS**: Utilidades de estilos.
- **shadcn/ui**: Componentes de interfaz modernos.
- **lucide-react**: Iconos SVG.
- **jspdf**: Generación de PDFs para tickets y reportes.
- **@radix-ui/react-checkbox**: Checkbox accesibles.
- **class-variance-authority**: Utilidad para variantes de estilos.

---

## Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd micromarket-pwa
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

---

## Despliegue

- **Vercel:** El proyecto es compatible con despliegue en Vercel.
- **PWA:** Puede instalarse en dispositivos móviles y de escritorio.
- **Archivos importantes:** `public/manifest.json`, iconos en `public/`, y configuración de PWA en `app/layout.tsx`.

---

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature/fix: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit.
4. Haz push a tu fork y abre un Pull Request.

---

## Licencia

Este proyecto es de uso académico y demostrativo. Puedes adaptarlo y reutilizarlo bajo tu propio riesgo.

---
