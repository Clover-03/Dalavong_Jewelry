<template>
  <ModernPageLayout 
    title="ລາຍງານຂໍ້ມູນການຂາຍສິນຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະຂໍ້ມູນການຂາຍສິນຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-chart-line-variant"
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
              <v-icon size="32" color="#10b981">mdi-cash-register</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ filteredSales.length }}</h3>
              <p class="stat-label">ລາຍການຂາຍ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-currency-usd</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalSalesValue) }}</h3>
              <p class="stat-label">ຍອດຂາຍລວມ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-account-group</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ uniqueCustomers }}</h3>
              <p class="stat-label">ລູກຄ້າທີ່ຊື້</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-chart-bar</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ averageSaleValue }}</h3>
              <p class="stat-label">ຍອດຂາຍສະເຫຼ່ຍທັງໝົດ</p>
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
          <v-btn 
            variant="flat"
            size="large"
            prepend-icon="mdi-file-excel"
            color="success"
            class="text-white font-weight-bold"
            @click="exportToExcel"
          >
            Export Excel
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="paginatedSales.length === 0" class="text-center py-10">
      <v-icon size="64" color="grey-lighten-2">mdi-text-box-remove-outline</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນການຂາຍ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງປ່ຽນຕົວກອງ ຫຼື ຄົ້ນຫາໃຫມ່</p>
    </div>

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ເລກທີໃບຂາຍ</th>
            <th>ວັນທີຂາຍ</th>
            <th>ລູກຄ້າ</th>
            <th>ສິນຄ້າ</th>
            <th>ຜູ້ຂາຍ</th>
            <th class="text-right">ລວມເງິນ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in paginatedSales" :key="sale.Sell_ID">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ sale.Sell_ID }}</td>
            <td>{{ formatDate(sale.Sell_Date) }}</td>
            <td>{{ sale.Tb_Customer?.Cust_name || 'N/A' }}</td>
            <td>{{ sale.Tb_Product?.Pd_name || 'N/A' }}</td>
            <td>{{ sale.Tb_User?.username || 'N/A' }}</td>
            <td class="text-right">{{ formatCurrency(sale.Total) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td :colspan="6" class="text-right">ຍອດລວມທັງໝົດ:</td>
            <td class="text-right">{{ formatCurrency(totalSalesValue) }}</td>
          </tr>
        </tfoot>
      </v-table>

      <!-- Modern Pagination -->
      <div class="pagination-container mt-6">
        <div class="pagination-card">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="info-text">
                ສະແດງ {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredSales.length) }} ຈາກ {{ filteredSales.length }} ລາຍການ
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
import useApi from '~/composables/useApi';

const api = useApi();
const allSales = ref([]);
const filteredSales = ref([]);
const isLoading = ref(true);
const page = ref(1);
const itemsPerPage = ref(10);
const startDate = ref('');
const endDate = ref('');
const search = ref('');

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

const showSnackbar = (message, color = 'success') => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage.value));

const paginatedSales = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSales.value.slice(start, end);
});

const totalSalesValue = computed(() => {
  return filteredSales.value.reduce((sum, sale) => sum + Number(sale.Total), 0);
});

const uniqueCustomers = computed(() => {
  const customerSet = new Set();
  filteredSales.value.forEach(sale => {
    if (sale.Tb_Customer?.Cust_name) {
      customerSet.add(sale.Tb_Customer.Cust_name);
    }
  });
  return customerSet.size;
});

const averageSaleValue = computed(() => {
  if (filteredSales.value.length === 0) return formatCurrency(0);
  const average = totalSalesValue.value / filteredSales.value.length;
  return formatCurrency(average);
});

const fetchSales = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/public/sells');
    allSales.value = response.data || [];
    applyFilters(); // Apply initial filters
  } catch (error) {
    console.error('Error fetching sales:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSales);

const applyFilters = () => {
  let result = allSales.value;

  // Date filtering
  if (startDate.value) {
    const start = new Date(startDate.value);
    start.setHours(0, 0, 0, 0);
    result = result.filter(s => new Date(s.Sell_Date) >= start);
  }
  if (endDate.value) {
    const end = new Date(endDate.value);
    end.setHours(23, 59, 59, 999);
    result = result.filter(s => new Date(s.Sell_Date) <= end);
  }

  // Search filtering
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    result = result.filter(s =>
      s.Tb_Customer?.Cust_name?.toLowerCase().includes(lowerSearch) ||
      s.Tb_Product?.Pd_name?.toLowerCase().includes(lowerSearch)
    );
  }
  
  filteredSales.value = result;
  page.value = 1; // Reset to first page after filtering
};

// Watch for changes in filters and re-apply
watch([startDate, endDate, search], applyFilters);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-CA', options); // YYYY-MM-DD format
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(value) + ' ກີບ';
};

const goToPreviousPage = () => {
  if (page.value > 1) page.value--;
};

const goToNextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const exportToExcel = () => {
  if (filteredSales.value.length === 0) {
    showSnackbar('ບໍ່ມີຂໍ້ມູນທີ່ຈະສົ່ງອອກ', 'warning');
    return;
  }
  const dataToExport = filteredSales.value.map((sale) => ({
    'ເລກທີໃບຂາຍ': sale.Sell_ID,
    'ວັນທີຂາຍ': formatDate(sale.Sell_Date),
    'ລູກຄ້າ': sale.Tb_Customer?.Cust_name || 'N/A',
    'ສິນຄ້າ': sale.Tb_Product?.Pd_name || 'N/A',
    'ຜູ້ຂາຍ': sale.Tb_User?.username || 'N/A',
    'ລວມເງິນ (LAK)': sale.Total,
  }));
  
  // Add total row
  const totalRow = {
    'ເລກທີໃບຂາຍ': 'ຍອດລວມທັງໝົດ',
    'ລວມເງິນ (LAK)': totalSalesValue.value
  };

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.sheet_add_json(ws, [totalRow], { origin: -1, skipHeader: true });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
  XLSX.writeFile(wb, 'sales_report.xlsx');
  showSnackbar('ສົ່ງອອກ Excel ສຳເລັດ', 'success');
};
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

.cursor-pointer {
  cursor: pointer;
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
.v-theme--dark .chart-card,
.v-theme--dark .pagination-card {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .stat-number,
.v-theme--dark .stat-label,
.v-theme--dark .chart-title,
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

.v-theme--dark .chart-placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
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