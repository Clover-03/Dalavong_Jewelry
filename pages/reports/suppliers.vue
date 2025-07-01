<template>
  <ModernPageLayout 
    title="ລາຍງານຂໍ້ມູນຜູ້ສະໜອງ"
    subtitle="ສະຫຼຸບແລະວິເຄາະຂໍ້ມູນຜູ້ສະໜອງທັງໝົດ"
    icon="mdi-truck-outline"
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
              <v-icon size="32" color="#365a76">mdi-truck</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalSuppliers }}</h3>
              <p class="stat-label">ຜູ້ສະໜອງທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-truck-check</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ activeSuppliers }}</h3>
              <p class="stat-label">ຜູ້ສະໜອງທີ່ມີການສັ່ງຊື້</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-phone</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ suppliersWithPhone }}</h3>
              <p class="stat-label">ມີເບີໂທຕິດຕໍ່</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-package-variant</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalOrders }}</h3>
              <p class="stat-label">ຄຳສັ່ງຊື້ທັງໝົດ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="ຄົ້ນຫາຜູ້ສະໜອງ"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-magnify"
            color="#365a76"
            clearable
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-title="text"
            item-value="value"
            label="ຈັດລຽງຕາມ"
            variant="outlined"
            density="comfortable"
            hide-details
            color="#365a76"
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

    <!-- Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ລະຫັດຜູ້ສະໜອງ</th>
            <th>ຊື່ຜູ້ສະໜອງ</th>
            <th>ເບີໂທ</th>
            <th>ທີ່ຢູ່</th>
            <th class="text-center">ຄຳສັ່ງຊື້</th>
            <th class="text-center">ສະຖານະ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedSuppliers.length === 0">
            <td colspan="7" class="text-center py-8">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-truck-off</v-icon>
              <div class="text-grey">ບໍ່ມີຂໍ້ມູນຜູ້ສະໜອງ</div>
            </td>
          </tr>
          <tr v-else v-for="(supplier, index) in paginatedSuppliers" :key="supplier.Sup_ID">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>
              <v-chip color="#365a76" variant="flat" size="small">
                #{{ supplier.Sup_ID }}
              </v-chip>
            </td>
            <td class="supplier-name">{{ supplier.Sup_name }}</td>
            <td>
              <div v-if="supplier.Phone" class="phone-cell">
                <v-icon size="16" color="success" class="mr-1">mdi-phone</v-icon>
                {{ supplier.Phone }}
              </div>
              <div v-else class="text-grey-lighten-1">ບໍ່ລະບຸ</div>
            </td>
            <td>
              <div v-if="supplier.Address" class="address-cell">
                <v-icon size="16" color="info" class="mr-1">mdi-map-marker</v-icon>
                {{ supplier.Address }}
              </div>
              <div v-else class="text-grey-lighten-1">ບໍ່ລະບຸ</div>
            </td>
            <td class="text-center">
              <v-chip 
                :color="getOrderCountColor(supplier.orderCount)" 
                variant="flat" 
                size="small"
              >
                {{ supplier.orderCount || 0 }} ຄຳສັ່ງ
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip 
                :color="getSupplierStatusColor(supplier)" 
                variant="flat" 
                size="small"
              >
                {{ getSupplierStatus(supplier) }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Modern Pagination -->
      <div v-if="!isLoading && suppliers.length > 0" class="pagination-container">
        <v-card class="pagination-card" elevation="1">
          <v-card-text class="pa-4">
            <div class="pagination-content">
              <div class="pagination-info">
                <span class="pagination-text">
                  ສະແດງ {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredSuppliers.length) }} 
                  ຈາກ {{ filteredSuppliers.length }} ຜູ້ສະໜອງ
                </span>
              </div>
              
              <div class="pagination-controls">
                <v-pagination
                  v-model="currentPage"
                  :length="Math.ceil(filteredSuppliers.length / itemsPerPage)"
                  :total-visible="5"
                  class="custom-pagination"
                  size="small"
                />
              </div>
              
              <div class="pagination-settings">
                <v-select
                  v-model="itemsPerPage"
                  :items="[10, 25, 50, 100]"
                  label="ລາຍການຕໍ່ໜ້າ"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="items-per-page-select"
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Supplier Performance Chart -->
    <div class="chart-section mt-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card" elevation="2">
            <v-card-title class="chart-title">
              <v-icon color="#365a76" class="mr-2">mdi-chart-bar</v-icon>
              ຜູ້ສະໜອງຍອດນິຍົມ
            </v-card-title>
            <v-card-text>
              <div class="chart-placeholder">
                <div v-for="supplier in topSuppliers" :key="supplier.Sup_ID" class="supplier-rank">
                  <div class="rank-info">
                    <span class="rank-name">{{ supplier.Sup_name }}</span>
                    <span class="rank-count">{{ supplier.orderCount }} ຄຳສັ່ງ</span>
                  </div>
                  <div class="rank-bar">
                    <div 
                      class="rank-progress" 
                      :style="{ width: `${(supplier.orderCount / maxOrders) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="chart-card" elevation="2">
            <v-card-title class="chart-title">
              <v-icon color="#365a76" class="mr-2">mdi-chart-pie</v-icon>
              ສະຖິຕິການຕິດຕໍ່
            </v-card-title>
            <v-card-text>
              <div class="contact-stats">
                <div class="contact-stat">
                  <div class="contact-label">ມີເບີໂທ</div>
                  <div class="contact-bar">
                    <div 
                      class="contact-progress phone" 
                      :style="{ width: `${phonePercentage}%` }"
                    ></div>
                  </div>
                  <div class="contact-percentage">{{ phonePercentage }}%</div>
                </div>
                <div class="contact-stat">
                  <div class="contact-label">ມີທີ່ຢູ່</div>
                  <div class="contact-bar">
                    <div 
                      class="contact-progress address" 
                      :style="{ width: `${addressPercentage}%` }"
                    ></div>
                  </div>
                  <div class="contact-percentage">{{ addressPercentage }}%</div>
                </div>
                <div class="contact-stat">
                  <div class="contact-label">ຂໍ້ມູນຄົບຖ້ວນ</div>
                  <div class="contact-bar">
                    <div 
                      class="contact-progress complete" 
                      :style="{ width: `${completePercentage}%` }"
                    ></div>
                  </div>
                  <div class="contact-percentage">{{ completePercentage }}%</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import * as XLSX from 'xlsx';
