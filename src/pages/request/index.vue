<template>
  <div>
    <el-button @click="onClick">GET normal</el-button>
  </div>
</template>

<script setup lang="ts">
import requex from '~/utils/http';
import * as services from './services';

const onClick = async () => {
  /**
   * 请求体也可定义泛型
   * 参数1为入参类型
   * 参数2位出参类型
   * extraData作用与axios.data一致
   */
  const response = await requex.request(services.getTableData, {
    // extraData: {
    //   a: 1,
    //   b: 2,
    //   'c[]': [1, 2, 3],
    // },
    onSuccess: (res) => {
      console.log('onSuccess', res);
    },
  });

  console.log('ret', response);
};
</script>
