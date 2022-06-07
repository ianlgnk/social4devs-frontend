<template>
    <n-tabs
        :value="tabValue"
        type="line" size="small"
        justify-content="space-around"
        style="padding: 0 6px"
        animated
        :on-update:value="onTabClick"
    >
        <n-tab-pane name="Feed">
            <template #tab>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon :component="ReadingList28Regular" size="22" />
                    </template>
                    Feed
                </n-popover>
            </template>
            <FeedTab />
        </n-tab-pane>
        <n-tab-pane name="Menu">
            <template #tab>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-icon :component="Apps" size="16" />
                    </template>
                    Menu
                </n-popover>
            </template>
            <MenuTab />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import ReadingList28Regular from '@vicons/fluent/ReadingList28Regular';
import Apps from '@vicons/carbon/Apps';
import FeedTab from '@/components/FeedTab.vue';
import MenuTab from '@/components/MenuTab.vue';
import { ref } from 'vue';

const tabValue = ref<string | number>('Feed');

function onTabClick(value: string | number) {
  tabValue.value = value;
}
</script>

<style scoped>

</style>
