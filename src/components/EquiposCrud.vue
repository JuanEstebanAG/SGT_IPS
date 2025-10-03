<template>
  <div class="crud-container">
    <div class="module-header">
      <h2 class="module-title">Gestión de Equipos Médicos</h2>
      <button class="btn btn-primary" @click="abrirModal()">
        ➕ Nuevo Equipo
      </button>
    </div>

    <div class="search-container">
      <input 
        v-model="searchTerm"
        type="text" 
        class="search-input" 
        placeholder="🔍 Buscar por activo, marca, modelo o ubicación..."
        @input="filtrarEquipos"
      >
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Número Activo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Ubicación</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="equiposPaginados.length === 0">
            <td colspan="7" class="empty-state">
              <div>No hay equipos médicos registrados</div>
              <small>Agrega el primer equipo usando el botón superior</small>
            </td>
          </tr>
          <tr v-for="equipo in equiposPaginados" :key="equipo.id">
            <td>{{ equipo.numero_activo }}</td>
            <td>{{ equipo.marca }}</td>
            <td>{{ equipo.modelo }}</td>
            <td>{{ equipo.nombre_ubicacion || equipo.codigo_ubicacion }}</td>
            <td>{{ equipo.nombres_apellidos || equipo.codigo_responsable }}</td>
            <td>
              <span class="status-badge status-active">Activo</span>
            </td>
            <td>
              <div class="actions">
                <button class="btn btn-edit" @click="editarEquipo(equipo)">
                  ✏️ Editar
                </button>
                <button class="btn btn-delete" @click="eliminarEquipo(equipo.id)">
                  🗑️ Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">
        Mostrando {{ paginationInfo.showing }} de {{ paginationInfo.total }} registros
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ← Anterior
        </button>
        <span class="page-number">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          class="btn-pagination" 
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <div v-if="modalVisible" class="modal active" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔬 {{ editando ? 'Editar' : 'Agregar' }} Equipo Médico</h2>
        </div>
        <form @submit.prevent="guardarEquipo">
          <div class="form-group">
            <label>Número de Activo:</label>
            <input 
              v-model="formulario.numero_activo"
              type="text" 
              class="form-control" 
              placeholder="Ej: ACT-2024001" 
              required
            >
          </div>
          <div class="form-group">
            <label>Marca:</label>
            <input 
              v-model="formulario.marca"
              type="text" 
              class="form-control" 
              placeholder="Ej: Philips" 
              required
            >
          </div>
          <div class="form-group">
            <label>Modelo:</label>
            <input 
              v-model="formulario.modelo"
              type="text" 
              class="form-control" 
              placeholder="Ej: IntelliVue MX450" 
              required
            >
          </div>
          <div class="form-group">
            <label>Ubicación:</label>
            <select v-model="formulario.codigo_ubicacion" class="form-control" required>
              <option value="">Seleccione una ubicación</option>
              <option v-for="ubicacion in ubicaciones" :key="ubicacion.id" :value="ubicacion.codigo_asignado">
                {{ ubicacion.codigo_asignado }} - {{ ubicacion.nombre_ubicacion }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Responsable:</label>
            <select v-model="formulario.codigo_responsable" class="form-control" required>
              <option value="">Seleccione un responsable</option>
              <option v-for="responsable in responsables" :key="responsable.id" :value="responsable.codigo_asignado">
                {{ responsable.codigo_asignado }} - {{ responsable.nombres_apellidos }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" @click="cerrarModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-success">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import apiService from '../services/apiService'

export default {
  name: 'EquiposCrud',
  setup() {
    const equipos = ref([])
    const equiposFiltrados = ref([])
    const ubicaciones = ref([])
    const responsables = ref([])
    const searchTerm = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const modalVisible = ref(false)
    const editando = ref(false)
    const formulario = ref({
      numero_activo: '',
      marca: '',
      modelo: '',
      codigo_ubicacion: '',
      codigo_responsable: ''
    })
    const equipoEditandoId = ref(null)

    const equiposPaginados = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      const datos = searchTerm.value ? equiposFiltrados.value : equipos.value
      return datos.slice(start, end)
    })

    const totalPages = computed(() => {
      const datos = searchTerm.value ? equiposFiltrados.value : equipos.value
      return Math.ceil(datos.length / itemsPerPage) || 1
    })

    const paginationInfo = computed(() => {
      const datos = searchTerm.value ? equiposFiltrados.value : equipos.value
      const start = (currentPage.value - 1) * itemsPerPage
      const end = Math.min(start + itemsPerPage, datos.length)
      return {
        showing: datos.length > 0 ? `${start + 1}-${end}` : '0',
        total: datos.length
      }
    })

    const cargarEquipos = async () => {
      try {
        const response = await apiService.getEquipos()
        equipos.value = response.data
      } catch (error) {
        console.error('Error al cargar equipos:', error)
      }
    }

    const cargarUbicaciones = async () => {
      try {
        const response = await apiService.getUbicaciones()
        ubicaciones.value = response.data
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      }
    }

    const cargarResponsables = async () => {
      try {
        const response = await apiService.getResponsables()
        responsables.value = response.data
      } catch (error) {
        console.error('Error al cargar responsables:', error)
      }
    }

    const filtrarEquipos = () => {
      const term = searchTerm.value.toLowerCase()
      equiposFiltrados.value = equipos.value.filter(e =>
        e.numero_activo.toLowerCase().includes(term) ||
        e.marca.toLowerCase().includes(term) ||
        e.modelo.toLowerCase().includes(term) ||
        (e.nombre_ubicacion && e.nombre_ubicacion.toLowerCase().includes(term)) ||
        (e.nombres_apellidos && e.nombres_apellidos.toLowerCase().includes(term))
      )
      currentPage.value = 1
    }

    const abrirModal = () => {
      modalVisible.value = true
      editando.value = false
      formulario.value = {
        numero_activo: '',
        marca: '',
        modelo: '',
        codigo_ubicacion: '',
        codigo_responsable: ''
      }
    }

    const cerrarModal = () => {
      modalVisible.value = false
      editando.value = false
      equipoEditandoId.value = null
    }

    const editarEquipo = (equipo) => {
      editando.value = true
      equipoEditandoId.value = equipo.id
      formulario.value = {
        numero_activo: equipo.numero_activo,
        marca: equipo.marca,
        modelo: equipo.modelo,
        codigo_ubicacion: equipo.codigo_ubicacion,
        codigo_responsable: equipo.codigo_responsable
      }
      modalVisible.value = true
    }

    const guardarEquipo = async () => {
      try {
        if (editando.value) {
          await apiService.updateEquipo(equipoEditandoId.value, formulario.value)
          alert('✅ Equipo médico actualizado exitosamente')
        } else {
          await apiService.createEquipo(formulario.value)
          alert('✅ Equipo médico creado exitosamente')
        }
        cerrarModal()
        await cargarEquipos()
      } catch (error) {
        alert('❌ Error: ' + error.message)
      }
    }

    const eliminarEquipo = async (id) => {
      if (confirm('¿Estás seguro de eliminar este equipo médico?')) {
        try {
          await apiService.deleteEquipo(id)
          alert('✅ Equipo médico eliminado exitosamente')
          await cargarEquipos()
        } catch (error) {
          alert('❌ Error: ' + error.message)
        }
      }
    }

    onMounted(() => {
      cargarEquipos()
      cargarUbicaciones()
      cargarResponsables()
    })

    return {
      equipos,
      equiposFiltrados,
      equiposPaginados,
      ubicaciones,
      responsables,
      searchTerm,
      currentPage,
      totalPages,
      paginationInfo,
      modalVisible,
      editando,
      formulario,
      filtrarEquipos,
      abrirModal,
      cerrarModal,
      editarEquipo,
      guardarEquipo,
      eliminarEquipo
    }
  }
}
</script>

<style scoped>
/* Mismos estilos que otros componentes CRUD */
.crud-container { width: 100%; }
.module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #dee2e6; }
.search-container { margin-bottom: 25px; }
.search-input { width: 100%; padding: 14px 20px; border: 2px solid #e1e8ed; border-radius: 12px; font-size: 1rem; }
.table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08); margin-bottom: 20px; }
.pagination-container { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f8f9fa; border-radius: 12px; }
.modal { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 500px; }
.pagination-controls { display: flex; gap: 12px; align-items: center; }
.page-number { padding: 10px 20px; background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; border-radius: 8px; font-weight: 600; min-width: 120px; text-align: center; }
</style>