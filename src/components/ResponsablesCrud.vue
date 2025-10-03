<template>
  <div class="crud-container">
    <div class="module-header">
      <h2 class="module-title">Gestión de Responsables</h2>
      <button class="btn btn-primary" @click="abrirModal()">
        ➕ Nuevo Responsable
      </button>
    </div>

    <div class="search-container">
      <input 
        v-model="searchTerm"
        type="text" 
        class="search-input" 
        placeholder="🔍 Buscar por código, documento, nombre o cargo..."
        @input="filtrarResponsables"
      >
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Documento</th>
            <th>Nombre Completo</th>
            <th>Cargo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="responsablesPaginados.length === 0">
            <td colspan="6" class="empty-state">
              <div>No hay responsables registrados</div>
              <small>Agrega el primer responsable usando el botón superior</small>
            </td>
          </tr>
          <tr v-for="responsable in responsablesPaginados" :key="responsable.id">
            <td>{{ responsable.codigo_asignado }}</td>
            <td>{{ responsable.documento_identidad }}</td>
            <td>{{ responsable.nombres_apellidos }}</td>
            <td>
              <span class="status-badge status-active">{{ responsable.cargo }}</span>
            </td>
            <td>{{ responsable.telefono || '-' }}</td>
            <td>
              <div class="actions">
                <button class="btn btn-edit" @click="editarResponsable(responsable)">
                  ✏️ Editar
                </button>
                <button class="btn btn-delete" @click="eliminarResponsable(responsable.id)">
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
          <h2>👥 {{ editando ? 'Editar' : 'Agregar' }} Responsable</h2>
        </div>
        <form @submit.prevent="guardarResponsable">
          <div class="form-group">
            <label>Código Asignado:</label>
            <input 
              v-model="formulario.codigo_asignado"
              type="text" 
              class="form-control" 
              placeholder="Ej: RES-456" 
              required
            >
          </div>
          <div class="form-group">
            <label>Documento de Identidad:</label>
            <input 
              v-model="formulario.documento_identidad"
              type="text" 
              class="form-control" 
              placeholder="Ej: 1234567890" 
              required
            >
          </div>
          <div class="form-group">
            <label>Nombres y Apellidos:</label>
            <input 
              v-model="formulario.nombres_apellidos"
              type="text" 
              class="form-control" 
              placeholder="Ej: Juan Pérez García" 
              required
            >
          </div>
          <div class="form-group">
            <label>Cargo:</label>
            <select v-model="formulario.cargo" class="form-control" required>
              <option value="">Seleccione un cargo</option>
              <option value="Especialista">Especialista</option>
              <option value="Auxiliar">Auxiliar</option>
              <option value="Secretaria">Secretaria</option>
              <option value="Enfermera Jefe">Enfermera Jefe</option>
              <option value="Técnico Biomédico">Técnico Biomédico</option>
              <option value="Coordinadora">Coordinadora</option>
              <option value="Técnico">Técnico</option>
              <option value="Administradora">Administradora</option>
            </select>
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input 
              v-model="formulario.telefono"
              type="tel" 
              class="form-control" 
              placeholder="Ej: 300-1234567"
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
  name: 'ResponsablesCrud',
  setup() {
    const responsables = ref([])
    const responsablesFiltrados = ref([])
    const searchTerm = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const modalVisible = ref(false)
    const editando = ref(false)
    const formulario = ref({
      codigo_asignado: '',
      documento_identidad: '',
      nombres_apellidos: '',
      cargo: '',
      telefono: ''
    })
    const responsableEditandoId = ref(null)

    const responsablesPaginados = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      const datos = searchTerm.value ? responsablesFiltrados.value : responsables.value
      return datos.slice(start, end)
    })

    const totalPages = computed(() => {
      const datos = searchTerm.value ? responsablesFiltrados.value : responsables.value
      return Math.ceil(datos.length / itemsPerPage) || 1
    })

    const paginationInfo = computed(() => {
      const datos = searchTerm.value ? responsablesFiltrados.value : responsables.value
      const start = (currentPage.value - 1) * itemsPerPage
      const end = Math.min(start + itemsPerPage, datos.length)
      return {
        showing: datos.length > 0 ? `${start + 1}-${end}` : '0',
        total: datos.length
      }
    })

    const cargarResponsables = async () => {
      try {
        const response = await apiService.getResponsables()
        responsables.value = response.data
      } catch (error) {
        console.error('Error al cargar responsables:', error)
      }
    }

    const filtrarResponsables = () => {
      const term = searchTerm.value.toLowerCase()
      responsablesFiltrados.value = responsables.value.filter(r =>
        r.codigo_asignado.toLowerCase().includes(term) ||
        r.documento_identidad.toLowerCase().includes(term) ||
        r.nombres_apellidos.toLowerCase().includes(term) ||
        r.cargo.toLowerCase().includes(term) ||
        (r.telefono && r.telefono.toLowerCase().includes(term))
      )
      currentPage.value = 1
    }

    const abrirModal = () => {
      modalVisible.value = true
      editando.value = false
      formulario.value = {
        codigo_asignado: '',
        documento_identidad: '',
        nombres_apellidos: '',
        cargo: '',
        telefono: ''
      }
    }

    const cerrarModal = () => {
      modalVisible.value = false
      editando.value = false
      responsableEditandoId.value = null
    }

    const editarResponsable = (responsable) => {
      editando.value = true
      responsableEditandoId.value = responsable.id
      formulario.value = {
        codigo_asignado: responsable.codigo_asignado,
        documento_identidad: responsable.documento_identidad,
        nombres_apellidos: responsable.nombres_apellidos,
        cargo: responsable.cargo,
        telefono: responsable.telefono || ''
      }
      modalVisible.value = true
    }

    const guardarResponsable = async () => {
      try {
        if (editando.value) {
          await apiService.updateResponsable(responsableEditandoId.value, formulario.value)
          alert('✅ Responsable actualizado exitosamente')
        } else {
          await apiService.createResponsable(formulario.value)
          alert('✅ Responsable creado exitosamente')
        }
        cerrarModal()
        await cargarResponsables()
      } catch (error) {
        alert('❌ Error: ' + error.message)
      }
    }

    const eliminarResponsable = async (id) => {
      if (confirm('¿Estás seguro de eliminar este responsable?')) {
        try {
          await apiService.deleteResponsable(id)
          alert('✅ Responsable eliminado exitosamente')
          await cargarResponsables()
        } catch (error) {
          alert('❌ Error: ' + error.message)
        }
      }
    }

    onMounted(() => {
      cargarResponsables()
    })

    return {
      responsables,
      responsablesFiltrados,
      responsablesPaginados,
      searchTerm,
      currentPage,
      totalPages,
      paginationInfo,
      modalVisible,
      editando,
      formulario,
      filtrarResponsables,
      abrirModal,
      cerrarModal,
      editarResponsable,
      guardarResponsable,
      eliminarResponsable
    }
  }
}
</script>

<style scoped>
/* Mismos estilos que UbicacionesCrud */
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
</style>