import { useApi } from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';

const api = useApi();
const { snackbar, showSnackbar } = useSnackbar();

// State
const isLoading = ref(true);
const suppliers = ref([]);
const orders = ref([]);
const search = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Sort options
const sortOptions = [
  { text: 'ຊື່ຜູ້ສະໜອງ A-Z', value: 'name' },
  { text: 'ຊື່ຜູ້ສະໜອງ Z-A', value: 'name_desc' },
  { text: 'ຄຳສັ່ງຊື້ (ໜ້ອຍ-ຫຼາຍ)', value: 'orders_asc' },
  { text: 'ຄຳສັ່ງຊື້ (ຫຼາຍ-ໜ້ອຍ)', value: 'orders_desc' },
  { text: 'ລະຫັດຜູ້ສະໜອງ', value: 'id' }
];

// Computed properties
const totalSuppliers = computed(() => suppliers.value.length);

const activeSuppliers = computed(() => 
  suppliers.value.filter(supplier => supplier.orderCount > 0).length
);

const suppliersWithPhone = computed(() => 
  suppliers.value.filter(supplier => supplier.Phone && supplier.Phone.trim() !== '').length
);

const totalOrders = computed(() => 
  suppliers.value.reduce((sum, supplier) => sum + (supplier.orderCount || 0), 0)
);

const phonePercentage = computed(() => {
  if (totalSuppliers.value === 0) return 0;
  return Math.round((suppliersWithPhone.value / totalSuppliers.value) * 100);
});

const addressPercentage = computed(() => {
  if (totalSuppliers.value === 0) return 0;
  const suppliersWithAddress = suppliers.value.filter(s => s.Address && s.Address.trim() !== '').length;
  return Math.round((suppliersWithAddress / totalSuppliers.value) * 100);
});

