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
import UserEdit from '../../users/Edit';

export default {
  components: {
    UserShow,
    UserEdit,
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
