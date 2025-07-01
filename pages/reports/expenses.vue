<template>
  <ModernPageLayout 
    title="ລາຍງານຄ່າໃຊ້ຈ່າຍ"
    subtitle="ສະຫຼຸບແລະວິເຄາະຄ່າໃຊ້ຈ່າຍທັງໝົດໃນລະບົບ"
    icon="mdi-cash-minus"
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
              <v-icon size="32" color="#e53e3e">mdi-cash-minus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalExpenses) }}</h3>
              <p class="stat-label">ຄ່າໃຊ້ຈ່າຍທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-shopping-outline</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(purchaseExpenses) }}</h3>
              <p class="stat-label">ຄ່າຊື້ສິນຄ້າ ({{ purchaseCount }} ຄັ້ງ)</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-cash-refund</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(repurchaseExpenses) }}</h3>
              <p class="stat-label">ຄ່າຮັບຊື້ຄືນ ({{ repurchaseCount }} ຄັ້ງ)</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-trending-down</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ transactionCount }}</h3>
              <p class="stat-label">ຈຳນວນທັງໝົດ</p>
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
            label="ຄົ້ນຫາລາຍການຄ່າໃຊ້ຈ່າຍ" 
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

    <!-- Expense Data Table -->
    <div class="table-container">
      <v-table class="modern-table elevation-2" v-if="!isLoading">
        <thead>
          <tr>
            <th>#</th>
            <th>ວັນທີ</th>
            <th>ລາຍການ</th>
            <th>ປະເພດ</th>
            <th class="text-right">ຈຳນວນເງິນ</th>
            <th>ໝາຍເຫດ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in paginatedExpenses" :key="expense.id">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ formatDate(expense.date) }}</td>
            <td>{{ expense.description }}</td>
            <td>
              <v-chip :color="getCategoryColor(expense.category)" variant="flat" size="small">
                {{ expense.category }}
              </v-chip>
            </td>
            <td class="text-right">{{ formatCurrency(expense.amount) }}</td>
            <td>{{ expense.note || '-' }}</td>
          </tr>
        </tbody>
        <tfoot v-if="filteredExpenses.length > 0">
          <tr class="total-row">
            <td :colspan="4" class="text-right font-weight-bold">ລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalExpenses) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </v-table>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
        <p class="mt-4">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredExpenses.length === 0" class="empty-state">
        <v-icon size="64" color="grey-lighten-2">mdi-cash-minus-outline</v-icon>
        <p class="mt-4">ບໍ່ມີຂໍ້ມູນຄ່າໃຊ້ຈ່າຍ</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && filteredExpenses.length > 0" class="pagination-section mt-6">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="7"
        color="#365a76"
        variant="elevated"
        size="large"
        class="mb-4"
      />
      <div class="pagination-info">
        <p>ສະແດງ {{ (page - 1) * itemsPerPage + 1 }} - {{ Math.min(page * itemsPerPage, filteredExpenses.length) }} ຈາກ {{ filteredExpenses.length }} ລາຍການ</p>
      </div>
    </div>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';
import * as XLSX from 'xlsx';

const api = useApi();

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const isLoading = ref(false);
const startDate = ref('');
const endDate = ref('');
const search = ref('');
const page = ref(1);
const itemsPerPage = ref(10);

// Data from API
const allExpenses = ref([]);

// Computed properties
const filteredExpenses = computed(() => {
  let filtered = [...allExpenses.value];

  // Apply date filters
  if (startDate.value) {
    filtered = filtered.filter(expense => new Date(expense.date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(expense => new Date(expense.date) <= new Date(endDate.value));
  }

  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(expense => 
      expense.description.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm) ||
      (expense.note && expense.note.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
});

const paginatedExpenses = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredExpenses.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredExpenses.value.length / itemsPerPage.value);
});

const totalExpenses = computed(() => 
  filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
);

// Expense by category statistics
const purchaseExpenses = computed(() => {
  return filteredExpenses.value
    .filter(expense => expense.category === 'ຄ່າຊື້ສິນຄ້າ')
    .reduce((sum, expense) => sum + expense.amount, 0);
});

const repurchaseExpenses = computed(() => {
  return filteredExpenses.value
    .filter(expense => expense.category === 'ຄ່າຮັບຊື້ຄືນ')
    .reduce((sum, expense) => sum + expense.amount, 0);
});

const purchaseCount = computed(() => {
  return filteredExpenses.value.filter(expense => expense.category === 'ຄ່າຊື້ສິນຄ້າ').length;
});

const repurchaseCount = computed(() => {
  return filteredExpenses.value.filter(expense => expense.category === 'ຄ່າຮັບຊື້ຄືນ').length;
});

const transactionCount = computed(() => filteredExpenses.value.length);

// Methods
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(value) + ' ກີບ';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('lo-LA');
};

const getCategoryColor = (category) => {
  const colors = {
    'ຄ່າຊື້ສິນຄ້າ': 'orange',
    'ຄ່າຮັບຊື້ຄືນ': 'red',
    'ຄ່າແລກປ່ຽນ': 'purple',
    'ຄ່າບໍລິການ': 'blue',
    'ຄ່າດຳເນີນງານ': 'green'
  };
  return colors[category] || 'grey';
};

