<template>
  <n-config-provider :theme="chooseTheme">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui';
import { useUser } from '@/components/UserProvider';
import {
  provide, ref, computed,
} from 'vue';

const userProvider = useUser();

const isDarkTheme = ref(true);

const chooseTheme = computed(() => ((isDarkTheme.value) ? darkTheme : null));

function switchTheme() {
  isDarkTheme.value = !isDarkTheme.value;
}

provide('userProvider', userProvider);
provide('switchTheme', switchTheme);
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  outline: none;
}
</style>
