<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, instance, info) => {
  console.error('An error was captured globally in app.vue:', err)
  console.error('Vue instance:', instance)
  console.error('Error info:', info)
  // Return false to prevent the error from propagating further
  return false
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Global Dark Mode Support for All Dialogs */
.v-theme--dark .v-dialog .v-card {
  background: #1e1e1e !important;
}

.v-theme--dark .v-dialog .v-card-text {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-dialog .v-card-actions {
  background: #2a2a2a !important;
}

.v-theme--dark .v-dialog .v-card-title {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white !important;
}

/* ConfirmDialog Dark Mode */
.v-theme--dark .v-dialog .confirm-dialog {
  background: #1e1e1e !important;
}

.v-theme--dark .v-dialog .confirm-dialog .v-card-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Form Fields in Dark Mode */
.v-theme--dark .v-text-field input {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-text-field .v-field__outline {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark .v-text-field:not(.v-field--error) .v-field--focused .v-field__outline {
  border-color: #365a76 !important;
}

.v-theme--dark .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .v-text-field .v-field__input {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>
