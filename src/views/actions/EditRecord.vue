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
      <a-form-item v-for="(field, index) in computedFields" :label="field.FullName" :key="index">
        <a-input v-decorator="[`Values[${index}][FieldId]`, { initialValue: field.Id}]" style="display: none"/>
        <a-input
            v-if="field.Type.KeyName === 'number'"
            type="number"
            v-decorator="[`Values[${index}][Value]`, {
              initialValue: find(field.Id).Value,
              rules: [{
                required:true,
                message: 'Заполните поле'
              }],
            }]"
            :placeholder="field.FullName"/>
        <a-date-picker
            v-else-if="field.Type.KeyName === 'date'"
            style="width:250px"
            placeholder="Выберите дату рождения"
            @change="changeDate"
            v-decorator="[`Values[${index}][Value]`, {initialValue: find(field.Id).Value, rules:[{required:false, message: 'Выберите дату'}]}]"/>
        <template v-else-if="field.Type.KeyName === 'file'">
          <a-upload
              :showUploadList="false"
              :action="uploadFile"
              :headers="headers"
              :method="'put'"
              :data="withData({fieldId: field.Id})"
              @change="handleUploadFileChange">
            <a-button type="button">
              <a-icon type="upload"/>
              Загрузить
            </a-button>
          </a-upload>
          <br/>
          <a :href="find(field.Id).File" target="_blank"> {{ find(field.Id).Value }} </a>
        </template>
        <a-textarea v-else-if="field.Type.KeyName === 'text'" v-decorator="[`Values[${index}][FieldId]`, { initialValue: field.Id}]"></a-textarea>
        <a-input
            v-else-if="field.Type.KeyName === 'string'"
            v-decorator="[`Values[${index}][Value]`, {
              initialValue: find(field.Id).Value,
             rules: [{
                required:true,
                message: 'Заполните поле'
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
  name: "EditRecord",
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
      return `${process.env.VUE_APP_BASE_URL}/record/upload/${this.data.Id}`;
    },
    headers() {
      return {
        Authorization: `Bearer ${this.$store.getters['user/accessToken']}`,
        Accept: 'application/json',
      };
    },
    computedFields() {
      const {Values} = this.data;
      return _.map(Values, 'Field');
    },
    computedValues() {
      const {Values} = this.data;
      return _.map(Values, this.pickData);
    }
  },
  methods: {
    pickData(value) {
      return {
        FieldId: value['Field']['Id'],
        Value: value['Value'],
        File: value['File']
      };
    },
    find(fieldId) {
      return _.find(this.computedValues, ['FieldId', fieldId]);
    },
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
      this.$api.showRecord(this.$route.params['id'], ({data}) => {
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
          this.$api.saveRecord(this.data.Id, filteredValues, () => {
            this.$router.push({
              name: 'action-table-show', params: {
                tableId: this.data.Table.Id,
                userId: this.$store.getters['user/user'].Id
              }
            })
            ;
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
