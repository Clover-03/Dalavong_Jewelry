<template>
  <ModernPageLayout 
    title="ລາຍງານຂໍ້ມູນສິນຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະຂໍ້ມູນສິນຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-package-variant"
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
              <v-icon size="32" color="#10b981">mdi-package-variant</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ Array.isArray(filteredProducts) ? filteredProducts.length : 0 }}</h3>
              <p class="stat-label">ສິນຄ້າທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-check-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ availableProducts }}</h3>
              <p class="stat-label">ສິນຄ້າພ້ອມຂາຍ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#ef4444">mdi-cart-check</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ soldProducts }}</h3>
              <p class="stat-label">ສິນຄ້າຂາຍແລ້ວ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-scale-balance</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalWeight.toFixed(2) }}</h3>
              <p class="stat-label">ນ້ຳໜັກລວມ (ກຣາມ)</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Filters and Export -->
    <div class="filters-section">
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="3">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="ສະຖານະສິນຄ້າ"
            variant="outlined"
            density="comfortable"
            hide-details
            color="#365a76"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="categoryFilter"
            :items="categoryOptions"
            label="ປະເພດສິນຄ້າ"
            variant="outlined"
            density="comfortable"
            hide-details
            color="#365a76"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            v-model="search" 
            label="ຄົ້ນຫາ (ຊື່ສິນຄ້າ, ລະຫັດ)" 
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
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!Array.isArray(paginatedProducts) || paginatedProducts.length === 0" class="text-center py-10">
      <v-icon size="64" color="grey-lighten-2">mdi-package-variant-remove</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນສິນຄ້າ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງປ່ຽນຕົວກອງ ຫຼື ຄົ້ນຫາໃຫມ່</p>
    </div>

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ລະຫັດສິນຄ້າ</th>
            <th>ຊື່ສິນຄ້າ</th>
            <th>ປະເພດ</th>
            <th>ນ້ຳໜັກ (ກຣາມ)</th>
            <th>ລາຄາ</th>
            <th>ສະຖານະ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.id || product.Pd_ID">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ product.code || product.Pd_ID || 'N/A' }}</td>
            <td>{{ product.name || product.Pd_name || 'N/A' }}</td>
            <td>{{ product.category || product.Type || product.Category || 'N/A' }}</td>
            <td>{{ formatWeight(product.weight || product.Weight || 0) }}</td>
            <td>{{ formatCurrency(product.estimatePrice || product.Pattern_value || product.Price || 0) }}</td>
            <td>
              <v-chip 
                :color="getStatusColor(product.status)" 
                variant="flat" 
                size="small"
              >
                {{ getStatusText(product.status) }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Modern Pagination -->
      <div class="pagination-container mt-6">
        <div class="pagination-card">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="info-text">
                ສະແດງ {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, Array.isArray(filteredProducts) ? filteredProducts.length : 0) }} ຈາກ {{ Array.isArray(filteredProducts) ? filteredProducts.length : 0 }} ລາຍການ
              </span>
            </div>
            <div class="pagination-controls">
        <v-pagination
          v-model="page"
          :length="totalPages"
                :total-visible="5"
                density="comfortable"
              />
            </div>
            <div class="pagination-settings">
              <v-select
                v-model="itemsPerPage"
                :items="[5, 10, 15, 20]"
                label="ລາຍການຕໍ່ໜ້າ"
                variant="outlined"
                density="compact"
                hide-details
                style="width: 140px;"
                @update:model-value="page = 1"
              />
            </div>
          </div>
        </div>
      </div>
  </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import * as XLSX from 'xlsx';
import { useApi } from '~/composables/useApi';
// import { formatWeight } from '~/utils/format.js'; // Remove if utils not available

const api = useApi();
const allProducts = ref([]);
const filteredProducts = ref([]);
const isLoading = ref(true);
const page = ref(1);
const itemsPerPage = ref(10);
const search = ref('');
const statusFilter = ref('');
const categoryFilter = ref('');

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Use English status values to match database
const statusOptions = [
  { title: 'Available', value: 'AVAILABLE' },
  { title: 'Sold', value: 'SOLD' },
  { title: 'Repurchased', value: 'REPURCHASED' },
                    { title: 'Exchanged', value: 'EXCHANGED' }
];

const categoryOptions = ref([]);

