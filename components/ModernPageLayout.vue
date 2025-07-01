<template>
  <div class="modern-container">
    <!-- Modern Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <v-icon size="32" :color="iconColor || '#ffd700'">{{ icon || 'mdi-diamond-stone' }}</v-icon>
        </div>
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Modern Content Section -->
    <div class="content-section">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'mdi-diamond-stone'
  },
  iconColor: {
    type: String,
    default: '#ffd700'
  }
})
</script>

<style scoped>
/* Modern Container */
.modern-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 24px;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(54, 90, 118, 0.15);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.header-icon {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0 0 0;
  font-weight: 400;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

/* Dark Mode Support */
.v-theme--dark .modern-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%);
}

.v-theme--dark .content-section {
  background: #1e1e1e !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-container {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .content-section {
    padding: 16px;
  }
}
</style> 