<template>
    <n-layout>
        <n-space vertical justify="center" align="center">
            <n-card segmented cover-style="padding: 10px" size="small">
                <template #cover>
                    <n-space justify="center">
                        <n-image
                            :src="require('@/assets/logo_large.png')"
                            preview-disabled
                        />
                    </n-space>
                </template>
                <n-form
                    ref="formRef"
                    :model="model"
                    :rules="rules"
                    :show-label="false"
                >
                    <n-space vertical>
                        <n-form-item path="email">
                            <n-input
                                v-model:value="model.email"
                                placeholder="Email"
                                round clearable
                            >
                                <template #prefix>
                                    <n-icon :component="EmailFilled" />
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item path="password">
                            <n-input
                                v-model:value="model.password"
                                type="password"
                                show-password-on="click"
                                placeholder="********"
                                round clearable
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
                        </n-form-item>
                    </n-space>
                </n-form>
                <n-space vertical align="center">
                        <n-button
                            type="primary" size="small" quaternary
                            :loading="isFetching"
                            @click="onClickLogIn"
                        >
                            <template #icon>
                                <n-icon :component="LogInOutline" />
                            </template>
                            Entrar
                        </n-button>
                        <n-button
                            type="primary" size="small" quaternary
                            @click="onClickRegister"
                        >
                            <template #icon>
                                <n-icon :component="GithubAlt" />
                            </template>
                            Cadastrar com GitHub
                        </n-button>
                </n-space>
            </n-card>
        </n-space>
    </n-layout>
</template>

<script setup lang="ts">
import EmailFilled from '@vicons/material/EmailFilled';
import Eye from '@vicons/fa/Eye';
import EyeSlash from '@vicons/fa/EyeSlash';
import LogInOutline from '@vicons/ionicons5/LogInOutline';
import GithubAlt from '@vicons/fa/GithubAlt';
import LockClosed16Filled from '@vicons/fluent/LockClosed16Filled';
import { useRouter, useRoute } from 'vue-router';
import { ref, inject, onMounted } from 'vue';
import { FormInst, useMessage } from 'naive-ui';
import { ILogIn, IUserProvider } from '@/interfaces/interfaces';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const userProvider: IUserProvider | undefined = inject('userProvider');

const model = ref<ILogIn>({
  email: '',
  password: '',
});
const rules = ref({
  email: {
    key: 'email',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
  password: {
    key: 'password',
    required: true,
    trigger: ['blur', 'input'],
    message: 'Obrigatório',
  },
});
const formRef = ref<FormInst | null>(null);
const isFetching = ref<boolean>(false);

async function logIn() {
  isFetching.value = true;
  const isLoginSuccessful = await userProvider?.logIn(model.value);

  if (isLoginSuccessful) router.push('/feed');
  else message.error('Email e/ou senha inválido(s)!');

  setTimeout(() => {
    isFetching.value = false;
  }, 500);
}

function onClickRegister() {
  router.push('register');
}

function onClickLogIn() {
  formRef.value?.validate((errors) => {
    if (errors) return;
    logIn();
  });
}

onMounted(() => {
  if (route.params.createSuccessful) message.success('Registro concluído! Entre para continuar.');
});
</script>

<style lang="scss" scoped>
.n-layout {
    height: 100vh;
    width: 100vw;

    .n-space {
        height: 100%;

        h1 {
            line-height: 50px;
            margin: 0;
        }

        .n-card {
            width: 90vw;
        }
    }
}
</style>
