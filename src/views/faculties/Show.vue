<template>
  <div>
    <p><strong>Полное название на русском:</strong> {{ data.FullNameRu }}</p>
    <p><strong>Краткое название на русском:</strong> {{ data.ShortNameRu }}</p>
    <p><strong>Полное название на узбекском (латиница):</strong> {{ data.FullNameUz }}</p>
    <p><strong>Краткое название на узбекском (латиница):</strong> {{ data.ShortNameUz }}</p>
    <p><strong>Полное название на узбекском (кирилица):</strong> {{ data.FullNameOz }}</p>
    <p><strong>Краткое название на узбекском (кирилица):</strong> {{ data.ShortNameOz }}</p>
  </div>
</template>

<script>
export default {
  name: "Show",
  computed: {
    data() {
      return this.$store.getters["drawer/getData"];
    }
  }
}
</script>

<style scoped>

</style>
