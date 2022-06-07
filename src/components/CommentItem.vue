<template>
    <n-space vertical :size="[0, 0]" style="padding-right: 14px">
        <n-space align="center" style="max-height: 100%;">
            <n-avatar
                round
                size="small"
                :src="require('@/assets/avatar_default.jpg')"
            />
            <div>
                <n-button text type="info" @click="onClickNickname">
                    @{{ props.comment.nickname }}
                </n-button>
            </div>
        </n-space>
        <span style="text-align: justify; line-height: 12px;">
            {{ props.comment.commentary }}
        </span>
        <n-divider dashed style="margin-top: 10px; margin-bottom: 10px;" />

        <ProfileModal ref="componentProfileModal" />
    </n-space>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue';
import { IComment } from '@/interfaces/interfaces';
import ProfileModal from './ProfileModal.vue';

const props = defineProps({
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
});
const componentProfileModal = ref<InstanceType<typeof ProfileModal> | null>(null);

function onClickNickname() {
  componentProfileModal.value?.open();
}
</script>

<style scoped>

</style>