const completePercentage = computed(() => {
  if (totalSuppliers.value === 0) return 0;
  const completeSuppliers = suppliers.value.filter(s => 
    s.Phone && s.Phone.trim() !== '' && s.Address && s.Address.trim() !== ''
  ).length;
  return Math.round((completeSuppliers / totalSuppliers.value) * 100);
});

const filteredSuppliers = computed(() => {
  let filtered = [...suppliers.value];
  
  // Search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(supplier =>
      supplier.Sup_name?.toLowerCase().includes(searchTerm) ||
      supplier.Phone?.includes(searchTerm) ||
      supplier.Address?.toLowerCase().includes(searchTerm) ||
      supplier.Sup_ID.toString().includes(searchTerm)
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name_desc':
        return (b.Sup_name || '').localeCompare(a.Sup_name || '');
      case 'orders_asc':
        return (a.orderCount || 0) - (b.orderCount || 0);
      case 'orders_desc':
        return (b.orderCount || 0) - (a.orderCount || 0);
      case 'id':
        return a.Sup_ID - b.Sup_ID;
      case 'name':
      default:
        return (a.Sup_name || '').localeCompare(b.Sup_name || '');
    }
  });
  
  return filtered;
});

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSuppliers.value.slice(start, end);
});

const topSuppliers = computed(() => {
  return suppliers.value
    .filter(s => s.orderCount > 0)
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
    .slice(0, 5);
});

const maxOrders = computed(() => {
  return Math.max(...suppliers.value.map(s => s.orderCount || 0), 1);
});

