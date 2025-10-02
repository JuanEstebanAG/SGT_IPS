// ===== CONFIGURACIÓN API =====
const API_URL = 'http://localhost/sgt/api/index.php';

// ===== VARIABLES GLOBALES =====
let ubicaciones = [];
let responsables = [];
let equipos = [];
let editandoUbicacion = null;
let editandoResponsable = null;
let editandoEquipo = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    configurarNavegacion();
    configurarFormularios();
    configurarModales();
    cargarDatos();
});

// ===== NAVEGACIÓN ENTRE PESTAÑAS =====
function configurarNavegacion() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const panelName = this.getAttribute('data-panel');
            showPanel(panelName, this);
        });
    });
}

function showPanel(panelName, tabElement) {
    // Ocultar todos los paneles
    document.querySelectorAll('.tab-content').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Mostrar el panel seleccionado
    const targetPanel = document.getElementById(panelName);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // Actualizar tabs activos
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    tabElement.classList.add('active');

    // Actualizar dropdowns si es el panel de equipos
    if (panelName === 'equipos') {
        actualizarDropdowns();
    }
}

// ===== CONFIGURACIÓN DE FORMULARIOS =====
function configurarFormularios() {
    // Formulario de ubicaciones
    document.getElementById('formUbicaciones').addEventListener('submit', async function(e) {
        e.preventDefault();
        await guardarUbicacion();
    });

    // Formulario de responsables
    document.getElementById('formResponsables').addEventListener('submit', async function(e) {
        e.preventDefault();
        await guardarResponsable();
    });

    // Formulario de equipos
    document.getElementById('formEquipos').addEventListener('submit', async function(e) {
        e.preventDefault();
        await guardarEquipo();
    });
}

// ===== CONFIGURACIÓN DE MODALES =====
function configurarModales() {
    // Cerrar modal al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const tipo = this.id.replace('modal', '').toLowerCase();
                cerrarModal(tipo);
            }
        });
    });
}

