# 🏥 Sistema de Gestión Tecnológica (SGT) - IPS

## 📋 Descripción
Sistema web para la gestión de equipos médicos, responsables y ubicaciones en una IPS (Institución Prestadora de Servicios de Salud).

## 🚀 Características Principales

### Módulos Implementados
1. **Gestión de Ubicaciones** - CRUD completo para áreas del centro de salud
2. **Gestión de Responsables** - CRUD para personal responsable de equipos
3. **Gestión de Equipos Médicos** - CRUD con relaciones a ubicaciones y responsables

## 📁 Estructura del Proyecto

```
sgt/
├── index.php           # API REST principal
├── index.html          # Frontend (mockup interactivo)
├── sgt_ips.sql        # Script de base de datos
├── config.php         # Configuración (crear este archivo)
└── README.md          # Documentación
```

## 🛠️ Instalación

### Requisitos Previos
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- phpMyAdmin (opcional)

### Paso 1: Configurar Base de Datos

1. Abrir phpMyAdmin o cliente MySQL
2. Ejecutar el script `sgt_ips.sql`:
```sql
mysql -u root -p < sgt_ips.sql
```

### Paso 2: Configurar API

Crear archivo `config.php`:
```php
<?php
// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'sgt_ips');

// Configuración de la aplicación
define('API_URL', 'http://localhost/sgt/index.php');
define('APP_NAME', 'SGT - Sistema de Gestión Tecnológica');
?>
```

### Paso 3: Configurar Frontend

Actualizar la URL de la API en el archivo HTML si es necesario.

## 📡 Endpoints de la API

### Base URL
```
http://localhost/sgt/index.php
```

### Ubicaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `?modulo=ubicaciones&accion=listar` | Listar todas las ubicaciones |
| GET | `?modulo=ubicaciones&accion=consultar&id={id}` | Consultar ubicación específica |
| POST | `?modulo=ubicaciones&accion=insertar` | Crear nueva ubicación |
| PUT | `?modulo=ubicaciones&accion=actualizar&id={id}` | Actualizar ubicación |
| DELETE | `?modulo=ubicaciones&accion=eliminar&id={id}` | Eliminar ubicación |

### Responsables

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `?modulo=responsables&accion=listar` | Listar todos los responsables |
| GET | `?modulo=responsables&accion=consultar&id={id}` | Consultar responsable |
| GET | `?modulo=responsables&accion=consultarDoc&documento={doc}` | Buscar por documento |
| POST | `?modulo=responsables&accion=insertar` | Crear nuevo responsable |
| PUT | `?modulo=responsables&accion=actualizar&id={id}` | Actualizar responsable |
| DELETE | `?modulo=responsables&accion=eliminar&id={id}` | Eliminar responsable |

### Equipos Médicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `?modulo=equipos&accion=listar` | Listar todos los equipos |
| GET | `?modulo=equipos&accion=consultar&id={id}` | Consultar equipo |
| GET | `?modulo=equipos&accion=porUbicacion&codigo={codigo}` | Equipos por ubicación |
| GET | `?modulo=equipos&accion=porResponsable&codigo={codigo}` | Equipos por responsable |
| POST | `?modulo=equipos&accion=insertar` | Crear nuevo equipo |
| PUT | `?modulo=equipos&accion=actualizar&id={id}` | Actualizar equipo |
| DELETE | `?modulo=equipos&accion=eliminar&id={id}` | Eliminar equipo |

## 📝 Ejemplos de Uso

### Crear Nueva Ubicación
```javascript
fetch('http://localhost/sgt/index.php?modulo=ubicaciones&accion=insertar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        codigo_asignado: 'UB-011',
        nombre_ubicacion: 'Oncología',
        ubicacion: 'Piso 7 torre C',
        telefono: '604-1234577'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Listar Equipos con Información Completa
```javascript
fetch('http://localhost/sgt/index.php?modulo=equipos&accion=listar')
    .then(response => response.json())
    .then(equipos => {
        equipos.forEach(equipo => {
            console.log(`${equipo.numero_activo}: ${equipo.marca} ${equipo.modelo}`);
            console.log(`Ubicación: ${equipo.nombre_ubicacion}`);
            console.log(`Responsable: ${equipo.nombres_apellidos}`);
        });
    });
