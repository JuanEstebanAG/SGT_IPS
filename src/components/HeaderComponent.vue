<template>
  <div class="header">
    <h1>🏥 SGT - Sistema de Gestión Tecnológica</h1>
    <p>IPS - Gestión de Equipos Médicos y Recursos</p>
  </div>
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
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}
</style>