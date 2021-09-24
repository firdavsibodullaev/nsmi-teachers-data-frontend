<template>
  <div v-if="!empty">
    <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="record => record.Id"
        @change="handleTableChange">
      <template slot="actions" slot-scope="item">
        <a-button-group>
          <a-button
              type="primary"
              @click="view(item)">
            Смотреть
          </a-button>
          <a-button
              type="default"
              @click="add(item)">
            Добавить запись
          </a-button>
        </a-button-group>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from 'lodash';

const columns = [
  {
    title: 'Название таблицы',
    dataIndex: 'FullName',
    sorter: true,
  },
  {
    title: 'Действия',
    key: 'actions',
    scopedSlots: {customRender: 'actions'},
  }
]
export default {
  name: "Index",
  data() {
    return {
      loading: false,
      data: [],
      pagination: [],
      columns,
      page: 1
    }
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    },
  },
  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$api.getTables({page: this.page, ...params}, ({data}) => {
        this.data = data.data;
        this.loading = false;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total,
        }
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
    view(data) {
      this.loading = true;
      this.$router.push({name: 'action-table-list', params: {id: data.Id}});
      this.loading = false;
    },
    add(data) {
      this.loading = true;
      this.$router.push({name: 'action-table-add', params: {id: data.Id}});
      this.loading = false;
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
