<template>
  <ModernPageLayout 
    title="ລາຍງານຂໍ້ມູນການປ່ຽນສິນຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະການປ່ຽນສິນຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-swap-horizontal"
  >
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Summary Statistics -->
    <div class="summary-section mb-6">
      <v-row>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-swap-horizontal</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalExchanges }}</h3>
              <p class="stat-label">ການແລກປ່ຽນທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-currency-usd</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalValue) }}</h3>
              <p class="stat-label">ມູນຄ່າລວມ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-check-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ completedExchanges }}</h3>
              <p class="stat-label">ສຳເລັດແລ້ວ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-account-group</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ uniqueCustomers }}</h3>
              <p class="stat-label">ລູກຄ້າປ່ຽນ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Filters and Export -->
    <div class="filters-section">
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="3">
          <v-text-field 
            v-model="startDate" 
            label="ວັນທີເລີ່ມຕົ້ນ" 
            type="date" 
            variant="outlined"
            density="comfortable"
            hide-details 
            color="#365a76"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field 
            v-model="endDate" 
            label="ວັນທີສິ້ນສຸດ" 
            type="date" 
            variant="outlined"
            density="comfortable"
            hide-details 
            color="#365a76"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            v-model="search" 
            label="ຄົ້ນຫາ (ລູກຄ້າ, ສິນຄ້າ)" 
            variant="outlined"
            density="comfortable"
            hide-details 
            prepend-inner-icon="mdi-magnify" 
            color="#365a76"
            clearable
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <ModernButton 
            variant="success"
            size="large"
            prepend-icon="mdi-file-excel"
            @click="exportToExcel"
          >
            Export Excel
          </ModernButton>
        </v-col>
      </v-row>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ວັນທີແລກປ່ຽນ</th>
            <th>ລູກຄ້າ</th>
            <th>ສິນຄ້າເກົ່າ</th>
            <th>ສິນຄ້າໃໝ່</th>
            <th class="text-right">ຄ່າຕ່າງ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredExchanges.length === 0">
            <td colspan="6" class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2" class="mb-4">mdi-swap-horizontal-circle-outline</v-icon>
              <p class="text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນການແລກປ່ຽນ</p>
            </td>
          </tr>
          <tr v-for="(exchange, index) in paginatedExchanges" :key="exchange.Exch_ID">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ formatDate(exchange.Exch_Date) }}</td>
            <td>{{ exchange.Cust_name || 'ບໍ່ລະບຸ' }}</td>
            <td>
              <div v-if="exchange.Old_Product_Name">
                <div class="product-info">
                  <strong>{{ exchange.Old_Product_Name }}</strong>
                  <small class="product-details">
                    {{ exchange.Old_Product_Type }} - {{ exchange.Old_Product_Weight }}ກ
                  </small>
                </div>
              </div>
              <span v-else class="text-grey">ບໍ່ລະບຸ</span>
            </td>
            <td>
              <div v-if="exchange.New_Product_Name">
                <div class="product-info">
                  <strong>{{ exchange.New_Product_Name }}</strong>
                  <small class="product-details">
                    {{ exchange.New_Product_Type }} - {{ exchange.New_Product_Weight }}ກ
                  </small>
                </div>
              </div>
              <span v-else class="text-grey">ບໍ່ລະບຸ</span>
            </td>
                         <td class="text-right" :class="exchange.Difference_Calculated >= 0 ? 'text-success' : 'text-error'">
               {{ formatCurrency(Math.abs(exchange.Difference_Calculated || 0)) }}
               <small v-if="exchange.Difference_Calculated < 0" class="text-error">(ເງິນເກີນ)</small>
               <small v-else-if="exchange.Difference_Calculated > 0" class="text-success">(ເພີ່ມເງິນ)</small>
             </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="5" class="text-right font-weight-bold">ມູນຄ່າລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalValue) }}</td>
          </tr>
        </tfoot>
      </v-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          color="#365a76"
          class="my-4"
        />
        <div class="pagination-info">
          <span>ລວມທັງໝົດ: {{ filteredExchanges.length }} ລາຍການ</span>
        </div>
      </div>
    </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';

const api = useApi();

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const startDate = ref('');
const endDate = ref('');
const search = ref('');

// Data from API
const exchanges = ref([]);

// Computed properties
const totalExchanges = computed(() => exchanges.value.length);
const totalValue = computed(() => {
  return exchanges.value.reduce((sum, exchange) => sum + Math.abs(exchange.Difference_Calculated || 0), 0);
});
const completedExchanges = computed(() => {
  return exchanges.value.filter(exchange => exchange.Status === 'Completed').length;
});
const uniqueCustomers = computed(() => {
  const customers = new Set();
  exchanges.value.forEach(exchange => {
    if (exchange.Cust_name) {
      customers.add(exchange.Cust_name);
    }
  });
  return customers.size;
});