// Methods
const fetchSuppliers = async () => {
  try {
    const response = await api.get('/public/suppliers');
    
    if (response && response.success && Array.isArray(response.data)) {
      suppliers.value = response.data;
    } else if (Array.isArray(response)) {
      suppliers.value = response;
    } else {
      suppliers.value = [];
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນຜູ້ສະໜອງ', 'error');
    suppliers.value = [];
  }
};

const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    
    if (response && response.success && Array.isArray(response.data)) {
      orders.value = response.data;
    } else if (response && Array.isArray(response.orders)) {
      orders.value = response.orders;
    } else if (Array.isArray(response)) {
      orders.value = response;
    } else {
      orders.value = [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    orders.value = [];
  }
};

const calculateOrderCounts = () => {
  const orderCounts = {};
  
  orders.value.forEach(order => {
    const supplierId = order.Sup_ID;
    if (supplierId) {
      orderCounts[supplierId] = (orderCounts[supplierId] || 0) + 1;
    }
  });
  
  suppliers.value = suppliers.value.map(supplier => ({
    ...supplier,
    orderCount: orderCounts[supplier.Sup_ID] || 0
  }));
};

const getSupplierStatus = (supplier) => {
  if (supplier.orderCount > 0) {
    if (supplier.Phone && supplier.Address) return 'ເຕັມຄວາມສາມາດ';
    return 'ໃຊ້ງານຢູ່';
  }
  return 'ບໍ່ໄດ້ໃຊ້ງານ';
};

const getSupplierStatusColor = (supplier) => {
  if (supplier.orderCount > 0) {
    if (supplier.Phone && supplier.Address) return 'success';
    return 'warning';
  }
  return 'error';
};

const getOrderCountColor = (count) => {
  if (count > 10) return 'success';
  if (count > 5) return 'warning';
  if (count > 0) return 'info';
  return 'error';
};

const exportToExcel = () => {
  try {
    const workbook = XLSX.utils.book_new();
    
    const data = [
      ['ລະຫັດຜູ້ສະໜອງ', 'ຊື່ຜູ້ສະໜອງ', 'ເບີໂທ', 'ທີ່ຢູ່', 'ຄຳສັ່ງຊື້', 'ສະຖານະ'],
      ...filteredSuppliers.value.map(supplier => [
        supplier.Sup_ID,
        supplier.Sup_name || '',
        supplier.Phone || '',
        supplier.Address || '',
        supplier.orderCount || 0,
        getSupplierStatus(supplier)
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
    
    const fileName = `suppliers_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showSnackbar('ສົ່ງອອກຂໍ້ມູນສຳເລັດ', 'success');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ', 'error');
  }
};

// Watchers
watch([search, sortBy], () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([fetchSuppliers(), fetchOrders()]);
    calculateOrderCounts();
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
});
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

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.modern-table {
  background: white;
}

.modern-table :deep(thead tr) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
}

.modern-table :deep(thead th) {
  color: white !important;
  font-weight: 600;
  padding: 16px 20px;
  border: none;
  text-transform: none !important;
}

.modern-table :deep(tbody tr) {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table :deep(tbody tr:hover) {
  background: rgba(54, 90, 118, 0.05);
}

.modern-table :deep(tbody td) {
  padding: 16px 20px;
  vertical-align: middle;
}

.supplier-name {
  font-weight: 600;
  color: #365a76;
}

.phone-cell,
.address-cell {
  display: flex;
  align-items: center;
}

/* Chart Section */
.chart-section {
  margin-top: 32px;
}

.chart-card {
  border-radius: 16px;
  border: 1px solid rgba(54, 90, 118, 0.1);
  height: 100%;
}

.chart-title {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
  color: #365a76;
  font-weight: 600;
  padding: 20px 24px;
}

.supplier-rank {
  margin-bottom: 16px;
}

.rank-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rank-name {
  font-weight: 600;
  color: #365a76;
}

.rank-count {
  font-size: 14px;
  color: #6b7280;
}

.rank-bar {
  background: #e5e7eb;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.rank-progress {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  height: 100%;
  transition: width 0.3s ease;
}

.contact-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-stat {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-label {
  min-width: 120px;
  font-weight: 600;
  color: #365a76;
}

.contact-bar {
  flex: 1;
  background: #e5e7eb;
  border-radius: 4px;
  height: 12px;
  overflow: hidden;
}

.contact-progress {
  height: 100%;
  transition: width 0.3s ease;
}

.contact-progress.phone {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.contact-progress.address {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.contact-progress.complete {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.contact-percentage {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #365a76;
}

/* Pagination */
.pagination-container {
  margin-top: 24px;
}

.pagination-card {
  border-radius: 12px !important;
  border: 1px solid rgba(54, 90, 118, 0.1) !important;
}

.pagination-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.pagination-info {
  flex: 1;
}

.pagination-text {
  color: #666;
  font-weight: 500;
}

.pagination-controls {
  flex: 2;
  display: flex;
  justify-content: center;
}

.pagination-settings {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.items-per-page-select {
  max-width: 140px;
}

.custom-pagination {
  --v-pagination-border-radius: 8px;
}

/* Dark Mode Support */
.v-theme--dark .stat-card,
.v-theme--dark .filters-section,
.v-theme--dark .table-container,
.v-theme--dark .chart-card,
.v-theme--dark .pagination-card {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .stat-number,
.v-theme--dark .rank-name,
.v-theme--dark .contact-label,
.v-theme--dark .contact-percentage {
  color: #64b5f6 !important;
}

.v-theme--dark .stat-label,
.v-theme--dark .rank-count,
.v-theme--dark .pagination-text {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .supplier-name {
  color: #64b5f6 !important;
}

.v-theme--dark .modern-table :deep(tbody tr) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: #1e1e1e !important;
}

.v-theme--dark .modern-table :deep(tbody td) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table :deep(tbody tr:hover) {
  background: rgba(54, 90, 118, 0.2) !important;
}

.v-theme--dark .chart-title {
  background: rgba(54, 90, 118, 0.2) !important;
  color: #64b5f6 !important;
}

.v-theme--dark .rank-bar,
.v-theme--dark .contact-bar {
  background: #374151 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stat-card {
    padding: 16px;
    gap: 12px;
  }
  
  .stat-icon {
    min-width: 48px;
    min-height: 48px;
    padding: 12px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .pagination-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-info,
  .pagination-controls,
  .pagination-settings {
    flex: none;
    width: 100%;
    text-align: center;
  }
  
  .contact-stat {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .contact-label {
    min-width: auto;
    text-align: center;
  }
}
</style> 