// ===== CARGAR DATOS INICIALES =====
async function cargarDatos() {
    try {
        await Promise.all([
            cargarUbicaciones(),
            cargarResponsables(),
            cargarEquipos()
        ]);
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// ===== CRUD UBICACIONES =====
async function cargarUbicaciones() {
    try {
        const response = await fetch(`${API_URL}?modulo=ubicaciones&accion=listar`);
        const data = await response.json();
        ubicaciones = Array.isArray(data) ? data : [];
        mostrarUbicaciones();
    } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        ubicaciones = [];
        mostrarUbicaciones();
    }
}

function mostrarUbicaciones() {
    const tabla = document.getElementById('tablaUbicaciones');
    
    if (ubicaciones.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div>No hay ubicaciones registradas</div>
                    <small>Agrega la primera ubicación usando el botón superior</small>
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = ubicaciones.map(ubicacion => `
        <tr>
            <td>${ubicacion.codigo_asignado}</td>
            <td>${ubicacion.nombre_ubicacion}</td>
            <td>${ubicacion.ubicacion}</td>
            <td>${ubicacion.telefono || '-'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editarUbicacion(${ubicacion.id})">✏️ Editar</button>
                    <button class="btn btn-delete" onclick="eliminarUbicacion(${ubicacion.id})">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function guardarUbicacion() {
    const ubicacion = {
        codigo_asignado: document.getElementById('ubicacion_codigo').value,
        nombre_ubicacion: document.getElementById('ubicacion_nombre').value,
        ubicacion: document.getElementById('ubicacion_fisica').value,
        telefono: document.getElementById('ubicacion_telefono').value
    };

    try {
        const url = editandoUbicacion 
            ? `${API_URL}?modulo=ubicaciones&accion=actualizar&id=${editandoUbicacion.id}`
            : `${API_URL}?modulo=ubicaciones&accion=insertar`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ubicacion)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('✅ Ubicación guardada exitosamente');
            cerrarModal('ubicacion');
            await cargarUbicaciones();
            actualizarDropdowns();
        } else {
            alert('❌ Error: ' + (result.mensaje || 'Error al guardar'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al conectar con el servidor');
    }
}

function editarUbicacion(id) {
    const ubicacion = ubicaciones.find(u => u.id == id);
    if (ubicacion) {
        document.getElementById('ubicacion_codigo').value = ubicacion.codigo_asignado;
        document.getElementById('ubicacion_nombre').value = ubicacion.nombre_ubicacion;
        document.getElementById('ubicacion_fisica').value = ubicacion.ubicacion;
        document.getElementById('ubicacion_telefono').value = ubicacion.telefono || '';
        editandoUbicacion = ubicacion;
        abrirModal('ubicacion');
    }
}

async function eliminarUbicacion(id) {
    if (confirm('¿Estás seguro de eliminar esta ubicación?')) {
        try {
            const response = await fetch(`${API_URL}?modulo=ubicaciones&accion=eliminar&id=${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                alert('✅ Ubicación eliminada exitosamente');
                await cargarUbicaciones();
                actualizarDropdowns();
            } else {
                alert('❌ ' + (result.mensaje || 'Error al eliminar'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al eliminar');
        }
    }
}

// ===== CRUD RESPONSABLES =====
async function cargarResponsables() {
    try {
        const response = await fetch(`${API_URL}?modulo=responsables&accion=listar`);
        const data = await response.json();
        responsables = Array.isArray(data) ? data : [];
        mostrarResponsables();
    } catch (error) {
        console.error('Error al cargar responsables:', error);
        responsables = [];
        mostrarResponsables();
    }
}

function mostrarResponsables() {
    const tabla = document.getElementById('tablaResponsables');
    
    if (responsables.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div>No hay responsables registrados</div>
                    <small>Agrega el primer responsable usando el botón superior</small>
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = responsables.map(responsable => `
        <tr>
            <td>${responsable.codigo_asignado}</td>
            <td>${responsable.documento_identidad}</td>
            <td>${responsable.nombres_apellidos}</td>
            <td><span class="status-badge status-active">${responsable.cargo}</span></td>
            <td>${responsable.telefono || '-'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editarResponsable(${responsable.id})">✏️ Editar</button>
                    <button class="btn btn-delete" onclick="eliminarResponsable(${responsable.id})">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function guardarResponsable() {
    const responsable = {
        codigo_asignado: document.getElementById('responsable_codigo').value,
        documento_identidad: document.getElementById('responsable_documento').value,
        nombres_apellidos: document.getElementById('responsable_nombre').value,
        cargo: document.getElementById('responsable_cargo').value,
        telefono: document.getElementById('responsable_telefono').value
    };

    try {
        const url = editandoResponsable 
            ? `${API_URL}?modulo=responsables&accion=actualizar&id=${editandoResponsable.id}`
            : `${API_URL}?modulo=responsables&accion=insertar`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responsable)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('✅ Responsable guardado exitosamente');
            cerrarModal('responsable');
            await cargarResponsables();
            actualizarDropdowns();
        } else {
            alert('❌ Error: ' + (result.mensaje || 'Error al guardar'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al conectar con el servidor');
    }
}

function editarResponsable(id) {
    const responsable = responsables.find(r => r.id == id);
    if (responsable) {
        document.getElementById('responsable_codigo').value = responsable.codigo_asignado;
        document.getElementById('responsable_documento').value = responsable.documento_identidad;
        document.getElementById('responsable_nombre').value = responsable.nombres_apellidos;
        document.getElementById('responsable_cargo').value = responsable.cargo;
        document.getElementById('responsable_telefono').value = responsable.telefono || '';
        editandoResponsable = responsable;
        abrirModal('responsable');
    }
}

async function eliminarResponsable(id) {
    if (confirm('¿Estás seguro de eliminar este responsable?')) {
        try {
            const response = await fetch(`${API_URL}?modulo=responsables&accion=eliminar&id=${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                alert('✅ Responsable eliminado exitosamente');
                await cargarResponsables();
                actualizarDropdowns();
            } else {
                alert('❌ ' + (result.mensaje || 'Error al eliminar'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al eliminar');
        }
    }
}

// ===== CRUD EQUIPOS =====

// ===== FUNCIONES DE MODALES =====
