<template>
    <n-space vertical>
        <n-scrollbar trigger="none" style="max-height: 30vh">
            <n-form
                ref="formRef"
                :model="user"
                :rules="rules"
                label-placement="top"
            >
                <n-grid x-gap="10">
                    <n-form-item-gi
                        :span="22"
                        path="githubAccount"
                        label="Link (GitHub)"
                    >
                        <n-input
                            v-model:value="user.githubAccount" disabled
                            :placeholder="githubPlaceholder" round clearable
                        >
                            <template #prefix>
                                <n-icon :component="GithubAlt" />
                            </template>
                        </n-input>
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="11"
                        path="name"
                        label="Nome"
                    >
                        <n-input
                            v-model:value="user.name"
                            placeholder="Jhon Doe" round
                            :disabled="(!isLoggedUserProfile)"
                        >
                            <template #prefix>
                                <n-icon :component="Signature16Filled" />
                            </template>
                        </n-input>
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="11"
                        path="nickname"
                        label="Apelido"
                    >
                        <n-input
                            v-model:value="user.nickname"
                            placeholder="JDoe" round
                            :disabled="(!isLoggedUserProfile)"
                        >
                            <template #prefix>
                                <n-icon :component="AtSharp" />
                            </template>
                        </n-input>
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="22"
                        path="bio"
                        label="Biografia"
                    >
                        <n-input
                            v-model:value="user.bio"
                            type="textarea" maxlength="255" placeholder="..."
                            show-count clearable :disabled="(!isLoggedUserProfile)"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="22"
                        path="specialties"
                        label="Especialidades"
                    >
                        <n-dynamic-tags
                            v-model:value="user.specialties"
                            :disabled="(!isLoggedUserProfile)"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="22"
                        path="email"
                        label="Email"
                    >
                        <n-input
                            v-model:value="user.email"
                            :placeholder="emailPlaceholder"
                            round disabled
                        >
                            <template #prefix>
                                <n-icon :component="EmailFilled" />
                            </template>
                        </n-input>
                    </n-form-item-gi>
                    <n-form-item-gi
                        v-if="(isLoggedUserProfile)"
                        :span="22"
                        path="password"
                        label="Senha"
                    >
                        <n-input
                            v-model:value="user.password"
                            type="password"
                            show-password-on="click"
                            placeholder="********"
                            round
                        >
                            <template #prefix>
                                <n-icon :component="LockClosed16Filled" />
                            </template>
                            <template #password-visible-icon>
                                <n-icon :size="16" :component="Eye" />
                            </template>
                            <template #password-invisible-icon>
                                <n-icon :size="16" :component="EyeSlash" />
                            </template>
                        </n-input>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
        </n-scrollbar>
        <n-divider dashed />
        <n-space justify="space-between">
                <n-button
                    v-if="(isLoggedUserProfile)"
                    strong secondary circle
                    type="error" @click="onClickTrash"
                >
                    <template #icon>
                        <n-icon :component="TrashCan" />
                    </template>
                </n-button>
                <n-button
                    v-if="(isLoggedUserProfile)"
                    strong secondary circle
                    type="primary" @click="onClickEdit"
                >
                    <template #icon>
                        <n-icon :component="Edit" />
                    </template>
                </n-button>
        </n-space>
    </n-space>
</template>

<script setup lang="ts">
import GithubAlt from '@vicons/fa/GithubAlt';
import Eye from '@vicons/fa/Eye';
import EyeSlash from '@vicons/fa/EyeSlash';
import AtSharp from '@vicons/ionicons5/AtSharp';
import LockClosed16Filled from '@vicons/fluent/LockClosed16Filled';
import Signature16Filled from '@vicons/fluent/Signature16Filled';
import EmailFilled from '@vicons/material/EmailFilled';
import Edit from '@vicons/carbon/Edit';
import TrashCan from '@vicons/carbon/TrashCan';
import {
  ref, computed, inject,
} from 'vue';
import { IUser, IUserProvider } from '@/interfaces/interfaces';
import { useMessage, FormInst, useDialog } from 'naive-ui';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();
const dialog = useDialog();
const userProvider:IUserProvider | undefined = inject('userProvider');
const user:IUser | undefined = inject('profileUser');
const isLoggedUserProfile = inject('isLoggedUserProfile');

const rules = ref({
  email: {
    key: 'email',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
  name: {
    key: 'name',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
  nickname: {
    key: 'nickname',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
  password: {
    key: 'password',
    required: true,
    trigger: ['blur', 'input'],
    min: 6,
    message: 'Mínimo de 6 caracteres',
  },
  githubAccount: {
    key: 'githubAccount',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
});
const formRef = ref<FormInst | null>(null);
const emailPlaceholder = computed(() => 'nickname@gmail.com');
const githubPlaceholder = computed(() => 'github.com/nickname');

async function editUser() {
  const res = await userProvider?.editUser(user || {} as IUser);

  if (res?.isSuccessful) message.success('Informações editadas com sucesso.');
  else if (res?.feedbackMsg) message.error(res.feedbackMsg);
}

function onClickEdit() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.warning('Campos obrigatórios vazios!');
      return;
    }
    editUser();
  });
}

function onClickTrash() {
  dialog.error({
    title: 'Confirmação',
    content: 'Desejar excluir sua conta permanentemente?',
    positiveText: 'Sim',
    negativeText: 'Não',
    onPositiveClick: () => {
      userProvider?.deleteUser();
      router.push('/');
    },
  });
}
</script>

<style scoped>
.n-divider {
    margin-top: 0;
    margin-bottom: 0;
}
</style>
