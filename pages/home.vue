<template>
  <div class="content-wrapper">
    <v-container fluid class="page-container">
      <!-- Modern Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon size="32" color="#ffd700">mdi-diamond-stone</v-icon>
          </div>
          <div>
            <h1 class="page-title">ລະບົບຈັດການຮ້ານຂາຍຄໍາ ດາລາວົງ</h1>
            <p class="page-subtitle">ຍິນດີຕ້ອນຮັບສູ່ລະບົບຈັດການຮ້ານທອງທີ່ທັນສະໄໝ</p>
          </div>
        </div>
      </div>
    <!-- Dashboard Summary Cards -->
    <div class="dashboard-grid">
      <v-row>
        <!-- Gold Price Card -->
        <v-col cols="12" md="6" lg="3">
          <div class="summary-card gold-card">
            <div class="card-header">
              <v-icon size="32" color="#ffd700">mdi-gold</v-icon>
              <h3>ລາຄາຄຳມື້ນີ້</h3>
            </div>
            <div class="card-content">
              <p class="price-label">ລາຄາຂາຍ</p>
              <h2 class="price-value">{{ formatCurrency(goldPrice?.Sell_price || 0) }}</h2>
              <p class="price-unit">LAK ຕໍ່ 1 ບາດ</p>
            </div>
          </div>
        </v-col>

        <!-- Products Count -->
        <v-col cols="12" md="6" lg="3">
          <div class="summary-card products-card">
            <div class="card-header">
              <v-icon size="32" color="#365a76">mdi-package-variant</v-icon>
              <h3>ສິນຄ້າທັງໝົດ</h3>
            </div>
            <div class="card-content">
              <h2 class="count-value">{{ totalProducts }}</h2>
              <p class="count-label">ລາຍການສິນຄ້າ</p>
            </div>
          </div>
        </v-col>

        <!-- Available Products -->
        <v-col cols="12" md="6" lg="3">
          <div class="summary-card available-card">
            <div class="card-header">
              <v-icon size="32" color="#10b981">mdi-check-circle</v-icon>
              <h3>ສິນຄ້າພ້ອມຂາຍ</h3>
            </div>
            <div class="card-content">
              <h2 class="count-value">{{ availableProducts }}</h2>
              <p class="count-label">ລາຍການສິນຄ້າ</p>
            </div>
          </div>
        </v-col>

        <!-- Customers Count -->
        <v-col cols="12" md="6" lg="3">
          <div class="summary-card customers-card">
            <div class="card-header">
              <v-icon size="32" color="#8b5cf6">mdi-account-group</v-icon>
              <h3>ລູກຄ້າທັງໝົດ</h3>
            </div>
            <div class="card-content">
              <h2 class="count-value">{{ totalCustomers }}</h2>
              <p class="count-label">ລູກຄ້າລົງທະບຽນ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section mt-8">
      <h3 class="section-title">ການດຳເນີນການດ່ວນ</h3>
      <v-row class="mt-4">
        <v-col cols="12" sm="6" md="3">
          <div class="action-card" @click="$router.push('/sell/selling')">
            <v-icon size="48" color="#365a76">mdi-point-of-sale</v-icon>
            <h4>ຂາຍສິນຄ້າ</h4>
            <p>ເລີ່ມຂາຍສິນຄ້າໃໝ່</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <div class="action-card" @click="$router.push('/buy/returns')">
            <v-icon size="48" color="#f59e0b">mdi-keyboard-return</v-icon>
            <h4>ຊື້ຄືນສິນຄ້າ</h4>
            <p>ລົງທະບຽນການຊື້ຄືນ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <div class="action-card" @click="$router.push('/manage/product')">
            <v-icon size="48" color="#10b981">mdi-plus-circle</v-icon>
            <h4>ເພີ່ມສິນຄ້າ</h4>
            <p>ສ້າງສິນຄ້າໃໝ່</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <div class="action-card" @click="$router.push('/sell/exchanges')">
            <v-icon size="48" color="#8b5cf6">mdi-swap-horizontal</v-icon>
            <h4>ປ່ຽນສິນຄ້າ</h4>
            <p>ແລກປ່ຽນສິນຄ້າ</p>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Reports Section -->
    <div class="reports-section mt-8">
      <h3 class="section-title">ລາຍງານຂໍ້ມູນທັງໝົດ</h3>
      <v-row class="mt-4">
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/inventory')">
            <v-icon size="40" color="#365a76">mdi-package-variant</v-icon>
            <h4>ລາຍງານຂໍ້ມູນສິນຄ້າ</h4>
            <p>ຂໍ້ມູນສິນຄ້າທັງໝົດ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/customers')">
            <v-icon size="40" color="#10b981">mdi-account-group</v-icon>
            <h4>ລາຍງານຂໍ້ມູນລູກຄ້າ</h4>
            <p>ຂໍ້ມູນລູກຄ້າທັງໝົດ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/suppliers')">
            <v-icon size="40" color="#f59e0b">mdi-truck</v-icon>
            <h4>ລາຍງານຂໍ້ມູນຜູ້ສະໜອງ</h4>
            <p>ຂໍ້ມູນຜູ້ສະໜອງສິນຄ້າ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/orders')">
            <v-icon size="40" color="#8b5cf6">mdi-shopping</v-icon>
            <h4>ລາຍງານຂໍ້ມູນການສັ່ງຊື້ສິນຄ້າ</h4>
            <p>ຂໍ້ມູນການສັ່ງຊື້</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/deliveries')">
            <v-icon size="40" color="#06b6d4">mdi-truck-delivery</v-icon>
            <h4>ລາຍງານຂໍ້ມູນການນຳສົ່ງສິນຄ້າ</h4>
            <p>ຂໍ້ມູນການຈັດສົ່ງ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/sales')">
            <v-icon size="40" color="#ef4444">mdi-chart-line</v-icon>
            <h4>ລາຍງານຂໍ້ມູນການຂາຍສິນຄ້າ</h4>
            <p>ຂໍ້ມູນການຂາຍ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/returns')">
            <v-icon size="40" color="#84cc16">mdi-keyboard-return</v-icon>
            <h4>ລາຍງານຂໍ້ມູນການຊື້ຄືນ</h4>
            <p>ຂໍ້ມູນການຊື້ຄືນສິນຄ້າ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/exchanges')">
            <v-icon size="40" color="#a855f7">mdi-swap-horizontal</v-icon>
            <h4>ລາຍງານຂໍ້ມູນການປ່ຽນສິນຄ້າ</h4>
            <p>ຂໍ້ມູນການແລກປ່ຽນ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/income')">
            <v-icon size="40" color="#22c55e">mdi-cash-plus</v-icon>
            <h4>ລາຍງານຂໍ້ມູນລາຍຮັບ</h4>
            <p>ຂໍ້ມູນລາຍຮັບທັງໝົດ</p>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="report-card" @click="$router.push('/reports/expenses')">
            <v-icon size="40" color="#f97316">mdi-cash-minus</v-icon>
            <h4>ລາຍງານຂໍ້ມູນລາຍຈ່າຍ</h4>
            <p>ຂໍ້ມູນລາຍຈ່າຍທັງໝົດ</p>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity-section mt-8">
      <h3 class="section-title">ກິດຈະກຳລ້າສຸດ</h3>
      <div class="activity-card mt-4">
        <div class="activity-item" v-if="isLoading">
          <v-progress-circular indeterminate color="#365a76" size="24"></v-progress-circular>
          <span>ກຳລັງໂຫລດຂໍ້ມູນ...</span>
        </div>
        <div v-else class="activity-list">
          <div class="activity-item">
            <v-icon color="#10b981">mdi-check-circle</v-icon>
            <div class="activity-text">
              <p class="activity-title">ລະບົບພ້ອມໃຊ້ງານ</p>
              <p class="activity-time">ລາຄາຄຳອັບເດດແລ້ວ</p>
            </div>
          </div>
          <div class="activity-item">
            <v-icon color="#365a76">mdi-database</v-icon>
            <div class="activity-text">
              <p class="activity-title">ຂໍ້ມູນສິນຄ້າ {{ totalProducts }} ລາຍການ</p>
              <p class="activity-time">ພ້ອມໃຊ້ງານ {{ availableProducts }} ລາຍການ</p>
            </div>
          </div>
          <div class="activity-item">
            <v-icon color="#8b5cf6">mdi-account-group</v-icon>
            <div class="activity-text">
              <p class="activity-title">ລູກຄ້າລົງທະບຽນ {{ totalCustomers }} ຄົນ</p>
              <p class="activity-time">ພ້ອມໃຫ້ບໍລິການ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { formatCurrency } from '~/utils/format.js'

