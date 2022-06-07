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
import {
  defineProps, PropType, ref, computed, inject,
} from 'vue';
import { IComment, IUserProvider } from '@/interfaces/interfaces';
import TrashCan from '@vicons/carbon/TrashCan';
import { useMessage } from 'naive-ui';
import ProfileModal from './ProfileModal.vue';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
const componentProfileModal = ref<InstanceType<typeof ProfileModal> | null>(null);
const isUserCommentOwner = computed(() => {
  if (props.comment.user_email === userProvider?.user.email) return true;
  return false;
});

function onClickNickname() {
  componentProfileModal.value?.open();
}
</script>

<style scoped>

</style>
