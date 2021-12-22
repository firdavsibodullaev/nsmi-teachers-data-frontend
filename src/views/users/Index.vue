<template>
  <PrimaryLayout>
    <a-layout-content
        :style="{ margin: '24px 16px',
      padding: '24px 24px 0 24px',
      background: '#fff'}">
      <router-view></router-view>
    </a-layout-content>
  </PrimaryLayout>
</template>

<script>
import PrimaryLayout from '../layouts/PrimaryLayout';

export default {
  components: {PrimaryLayout},
};
</script>
