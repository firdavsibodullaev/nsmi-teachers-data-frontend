<template>
  <div>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form :form="form" @submit="onSubmit" :layout="'vertical'">
      <a-row>
        <a-col :span="8">
          <p><strong>Личные данные</strong></p>
          <a-form-item label="Фамилия">
            <a-input
                placeholder="Введите фамилию"
                v-decorator="['last_name', {rules:[{required:true, message: 'Введите пожалуйста фамилию'}]}]"
            />
          </a-form-item>
          <a-form-item label="Имя">
            <a-input
                placeholder="Введите имя"
                v-decorator="['first_name', {rules:[{required:true, message: 'Введите пожалуйста имя'}]}]"
            />
          </a-form-item>
          <a-form-item label="Отчество">
            <a-input
                placeholder="Введите отчество"
                v-decorator="['patronymic', {rules:[{required:true, message: 'Введите пожалуйста отчество'}]}]"
            />
          </a-form-item>
          <a-form-item label="Номер телефона">
            <InputMask
                class="ant-input"
                :mask="['+998 (##) ###-##-##']"
                placeholder="+998 (YY) XXX-XX-XX"
                @input="handlePhoneChange"
                v-decorator="['phone', {rules:[{required:true, message: 'Введите пожалуйста номер телефона'}]}]"
            />
          </a-form-item>
          <a-form-item label="Дата рождения">
            <a-date-picker
                style="width:250px"
                placeholder="Выберите дату рождения"
                @change="changeDate"
                v-decorator="['birthdate', {rules:[{required:false, message: 'Выберите дату'}]}]"
            />
          </a-form-item>

        </a-col>
        <a-col class="spacing" :span="8">
          <p><strong>Данные аутентификации</strong></p>
          <a-form-item label="Логин">
            <a-input
                placeholder="Введите логин"
                v-decorator="['username', {rules:[{required:true, message: 'Введите пожалуйста логин'}]}]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Пароль">
            <a-input
                placeholder="Введите пароль"
                v-decorator="['password', {rules:[{required:true, message: 'Введите пожалуйста пароль'}]}]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Подтверждение паролья">
            <a-input
                placeholder="Введите пароль повторно"
                v-decorator="['password_confirmation', {rules:[{required:true, message: 'Введите пожалуйста пароль повторно'}]}]"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary"
                      @click="generatePassword">Сгенерировать пароль
            </a-button>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <p><strong>Данные по работе</strong></p>
          <a-form-item label="Факультет">
            <a-select
                placeholder="Выберите факультет"
                style="width: 250px"
                @change="handleChangeFaculty"
                v-decorator="['faculty_id', {rules:[{required:false, message: 'Выберите факультет'}]}]"
            >
              <a-select-option v-for="(item, index) in faculties" :key="index" :value="item.id">
                {{ item.full_name.ru }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Кафедра">
            <a-select
                placeholder="Выберите кафедру"
                style="width: 250px"
                @change="handleChangeDepartment"
                v-decorator="['department_id', {rules:[{required:false, message: 'Выберите кафедру'}]}]"
            >
              <a-select-option v-for="(item, index) in departments" :key="index" :value="item.id">
                {{ item.full_name.ru }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Должность">
            <a-select
                placeholder="Выберите должность"
                style="width: 250px"
                @change="handleChangePost"
                v-decorator="['post', {rules:[{required:true, message: 'Введите должность'}]}]"
            >
              <a-select-option v-for="(item, index) in posts" :key="'role-'+index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-col :span="24">
        <a-form-item>
          <a-button
              type="primary"
              :loading="loading"
              @click="onSubmit"
          >
            Создать
          </a-button>
        </a-form-item>
      </a-col>
    </a-form>
  </div>
</template>
<script>
import {TheMask} from 'vue-the-mask';
import {formatResponseValidatorFields} from "../../helpers";
import {generatePassword} from "../../helpers";

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'normal_create'});
  },
  components: {
    InputMask: TheMask
  },
  data() {
    return {
      loading: false,
      posts: [],
      faculties: [],
      faculty: null,
      validationFails: false,
      validationErrors: [],
    };
  },
  computed: {
    departments() {
      if (this.faculty) {
        const faculty = this.faculties.filter((item) => item.id === this.faculty);
        return faculty[0].departments;
      }
      return [];
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (!error) {
          this.loading = true;
          this.$api.createUser(values, () => {
            this.loading = false;
            this.$router.push({name: 'user-list'});
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
        }
        this.loading = false;
      })
    },
    handlePhoneChange(val) {
      this.form.setFieldsValue({
        phone: val.length === 9 ? `+998${val}` : `+${val}`
      });
    },
    handleChangePost(val) {
      this.form.setFieldsValue({
        post: val,
        roles: [val]
      });
    },
    handleChangeFaculty(val) {
      this.form.setFieldsValue({
        faculty_id: val,
        department_id: null,
      });
      this.faculty = val;
    },
    handleChangeDepartment(val) {
      this.form.setFieldsValue({
        department_id: val
      });
    },
    changeDate(date, dateString) {
      this.form.setFieldsValue({
        birthdate: dateString
      });
    },
    getPostsList() {
      this.$api.getUserPostsList(({data}) => {
        this.posts = data.data;
      });
    },
    getFacultiesList() {
      this.$api.getFaculties(false, ({data}) => {
        this.faculties = data.data;
      });
    },
    fetch() {
      this.getPostsList();
      this.getFacultiesList();
    },
    generatePassword() {
      const password = generatePassword();
      this.form.setFieldsValue({
        password: password,
        password_confirmation: password
      });
    }
  },
  created() {
    this.fetch();
  },
};
</script>
<style scoped>
.spacing {
  margin: 0 2rem;
}
</style>
