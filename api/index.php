<?php
/* 
   API para el Sistema de Gestión Tecnológica (SGT)
   Gestión de Equipos Médicos, Responsables y Ubicaciones
*/

// Headers CORS para permitir peticiones desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ==============================================
   CONFIGURACIÓN DE LA BASE DE DATOS
   ============================================== */
$servidor = "localhost"; 
$usuario = "root"; 
$passwd = ""; 
$nombreBaseDatos = "sgt_ips";
$conexionBD = new mysqli($servidor, $usuario, $passwd, $nombreBaseDatos);

// Verificar conexión
if ($conexionBD->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexionBD->connect_error]));
}

// Configurar charset
$conexionBD->set_charset("utf8");

// Obtener el módulo de la URL (ubicaciones, responsables, equipos)
$modulo = isset($_GET['modulo']) ? $_GET['modulo'] : '';
$accion = isset($_GET['accion']) ? $_GET['accion'] : '';

/* ==============================================
   MÓDULO DE UBICACIONES
   ============================================== */
if ($modulo == 'ubicaciones') {
    
    // CONSULTAR UNA UBICACIÓN ESPECÍFICA
    if ($accion == 'consultar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        $sql = "SELECT * FROM ubicaciones WHERE id = '$id'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $ubicacion = mysqli_fetch_assoc($resultado);
            echo json_encode($ubicacion);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Ubicación no encontrada"]);
        }
        exit();
    }
    
    // LISTAR TODAS LAS UBICACIONES
    if ($accion == 'listar' || $accion == '') {
        $sql = "SELECT * FROM ubicaciones ORDER BY id DESC";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $ubicaciones = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
            echo json_encode($ubicaciones);
        } else {
            echo json_encode([]);
        }
        exit();
    }
    
    // INSERTAR NUEVA UBICACIÓN
    if ($accion == 'insertar') {
        $data = json_decode(file_get_contents("php://input"));
        
        $codigo = $conexionBD->real_escape_string($data->codigo_asignado);
        $nombre = $conexionBD->real_escape_string($data->nombre_ubicacion);
        $ubicacion = $conexionBD->real_escape_string($data->ubicacion);
        $telefono = $conexionBD->real_escape_string($data->telefono);
        
        $sql = "INSERT INTO ubicaciones (codigo_asignado, nombre_ubicacion, ubicacion, telefono) 
                VALUES ('$codigo', '$nombre', '$ubicacion', '$telefono')";
        
        if (mysqli_query($conexionBD, $sql)) {
            echo json_encode([
                "success" => 1, 
                "mensaje" => "Ubicación creada exitosamente",
                "id" => mysqli_insert_id($conexionBD)
            ]);
        } else {
            echo json_encode([
                "success" => 0, 
                "mensaje" => "Error al crear ubicación: " . mysqli_error($conexionBD)
            ]);
        }
        exit();
    }
    
    // ACTUALIZAR UBICACIÓN
    if ($accion == 'actualizar' && isset($_GET['id'])) {
        $data = json_decode(file_get_contents("php://input"));
        $id = $conexionBD->real_escape_string($_GET['id']);
        
        $codigo = $conexionBD->real_escape_string($data->codigo_asignado);
        $nombre = $conexionBD->real_escape_string($data->nombre_ubicacion);
        $ubicacion = $conexionBD->real_escape_string($data->ubicacion);
        $telefono = $conexionBD->real_escape_string($data->telefono);
        
        $sql = "UPDATE ubicaciones SET 
                codigo_asignado = '$codigo',
                nombre_ubicacion = '$nombre',
                ubicacion = '$ubicacion',
                telefono = '$telefono'
                WHERE id = '$id'";
        
        if (mysqli_query($conexionBD, $sql)) {
            echo json_encode(["success" => 1, "mensaje" => "Ubicación actualizada exitosamente"]);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Error al actualizar ubicación"]);
        }
        exit();
    }
    
    // ELIMINAR UBICACIÓN
    if ($accion == 'eliminar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        
        // Verificar si hay equipos asociados
        $checkSql = "SELECT COUNT(*) as total FROM equipos_medicos WHERE codigo_ubicacion = 
                     (SELECT codigo_asignado FROM ubicaciones WHERE id = '$id')";
        $checkResult = mysqli_query($conexionBD, $checkSql);
        $check = mysqli_fetch_assoc($checkResult);
        
        if ($check['total'] > 0) {
            echo json_encode([
                "success" => 0, 
                "mensaje" => "No se puede eliminar: hay equipos asociados a esta ubicación"
            ]);
        } else {
            $sql = "DELETE FROM ubicaciones WHERE id = '$id'";
            if (mysqli_query($conexionBD, $sql)) {
                echo json_encode(["success" => 1, "mensaje" => "Ubicación eliminada exitosamente"]);
            } else {
                echo json_encode(["success" => 0, "mensaje" => "Error al eliminar ubicación"]);
            }
        }
        exit();
    }
}

