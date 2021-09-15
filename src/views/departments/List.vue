<template>
  <a-table :data-source="data">
    <span slot="title" style="color: #1890ff">Пользователи</span>
    <a-table-column :key="data.FullNameUz" title="Полное название">
      <template slot-scope="text, record">
        <span>
          {{ record.FullNameUz }}
        </span>
      </template>
    </a-table-column>
    <a-table-column :key="data.ShortNameUz" title="Короткое название">
      <template slot-scope="text, record">
        <span>
          {{ record.ShortNameUz }}
        </span>
      </template>
    </a-table-column>
    <a-table-column :key="data.Faculty" title="Факультет">
      <template slot-scope="text, record">
        <span v-if="record.Faculty">
          {{ record.Faculty.ShortNameRu }}
        </span>
      </template>
    </a-table-column>
    <a-table-column :key="data.Id" title="Действия">
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
                title="Действительно собираетесь удалить запись?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="destroy(record)"
            >
            <a-button type="danger">
              Удалить
            </a-button>
          </a-popconfirm>
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
    logg(arg) {
      console.log(arg);
      return arg;
    },
    update(data) {
      this.$router.push({name: 'department-edit', params: {id: data.Id}});
      // const routes = this.$router.getRoutes();
      // const next = _.find(routes, (item) => item.name === 'department-edit');
      // this.drawerOpen(next.meta.drawerForm, next.meta.title, data);
    },
    view(data) {
      const {route} = this.$router.resolve({name: 'department-show', params: data.Id});
      this.drawerOpen(route.meta.drawerForm, route.meta.title, data);
    },
    destroy(data) {
      this.loading = true;
      this.$api.deleteDepartment(data, () => {
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
      this.getDepartments();
      this.loading = false;
    },
    getDepartments() {
      return this.$api.getDepartments(false, ({data}) => {
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
