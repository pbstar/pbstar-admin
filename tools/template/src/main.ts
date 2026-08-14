import { createMicroApp } from "../../../apps/appInit";
import App from "./App.vue";
import router from "./router";

createMicroApp(App, [router]);
