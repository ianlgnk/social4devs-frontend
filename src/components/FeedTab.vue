<template>
    <n-scrollbar
      :trigger="(posts?.length === 0) ? 'hover' : 'none'"
      :style="(!props.isInsideModal)
        ? 'max-height: calc(100vh - 120px)'
        : 'max-height: calc(100vh - 260px)'
      "
    >
        <n-space v-if="(!props.isInsideModal)" justify="center">
            <n-button text type="info" @click="onClickAddPost">
                <n-icon :component="AddAlt" :size="20" style="margin-right: 4px" />
                Post
            </n-button>
        </n-space>
        <n-space
            vertical align="center"
            :style="(posts?.length !== 0)
                ? 'padding-right: 18px; padding-bottom: 6px;'
                : ''
            "
        >
            <FeedItem
                v-for="item in posts"
                :key="item.createdAt"
                :post="item"
                :isInsideModal="props.isInsideModal"
                @onDeletePost="fetchPosts"
            />
            <n-empty v-if="(posts?.length === 0)" description="Nenhuma postagem encontrada... 😥">
                <template v-if="(!props.isInsideModal)" #extra>
                    <n-button type="info" size="small" text @click="onClickFindUser">
                        <template #icon>
                            <n-icon :component="UserFollow" />
                        </template>
                        Encontrar usuários
                    </n-button>
                </template>
            </n-empty>
        </n-space>

        <PostModal ref="componentPostModal" @onCreatePost="fetchPosts" />
        <SearchModal ref="componentSearchModal" />
    </n-scrollbar>
</template>

<script setup lang="ts">
import UserFollow from '@vicons/carbon/UserFollow';
import AddAlt from '@vicons/carbon/AddAlt';
import PostModal from '@/components/PostModal.vue';
import {
  ref, inject, onMounted, defineProps,
} from 'vue';
import { IPost, IUserProvider, IUser } from '@/interfaces/interfaces';
import SearchModal from '@/components/SearchModal.vue';
import FeedItem from './FeedItem.vue';

const userProvider:IUserProvider | undefined = inject('userProvider');

const componentPostModal = ref<InstanceType<typeof PostModal> | null>(null);
const componentSearchModal = ref<InstanceType<typeof SearchModal> | null>(null);
const posts = ref<Array<IPost> | undefined>([]);
const props = defineProps({
  isInsideModal: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});
const user:IUser | undefined = inject('profileUser');

function onClickAddPost() {
  componentPostModal.value?.open();
}

function onClickFindUser() {
  componentSearchModal.value?.open();
}

async function fetchPosts() {
  if (props.isInsideModal) {
    posts.value = await userProvider?.listPostsByUser(user?.email || '');
  } else posts.value = await userProvider?.fetchPosts();
}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>

</style>
