<template>
  <v-app>
    <!-- Top Navigation Bar -->
    <v-app-bar app elevation="0" class="top-nav-bar">
      <div class="nav-container">
        <div class="logo-section" @click="$router.push('/home')" style="cursor: pointer;">
          <div class="logo-icon">
            <v-icon size="32" color="gold">mdi-diamond-stone</v-icon>
          </div>
          <div class="logo-text">
            <h1 class="brand-title">Dalavong Jewelry</h1>
            <p class="brand-subtitle">ລະບົບຈັດການຮ້ານທອງ</p>
          </div>
        </div>
        
        <v-spacer />
        
        <div class="nav-actions">
          <v-btn
            icon
            variant="text"
            class="nav-icon-btn"
            @click="toggleTheme"
            :title="isDark ? 'ປ່ຽນເປັນໂທນສະຫວ່າງ' : 'ປ່ຽນເປັນໂທນມືດ'"
          >
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
          
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn
                icon
                variant="text"
                class="nav-icon-btn"
                v-bind="props"
              >
                <v-avatar size="36" class="user-avatar">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="user-menu">
              <div class="user-profile-header">
                <v-avatar size="48" class="profile-avatar">
                  <v-icon color="#365a76" size="24">mdi-account</v-icon>
                </v-avatar>
                <div class="profile-info">
                <h4 class="profile-name">{{ userName || 'Admin User' }}</h4>
                  <p class="profile-role">ຜູ້ຄຸ້ມຄອງລະບົບ</p>
                </div>
              </div>
              <v-divider class="my-2"></v-divider>
              <v-list-item class="profile-item">
                <template #prepend>
                  <v-icon color="#365a76">mdi-account-settings</v-icon>
                </template>
                <v-list-item-title>ຕັ້ງຄ່າໂປຣໄຟລ໌</v-list-item-title>
              </v-list-item>
              <v-divider class="my-2"></v-divider>
              <v-list-item @click="logout" class="logout-item">
                <template #prepend>
                  <v-icon color="error">mdi-logout</v-icon>
                </template>
                <v-list-item-title>ອອກຈາກລະບົບ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-app-bar>

    <!-- Side Navigation -->
    <v-navigation-drawer
      app
      permanent
      width="300"
      class="modern-side-nav"
    >
      <!-- Modern Navigation Header -->
      <div class="modern-nav-header">
        <div class="nav-header-background"></div>
        <div class="nav-header-content">
          <div class="nav-main-icon-wrapper">
            <v-icon size="40" color="#ffd700" class="nav-main-icon">mdi-diamond-stone</v-icon>
          </div>
          <h3 class="modern-nav-title">ເມນູຫຼັກ</h3>
          <p class="nav-subtitle">ລະບົບຈັດການຮ້ານທອງ</p>
        </div>
      </div>

      <!-- Modern Navigation Items -->
      <div class="nav-content">
        <v-list class="modern-nav-list" nav density="comfortable">
          <!-- Home -->
          <v-list-item 
            to="/home" 
            :class="{ 'active-nav-item': isActive('/home') }"
            class="modern-nav-item"
          >
          <template #prepend>
              <div class="modern-nav-icon">
                <v-icon>mdi-home</v-icon>
              </div>
          </template>
            <v-list-item-title class="modern-nav-text">ໜ້າຫຼັກ</v-list-item-title>
        </v-list-item>

        <!-- Data Management -->
        <v-list-group value="manage" class="nav-group">
          <template #activator="{ props, isOpen }">
            <v-list-item v-bind="props" class="nav-group-item">
              <template #prepend>
                <div class="nav-item-icon">
                  <v-icon>mdi-database-cog</v-icon>
                </div>
              </template>
              <v-list-item-title class="nav-item-text">ຈັດການຂໍ້ມູນ</v-list-item-title>
              <template #append>
                <v-icon 
                  class="nav-arrow" 
                  :class="{ 'nav-arrow-open': isOpen }"
                >
                  mdi-chevron-down
                </v-icon>
              </template>
            </v-list-item>
          </template>
          
          <div class="nav-sub-items">
            <v-list-item 
              to="/manage/product" 
              :class="{ 'active-nav-item': isActive('/manage/product') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-gold</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/manage/goldprice" 
              :class="{ 'active-nav-item': isActive('/manage/goldprice') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-chart-line</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນລາຄາຄຳ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/manage/customer" 
              :class="{ 'active-nav-item': isActive('/manage/customer') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-account-group</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນລູກຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/manage/supplier" 
              :class="{ 'active-nav-item': isActive('/manage/supplier') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-truck</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນຜູ້ສະໜອງ</v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>

        <!-- Purchase Management -->
        <v-list-group value="buy" class="nav-group">
          <template #activator="{ props, isOpen }">
            <v-list-item v-bind="props" class="nav-group-item">
              <template #prepend>
                <div class="nav-item-icon">
                  <v-icon>mdi-cart-plus</v-icon>
                </div>
              </template>
              <v-list-item-title class="nav-item-text">ການຈັດການຊື້</v-list-item-title>
              <template #append>
                <v-icon 
                  class="nav-arrow" 
                  :class="{ 'nav-arrow-open': isOpen }"
                >
                  mdi-chevron-down
                </v-icon>
              </template>
            </v-list-item>
          </template>
          
          <div class="nav-sub-items">
            <v-list-item 
              to="/buy/orders" 
              :class="{ 'active-nav-item': isActive('/buy/orders') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-clipboard-list</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນການສັ່ງຊື້</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/buy/delivery" 
              :class="{ 'active-nav-item': isActive('/buy/delivery') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-truck-delivery</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນການນໍາສົ່ງສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/buy/returns" 
              :class="{ 'active-nav-item': isActive('/buy/returns') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-keyboard-return</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນການຊື້ຄືນສິນຄ້າ</v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>

        <!-- Sales Management -->
        <v-list-group value="sell" class="nav-group">
          <template #activator="{ props, isOpen }">
            <v-list-item v-bind="props" class="nav-group-item">
              <template #prepend>
                <div class="nav-item-icon">
                  <v-icon>mdi-cash-register</v-icon>
                </div>
              </template>
              <v-list-item-title class="nav-item-text">ການຈັດການຂາຍ</v-list-item-title>
              <template #append>
                <v-icon 
                  class="nav-arrow" 
                  :class="{ 'nav-arrow-open': isOpen }"
                >
                  mdi-chevron-down
                </v-icon>
              </template>
            </v-list-item>
          </template>
          
          <div class="nav-sub-items">
            <v-list-item 
              to="/sell/selling" 
              :class="{ 'active-nav-item': isActive('/sell/selling') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-point-of-sale</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນການຂາຍສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/sell/exchanges" 
              :class="{ 'active-nav-item': isActive('/sell/exchanges') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-swap-horizontal</v-icon>
                </div>
              </template>
              <v-list-item-title>ຈັດການຂໍ້ມູນການປ່ຽນສິນຄ້າ</v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>

        <!-- Reports -->
        <v-list-group value="report" class="nav-group">
          <template #activator="{ props, isOpen }">
            <v-list-item v-bind="props" class="nav-group-item">
              <template #prepend>
                <div class="nav-item-icon">
                  <v-icon>mdi-chart-bar</v-icon>
                </div>
              </template>
              <v-list-item-title class="nav-item-text">ລາຍງານ</v-list-item-title>
              <template #append>
                <v-icon 
                  class="nav-arrow" 
                  :class="{ 'nav-arrow-open': isOpen }"
                >
                  mdi-chevron-down
                </v-icon>
              </template>
            </v-list-item>
          </template>
          
          <div class="nav-sub-items">
            <v-list-item 
              to="/reports/inventory" 
              :class="{ 'active-nav-item': isActive('/reports/inventory') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-package-variant</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/customers" 
              :class="{ 'active-nav-item': isActive('/reports/customers') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-account-group</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນລູກຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/suppliers" 
              :class="{ 'active-nav-item': isActive('/reports/suppliers') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-truck</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນຜູ້ສະໜອງ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/sales" 
              :class="{ 'active-nav-item': isActive('/reports/sales') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-chart-line</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນການຂາຍສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/orders" 
              :class="{ 'active-nav-item': isActive('/reports/orders') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-clipboard-list</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານການສັ່ງຊື້</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/deliveries" 
              :class="{ 'active-nav-item': isActive('/reports/deliveries') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-truck-delivery</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານການນຳສົ່ງສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/returns" 
              :class="{ 'active-nav-item': isActive('/reports/returns') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-keyboard-return</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນການຊື້ຄືນສິນຄ້າ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/income" 
              :class="{ 'active-nav-item': isActive('/reports/income') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-cash-plus</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານລາຍຮັບ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/expenses" 
              :class="{ 'active-nav-item': isActive('/reports/expenses') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-cash-minus</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຄ່າໃຊ້ຈ່າຍ</v-list-item-title>
            </v-list-item>
            
            <v-list-item 
              to="/reports/exchanges" 
              :class="{ 'active-nav-item': isActive('/reports/exchanges') }"
              class="nav-sub-item"
            >
              <template #prepend>
                <div class="nav-sub-icon">
                  <v-icon size="18">mdi-swap-horizontal</v-icon>
                </div>
              </template>
              <v-list-item-title>ລາຍງານຂໍ້ມູນການປ່ຽນສິນຄ້າ</v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>
      </v-list>
      </div>

      <!-- Footer Section -->
      <template #append>
        <div class="nav-footer">
          <v-divider class="nav-divider"></v-divider>
          <div class="nav-footer-content">
            <p class="nav-footer-text">© 2025 Dalavong Jewelry</p>
            <div class="nav-footer-icons">
              <v-icon size="20" color="gold">mdi-diamond-stone</v-icon>
            </div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <div class="content-wrapper">
        <NuxtPage />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const isDark = ref(false)
