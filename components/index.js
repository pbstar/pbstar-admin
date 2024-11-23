import verificationCode from './verificationCode/index.vue';
import tableList from './tableList/index.vue';

export default {
  install(app) {
    app.component('pVerificationCode', verificationCode);
    app.component('pTableList', tableList);
  }
}