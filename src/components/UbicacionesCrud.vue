<template>
  <div class="crud-container">
    <div class="module-header">
      <h2>Gestión de Ubicaciones</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Nueva Ubicación
      </button>
    </div>

    <input 
      v-model="searchQuery"
      type="text" 
      class="search-box" 
      placeholder="Buscar por código, nombre o ubicación..."
    >

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
        <tr v-if="loading">
          <td colspan="5" class="text-center">Cargando...</td>
        </tr>
        <tr v-else-if="filteredUbicaciones.length === 0">
          <td colspan="5" class="empty-state">No se encontraron ubicaciones</td>
        </tr>
        <tr v-else v-for="ubicacion in paginatedUbicaciones" :key="ubicacion.id">
          <td>{{ ubicacion.codigo_asignado }}</td>
          <td>{{ ubicacion.nombre_ubicacion }}</td>
          <td>{{ ubicacion.ubicacion }}</td>
          <td>{{ ubicacion.telefono || '-' }}</td>
          <td>
            <button class="btn-edit" @click="openModal(ubicacion)">✏️</button>
            <button class="btn-delete" @click="deleteUbicacion(ubicacion)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal active" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Ubicación' : 'Nueva Ubicación' }}</h3>
        
        <form @submit.prevent="saveUbicacion">
          <div class="form-group">
            <label>Código Asignado *</label>
            <input v-model="form.codigo_asignado" type="text" required placeholder="UB-001">
          </div>

          <div class="form-group">
            <label>Nombre de Ubicación *</label>
            <input v-model="form.nombre_ubicacion" type="text" required placeholder="Pediatría">
          </div>

          <div class="form-group">
            <label>Ubicación Física *</label>
            <input v-model="form.ubicacion" type="text" required placeholder="Piso 3 ala norte">
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" placeholder="604-1234567">
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
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
    const loading = ref(false)
    const showModal = ref(false)
    const isEditing = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10

    const form = ref({
      id: null,
      codigo_asignado: '',
      nombre_ubicacion: '',
      ubicacion: '',
      telefono: ''
    })

    const loadUbicaciones = async () => {
      loading.value = true
      try {
        const response = await apiService.ubicaciones.listar()
        ubicaciones.value = response.data
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      } finally {
        loading.value = false
      }
    }

    const filteredUbicaciones = computed(() => {
      if (!searchQuery.value) return ubicaciones.value
      
      const query = searchQuery.value.toLowerCase()
      return ubicaciones.value.filter(u => 
        u.codigo_asignado?.toLowerCase().includes(query) ||
        u.nombre_ubicacion?.toLowerCase().includes(query) ||
        u.ubicacion?.toLowerCase().includes(query)
      )
    })

    const totalPages = computed(() => 
      Math.ceil(filteredUbicaciones.value.length / itemsPerPage) || 1
    )

    const startIndex = computed(() => 
      (currentPage.value - 1) * itemsPerPage
    )

    const endIndex = computed(() => 
      Math.min(startIndex.value + itemsPerPage, filteredUbicaciones.value.length)
    )

    const paginatedUbicaciones = computed(() => 
      filteredUbicaciones.value.slice(startIndex.value, endIndex.value)
    )

    const openModal = (ubicacion = null) => {
      if (ubicacion) {
        isEditing.value = true
        form.value = { ...ubicacion }
      } else {
        isEditing.value = false
        form.value = {
          id: null,
          codigo_asignado: '',
          nombre_ubicacion: '',
          ubicacion: '',
          telefono: ''
        }
      }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const saveUbicacion = async () => {
      try {
        if (isEditing.value) {
          await apiService.ubicaciones.actualizar(form.value.id, form.value)
          alert('Ubicación actualizada exitosamente')
        } else {
          await apiService.ubicaciones.crear(form.value)
          alert('Ubicación creada exitosamente')
        }
        closeModal()
        loadUbicaciones()
      } catch (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar la ubicación')
      }
    }

    const deleteUbicacion = async (ubicacion) => {
      if (!confirm(`¿Está seguro de eliminar la ubicación ${ubicacion.nombre_ubicacion}?`)) {
        return
      }

      try {
        await apiService.ubicaciones.eliminar(ubicacion.id)
        alert('Ubicación eliminada exitosamente')
        loadUbicaciones()
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar la ubicación')
      }
    }

    onMounted(() => {
      loadUbicaciones()
    })

    return {
      ubicaciones,
      loading,
      showModal,
      isEditing,
      searchQuery,
      form,
      filteredUbicaciones,
      paginatedUbicaciones,
      openModal,
      closeModal,
      saveUbicacion,
      deleteUbicacion
    }
  }
}
</script>

<style scoped>
.crud-container { width: 100%; }
.module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.search-box { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 20px; }
.btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; }
.btn-primary { background: #0066cc; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-edit, .btn-delete { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; margin: 0 2px; }
.btn-edit { background: #ffc107; }
.btn-delete { background: #dc3545; }
table { width: 100%; border-collapse: collapse; }
thead { background: #f8f9fa; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
.empty-state { text-align: center; color: #999; }
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; }
.modal.active { display: flex; }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 500px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
.form-group input { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
</style>