<template>
  <a-row id="wrap" type="flex">
    <a-col :flex="2">

      <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
      >
        <a-form-item label="Логин">
          <a-input
              class="ant-input"
              v-decorator="[
              'Username',
              {
              rules: [{ required: true, message: 'Пожалуйста введите логин' }] },
            ]"
              @input="handleChange"
              placeholder="Введите логин"
          />
        </a-form-item>
        <a-form-item label="Пароль">
          <a-input-password
              v-decorator="[
          'Password',
          { rules: [{ required: true, message: 'Пожалуйста введите пароль' }] },
        ]"
              type="password"
              placeholder="Введите пароль"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-checkbox
              v-decorator="[
              'remember', { valuePropName: 'checked', initialValue: false, },
            ]">Запомнить этот компьютер !
          </a-checkbox>
          <a-button type="primary"
                    html-type="submit" class="login-form-button" :loading="isSubmitting">
            <span v-if="!isSubmitting">Войти</span>
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :flex="7" id="background"></a-col>
  </a-row>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {formatResponseValidatorFields} from '../../../helpers';

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'normal_login'});
  },
  computed: mapGetters('auth', ['isSubmitting']),
  methods: {
    ...mapActions('auth', ['submitting']),
    handleChange(event) {
      this.form.setFieldsValue({
        Username: event.target.value,
      });
    },
    handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitting(true);
          this.$api.login(values, ({data}) => {
            this.submitting(false);
            this.$store.dispatch('user/setToken', data);
            this.$store.dispatch('user/setUser', data);
            this.$router.push({name: 'index'});
          }, ({data, status}) => {
            this.submitting(false);
            const fields = formatResponseValidatorFields(data, values);
            if (status === 401) {
              this.form.setFields({
                Phone: {
                  value: values.Phone,
                  errors: [new Error('Неверное имя пользователя или пароль')],
                },
              });
            }
            if (status === 422) {
              this.form.setFields(fields);
            }
          });
        }
      });
    },
  },
};
</script>

<style>
#wrap {
  height: 100vh;
}

#background {
  background-image: url("../../../assets/login-background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: right;
}

.login-form {
  width: 60%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 35%;
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
  float: right;
}

#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
