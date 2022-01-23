import Vue from "vue";
import WebShell from "@/components/WebShell";

function install(Vue, options = {}) {
  Vue.component(options.VueWebshellName || "VueWebshell", WebShell);
}

export default install;

if (typeof window !== undefined && window.Vue && window.Vue === Vue) {
  install(window.Vue);
}

export { WebShell };
