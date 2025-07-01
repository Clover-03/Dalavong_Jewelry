<template>
  <ModernPageLayout 
    title="ລາຍງານລາຍຮັບ"
    subtitle="ສະຫຼຸບແລະວິເຄາະລາຍຮັບທັງໝົດໃນລະບົບ"
    icon="mdi-cash-plus"
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
              <v-icon size="32" color="#10b981">mdi-cash-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalIncome) }}</h3>
              <p class="stat-label">ລາຍຮັບທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-shopping</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(salesIncome) }}</h3>
              <p class="stat-label">ລາຍຮັບຂາຍ ({{ salesCount }} ຄັ້ງ)</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-swap-horizontal</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(exchangeIncome) }}</h3>
              <p class="stat-label">ລາຍຮັບແລກປ່ຽນ ({{ exchangeCount }} ຄັ້ງ)</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#365a76">mdi-trending-up</v-icon>
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
            label="ຄົ້ນຫາລາຍການລາຍຮັບ" 
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

    <!-- Income Data Table -->
    <div class="table-container">
      <v-table class="modern-table elevation-2" v-if="!isLoading">
        <thead>
          <tr>
            <th>#</th>
            <th>ວັນທີ</th>
            <th>ປະເພດລາຍຮັບ</th>
            <th>ລາຍລະອຽດ</th>
            <th class="text-right">ຈຳນວນເງິນ</th>
            <th>ສະຖານະ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(income, index) in paginatedIncomes" :key="income.id">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ formatDate(income.date) }}</td>
            <td>
              <v-chip :color="getCategoryColor(income.category)" variant="flat" size="small">
                {{ income.category }}
              </v-chip>
            </td>
            <td>{{ income.description }}</td>
            <td class="text-right">{{ formatCurrency(income.amount) }}</td>
            <td>
              <v-chip color="success" variant="elevated" size="small">
                Completed
              </v-chip>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="filteredIncomes.length > 0">
          <tr class="total-row">
            <td :colspan="4" class="text-right font-weight-bold">ລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalIncome) }}</td>
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
      <div v-if="!isLoading && filteredIncomes.length === 0" class="empty-state">
        <v-icon size="64" color="grey-lighten-2">mdi-cash-off</v-icon>
        <p class="mt-4">ບໍ່ມີຂໍ້ມູນລາຍຮັບ</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && filteredIncomes.length > 0" class="pagination-section mt-6">
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
        <p>ສະແດງ {{ (page - 1) * itemsPerPage + 1 }} - {{ Math.min(page * itemsPerPage, filteredIncomes.length) }} ຈາກ {{ filteredIncomes.length }} ລາຍການ</p>
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
const allIncomes = ref([]);

// Computed properties
const filteredIncomes = computed(() => {
  let filtered = [...allIncomes.value];

  // Apply date filters
  if (startDate.value) {
    filtered = filtered.filter(income => new Date(income.date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(income => new Date(income.date) <= new Date(endDate.value));
  }

  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(income => 
      income.description.toLowerCase().includes(searchTerm) ||
      income.category.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
});

const paginatedIncomes = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredIncomes.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredIncomes.value.length / itemsPerPage.value);
});

const totalIncome = computed(() => 
  filteredIncomes.value.reduce((sum, income) => sum + income.amount, 0)
);

const monthlyIncome = computed(() => {
  // Calculate current month income
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return filteredIncomes.value
    .filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    })
    .reduce((sum, income) => sum + income.amount, 0);
});

const averageIncome = computed(() => {
  if (filteredIncomes.value.length === 0) return 0;
  return totalIncome.value / filteredIncomes.value.length;
});

const transactionCount = computed(() => filteredIncomes.value.length);

// Income by category statistics
const salesIncome = computed(() => {
  return filteredIncomes.value
    .filter(income => income.category === 'ການຂາຍສິນຄ້າ')
    .reduce((sum, income) => sum + income.amount, 0);
});

const exchangeIncome = computed(() => {
  return filteredIncomes.value
    .filter(income => income.category === 'ການແລກປ່ຽນ')
    .reduce((sum, income) => sum + income.amount, 0);
});

