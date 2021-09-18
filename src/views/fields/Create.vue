<template>
  <a-form :form="form" :layout="'vertical'" @submit="onSubmit">
    <a-row>
      <a-col :span="12">
        <a-form-item label="Полное название" class="input-containers">
          <a-input
              placeholder="Введите полное название таблицы"
              v-decorator="['FullName', {
                  rules:[{
                    required: true,
                    message: 'Заполните поле'
                  }]
                }]"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Краткое название" class="input-containers">
          <a-input
              placeholder="Введите краткое название таблицы"
              v-decorator="['ShortName', {
                  rules:[{
                    required: true,
                    message: 'Заполните поле'
                  }]
                }]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <div class="input-containers">
      <a-button type="primary" @click="onSubmit">Создать</a-button>
    </div>
  </a-form>
</template>

<script>

import {formatResponseValidatorFields} from "../../helpers";

export default {
  name: "Create",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'faculty-create'});
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      this.form.validateFields((error, values) => {
        this.loading = true;
        if (!error) {
          this.$api.createField(values, () => {
            if (this.$store.getters['drawer/getVisible']) {
              this.$store.dispatch('drawer/clearFormFieldsOnClose', true);
            } else {
              this.$router.push({name: 'field-list'});
            }
            this.loading = false;
          }, ({status, data}) => {
            const fields = formatResponseValidatorFields(data, values);
            this.loading = false;
            if (status === 422) {
              this.validationFails = true;
              this.validationErrors = data.errors;
              this.form.setFieldsValue(fields);
            }
          });
        }
        this.loading = false;
      });
    },
    handlerSelectChanges(field, value) {
      this.form.setFieldsValue({
        [field]: value,
      });
    },
    filterField(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  },
}
</script>

<style scoped>
.input-containers {
  box-sizing: border-box;
  padding: 0 0.5rem;
}
</style>