// Filtered data
const filteredExchanges = computed(() => {
  let filtered = exchanges.value;
  
  // Search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(exchange =>
      (exchange.Cust_name && exchange.Cust_name.toLowerCase().includes(searchTerm)) ||
      (exchange.Old_Product_Name && exchange.Old_Product_Name.toLowerCase().includes(searchTerm)) ||
      (exchange.New_Product_Name && exchange.New_Product_Name.toLowerCase().includes(searchTerm))
    );
  }
  
  // Date range filter
  if (startDate.value) {
    filtered = filtered.filter(exchange => new Date(exchange.Exch_Date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(exchange => new Date(exchange.Exch_Date) <= new Date(endDate.value));
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredExchanges.value.length / itemsPerPage.value));

const paginatedExchanges = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredExchanges.value.slice(start, end);
});

// Watch for filter changes
watch([search, startDate, endDate], () => {
  currentPage.value = 1;
});

// API Functions
const fetchExchanges = async () => {
  loading.value = true;
  try {
    const response = await api.get('/public/exchanges');
    if (response && response.success) {
      exchanges.value = response.data || [];
    } else {
      exchanges.value = [];
    }
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ',
      color: 'error'
    };
    exchanges.value = [];
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'ບໍ່ລະບຸ';
  const date = new Date(dateString);
  return date.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ກີບ';
  const numValue = Number(value);
  if (isNaN(numValue)) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(numValue) + ' ກີບ';
};

// Removed getStatusColor and getStatusText functions as status column was removed

const exportToExcel = async () => {
  try {
    // Import XLSX dynamically
    const XLSX = await import('xlsx');
    
         // Prepare data for export
     const exportData = filteredExchanges.value.map((item, index) => ({
       'ລຳດັບ': index + 1,
       'ວັນທີແລກປ່ຽນ': formatDate(item.Exch_Date),
       'ລູກຄ້າ': item.Cust_name || 'ບໍ່ລະບຸ',
       'ສິນຄ້າເກົ່າ': item.Old_Product_Name || 'ບໍ່ລະບຸ',
       'ປະເພດເກົ່າ': item.Old_Product_Type || 'ບໍ່ລະບຸ',
       'ນ້ຳໜັກເກົ່າ (ກຣາມ)': Number(item.Old_Product_Weight || 0),
       'ສິນຄ້າໃໝ່': item.New_Product_Name || 'ບໍ່ລະບຸ',
       'ປະເພດໃໝ່': item.New_Product_Type || 'ບໍ່ລະບຸ',
       'ນ້ຳໜັກໃໝ່ (ກຣາມ)': Number(item.New_Product_Weight || 0),
       'ຄ່າຕ່າງ (ກີບ)': Number(item.Difference_Calculated || 0)
     }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານການແລກປ່ຽນ');
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `ລາຍງານການແລກປ່ຽນ_${today}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
    
    snackbar.value = {
      show: true,
      message: 'ສົ່ງອອກ Excel ສຳເລັດ',
      color: 'success'
    };
  } catch (error) {
    console.error('Export error:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ',
      color: 'error'
    };
  }
};

// Initialize
onMounted(() => {
  fetchExchanges();
});
</script>

<style scoped>
.summary-section {
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(54, 90, 118, 0.15);
}

.stat-icon {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  word-break: break-all;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.filters-section {
  background: transparent;
  margin-bottom: 24px;
}

.table-container {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 2px solid var(--border-color);
}

.modern-table {
  background: transparent;
}

.modern-table :deep(thead tr) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
}

.modern-table :deep(thead th) {
  color: white !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 20px 16px;
  border-bottom: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table :deep(tbody tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.modern-table :deep(tbody tr:hover) {
  background: var(--hover-bg);
  transform: scale(1.01);
}

.modern-table :deep(tbody td) {
  padding: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.total-row {
  background: var(--accent-bg) !important;
  font-weight: 700 !important;
}

.total-row td {
  color: var(--text-primary) !important;
  font-weight: 700 !important;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-details {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 14px;
}

/* CSS Variables for theming */
:root {
  --card-bg: white;
  --border-color: rgba(54, 90, 118, 0.2);
  --text-primary: #2d3748;
  --text-secondary: #6b7280;
  --hover-bg: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%);
  --accent-bg: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
}

/* Dark mode */
.v-theme--dark {
  --card-bg: #1a1a2e;
  --border-color: rgba(255, 255, 255, 0.2);
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --hover-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.06) 100%);
  --accent-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.v-theme--dark .stat-card {
  background: var(--card-bg);
  border-color: var(--border-color);
}

.v-theme--dark .table-container {
  background: var(--card-bg);
  border-color: var(--border-color);
}

.v-theme--dark .pagination-container {
  background: var(--card-bg);
  border-color: var(--border-color);
}

/* Responsive design */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 16px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .filters-section {
    padding: 16px;
  }
}
</style> 