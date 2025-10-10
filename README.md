# SGT - Sistema de Gestión Tecnológica

Sistema de gestión para equipos médicos, responsables y ubicaciones de una IPS (Institución Prestadora de Servicios de Salud).

## 📋 Descripción

El SGT es una aplicación web desarrollada para gestionar la información de equipos médicos, personal responsable y ubicaciones dentro de un centro de salud. El sistema permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre tres módulos principales.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework progresivo de JavaScript
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP para peticiones a la API
- **Vue Router** - Enrutamiento de la aplicación

### Backend
- **PHP 7.4+** - Lenguaje del servidor
- **MySQL** - Sistema de gestión de base de datos
- **XAMPP** - Servidor local (Apache + MySQL)

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [XAMPP](https://www.apachefriends.org/) (incluye Apache y MySQL)
- Git (opcional, para clonar el repositorio)

## 📁 Estructura del Proyecto
```
sgt/
├── api/
│   └── index.php              # API REST en PHP
├── src/
│   ├── components/
│   │   ├── UbicacionesCrud.vue
│   │   ├── ResponsablesCrud.vue
│   │   ├── EquiposCrud.vue
│   │   └── HeaderComponent.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── UbicacionesView.vue
│   │   ├── ResponsablesView.vue
│   │   └── EquiposView.vue
│   ├── services/
│   │   └── apiService.js      # Configuración de Axios
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── public/
├── sgt_ips.sql                # Script de base de datos
├── vite.config.js
├── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sgt.git
cd sgt
2. Configurar el Backend (PHP + MySQL)
2.1 Iniciar XAMPP

Abre XAMPP Control Panel
Inicia Apache (puerto 80)
Inicia MySQL (puerto 3306)

2.2 Crear la base de datos

Abre http://localhost/phpmyadmin
Crea una nueva base de datos llamada sgt_ips
Importa el archivo sgt_ips.sql desde la pestaña "Importar"

2.3 Copiar la API
Copia la carpeta api/ a la ruta de XAMPP:
bash# Windows
cp -r api/ C:/xampp/htdocs/sgt/

# Linux/Mac
cp -r api/ /opt/lampp/htdocs/sgt/
2.4 Verificar la API
Abre en el navegador: http://localhost/sgt/api/index.php
Deberías ver una respuesta JSON similar a:
json{
  "api": "SGT - Sistema de Gestión Tecnológica",
  "version": "1.0",
  "mensaje": "API funcionando correctamente"
}
3. Configurar el Frontend (Vue.js)
3.1 Instalar dependencias
bashnpm install
3.2 Configurar la conexión a la API
El archivo vite.config.js ya está configurado con el proxy correcto:
javascriptproxy: {
  '/api': {
    target: 'http://localhost:80',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/sgt/api')
  }
}
3.3 Iniciar el servidor de desarrollo
bashnpm run dev
La aplicación estará disponible en: http://localhost:5173

## 📖 Uso
Módulos Disponibles
1. Ubicaciones
Gestiona las ubicaciones físicas dentro del centro de salud.
Campos:

Código asignado (ej: UB-001)
Nombre de ubicación (ej: Pediatría)
Ubicación física (ej: Piso 3 ala norte)
Teléfono

Operaciones:

Listar todas las ubicaciones
Crear nueva ubicación
Editar ubicación existente
Eliminar ubicación

2. Responsables
Gestiona el personal responsable de los equipos médicos.
Campos:

Código asignado (ej: RES-456)
Documento de identidad
Nombres y apellidos
Cargo (ej: Especialista, Auxiliar, Secretaria)
Teléfono

Operaciones:

Listar todos los responsables
Crear nuevo responsable
Editar responsable existente
Eliminar responsable

3. Equipos Médicos
Gestiona los equipos médicos de la institución.
Campos:

Número de activo
Marca
Modelo
Ubicación (selección desde ubicaciones existentes)
Responsable (selección desde responsables existentes)

Operaciones:

Listar todos los equipos
Crear nuevo equipo
Editar equipo existente
Eliminar equipo
Filtrar por ubicación
Filtrar por responsable

🔧 API Endpoints
Ubicaciones
GET    /sgt/api/index.php?modulo=ubicaciones&accion=listar
GET    /sgt/api/index.php?modulo=ubicaciones&accion=consultar&id={id}
POST   /sgt/api/index.php?modulo=ubicaciones&accion=insertar
POST   /sgt/api/index.php?modulo=ubicaciones&accion=actualizar&id={id}
GET    /sgt/api/index.php?modulo=ubicaciones&accion=eliminar&id={id}
Responsables
GET    /sgt/api/index.php?modulo=responsables&accion=listar
GET    /sgt/api/index.php?modulo=responsables&accion=consultar&id={id}
POST   /sgt/api/index.php?modulo=responsables&accion=insertar
POST   /sgt/api/index.php?modulo=responsables&accion=actualizar&id={id}
GET    /sgt/api/index.php?modulo=responsables&accion=eliminar&id={id}
Equipos Médicos
GET    /sgt/api/index.php?modulo=equipos&accion=listar
GET    /sgt/api/index.php?modulo=equipos&accion=consultar&id={id}
POST   /sgt/api/index.php?modulo=equipos&accion=insertar
POST   /sgt/api/index.php?modulo=equipos&accion=actualizar&id={id}
GET    /sgt/api/index.php?modulo=equipos&accion=eliminar&id={id}
🐛 Solución de Problemas
El frontend no se conecta al backend

Verifica que Apache y MySQL estén corriendo en XAMPP (fondo verde)
Confirma que la API esté en C:/xampp/htdocs/sgt/api/
Verifica que apiService.js use const API_URL = '/api/index.php'
Limpia la caché del navegador (Ctrl + Shift + R)

Error "Cannot find module"
bashrm -rf node_modules package-lock.json
npm install
Error de conexión a MySQL

Verifica que MySQL esté corriendo en XAMPP
Confirma que la base de datos sgt_ips exista
Revisa las credenciales en api/index.php (líneas 24-27)

El modal no se abre

Elimina el archivo index.html antiguo si existe
Crea un nuevo index.html minimalista:

html<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGT - Sistema de Gestión Tecnológica</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
📝 Scripts Disponibles
bash# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
🎓 Proyecto Académico
Este proyecto fue desarrollado como parte de la asignatura Ingeniería de Software del programa de Bioingeniería de la Universidad de Antioquia, semestre 2025-II.
Práctica #1: Sistema de Gestión Tecnológica (SGT)
👥 Autores

Juan Esteba Artunduaga - esteban.artunduaga@udea.edu.co
Juliana Gonzalez - juliana.gonzalez1@udea.edu.co
Juan José Cortés - jjose.cortes@udea.edu.co

📄 Licencia
Este proyecto es de uso académico.

Universidad de Antioquia - Bioingeniería - 2025-II
