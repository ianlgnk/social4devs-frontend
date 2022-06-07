<template>
    <n-space vertical align="center">
        <n-button text @click="onClickSearch">
            <template #icon>
                <n-icon :component="Search" />
            </template>
            Buscar
        </n-button>
        <n-button text @click="onClickProfile">
            <template #icon>
                <n-icon :component="UserAvatar" />
            </template>
            Perfil
        </n-button>
        <n-switch :rail-style="railStyle" @update:value="onSwitchTheme" size="">
            <template #checked>
                <n-icon :component="Sun" size="large" />
            </template>
            <template #unchecked>
                <n-icon :component="Moon" size="large" />
            </template>
        </n-switch>

        <SearchModal ref="componentSearchModal" />
        <ProfileModal ref="componentProfileModal" />
    </n-space>
</template>

<script setup lang="ts">
import UserAvatar from '@vicons/carbon/UserAvatar';
import Search from '@vicons/carbon/Search';
import Moon from '@vicons/carbon/Moon';
import Sun from '@vicons/carbon/Sun';
import { CSSProperties, inject, ref } from 'vue';
import { IUserProvider } from '@/interfaces/interfaces';
import SearchModal from './SearchModal.vue';
import ProfileModal from './ProfileModal.vue';

const railStyle = ({
  focused,
  checked,
}: {
        focused: boolean
        checked: boolean
      }) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = '#2080f0';
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040';
    }
  } else {
    style.background = '#d03050';
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040';
    }
  }
  return style;
};
const componentSearchModal = ref<InstanceType<typeof SearchModal> | null>(null);
const componentProfileModal = ref<InstanceType<typeof ProfileModal> | null>(null);

const switchTheme = inject('switchTheme');
const userProvider:IUserProvider | undefined = inject('userProvider');

function onSwitchTheme() {
  switchTheme();
}

function onClickSearch() {
  componentSearchModal.value?.open();
}

function onClickProfile() {
  componentProfileModal.value?.open(userProvider?.user.email || '');
}
</script>

<style scoped>

</style>
