<template>
  <div>
    <div class="space-align-container">
      <a-button type="primary">
        <router-link :to="{name: 'phd_doctors_create'}">Добавить</router-link>
      </a-button>
    </div>
    <a-table :data-source="data"
             :loading="loading"
             :rowKey="record => record.id"
             :pagination="pagination"
             :columns="columns"
             bordered
             @change="handleTableChange"
    >

      <template slot="name" slot-scope="data">
        <a-popover title="Выберите действие">
          <template slot="content">
            <a-button
                @click="update(data)"
            >
              Редактировать
            </a-button>
            <a-popconfirm
                title="Действительно собираетесь удалить запись?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="destroy(data)"
            >
              <a-button type="danger">
                Удалить
              </a-button>
            </a-popconfirm>
          </template>
          <a-button type="link">
            {{ data.user.last_name }}
            {{ data.user.first_name }}
            {{ data.user.patronymic }}
          </a-button>
        </a-popover>
      </template>
      <template slot="diplomaSeries" slot-scope="diploma">
        {{ diploma ? diploma.series : '—' }}
      </template>
      <template slot="diplomaNumber" slot-scope="diploma">
        {{ diploma ? diploma.number : '—' }}
      </template>
      <template slot="professorWithoutScienceDegreeSeries" slot-scope="diploma">
        {{ diploma ? diploma.series : '—' }}
      </template>
      <template slot="professorWithoutScienceDegreeNumber" slot-scope="diploma">
        {{ diploma ? diploma.number : '—' }}
      </template>
      <template slot="employment" slot-scope="employment">
        {{ employment.order }} <br> {{ employment.date }}
      </template>
    </a-table>
  </div>
</template>

<script>
import {sortQuery} from "../../helpers";

const columns = [
  {
    title: 'ФИО профессоров и преподавателей в главном штате',
    // dataIndex: 'user',
    key: 'user',
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: 'Диплом',
    children: [
      {
        title: 'Серия',
        key: 'diploma-series',
        dataIndex: 'diploma',
        scopedSlots: {customRender: 'diplomaSeries'}
      },
      {
        title: 'Номер',
        key: 'diploma-number',
        dataIndex: 'diploma',
        scopedSlots: {customRender: 'diplomaNumber'}
      },
    ]
  },
  {
    title: 'Профессор без полученной ученой степени диплома или эквивалентного научного звания',
    children: [
      {
        title: 'Серия',
        key: 'professor_without_science_degree_series',
        dataIndex: 'professor_without_science_degree',
        scopedSlots: {customRender: 'professorWithoutScienceDegreeSeries'}
      },
      {
        title: 'Номер',
        key: 'professor_without_science_degree_number',
        dataIndex: 'professor_without_science_degree',
        scopedSlots: {customRender: 'professorWithoutScienceDegreeNumber'}
      },
    ]
  },
  {
    title: 'Название специальности',
    dataIndex: 'speciality_name',
    key: 'speciality_name'
  },
  {
    title: 'Номер приказа и дата приема на работу',
    dataIndex: 'employment',
    key: 'employment',
    scopedSlots: {customRender: 'employment'}
  }
];
export default {
  name: "Index",
  data() {
    return {
      data: [],
      loading: true,
      pagination: {},
      columns
    };
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.loading = true;
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
    fetch(params = {}) {
      this.$api.getPhdDoctors({...params}, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total
        };
        this.loading = false;
      }, ({data}) => {
        console.log(data);
        this.loading = false;
      });
    },
    update(data) {
      this.$router.push({name: 'phd_doctors_edit', params: {id: data.id}});
    },
    destroy(data) {
      console.log(data.id);
      this.loading = true;
      this.$api.deletePhdDoctor(data.id, () => {
        this.fetch();
      }, () => {

        this.loading = false;
      });
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>
.space-align-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: end;
  margin-bottom: 10px;
}

</style>
