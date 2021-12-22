<template>
  <div>
    <a-input style="width:25%;margin-bottom:2rem;"
             @input="search($event)"
             placeholder="Поиск по ФИО..."
    />
    <a-table :data-source="data"
             :loading="loading"
             :rowKey="record => record.Id"
             :pagination="pagination"
             :columns="columns"
             @change="handleTableChange"
    >

      <template slot="name" slot-scope="user">
        {{ user.last_name }} {{ user.first_name }} {{ user.patronymic }}
      </template>
      <template slot="actions" slot-scope="user">
        <a-button-group>
          <a-button
              type="primary"
              @click="view(user)"
          >
            Смотреть
          </a-button>
          <a-button
              @click="update(user)"
          >
            Редактировать
          </a-button>
          <a-popconfirm
              v-if="user.id !== $store.getters['user/user'].id"
              title="Действительно собираетесь удалить запись?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="destroy(user)"
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
      </template>
    </a-table>
  </div>

</template>

<script>
import {sortQuery} from '../../helpers';

const columns = [
  {
    width: "70%",
    dataIndex: 'full_name',
    key: 'full_name',
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    key: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];
export default {
  name: "List",
  data() {
    return {
      pagination: {},
      data: [],
      loading: false,
      columns
    }
  },
  methods: {
    update(data) {
      this.$router.push({name: 'user-edit', params: {id: data.id}});
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
    fetch(params = {}) {
      this.loading = true;
      this.getUsers(params);
    },
    getUsers(params = {}) {
      if (typeof params !== 'string') {
        params = {...params};
      }
      return this.$api.filterUsers(params, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total
        };
        this.loading = false;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = {...this.pagination};
      pager.current = pagination.current;
      this.pagination = pager;
      const parameters = {
        results: pagination.pageSize,
        page: pagination.current,
        sort: sortQuery(sorter),
        ...filters,
      };
      if (typeof parameters.sort === 'undefined') delete parameters.sort;
      this.fetch(parameters);
    },
    search(thisElem) {
      const text = thisElem.target.value;
      if (text.length > 3 || text.length === 0) {
        this.fetch(`filter[full_name]=${text}`);
      }
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
