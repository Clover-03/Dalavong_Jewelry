<template>
  <ModernPageLayout 
    title="ລາຍງານການສັ່ງຊື້ສິນຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະການສັ່ງຊື້ສິນຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-cart-plus"
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
              <v-icon size="32" color="#365a76">mdi-cart-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalOrders }}</h3>
              <p class="stat-label">ອໍເດີທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-check-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ completedOrders }}</h3>
              <p class="stat-label">ສຳເລັດແລ້ວ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-clock-outline</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ pendingOrders }}</h3>
              <p class="stat-label">ລໍຖ້າ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-cash-multiple</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalValue) }}</h3>
              <p class="stat-label">ມູນຄ່າລວມ</p>
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
        <v-col cols="12" md="3">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            label="ຄັ່ນລອກຕາມສະຖານະ"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            color="#365a76"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="search"
            label="ຄົ້ນຫາ (ID, ຜູ້ສະໜອງ)"
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

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ID ອໍເດີ</th>
            <th>ຜູ້ສະໜອງ</th>
            <th>ວັນທີສັ່ງ</th>
            <th class="text-right">ຍອດລວມ</th>
            <th>ສະຖານະ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedOrders" :key="item.Order_ID">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>
              <v-chip color="#365a76" variant="flat" size="small">
                {{ item.Order_ID }}
              </v-chip>
            </td>
            <td>{{ item.Sup_name }}</td>
            <td>{{ formatDate(item.Order_Date) }}</td>
            <td class="text-right">{{ formatCurrency(item.Total_Price) }}</td>
            <td>
              <v-chip 
                :color="getStatusColor(item.Status)" 
                variant="flat" 
                size="small"
              >
                {{ item.Status }}
              </v-chip>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="filteredOrders.length > 0">
          <tr class="total-row">
            <td :colspan="4" class="text-right font-weight-bold">ລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalValue) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </v-table>

      <!-- Modern Pagination -->
      <div v-if="!isLoading && filteredOrders.length > 0" class="pagination-container mt-6">
        <div class="pagination-card">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="info-text">
                ສະແດງ {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredOrders.length) }} ຈາກ {{ filteredOrders.length }} ລາຍການ
              </span>
            </div>
            <div class="pagination-controls">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredOrders.length / itemsPerPage)"
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

      <!-- Empty State -->
      <div v-if="!isLoading && filteredOrders.length === 0" class="text-center py-10">
        <v-icon size="64" color="grey-lighten-2">mdi-cart-off</v-icon>
        <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນອໍເດີ</p>
      </div>
    </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';
import * as XLSX from 'xlsx';

const api = useApi();
const { showSnackbar } = useSnackbar();

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const isLoading = ref(true);
const search = ref('');
const statusFilter = ref('');
const startDate = ref('');
const endDate = ref('');
const page = ref(1);
const itemsPerPage = ref(10);

const orders = ref([]);

const statusOptions = [
  { label: 'ທັງໝົດ', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const loadOrders = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/public/orders');
    
    // Handle public API response structure
    if (response && response.success && Array.isArray(response.data)) {
      orders.value = response.data;
    } else if (response && response.orders && Array.isArray(response.orders)) {
      orders.value = response.orders;
    } else if (Array.isArray(response)) {
      orders.value = response;
    } else {
      orders.value = [];
    }
    

    
  } catch (error) {
    console.error("Error fetching orders:", error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ',
      color: 'error'
    };
  } finally {
    isLoading.value = false;
  }
};

const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  // Filter by search
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(order =>
      (order.Sup_name?.toLowerCase().includes(searchTerm)) ||
      (order.Order_ID?.toString().includes(searchTerm))
    );
  }
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.Status === statusFilter.value);
  }
  
  // Filter by date range
  if (startDate.value) {
    filtered = filtered.filter(order => new Date(order.Order_Date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(order => new Date(order.Order_Date) <= new Date(endDate.value));
  }
  
  return filtered;
});

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

// Computed statistics
const totalOrders = computed(() => orders.value.length);
const completedOrders = computed(() => orders.value.filter(order => order.Status === 'Completed').length);
const pendingOrders = computed(() => orders.value.filter(order => order.Status === 'Pending').length);
const totalValue = computed(() => orders.value.reduce((sum, order) => sum + (order.Total_Price || 0), 0));

watch([search, statusFilter, startDate, endDate], () => {
  page.value = 1;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('lo-LA');
};

const formatCurrency = (value) => {
  if (value == null) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(value) + ' ກີບ';
};

const getStatusColor = (status) => {
  const map = { 
    'Completed': 'green', 
    'Pending': 'orange', 
    'Cancelled': 'red' 
  };
  return map[status] || 'grey';
};



const exportToExcel = () => {
  try {
    const dataToExport = filteredOrders.value.map((item, index) => ({
      'ລຳດັບ': index + 1,
      'ID ອໍເດີ': item.Order_ID,
      'ຜູ້ສະໜອງ': item.Sup_name,
      'ວັນທີສັ່ງ': formatDate(item.Order_Date),
      'ຍອດລວມ': item.Total_Price,
      'ສະຖານະ': item.Status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');
    XLSX.writeFile(workbook, 'Orders_Report.xlsx');
    
    snackbar.value = {
      show: true,
      message: 'Export Excel ສຳເລັດ',
      color: 'success'
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການ Export',
      color: 'error'
    };
  }
};

onMounted(loadOrders);
</script>

<style scoped>
/* Summary Statistics */
.summary-section {
  margin-bottom: 32px;
}

.stat-card {
  background: white;
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



/* Filters Section */
.filters-section {
  background: transparent;
  margin-bottom: 24px;
}

/* Modern Table */
.table-container {
  background: white;
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
}

.total-row {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%) !important;
  font-weight: 700 !important;
}

.total-row td {
  color: #365a76 !important;
  font-weight: 700 !important;
}

/* Enhanced pagination */
:deep(.v-pagination__item) {
  border-radius: 8px;
  font-weight: 600;
}

:deep(.v-pagination__item--active) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white;
}

/* Modern Pagination */
.pagination-container {
  margin-top: 24px;
}

.pagination-card {
  background: white;
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
.v-theme--dark .stat-card,
.v-theme--dark .table-container,
.v-theme--dark .pagination-card {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .stat-number,
.v-theme--dark .stat-label,
.v-theme--dark .info-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table :deep(tbody td) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.v-theme--dark .total-row td {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style> 