/* ==============================================
   MÓDULO DE RESPONSABLES
   ============================================== */
if ($modulo == 'responsables') {
    
    // CONSULTAR UN RESPONSABLE ESPECÍFICO
    if ($accion == 'consultar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        $sql = "SELECT * FROM responsables WHERE id = '$id'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $responsable = mysqli_fetch_assoc($resultado);
            echo json_encode($responsable);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Responsable no encontrado"]);
        }
        exit();
    }
    
    // CONSULTAR POR DOCUMENTO
    if ($accion == 'consultarDoc' && isset($_GET['documento'])) {
        $documento = $conexionBD->real_escape_string($_GET['documento']);
        $sql = "SELECT * FROM responsables WHERE documento_identidad = '$documento'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $responsable = mysqli_fetch_assoc($resultado);
            echo json_encode($responsable);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Responsable no encontrado"]);
        }
        exit();
    }
    
    // LISTAR TODOS LOS RESPONSABLES
    if ($accion == 'listar' || $accion == '') {
        $sql = "SELECT * FROM responsables ORDER BY id DESC";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $responsables = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
            echo json_encode($responsables);
        } else {
            echo json_encode([]);
        }
        exit();
    }
    
    // INSERTAR NUEVO RESPONSABLE
    if ($accion == 'insertar') {
        $data = json_decode(file_get_contents("php://input"));
        
        $codigo = $conexionBD->real_escape_string($data->codigo_asignado);
        $documento = $conexionBD->real_escape_string($data->documento_identidad);
        $nombres = $conexionBD->real_escape_string($data->nombres_apellidos);
        $cargo = $conexionBD->real_escape_string($data->cargo);
        $telefono = $conexionBD->real_escape_string($data->telefono);
        
        // Verificar si el documento ya existe
        $checkSql = "SELECT id FROM responsables WHERE documento_identidad = '$documento'";
        $checkResult = mysqli_query($conexionBD, $checkSql);
        
        if (mysqli_num_rows($checkResult) > 0) {
            echo json_encode([
                "success" => 0, 
                "mensaje" => "Ya existe un responsable con ese documento"
            ]);
        } else {
            $sql = "INSERT INTO responsables (codigo_asignado, documento_identidad, nombres_apellidos, cargo, telefono) 
                    VALUES ('$codigo', '$documento', '$nombres', '$cargo', '$telefono')";
            
            if (mysqli_query($conexionBD, $sql)) {
                echo json_encode([
                    "success" => 1, 
                    "mensaje" => "Responsable creado exitosamente",
                    "id" => mysqli_insert_id($conexionBD)
                ]);
            } else {
                echo json_encode([
                    "success" => 0, 
                    "mensaje" => "Error al crear responsable: " . mysqli_error($conexionBD)
                ]);
            }
        }
        exit();
    }
    
    // ACTUALIZAR RESPONSABLE
    if ($accion == 'actualizar' && isset($_GET['id'])) {
        $data = json_decode(file_get_contents("php://input"));
        $id = $conexionBD->real_escape_string($_GET['id']);
        
        $codigo = $conexionBD->real_escape_string($data->codigo_asignado);
        $documento = $conexionBD->real_escape_string($data->documento_identidad);
        $nombres = $conexionBD->real_escape_string($data->nombres_apellidos);
        $cargo = $conexionBD->real_escape_string($data->cargo);
        $telefono = $conexionBD->real_escape_string($data->telefono);
        
        $sql = "UPDATE responsables SET 
                codigo_asignado = '$codigo',
                documento_identidad = '$documento',
                nombres_apellidos = '$nombres',
                cargo = '$cargo',
                telefono = '$telefono'
                WHERE id = '$id'";
        
        if (mysqli_query($conexionBD, $sql)) {
            echo json_encode(["success" => 1, "mensaje" => "Responsable actualizado exitosamente"]);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Error al actualizar responsable"]);
        }
        exit();
    }
    
    // ELIMINAR RESPONSABLE
    if ($accion == 'eliminar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        
        // Verificar si hay equipos asociados
        $checkSql = "SELECT COUNT(*) as total FROM equipos_medicos WHERE codigo_responsable = 
                     (SELECT codigo_asignado FROM responsables WHERE id = '$id')";
        $checkResult = mysqli_query($conexionBD, $checkSql);
        $check = mysqli_fetch_assoc($checkResult);
        
        if ($check['total'] > 0) {
            echo json_encode([
                "success" => 0, 
                "mensaje" => "No se puede eliminar: hay equipos asociados a este responsable"
            ]);
        } else {
            $sql = "DELETE FROM responsables WHERE id = '$id'";
            if (mysqli_query($conexionBD, $sql)) {
                echo json_encode(["success" => 1, "mensaje" => "Responsable eliminado exitosamente"]);
            } else {
                echo json_encode(["success" => 0, "mensaje" => "Error al eliminar responsable"]);
            }
        }
        exit();
    }
}

