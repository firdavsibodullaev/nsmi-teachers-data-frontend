<template>
  <a-layout-header
      style="background: #fff; padding: 0;display: flex;justify-content: space-between;">
    <a-icon
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapsed"/>
    <template slot="backIcon">
      <Icon type="user"/>
    </template>
    <a-dropdown placement="bottomLeft">
        <span style="margin-right:24px">
          <a-badge :dot="true" :count="1"
                   :number-style="{ backgroundColor: '#108ee9' }">
                <a-avatar
                    shape="square"
                    size="large"
                    :style="{ backgroundColor: '#108ee9', verticalAlign: 'middle' }"
                >
              {{ user.FirstName.charAt(0) }}
            </a-avatar>
          </a-badge>
          <span style="margin-left: 1em">{{ user.FirstName }}</span>
        </span>
      <a-menu slot="overlay">
        <a-menu-item v-on:click="logout">
          <a-icon type="logout"/>
          Выйти
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </a-layout-header>
</template>
<script>
import {mapGetters} from 'vuex';
import {Icon} from 'ant-design-vue';

export default {
  computed: {
    ...mapGetters(['collapsed']),
    user() {
      return this.$store.getters['user/user'];
    },
  },
  methods: {
    logout() {
      this.$api.logout(() => {
        this.$store.dispatch('user/logout');
        this.$router.push('/login');
      }, () => {

      });
    },
    toggleCollapsed() {
      this.$store.commit('SET_COLLAPSED', !this.collapsed);
    },
  },
  components: {
    Icon,
  },
};
</script>
