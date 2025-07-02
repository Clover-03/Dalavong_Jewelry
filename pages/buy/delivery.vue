<template>
  <ModernPageLayout 
    title="ຈັດການຂໍ້ມູນການນຳສົ່ງສິນຄ້າ"
    subtitle="ຈັດການແລະອັບເດດສະຖານະການສັ່ງຊື້ສິນຄ້າຈາກຜູ້ສະໜອງ"
    icon="mdi-clipboard-check"
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
              <v-icon size="32" color="#365a76">mdi-clipboard-list</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalOrders }}</h3>
              <p class="stat-label">ຄຳສັ່ງຊື້ທັງໝົດ</p>
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
              <p class="stat-label">ສິນຄ້າມາຖຶງແລ້ວ</p>
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
              <p class="stat-label">ລໍຖ້າສິນຄ້າ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#e53e3e">mdi-close-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ cancelledOrders }}</h3>
              <p class="stat-label">ຍົກເລີກ</p>
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
            label="ຈັງຫວະເລືອກສະຖານະ" 
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
            label="ຄົ້ນຫາ (ຜູ້ສະໜອງ, ຄຳສັ່ງ)" 
            variant="outlined"
            density="comfortable"
          hide-details
            prepend-inner-icon="mdi-magnify" 
            color="#365a76"
          clearable
        />
      </v-col>
    </v-row>
    </div>

    <!-- Modern Data Table -->
    <div class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>#</th>
            <th>ລະຫັດຄຳສັ່ງ</th>
            <th>ຜູ້ສະໜອງ</th>
            <th>ວັນທີສັ່ງ</th>
            <th>ຈຳນວນລາຍການ</th>
            <th>ສະຖານະ</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="text-center py-8">
              <v-progress-circular indeterminate color="#365a76" />
              <div class="mt-2">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
            </td>
          </tr>
          <tr v-else-if="paginatedOrders.length === 0">
            <td colspan="7" class="text-center py-8">
              <div class="text-grey">ບໍ່ມີຂໍ້ມູນການສັ່ງຊື້</div>
            </td>
          </tr>
          <tr v-else v-for="(order, index) in paginatedOrders" :key="order.Order_ID">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>
              <v-chip color="#365a76" variant="flat" size="small">
                #{{ order.Order_ID }}
              </v-chip>
            </td>
            <td>{{ order.Tb_Supplier?.Sup_name || 'ບໍ່ລະບຸ' }}</td>
            <td>{{ formatDate(order.Order_Date) }}</td>
            <td class="text-center">
              <v-chip color="info" variant="tonal" size="small">
                {{ order.products?.length || 0 }} ລາຍການ
              </v-chip>
            </td>
            <td>
              <v-chip 
                :color="getStatusColor(order.status)" 
                variant="flat" 
                size="small"
              >
                {{ order.status }}
        </v-chip>
            </td>
            <td class="text-center">
              <div class="action-buttons">
                <v-tooltip text="ລາຍລະອຽດ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="info"
                      @click="onViewDetails(order)"
                      class="action-btn"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="ອັບເດດສະຖານະ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="onUpdateStatus(order)"
                      class="action-btn"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

    <!-- Modern Pagination -->
      <div v-if="!isLoading && orders.length > 0" class="pagination-container">
        <v-card class="pagination-card" elevation="1">
          <v-card-text class="pa-4">
            <div class="pagination-content">
              <div class="pagination-info">
                <span class="pagination-text">
                  ສະແດງ {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} 
                  ຈາກ {{ filteredOrders.length }} ຄຳສັ່ງ
                </span>
              </div>
              
              <div class="pagination-controls">
      <v-pagination
          v-model="currentPage"
          :length="Math.ceil(filteredOrders.length / itemsPerPage)"
                  :total-visible="5"
                  class="custom-pagination"
                  size="small"
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
                  class="items-per-page-select"
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- Status Update Dialog -->
    <v-dialog v-model="statusDialog" max-width="500px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          ອັບເດດສະຖານະການນຳສົ່ງສິນຄ້າ
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="mb-4">
            <strong>ລະຫັດຄຳສັ່ງ:</strong> #{{ selectedOrder?.Order_ID }}
          </div>
          <div class="mb-4">
            <strong>ຜູ້ສະໜອງ:</strong> {{ selectedOrder?.Tb_Supplier?.Sup_name || 'ບໍ່ລະບຸ' }}
          </div>
                <v-select
            v-model="newStatus"
            :items="orderStatusOptions"
            item-title="label"
            item-value="value"
            label="ເລືອກສະຖານະໃໝ່"
            variant="outlined"
            density="comfortable"
            color="#365a76"
          />
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="error"
            @click="statusDialog = false" 
          >
            ຍົກເລີກ
          </ModernButton>
          <ModernButton 
            variant="primary"
            @click="updateStatus" 
            :loading="isUpdating"
          >
            ອັບເດດ
          </ModernButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          ລາຍລະອຽດການນຳສົ່ງສິນຄ້າ
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row v-if="selectedOrder">
            <v-col cols="12" md="6">
              <div class="detail-item">
                <strong>ລະຫັດຄຳສັ່ງ:</strong> #{{ selectedOrder.Order_ID }}
                    </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <strong>ຜູ້ສະໜອງ:</strong> {{ selectedOrder.Tb_Supplier?.Sup_name || 'ບໍ່ລະບຸ' }}
                </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <strong>ວັນທີສັ່ງ:</strong> {{ formatDate(selectedOrder.Order_Date) }}
            </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <strong>ຈຳນວນລາຍການ:</strong> {{ selectedOrder.products?.length || 0 }} ລາຍການ
                    </div>
            </v-col>
            <v-col cols="12">
              <div class="detail-item">
                <strong>ສະຖານະ:</strong>
                <v-chip 
                  :color="getStatusColor(selectedOrder.status)" 
                  variant="flat" 
                  size="small"
                >
                  {{ selectedOrder.status }}
                        </v-chip>
                    </div>
            </v-col>
            <v-col cols="12" v-if="selectedOrder.products?.length > 0">
              <div class="detail-item">
                <strong>ລາຍການສິນຄ້າ:</strong>
                <div class="mt-2">
                  <v-chip 
                    v-for="(product, index) in selectedOrder.products" 
                    :key="index"
                    color="info"
                    variant="tonal"
                    size="small"
                    class="ma-1"
                  >
                    {{ product.Pd_name || product.name }} ({{ product.quantity }}x)
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="primary"
            @click="detailsDialog = false" 
          >
            ປິດ
          </ModernButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';

