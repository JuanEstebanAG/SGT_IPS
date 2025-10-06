<template>
  <div id="app">
    <header class="header">
      <h1>🏥 SGT - Sistema de Gestión Tecnológica</h1>
      <p>Gestión de Equipos Médicos IPS</p>
    </header>
    
    <nav class="nav-menu">
      <router-link to="/" class="nav-link">🏠 Inicio</router-link>
      <router-link to="/ubicaciones" class="nav-link">📍 Ubicaciones</router-link>
      <router-link to="/responsables" class="nav-link">👥 Responsables</router-link>
      <router-link to="/equipos" class="nav-link">🔬 Equipos</router-link>
    </nav>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.nav-menu {
  background: white;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-link {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #333;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #f0f0f0;
}

.router-link-active {
  background: #0066cc;
  color: white;
}

.main-content {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>