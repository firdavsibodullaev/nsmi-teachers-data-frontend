<template>
  <MainLayout>
    <a-layout-content
        :style="{ margin: '24px 16px',
      padding: '24px 24px 0 24px',
      background: '#fff',}">
      <router-view></router-view>
    </a-layout-content>
  </MainLayout>
</template>

<script>
import MainLayout from '../views/layouts/MainLayout.vue';

export default {
  components: { MainLayout },
};
</script>
