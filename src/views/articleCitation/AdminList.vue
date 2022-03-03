<template>
  <div>
    <div class="space-align-container">
      <div class="links">
        <a-button type="primary" v-if="this.$store.getters['user/user'].post.name === 'Админ'"
                  style="margin-right: 5px;">
          <router-link :to="{name: 'article_citation_pending_confirmation'}">Не подтвержденные</router-link>
        </a-button>
        <a-button type="primary" style="margin-left: 5px;">
          <router-link :to="{name: 'article_citation_create'}">Добавить</router-link>
        </a-button>
      </div>
    </div>
    <a-table
        :columns="columns"
        :data-source="data"
        :rowKey="record => 'table-'+record.id"
        :pagination="pagination"
        bordered
        :loading="loading"
        @change="handleTableChange"
    >
      <template slot="authors" slot-scope="users">
        <p v-for="user in users" :key="'user'+user.id">
          {{ user.full_name_string }}
        </p>
      </template>
      <template slot="article-title" slot-scope="title" style="margin: 0 0 20px">
        <a-popover title="Выберите действие">
          <template slot="content">
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
    sorter: true,
    key: 'article_title',
    scopedSlots: {customRender: 'article-title'},
    width: '15%',
  },
  {
    title: 'Название журнала',
    sorter: true,
    key: 'magazine',
    scopedSlots: {customRender: 'magazine'},
    dataIndex: 'magazine',
  },
  {
    title: 'Дата публикации',
    sorter: true,
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
    sorter: true,
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
      this.$api.getArticleCitations({...params}, ({data}) => {
        this.data = data.data;
        this.pagination = {
          pageSize: data.meta.per_page,
          current: data.meta.current_page,
          total: data.meta.total,
        };
        this.loading = false;
      }, ({data}) => {
        console.log(data)
      });
    },
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
      if (typeof parameters.sort === 'undefined' || typeof sorter.order === 'undefined') delete parameters.sort;
      this.fetch(parameters);
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
