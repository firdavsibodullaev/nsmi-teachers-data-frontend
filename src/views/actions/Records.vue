<template>
  <div v-if="!empty">
    <a-table
        :loading="loading"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowKey="record => record.User.Id"
        @change="handleTableChange">
      <template slot="user" slot-scope="item">
        {{ item.LastName }} {{ item.FirstName }} {{ item.Patronymic }}
      </template>
      <template slot="actions" slot-scope="item">
        <a-button
            v-if="isAccessed"
            type="primary"
            @click="view(item)">
          Смотреть
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from 'lodash';

const columns = [
  {
    title: 'Пользователь',
    dataIndex: 'User',
    sorter: true,
    scopedSlots: {customRender: 'user'}
  },
  {
    title: 'Количество',
    dataIndex: 'Total',
  },
  {
    title: 'Действия',
    scopedSlots: {customRender: 'actions'},
    key: 'actions'
  }
];
export default {
  name: "Records",
  data() {
    return {
      data: [],
      loading: false,
      pagination: {},
      page: 1,
      columns
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    },
    isAccessed() {
      return ['teacher', 'dean', 'vice_dean', 'admin', 'super_admin', 'moderator'].includes(this.$store.getters['user/user'].Post.KeyName);
    },
  },
  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$api.getRecords(this.$route.params['id'], {...params}, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total,
        };
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
    view(data) {
      this.$router.push({
        name: 'action-table-show',
        params: {
          userId: data.User.Id,
          tableId: this.$route.params['id']
        }
      })

    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