const { get: apiGet, put: apiPut } = useApi();

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const isLoading = ref(false);
const isUpdating = ref(false);

// Filters
const startDate = ref('');
const endDate = ref('');
const statusFilter = ref('');
const search = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Dialogs
const statusDialog = ref(false);
const detailsDialog = ref(false);
const selectedOrder = ref(null);
const newStatus = ref('');

// Status options ตรงกับ orders.vue
const statusOptions = ref([
  { label: 'ທັງໝົດ', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
]);

const orderStatusOptions = ref([
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
]);

// Data from API
const orders = ref([]);

// Computed properties
const totalOrders = computed(() => orders.value.length);
const completedOrders = computed(() => orders.value.filter(o => o.status === 'Completed').length);
const pendingOrders = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'Cancelled').length);

const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  // Filter by date
  if (startDate.value) {
    filtered = filtered.filter(o => o.Order_Date >= startDate.value);
  }
  if (endDate.value) {
    filtered = filtered.filter(o => o.Order_Date <= endDate.value);
  }
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value);
  }
  
  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(o => 
      (o.Tb_Supplier?.Sup_name || '').toLowerCase().includes(searchLower) ||
      o.Order_ID.toString().includes(searchLower)
    );
  }
  
  return filtered;
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

// Methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('lo-LA');
};

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Completed': 'green',
    'Cancelled': 'red'
  };
  return colors[status] || 'grey';
};

