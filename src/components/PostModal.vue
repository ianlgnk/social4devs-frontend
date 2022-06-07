<template>
    <n-modal
        v-model:show="isVisible"
        preset="dialog"
    >
        <template #icon>
            <n-icon :component="AddAlt" color="#70c0e8" />
        </template>
        <n-input
            v-model:value="description"
            show-count clearable type="textarea"
            maxlength="255" style="margin-bottom: 10px" placeholder="Descrição"
        />
        <n-space justify="space-between">
            <n-button
                ghost type="error" @click="close"
                size="small"
            >
                Cancelar
            </n-button>
            <n-button
                ghost type="success" @click="onClickConfirm"
                :disabled="isDescriptionEmpty" size="small"
            >
                Confirmar
            </n-button>
        </n-space>
    </n-modal>
</template>

<script setup lang="ts">
import AddAlt from '@vicons/carbon/AddAlt';
import {
  ref, defineExpose, computed, inject, defineEmits,
} from 'vue';
import { IUserProvider } from '@/interfaces/interfaces';
import { useMessage } from 'naive-ui';

const userProvider:IUserProvider | undefined = inject('userProvider');
const message = useMessage();

const isVisible = ref(false);
const description = ref('');
const isDescriptionEmpty = computed(() => ((description.value.length === 0)));
const emit = defineEmits({
  onCreatePost() {
    return true;
  },
});

function open() {
  isVisible.value = true;
  description.value = '';
}

function close() {
  isVisible.value = false;
}

async function onClickConfirm() {
  const res = await userProvider?.createPost(description.value);

  if (res) {
    message.success('Post criado com sucesso!');
    emit('onCreatePost');
  } else message.error('Houve algum erro ao criar o seu post...');

  close();
}

defineExpose({
  open,
});
</script>

<style scoped>

</style>
