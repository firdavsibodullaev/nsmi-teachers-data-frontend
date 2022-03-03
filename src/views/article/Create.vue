<template>
  <div>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="'validation'+index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="'error'+ind" banner/>
      </a-col>
    </div>
    <a-form
        :form="form"
        @submit="onSubmit"
        layout="vertical"
        autocomplete="off"
    >
      <a-row style="margin-bottom: 10px;">
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Заголовок статьи">
            <a-input
                placeholder="Введите заголовок статьи"
                v-decorator="['title', {
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
              rules:[{required:true, message: 'Введите ссылку'}]
            }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Год публикации статьи">
            <a-input
                placeholder="Введите год публикации статьи"
                type="text"
                @keydown="checkFormat($event)"
                @keyup="checkFormat($event)"
                v-decorator="['publish_year', {
              rules:[{required:true, message: 'Введите год'}]
            }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Страниц">
            <a-input
                placeholder="Введите число стрниц"
                v-decorator="['pages', {
              rules:[{required:true, message: 'Введите пожалуйста число стрниц'}]
            }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Страна">
            <a-select
                v-decorator="['country_name', {
              rules:[{required:true, message: 'Выберите страну'}]
            }]"
                v-if="!countryNotFound"
                show-search
                placeholder="Выберите страну"
                :filter-option="filterOption"
            >
              <a-select-option v-for="country in countries"
                               :key="'country'+country.id"
                               :value="country.name"
              >
                {{ country.name }}
              </a-select-option>
            </a-select>
            <a-input
                v-else
                placeholder="Введите страну"
                v-decorator="['country_name', {
              rules:[{required:true, message: 'Введите пожалуйста название страны'}]
            }]"/>
            <a-checkbox style="margin-top: 5px" @change="countryNotFound = !countryNotFound">
              Не нашли журнал в списке?
            </a-checkbox>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Соавторы">
            <div v-for="i in usersCount"
                 style="margin-bottom: 15px;"
                 :ref="'user-'+i"
                 :key="'users'+i">
              <a-select
                  style="margin-bottom: 5px;"
                  show-search
                  :filter-option="filterOption"
                  v-decorator="['users['+(i-1)+']']"
                  placeholder="Выберите соавторов"
              >
                <a-select-option
                    v-for="user in users"
                    :value="user.id"
                    :key="'user'+user.id">
                  {{ user.full_name_string }}
                </a-select-option>
              </a-select>
              <a-button type="danger" @click="remove(i)">Убрать</a-button>
            </div>
            <a-button type="primary" @click="usersCount++">Добавить автора</a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <a-button type="primary" :loading="loading" @click="onSubmit">Создать</a-button>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "@/helpers";

export default {
  name: "Create",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'article-form'})
  },
  data() {
    return {
      validationFails: false,
      validationErrors: [],
      loading: false,
      users: [],
      savedUsers: [],
      magazines: [],
      languages: [],
      countries: [],
      magazineNotFound: false,
      countryNotFound: false,
      usersCount: 1,
    };
  },
  methods: {
    fetch() {
      this.$api.getUsers(null, ({data}) => {
        this.users = data.data;
      }, ({data}) => {
        console.log(data);
      });

      this.$api.getMagazines(null, ({data}) => {
        this.magazines = data.data;
      }, ({data}) => {
        console.log(data);
      });
      this.$api.getCountries(null, ({data}) => {
        this.countries = data.data;
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
        this.$api.saveArticle(values, () => {
          this.loading = false;
          this.$router.push({name: 'article'});
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
    checkFormat(el) {
      const keyCodes = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
      const data = el.path[0].value;
      if ((!keyCodes.includes(el.keyCode) || data.length >= 4) && el.keyCode !== 8) {
        el.preventDefault();
      }
    },
    remove(count) {
      if (Object.keys(this.$refs).length <= 1) {
        return;
      }
      const span = this.$refs['user-' + count];

      for (let i = 0; i < span.length; i++) {
        span[i].remove();
      }

      delete this.$refs['user-' + count];
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
