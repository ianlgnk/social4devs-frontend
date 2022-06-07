<template>
    <n-layout>
        <n-layout-header bordered style="padding: 10px 20px">
            <NavBar />
        </n-layout-header>
        <SectionTabs />
    </n-layout>
</template>

<script setup lang="ts">
import { IUserProvider } from '@/interfaces/interfaces';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import SectionTabs from '@/components/SectionTabs.vue';

const router = useRouter();
const userProvider: IUserProvider | undefined = inject('userProvider');
</script>

<style scoped>
.n-layout {
    height: 100vh;
}
</style>
