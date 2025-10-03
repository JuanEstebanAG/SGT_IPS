<template>
  <div class="container">
    <HeaderComponent />
    <div class="content">
      <UbicacionesCrud />
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import UbicacionesCrud from '../components/UbicacionesCrud.vue'

export default {
  components: { HeaderComponent, UbicacionesCrud }
}
</script>