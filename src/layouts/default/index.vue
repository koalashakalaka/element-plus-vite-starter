<template>
  <div class="default-layout">
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultLayout',
});
</script>

<style lang="scss">
.default-layout {
  width: 100%;
  min-height: 100%;
  background-color: var(--content-bg);
}
</style>
