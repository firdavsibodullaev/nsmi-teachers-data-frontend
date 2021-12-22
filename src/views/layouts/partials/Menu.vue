<template>
  <a-menu
      :default-selected-keys="activeMenu"
      :default-open-keys="activeMenu"
      theme="dark"
      mode="inline">
    <template v-for="menu in menuItems">
      <a-sub-menu :key="menu.name" v-if="menu.children">
        <span slot="title">
          <a-icon :type="menu.icon"/>
          <span>{{ menu.meta.title }}</span>
        </span>
        <template v-for="child in onlyAvailable(menu.children)">
          <a-sub-menu :key="child.name" v-if="child.children">
          <span slot="title">
            <a-icon :type="child.icon"/>
            <span>{{ child.meta.title }}</span>
          </span>
            <a-menu-item v-for="childItem in onlyAvailable(child.children)" :key="childItem.name">
              <router-link
                  v-if="!childItem.drawer"
                  :to="{ name: childItem.name }"
                  :key="childItem.name"
              >
                <a-icon :type="childItem.icon"/>
                <span>{{ childItem.meta.title }}</span>
              </router-link>
              <div v-else>
                <div
                    @click="drawerOpen(childItem.drawerForm, childItem.meta.title)"
                >
                  <a-icon :type="childItem.icon"/>
                  <span>{{ childItem.meta.title }}</span>
                </div>
              </div>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="child.name">
            <router-link :to="{ name:child.name }"></router-link>
            <a-icon :type="child.icon"></a-icon>
            <span>{{ child.meta.title }}</span>
          </a-menu-item>
        </template>
      </a-sub-menu>
      <a-menu-item v-else :key="menu.name">
        <router-link :to="{ name: menu.name }">
          <a-icon :type="menu.icon"/>
          <span>{{ menu.meta.title }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script>
import _ from 'lodash';
import {routes} from '../../../router';

export default {
  data() {
    return {
      menus: routes,
    };
  },
  computed: {
    menuItems() {
      return this.onlyAvailable(this.menus);
    },
    activeMenu() {
      const routeKeys = _.map(this.$router.currentRoute.matched, 'name');
      return _.uniq(routeKeys);
    },
  },
  methods: {
    onlyAvailable(items) {
      const user = this.$store.getters['user/user'];
      return items.filter((i) => typeof i.show === 'boolean' && i.show === true && (i.meta.for.includes(user.post.name) || i.meta.for.includes('*')));
    },
    drawerOpen(value, title) {
      this.$store.dispatch('drawer/openDrawer', {
        type: value,
        title,
      });
    },
  },
};
</script>
