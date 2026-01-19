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
  <div class="video-background">
    <!-- Video Background -->
    <video
      ref="videoRef"
      autoplay
      loop
      muted
      playsinline
      disablePictureInPicture
    >
      <source src="~/assets/video/background.mp4" type="video/mp4">
    </video>
    
    <!-- Dark overlay for better readability -->
    <div class="overlay bg-charcoal/70" />
    
    <!-- Subtle vignette effect -->
    <div 
      class="overlay"
      style="background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%);"
    />
    
    <!-- Optional grim color tint -->
    <div class="overlay bg-gradient-to-b from-charcoal/30 via-transparent to-crimson/10" />
  </div>
</template>

<style scoped>
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.video-background video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  filter: grayscale(0.3) contrast(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