const userName = ref('')

const isActive = (path) => route.path.startsWith(path)

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  // Save theme preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

const loadTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
      theme.global.name.value = savedTheme
    }
  }
}

const loadUserInfo = () => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo)
        userName.value = parsed.name || parsed.username || 'Admin User'
      } catch {
        userName.value = 'Admin User'
      }
    }
    
    // ถ้าไม่มี userInfo ใน localStorage ให้ลองดูจาก token
    const token = localStorage.getItem('token')
    if (token && !userName.value) {
      try {
        // Decode JWT token to get user info (basic decode, not secure verification)
        const payload = JSON.parse(atob(token.split('.')[1]))
        userName.value = payload.name || payload.username || 'Admin User'
      } catch {
        userName.value = 'Admin User'
      }
    }
  }
}

const logout = () => {
  // Clear the authentication token and user info
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  // Redirect to login page
  router.push('/login')
}

onMounted(() => {
  loadTheme()
  loadUserInfo()
})
</script>

<style scoped>
/* Global Variables */
:root {
  --primary-color: #365a76;
  --primary-dark: #2c4960;
  --primary-light: #4a6b84;
  --gold-color: #ffd700;
  --gold-light: #ffef94;
  --background-main: #f8fafc;
  --surface-color: #ffffff;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --shadow-soft: 0 4px 20px rgba(54, 90, 118, 0.1);
  --shadow-medium: 0 8px 32px rgba(54, 90, 118, 0.15);
  --radius-medium: 16px;
  --radius-small: 8px;
}

