<template>
  <div class="crud-container">
    <div class="module-header">
      <h2>Gestión de Equipos Médicos</h2>
      <button class="btn btn-primary" @click="openModal()">
        ➕ Nuevo Equipo
      </button>
    </div>

    <input 
      v-model="searchQuery"
      type="text" 
      class="search-box" 
      placeholder="Buscar por activo, marca o modelo..."
    >

    <table>
      <thead>
        <tr>
          <th>Número Activo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Ubicación</th>
          <th>Responsable</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="text-center">Cargando...</td>
        </tr>
        <tr v-else-if="filteredEquipos.length === 0">
          <td colspan="6" class="empty-state">No se encontraron equipos</td>
        </tr>
        <tr v-else v-for="equipo in paginatedEquipos" :key="equipo.id">
          <td>{{ equipo.numero_activo }}</td>
          <td>{{ equipo.marca }}</td>
          <td>{{ equipo.modelo }}</td>
          <td>{{ equipo.nombre_ubicacion || equipo.codigo_ubicacion }}</td>
          <td>{{ equipo.nombres_apellidos || equipo.codigo_responsable }}</td>
          <td>
            <button class="btn-edit" @click="openModal(equipo)">✏️</button>
            <button class="btn-delete" @click="deleteEquipo(equipo)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal active" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Equipo Médico' : 'Nuevo Equipo Médico' }}</h3>
        
        <form @submit.prevent="saveEquipo">
          <div class="form-group">
            <label>Número de Activo *</label>
            <input v-model="form.numero_activo" type="text" required placeholder="ACT-2024001">
          </div>

          <div class="form-group">
            <label>Marca *</label>
            <input v-model="form.marca" type="text" required placeholder="Philips">
          </div>

          <div class="form-group">
            <label>Modelo *</label>
            <input v-model="form.modelo" type="text" required placeholder="IntelliVue MX450">
          </div>

          <div class="form-group">
            <label>Ubicación *</label>
            <select v-model="form.codigo_ubicacion" required>
              <option value="">Seleccione una ubicación</option>
              <option v-for="ubicacion in ubicaciones" :key="ubicacion.id" :value="ubicacion.codigo_asignado">
                {{ ubicacion.codigo_asignado }} - {{ ubicacion.nombre_ubicacion }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Responsable *</label>
            <select v-model="form.codigo_responsable" required>
              <option value="">Seleccione un responsable</option>
              <option v-for="responsable in responsables" :key="responsable.id" :value="responsable.codigo_asignado">
                {{ responsable.codigo_asignado }} - {{ responsable.nombres_apellidos }}
              </option>
            </select>
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
  name: 'EquiposCrud',
  setup() {
    const equipos = ref([])
    const ubicaciones = ref([])
    const responsables = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const isEditing = ref(false)
    const searchQuery = ref('')

    const form = ref({
      id: null,
      numero_activo: '',
      marca: '',
      modelo: '',
      codigo_ubicacion: '',
      codigo_responsable: ''
    })

    const loadEquipos = async () => {
      loading.value = true
      try {
        const response = await apiService.equipos.listar()
        equipos.value = response.data
      } catch (error) {
        console.error('Error al cargar equipos:', error)
      } finally {
        loading.value = false
      }
    }

    const loadUbicaciones = async () => {
      try {
        const response = await apiService.ubicaciones.listar()
        ubicaciones.value = response.data
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      }
    }

    const loadResponsables = async () => {
      try {
        const response = await apiService.responsables.listar()
        responsables.value = response.data
      } catch (error) {
        console.error('Error al cargar responsables:', error)
      }
    }

    const filteredEquipos = computed(() => {
      if (!searchQuery.value) return equipos.value
      
      const query = searchQuery.value.toLowerCase()
      return equipos.value.filter(e => 
        e.numero_activo?.toLowerCase().includes(query) ||
        e.marca?.toLowerCase().includes(query) ||
        e.modelo?.toLowerCase().includes(query)
      )
    })

    const paginatedEquipos = computed(() => filteredEquipos.value)

    const openModal = (equipo = null) => {
      if (equipo) {
        isEditing.value = true
        form.value = {
          id: equipo.id,
          numero_activo: equipo.numero_activo,
          marca: equipo.marca,
          modelo: equipo.modelo,
          codigo_ubicacion: equipo.codigo_ubicacion,
          codigo_responsable: equipo.codigo_responsable
        }
      } else {
        isEditing.value = false
        form.value = {
          id: null,
          numero_activo: '',
          marca: '',
          modelo: '',
          codigo_ubicacion: '',
          codigo_responsable: ''
        }
      }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const saveEquipo = async () => {
      try {
        if (isEditing.value) {
          await apiService.equipos.actualizar(form.value.id, form.value)
          alert('Equipo actualizado exitosamente')
        } else {
          await apiService.equipos.crear(form.value)
          alert('Equipo creado exitosamente')
        }
        closeModal()
        loadEquipos()
      } catch (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar el equipo')
      }
    }

    const deleteEquipo = async (equipo) => {
      if (!confirm(`¿Está seguro de eliminar el equipo ${equipo.numero_activo}?`)) {
        return
      }

      try {
        await apiService.equipos.eliminar(equipo.id)
        alert('Equipo eliminado exitosamente')
        loadEquipos()
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el equipo')
      }
    }

    onMounted(() => {
      loadEquipos()
      loadUbicaciones()
      loadResponsables()
    })

    return {
      equipos,
      ubicaciones,
      responsables,
      loading,
      showModal,
      isEditing,
      searchQuery,
      form,
      filteredEquipos,
      paginatedEquipos,
      openModal,
      closeModal,
      saveEquipo,
      deleteEquipo
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