const fetchExpenses = async () => {
  isLoading.value = true;
  try {
    // Fetch purchase orders (main expense source)
    const ordersResponse = await api.get('/public/orders');
    const ordersData = ordersResponse.data || [];

    // Fetch repurchases (buy-back expenses)
    const repurchasesResponse = await api.get('/repurchases');
    const repurchasesData = repurchasesResponse || [];

    // Fetch exchanges (negative differences only)
    const exchangesResponse = await api.get('/public/exchanges');
    const exchangesData = exchangesResponse.data || [];

    // Transform orders data to expense format
    const orderExpenses = ordersData
      .filter(order => order.Status === 'Completed')
      .map(order => ({
        id: `order_${order.Order_ID}`,
        date: order.Order_Date,
        category: 'ຄ່າຊື້ສິນຄ້າ',
        description: `ຊື້ສິນຄ້າຈາກ ${order.Sup_name || 'N/A'}`,
        amount: Number(order.Total_Price || 0),
        note: `${order.products?.length || 0} ລາຍການສິນຄ້າ`
      }));

    // Transform repurchases data to expense format
    const repurchaseExpenses = repurchasesData.map(repurchase => ({
      id: `repurchase_${repurchase.Re_ID}`,
      date: repurchase.Re_date,
      category: 'ຄ່າຮັບຊື້ຄືນ',
      description: `ຮັບຊື້ຄືນຈາກ ${repurchase.Tb_Customer?.Cust_name || repurchase.externalCustomerName || 'ລູກຄ້າພາຍນອກ'}`,
      amount: Number(repurchase.Net_Repurchase_Price || 0),
      note: repurchase.Re_Reason || 'ບໍ່ລະບຸເຫດຜົນ'
    }));

    // Transform exchanges data to expense format (only negative differences)
    const exchangeExpenses = exchangesData
      .filter(exchange => Number(exchange.Difference_Calculated || 0) < 0)
      .map(exchange => ({
        id: `exchange_${exchange.Exch_ID}`,
        date: exchange.Exch_Date,
        category: 'ຄ່າແລກປ່ຽນ',
        description: `ແລກປ່ຽນໃຫ້ ${exchange.Cust_name || 'N/A'}`,
        amount: Math.abs(Number(exchange.Difference_Calculated || 0)),
        note: `${exchange.Old_Product_Name} → ${exchange.New_Product_Name}`
      }));

    // Combine all expense sources
    allExpenses.value = [...orderExpenses, ...repurchaseExpenses, ...exchangeExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

  } catch (error) {
    console.error('Error fetching expense data:', error);
    snackbar.value = {
      show: true,
      message: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນຄ່າໃຊ້ຈ່າຍໄດ້',
      color: 'error'
    };
  } finally {
    isLoading.value = false;
  }
};

const exportToExcel = () => {
  if (filteredExpenses.value.length === 0) {
    snackbar.value = {
      show: true,
      message: 'ບໍ່ມີຂໍ້ມູນສຳລັບ Export',
      color: 'warning'
    };
    return;
  }

  try {
    const excelData = filteredExpenses.value.map((expense, index) => ({
      '#': index + 1,
      'ວັນທີ': formatDate(expense.date),
      'ປະເພດຄ່າໃຊ້ຈ່າຍ': expense.category,
      'ລາຍລະອຽດ': expense.description,
      'ຈຳນວນເງິນ (ກີບ)': expense.amount,
      'ໝາຍເຫດ': expense.note || '-'
    }));

    // Add summary rows
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດຄ່າໃຊ້ຈ່າຍ': '',
      'ລາຍລະອຽດ': 'ຄ່າຊື້ສິນຄ້າ:',
      'ຈຳນວນເງິນ (ກີບ)': purchaseExpenses.value,
      'ໝາຍເຫດ': `${purchaseCount.value} ຄັ້ງ`
    });
    
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດຄ່າໃຊ້ຈ່າຍ': '',
      'ລາຍລະອຽດ': 'ຄ່າຮັບຊື້ຄືນ:',
      'ຈຳນວນເງິນ (ກີບ)': repurchaseExpenses.value,
      'ໝາຍເຫດ': `${repurchaseCount.value} ຄັ້ງ`
    });
    
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດຄ່າໃຊ້ຈ່າຍ': '',
      'ລາຍລະອຽດ': 'ລວມທັງໝົດ:',
      'ຈຳນວນເງິນ (ກີບ)': totalExpenses.value,
      'ໝາຍເຫດ': `${transactionCount.value} ລາຍການ`
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານຄ່າໃຊ້ຈ່າຍ');

    const fileName = `ລາຍງານຄ່າໃຊ້ຈ່າຍ_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    snackbar.value = {
      show: true,
      message: 'Export Excel ສຳເລັດ',
      color: 'success'
    };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    snackbar.value = {
      show: true,
      message: 'ເກີດຂໍ້ຜິດພາດໃນການ Export',
      color: 'error'
    };
  }
};

// Initialize data on mount
onMounted(() => {
  fetchExpenses();
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
  border: 2px solid rgba(54, 90, 118, 0.1);
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
  border: 2px solid rgba(54, 90, 118, 0.1);
  min-height: 200px;
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
  color: var(--text-primary);
}

.total-row {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%) !important;
  font-weight: 700 !important;
}

.total-row td {
  color: #365a76 !important;
  font-weight: 700 !important;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary);
}

.pagination-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pagination-info {
  text-align: center;
  color: var(--text-secondary);
}

/* CSS Variables for theming */
:root {
  --card-bg: white;
  --text-primary: #2d3748;
  --text-secondary: #6b7280;
}

:root.dark {
  --card-bg: #1e1e1e;
  --text-primary: #e2e8f0;
  --text-secondary: #a0aec0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --card-bg: #1e1e1e;
    --text-primary: #e2e8f0;
    --text-secondary: #a0aec0;
  }
}
</style> 