<template>
    <n-tabs
        :value="tabValue"
        type="line" size="small"
        justify-content="space-around"
        style="padding: 0 6px"
        animated
        :on-update:value="onTabClick"
    >
        <n-tab-pane name="Info">
            <template #tab>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon :component="Identification" size="22" />
                    </template>
                    Informações
                </n-popover>
            </template>
            <ProfileInfo />
        </n-tab-pane>
        <n-tab-pane name="Postagens">
            <template #tab>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon :component="ReadingList28Regular" size="22" />
                    </template>
                    Postagens
                </n-popover>
            </template>
            <FeedTab isInsideModal />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import ReadingList28Regular from '@vicons/fluent/ReadingList28Regular';
import Identification from '@vicons/carbon/Identification';
import FeedTab from '@/components/FeedTab.vue';
import { ref } from 'vue';
import ProfileInfo from './ProfileInfo.vue';

const tabValue = ref<string | number>('Info');

function onTabClick(value: string | number) {
  tabValue.value = value;
}
</script>
