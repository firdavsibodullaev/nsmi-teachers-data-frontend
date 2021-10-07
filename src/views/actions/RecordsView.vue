<template>
  <div v-if="!empty">
    <a-table
        bordered
        :columns="computedColumns"
        :data-source="computedData"
        :pagination="pagination"
        @change="handleTableChange">
      <template v-for="col in computedColumnsList" :slot="col" slot-scope="text">
        <div :key="col">
          <template>
            <span v-if="!text.link">{{ text.text }}</span>
            <a v-else :href="text.link" target="_blank">{{ text.text }}</a>
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a-button type="default" @click="edit(record)">Изменить</a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: "RecordsView",
  data() {
    return {
      data: [],
      table: {},
      userData: this.$store.getters['drawer/getData'],
      pagination: {},
      page: 1,
      editingKey: '',
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    },
    computedColumnsList() {
      return _.map(this.computedColumns, 'title');
    },
    computedColumns() {
      let columns = [];
      const {Fields} = this.table;
      for (let field of Fields) {
        columns.push({
          title: field.FullName,
          key: field.Id,
          dataIndex: field.FullName,
          scopedSlots: {customRender: field.FullName},
          slots: {title: field.FullName},
        });
      }
      columns.push({
        title: 'Действия',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
      });
      return columns;
    },
    computedData() {
      let returnValue = [];
      for (let values of this.data) {
        let fieldValues = {};
        fieldValues['recordId'] = values.Id;
        for (let fieldValue of values.Values) {
          fieldValues['key'] = fieldValue.Field.Id;
          fieldValues[fieldValue.Field.FullName] = {
            link: fieldValue.File,
            text: fieldValue.Value,
            field: fieldValue.Field
          };
        }
        returnValue.push(fieldValues);
      }
      return returnValue;
    }
  },
  methods: {
    fetch(params = {}) {
      this.$api.getList(this.$route.params['tableId'], this.$route.params['userId'], {...params}, ({data}) => {
        this.table = data.table;
        this.data = data.data;
        this.loading = false;
        this.pagination = {
          total: data.meta.total,
          current: data.meta.current_page,
          pageSize: data.meta.per_page
        };
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
    edit(data) {
      this.loading = true;
      this.$router.push({name: 'action-table-edit', params: {id: data.recordId}});
      this.loading = false;
    }
  },
  created() {
    this.loading = true;
    this.fetch();
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
<style>
main {
  overflow-y: scroll !important;
}
</style>
