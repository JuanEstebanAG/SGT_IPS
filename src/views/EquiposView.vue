<template>
  <div class="container">
    <EquiposCrud />
  </div>
</template>

<script>
import EquiposCrud from '../components/EquiposCrud.vue'

export default {
  components: { EquiposCrud }
}
</script>

<style scoped>
.container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>