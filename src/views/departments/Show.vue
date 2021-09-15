<template>
  <div v-if="!empty">
    <p><strong>Факультет:</strong> {{ data.Faculty.FullNameRu }}</p>
    <p><strong>Полное название на русском:</strong> {{ data.FullNameRu }}</p>
    <p><strong>Краткое название на русском:</strong> {{ data.ShortNameRu }}</p>
    <p><strong>Полное название на узбекском (латиница):</strong> {{ data.FullNameUz }}</p>
    <p><strong>Краткое название на узбекском (латиница):</strong> {{ data.ShortNameUz }}</p>
    <p><strong>Полное название на узбекском (кирилица):</strong> {{ data.FullNameOz }}</p>
    <p><strong>Краткое название на узбекском (кирилица):</strong> {{ data.ShortNameOz }}</p>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: "Show",
  computed: {
    empty() {
      console.log(this.data);
      return _.isEmpty(this.data);
    },
    data() {
      return this.$store.getters['drawer/getData'];
    }
  },
}
</script>

<style scoped>

</style>
