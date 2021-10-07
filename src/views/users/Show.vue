<template>
  <div>

    <p><strong>Место работы:</strong>
      <span
          v-if="data.Faculty"> {{ data.Faculty.FullNameRu }}, кафедра {{ data.Department.FullNameRu }}</span>
    </p>
    <p><strong>Должность:</strong>
      {{ data.Post.Name }}
    </p>
    <p><strong>Дата рождения:</strong>
      {{ data.Birth }}
    </p>
    <p><strong>Номер телефона:</strong>
      {{ phone }}
    </p>
    <p v-if="data.Email"><strong>Эл. почта</strong>
      {{ data.Email }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Show",
  computed: {
    data() {
      return this.$store.getters["drawer/getData"];
    },
    phone() {
      const {Phone} = this.data;
      return `+${Phone.substring(0, 3)} (${Phone.substring(3, 5)}) ${Phone.substring(5, 8)}-${Phone.substring(8, 10)}-${Phone.substring(10, 12)}`;
    }
  }
}
</script>

<style scoped>

</style>
