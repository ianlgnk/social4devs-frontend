<template>
    <n-space vertical :size="[0, 0]" style="padding-right: 14px">
        <n-space align="center" style="max-height: 100%;">
            <n-avatar
                round
                size="small"
                :src="require('@/assets/avatar_default.jpg')"
            />
            <div>
                {{ props.user.name }} <br />
                <n-button text type="info" @click="onClickNickname">
                    @{{ props.user.nickname }}
                </n-button>
            </div>
        </n-space>
        <n-divider dashed style="margin-top: 5px; margin-bottom: 5px;" />

        <ProfileModal ref="componentProfileModal" />
    </n-space>
</template>

<script setup lang="ts">
import { IUser } from '@/interfaces/interfaces';
import { defineProps, PropType, ref } from 'vue';
import ProfileModal from './ProfileModal.vue';

const props = defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true,
  },
});
const componentProfileModal = ref<InstanceType<typeof ProfileModal> | null>(null);

function onClickNickname() {
  componentProfileModal.value?.open(props.user.email);
}
</script>

<style scoped>

</style>
