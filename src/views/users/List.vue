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
import _ from 'lodash';

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
    logg(arg) {
      console.log(arg);
      return arg;
    },
    update(data) {
      const routes = this.$router.getRoutes();
      const next = _.find(routes, (item) => item.name === 'user-edit');
      this.drawerOpen(next.meta.drawerForm, next.meta.title, data);
    },
    view(data) {
      const routes = this.$router.getRoutes();
      const next = _.find(routes, (item) => item.name === 'user-show');
      this.drawerOpen(next.meta.drawerForm, next.meta.title, data);
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
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = {...this.pagination};
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    fetch(params = {}) {
      console.log(params);
      this.getUsers();
      this.loading = false;
    },
    getUsers() {
      return this.$api.filterUsers(false, ({data}) => {
        // const pagination = {...this.pagination};
        // // Read total count from server
        // // pagination.total = data.totalCount;
        // pagination.total = 200;
        // this.loading = false;
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
  }
}
</script>

<style scoped>

</style>
