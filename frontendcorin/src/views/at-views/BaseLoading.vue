<template>
  <div v-show="isLoading">
    <img class="loading" src="https://vignette.wikia.nocookie.net/judo/images/0/03/Cargando.gif/revision/latest?cb=20110601212206&path-prefix=es" alt="loading">
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      default: false
    }
  }
}
</script>
