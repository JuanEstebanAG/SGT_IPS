<template>
  <header class="header">
    <h1>🏥 SGT - Sistema de Gestión Tecnológica</h1>
    <p>IPS - Gestión de Equipos Médicos y Recursos</p>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}
</style>