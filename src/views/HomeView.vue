<template>
  <div class="container">
    <!-- Header -->
    <HeaderComponent />
    
    <!-- Navigation Tabs -->
    <nav class="nav-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['nav-tab', { active: activeTab === tab.id }]"
        @click="changeTab(tab.id)"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </nav>

    <!-- Content -->
    <div class="content">
      <!-- Ubicaciones Tab -->
      <div v-show="activeTab === 'ubicaciones'" class="tab-content">
        <UbicacionesCrud />
      </div>

      <!-- Responsables Tab -->
      <div v-show="activeTab === 'responsables'" class="tab-content">
        <ResponsablesCrud />
      </div>

      <!-- Equipos Tab -->
      <div v-show="activeTab === 'equipos'" class="tab-content">
        <EquiposCrud />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import UbicacionesCrud from '../components/UbicacionesCrud.vue'
import ResponsablesCrud from '../components/ResponsablesCrud.vue'
import EquiposCrud from '../components/EquiposCrud.vue'

export default {
  name: 'HomeView',
  components: {
    HeaderComponent,
    UbicacionesCrud,
    ResponsablesCrud,
    EquiposCrud
  },
  setup() {
    const activeTab = ref('ubicaciones')
    
    const tabs = [
      { id: 'ubicaciones', label: 'Ubicaciones', icon: '📍' },
      { id: 'responsables', label: 'Responsables', icon: '👥' },
      { id: 'equipos', label: 'Equipos Médicos', icon: '🔬' }
    ]

    const changeTab = (tabId) => {
      activeTab.value = tabId
    }

    return {
      activeTab,
      tabs,
      changeTab
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  min-height: 100vh;
}

.nav-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 3px solid #dee2e6;
  padding: 0 20px;
}

.nav-tab {
  padding: 20px 30px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  color: #343a40;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab:hover {
  background: rgba(0,102,204,0.1);
}

.nav-tab.active {
  color: #0066cc;
  background: white;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 3px;
  background: #0066cc;
}

.content {
  padding: 30px;
}

.tab-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>