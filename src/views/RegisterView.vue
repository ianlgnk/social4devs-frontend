<template>
    <n-layout class="container">
        <n-space vertical justify="center" align="center">
            <n-card segmented size="small">
                <template #cover>
                    <n-space justify="center">
                        <n-image
                            :src="require('@/assets/logo_large.png')"
                            preview-disabled
                        />
                    </n-space>
                </template>
                <n-scrollbar trigger="none" style="max-height: 400px;">
                    <n-form
                        ref="formRef"
                        :model="model"
                        :rules="rules"
                        label-placement="top"
                    >
                        <n-grid x-gap="10">
                            <n-form-item-gi
                                :span="23"
                                path="githubAccount"
                                label="Nome de usuário (GitHub)"
                            >
                                <n-input
                                    v-model:value="model.githubAccount"
                                    placeholder="api.github.com/users/" round clearable
                                    :disabled="isUserDataLoaded"
                                >
                                    <template #prefix>
                                        <n-icon :component="GithubAlt" />
                                    </template>
                                </n-input>
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="11"
                                path="name"
                                label="Nome"
                            >
                                <n-input
                                    v-model:value="model.name"
                                    placeholder="Jhon Doe" round
                                >
                                    <template #prefix>
                                        <n-icon :component="Signature16Filled" />
                                    </template>
                                </n-input>
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="12"
                                path="nickname"
                                label="Apelido"
                            >
                                <n-input
                                    v-model:value="model.nickname"
                                    placeholder="JDoe" round
                                >
                                    <template #prefix>
                                        <n-icon :component="AtSharp" />
                                    </template>
                                </n-input>
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="23"
                                path="bio"
                                label="Biografia"
                            >
                                <n-input
                                    v-model:value="model.bio"
                                    type="textarea" maxlength="255" placeholder="..."
                                    show-count clearable
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="23"
                                path="specialties"
                                label="Especialidades"
                            >
                                <n-dynamic-tags
                                    v-model:value="model.specialties"
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="23"
                                path="email"
                                label="Email"
                            >
                                <n-input
                                    v-model:value="model.email"
                                    :placeholder="emailPlaceholder"
                                    round
                                >
                                    <template #prefix>
                                        <n-icon :component="EmailFilled" />
                                    </template>
                                </n-input>
                            </n-form-item-gi>
                            <n-form-item-gi
                                v-if="isUserDataLoaded"
                                :span="23"
                                path="password"
                                label="Senha"
                            >
                                <n-input
                                    v-model:value="model.password"
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
                <n-space justify="space-between">
                        <n-button
                            strong secondary circle
                            type="warning"
                            @click="onClickTurnBack"
                        >
                            <template #icon>
                                <n-icon :component="ArrowBack" />
                            </template>
                        </n-button>
                        <n-button
                            strong secondary circle
                            type="primary"
                            :loading="isFetching"
                            @click="onClickSearchOrCheck"
                        >
                            <template #icon>
                                <n-icon
                                    :component="
                                        (isUserDataLoaded)
                                        ? MdCheckmarkCircleOutline
                                        : Search
                                    "
                                />
                            </template>
                        </n-button>
                </n-space>
            </n-card>
        </n-space>
    </n-layout>
</template>

<script setup lang="ts">
import GithubAlt from '@vicons/fa/GithubAlt';
import ArrowBack from '@vicons/tabler/ArrowBack';
import Search from '@vicons/ionicons5/Search';
import MdCheckmarkCircleOutline from '@vicons/ionicons4/MdCheckmarkCircleOutline';
import Eye from '@vicons/fa/Eye';
import EyeSlash from '@vicons/fa/EyeSlash';
import AtSharp from '@vicons/ionicons5/AtSharp';
import LockClosed16Filled from '@vicons/fluent/LockClosed16Filled';
import Signature16Filled from '@vicons/fluent/Signature16Filled';
import EmailFilled from '@vicons/material/EmailFilled';
import { useRouter } from 'vue-router';
import { ref, computed, inject } from 'vue';
import {
  FormInst, useMessage,
} from 'naive-ui';
import axios from 'axios';
import { IUser, IUserProvider } from '@/interfaces/interfaces';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com/users',
});

const router = useRouter();
const message = useMessage();
const userProvider: IUserProvider | undefined = inject('userProvider');

const model = ref<IUser>({
  email: '',
  name: '',
  bio: '',
  nickname: '',
  password: '',
  githubAccount: '',
  specialties: [],
});
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
    max: 12,
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
const isFetching = ref(false);
const isUserDataLoaded = ref(false);

const emailPlaceholder = computed(() => `${model.value.nickname}@gmail.com`);

async function createUser() {
  isFetching.value = true;
  const res = await userProvider?.create(model.value);

  if (res?.isSuccessful) {
    router.push({
      name: 'home',
      params: {
        createSuccessful: 'true',
      },
    });
  } else if (res?.feedbackMsg) message.error(res.feedbackMsg);

  setTimeout(() => {
    isFetching.value = false;
  }, 500);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterGithubData(data: any) {
  model.value.bio = data.bio as string;
  model.value.email = data.email || '' as string;
  model.value.githubAccount = data.html_url as string;
  model.value.name = data.name as string;
  model.value.nickname = data.login as string;

  setTimeout(() => {
    isFetching.value = false;
    isUserDataLoaded.value = true;
  }, 500);
}

async function findGithubUser() {
  isFetching.value = true;
  await githubAPI.get(`${model.value.githubAccount}`)
    .then((res) => {
      filterGithubData(res.data);
    }).catch(() => {
      message.error('Usuário não encontrado no GitHub!');
      setTimeout(() => {
        isFetching.value = false;
      }, 500);
    });
}

function onClickTurnBack() {
  router.push('/');
}

function onClickSearchOrCheck() {
  formRef.value?.validate((errors) => {
    if (errors) {
      if (isUserDataLoaded.value) message.warning('Campos obrigatórios vazios!');
      return;
    }
    if (isUserDataLoaded.value) createUser();
    else findGithubUser();
  });
}
</script>

<style lang="scss" scoped>
.n-layout {
    height: 100vh;

    .n-space {
        height: 100%;

        .n-card {
            width: 90vw;
        }
    }
}

.label {
    display: flex;
    align-items: center;
    font-size: 16px;
}
</style>
