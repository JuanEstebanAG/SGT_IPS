<template>
  <div class="container">
    <HeaderComponent />
    <div class="content">
      <EquiposCrud />
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import EquiposCrud from '../components/EquiposCrud.vue'

export default {
  components: { HeaderComponent, EquiposCrud }
}
</script>