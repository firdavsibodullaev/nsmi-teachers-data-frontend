<template>
  <div>
    <p>
      <strong>ФИО:</strong>
      <span>
        {{data.full_name.last_name}} {{data.full_name.first_name}} {{data.full_name.patronymic}}
      </span>
    </p>
    <p><strong>Место работы:</strong>
      <span
          v-if="data.faculty"> {{ data.faculty.full_name.ru }}, кафедра {{ data.department.full_name.ru }}</span>
    </p>
    <p><strong>Должность:</strong>
      {{ data.post.name }}
    </p>
    <p><strong>Дата рождения:</strong>
      {{ data.birthdate }}
    </p>
    <p><strong>Номер телефона:</strong>
      {{ phone }}
    </p>
    <p v-if="data.email"><strong>Эл. почта</strong>
      {{ data.email }}
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
      const {phone} = this.data;
      if (phone) {
        return `${phone.substring(0, 4)} (${phone.substring(4, 6)}) ${phone.substring(6, 9)}-${phone.substring(9, 11)}-${phone.substring(11, 13)}`;
      }
      return '—';
    }
  }
}
</script>

<style scoped>

</style>
