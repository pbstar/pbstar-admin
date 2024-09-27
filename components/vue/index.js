import PaButton from './button/index.vue';
import PaInput from './input/index.vue';
import PaIcon from './icon/index.vue';
import paMenu from './menu/index.vue';
import paMenuItem from './menuItem/index.vue';
import paSubmenu from './submenu/index.vue';
import dropdown from './dropdown/index.vue';
import verificationCode from './verificationCode/index.vue';

import 'tdesign-vue-next/es/style/index.css';
export default function paComponentsInstall(app) {
  app.component('pa-button', PaButton)
  app.component('pa-input', PaInput)
  app.component('pa-icon', PaIcon)
  app.component('pa-menu', paMenu)
  app.component('pa-menu-item', paMenuItem)
  app.component('pa-submenu', paSubmenu)
  app.component('pa-dropdown', dropdown)
  app.component('pa-verification-code', verificationCode)
};