<template>
  <div class="container">
    <HeaderComponent />
    <div class="content">
      <ResponsablesCrud />
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import ResponsablesCrud from '../components/ResponsablesCrud.vue'

export default {
  components: { HeaderComponent, ResponsablesCrud }
}
</script>