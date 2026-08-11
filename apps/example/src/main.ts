import { createMicroApp } from "../../app-common/appInit";
import App from "./App.vue";
import router from "./router";

createMicroApp(App, [router]);