/* Top Navigation Bar */
.top-nav-bar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-medium);
}

.nav-container {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 24px;
  background: rgba(54, 90, 118, 0.95);
  backdrop-filter: blur(10px);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-section:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  margin-top: -4px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon-btn {
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.05);
}

.user-avatar {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-menu {
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-medium);
  border: 1px solid rgba(54, 90, 118, 0.1);
  min-width: 280px;
}

.user-profile-header {
  padding: 16px;
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.05) 0%, rgba(54, 90, 118, 0.02) 100%);
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  color: #365a76;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.profile-role {
  font-size: 12px;
  color: #4a5568;
  margin: 4px 0 0 0;
  font-weight: 500;
}

.v-theme--dark .profile-name {
  color: #fff !important;
}

.v-theme--dark .profile-role {
  color: #b0b0b0 !important;
}

.profile-item:hover {
  background: rgba(54, 90, 118, 0.05) !important;
}

.logout-item:hover {
  background: rgba(244, 67, 54, 0.1) !important;
}

/* Modern Side Navigation */
.modern-side-nav {
  background: linear-gradient(180deg, #365a76 0%, #2c4960 30%, #ffffff 30%, #f8fafc 100%) !important;
  border-right: none;
  box-shadow: 0 0 30px rgba(54, 90, 118, 0.15);
}

/* Dark Mode Styles */
.v-theme--dark .modern-side-nav {
  background: linear-gradient(180deg, #365a76 0%, #2c4960 30%, #1a1a1a 30%, #121212 100%) !important;
}

.v-theme--dark .nav-content {
  background: #1a1a1a !important;
}

.v-theme--dark .modern-nav-text {
  color: #e0e0e0 !important;
}

.v-theme--dark .nav-item-text {
  color: #e0e0e0 !important;
}

.v-theme--dark .main-content {
  background: #121212 !important;
}

.v-theme--dark .top-nav-bar {
  background: #1a1a1a !important;
  border-bottom: 1px solid #333 !important;
}

.v-theme--dark .nav-container {
  background: rgba(26, 26, 26, 0.95) !important;
}

/* Modern Navigation Header */
.modern-nav-header {
  position: relative;
  padding: 32px 24px;
  overflow: hidden;
}

.nav-header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
  z-index: 1;
}

.nav-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.nav-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="50" cy="50" r="1" fill="rgba(255,215,0,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.nav-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  text-align: center;
}

