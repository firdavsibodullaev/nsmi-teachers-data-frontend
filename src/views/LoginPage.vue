<template>
  <SecondaryLayout>
    <Login/>
  </SecondaryLayout>
</template>

<script>
import Login from './modules/auth/Login.vue';
import SecondaryLayout from './layouts/Secondary';

export default {
  components: {
    SecondaryLayout,
    Login,
  },
};
</script>
