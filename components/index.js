import verificationCode from './verificationCode/index.vue';

export default {
  install(app) {
    app.component('pVerificationCode', verificationCode);
  }
}