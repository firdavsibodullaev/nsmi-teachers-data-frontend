<template>
  <div v-if="!empty">
    <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="record => record.Id"
    >
      <template slot="action" slot-scope="item">
        <a-button-group>
          <a-button
              type="primary"
              @click="view(item)"
          >Смотреть
          </a-button>
          <a-button
              type="default"
              @click="edit(item)"
          >Редактировать
          </a-button>
          <a-popconfirm
              title="Вы действительно хотите удалить запись?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="destroy(item)">
            <a-button
                type="danger">Удалить
            </a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from 'lodash';

const columns = [
  {
    title: 'Название',
    dataIndex: 'FullName',
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: 'Действие',
    scopedSlots: {customRender: 'action'},
    key: 'action'
  }
];

export default {
  name: "List",
  data() {
    return {
      data: [],
      loading: false,
      columns,
      pagination: [],
      page: 1,
    }
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$api.getTables({page: this.page}, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total,
        };
      });
    },
    view(data) {
      const {route} = this.$router.resolve({name: 'table-show', params: data.Id});
      this.drawerOpen(route.meta.drawerForm, route.meta.title, data);
    },
    drawerOpen(type, title, data) {
      this.$store.dispatch('drawer/openDrawer', {
        type, title, data
      });
    },
    edit(data) {
      this.$router.push({name: 'table-edit', params: {id: data.Id}});
    },
    destroy(data) {
      this.loading = true;
      this.$api.deleteTable(data, () => {
        this.fetch();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      this.page = pagination.current;
      this.pagination = {
        ...this.pagination,
        current: pagination.current,
      };
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
  }
}
</script>

<style scoped>

</style>
