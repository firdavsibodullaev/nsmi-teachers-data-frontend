<template>
  <div v-if="!empty">
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form :form="form" @submit="onSubmit" layout="vertical">
      <a-row>
        <a-col :span="24">
          <a-form-item label="Факультет">
            <a-select
                placeholder="Выберите факультет"
                @change="handlerSelectChange('FacultyId', $event)"
                v-decorator="[
                    'F+-acultyId',
                    {
                      initialValue: data.Faculty !== null ? data.Faculty.Id : '',
                      rules: [{
                        required: true,
                        message: 'Выберите факультет'
                      }]
                    }]">
              <a-select-option v-for="(item, index) in faculties" :key="index" :value="item.Id">
                {{ item.FullNameUz }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Полное название на русском" class="input-containers">
            <a-input
                placeholder="Введите полное название на русском"
                v-decorator="['FullNameRu', {
                  initialValue: data.FullNameRu,
                  rules: [{
                    required:true,
                    message: 'Введите полное название на русском'
                  }]
                }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на русском" class="input-containers">
            <a-input
                placeholder="Введите краткое название на русском"
                v-decorator="['ShortNameRu', {
                  initialValue: data.ShortNameRu,
                  rules: [{
                    required:true,
                    message: 'Введите краткое название на русском'
                  }]
                }]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Полное название на узбекском (латиница)" class="input-containers">
            <a-input
                placeholder="Введите полное название на узбекском (латиница)"
                v-decorator="['FullNameUz', {
                  initialValue: data.FullNameUz,
                  rules: [{
                    required:true,
                    message: 'Введите полное название на латинице'
                  }]
                }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на узбекском (латиница)" class="input-containers">
            <a-input
                placeholder="Введите краткое название на узбекском (латиница)"
                v-decorator="['ShortNameUz', {
                  initialValue: data.ShortNameUz,
                  rules: [{
                    required:true,
                    message: 'Введите краткое название на латинице'
                  }]
                }]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Полное название на узбекском (кирилица)" class="input-containers">
            <a-input
                placeholder="Введите полное название на узбекском (кирилица)"
                v-decorator="['FullNameOz', {
                  initialValue: data.FullNameOz,
                  rules: [{
                    required:true,
                    message: 'Введите полное название на кирилице'
                  }]
                }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на узбекском (кирилица)" class="input-containers">
            <a-input
                placeholder="Введите краткое название на узбекском (кирилица)"
                v-decorator="['ShortNameOz', {
                  initialValue: data.ShortNameOz,
                  rules: [{
                    required:true,
                    message: 'Введите краткое название на кирилице'
                  }]
                }]"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-button
          type="primary"
          @click="onSubmit"
          :loading="loading">
        Создать
      </a-button>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "../../helpers";
import _ from 'lodash';

export default {
  name: "Create",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'departments-create'});
  },
  created() {
    this.fetch();
  },
  data() {
    return {
      data: [],
      faculties: [],
      loading: false,
      validationFails: false,
      validationErrors: [],
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    }
  },
  methods: {
    handlerSelectChange(field, value) {
      this.form.setFieldsValue({
        [field]: value
      });
    },
    getFacultiesList() {
      this.$api.getFaculties(false, ({data}) => {
        this.faculties = data.data;
      });
    },
    getDepartments() {
      this.$api.getDepartment(this.$route.params['id'], ({data}) => {
        this.data = data.data;
      });
    },
    fetch() {
      this.getFacultiesList();
      this.getDepartments();
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.loading = true;
        if (!error) {
          this.$api.saveDepartment(this.data.Id, values, () => {
            this.$router.push({name: 'department-list'});
          }, ({data, status}) => {
            const fields = formatResponseValidatorFields(data, values);
            if (status === 422) {
              const errors = data.errors;
              this.validationFails = true;
              this.validationErrors = errors;
              this.form.setFieldsValue(fields);
            }
          });
        } else {
          this.loading = false;
        }
      });
    }
  }
}
</script>

<style scoped>
.input-containers {
  box-sizing: border-box;
  padding: 0 15px;
}
</style>
