<template>
  <div>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form
        :form="form"
        @submit="onSubmit"
        layout="vertical"
        autocomplete="off"
    >
      <a-row>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Заголовок статьи">
            <a-input
                placeholder="Введите заголовок статьи"
                v-decorator="['article_title', {
                  initialValue: data ? data.article_title : null,
                  rules:[{required:true, message: 'Введите пожалуйста заголовок статьи'}]
            }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Журнал">
            <a-select
                v-decorator="['magazine_name', {
                  initialValue: data ? data.magazine.title : null,
                  rules:[{required:true, message: 'Выберите журнал'}]
                }]"
                v-if="!magazineNotFound"
                show-search
                placeholder="Выберите журнал"
                :filter-option="filterOption"
            >
              <a-select-option v-for="magazine in magazines"
                               :key="'magazine'+magazine.id"
                               :value="magazine.title"
              >
                {{ magazine.title }}
              </a-select-option>
            </a-select>
            <a-input
                v-else
                placeholder="Введите журнал"
                v-decorator="['magazine_name', {
              rules:[{required:true, message: 'Введите пожалуйста название журнала'}]
            }]"/>
            <a-checkbox style="margin-top: 5px" @change="magazineNotFound = !magazineNotFound">
              Не нашли журнал в списке?
            </a-checkbox>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Ссылка">
            <a-input
                placeholder="Введите ссылку"
                v-decorator="['link', {
              initialValue:data ? data.link : null,
                  rules:[{required:true, message: 'Введите ссылку'}]
            }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Дата публикации статьи">
            <a-input
                type="date"
                v-decorator="['magazine_publish_date', {
                  initialValue:data ? data.magazine_publish_date : null,
                  rules:[{required:true, message: 'Введите дату'}]
            }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Язык статьи">
            <a-select
                v-decorator="['article_language', {
                  initialValue:data ? data.article_language.key : null,
                  rules:[{required:true, message: 'Введите выберите язык'}]
                }]"
                placeholder="Выберите язык"
                :filter-option="filterOption"
            >
              <a-select-option v-for="(language, index) in languages"
                               :key="'language-'+index"
                               :value="index"
              >
                {{ language }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Количество цитат">
            <a-input
                type="number"
                placeholder="Введите количество цитат"
                v-decorator="['citations_count', {
                  initialValue: data ? data.citations_count : null
                }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="Соавторы">
        <a-select
            mode="multiple"
            @search="handleSearch"
            v-decorator="['users', {
              initialValue: data ? computedUsers : null,
        }]"
            placeholder="Выберите соавторов"
            :filter-option="true"

        >
          <a-select-option
              v-for="user in users"
              :value="user.id"
              :key="'user'+user.id">
            {{ user.full_name_string }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" :loading="loading" @click="onSubmit">Создать</a-button>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "@/helpers";
import _ from 'lodash';

export default {
  name: "Create",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'article_citation-form'})
  },
  data() {
    return {
      data: null,
      validationFails: false,
      validationErrors: [],
      loading: false,
      users: [],
      magazines: [],
      languages: [],
      magazineNotFound: false,
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    computedUsers() {
      return _.map(this.data.users, 'id');
    }
  },
  methods: {
    fetch() {
      this.magazines = this.$api.getMagazines(null, ({data}) => {
        this.magazines = data.data;
      }, ({data}) => {
        console.log(data);
      });

      this.$api.getLanguages(null, ({data}) => {
        this.languages = data;
      }, (data) => {
        console.log(data);
      });

      this.$api.getArticleCitation(this.$route.params['id'], ({data}) => {
        this.data = data.data;
        this.users = data.data.users;
      }, (data) => {
        console.log(data);
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.loading = true;
        this.$api.updateArticleCitation(this.$route.params['id'], values, () => {
          this.loading = false;
          this.$router.push({name: 'articleCitation'});
        }, ({data, status}) => {
          const fields = formatResponseValidatorFields(data, values);
          this.loading = false;
          if (status === 422) {
            const errors = data.errors;
            this.validationFails = true;
            this.validationErrors = errors;
            this.form.setFieldsValue(fields);
          }
        });

        console.log(error);
        console.log(values);
      })
    },
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleSearch(text) {
      if (text.length < 3) {
        clearTimeout();
        return;
      }
      setTimeout(() => {
        this.$api.getUsers({'filter[full_name]': text}, ({data}) => {
          this.users = data.data;
        }, ({data}) => {
          console.log(data);
        });
      }, 500);
    },
  }
}
</script>

<style scoped>

</style>
