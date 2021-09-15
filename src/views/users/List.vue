<template>
  <a-table :data-source="data">
    <span slot="title" style="color: #1890ff">Пользователи</span>
    <a-table-column key="{{LastName}}" title="ФИО">
      <template slot-scope="text, record">
        <span>
          {{ record.LastName }} {{ record.FirstName }} {{ record.Patronymic }}
        </span>
      </template>
    </a-table-column>
    <a-table-column key="{{Id}}" title="Действия">
      <template slot-scope="text, record">
        <span>
          <a-button-group>
            <a-button
                type="primary"
                @click="view(record)"
            >
              Смотреть
            </a-button>
            <a-button
                @click="update(record)"
            >
              Редактировать
            </a-button>
            <a-popconfirm
                v-if="record.Id !== $store.getters['user/user'].Id"
                title="Действительно собираетесь удалить запись?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="destroy(record)"
            >
            <a-button type="danger">
              Удалить
            </a-button>
          </a-popconfirm>
            <a-button v-else
                      type="danger"
                      :disabled="true"
            >
              Удалить
            </a-button>
          </a-button-group>
          <a-divider type="vertical"/>
          <a></a>
        </span>
      </template>
    </a-table-column>
  </a-table>

</template>

<script>

export default {
  name: "List",
  data() {
    return {
      pagination: {},
      data: [],
      loading: false
    }
  },
  methods: {
    update(data) {
      this.$router.push({name: 'user-edit', params: {id: data.Id}});
      // const routes = this.$router.getRoutes();
      // const next = _.find(routes, (item) => item.name === 'user-edit');
      // this.drawerOpen(next.meta.drawerForm, next.meta.title, data);
    },
    view(data) {
      const {route} = this.$router.resolve({name: 'user-show'});
      this.drawerOpen(route.meta.drawerForm, route.meta.title, data);
    },
    destroy(data) {
      this.loading = true;
      this.$api.deleteUser(data, () => {
        this.fetch();
        this.loading = true;
      }, () => {
        this.loading = false;
      });
    },
    drawerOpen(type, title, data) {
      this.$store.dispatch('drawer/openDrawer', {
        type,
        title,
        data
      });
    },
    fetch() {
      this.getUsers();
      this.loading = false;
    },
    getUsers() {
      return this.$api.filterUsers(false, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total
        };
      });
    },
  },
  created() {
    this.fetch();
  },
  watch: {}
}
</script>

<style scoped>

</style>
