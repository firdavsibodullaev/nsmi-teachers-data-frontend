<template>
  <div>
    <a-table
        :columns="columns"
        :data-source="data"
        :rowKey="record => 'table-'+record.id"
        bordered
        :loading="loading"
        @change="handleTableChange"
    >
      <template slot="authors" slot-scope="users">
        <p v-for="user in users" :key="'user'+user.id">
          {{ user.full_name.last_name }} {{ user.full_name.first_name }} {{ user.full_name.patronymic }}
        </p>
      </template>
      <template slot="article-title" slot-scope="title" style="margin: 0 0 20px">
        <a-popover title="Выберите действие">
          <template slot="content">
            <a-popconfirm
                title="Подтвердить запись?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="confirm(title)"
            >
              <a-button type="primary">
                Подтвердить
              </a-button>
            </a-popconfirm>
            <a-button
                @click="update(title)"
            >
              Редактировать
            </a-button>
            <a-popconfirm
                title="Действительно собираетесь удалить запись?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="destroy(title)"
            >
              <a-button type="danger">
                Удалить
              </a-button>
            </a-popconfirm>
          </template>
          <a-button type="link" v-html="beautifyTitle(title.article_title)">
          </a-button>
        </a-popover>
      </template>
      <template slot="link" slot-scope="link">
        <a :href="link" target="_blank">Перейти</a>
      </template>
      <template slot="magazine" slot-scope="magazine">
        {{ magazine.title }}
      </template>
    </a-table>
  </div>
</template>

<script>
import {sortQuery} from "@/helpers";

const columns = [
  {
    title: 'Заголовок статьи',
    key: 'article_title',
    scopedSlots: {customRender: 'article-title'},
    width: '15%',
  },
  {
    title: 'Название журнала',
    key: 'magazine',
    scopedSlots: {customRender: 'magazine'},
    dataIndex: 'magazine',
  },
  {
    title: 'Дата публикации',
    key: 'magazine_publish_date',
    dataIndex: 'magazine_publish_date'
  },
  {
    title: 'Язык статьи',
    key: 'article_language',
    dataIndex: 'article_language.value'
  },
  {
    title: 'Авторы',
    key: 'authors',
    dataIndex: 'users',
    scopedSlots: {customRender: 'authors'}
  },
  {
    title: 'Число',
    key: 'citations_count',
    dataIndex: 'citations_count'
  },
  {
    title: 'Ссылка на сайт',
    key: 'link',
    dataIndex: 'link',
    scopedSlots: {customRender: 'link'},
  }
];
export default {
  name: "AdminList",
  data() {
    return {
      columns,
      data: [],
      loading: true,
      pagination: {},
    };
  },
  methods: {
    beautifyTitle(title) {
      const titleArray = title.split(' ');
      for (let i = 0; i < titleArray.length; i++) {
        if ((i + 1) % 4 === 0)
          titleArray[i] += " <br/>";
      }
      return titleArray.join(' ');
    },
    fetch(params = {}) {
      this.$api.getNotConfirmedArticleCitations({...params}, ({data}) => {
        this.data = data.data;
        this.loading = false;
      }, ({data}) => {
        console.log(data)
      });
    },
    handleTableChange(pagination, filters, sorter) {
      this.loading = true;
      const parameters = {
        results: pagination.pageSize,
        page: pagination.current,
        sort: sortQuery(sorter),
        ...filters,
      };
      if (typeof parameters.sort === 'undefined' || typeof sorter.order === 'undefined') delete parameters.sort;
      this.fetch(parameters);
    },
    confirm(data) {
      this.loading = true;
      this.$api.confirmArticleCitation(data.id, () => {
        this.fetch();
      }, (data) => {
        console.log(data);
      });
    },
    update(data) {
      this.$router.push({name: 'article_citation_edit', params: {id: data.id}});
    },
    destroy(data) {
      this.loading = true;
      this.$api.deleteArticleCitation(data.id, () => {
        this.fetch();
      }, (data) => {
        console.log(data);
      });
    },
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

.links {
  display: flex;
  flex-direction: row;
}
</style>
