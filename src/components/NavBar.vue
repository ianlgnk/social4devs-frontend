<template>
    <n-space justify="space-between" align="center">
        <n-popover trigger="hover">
            <template #trigger>
                <n-button
                    type="error" circle ghost size="small"
                    @click="onClickLogOut"
                >
                    <template #icon>
                        <n-icon :component="MdLogOut" style="transform: rotate(180deg)" />
                    </template>
                </n-button>
            </template>
            Encerrar sessão.
        </n-popover>
        <n-image
            width="50"
            :src="require('@/assets/icon.png')"
            preview-disabled
        />
        <n-button
            type="info" circle ghost size="small"
        >
            <template #icon>
                <n-icon :component="Message" />
            </template>
        </n-button>
    </n-space>
</template>

<script setup lang="ts">
import MdLogOut from '@vicons/ionicons4/MdLogOut';
import Message from '@vicons/tabler/Message';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { NIcon } from 'naive-ui';
import { IUserProvider } from '@/interfaces/interfaces';

const router = useRouter();
const userProvider: IUserProvider | undefined = inject('userProvider');

function onClickLogOut() {
  userProvider?.logOut();
  router.push('/');
}
</script>

<style scoped>
</style>
