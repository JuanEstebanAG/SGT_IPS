<template>
  <div class="crud-container">
    <div class="module-header">
      <h2>Gestión de Responsables</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Nuevo Responsable
      </button>
    </div>

    <input 
      v-model="searchQuery"
      type="text" 
      class="search-box" 
      placeholder="Buscar por código, documento o nombre..."
    >

    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Documento</th>
          <th>Nombre</th>
          <th>Cargo</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-center">Cargando...</td>
        </tr>
        <tr v-else-if="filteredResponsables.length === 0">
          <td colspan="6" class="empty-state">No se encontraron responsables</td>
        </tr>
        <tr v-else v-for="responsable in paginatedResponsables" :key="responsable.id">
          <td>{{ responsable.codigo_asignado }}</td>
          <td>{{ responsable.documento_identidad }}</td>
          <td>{{ responsable.nombres_apellidos }}</td>
          <td>{{ responsable.cargo }}</td>
          <td>{{ responsable.telefono || '-' }}</td>
          <td>
            <button class="btn-edit" @click="openModal(responsable)">✏️</button>
            <button class="btn-delete" @click="deleteResponsable(responsable)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal active" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Responsable' : 'Nuevo Responsable' }}</h3>
        
        <form @submit.prevent="saveResponsable">
          <div class="form-group">
            <label>Código Asignado *</label>
            <input v-model="form.codigo_asignado" type="text" required placeholder="RES-456">
          </div>

          <div class="form-group">
            <label>Documento de Identidad *</label>
            <input v-model="form.documento_identidad" type="text" required placeholder="1234567890">
          </div>

          <div class="form-group">
            <label>Nombres y Apellidos *</label>
            <input v-model="form.nombres_apellidos" type="text" required placeholder="Juan Pérez García">
          </div>

          <div class="form-group">
            <label>Cargo *</label>
            <select v-model="form.cargo" required>
              <option value="">Seleccione un cargo</option>
              <option value="Especialista">Especialista</option>
              <option value="Auxiliar">Auxiliar</option>
              <option value="Enfermera Jefe">Enfermera Jefe</option>
              <option value="Técnico Biomédico">Técnico Biomédico</option>
              <option value="Coordinadora">Coordinadora</option>
              <option value="Técnico">Técnico</option>
              <option value="Administradora">Administradora</option>
              <option value="Secretaria">Secretaria</option>
            </select>
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" placeholder="300-1234567">
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
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
  name: 'ResponsablesCrud',
  setup() {
    const responsables = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const isEditing = ref(false)
    const searchQuery = ref('')

    const form = ref({
      id: null,
      codigo_asignado: '',
      documento_identidad: '',
      nombres_apellidos: '',
      cargo: '',
      telefono: ''
    })

    const loadResponsables = async () => {
      loading.value = true
      try {
        const response = await apiService.responsables.listar()
        responsables.value = response.data
      } catch (error) {
        console.error('Error al cargar responsables:', error)
      } finally {
        loading.value = false
      }
    }

    const filteredResponsables = computed(() => {
      if (!searchQuery.value) return responsables.value
      
      const query = searchQuery.value.toLowerCase()
      return responsables.value.filter(r => 
        r.codigo_asignado?.toLowerCase().includes(query) ||
        r.documento_identidad?.toLowerCase().includes(query) ||
        r.nombres_apellidos?.toLowerCase().includes(query) ||
        r.cargo?.toLowerCase().includes(query)
      )
    })

    const paginatedResponsables = computed(() => filteredResponsables.value)

    const openModal = (responsable = null) => {
      if (responsable) {
        isEditing.value = true
        form.value = { ...responsable }
      } else {
        isEditing.value = false
        form.value = {
          id: null,
          codigo_asignado: '',
          documento_identidad: '',
          nombres_apellidos: '',
          cargo: '',
          telefono: ''
        }
      }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const saveResponsable = async () => {
      try {
        if (isEditing.value) {
          await apiService.responsables.actualizar(form.value.id, form.value)
          alert('Responsable actualizado exitosamente')
        } else {
          await apiService.responsables.crear(form.value)
          alert('Responsable creado exitosamente')
        }
        closeModal()
        loadResponsables()
      } catch (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar el responsable')
      }
    }

    const deleteResponsable = async (responsable) => {
      if (!confirm(`¿Está seguro de eliminar a ${responsable.nombres_apellidos}?`)) {
        return
      }

      try {
        await apiService.responsables.eliminar(responsable.id)
        alert('Responsable eliminado exitosamente')
        loadResponsables()
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el responsable')
      }
    }

    onMounted(() => {
      loadResponsables()
    })

    return {
      responsables,
      loading,
      showModal,
      isEditing,
      searchQuery,
      form,
      filteredResponsables,
      paginatedResponsables,
      openModal,
      closeModal,
      saveResponsable,
      deleteResponsable
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
.form-group input, .form-group select { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
</style>