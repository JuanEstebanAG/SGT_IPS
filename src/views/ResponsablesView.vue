<template>
  <div class="container">
    <ResponsablesCrud />
  </div>
</template>

<script>
import ResponsablesCrud from '../components/ResponsablesCrud.vue'

export default {
  components: { ResponsablesCrud }
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