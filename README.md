# vue-webshell

A webshell vue.

* Report bugs: <https://github.com/pauloklaus/vue-webshell/issues>
* Live test: <https://pauloklaus.com.br/webshell>

## Install

Create a new vue project:

```shell
vue create
```

Install component and dependencies:

```shell
npm install --save vue-webshell
```

## Environment setting

Make a src/resources folder at the root:

```shell
mkdir src/resources
```

### Configure the vue-webshell

Create the src/resources/vue-webshell.js:

```javascript
import Vue from "vue";
import VueWebshell from "vue-webshell";
import "vue-webshell/dist/VueWebshell.css";

Vue.use(VueWebshell, { VueWebshellName: "MyWebshell" });
```

### Import vue-webshell

The "src/main.js" file should look like this:

```javascript
import Vue from "vue";
import App from "./App.vue";

import "./resources/vue-webshell";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount("#app");
```

## How to use (example in App.vue)

```vue
<template>
  <div>
    <my-webshell
      title="my-webshell"
      twitterProfile="myTwitterUsername"
    />
  </div>
</template>

<style>
.webshell-prompt {
  color: green;
}
.webshell-input {
  color: green;
  background-color: black;
  border: 1px solid black;
}
.webshell-input:focus {
  outline: 1px solid black;
}
</style>
```

## Properties

Property | Description | Required | Default
-|-|-|-
projectUrl | Project source code repository url | no | -
title | Title to show on boot of webshell | no | vue-webshell
promptSignal | The prompt signal | no | $
queryIpUrl | Url to fetch your external ip address | no | -
dockerhubProfile | Your docker hub profile username | no | -
githubProfile | Your github profile username | no | -
linkedinProfile | Your linkedin profile username | no | -
npmjsProfile | Your npmjs profile username | no | -
twitterProfile | Your twitter profile username | no | -

The component uses the following CSS classes:

.webshell-container
.webshell-screen
.webshell-command
.webshell-prompt
.webshell-input
.text-light
.text-warning
.text-danger
.text-link
.text-inverse

## Using in the browser

To use directly in the browser, import bootstrap-vue before vue-webshell:

```html
<script src="https://unpkg.com/vue-webshell" />
```
