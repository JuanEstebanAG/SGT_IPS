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

        // Verifica el código de estado HTTP
        if (!response.ok) {
            throw new Error('Error de red o servidor');
        }

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
async function cargarEquipos() {
    try {
        const response = await fetch(`${API_URL}?modulo=equipos&accion=listar`);
        const data = await response.json();
        equipos = Array.isArray(data) ? data : [];
        mostrarEquipos();
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        equipos = [];
        mostrarEquipos();
    }
}

function mostrarEquipos() {
    const tabla = document.getElementById('tablaEquipos');
    
    if (equipos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div>No hay equipos médicos registrados</div>
                    <small>Agrega el primer equipo usando el botón superior</small>
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = equipos.map(equipo => `
        <tr>
            <td>${equipo.numero_activo}</td>
            <td>${equipo.marca}</td>
            <td>${equipo.modelo}</td>
            <td>${equipo.nombre_ubicacion || equipo.codigo_ubicacion}</td>
            <td>${equipo.nombres_apellidos || equipo.codigo_responsable}</td>
            <td><span class="status-badge status-active">Activo</span></td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editarEquipo(${equipo.id})">✏️ Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEquipo(${equipo.id})">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function guardarEquipo() {
    const equipo = {
        numero_activo: document.getElementById('equipo_activo').value,
        marca: document.getElementById('equipo_marca').value,
        modelo: document.getElementById('equipo_modelo').value,
        codigo_ubicacion: document.getElementById('equipo_ubicacion').value,
        codigo_responsable: document.getElementById('equipo_responsable').value
    };

    try {
        const url = editandoEquipo 
            ? `${API_URL}?modulo=equipos&accion=actualizar&id=${editandoEquipo.id}`
            : `${API_URL}?modulo=equipos&accion=insertar`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(equipo)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('✅ Equipo médico guardado exitosamente');
            cerrarModal('equipo');
            await cargarEquipos();
        } else {
            alert('❌ Error: ' + (result.mensaje || 'Error al guardar'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al conectar con el servidor');
    }
}

function editarEquipo(id) {
    const equipo = equipos.find(e => e.id == id);
    if (equipo) {
        document.getElementById('equipo_activo').value = equipo.numero_activo;
        document.getElementById('equipo_marca').value = equipo.marca;
        document.getElementById('equipo_modelo').value = equipo.modelo;
        actualizarDropdowns();
        setTimeout(() => {
            document.getElementById('equipo_ubicacion').value = equipo.codigo_ubicacion;
            document.getElementById('equipo_responsable').value = equipo.codigo_responsable;
        }, 100);
        editandoEquipo = equipo;
        abrirModal('equipo');
    }
}

async function eliminarEquipo(id) {
    if (confirm('¿Estás seguro de eliminar este equipo médico?')) {
        try {
            const response = await fetch(`${API_URL}?modulo=equipos&accion=eliminar&id=${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                alert('✅ Equipo médico eliminado exitosamente');
                await cargarEquipos();
            } else {
                alert('❌ ' + (result.mensaje || 'Error al eliminar'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al eliminar');
        }
    }
}

// ===== FUNCIONES DE MODALES =====
function abrirModal(tipo) {
    const modalId = 'modal' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    document.getElementById(modalId).classList.add('active');
    
    if (tipo === 'equipo') {
        actualizarDropdowns();
    }
}

function cerrarModal(tipo) {
    const modalId = 'modal' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    document.getElementById(modalId).classList.remove('active');
    limpiarFormulario(tipo);
}

function limpiarFormulario(tipo) {
    const formId = 'form' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + 's';
    document.getElementById(formId).reset();
    
    // Limpiar variables de edición
    if (tipo === 'ubicacion') editandoUbicacion = null;
    if (tipo === 'responsable') editandoResponsable = null;
    if (tipo === 'equipo') editandoEquipo = null;
}

// ===== ACTUALIZAR DROPDOWNS =====
function actualizarDropdowns() {
    // Actualizar dropdown de ubicaciones
    const selectUbicacion = document.getElementById('equipo_ubicacion');
    if (selectUbicacion) {
        const valorActual = selectUbicacion.value;
        selectUbicacion.innerHTML = '<option value="">Seleccione una ubicación</option>';
        ubicaciones.forEach(ubicacion => {
            selectUbicacion.innerHTML += `
                <option value="${ubicacion.codigo_asignado}">
                    ${ubicacion.codigo_asignado} - ${ubicacion.nombre_ubicacion}
                </option>
            `;
        });
        if (valorActual) selectUbicacion.value = valorActual;
    }

    // Actualizar dropdown de responsables
    const selectResponsable = document.getElementById('equipo_responsable');
    if (selectResponsable) {
        const valorActual = selectResponsable.value;
        selectResponsable.innerHTML = '<option value="">Seleccione un responsable</option>';
        responsables.forEach(responsable => {
            selectResponsable.innerHTML += `
                <option value="${responsable.codigo_asignado}">
                    ${responsable.codigo_asignado} - ${responsable.nombres_apellidos}
                </option>
            `;
        });
        if (valorActual) selectResponsable.value = valorActual;
    }
}