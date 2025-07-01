<template>
  <div class="login-container">
    <!-- Background pattern -->
    <div class="background-pattern"></div>
    
    <!-- Login card -->
    <div class="login-card">
      <!-- Logo section -->
      <div class="logo-section">
        <div class="logo">
          <div class="logo-text">D</div>
          <div class="logo-icon">💎</div>
        </div>
        <h1 class="brand-title">DALAVONG</h1>
      </div>

      <!-- Form section -->
      <div class="form-section">
        <h2 class="form-title">ເຂົ້າສູ່ລະບົບ</h2>
        
        <!-- Error message -->
        <div v-if="showError" class="error-alert">
          <v-icon class="error-icon">mdi-alert-circle</v-icon>
          <span>{{ errorMessage }}</span>
          <v-btn 
            icon="mdi-close" 
            size="small" 
            variant="text" 
            @click="clearErrorLocal"
            class="close-btn"
          ></v-btn>
        </div>

        <!-- Login form -->
        <v-form ref="form" @submit.prevent="onSubmit" class="login-form">
          <!-- Username field -->
          <div class="input-group">
            <label class="input-label">ຊື່ຜູ້ໃຊ້</label>
            <v-text-field
              v-model="formData.username"
              type="text"
              variant="outlined"
              :rules="[rules.required]"
              placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
              prepend-inner-icon="mdi-account"
              class="custom-input"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </div>

          <!-- Password field -->
          <div class="input-group">
            <label class="input-label">ລະຫັດຜ່ານ</label>
            <v-text-field
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              :rules="[rules.required]"
              placeholder="ປ້ອນລະຫັດຜ່ານ"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              class="custom-input"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </div>

          <!-- Remember me -->
          <div class="remember-section">
            <v-checkbox
              v-model="rememberMe"
              label="ຈື່ການເຂົ້າສູ່ລະບົບ"
              density="compact"
              hide-details
              class="custom-checkbox"
            ></v-checkbox>
          </div>

          <!-- Login button -->
          <v-btn
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            color="success"
            size="large"
            variant="flat"
            class="login-btn"
            block
          >
            <v-icon start>mdi-login</v-icon>
            ເຂົ້າສູ່ລະບົບ
          </v-btn>

          <!-- Cancel button -->
          <v-btn
            color="error"
            size="large"
            variant="outlined"
            class="cancel-btn"
            block
            @click="resetForm"
          >
            <v-icon start>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
        </v-form>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p class="footer-text">© 2024 Dalavong Jewelry Management System</p>
        <p class="footer-subtext">ລິຂະສິດສະຫງວນໄວ້ທຸກຢ່າງ</p>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular
        indeterminate
        color="success"
        size="64"
      ></v-progress-circular>
      <p class="loading-text">ກຳລັງເຂົ້າສູ່ລະບົບ...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useErrorHandler } from '~/composables/useErrorHandler'

definePageMeta({
  layout: 'auth'
})

const api = useApi()
const { handleApiError, getErrorMessage, ERROR_CODES } = useErrorHandler()

// Reactive data
const form = ref(null)
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const formData = reactive({
  username: '',
  password: ''
})

// Validation rules
const rules = {
  required: (value) => !!value || 'ກະລຸນາປ້ອນຂໍ້ມູນ'
}

// Methods
const clearErrorLocal = () => {
  showError.value = false
  errorMessage.value = ''
}

const resetForm = () => {
  formData.username = ''
  formData.password = ''
  showPassword.value = false
  rememberMe.value = false
  clearErrorLocal()
  if (form.value) {
    form.value.reset()
  }
}

const onSubmit = async () => {
  clearErrorLocal()
  
  const { valid } = await form.value.validate()
  if (!valid) return

  isLoading.value = true

  try {
    const response = await api.post('/auth/login', {
      username: formData.username,
      password: formData.password,
    })

    if (response?.data?.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      if (rememberMe.value) {
        localStorage.setItem('rememberUser', formData.username)
      }
      
      await navigateTo('/home')
    } else {
      showError.value = true
      errorMessage.value = getErrorMessage(ERROR_CODES.INVALID_CREDENTIALS)
    }
  } catch (error) {
    console.error('Login error:', error)
    
    const errorResponse = handleApiError(error, 'login')
    
    // Show appropriate error message
    let errorMsg = 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
    
    if (error?.response?.status === 401) {
      errorMsg = 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
    } else if (error?.response?.status === 500) {
      errorMsg = 'ເກີດຂໍ້ຜິດພາດທີ່ເຊີບເວີ້'
    } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      errorMsg = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ເຊີບເວີໄດ້'
    } else {
      errorMsg = errorResponse.message || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ'
    }
    
    showError.value = true
    errorMessage.value = errorMsg
  } finally {
    isLoading.value = false
  }
}

// Check for remembered user on mount
onMounted(() => {
  const rememberedUser = localStorage.getItem('rememberUser')
  if (rememberedUser) {
    formData.username = rememberedUser
    rememberMe.value = true
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(54, 90, 118, 0.2);
  padding: 50px;
  width: 100%;
  max-width: 520px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-height: 600px;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #365a76, #2c4960);
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(54, 90, 118, 0.4);
  position: relative;
  overflow: hidden;
}

.logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.logo-text {
  font-size: 36px;
  font-weight: 900;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', serif;
  z-index: 2;
  position: relative;
}

.logo-icon {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 20px;
  z-index: 3;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
}

.form-section {
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
  margin-bottom: 24px;
}

.error-alert {
  background: #fed7e2;
  border: 1px solid #fc8181;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c53030;
  font-weight: 500;
}

.error-icon {
  flex-shrink: 0;
}

.close-btn {
  margin-left: auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field:hover) {
  border-color: #cbd5e0;
}

.custom-input :deep(.v-field--focused) {
  border-color: #365a76;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(54, 90, 118, 0.1);
}

.custom-input :deep(.v-field__input) {
  padding: 16px;
  font-size: 16px;
}

.remember-section {
  margin: 8px 0;
}

.custom-checkbox :deep(.v-selection-control__wrapper) {
  margin-left: 0;
}

.custom-checkbox :deep(.v-label) {
  font-size: 14px;
  color: #4a5568;
}

.login-btn {
  margin-top: 8px;
  height: 60px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #365a76, #2c4960);
  box-shadow: 0 4px 12px rgba(54, 90, 118, 0.4);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 16px rgba(54, 90, 118, 0.5);
  transform: translateY(-2px);
}

.cancel-btn {
  margin-top: 12px;
  height: 60px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  border: 2px solid #718096;
  color: #4a5568;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #718096;
  color: white;
  transform: translateY(-2px);
}

.footer-section {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.footer-text {
  font-size: 12px;
  color: #718096;
  margin: 0 0 4px 0;
}

.footer-subtext {
  font-size: 11px;
  color: #a0aec0;
  margin: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 9999;
}

.loading-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px;
    border-radius: 16px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .form-title {
    font-size: 20px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(26, 32, 44, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .brand-title, .form-title {
    color: #f7fafc;
  }
  
  .input-label {
    color: #a0aec0;
  }
  
  .custom-input :deep(.v-field) {
    background: #2d3748;
    border-color: #4a5568;
    color: #f7fafc;
  }
  
  .footer-section {
    border-color: #4a5568;
  }
}
</style>
