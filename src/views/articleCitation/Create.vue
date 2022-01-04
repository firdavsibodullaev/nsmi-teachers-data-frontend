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
              rules:[{required:true, message: 'Введите пожалуйста заголовок статьи'}]
            }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Журнал">
            <a-select
                v-decorator="['magazine_name', {
              rules:[{required:true, message: 'Выберите журнал'}]
            }]"
                v-if="!journalNotFound"
                show-search
                placeholder="Выберите журнал"
                :filter-option="filterOption"
            >
              <a-select-option v-for="journal in journals"
                               :key="'journal'+journal.id"
                               :value="journal.title"
              >
                {{ journal.title }}
              </a-select-option>
            </a-select>
            <a-input
                v-else
                placeholder="Введите журнал"
                v-decorator="['magazine_name', {
              rules:[{required:true, message: 'Введите пожалуйста название журнала'}]
            }]"/>
            <a-checkbox style="margin-top: 5px" @change="journalNotFound = !journalNotFound">
              Не нашли журнал в списке?
            </a-checkbox>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Ссылка">
            <a-input
                placeholder="Введите ссылку"
                v-decorator="['link', {
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
              rules:[{required:true, message: 'Введите дату'}]
            }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Язык статьи">
            <a-select
                v-decorator="['article_language', {
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
                v-decorator="['citations_count']"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="Соавторы">
        <a-select
            mode="multiple"
            @search="handleSearch"
            v-decorator="['users']"
            placeholder="Выберите соавторов"
            :filter-option="true"
        >
          <a-select-option
              v-for="user in users"
              :value="user.id"
              :key="'user'+user.id">
            {{ user.full_name.last_name }} {{ user.full_name.first_name }} {{ user.full_name.patronymic }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" :loading="loading" @click="onSubmit">Создать</a-button>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "../../helpers";

export default {
  name: "Create",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'article_citation-form'})
  },
  data() {
    return {
      validationFails: false,
      validationErrors: [],
      loading: false,
      users: [],
      journals: [],
      languages: [],
      journalNotFound: false,
    };
  },
  methods: {
    fetch() {
      this.journals = this.$api.getJournals(null, ({data}) => {
        this.journals = data.data;
      }, ({data}) => {
        console.log(data);
      });

      this.$api.getLanguages(null, ({data}) => {
        this.languages = data;
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
        this.$api.saveArticleCitation(values, () => {
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
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
