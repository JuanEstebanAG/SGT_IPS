<template>
  <div class="container">
    <UbicacionesCrud />
  </div>
</template>

<script>
import UbicacionesCrud from '../components/UbicacionesCrud.vue'

export default {
  components: { UbicacionesCrud }
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