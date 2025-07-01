<template>
  <div class="auth-layout">
    <!-- Background Elements -->
    <div class="background-overlay"></div>
    <div class="background-pattern"></div>
    
    <!-- Floating Gold Elements -->
    <div class="gold-elements">
      <div class="gold-element gold-element-1">
        <v-icon size="24" color="gold">mdi-diamond-stone</v-icon>
      </div>
      <div class="gold-element gold-element-2">
        <v-icon size="20" color="gold">mdi-gold</v-icon>
      </div>
      <div class="gold-element gold-element-3">
        <v-icon size="16" color="gold">mdi-circle</v-icon>
      </div>
      <div class="gold-element gold-element-4">
        <v-icon size="28" color="gold">mdi-hexagon</v-icon>
      </div>
      <div class="gold-element gold-element-5">
        <v-icon size="18" color="gold">mdi-triangle</v-icon>
      </div>
      <div class="gold-element gold-element-6">
        <v-icon size="22" color="gold">mdi-star</v-icon>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="auth-container">
      <!-- Brand Header -->
      <div class="brand-header">
        <div class="brand-logo">
          <div class="logo-container">
            <div class="logo-main">
              <div class="logo-d">D</div>
              <div class="logo-icon">
                <v-icon size="32" color="gold">mdi-diamond-stone</v-icon>
              </div>
            </div>
            <div class="logo-text-overlay">ALAVONG</div>
          </div>
          <div class="logo-rays"></div>
        </div>
        
        <h1 class="brand-name">Dalavong Jewelry</h1>
        
        <!-- Decorative Elements -->
        <div class="decorative-line">
          <div class="line-element"></div>
          <v-icon size="16" color="gold">mdi-diamond-stone</v-icon>
          <div class="line-element"></div>
        </div>
      </div>

      <!-- Content Card -->
      <div class="auth-card">
        <div class="card-glow"></div>
        <slot />
      </div>

      <!-- Footer Information -->
      <div class="auth-footer">
        <div class="footer-features">
          <div class="feature-item">
            <v-icon size="20" color="gold">mdi-shield-check</v-icon>
            <span>ຄວາມປອດໄພສູງ</span>
          </div>
          <div class="feature-item">
            <v-icon size="20" color="gold">mdi-cloud-check</v-icon>
            <span>ເກັບຂໍ້ມູນໃນ Cloud</span>
          </div>
          <div class="feature-item">
            <v-icon size="20" color="gold">mdi-clock-fast</v-icon>
            <span>ໃຊ້ງານງ່າຍ ໄວ</span>
          </div>
        </div>
        
        <div class="footer-text">
          <p>© 2025 Dalavong Jewelry Management System</p>
          <p>ພັດທະນາດ້ວຍ ❤️ ສຳລັບວິສາຫະກິດທອງ</p>
        </div>
      </div>
    </div>

    <!-- Animated Background Shapes -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
      <div class="shape shape-5"></div>
    </div>
  </div>
</template>

<script setup>
// Auth layout - Elegant wrapper for authentication pages
</script>

<style scoped>
/* Global Variables */
:root {
  --primary-color: #365a76;
  --primary-dark: #2c4960;
  --primary-light: #4a6b84;
  --gold-color: #ffd700;
  --gold-light: #ffef94;
  --gold-dark: #b8860b;
  --background-main: #1a2332;
  --background-secondary: #365a76;
  --surface-color: #ffffff;
  --surface-glass: rgba(255, 255, 255, 0.1);
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --text-light: rgba(255, 255, 255, 0.9);
  --shadow-soft: 0 4px 20px rgba(54, 90, 118, 0.1);
  --shadow-medium: 0 8px 32px rgba(54, 90, 118, 0.15);
  --shadow-gold: 0 4px 20px rgba(255, 215, 0, 0.3);
  --radius-medium: 16px;
  --radius-small: 8px;
  --radius-large: 24px;
}

/* Main Layout */
.auth-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--background-secondary) 50%, var(--primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans Lao', sans-serif;
}

/* Background Overlay */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(54, 90, 118, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
}

