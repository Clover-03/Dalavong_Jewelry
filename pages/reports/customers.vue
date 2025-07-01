<template>
  <ModernPageLayout 
    title="ລາຍງານຂໍ້ມູນລູກຄ້າ"
    subtitle="ສະຫຼຸບແລະວິເຄາະຂໍ້ມູນລູກຄ້າທັງໝົດໃນລະບົບ"
    icon="mdi-chart-box-outline"
  >
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Summary Statistics -->
    <div class="summary-section mb-6">
      <v-row>
        <v-col cols="12" md="4">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-account-group</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalCustomers }}</h3>
              <p class="stat-label">ລູກຄ້າທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-account-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ filteredCustomers.length }}</h3>
              <p class="stat-label">ຜົນການຄົ້ນຫາ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-file-export</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ Math.ceil(filteredCustomers.length / itemsPerPage) }}</h3>
              <p class="stat-label">ໜ້າທັງໝົດ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Search and Export -->
    <div class="search-section">
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="ຄົ້ນຫາລູກຄ້າ"
            variant="outlined"
            density="comfortable"
            hide-details
            class="search-field"
            color="#365a76"
            prepend-inner-icon="mdi-magnify"
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
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="customers.length === 0" class="text-center py-10">
      <v-icon size="64" color="grey-lighten-2">mdi-account-off-outline</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນລູກຄ້າ</p>
    </div>

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ລະຫັດລູກຄ້າ</th>
            <th>ຊື່ລູກຄ້າ</th>
            <th>ເບີໂທ</th>
            <th>ທີ່ຢູ່</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedCustomers" :key="item.id">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
          </tr>
        </tbody>
      </v-table>

      <!-- Modern Pagination -->
      <div class="pagination-container mt-6">
        <div class="pagination-card">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="info-text">
                ສະແດງ {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredCustomers.length) }} ຈາກ {{ filteredCustomers.length }} ລາຍການ
              </span>
            </div>
            <div class="pagination-controls">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredCustomers.length / itemsPerPage)"
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
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { fetchCustomers } from '~/services/customerApi';

const customers = ref([]);
const search = ref('');
const isLoading = ref(true);
const page = ref(1);
const itemsPerPage = ref(10);
const pageMenu = ref(false);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const showSnackbar = (message, color = 'success') => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const totalCustomers = computed(() => customers.value.length || 0);

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value;
  const lowerSearch = search.value.toLowerCase();
  return customers.value.filter(c =>
    c.name?.toLowerCase().includes(lowerSearch) ||
    c.code?.toLowerCase().includes(lowerSearch) ||
    c.phone?.toLowerCase().includes(lowerSearch) ||
    c.address?.toLowerCase().includes(lowerSearch)
  );
});

const paginatedCustomers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCustomers.value.slice(start, end);
});

onMounted(async () => {
  isLoading.value = true;
  try {
    customers.value = await fetchCustomers();
  } catch (error) {
    console.error('Error fetching customers:', error);
    showSnackbar(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
});

function exportToExcel() {
  try {
    if (filteredCustomers.value.length === 0) {
      showSnackbar('ບໍ່ມີຂໍ້ມູນທີ່ຈະສົ່ງອອກ', 'warning');
      return;
    }
    const dataToExport = filteredCustomers.value.map((item, index) => ({
      '#': (page.value - 1) * itemsPerPage.value + index + 1,
      'ລະຫັດ': item.code,
      'ຊື່ລູກຄ້າ': item.name,
      'ເບີໂທ': item.phone,
      'ທີ່ຢູ່': item.address,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'customers_report.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ Excel', 'error');
  }
}

function goToPreviousPage() {
  if (page.value > 1) {
    page.value--;
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
  if (page.value < totalPages) {
    page.value++;
  }
}
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
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Search Section */
.search-section {
  background: transparent;
  margin-bottom: 24px;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-color: #365a76;
}

.search-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #365a76;
  --v-field-border-width: 2px;
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

/* Responsive design */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 16px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .search-section {
    padding: 16px;
  }
}
</style> 