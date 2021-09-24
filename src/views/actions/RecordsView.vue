<template>
  <div v-if="!empty">
    <a-table
        :columns="computedColumns"
        :data-source="computedData"
        :pagination="pagination"
        @change="handleTableChange">
      <span slot="value" slot-scope="value">
        <p v-if="!value.link">{{ value.text }}</p>
        <a v-else :href="value.link" target="_blank">{{ value.text }}</a>
      </span>
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
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    },
    computedColumns() {
      let columns = [];
      const {Fields} = this.table;
      for (let field of Fields) {
        columns.push({
          title: field.FullName,
          dataIndex: field.FullName,
          scopedSlots: {customRender: 'value'},
          slots: {title: 'value'},
        });
      }
      return columns;
    },
    computedData() {
      let returnValue = [];
      for (let values of this.data) {
        let fieldValues = {};
        for (let fieldValue of values.Values) {
          fieldValues[fieldValue.Field.FullName] = fieldValue.File === null
              ? {text: fieldValue.Value}
              : {link: fieldValue.File, text: fieldValue.Value};
        }
        returnValue.push(fieldValues);
        console.log(returnValue);
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
    }
  },
  created() {
    this.loading = true;
    this.fetch();
  }
}
</script>

<style scoped>
.content-padding {
  box-sizing: border-box;
  padding: 2px 5rem;
}
</style>
