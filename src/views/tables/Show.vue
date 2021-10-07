<template>
  <div>
    <p><strong>Полное название:</strong> {{ data.FullName }}</p>
    <p><strong>Краткое название:</strong> {{ data.ShortName }}</p>
    <p><strong>Поля:</strong></p>
    <p v-for="(item, index) in data.Fields" :key="index">
      — {{ item.FullName }}
    </p>
  </div>
</template>

<script>

export default {
  name: "Show",
  data() {
    return {
      data: this.$store.getters['drawer/getData'],
    };
  },
}
</script>

<style scoped>

</style>
