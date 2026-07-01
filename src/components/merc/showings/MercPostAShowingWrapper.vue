<template>
  <!-- Post-a-showing fly-out shell (MER-14). Pins the handle/title/tabs and scrolls only the
       content region below them (see the flex layout in <style>). Hosts two tabs: pick a saved
       listing (MercListingPicker) or fill the form manually (MercNewShowingForm). -->
  <v-card class="merc-sheet merc-post" rounded="t-xl">
    <!-- Header (pinned): drag handle + title + tabs. -->
    <v-sheet color="transparent" class="merc-post__header flex-shrink-0">
      <v-sheet color="surface-variant" rounded="pill" width="40" height="4" class="mx-auto mt-2 mb-1" />

      <v-card-title class="d-flex align-center">
        Post a showing
        <v-spacer />
        <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
      </v-card-title>

      <v-tabs v-model="tab" color="primary" grow class="px-2">
        <v-tab value="listings" prepend-icon="mdi-account-multiple-outline">
          From my listings
        </v-tab>
        <v-tab value="new" prepend-icon="mdi-plus-circle-outline">
          New showing
        </v-tab>
      </v-tabs>
    </v-sheet>

    <!-- Content (scroller): only this region scrolls; the header above stays pinned. -->
    <v-card-text class="merc-post__content">
      <v-window v-model="tab">
        <v-window-item value="listings">
          <merc-listing-picker @select="handleSelect" />
        </v-window-item>

        <v-window-item value="new">
          <merc-new-showing-form ref="formRef" @close="emit('close')" />
        </v-window-item>
      </v-window>
    </v-card-text>

    <!-- Footer (pinned): only on the New-showing tab. Extra bottom padding clears the bottom-nav
         center (+) FAB that overlaps the fly-out. The form owns clear/submit; we just trigger them. -->
    <v-card-actions v-if="tab === 'new'" class="merc-post__footer flex-shrink-0 px-4 pt-2 pb-8 ga-2">
      <v-btn @click="formRef?.clearForm()" variant="text" size="large">
        Clear
      </v-btn>
      <v-btn @click="formRef?.postShowing()" :loading="mercShowingsStore.isPosting" color="secondary" variant="flat" size="large" class="flex-grow-1">
        Post showing
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { nextTick,ref } from 'vue'
import MercListingPicker from '@/components/merc/showings/MercListingPicker.vue'
import MercNewShowingForm from '@/components/merc/showings/MercNewShowingForm.vue'
import { useMercShowingsStore } from '@/stores/mercShowingsStore.js'

const emit = defineEmits(['close'])
const mercShowingsStore = useMercShowingsStore()
const tab = ref('listings')
const formRef = ref(null)

// A saved listing was picked: jump to the New-showing tab first so its window-item (and the form)
// mounts, then hydrate it on the next tick — formRef is null until the form is rendered.
async function handleSelect(client) {
  tab.value = 'new'
  await nextTick()
  formRef.value?.prefill(client)
}
</script>

<style scoped>
/* Flex column filling the fly-out sheet; min-height:0 lets the content region shrink and scroll. */
.merc-post {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
}

/* The only scroller: header above is pinned, this fills the remaining space and scrolls. */
.merc-post__content {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

/* Keep the scrollbar visible on the dark theme so the content reads as scrollable. */
.merc-post__content::-webkit-scrollbar {
  width: 10px;
}

.merc-post__content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.28);
  border-radius: 8px;
}

/* Wider, easier-to-grab track on touch devices. */
@media (pointer: coarse) {
  .merc-post__content::-webkit-scrollbar {
    width: 14px;
  }
}
</style>
