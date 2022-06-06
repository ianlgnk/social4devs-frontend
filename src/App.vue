<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui';
import { useUser } from '@/components/UserProvider';
import { onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userProvider = useUser();

provide('userProvider', userProvider);

onMounted(() => {
  if (userProvider.isTokenDefined) router.push('/feed');
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  outline: none;
}
</style>
