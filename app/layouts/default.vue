<script setup lang="ts">
// Default layout with ASCII background
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Animated ASCII Background -->
    <UiAsciiBackground />

    <!-- Main Content -->
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>
