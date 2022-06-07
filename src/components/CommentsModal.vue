<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
    >
        <template #icon>
            <n-icon :component="Messages" color="#f2c97d" />
        </template>
        <n-scrollbar trigger="none" style="height: 290px; margin-bottom: 5px">
            <CommentItem
                v-for="item in post.commentaries"
                :key="item.createdAt"
                :comment="item"
            />
            <div
                v-if="(post.commentaries.length === 0)"
                style="display: flex; align-items: center; justify-content: center; height: 290px"
            >
                <n-empty description="Nenhuma comentário encontrado... 😥" />
            </div>
        </n-scrollbar>
        <n-input-group>
            <n-input
                v-model:value="comment"
                round placeholder="Seu comentário..."
            />
            <n-button
                type="primary" circle
                :disabled="isCommentEmpty" @click="onClickAddComment"
            >
                <n-icon :component="Add16Filled" />
            </n-button>
        </n-input-group>
    </n-modal>
</template>

<script setup lang="ts">
import Messages from '@vicons/tabler/Messages';
import Add16Filled from '@vicons/fluent/Add16Filled';
import {
  ref, defineExpose, computed, inject,
} from 'vue';
import { IUserProvider, IPost } from '@/interfaces/interfaces';
import { useMessage } from 'naive-ui';
import CommentItem from './CommentItem.vue';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();

const isVisible = ref(false);
const comment = ref('');
const post = ref<IPost>({} as IPost);
const isCommentEmpty = computed(() => comment.value.length === 0);

async function open(postArg: IPost) {
  post.value = postArg;
  isVisible.value = true;
  comment.value = '';
}

async function onClickAddComment() {
  const res = await userProvider?.createComment(comment.value, post.value.content);

  if (res === false) message.error('Houve algum erro ao adicionar seu comentário.');
  else {
    message.success('Comentário adicionado com sucesso.');
    if (typeof res !== 'boolean' && res) post.value.commentaries.unshift(res);
  }

  comment.value = '';
}

defineExpose({
  open,
});
</script>
