<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
        style="height: 95vh"
    >
        <template #icon>
            <span style="color: #70c0e8">@ianlgnk</span>
        </template>
        <n-scrollbar trigger="none" style="height: 290px; margin-bottom: 5px">
            Profile
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang="ts">
import {
  ref, defineExpose, computed, inject,
} from 'vue';
import { IUser, IUserProvider } from '@/interfaces/interfaces';

const userProvider:IUserProvider | undefined = inject('userProvider');

const isVisible = ref(false);
const user = ref<IUser>({
  email: '',
  name: '',
  bio: '',
  nickname: '',
  password: '',
  githubAccount: '',
  specialties: [],
} as IUser);

async function open(email: string) {
  isVisible.value = true;
  if (email) {
    const res = await userProvider?.searchUserByEmail(email);
    Object.assign(user.value, res);
  }
}

defineExpose({
  open,
});
</script>

<style scoped>

</style>
