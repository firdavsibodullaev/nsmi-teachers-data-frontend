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
    >
      <a-row>
        <a-col :span="8" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Фамилия">
            <a-input v-decorator="['last_name', {
            initialValue: (data && data.user) ? data.user.last_name : null,
                  rules:[{required:true, message: 'Введите пожалуйста фамилию'}]
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Имя">
            <a-input v-decorator="['first_name', {
            initialValue: (data && data.user) ? data.user.first_name : null,
                  rules:[{required:true, message: 'Введите пожалуйста имя'}]
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Отчество">
            <a-input v-decorator="['patronymic', {
            initialValue: (data && data.user) ? data.user.patronymic : null,
                  rules:[{required:true, message: 'Введите пожалуйста отчество'}]
          }]"/>
          </a-form-item>
        </a-col>
        <p style="padding: 5px 0 0 5px;">
          <strong>
            Докторская степень
          </strong>
        </p>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Серия">
            <a-input v-decorator="['diploma_series', {
            initialValue: (data && data.diploma) ? data.diploma.series : null
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Номер">
            <a-input v-decorator="['diploma_number', {
            initialValue: (data && data.diploma) ? data.diploma.number : null
          }]"/>
          </a-form-item>
        </a-col>
        <p style="padding: 5px 0 0 5px;">
          <strong>
            Профессор без полученной ученой степени
            диплома или эквивалентного научного звания
          </strong>
        </p>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Серия">
            <a-input v-decorator="['professor_without_science_degree_series', {
            initialValue: (data && data.professor_without_science_degree) ? data.professor_without_science_degree.series : null
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Номер">
            <a-input v-decorator="['professor_without_science_degree_number', {
            initialValue: (data && data.professor_without_science_degree) ? data.professor_without_science_degree.number : null
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Название специальности">
            <a-textarea v-decorator="['speciality_name', {
            initialValue: data ? data.speciality_name : null,
            rules: [{required:true, message: 'Введите название специальности'}]
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">
          <a-form-item label="Приказ о приеме на работу">
            <a-input v-decorator="['employee_order', {
            initialValue: (data && data.employment) ? data.employment.order : null,
            rules: [{required:true, message: 'Введите приказ о приеме на работу'}]
          }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="box-sizing: border-box; padding: 0 5px;">

          <a-form-item label="Дата приема на работу">
            <a-input
                type="date"
                v-decorator="['employee_date', {
            initialValue: (data && data.employment) ? data.employment.date : null,
            rules: [{required:true, message: 'Введите дату приема на работу'}]
          }]"/>
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
            Сохранить
          </a-button>
        </a-form-item>
      </a-col>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "../../helpers";

export default {
  name: "Edit",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'dsc-doctor_edit'});
  },
  data() {
    return {
      data: null,
      loading: true,
      users: [],
      validationFails: false,
      validationErrors: []
    };
  },
  methods: {
    fetch() {
      this.getDScDoctor();
    },
    getDScDoctor() {
      this.$api.getDScDoctor(this.$route.params.id, ({data}) => {
        this.data = data.data;
        this.loading = false;
      }, ({data}) => {
        console.log(data);
        this.loading = false;
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.loading = true;
      this.form.validateFields((error, values) => {
        if (error) {
          this.loading = false;
          return;
        }
        this.$api.saveDScDoctor(this.data.id, values, () => {
          this.$router.push({name: 'dsc-doctors'});
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
      });
      console.log(123);
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