/* Background Pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="25" cy="25" r="1" fill="rgba(255,215,0,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern)"/></svg>');
  opacity: 0.3;
}

/* Floating Gold Elements */
.gold-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.gold-element {
  position: absolute;
  animation: float 6s ease-in-out infinite;
  opacity: 0.7;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
}

.gold-element-1 {
  top: 15%;
  left: 10%;
  animation-delay: -0.5s;
}

.gold-element-2 {
  top: 25%;
  right: 15%;
  animation-delay: -2s;
}

.gold-element-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: -3s;
}

.gold-element-4 {
  top: 60%;
  right: 25%;
  animation-delay: -1.5s;
}

.gold-element-5 {
  bottom: 15%;
  right: 10%;
  animation-delay: -4s;
}

.gold-element-6 {
  top: 40%;
  left: 5%;
  animation-delay: -2.5s;
}

/* Main Container */
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  width: 90%;
  padding: 60px 40px;
  position: relative;
  z-index: 10;
}

/* Brand Header */
.brand-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.brand-logo {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.logo-container {
  width: 120px;
  height: 80px;
  position: relative;
  z-index: 2;
}

.logo-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  padding: 16px 20px;
  border-radius: 20px;
  box-shadow: 
    var(--shadow-medium),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  animation: pulse-glow 3s ease-in-out infinite;
}

.logo-d {
  font-size: 32px;
  font-weight: 900;
  color: var(--gold-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', serif;
}

.logo-icon {
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5));
}

.logo-text-overlay {
  position: absolute;
  bottom: -8px;
  right: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gold-color);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.logo-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: 
    conic-gradient(from 0deg, transparent 0deg, rgba(255, 215, 0, 0.2) 45deg, transparent 90deg),
    conic-gradient(from 90deg, transparent 0deg, rgba(255, 215, 0, 0.1) 45deg, transparent 90deg);
  border-radius: 50%;
  animation: rotate 8s linear infinite;
  z-index: 1;
}

.brand-name {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-light);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, var(--gold-color) 0%, var(--gold-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}



.decorative-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.line-element {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-color) 50%, transparent 100%);
}

/* Auth Card */
.auth-card {
  width: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-large);
  padding: 50px;
  box-shadow: 
    var(--shadow-medium),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  min-height: 400px;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: 
    radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  animation: glow-rotate 8s linear infinite;
  pointer-events: none;
}

/* Auth Footer */
.auth-footer {
  margin-top: 40px;
  text-align: center;
}

.footer-features {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-light);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-small);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  line-height: 1.6;
}

.footer-text p {
  margin: 4px 0;
}

/* Animated Background Shapes */
.bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(54, 90, 118, 0.1) 100%);
  animation: float-shape 15s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: -75px;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 10%;
  animation-delay: -10s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  bottom: -125px;
  right: -125px;
  animation-delay: -3s;
}

.shape-5 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: -40px;
  animation-delay: -8s;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 
      var(--shadow-gold),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 
      0 4px 30px rgba(255, 215, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes glow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float-shape {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.1);
    opacity: 0.5;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    padding: 20px 16px;
    max-width: 360px;
  }
  
  .auth-card {
    padding: 24px;
  }
  
  .brand-name {
    font-size: 28px;
  }
  
  .brand-tagline {
    font-size: 14px;
  }
  
  .footer-features {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  
  .gold-element {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 16px 12px;
  }
  
  .auth-card {
    padding: 20px;
  }
  
  .brand-name {
    font-size: 24px;
  }
  
  .logo-circle {
    width: 60px;
    height: 60px;
  }
  
  .logo-rays {
    width: 90px;
    height: 90px;
  }
}

/* Special Effects */
.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-color) 50%, transparent 100%);
}

.auth-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-color) 50%, transparent 100%);
}

/* Focus States */
.auth-card :deep(.v-field--focused .v-field__outline) {
  border-color: var(--primary-color) !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 2px rgba(54, 90, 118, 0.2) !important;
}

.auth-card :deep(.v-btn) {
  border-radius: var(--radius-small) !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
}

.auth-card :deep(.v-btn--variant-elevated) {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%) !important;
  color: white !important;
  box-shadow: var(--shadow-soft) !important;
}

.auth-card :deep(.v-btn--variant-elevated:hover) {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-medium) !important;
}
</style> 