```

### Buscar Responsable por Documento
```javascript
fetch('http://localhost/sgt/index.php?modulo=responsables&accion=consultarDoc&documento=1234567890')
    .then(response => response.json())
    .then(data => console.log(data));
```

## 🗄️ Estructura de Base de Datos

### Tabla: ubicaciones
- `id` (INT, PK, AUTO_INCREMENT)
- `codigo_asignado` (VARCHAR 20, UNIQUE)
- `nombre_ubicacion` (VARCHAR 100)
- `ubicacion` (VARCHAR 200)
- `telefono` (VARCHAR 30)

### Tabla: responsables
- `id` (INT, PK, AUTO_INCREMENT)
- `codigo_asignado` (VARCHAR 20, UNIQUE)
- `documento_identidad` (VARCHAR 20, UNIQUE)
- `nombres_apellidos` (VARCHAR 150)
- `cargo` (VARCHAR 50)
- `telefono` (VARCHAR 30)

### Tabla: equipos_medicos
- `id` (INT, PK, AUTO_INCREMENT)
- `numero_activo` (VARCHAR 30, UNIQUE)
- `marca` (VARCHAR 100)
- `modelo` (VARCHAR 100)
- `codigo_ubicacion` (VARCHAR 20, FK)
- `codigo_responsable` (VARCHAR 20, FK)
- `estado` (ENUM: Activo, Inactivo, Mantenimiento, Dado de baja)

## 🔒 Seguridad Implementada

1. **Escape de datos**: Uso de `real_escape_string()` para prevenir SQL injection
2. **Validaciones**: Verificación de duplicados en códigos únicos
3. **Integridad referencial**: Foreign keys para mantener consistencia
4. **Headers CORS**: Configurados para desarrollo local

## 🎨 Características del Frontend

- Diseño responsivo y moderno
- Animaciones suaves y transiciones
- Modales para formularios CRUD
- Validación del lado del cliente
- Tablas interactivas con hover effects
- Indicadores visuales de estado

## 📊 Vistas y Procedimientos Almacenados

### Vistas Disponibles
- `vista_equipos_completo`: Información completa de equipos con joins
- `vista_equipos_por_ubicacion`: Resumen de equipos por ubicación
- `vista_equipos_por_responsable`: Resumen de equipos por responsable

### Procedimientos Almacenados
- `sp_obtener_siguiente_codigo_ubicacion()`: Genera siguiente código UB-XXX
- `sp_obtener_siguiente_codigo_responsable()`: Genera siguiente código RES-XXX
- `sp_generar_numero_activo()`: Genera número de activo ACT-YYYYXXX

## 🚦 Testing

### Datos de Prueba Incluidos
- 10 ubicaciones predefinidas
- 10 responsables con diferentes cargos
- 20 equipos médicos de diversas marcas
- 4 registros de mantenimiento

### Pruebas Recomendadas
1. ✅ Crear, leer, actualizar y eliminar en cada módulo
2. ✅ Verificar que no se puedan eliminar ubicaciones/responsables con equipos asociados
3. ✅ Validar que no se dupliquen códigos únicos
4. ✅ Probar las listas desplegables en equipos médicos
5. ✅ Verificar la integridad referencial

## 🤝 Contribución y Git

### Estructura de Commits
```bash
git add .
git commit -m "feat: Agregar módulo de ubicaciones"
git commit -m "fix: Corregir validación de documentos"
git commit -m "docs: Actualizar README con ejemplos"
```

### Branches Sugeridas
- `main` - Rama principal estable
- `develop` - Desarrollo activo
- `feature/nombre-funcionalidad` - Nuevas características
- `bugfix/descripcion-error` - Corrección de errores

## 📈 Mejoras Futuras

- [ ] Autenticación y autorización de usuarios
- [ ] Módulo de reportes y estadísticas
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones de mantenimiento
- [ ] Dashboard con gráficos
- [ ] Historial de cambios (auditoría)
- [ ] Backup automático de base de datos
- [ ] PWA (Progressive Web App)

## 📞 Soporte

Para dudas o problemas con el sistema, contactar al equipo de desarrollo.

## 📄 Licencia

Sistema desarrollado para la IPS como parte del curso de Ingeniería de Software - Bioingeniería, Universidad de Antioquia.

---
**Versión:** 1.0.0  
**Fecha de entrega:** 5 de Octubre de 2025  
**Equipo de desarrollo:** [Agregar nombres del equipo]