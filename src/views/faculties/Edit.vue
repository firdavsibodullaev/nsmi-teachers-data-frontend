<template>
  <div>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form :form="form" @submit="onSubmit">
      <a-row>
        <a-col :span="8" class="input-containers">
          <a-form-item label="Полное название на русском">
            <a-input
                placeholder="Введите на русском"
                v-decorator="['FullNameRu', {
                  initialValue: data.FullNameRu,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на русском">
            <a-input
                placeholder="Введите на русском"
                v-decorator="['ShortNameRu', {
                  initialValue: data.ShortNameRu,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8" class="input-containers">
          <a-form-item label="Полное название на узбекском (латиница)">
            <a-input
                placeholder="Введите на латинице"
                v-decorator="['FullNameUz', {
                  initialValue: data.FullNameUz,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на узбекском (латиница)">
            <a-input
                placeholder="Введите на латинице"
                v-decorator="['ShortNameUz', {
                  initialValue: data.ShortNameUz,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8" class="input-containers">
          <a-form-item label="Полное название на узбекском (кирилица)">
            <a-input
                placeholder="Введите на кирилице"
                v-decorator="['FullNameOz', {
                  initialValue: data.FullNameOz,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Краткое название на узбекском (кирилица)">
            <a-input
                placeholder="Введите на кирилице"
                v-decorator="['ShortNameOz', {
                  initialValue: data.ShortNameOz,
                  rule: [{
                       required:true,
                       message: 'Заполните поле'
                  }]
               }]"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-col :span="24">
        <a-button
            style="margin-left: 15px"
            type="primary"
            @click="onSubmit">
          Создать
        </a-button>
      </a-col>
    </a-form>
  </div>
</template>

<script>
import {formatResponseValidatorFields} from "../../helpers";

export default {
  name: "Create",
  data() {
    return {
      validationFails: false,
      validationErrors: [],
      data: {
        FullNameUz: '',
        FullNameOz: '',
        FullNameRu: '',
        ShortNameUz: '',
        ShortNameOz: '',
        ShortNameRu: '',
      },
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'faculty-create'});
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$api.getFaculty(this.$route.params['id'], ({data}) => {
        this.data = data.data;
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        if (error) {
          return 0;
        }
        this.loading = true;
        this.$api.saveFaculty(this.data.Id, values, () => {
          this.$router.push({name: 'faculty-list'});
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
