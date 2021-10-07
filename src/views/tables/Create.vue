<template>
  <div v-if="!empty">
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
          <a-form-item label="Полное название" class="input-containers">
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
      <a-form-item>
        <a-select
            mode="multiple"
            class="input-containers"
            @change="handlerSelectChanges('Fields', $event)"
            v-decorator="['Fields', {
              rules: [{
                required: true,
                message: 'Выберите тип',
              }]}]"
            :filterOption="filterField"
            :showSearch="true"
            placeholder="Выберите поля">
          <a-select-option v-for="(item, index) in fields" :key="index" :value="item.Id">
            {{ item.FullName }}
          </a-select-option>
        </a-select>
        <div style="margin-top: 20px">
          <div style="display: flex; justify-content: right">
            <a-button type="default" @click="addField">Создать новое поле</a-button>
          </div>
        </div>
      </a-form-item>
      <div class="input-containers">
        <a-button type="primary" @click="onSubmit">Создать</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: "Create",
  data() {
    return {
      fields: [],
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'faculty-create'});
  },
  created() {
    this.fetch();
  },
  computed: {
    empty() {
      return _.isEmpty(this.fields);
    }
  },
  methods: {
    addField() {
      const {route} = this.$router.resolve({name: 'field-create'});
      this.drawerOpen(route.meta.drawerForm, route.meta.title);
    },
    drawerOpen(type, title, data = null) {
      this.$store.dispatch('drawer/openDrawer', {
        type, title, data
      });
    },
    onSubmit() {
      this.form.validateFields((error, fields) => {
            this.loading = true;
            if (!error) {
              this.$api.createTable(fields, () => {
                this.loading = true;
                this.$router.push({name: 'table-list'});
              }, ({status, data}) => {
                this.loading = false;
                if (status === 422) {
                  this.validationFails = true;
                  this.validationErrors = data.errors;
                  this.form.setFieldsValue(fields);
                }
              });
            }
            this.loading = false;
          }
      )
    },
    fetch() {
      this.$api.getFieldsList(({data}) => {
        this.fields = data.data;
      })
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
  mounted() {
    if (this.$route.name === 'table-create') {
      this.$store.watch((state) => state.drawer.visible, (newValue) => {
        if (newValue === false) {
          this.fetch();
        }
      });
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
