<template>
  <ElConfigProvider :locale="locale">
    <DefaultLayout></DefaultLayout>
    <router-view />
  </ElConfigProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import DefaultLayout from '~/layouts/default/index.vue';

export default defineComponent({
  components: {
    DefaultLayout,
  },
  setup() {
    return {
      locale,
    };
  },
});
</script>
