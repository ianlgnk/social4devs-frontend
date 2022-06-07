<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
    >
        <template #icon>
            <span style="color: #70c0e8">Buscar</span>
        </template>
        <n-scrollbar trigger="none" style="height: 290px; margin-bottom: 5px">
            <SearchItem
                v-for="item in usersFound"
                :key="item.email"
                :user="item"
            />
            <div
                v-if="(usersFound.length === 0)"
                style="display: flex; align-items: center; justify-content: center; height: 290px"
            >
                <n-empty description="Nenhuma usuário encontrado... 😥" />
            </div>
        </n-scrollbar>
        <n-input-group>
            <n-input
                v-model:value="filter"
                round placeholder="Nome ou apelido"
            />
            <n-button
                type="primary" circle
                :disabled="isFilterEmpty"
                @click="onClickSearch"
            >
                <n-icon :component="Search" />
            </n-button>
        </n-input-group>
    </n-modal>
</template>

<script setup lang="ts">
import {
  ref, defineExpose, computed, inject,
} from 'vue';
import Search from '@vicons/carbon/Search';
import { IUser, IUserProvider } from '@/interfaces/interfaces';
import SearchItem from '@/components/SearchItem.vue';
import { useMessage } from 'naive-ui';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();

const isVisible = ref(false);
const filter = ref('');
const usersFound = ref<Array<IUser>>([]);
const isFilterEmpty = computed(() => (filter.value.length === 0));

function open() {
  isVisible.value = true;
  filter.value = '';
  usersFound.value = [];
}

async function onClickSearch() {
  usersFound.value = await userProvider?.searchUser(filter.value) || [];

  if (usersFound.value.length === 0) message.warning('Nenhum usuário encontrado...');
  else message.success(`Encontramos ${usersFound.value.length} usuário(s).`);
}

defineExpose({
  open,
});
</script>

<style scoped>

</style>
