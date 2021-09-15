<template>
  <a-drawer
      :title="title"
      placement="right"
      :closable="false"
      :visible="visible"
      :width="width"
      @close="onClose"
  >
    <component :is="drawerType" :is-drawer="true"></component>
  </a-drawer>
</template>
<script>
import UserShow from '../../users/Show';
import FacultyShow from '../../faculties/Show';
import DepartmentShow from '../../departments/Show';

export default {
  components: {
    UserShow,
    FacultyShow,
    DepartmentShow
  },
  data() {
    return {
      width: 800,
    };
  },
  methods: {
    onClose() {
      this.$store.dispatch('drawer/clearFormFieldsOnClose', true);
    }
  },
  computed: {
    visible() {
      return this.$store.getters['drawer/getVisible'];
    },
    drawerType() {
      return this.$store.getters['drawer/getDrawerType'];
    },
    title() {
      return this.$store.getters['drawer/getDrawerTitle'];
    },
  },
};
</script>
