-- =====================================================
-- Base de datos para Sistema de Gestión Tecnológica (SGT)
-- =====================================================

CREATE DATABASE IF NOT EXISTS sgt_ips DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE sgt_ips;

-- =====================================================
-- Tabla: ubicaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS ubicaciones (
  id int(11) NOT NULL AUTO_INCREMENT,
  codigo_asignado varchar(20) NOT NULL UNIQUE,
  nombre_ubicacion varchar(100) NOT NULL,
  ubicacion varchar(200) NOT NULL,
  telefono varchar(30) DEFAULT NULL,
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_codigo (codigo_asignado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO ubicaciones (codigo_asignado, nombre_ubicacion, ubicacion, telefono) VALUES
('UB-001', 'Pediatría', 'Piso 3 ala norte', '604-1234567'),
('UB-002', 'Urgencias', 'Piso 1 entrada principal', '604-1234568'),
('UB-003', 'Cirugía', 'Piso 4 ala sur', '604-1234569'),
('UB-004', 'UCI Adultos', 'Piso 2 ala este', '604-1234570'),
('UB-005', 'Radiología', 'Sótano 1', '604-1234571'),
('UB-006', 'Laboratorio Clínico', 'Piso 1 ala oeste', '604-1234572'),
('UB-007', 'Ginecología', 'Piso 3 ala sur', '604-1234573'),
('UB-008', 'Cardiología', 'Piso 5 torre B', '604-1234574'),
('UB-009', 'Neurología', 'Piso 6 torre A', '604-1234575'),
('UB-010', 'Farmacia', 'Piso 1 zona central', '604-1234576');

-- =====================================================
-- Tabla: responsables
-- =====================================================
CREATE TABLE IF NOT EXISTS responsables (
  id int(11) NOT NULL AUTO_INCREMENT,
  codigo_asignado varchar(20) NOT NULL UNIQUE,
  documento_identidad varchar(20) NOT NULL UNIQUE,
  nombres_apellidos varchar(150) NOT NULL,
  cargo varchar(50) NOT NULL,
  telefono varchar(30) DEFAULT NULL,
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_codigo (codigo_asignado),
  INDEX idx_documento (documento_identidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO responsables (codigo_asignado, documento_identidad, nombres_apellidos, cargo, telefono) VALUES
('RES-456', '1234567890', 'Juan Carlos Pérez García', 'Especialista', '300-1234567'),
('RES-457', '0987654321', 'María Isabel López Rodríguez', 'Auxiliar', '301-7654321'),
('RES-458', '1122334455', 'Carlos Andrés Martínez Silva', 'Secretaria', '302-9876543'),
('RES-459', '2233445566', 'Ana Patricia Gómez Torres', 'Enfermera Jefe', '315-1112233'),
('RES-460', '3344556677', 'Luis Fernando Ramírez Díaz', 'Técnico Biomédico', '320-4445566'),
('RES-461', '4455667788', 'Sandra Milena Castro Ruiz', 'Coordinadora', '311-7778899'),
('RES-462', '5566778899', 'Jorge Eduardo Herrera Mejía', 'Especialista', '318-2223344'),
('RES-463', '6677889900', 'Diana Carolina Vargas Soto', 'Auxiliar', '312-5556677'),
('RES-464', '7788990011', 'Roberto José Mendoza Cruz', 'Técnico', '316-8889900'),
('RES-465', '8899001122', 'Laura Cristina Jiménez Paz', 'Administradora', '314-1234444');

-- =====================================================
-- Tabla: equipos_medicos
-- =====================================================
CREATE TABLE IF NOT EXISTS equipos_medicos (
  id int(11) NOT NULL AUTO_INCREMENT,
  numero_activo varchar(30) NOT NULL UNIQUE,
  marca varchar(100) NOT NULL,
  modelo varchar(100) NOT NULL,
  codigo_ubicacion varchar(20) NOT NULL,
  codigo_responsable varchar(20) NOT NULL,
  estado enum('Activo','Inactivo','Mantenimiento','Dado de baja') DEFAULT 'Activo',
  fecha_ingreso date DEFAULT (CURRENT_DATE),
  observaciones text,
  fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_activo (numero_activo),
  INDEX idx_ubicacion (codigo_ubicacion),
  INDEX idx_responsable (codigo_responsable),
  FOREIGN KEY (codigo_ubicacion) REFERENCES ubicaciones(codigo_asignado) ON UPDATE CASCADE,
  FOREIGN KEY (codigo_responsable) REFERENCES responsables(codigo_asignado) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO equipos_medicos (numero_activo, marca, modelo, codigo_ubicacion, codigo_responsable, estado, observaciones) VALUES
('ACT-2024001', 'Philips', 'IntelliVue MX450', 'UB-001', 'RES-456', 'Activo', 'Monitor de signos vitales para pediatría'),
('ACT-2024002', 'GE Healthcare', 'Voluson E10', 'UB-002', 'RES-457', 'Activo', 'Ecógrafo de urgencias'),
('ACT-2024003', 'Siemens', 'SOMATOM Force', 'UB-005', 'RES-460', 'Activo', 'Tomógrafo computarizado'),
('ACT-2024004', 'Dräger', 'Evita V300', 'UB-004', 'RES-459', 'Activo', 'Ventilador mecánico UCI'),
('ACT-2024005', 'Mindray', 'BeneHeart D6', 'UB-002', 'RES-457', 'Activo', 'Desfibrilador portátil'),
('ACT-2024006', 'Olympus', 'CV-190', 'UB-003', 'RES-458', 'Mantenimiento', 'Sistema de videoendoscopia'),
('ACT-2024007', 'Roche', 'Cobas 8000', 'UB-006', 'RES-463', 'Activo', 'Analizador bioquímico automatizado'),
('ACT-2024008', 'Medtronic', 'Puritan Bennett 980', 'UB-004', 'RES-459', 'Activo', 'Ventilador mecánico de alta gama'),
('ACT-2024009', 'Philips', 'Affiniti 70', 'UB-007', 'RES-461', 'Activo', 'Ecógrafo ginecológico'),
('ACT-2024010', 'GE Healthcare', 'MAC 2000', 'UB-008', 'RES-462', 'Activo', 'Electrocardiógrafo'),
('ACT-2024011', 'Stryker', 'System 7', 'UB-003', 'RES-458', 'Activo', 'Sierra para cirugía ortopédica'),
('ACT-2024012', 'Karl Storz', 'Image1 S', 'UB-003', 'RES-458', 'Activo', 'Torre de laparoscopia'),
('ACT-2024013', 'Fresenius', '5008 CorDiax', 'UB-009', 'RES-465', 'Activo', 'Máquina de hemodiálisis'),
('ACT-2024014', 'Abbott', 'Alinity ci', 'UB-006', 'RES-463', 'Activo', 'Sistema integrado de química clínica'),
('ACT-2024015', 'Nikon', 'Eclipse E200', 'UB-006', 'RES-463', 'Activo', 'Microscopio biológico'),
('ACT-2024016', 'Nihon Kohden', 'MEK-9100', 'UB-006', 'RES-463', 'Activo', 'Contador hematológico'),
('ACT-2024017', 'Maquet', 'Flow-i', 'UB-003', 'RES-460', 'Mantenimiento', 'Sistema de anestesia'),
('ACT-2024018', 'Shimadzu', 'MobileDaRt Evolution', 'UB-005', 'RES-460', 'Activo', 'Equipo de rayos X portátil'),
('ACT-2024019', 'Hospira', 'Plum 360', 'UB-001', 'RES-456', 'Activo', 'Bomba de infusión'),
('ACT-2024020', 'B. Braun', 'Perfusor Space', 'UB-004', 'RES-459', 'Activo', 'Bomba de jeringa');

-- =====================================================
-- Tabla: historial_mantenimientos
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_mantenimientos (
  id int(11) NOT NULL AUTO_INCREMENT,
  numero_activo_equipo varchar(30) NOT NULL,
  tipo_mantenimiento enum('Preventivo','Correctivo','Calibración') NOT NULL,
  fecha_mantenimiento date NOT NULL,
  descripcion text,
  tecnico_responsable varchar(150),
  costo decimal(10,2) DEFAULT 0.00,
  proximo_mantenimiento date,
  fecha_registro timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_equipo (numero_activo_equipo),
  FOREIGN KEY (numero_activo_equipo) REFERENCES equipos_medicos(numero_activo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO historial_mantenimientos (numero_activo_equipo, tipo_mantenimiento, fecha_mantenimiento, descripcion, tecnico_responsable, costo, proximo_mantenimiento) VALUES
('ACT-2024001', 'Preventivo', '2025-01-15', 'Revisión general y calibración de sensores', 'Luis Fernando Ramírez Díaz', 250000.00, '2025-07-15'),
('ACT-2024003', 'Correctivo', '2025-02-10', 'Cambio de tubo de rayos X', 'Luis Fernando Ramírez Díaz', 15000000.00, '2025-08-10'),
('ACT-2024006', 'Correctivo', '2025-03-05', 'Reparación de sistema óptico', 'Roberto José Mendoza Cruz', 3500000.00, '2025-09-05'),
('ACT-2024017', 'Preventivo', '2025-03-20', 'Mantenimiento preventivo anual', 'Roberto José Mendoza Cruz', 800000.00, '2026-03-20');

-- =====================================================
-- Vistas útiles para reportes
-- =====================================================

CREATE OR REPLACE VIEW vista_equipos_completo AS
SELECT 
    e.id,
    e.numero_activo,
    e.marca,
    e.modelo,
    e.estado,
    e.fecha_ingreso,
    u.codigo_asignado AS codigo_ubicacion,
    u.nombre_ubicacion,
    u.ubicacion AS ubicacion_fisica,
    r.codigo_asignado AS codigo_responsable,
    r.nombres_apellidos AS responsable_nombre,
    r.cargo AS responsable_cargo,
    r.telefono AS responsable_telefono,
    e.observaciones
FROM equipos_medicos e
LEFT JOIN ubicaciones u ON e.codigo_ubicacion = u.codigo_asignado
LEFT JOIN responsables r ON e.codigo_responsable = r.codigo_asignado
ORDER BY e.id DESC;

CREATE OR REPLACE VIEW vista_equipos_por_ubicacion AS
SELECT 
    u.codigo_asignado,
    u.nombre_ubicacion,
    u.ubicacion,
    COUNT(e.id) AS total_equipos,
    SUM(CASE WHEN e.estado = 'Activo' THEN 1 ELSE 0 END) AS equipos_activos,
    SUM(CASE WHEN e.estado = 'Mantenimiento' THEN 1 ELSE 0 END) AS equipos_mantenimiento,
    SUM(CASE WHEN e.estado = 'Inactivo' THEN 1 ELSE 0 END) AS equipos_inactivos
FROM ubicaciones u
LEFT JOIN equipos_medicos e ON u.codigo_asignado = e.codigo_ubicacion
GROUP BY u.id;

CREATE OR REPLACE VIEW vista_equipos_por_responsable AS
SELECT 
    r.codigo_asignado,
    r.nombres_apellidos,
    r.cargo,
    COUNT(e.id) AS total_equipos_asignados,
    GROUP_CONCAT(e.numero_activo SEPARATOR ', ') AS numeros_activo
FROM responsables r
LEFT JOIN equipos_medicos e ON r.codigo_asignado = e.codigo_responsable
GROUP BY r.id;

-- =====================================================
-- Procedimientos almacenados
-- =====================================================

DELIMITER $$

CREATE PROCEDURE sp_obtener_siguiente_codigo_ubicacion()
BEGIN
    DECLARE ultimo_numero INT;
    DECLARE nuevo_codigo VARCHAR(20);
    
    SELECT CAST(SUBSTRING(codigo_asignado, 4) AS UNSIGNED) INTO ultimo_numero
    FROM ubicaciones
    WHERE codigo_asignado LIKE 'UB-%'
    ORDER BY CAST(SUBSTRING(codigo_asignado, 4) AS UNSIGNED) DESC
    LIMIT 1;
    
    IF ultimo_numero IS NULL THEN
        SET ultimo_numero = 0;
    END IF;
    
    SET nuevo_codigo = CONCAT('UB-', LPAD(ultimo_numero + 1, 3, '0'));
    SELECT nuevo_codigo AS siguiente_codigo;
END$$

CREATE PROCEDURE sp_obtener_siguiente_codigo_responsable()
BEGIN
    DECLARE ultimo_numero INT;
    DECLARE nuevo_codigo VARCHAR(20);
    
    SELECT CAST(SUBSTRING(codigo_asignado, 5) AS UNSIGNED) INTO ultimo_numero
    FROM responsables
    WHERE codigo_asignado LIKE 'RES-%'
    ORDER BY CAST(SUBSTRING(codigo_asignado, 5) AS UNSIGNED) DESC
    LIMIT 1;
    
    IF ultimo_numero IS NULL THEN
        SET ultimo_numero = 455;
    END IF;
    
    SET nuevo_codigo = CONCAT('RES-', ultimo_numero + 1);
    SELECT nuevo_codigo AS siguiente_codigo;
END$$

CREATE PROCEDURE sp_generar_numero_activo()
BEGIN
    DECLARE ultimo_numero INT;
    DECLARE nuevo_numero VARCHAR(30);
    DECLARE anio_actual VARCHAR(4);
    
    SET anio_actual = YEAR(CURDATE());
    
    SELECT CAST(SUBSTRING(numero_activo, 9) AS UNSIGNED) INTO ultimo_numero
    FROM equipos_medicos
    WHERE numero_activo LIKE CONCAT('ACT-', anio_actual, '%')
    ORDER BY CAST(SUBSTRING(numero_activo, 9) AS UNSIGNED) DESC
    LIMIT 1;
    
    IF ultimo_numero IS NULL THEN
        SET ultimo_numero = 0;
    END IF;
    
    SET nuevo_numero = CONCAT('ACT-', anio_actual, LPAD(ultimo_numero + 1, 3, '0'));
    SELECT nuevo_numero AS numero_activo;
END$$

DELIMITER ;

-- =====================================================
-- Índices adicionales para optimización
-- =====================================================
CREATE INDEX idx_estado_equipo ON equipos_medicos(estado);
CREATE INDEX idx_fecha_ingreso ON equipos_medicos(fecha_ingreso);
CREATE INDEX idx_cargo ON responsables(cargo);

-- =====================================================
-- Información de la base de datos
-- =====================================================
SELECT 
    'Base de datos SGT creada exitosamente' AS mensaje,
    COUNT(DISTINCT TABLE_NAME) AS total_tablas,
    (SELECT COUNT(*) FROM sgt_ips.ubicaciones) AS total_ubicaciones,
    (SELECT COUNT(*) FROM sgt_ips.responsables) AS total_responsables,
    (SELECT COUNT(*) FROM sgt_ips.equipos_medicos) AS total_equipos
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'sgt_ips';