const showSnackbar = (message, color = 'success') => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const totalPages = computed(() => {
  if (!Array.isArray(filteredProducts.value)) return 0;
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
  if (!Array.isArray(filteredProducts.value)) return [];
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const availableProducts = computed(() => {
  if (!Array.isArray(filteredProducts.value)) return 0;
  return filteredProducts.value.filter(p => p.status === 'AVAILABLE').length;
});

const soldProducts = computed(() => {
  if (!Array.isArray(filteredProducts.value)) return 0;
  return filteredProducts.value.filter(p => p.status === 'SOLD').length;
});

const totalWeight = computed(() => {
  if (!Array.isArray(filteredProducts.value)) return 0;
  return filteredProducts.value.reduce((sum, product) => {
    const weight = product.weight || product.Weight || 0;
    return sum + Number(weight);
  }, 0);
});

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    // Initialize with empty arrays to prevent errors
    allProducts.value = [];
    filteredProducts.value = [];
    
    const response = await api.get('/products');
    
    // Handle different response structures and ensure we have an array
    let productsData = [];
    if (response && response.success && Array.isArray(response.data)) {
      productsData = response.data;
    } else if (response && Array.isArray(response)) {
      productsData = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      productsData = response.data;
    } else {
      console.warn('Products response is not an array:', response);
      productsData = [];
    }
    
    // Ensure we always set an array
    allProducts.value = Array.isArray(productsData) ? productsData : [];
    
    // Extract unique categories safely
    if (Array.isArray(productsData) && productsData.length > 0) {
      const categories = [...new Set(productsData.map(p => p.category || p.Type || p.Category).filter(Boolean))];
      categoryOptions.value = categories.map(cat => ({ title: cat, value: cat }));
    } else {
      categoryOptions.value = [];
    }
    
    applyFilters();
  } catch (error) {
    console.error('Error fetching products:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ', 'error');
    allProducts.value = [];
    filteredProducts.value = [];
    categoryOptions.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProducts);

const applyFilters = () => {
  // Ensure allProducts.value is an array
  let result = Array.isArray(allProducts.value) ? allProducts.value : [];

  // Status filtering
  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value);
  }

  // Category filtering
  if (categoryFilter.value) {
    result = result.filter(p => (p.category || p.Type || p.Category) === categoryFilter.value);
  }

  // Search filtering
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    result = result.filter(p => {
      const name = p.name || p.Pd_name || '';
      const code = p.code || p.Pd_ID || '';
      return name.toLowerCase().includes(lowerSearch) ||
             code.toString().includes(lowerSearch);
    });
  }
  
  filteredProducts.value = result;
  page.value = 1;
};

watch([search, statusFilter, categoryFilter], applyFilters);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-CA', options);
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(value) + ' ກີບ';
};

const formatWeight = (value) => {
  if (value === null || value === undefined) return '0';
  return Number(value).toFixed(2);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'AVAILABLE': return 'success';
    case 'SOLD': return 'error';
    case 'REPURCHASED': return 'warning';
    case 'EXCHANGED': return 'info';
    default: return 'grey';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'AVAILABLE': return 'Available';
    case 'SOLD': return 'Sold';
    case 'REPURCHASED': return 'Repurchased';
    case 'EXCHANGED': return 'Exchanged';
    default: return status || 'Unknown';
  }
};

const goToPreviousPage = () => {
  if (page.value > 1) page.value--;
};

const goToNextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const exportToExcel = () => {
  if (!Array.isArray(filteredProducts.value) || filteredProducts.value.length === 0) {
    showSnackbar('ບໍ່ມີຂໍ້ມູນທີ່ຈະສົ່ງອອກ', 'warning');
    return;
  }
  
  const dataToExport = filteredProducts.value.map((product) => ({
    'ລະຫັດສິນຄ້າ': product.code || product.Pd_ID || 'N/A',
    'ຊື່ສິນຄ້າ': product.name || product.Pd_name || 'N/A',
    'ປະເພດ': product.category || product.Type || product.Category || 'N/A',
    'ນ້ຳໜັກ (ກຣາມ)': product.weight || product.Weight || 0,
    'ລາຄາ (LAK)': product.estimatePrice || product.Pattern_value || product.Price || 0,
    'ສະຖານະ': getStatusText(product.status),
  }));

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Product Report');
  XLSX.writeFile(wb, 'product_inventory_report.xlsx');
  showSnackbar('ສົ່ງອອກ Excel ສຳເລັດ', 'success');
};
</script> 

<style scoped>
.summary-section {
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
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
  color: #365a76;
  margin: 0 0 4px 0;
  word-break: break-all;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.filters-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.table-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
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
  border-bottom: 1px solid rgba(54, 90, 118, 0.1);
}

.modern-table :deep(tbody tr:hover) {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%);
  transform: scale(1.01);
}

.modern-table :deep(tbody td) {
  padding: 16px;
  font-weight: 500;
  color: #2d3748;
  background: transparent;
}

:deep(.v-pagination__item) {
  border-radius: 8px;
  font-weight: 600;
}

:deep(.v-pagination__item--active) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white;
}

.cursor-pointer {
  cursor: pointer;
}

/* Modern Pagination */
.pagination-container {
  margin-top: 24px;
}

.pagination-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
  padding: 16px 24px;
}

.pagination-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pagination-info {
  flex: 1;
  min-width: 200px;
}

.info-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.pagination-controls {
  flex: 0 0 auto;
}

.pagination-settings {
  flex: 0 0 auto;
}

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

  .pagination-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-info {
    text-align: center;
    min-width: auto;
  }
}

/* Dark Mode Support */
.v-theme--dark .stat-card {
  background: rgba(30, 30, 30, 0.8) !important;
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .stat-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.v-theme--dark .stat-number {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .stat-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .filters-section {
  background: rgba(30, 30, 30, 0.6) !important;
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .table-container {
  background: rgba(30, 30, 30, 0.8) !important;
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .modern-table :deep(tbody td) {
  color: rgba(255, 255, 255, 0.9) !important;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .modern-table :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.v-theme--dark .pagination-card {
  background: rgba(30, 30, 30, 0.8) !important;
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .info-text {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .stat-icon {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.2) 0%, rgba(54, 90, 118, 0.1) 100%);
}

/* Custom scrollbar for dark mode */
.v-theme--dark ::-webkit-scrollbar {
  width: 8px;
}

.v-theme--dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.v-theme--dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.v-theme--dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style> 