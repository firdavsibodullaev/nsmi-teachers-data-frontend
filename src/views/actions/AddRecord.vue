<template>
  <div v-if="!empty">

    <h3>{{ data.FullName }}</h3>
    <hr>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form :form="form">
      <a-form-item>
        <a-input v-decorator="[`TableId`, { initialValue: data.Id}]" style="display: none"/>
      </a-form-item>
      <a-form-item v-for="(field, index) in data.Fields" :label="field.FullName" :key="index">
        <a-input v-decorator="[`Values[${index}][FieldId]`, { initialValue: field.Id}]" style="display: none"/>
        <a-input
            v-if="field.Type.KeyName === 'number'"
            type="number"
            v-decorator="[`Values[${index}][Value]`, {
              rules: [{
                required:true,
              }],
            }]"
            :placeholder="field.FullName"/>
        <a-date-picker
            v-else-if="field.Type.KeyName === 'date'"
            style="width:250px"
            placeholder="Выберите дату рождения"
            @change="changeDate"
            v-decorator="[`Values[${index}][Value]`, {rules:[{required:false, message: 'Выберите дату'}]}]"/>
        <a-upload
            v-else-if="field.Type.KeyName === 'file'"
            :action="uploadFile"
            :headers="headers"
            :data="withData({fieldId: field.Id})"
            @change="handleUploadFileChange">
          <a-button type="button">
            <a-icon type="upload"/>
            Загрузить
          </a-button>
        </a-upload>
        <a-input
            v-else-if="field.Type.KeyName === 'string'"
            v-decorator="[`Values[${index}][Value]`, {
             rules: [{
                required:true,
              }],
            }]"
            :placeholder="field.FullName"/>
      </a-form-item>
      <hr>
      <a-button @click="onSubmit" type="primary">Создать</a-button>
    </a-form>
  </div>
</template>

<script>
import _ from 'lodash';
import {formatResponseValidatorFields} from "../../helpers";

export default {
  name: "AddRecord",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'create-record'});
  },
  data() {
    return {
      loading: false,
      data: {},
      validationFails: false,
      validationErrors: [],
      recordId: undefined,
    };
  },
  computed: {
    empty() {
      return _.isEmpty(this.data);
    },
    uploadFile() {
      return `${process.env.VUE_APP_BASE_URL}/record/upload`;
    },
    headers() {
      return {
        Authorization: `Bearer ${this.$store.getters['user/accessToken']}`
      };
    },
  },
  methods: {
    changeDate(date, dateString) {
      this.form.setFieldsValue({
        Birth: dateString
      });
    },
    withData(data) {
      return {
        FieldId: data.fieldId
      };
    },
    filteredValues(values) {
      values.Values = values.Values.filter((item) => item.Value !== undefined);
      return values;
    },
    handleUploadFileChange(info) {
      if (info.file.status === 'done') {
        const response = JSON.parse(info.file.xhr.response);
        const {data} = response;
        this.recordId = data.Id;
      }
    },
    fetch() {
      this.loading = true;
      this.$api.getTable(this.$route.params['id'], ({data}) => {
        this.data = data.data;
      }, () => {
        this.loading = false;
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        this.loading = true;
        if (!error) {
          const filteredValues = this.filteredValues(values);
          this.$api.createRecord(this.recordId, filteredValues, () => {
            this.$router.push({name: 'action-table-list', params: {id: this.data.Id}});
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
    },
  }
  ,
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