const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const response = await apiGet('/orders');
    
    if (response && response.orders) {
      orders.value = response.orders;
    } else if (Array.isArray(response)) {
      orders.value = response;
    } else {
      orders.value = [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ',
      color: 'error'
    };
  } finally {
    isLoading.value = false;
  }
};

const onUpdateStatus = (order) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
  statusDialog.value = true;
};

const onViewDetails = (order) => {
  selectedOrder.value = order;
  detailsDialog.value = true;
};

const updateStatus = async () => {
  try {
    isUpdating.value = true;
    
    // ส่งข้อมูลครบถ้วนตาม API requirement
    const payload = {
      Order_Date: selectedOrder.value.Order_Date,
      Sup_ID: selectedOrder.value.Sup_ID,
      status: newStatus.value,
      products: selectedOrder.value.products?.map(p => ({
        id: p.Pd_ID || p.id,
        quantity: p.quantity || 1,
        buyPrice: p.buyPrice || ((p.goldValue || 0) + (p.craftsmanshipFee || 0)),
        discount: p.discount || 0
      })) || []
    };
    
    const response = await apiPut(`/orders/${selectedOrder.value.Order_ID}`, payload);
    
    if (response) {
      // Update local data
      const index = orders.value.findIndex(o => o.Order_ID === selectedOrder.value.Order_ID);
      if (index !== -1) {
        orders.value[index].status = newStatus.value;
      }
      
      statusDialog.value = false;
      snackbar.value = {
        show: true,
        message: 'ອັບເດດສະຖານະສຳເລັດ',
        color: 'success'
      };
    }
  } catch (error) {
    console.error('Error updating status:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະ',
      color: 'error'
    };
  } finally {
    isUpdating.value = false;
  }
};

// Load data on mount
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* Summary Cards */
.summary-section {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(54, 90, 118, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  background: rgba(54, 90, 118, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 64px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #365a76;
  margin: 0 0 4px 0;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
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

.modern-table thead th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: 600;
  padding: 16px 20px;
  border: none;
  text-transform: none !important;
}

.modern-table tbody tr {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table tbody tr:hover {
  background: rgba(54, 90, 118, 0.05);
}

.modern-table tbody td {
  padding: 16px 20px;
  vertical-align: middle;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Pagination */
.pagination-container {
  margin-top: 24px;
}

.pagination-card {
  border-radius: 12px;
  border: 1px solid rgba(54, 90, 118, 0.1);
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

/* Dialog Styles */
.modern-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-title {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: 600;
  padding: 20px 24px;
  border: none;
}

.detail-item {
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-item strong {
  color: #365a76;
  font-weight: 600;
}

/* Dark Mode Support */
.v-theme--dark .stat-card {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .stat-icon {
  background: rgba(54, 90, 118, 0.2);
}

.v-theme--dark .stat-number {
  color: #64b5f6;
}

.v-theme--dark .stat-label {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .filters-section,
.v-theme--dark .table-container {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .modern-table {
  background: #1e1e1e;
}

.v-theme--dark .modern-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1e1e1e;
}

.v-theme--dark .modern-table tbody td {
  background: #1e1e1e;
  color: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .modern-table tbody tr:hover {
  background: rgba(54, 90, 118, 0.2);
}

.v-theme--dark .pagination-card {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .pagination-text {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .modern-dialog {
  background: #1e1e1e;
  color: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .detail-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .detail-item strong {
  color: #64b5f6;
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
    font-size: 1.5rem;
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
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}

/* Mobile responsive for table */
@media (max-width: 768px) {
  .modern-table {
    font-size: 0.85rem;
  }
  
  .modern-table thead th,
  .modern-table tbody td {
    padding: 12px 8px;
  }
}
</style> 