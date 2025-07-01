<template>
  <v-btn
    :color="computedColor"
    :class="[
      'modern-btn',
      `modern-btn--${variant}`,
      { 'modern-btn--elevated': elevated }
    ]"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
    v-bind="$attrs"
  >
    <v-icon v-if="prependIcon" start>{{ prependIcon }}</v-icon>
    <slot />
    <v-icon v-if="appendIcon" end>{{ appendIcon }}</v-icon>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, error, gold
    validator: (value) => ['primary', 'secondary', 'success', 'error', 'gold'].includes(value)
  },
  size: {
    type: String,
    default: 'default'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  elevated: {
    type: Boolean,
    default: true
  },
  prependIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const computedColor = computed(() => {
  if (props.variant === 'primary') return '#365a76'
  if (props.variant === 'gold') return '#ffd700'
  return props.variant
})
</script>

<style scoped>
.modern-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(54, 90, 118, 0.2);
}

.modern-btn--elevated:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(54, 90, 118, 0.3);
}

.modern-btn--primary {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white !important;
}

.modern-btn--secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
  color: white !important;
}

.modern-btn--success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: white !important;
}

.modern-btn--error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
}

.modern-btn--gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%) !important;
  color: #365a76 !important;
}

.modern-btn:disabled {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  transform: none !important;
  box-shadow: none !important;
}
</style> 