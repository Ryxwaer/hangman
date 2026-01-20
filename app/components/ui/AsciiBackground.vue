<script setup lang="ts">
// Video background component - plays seamlessly in a loop
const videoRef = ref<HTMLVideoElement | null>(null)
const isVideoReady = ref(false)

function onVideoReady() {
  isVideoReady.value = true
}

onMounted(() => {
  if (videoRef.value) {
    // If video is already loaded (cached), show immediately
    if (videoRef.value.readyState >= 2) {
      isVideoReady.value = true
    }
    
    videoRef.value.play().catch(() => {
      // Autoplay may be blocked, that's okay
    })
  }
})
</script>

<template>
  <div class="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none -z-10 isolate bg-background">
    <!-- Video Background -->
    <video
      ref="videoRef"
      class="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 grayscale-[0.3] contrast-110 invisible opacity-0 transition-opacity duration-300 ease-out"
      :class="{ 'visible opacity-100': isVideoReady }"
      autoplay
      loop
      muted
      playsinline
      disablePictureInPicture
      disableRemotePlayback
      :controls="false"
      @loadeddata="onVideoReady"
      @canplay="onVideoReady"
    >
      <source src="~/assets/video/background.mp4" type="video/mp4">
    </video>
    
    <!-- Dark overlay for better readability -->
    <div class="absolute inset-0 bg-background/70" />
    
    <!-- Subtle vignette effect -->
    <div 
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%);"
    />
    
    <!-- Optional grim color tint -->
    <div class="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-danger/10" />
  </div>
</template>
