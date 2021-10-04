<template>
  <div v-if="!empty">
    <h3>{{ data.FullName }}</h3>
    <hr>
    <div v-if="validationFails">
      <a-col :span="24" v-for="(item, index) in validationErrors" :key="index">
        <a-alert type="error" :message="mes" v-for="(mes, ind) in item" :key="ind" banner/>
      </a-col>
    </div>
    <a-form>
      <a-form-item v-for="(field, index) in data.Fields" :label="field.FullName" :key="index">
        <a-input
            @input="fillField(index, $event, field.Id)"
            :required="true"
            v-if="field.Type.KeyName === 'number'"
            class="required-inputs"
            type="number"

            :placeholder="field.FullName"/>
        <a-textarea
            @input="fillField(index, $event, field.Id)"
            :required="true"
            v-else-if="field.Type.KeyName === 'text'"
            class="required-inputs"
            :placeholder="field.FullName"/>
        <a-date-picker
            class="required-inputs date-picker"
            v-else-if="field.Type.KeyName === 'date'"
            style="width:250px"
            placeholder="Выберите дату рождения"
            @change="changeDate(index, $event, field.Id)"/>
        <a-upload
            :file-list="fileList"
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
            @input="fillField(index, $event, field.Id)"
            :required="true"
            v-else-if="field.Type.KeyName === 'string'"
            class="required-inputs"
            :placeholder="field.FullName"/>
      </a-form-item>
      <hr>
      <a-button @click="onSubmit" class="submit-button" type="primary">Создать</a-button>
    </a-form>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: "AddRecord",
  data() {
    const fileList = [];
    console.log(this.empty);
    return {
      fileList,
      fieldsValue: {
        TableId: null,
        Values: [],
      },
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
    fileLists() {
      if (this.empty) {
        return [];
      }
      const {Fields} = this.data;
      const fileFields = Fields.filter((field) => field.Type.KeyName === 'file');
      return _.map(fileFields, 'Id');
    },
  },
  methods: {
    changeDate(index, date, FieldId) {
      if (date) {
        this.fieldsValue.Values[index] = {
          Value: date.format('YYYY-MM-DD'),
          FieldId
        }
      } else {
        this.fieldsValue.Values[index] = {}
      }
    },
    withData(data) {
      return {
        FieldId: data.fieldId
      };
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
    checkInputsValue() {
      let isFilled = true;
      const inputs = document.querySelectorAll('.required-inputs');
      for (let input of inputs) {
        if (input.classList.contains('date-picker')) {
          const dateInput = input.getElementsByTagName('input')[0];
          if (!dateInput.value) {
            console.log(dateInput);
            dateInput.classList.add('error');
            isFilled = false;
          } else {
            dateInput.classList.remove('error');
          }
        } else {
          if (!input.value) {
            input.classList.add('error');
            isFilled = false;
          } else {
            input.classList.remove('error');
          }
        }
      }
      return isFilled;
    },
    fillField(name, value, field) {
      this.fieldsValue.Values[name] = {
        Value: value.target.value,
        FieldId: field
      }
    },
    onSubmit(e) {
      e.preventDefault();
      if (!this.checkInputsValue()) {
        return;
      }
      this.fieldsValue.TableId = this.data.Id;
      this.$api.createRecord(this.recordId, this.fieldsValue, () => {
        this.$router.push({name: 'action-table-list', params: {id: this.data.Id}});
      }, ({data, status}) => {
        if (status === 422) {
          const errors = data.errors;
          this.validationFails = true;
          this.validationErrors = errors;
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

<style>

.error {
  border-color: #ff0000 !important;
}
</style>
