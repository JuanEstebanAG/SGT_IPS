<template>
  <div class="home">
    <div class="dashboard">
      <h2>Panel de Control</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📍</div>
          <div class="stat-info">
            <h3>{{ stats.ubicaciones }}</h3>
            <p>Ubicaciones</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ stats.responsables }}</h3>
            <p>Responsables</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔬</div>
          <div class="stat-info">
            <h3>{{ stats.equipos }}</h3>
            <p>Equipos Médicos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ connectionStatus }}</h3>
            <p>Estado del Sistema</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService'

export default {
  name: 'HomeView',
  data() {
    return {
      stats: {
        ubicaciones: 0,
        responsables: 0,
        equipos: 0
      },
      connectionStatus: 'Verificando...'
    }
  },
  mounted() {
    this.cargarEstadisticas()
  },
  methods: {
    async cargarEstadisticas() {
      try {
        const [ubicaciones, responsables, equipos, info] = await Promise.all([
          apiService.ubicaciones.listar(),
          apiService.responsables.listar(),
          apiService.equipos.listar(),
          apiService.info()
        ])
        
        this.stats.ubicaciones = ubicaciones.data.length
        this.stats.responsables = responsables.data.length
        this.stats.equipos = equipos.data.length
        this.connectionStatus = 'Conectado'
        
        console.log('✅ Sistema conectado:', info.data)
      } catch (error) {
        console.error('❌ Error de conexión:', error)
        this.connectionStatus = 'Desconectado'
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.stat-info p {
  opacity: 0.9;
}
</style>