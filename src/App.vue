<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-08-25 18:28:07
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 15:53:02
 * @FilePath: \PagTest\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <header>
    <div class="wrapper">
      <!-- https://photo.aiyi.live/7f135e09da4bce1b1c748e74be061ad1.svga -->
      <AnimationPlayer :conf="conf" @ready="readyEvent" />
    </div>
  </header>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import AnimationPlayer from './components/animationPlayer/';

const conf = reactive({
  url: 'https://assets2023.oss-cn-hangzhou.aliyuncs.com/pagdemo/lottie.json?OSSAccessKeyId=LTAI5tCxDz7Y6h2PwzQS7vAx&Expires=1693809344&Signature=F050zTnAOSKWEjS1ZmPgiPI5vJM%3D',
  jsonConf:
    'https://assets2023.oss-cn-hangzhou.aliyuncs.com/pagdemo/vapc.json?OSSAccessKeyId=LTAI5tCxDz7Y6h2PwzQS7vAx&Expires=1693384428&Signature=48ptuN67jihob39VmDHXbFRn1oc%3D',
  loop: 0,
});
const readyEvent = (player: any) => {
  player.player.play();
};

setTimeout(() => {
  console.log('url路径变更');
  conf.url = 'data.json';
}, 4000);

// const conf =
</script>
<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
./components/animationPlayer