.nav-main-icon-wrapper {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-main-icon-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.2);
}

.modern-nav-title {
  color: white;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.nav-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin: 0;
  font-weight: 400;
}

.nav-main-icon {
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3));
}

.nav-title {
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.nav-divider {
  border-color: rgba(54, 90, 118, 0.1);
  margin: 0;
}

/* Modern Navigation Content */
.nav-content {
  padding: 24px 0;
  background: white;
}

.modern-nav-list {
  padding: 0 16px;
}

/* Modern Navigation Items */
.modern-nav-item,
.nav-group-item {
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.modern-nav-item:hover,
.nav-group-item:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.08) 0%, rgba(54, 90, 118, 0.04) 100%) !important;
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.15);
}

.modern-nav-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 4px 16px rgba(54, 90, 118, 0.2);
}

.modern-nav-item:hover .modern-nav-icon {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #365a76;
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.modern-nav-text {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
  transition: all 0.3s ease;
}

.modern-nav-item:hover .modern-nav-text {
  color: #365a76;
  transform: translateX(4px);
}

.nav-item,
.nav-group-item {
  border-radius: var(--radius-small);
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before,
.nav-group-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  transition: width 0.3s ease;
  z-index: 0;
}

.nav-item:hover::before,
.nav-group-item:hover::before {
  width: 4px;
}

.nav-item:hover,
.nav-group-item:hover {
  background: rgba(54, 90, 118, 0.05) !important;
  transform: translateX(4px);
}

.nav-item-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-small);
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-item:hover .nav-item-icon,
.nav-group-item:hover .nav-item-icon {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  color: white;
  transform: scale(1.1);
}

.nav-item-text {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

.active-nav-item {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%) !important;
  color: white !important;
  transform: translateX(8px);
  box-shadow: var(--shadow-soft);
}

.active-nav-item .nav-item-icon {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.active-nav-item .nav-item-text {
  color: white !important;
  font-weight: 600;
}

/* Navigation Arrow */
.nav-arrow {
  transition: transform 0.3s ease;
  color: var(--text-secondary);
}

.nav-arrow-open {
  transform: rotate(180deg);
}

/* Sub Navigation Items */
.nav-sub-items {
  padding: 8px 0;
  background: rgba(54, 90, 118, 0.02);
  border-radius: 0 0 var(--radius-small) var(--radius-small);
  margin: 0 12px;
  border-left: 2px solid rgba(54, 90, 118, 0.1);
}

.nav-sub-item {
  border-radius: var(--radius-small);
  margin: 4px 16px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.nav-sub-item:hover {
  background: rgba(54, 90, 118, 0.08) !important;
  transform: translateX(8px);
}

.nav-sub-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(54, 90, 118, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-sub-item:hover .nav-sub-icon {
  background: var(--primary-color);
  color: white;
}

.active-nav-item.nav-sub-item {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%) !important;
  color: white !important;
}

.active-nav-item.nav-sub-item .nav-sub-icon {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Navigation Footer */
.nav-footer {
  padding: 16px;
}

.nav-footer-content {
  text-align: center;
  padding: 16px;
  background: rgba(54, 90, 118, 0.05);
  border-radius: var(--radius-small);
}

.nav-footer-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.nav-footer-icons {
  display: flex;
  justify-content: center;
}

/* Main Content */
.main-content {
  background: var(--background-main);
  min-height: 100vh;
}

.content-wrapper {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 960px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}

/* Animation Keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Scrollbar Styling */
.side-nav ::-webkit-scrollbar {
  width: 6px;
}

.side-nav ::-webkit-scrollbar-track {
  background: transparent;
}

.side-nav ::-webkit-scrollbar-thumb {
  background: rgba(54, 90, 118, 0.2);
  border-radius: 3px;
}

.side-nav ::-webkit-scrollbar-thumb:hover {
  background: rgba(54, 90, 118, 0.4);
}
</style>
