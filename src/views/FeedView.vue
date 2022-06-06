<template>
    <n-layout>
        {{ userProvider?.user }}
    </n-layout>
</template>

<script setup lang="ts">
import { IUserProvider } from '@/interfaces/interfaces';
import { inject } from 'vue';

const userProvider: IUserProvider | undefined = inject('userProvider');
</script>

<style scoped>

</style>
