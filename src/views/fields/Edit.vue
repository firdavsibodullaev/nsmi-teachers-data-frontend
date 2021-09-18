<template>
  <div v-if="!empty">
    <a-form :form="form" :layout="'vertical'" @submit="onSubmit">
      <a-row>
        <a-col :span="12">
          <a-form-item label="Полное название" class="input-containers">
            <a-input
                placeholder="Введите полное название таблицы"
                v-decorator="['FullName', {
                  initialValue: data.FullName,
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
                  initialValue: data.ShortName,
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
  </div>
</template>

<script>

import {formatResponseValidatorFields} from "../../helpers";
import _ from 'lodash';

export default {
  name: "Edit",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'faculty-edit'});
  },
  data() {
    return {
      data: {},
      loading: false,
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$api.getField(this.$route.params['id'], ({data}) => {
        this.data = data.data;
        this.loading = false;
      });
    },
    onSubmit() {
      this.form.validateFields((error, values) => {
        this.loading = true;
        if (!error) {
          this.$api.saveField(this.data.Id, values, () => {
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
