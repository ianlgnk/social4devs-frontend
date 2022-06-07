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
  onMounted, provide, ref, computed,
} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userProvider = useUser();

const isDarkTheme = ref(true);

const chooseTheme = computed(() => ((isDarkTheme.value) ? darkTheme : null));

function switchTheme() {
  isDarkTheme.value = !isDarkTheme.value;
}

provide('userProvider', userProvider);
provide('switchTheme', switchTheme);

onMounted(() => {
  if (userProvider.isTokenDefined) router.push('/main');
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  outline: none;
}
</style>
