<template>
    <n-card
        content-style="padding: 10px 15px 10px 15px"
        :style="(!props.isInsideModal)
            ? 'width: calc(100vw - 31px)'
            : 'width: calc(100vw - 120px)'
        "
    >
        <n-grid>
            <n-gi :span="24">
                <n-space justify="space-between">
                    <n-space align="center" style="max-height: 100%">
                        <n-avatar
                            round
                            :size="48"
                            :src="require('@/assets/avatar_default.jpg')"
                        />
                        <div>
                            {{ props.post.name }}
                            <br />
                            <n-button text type="info" @click="onClickNickname">
                                @{{ props.post.nickname }}
                            </n-button>
                        </div>
                    </n-space>
                    <n-popconfirm
                        v-if="(isUserPostOwner)"
                        @positive-click="onClickTrash"
                        positive-text="Confirmar"
                        negative-text="Cancelar"
                    >
                        <template #trigger>
                            <n-button type="error" text>
                                <n-icon :component="TrashCan" />
                            </n-button>
                        </template>
                        Deseja excluir seu post?
                    </n-popconfirm>
                </n-space>
            </n-gi>
            <n-gi :span="24">
                <span style="text-align: justify; word-wrap: break-word;">
                    {{ props.post.content }}
                </span>
            </n-gi>
        </n-grid>
        <n-divider style="margin-top: 10px; margin-bottom: 10px" dashed />
        <n-space justify="space-between" align="center">
            <n-space>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button
                            type="error" size="small" circle secondary

                            @click="onClickLike(props.post)"
                        >
                            <n-icon
                                :component="(props.post.liked === '0')
                                    ? IosHeart
                                    : IosHeartDislike
                                "
                            />
                        </n-button>
                    </template>
                    {{ props.post.totalLikes }} curtida(s).
                    {{ (props.post.liked === '1') ? 'Curtido por você.' : ''}}
                </n-popover>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button
                            type="warning" secondary circle size="small"
                            @click="onClickComment(props.post)"
                        >
                            <n-icon :component="Messages" />
                        </n-button>
                    </template>
                    {{ props.post.commentaries.length }} comentário(s).
                </n-popover>
            </n-space>
            <span style="font-size: 12px">
                {{ formatDate(props.post.createdAt) }}
            </span>
        </n-space>

        <CommentsModal ref="componentCommentsModal" />
        <ProfileModal ref="componentProfileModal" />
    </n-card>
</template>

<script setup lang="ts">
import IosHeart from '@vicons/ionicons4/IosHeart';
import IosHeartDislike from '@vicons/ionicons4/IosHeartDislike';
import Messages from '@vicons/tabler/Messages';
import TrashCan from '@vicons/carbon/TrashCan';
import {
  ref, PropType, inject, defineProps, computed, defineEmits,
} from 'vue';
import { IPost, IUserProvider } from '@/interfaces/interfaces';
import { useMessage } from 'naive-ui';
import CommentsModal from './CommentsModal.vue';
import ProfileModal from './ProfileModal.vue';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();

const componentCommentsModal = ref<InstanceType<typeof CommentsModal> | null>(null);
const componentProfileModal = ref<InstanceType<typeof ProfileModal> | null>(null);
const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true,
  },
  isInsideModal: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});
const isUserPostOwner = computed(() => {
  if (props.post.email === userProvider?.user.email) return true;
  return false;
});
const emit = defineEmits({
  onDeletePost() {
    return true;
  },
});

function onClickNickname() {
  componentProfileModal.value?.open();
}

/* eslint-disable no-param-reassign */
async function onClickLike(post: IPost) {
  if (post.liked === '0') {
    await userProvider?.createLike(post.content, post.email);
    post.liked = '1';
    post.totalLikes = String(Number(post.totalLikes) + 1);
  } else {
    await userProvider?.deleteLike(post.content, post.email);
    post.liked = '0';
    post.totalLikes = String(Number(post.totalLikes) - 1);
  }
}

function onClickComment(post: IPost) {
  componentCommentsModal.value?.open(post);
}

function formatDate(data: string) {
  const dataAsDate = new Date(data);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return dataAsDate.toLocaleDateString('pt-Br', options);
}

async function onClickTrash() {
  const res = await userProvider?.deletePost(props.post.content);

  if (res) message.success('Post excluído com sucesso.');
  else message.error('Não foi possível apagar o post.');

  emit('onDeletePost');
}
</script>

<style scoped>
.feed-item {
    width: calc(100vw - 31px);
}

.modal-feed-item {
    width: 100px;
}

</style>