/* ==============================================
   MÓDULO DE EQUIPOS MÉDICOS
   ============================================== */
if ($modulo == 'equipos') {
    
    // CONSULTAR UN EQUIPO ESPECÍFICO
    if ($accion == 'consultar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        $sql = "SELECT e.*, u.nombre_ubicacion, r.nombres_apellidos 
                FROM equipos_medicos e
                LEFT JOIN ubicaciones u ON e.codigo_ubicacion = u.codigo_asignado
                LEFT JOIN responsables r ON e.codigo_responsable = r.codigo_asignado
                WHERE e.id = '$id'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $equipo = mysqli_fetch_assoc($resultado);
            echo json_encode($equipo);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Equipo no encontrado"]);
        }
        exit();
    }
    
    // LISTAR TODOS LOS EQUIPOS CON INFORMACIÓN RELACIONADA
    if ($accion == 'listar' || $accion == '') {
        $sql = "SELECT e.*, u.nombre_ubicacion, r.nombres_apellidos 
                FROM equipos_medicos e
                LEFT JOIN ubicaciones u ON e.codigo_ubicacion = u.codigo_asignado
                LEFT JOIN responsables r ON e.codigo_responsable = r.codigo_asignado
                ORDER BY e.id DESC";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $equipos = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
            echo json_encode($equipos);
        } else {
            echo json_encode([]);
        }
        exit();
    }
    
    // INSERTAR NUEVO EQUIPO
    if ($accion == 'insertar') {
        $data = json_decode(file_get_contents("php://input"));
        
        $numero_activo = $conexionBD->real_escape_string($data->numero_activo);
        $marca = $conexionBD->real_escape_string($data->marca);
        $modelo = $conexionBD->real_escape_string($data->modelo);
        $codigo_ubicacion = $conexionBD->real_escape_string($data->codigo_ubicacion);
        $codigo_responsable = $conexionBD->real_escape_string($data->codigo_responsable);
        
        // Verificar si el número de activo ya existe
        $checkSql = "SELECT id FROM equipos_medicos WHERE numero_activo = '$numero_activo'";
        $checkResult = mysqli_query($conexionBD, $checkSql);
        
        if (mysqli_num_rows($checkResult) > 0) {
            echo json_encode([
                "success" => 0, 
                "mensaje" => "Ya existe un equipo con ese número de activo"
            ]);
        } else {
            $sql = "INSERT INTO equipos_medicos (numero_activo, marca, modelo, codigo_ubicacion, codigo_responsable) 
                    VALUES ('$numero_activo', '$marca', '$modelo', '$codigo_ubicacion', '$codigo_responsable')";
            
            if (mysqli_query($conexionBD, $sql)) {
                echo json_encode([
                    "success" => 1, 
                    "mensaje" => "Equipo médico creado exitosamente",
                    "id" => mysqli_insert_id($conexionBD)
                ]);
            } else {
                echo json_encode([
                    "success" => 0, 
                    "mensaje" => "Error al crear equipo médico: " . mysqli_error($conexionBD)
                ]);
            }
        }
        exit();
    }
    
    // ACTUALIZAR EQUIPO
    if ($accion == 'actualizar' && isset($_GET['id'])) {
        $data = json_decode(file_get_contents("php://input"));
        $id = $conexionBD->real_escape_string($_GET['id']);
        
        $numero_activo = $conexionBD->real_escape_string($data->numero_activo);
        $marca = $conexionBD->real_escape_string($data->marca);
        $modelo = $conexionBD->real_escape_string($data->modelo);
        $codigo_ubicacion = $conexionBD->real_escape_string($data->codigo_ubicacion);
        $codigo_responsable = $conexionBD->real_escape_string($data->codigo_responsable);
        
        $sql = "UPDATE equipos_medicos SET 
                numero_activo = '$numero_activo',
                marca = '$marca',
                modelo = '$modelo',
                codigo_ubicacion = '$codigo_ubicacion',
                codigo_responsable = '$codigo_responsable'
                WHERE id = '$id'";
        
        if (mysqli_query($conexionBD, $sql)) {
            echo json_encode(["success" => 1, "mensaje" => "Equipo médico actualizado exitosamente"]);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Error al actualizar equipo médico"]);
        }
        exit();
    }
    
    // ELIMINAR EQUIPO
    if ($accion == 'eliminar' && isset($_GET['id'])) {
        $id = $conexionBD->real_escape_string($_GET['id']);
        $sql = "DELETE FROM equipos_medicos WHERE id = '$id'";
        
        if (mysqli_query($conexionBD, $sql)) {
            echo json_encode(["success" => 1, "mensaje" => "Equipo médico eliminado exitosamente"]);
        } else {
            echo json_encode(["success" => 0, "mensaje" => "Error al eliminar equipo médico"]);
        }
        exit();
    }
    
    // BUSCAR EQUIPOS POR UBICACIÓN
    if ($accion == 'porUbicacion' && isset($_GET['codigo'])) {
        $codigo = $conexionBD->real_escape_string($_GET['codigo']);
        $sql = "SELECT e.*, u.nombre_ubicacion, r.nombres_apellidos 
                FROM equipos_medicos e
                LEFT JOIN ubicaciones u ON e.codigo_ubicacion = u.codigo_asignado
                LEFT JOIN responsables r ON e.codigo_responsable = r.codigo_asignado
                WHERE e.codigo_ubicacion = '$codigo'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $equipos = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
            echo json_encode($equipos);
        } else {
            echo json_encode([]);
        }
        exit();
    }
    
    // BUSCAR EQUIPOS POR RESPONSABLE
    if ($accion == 'porResponsable' && isset($_GET['codigo'])) {
        $codigo = $conexionBD->real_escape_string($_GET['codigo']);
        $sql = "SELECT e.*, u.nombre_ubicacion, r.nombres_apellidos 
                FROM equipos_medicos e
                LEFT JOIN ubicaciones u ON e.codigo_ubicacion = u.codigo_asignado
                LEFT JOIN responsables r ON e.codigo_responsable = r.codigo_asignado
                WHERE e.codigo_responsable = '$codigo'";
        $resultado = mysqli_query($conexionBD, $sql);
        
        if (mysqli_num_rows($resultado) > 0) {
            $equipos = mysqli_fetch_all($resultado, MYSQLI_ASSOC);
            echo json_encode($equipos);
        } else {
            echo json_encode([]);
        }
        exit();
    }
}

/* ==============================================
   ENDPOINT DE INFORMACIÓN GENERAL
   ============================================== */
if ($modulo == 'info' || $modulo == '') {
    // Obtener estadísticas generales
    $stats = [];
    
    // Total de ubicaciones
    $result = mysqli_query($conexionBD, "SELECT COUNT(*) as total FROM ubicaciones");
    $stats['total_ubicaciones'] = mysqli_fetch_assoc($result)['total'];
    
    // Total de responsables
    $result = mysqli_query($conexionBD, "SELECT COUNT(*) as total FROM responsables");
    $stats['total_responsables'] = mysqli_fetch_assoc($result)['total'];
    
    // Total de equipos
    $result = mysqli_query($conexionBD, "SELECT COUNT(*) as total FROM equipos_medicos");
    $stats['total_equipos'] = mysqli_fetch_assoc($result)['total'];
    
    echo json_encode([
        "api" => "SGT - Sistema de Gestión Tecnológica",
        "version" => "1.0",
        "modulos" => ["ubicaciones", "responsables", "equipos"],
        "estadisticas" => $stats,
        "mensaje" => "API funcionando correctamente"
    ]);
}

// Cerrar conexión
$conexionBD->close();
?>