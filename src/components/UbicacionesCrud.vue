<template>
  <div class="crud-container">
    <div class="module-header">
      <h2 class="module-title">Gestión de Ubicaciones</h2>
      <button class="btn btn-primary" @click="abrirModal()">
        ➕ Nueva Ubicación
      </button>
    </div>

    <div class="search-container">
      <input 
        v-model="searchTerm"
        type="text" 
        class="search-input" 
        placeholder="🔍 Buscar por código, nombre o ubicación..."
        @input="filtrarUbicaciones"
      >
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ubicacionesPaginadas.length === 0">
            <td colspan="5" class="empty-state">
              <div>No hay ubicaciones registradas</div>
              <small>Agrega la primera ubicación usando el botón superior</small>
            </td>
          </tr>
          <tr v-for="ubicacion in ubicacionesPaginadas" :key="ubicacion.id">
            <td>{{ ubicacion.codigo_asignado }}</td>
            <td>{{ ubicacion.nombre_ubicacion }}</td>
            <td>{{ ubicacion.ubicacion }}</td>
            <td>{{ ubicacion.telefono || '-' }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-edit" @click="editarUbicacion(ubicacion)">
                  ✏️ Editar
                </button>
                <button class="btn btn-delete" @click="eliminarUbicacion(ubicacion.id)">
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
          <h2>📍 {{ editando ? 'Editar' : 'Agregar' }} Ubicación</h2>
        </div>
        <form @submit.prevent="guardarUbicacion">
          <div class="form-group">
            <label>Código Asignado:</label>
            <input 
              v-model="formulario.codigo_asignado"
              type="text" 
              class="form-control" 
              placeholder="Ej: UB-001" 
              required
            >
          </div>
          <div class="form-group">
            <label>Nombre de la Ubicación:</label>
            <input 
              v-model="formulario.nombre_ubicacion"
              type="text" 
              class="form-control" 
              placeholder="Ej: Pediatría" 
              required
            >
          </div>
          <div class="form-group">
            <label>Ubicación Física:</label>
            <input 
              v-model="formulario.ubicacion"
              type="text" 
              class="form-control" 
              placeholder="Ej: Piso 3 ala norte" 
              required
            >
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input 
              v-model="formulario.telefono"
              type="tel" 
              class="form-control" 
              placeholder="Ej: 604-1234567"
            >
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
  name: 'UbicacionesCrud',
  setup() {
    const ubicaciones = ref([])
    const ubicacionesFiltradas = ref([])
    const searchTerm = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const modalVisible = ref(false)
    const editando = ref(false)
    const formulario = ref({
      codigo_asignado: '',
      nombre_ubicacion: '',
      ubicacion: '',
      telefono: ''
    })
    const ubicacionEditandoId = ref(null)

    const ubicacionesPaginadas = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      const datos = searchTerm.value ? ubicacionesFiltradas.value : ubicaciones.value
      return datos.slice(start, end)
    })

    const totalPages = computed(() => {
      const datos = searchTerm.value ? ubicacionesFiltradas.value : ubicaciones.value
      return Math.ceil(datos.length / itemsPerPage) || 1
    })

    const paginationInfo = computed(() => {
      const datos = searchTerm.value ? ubicacionesFiltradas.value : ubicaciones.value
      const start = (currentPage.value - 1) * itemsPerPage
      const end = Math.min(start + itemsPerPage, datos.length)
      return {
        showing: datos.length > 0 ? `${start + 1}-${end}` : '0',
        total: datos.length
      }
    })

    const cargarUbicaciones = async () => {
      try {
        const response = await apiService.getUbicaciones()
        ubicaciones.value = response.data
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      }
    }

    const filtrarUbicaciones = () => {
      const term = searchTerm.value.toLowerCase()
      ubicacionesFiltradas.value = ubicaciones.value.filter(u =>
        u.codigo_asignado.toLowerCase().includes(term) ||
        u.nombre_ubicacion.toLowerCase().includes(term) ||
        u.ubicacion.toLowerCase().includes(term) ||
        (u.telefono && u.telefono.toLowerCase().includes(term))
      )
      currentPage.value = 1
    }

    const abrirModal = () => {
      modalVisible.value = true
      editando.value = false
      formulario.value = {
        codigo_asignado: '',
        nombre_ubicacion: '',
        ubicacion: '',
        telefono: ''
      }
    }

    const cerrarModal = () => {
      modalVisible.value = false
      editando.value = false
      ubicacionEditandoId.value = null
    }

    const editarUbicacion = (ubicacion) => {
      editando.value = true
      ubicacionEditandoId.value = ubicacion.id
      formulario.value = {
        codigo_asignado: ubicacion.codigo_asignado,
        nombre_ubicacion: ubicacion.nombre_ubicacion,
        ubicacion: ubicacion.ubicacion,
        telefono: ubicacion.telefono || ''
      }
      modalVisible.value = true
    }

    const guardarUbicacion = async () => {
      try {
        if (editando.value) {
          await apiService.updateUbicacion(ubicacionEditandoId.value, formulario.value)
          alert('✅ Ubicación actualizada exitosamente')
        } else {
          await apiService.createUbicacion(formulario.value)
          alert('✅ Ubicación creada exitosamente')
        }
        cerrarModal()
        await cargarUbicaciones()
      } catch (error) {
        alert('❌ Error: ' + error.message)
      }
    }

    const eliminarUbicacion = async (id) => {
      if (confirm('¿Estás seguro de eliminar esta ubicación?')) {
        try {
          await apiService.deleteUbicacion(id)
          alert('✅ Ubicación eliminada exitosamente')
          await cargarUbicaciones()
        } catch (error) {
          alert('❌ Error: ' + error.message)
        }
      }
    }

    onMounted(() => {
      cargarUbicaciones()
    })

    return {
      ubicaciones,
      ubicacionesFiltradas,
      ubicacionesPaginadas,
      searchTerm,
      currentPage,
      totalPages,
      paginationInfo,
      modalVisible,
      editando,
      formulario,
      filtrarUbicaciones,
      abrirModal,
      cerrarModal,
      editarUbicacion,
      guardarUbicacion,
      eliminarUbicacion
    }
  }
}
</script>

<style scoped>
.crud-container {
  width: 100%;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #dee2e6;
}

.module-title {
  font-size: 1.8rem;
  color: #343a40;
}

.search-container {
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 4px 12px rgba(0,102,204,0.15);
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-number {
  padding: 10px 20px;
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
}
</style>