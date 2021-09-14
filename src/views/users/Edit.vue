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
                v-decorator="['LastName', {
                  initialValue: data.LastName,
                  rules:[{required:true, message: 'Введите пожалуйста фамилию'}]
                }]"
            />
          </a-form-item>
          <a-form-item label="Имя">
            <a-input
                placeholder="Введите имя"
                v-decorator="['FirstName', {
                  initialValue: data.FirstName,
                  rules:[{required:true, message: 'Введите пожалуйста имя'}]
                }]"
            />
          </a-form-item>
          <a-form-item label="Отчество">
            <a-input
                placeholder="Введите отчество"
                v-decorator="['Patronymic', {
                  initialValue: data.Patronymic,
                  rules:[{required:true, message: 'Введите пожалуйста отчество'}]
                }]"
            />
          </a-form-item>
          <a-form-item label="Номер телефона">
            <InputMask
                class="ant-input"
                :mask="['### (##) ###-##-##']"
                placeholder="998 (YY) XXX-XX-XX"
                @input="handlePhoneChange"
                v-decorator="['Phone', {
                  initialValue: data.Phone,
                  rules:[{required:true, message: 'Введите пожалуйста номер телефона'}]
                }]"
            />
          </a-form-item>
          <a-form-item label="Дата рождения">
            <a-date-picker
                style="width:250px"
                placeholder="Выберите дату рождения"
                @change="changeDate"
                v-decorator="['Birth', {
                  initialValue: data.Birth,
                  rules:[{required:false, message: 'Выберите дату'}]
                }]"
            />
          </a-form-item>

        </a-col>
        <a-col class="spacing" :span="8">
          <p><strong>Данные аутентификации</strong></p>
          <a-form-item label="Логин">
            <a-input
                placeholder="Введите логин"
                v-decorator="['Username', {
                  initialValue: data.Username,
                  rules:[{required:true, message: 'Введите пожалуйста логин'}]
                }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Пароль">
            <a-input
                placeholder="Введите пароль"
                v-decorator="['Password', {rules:[{required:false, message: 'Введите пожалуйста пароль'}]}]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Подтверждение паролья">
            <a-input
                placeholder="Введите пароль повторно"
                v-decorator="['Password_confirmation', {rules:[{required:false, message: 'Введите пожалуйста пароль повторно'}]}]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <p><strong>Данные по работе</strong></p>
          <a-form-item label="Факультет">
            <a-select
                placeholder="Выберите факультет"
                style="width: 250px"
                @change="handleChangeFaculty"
                v-decorator="['FacultyId', {rules:[{
                  initialValue: data.Faculty.Id,
                  required:true, message: 'Выберите факультет'}]
                }]"
                :default-value="data.Faculty.FullNameUz"
            >
              <a-select-option v-for="(item, index) in faculties" :key="index" :value="item.Id">
                {{ item.FullNameUz }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Кафедра">
            <a-select
                placeholder="Выберите кафедру"
                style="width: 250px"
                @change="handleChangeDepartment"
                v-decorator="['DepartmentId', {rules:[{
                  initialValue: data.Department.Id,
                  required:true, message: 'Выберите кафедру'}]
                }]"
            >
              <a-select-option v-for="(item, index) in departments" :key="index" :value="item.Id">
                {{ item.FullNameUz }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Должность">
            <a-select
                placeholder="Выберите должность"
                style="width: 250px"
                @change="handleChangePost"
                v-decorator="['Post', {rules:[{
                  initialValue: data.Post.KeyName,
                  required:true, message: 'Введите должность'}]
                }]"
            >
              <a-select-option v-for="(item, index) in posts" :key="index" :value="index">
                {{ item }}
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
            Submit
          </a-button>
        </a-form-item>
      </a-col>
    </a-form>
  </div>
</template>
<script>
import {TheMask} from 'vue-the-mask';
import {formatResponseValidatorFields} from "../../helpers";

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'normal_edit'});
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
      data: null,
    };
  },
  computed: {
    departments() {
      if (this.faculty) {
        const faculty = this.faculties.filter((item) => item.Id === this.faculty);
        return faculty[0].Departments;
      }
      return [];
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      console.log(this.form.getFieldsValue());
      this.form.validateFields((error, values) => {
        if (!error) {
          this.loading = true;
          this.$api.saveUser(this.data.Id, values, () => {
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
        Phone: val
      });
    },
    handleChangePost(val) {
      this.form.setFieldsValue({
        Post: val
      });
    },
    handleChangeFaculty(val) {
      this.form.setFieldsValue({
        FacultyId: val,
        DepartmentId: null,
      });
      this.faculty = val;
    },
    handleChangeDepartment(val) {
      this.form.setFieldsValue({
        DepartmentId: val
      });
    },
    changeDate(date, dateString) {
      this.form.setFieldsValue({
        Birth: dateString
      });
    },
    getPostsList() {
      this.$api.getPostConstants(({data}) => {
        this.posts = data;
      });
    },
    getFacultiesList() {
      this.$api.getFaculties(false, ({data}) => {
        this.faculties = data.data;
      });
    },
    fetch() {
      this.data = this.$store.getters['drawer/getData'];
      this.getPostsList();
      this.faculty = this.data.Faculty.Id;
      console.log(this.data);
      this.getFacultiesList();
    }
  },
  beforeMount() {
    this.fetch();
  },
};
</script>
<style scoped>
.spacing {
  margin: 0 0.5rem;
}
</style>