const salesCount = computed(() => {
  return filteredIncomes.value.filter(income => income.category === 'ການຂາຍສິນຄ້າ').length;
});

const exchangeCount = computed(() => {
  return filteredIncomes.value.filter(income => income.category === 'ການແລກປ່ຽນ').length;
});

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
    'ການຂາຍສິນຄ້າ': 'green',
    'ການແລກປ່ຽນ': 'blue',
    'ການບໍລິການ': 'purple'
  };
  return colors[category] || 'grey';
};

const fetchIncomes = async () => {
  isLoading.value = true;
  try {
    // Fetch sales data (main income source)
    const salesResponse = await api.get('/public/sells');
    const salesData = salesResponse.data || [];

    // Fetch exchanges data (additional income from exchanges)
    const exchangesResponse = await api.get('/public/exchanges');
    const exchangesData = exchangesResponse.data || [];

    // Transform sales data to income format
    const salesIncomes = salesData.map(sale => ({
      id: `sale_${sale.Sell_ID}`,
      date: sale.Sell_Date,
      category: 'ການຂາຍສິນຄ້າ',
      description: `ຂາຍ ${sale.Tb_Product?.Pd_name || 'N/A'} ໃຫ້ ${sale.Tb_Customer?.Cust_name || 'N/A'}`,
      amount: Number(sale.Total || 0),
      status: 'Completed'
    }));

    // Transform exchanges data to income format (only positive differences)
    const exchangeIncomes = exchangesData
      .filter(exchange => Number(exchange.Difference_Calculated || 0) > 0)
      .map(exchange => ({
        id: `exchange_${exchange.Exch_ID}`,
        date: exchange.Exch_Date,
        category: 'ການແລກປ່ຽນ',
        description: `ແລກປ່ຽນ ${exchange.Old_Product_Name || 'N/A'} ເປັນ ${exchange.New_Product_Name || 'N/A'} ໃຫ້ ${exchange.Cust_name || 'N/A'}`,
        amount: Number(exchange.Difference_Calculated || 0),
        status: 'Completed'
      }));

    // Combine all income sources
    allIncomes.value = [...salesIncomes, ...exchangeIncomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching income data:', error);
    snackbar.value = {
      show: true,
      message: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລາຍຮັບໄດ້',
      color: 'error'
    };
  } finally {
    isLoading.value = false;
  }
};

const exportToExcel = () => {
  if (filteredIncomes.value.length === 0) {
    snackbar.value = {
      show: true,
      message: 'ບໍ່ມີຂໍ້ມູນສຳລັບ Export',
      color: 'warning'
    };
    return;
  }

  try {
    const excelData = filteredIncomes.value.map((income, index) => ({
      '#': index + 1,
      'ວັນທີ': formatDate(income.date),
      'ປະເພດລາຍຮັບ': income.category,
      'ລາຍລະອຽດ': income.description,
      'ຈຳນວນເງິນ (ກີບ)': income.amount,
      'ສະຖານະ': income.status
    }));

    // Add summary rows
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດລາຍຮັບ': '',
      'ລາຍລະອຽດ': 'ລາຍຮັບຈາກການຂາຍ:',
      'ຈຳນວນເງິນ (ກີບ)': salesIncome.value,
      'ສະຖານະ': `${salesCount.value} ຄັ້ງ`
    });
    
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດລາຍຮັບ': '',
      'ລາຍລະອຽດ': 'ລາຍຮັບຈາກການແລກປ່ຽນ:',
      'ຈຳນວນເງິນ (ກີບ)': exchangeIncome.value,
      'ສະຖານະ': `${exchangeCount.value} ຄັ້ງ`
    });
    
    excelData.push({
      '#': '',
      'ວັນທີ': '',
      'ປະເພດລາຍຮັບ': '',
      'ລາຍລະອຽດ': 'ລວມທັງໝົດ:',
      'ຈຳນວນເງິນ (ກີບ)': totalIncome.value,
      'ສະຖານະ': `${transactionCount.value} ລາຍການ`
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'ລາຍງານລາຍຮັບ');

    const fileName = `ລາຍງານລາຍຮັບ_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  fetchIncomes();
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