const api = useApi()

// Data
const isLoading = ref(true)
const goldPrice = ref(null)
const products = ref([])
const customers = ref([])

// Computed properties
const totalProducts = computed(() => products.value.length || 0)
const availableProducts = computed(() => 
  products.value.filter(p => p.status === 'AVAILABLE').length || 0
)
const totalCustomers = computed(() => customers.value.length || 0)

// Fetch data
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    // Fetch all data in parallel
    const [goldPriceRes, productsRes, customersRes] = await Promise.allSettled([
      api.get('/prices/latest'),
      api.get('/products'),
      api.get('/public/customers')
    ])

    // Handle gold price
    if (goldPriceRes.status === 'fulfilled' && goldPriceRes.value?.success) {
      goldPrice.value = goldPriceRes.value.data
    } else if (goldPriceRes.status === 'fulfilled') {
      goldPrice.value = goldPriceRes.value
    }

    // Handle products
    if (productsRes.status === 'fulfilled' && productsRes.value?.success) {
      products.value = productsRes.value.data || []
    } else if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
      products.value = productsRes.value
    }

    // Handle customers
    if (customersRes.status === 'fulfilled' && customersRes.value?.success) {
      customers.value = customersRes.value.data || []
    } else if (customersRes.status === 'fulfilled' && Array.isArray(customersRes.value)) {
      customers.value = customersRes.value
    }

  } catch (error) {
    console.error('Dashboard data fetch error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDashboardData)
</script>

<style scoped>
/* Content Wrapper */
.content-wrapper {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 0;
}

/* Page Container */
.page-container {
  background: transparent;
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

/* Dashboard Grid */
.dashboard-grid {
  margin-bottom: 32px;
}

/* Summary Cards */
.summary-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
  transition: all 0.3s ease;
  height: 100%;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(54, 90, 118, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.card-content {
  text-align: center;
}

.price-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.price-value, .count-value {
  font-size: 28px;
  font-weight: 700;
  color: #365a76;
  margin: 0;
}

.price-unit, .count-label {
  font-size: 14px;
  color: #6b7280;
  margin: 8px 0 0 0;
}

/* Special card styling */
.gold-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%);
  border-color: rgba(255, 215, 0, 0.2);
}

.products-card {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.05) 0%, rgba(54, 90, 118, 0.02) 100%);
  border-color: rgba(54, 90, 118, 0.2);
}

