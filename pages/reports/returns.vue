<template>
  <ModernPageLayout 
    title="ລາຍງານການຊື້ຄືນສິນຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະການຊື້ຄືນສິນຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-cash-refund"
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
              <v-icon size="32" color="#dc2626">mdi-cash-refund</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalRepurchases }}</h3>
              <p class="stat-label">ການຊື້ຄືນທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-cash-minus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalRepurchaseValue) }}</h3>
              <p class="stat-label">ມູນຄ່າຊື້ຄືນລວມ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-scale</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalWeight.toFixed(2) }}</h3>
              <p class="stat-label">ນ້ຳໜັກລວມ (ກຣາມ)</p>
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
              <p class="stat-label">ລູກຄ້າທີ່ຂາຍຄືນ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Filters -->
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
            <th>ວັນທີຊື້ຄືນ</th>
            <th>ລູກຄ້າ</th>
            <th>ສິນຄ້າ</th>
            <th>ນ້ຳໜັກ</th>
            <th class="text-right">ລາຄາຊື້ຄືນ</th>
            <th class="text-right">ຄ່າຫັກຕ່າງໆ</th>
            <th class="text-right">ສຸດທິ</th>
            <th>ເຫດຜົນ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRepurchases.length === 0">
            <td colspan="9" class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2" class="mb-4">mdi-database-off</v-icon>
              <p class="text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນການຊື້ຄືນ</p>
            </td>
          </tr>
          <tr v-for="(repurchase, index) in paginatedRepurchases" :key="repurchase.Re_ID">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ formatDate(repurchase.Re_date) }}</td>
            <td>{{ getCustomerDisplayName(repurchase) }}</td>
            <td>
              <div v-if="repurchase.Tb_Product && repurchase.Tb_Product.length > 0">
                <v-chip 
                  v-for="product in repurchase.Tb_Product.slice(0, 2)" 
                  :key="product.Pd_ID"
                  size="small" 
                  variant="outlined" 
                  color="#365a76"
                  class="ma-1"
                >
                  {{ product.Pd_name }}
                </v-chip>
                <v-chip 
                  v-if="repurchase.Tb_Product.length > 2"
                  size="small" 
                  variant="tonal" 
                  color="grey"
                  class="ma-1"
                >
                  +{{ repurchase.Tb_Product.length - 2 }}
                </v-chip>
              </div>
              <span v-else class="text-grey">ສິນຄ້າພາຍນອກ</span>
            </td>
            <td>{{ getTotalWeight(repurchase).toFixed(2) }} ກຣາມ</td>
            <td class="text-right">{{ formatCurrency(repurchase.Repurchase_Price) }}</td>
            <td class="text-right">
              <span v-if="(Number(repurchase.Damage_Cost || 0) + Number(repurchase.Loose_Gold_Cost || 0)) > 0" class="text-red-darken-2">
                -{{ formatCurrency(Number(repurchase.Damage_Cost || 0) + Number(repurchase.Loose_Gold_Cost || 0)) }}
              </span>
              <span v-else class="text-grey">0 ກີບ</span>
            </td>
            <td class="text-right">
              <v-chip color="red-darken-1" variant="flat" size="small">
                {{ formatCurrency(repurchase.Net_Repurchase_Price) }}
              </v-chip>
            </td>
            <td>
              <v-tooltip v-if="repurchase.Re_Reason" :text="repurchase.Re_Reason" location="top">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" :color="getReasonColor(repurchase.Re_Reason)" variant="outlined" size="small">
                    {{ getReasonShort(repurchase.Re_Reason) }}
                  </v-chip>
                </template>
              </v-tooltip>
              <span v-else class="text-grey">ບໍ່ລະບຸ</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="7" class="text-right font-weight-bold">ລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalRepurchaseValue) }}</td>
            <td></td>
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
          <span>ລວມທັງໝົດ: {{ filteredRepurchases.length }} ລາຍການ</span>
        </div>
      </div>
    </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useApi from '~/composables/useApi';

const api = useApi();

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const loading = ref(false);
const startDate = ref('');
const endDate = ref('');
const search = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Data from API
const repurchases = ref([]);

// Computed properties
const totalRepurchases = computed(() => repurchases.value.length);
const totalRepurchaseValue = computed(() => 
  repurchases.value.reduce((sum, item) => sum + Number(item.Net_Repurchase_Price || 0), 0)
);
const totalWeight = computed(() => {
  return repurchases.value.reduce((sum, item) => {
    return sum + getTotalWeight(item);
  }, 0);
});
const uniqueCustomers = computed(() => {
  const customers = new Set();
  repurchases.value.forEach(item => {
    const customerName = getCustomerDisplayName(item);
    if (customerName && customerName !== 'ລູກຄ້າພາຍນອກ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)') {
      customers.add(customerName);
    }
  });
  return customers.size;
});

