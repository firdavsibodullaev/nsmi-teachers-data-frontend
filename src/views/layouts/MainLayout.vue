<template>
  <a-layout id="components-layout-trigger" style="min-height:100vh">
    <a-layout-sider v-model="collapsed" width="250" :trigger="null" collapsible>
      <router-link :to="{ name: 'index' }">
        <div class="logo"/>
      </router-link>
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <Header></Header>
      <slot></slot>
    </a-layout>
    <Drawer/>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from './partials/Header.vue';
import Menu from './partials/Menu.vue';
import Drawer from './partials/Drawer.vue';

export default {
  name: 'MainLayout',
  computed: mapGetters(['collapsed']),
  props: {
    mainTitle: {
      type: String,
      required: false,
    },
    icon: {
      required: false,
      default: '<Icon type="arrow-left" />',
    },
  },
  data() {
    return {};
  },
  components: {
    Header,
    Menu,
    Drawer,
  },
};
</script>

<style>
#components-layout-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
