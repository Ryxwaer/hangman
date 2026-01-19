<script setup lang="ts">
// Video background component - plays seamlessly in a loop
const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  // Ensure video plays on mount
  if (videoRef.value) {
    videoRef.value.play().catch(() => {
      // Autoplay may be blocked, that's okay
    })
  }
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Video Background -->
    <video
      ref="videoRef"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      loop
      muted
      playsinline
      disablePictureInPicture
    >
      <source src="~/assets/video/background.mp4" type="video/mp4">
    </video>
    
    <!-- Dark overlay for better readability -->
    <div class="absolute inset-0 bg-charcoal/70" />
    
    <!-- Subtle vignette effect -->
    <div 
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%);"
    />
    
    <!-- Optional grim color tint -->
    <div class="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-crimson/10" />
  </div>
</template>

<style scoped>
video {
  filter: grayscale(0.3) contrast(1.1);
}
</style>