// Filtered data
const filteredRepurchases = computed(() => {
  let filtered = repurchases.value;
  
  // Search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(item =>
      (getCustomerDisplayName(item).toLowerCase().includes(searchTerm)) ||
      (item.Tb_User?.username && item.Tb_User.username.toLowerCase().includes(searchTerm)) ||
      (item.Tb_Product && item.Tb_Product.some(product => 
        product.Pd_name && product.Pd_name.toLowerCase().includes(searchTerm)
      ))
    );
  }
  
  // Date range filter
  if (startDate.value) {
    filtered = filtered.filter(item => new Date(item.Re_date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(item => new Date(item.Re_date) <= new Date(endDate.value));
  }
  
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredRepurchases.value.length / itemsPerPage.value));

const paginatedRepurchases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRepurchases.value.slice(start, end);
});

// Watch for filter changes
watch([search, startDate, endDate], () => {
  currentPage.value = 1;
});

// API Functions
const fetchRepurchases = async () => {
  loading.value = true;
  try {
    const response = await api.get('/repurchases');
    repurchases.value = response || [];
  } catch (error) {
    console.error('Error fetching repurchases:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ',
      color: 'error'
    };
    repurchases.value = [];
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ກີບ';
  const numValue = Number(value);
  if (isNaN(numValue)) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(numValue) + ' ກີບ';
};

const formatDate = (dateString) => {
  if (!dateString) return 'ບໍ່ລະບຸ';
  const date = new Date(dateString);
  return date.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getReasonColor = (reason) => {
  if (!reason) return 'grey';
  const colors = {
    'ບໍ່ພໍໃຈຮູບແບບ': 'orange',
    'ຕ້ອງການເງິນດ່ວນ': 'blue',
    'ຊຳລຸດ': 'red',
    'ປ່ຽນຮູບແບບ': 'purple',
    'ຄຸນນະພາບບໍ່ດີ': 'red-darken-2',
    'ຂາຍບໍ່ອອກ': 'grey-darken-2'
  };
  return colors[reason] || 'grey';
};

const getReasonShort = (reason) => {
  if (!reason) return 'ບໍ່ລະບຸ';
  const shorts = {
    'ບໍ່ພໍໃຈຮູບແບບ': 'ບໍ່ພໍໃຈ',
    'ຕ້ອງການເງິນດ່ວນ': 'ເງິນດ່ວນ',
    'ຊຳລຸດ': 'ຊຳລຸດ',
    'ປ່ຽນຮູບແບບ': 'ປ່ຽນ',
    'ຄຸນນະພາບບໍ່ດີ': 'ຄຸນນະພາບ',
    'ຂາຍບໍ່ອອກ': 'ຂາຍບໍ່ອອກ'
  };
  return shorts[reason] || reason.substring(0, 6);
};

// Helper functions from returns.vue
const getCustomerDisplayName = (item) => {
  // If it's from existing customer (has Tb_Customer data)
  if (item.Tb_Customer?.Cust_name) {
    return item.Tb_Customer.Cust_name;
  }
  
  // Check for external customer name (field we're sending)
  if (item.externalCustomerName) {
    return item.externalCustomerName;
  }
  
  // Check for external customer data stored in the repurchase record
  if (item.External_Customer_Name) {
    return item.External_Customer_Name;
  }
  
  // Check if there's any custom customer data stored
  if (item.Customer_Name) {
    return item.Customer_Name;
  }
  
  // Try to get name from embedded customer data
  if (item.newCustomer?.name) {
    return item.newCustomer.name;
  }
  
  // Check various possible field names that backend might use
  if (item.external_customer_name) {
    return item.external_customer_name;
  }
  
  if (item.ExtCustomerName) {
    return item.ExtCustomerName;
  }
  
  // Fallback for new/external customers - more descriptive
  return 'ລູກຄ້າພາຍນອກ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)';
};

const getTotalWeight = (item) => {
  if (item.Tb_Product && item.Tb_Product.length > 0) {
    return item.Tb_Product.reduce((sum, product) => {
      const weight = Number(product.Weight || 0);
      return sum + weight;
    }, 0);
  }
  return 0;
};

const exportToExcel = async () => {
  try {
    // Import XLSX dynamically
    const XLSX = await import('xlsx');
    
    // Prepare data for export
    const exportData = filteredRepurchases.value.map((item, index) => ({
      'ລຳດັບ': index + 1,
      'ວັນທີຊື້ຄືນ': formatDate(item.Re_date),
      'ລູກຄ້າ': getCustomerDisplayName(item),
      'ຈຳນວນສິນຄ້າ': item.Tb_Product?.length || 0,
      'ນ້ຳໜັກລວມ (ກຣາມ)': getTotalWeight(item).toFixed(2),
      'ລາຄາຊື້ຄືນ (ກີບ)': Number(item.Repurchase_Price || 0),
      'ຄ່າຫັກ (ກີບ)': Number(item.Damage_Cost || 0) + Number(item.Loose_Gold_Cost || 0),
      'ສຸດທິ (ກີບ)': Number(item.Net_Repurchase_Price || 0),
      'ເຫດຜົນ': item.Re_Reason || 'ບໍ່ລະບຸ'
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານການຊື້ຄືນ');
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `ລາຍງານການຊື້ຄືນ_${today}.xlsx`;
    
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
  fetchRepurchases();
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