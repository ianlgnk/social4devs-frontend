<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
    >
        <template #icon>
            <span style="color: #fff">@{{ user.nickname }}</span>
        </template>
        <n-space vertical align="center" style="margin-top: 20px;">
          <n-avatar
            round
            :size="90"
            :src="require('@/assets/avatar_default.jpg')"
          />
          <n-button
            v-if="(!isLoggedUserProfile)"
            text @click="followUnfollowUser"
            :type="(isFollowing) ? 'error' : 'info'"
          >
            <template #icon>
              <n-icon :component="(isFollowing) ? CloseOutline : UserFollow" />
            </template>
            {{ (isFollowing) ? 'Deixar de seguir' : 'Seguir' }}
          </n-button>
        </n-space>
        <ProfileSectionTabs />
    </n-modal>
</template>

<script setup lang="ts">
import {
  ref, defineExpose, inject, computed, provide, reactive,
} from 'vue';
import { IUser, IUserProvider } from '@/interfaces/interfaces';
import { useMessage } from 'naive-ui';
import ProfileSectionTabs from '@/components/ProfileSectionTabs.vue';
import CloseOutline from '@vicons/carbon/CloseOutline';
import UserFollow from '@vicons/carbon/UserFollow';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();

const isVisible = ref(false);
const user = reactive<IUser>({
  email: '',
  name: '',
  bio: '',
  nickname: '',
  password: '',
  githubAccount: '',
  specialties: [],
  followers: [],
  follows: [],
} as IUser);
const isLoggedUserProfile = computed(() => (user.email === userProvider?.user.email));
const isFollowing = ref(false);

provide('profileUser', user);
provide('isLoggedUserProfile', isLoggedUserProfile);

async function open(email: string) {
  if (email) {
    isVisible.value = true;
    const res = await userProvider?.searchUserByEmail(email);
    Object.assign(user, res);
    user.password = '';
    user.githubAccount = res?.githubaccount;
    if (user.specialties === null) user.specialties = [];
    if (user.followers === null) user.followers = [];
    if (user.follows === null) user.follows = [];
    user.followers.forEach((follower) => {
      if (follower.email === userProvider?.user.email) isFollowing.value = true;
    });
  } else message.error('Oops... algo deu errado ao tentar abrir o perfil.');
}

async function followUnfollowUser() {
  if (isFollowing.value) {
    await userProvider?.unfollowUser(user.email);
    isFollowing.value = false;
  } else {
    await userProvider?.followUser(user.email);
    isFollowing.value = true;
  }
}

defineExpose({
  open,
});
</script>

<style scoped>

</style>
