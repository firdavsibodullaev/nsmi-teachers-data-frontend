<template>
  <div id="background">
    <div class="box">
      <a-form
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
    </div>
  </div>
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

#background {
  background-image: url("../../../assets/login-background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: bottom;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  background: rgba(200, 200, 200, 0.4);
  border-radius: 1rem;
  max-height: 21rem;
  display: block;
  width: 20%;
  /*margin-top: 10%;*/
}

.login-form {
  padding: 1rem;
  z-index: 2;
}

@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
  .box {
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
}
</style>