.available-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
  border-color: rgba(16, 185, 129, 0.2);
}

.customers-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%);
  border-color: rgba(139, 92, 246, 0.2);
}

/* Section Titles */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #365a76;
  margin: 0 0 16px 0;
}

/* Quick Actions */
.action-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(54, 90, 118, 0.1);
  height: 100%;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(54, 90, 118, 0.15);
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.02) 0%, rgba(54, 90, 118, 0.01) 100%);
}

.action-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 8px 0;
}

.action-card p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Report Cards */
.reports-section {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.02) 0%, rgba(54, 90, 118, 0.01) 100%);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.report-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(54, 90, 118, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}

.report-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(54, 90, 118, 0.2);
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.01) 100%);
}

.report-card h4 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 12px 0 8px 0;
  text-align: center;
  line-height: 1.3;
}

.report-card p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

/* Recent Activity */
.activity-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(54, 90, 118, 0.02);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(54, 90, 118, 0.05);
}

.activity-text {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .summary-card, .action-card, .report-card {
    margin-bottom: 16px;
  }
  
  .card-header h3 {
    font-size: 14px;
  }
  
  .price-value, .count-value {
    font-size: 24px;
  }
  
  .action-card h4, .report-card h4 {
    font-size: 14px;
  }
  
  .reports-section {
    padding: 20px;
  }
  
  .report-card {
    min-height: 140px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .report-card h4 {
    font-size: 13px;
  }
  
  .report-card p {
    font-size: 12px;
  }
}

/* Dark Mode Support */
.v-theme--dark .content-wrapper {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.v-theme--dark .summary-card {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .action-card {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .action-card:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.15) 0%, rgba(54, 90, 118, 0.25) 100%);
}

.v-theme--dark .reports-section {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.08) 0%, rgba(54, 90, 118, 0.04) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .report-card {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .report-card:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.15) 0%, rgba(54, 90, 118, 0.25) 100%);
}

.v-theme--dark .activity-card {
  background: #2d2d2d;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .activity-item {
  background: rgba(54, 90, 118, 0.08);
}

.v-theme--dark .activity-item:hover {
  background: rgba(54, 90, 118, 0.15);
}

.v-theme--dark .section-title {
  color: #e2e8f0;
}

.v-theme--dark .summary-card h3,
.v-theme--dark .action-card h4,
.v-theme--dark .report-card h4 {
  color: #e2e8f0;
}

.v-theme--dark .activity-title {
  color: #e2e8f0;
}

.v-theme--dark .activity-time {
  color: #94a3b8;
}

/* Responsive design */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>
