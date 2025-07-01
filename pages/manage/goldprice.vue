<template>
  <v-container fluid class="page-container">
    <!-- Modern Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <v-icon size="32" color="#ffd700">mdi-currency-usd</v-icon>
        </div>
        <div>
          <h1 class="page-title">ຈັດການຂໍ້ມູນລາຄາຄຳ</h1>
          <p class="page-subtitle">ຄຸ້ມຄອງແລະປັບປຸງລາຄາຄຳປະຈຳວັນ</p>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>

    <!-- Modern Search Card -->
    <v-card class="search-card" elevation="2">
      <v-card-text>
        <v-row align="center" no-gutters>
          <v-col cols="12" md="8">
            <!-- Quick Filter Buttons -->
            <div class="quick-filters">
              <v-btn
                variant="flat"
                color="#365a76"
                class="filter-btn"
                @click="setQuickFilter('today')"
                prepend-icon="mdi-calendar-today"
              >
                ມື້ນີ້
              </v-btn>
              <v-btn
                variant="flat"
                color="success"
                class="filter-btn"
                @click="setQuickFilter('yesterday')"
                prepend-icon="mdi-calendar-minus"
              >
                ມື້ວານ
              </v-btn>
              <v-btn
                variant="flat"
                color="info"
                class="filter-btn"
                @click="setQuickFilter('week')"
                prepend-icon="mdi-calendar-week"
              >
                7 ມື້
              </v-btn>
              <v-btn
                variant="flat"
                color="warning"
                class="filter-btn"
                @click="setQuickFilter('month')"
                prepend-icon="mdi-calendar-month"
              >
                30 ມື້
              </v-btn>
              <v-btn
                variant="outlined"
                color="error"
                class="filter-btn"
                @click="clearAllFilters"
                prepend-icon="mdi-refresh"
              >
                ລ້າງ
              </v-btn>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn 
              color="#365a76" 
              class="add-btn"
              size="large"
              @click="onOpenAddDialog"
              elevation="2"
            >
              <v-icon start>mdi-plus</v-icon>
              ເພີ່ມລາຄາໃໝ່
            </v-btn>
          </v-col>
        </v-row>

        <!-- Advanced Filters (Expandable) -->
        <v-expand-transition>
          <div v-show="showFilters" class="advanced-filters mt-4">
            <v-divider class="mb-4"></v-divider>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="ວັນທີເລີ່ມຕົ້ນ"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @update:model-value="applyFilters"
                  color="#365a76"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="filters.dateTo"
                  label="ວັນທີສິ້ນສຸດ"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @update:model-value="applyFilters"
                  color="#365a76"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.priceType"
                  :items="priceTypeOptions"
                  label="ປະເພດລາຄາ"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @update:model-value="applyFilters"
                  color="#365a76"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.sortBy"
                  :items="sortOptions"
                  label="ຈັດລຽງຕາມ"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @update:model-value="applyFilters"
                  color="#365a76"
                />
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>

        <!-- Filter Toggle Button -->
        <div class="text-center mt-3">
          <v-btn
            variant="text"
            @click="showFilters = !showFilters"
            class="toggle-filters-btn"
            color="#365a76"
          >
            <v-icon class="mr-2">{{ showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ showFilters ? 'ເຊື່ອງຕົວເລືອກ' : 'ຕົວເລືອກເພີ່ມເຕີມ' }}
          </v-btn>
        </div>
        
        <!-- Filter Info Chips -->
        <div class="filter-info mt-4">
          <v-chip
            color="#365a76"
            variant="outlined"
            size="small"
            class="mr-2"
          >
            <v-icon start size="16">mdi-currency-usd</v-icon>
            ທັງໝົດ: {{ prices.length }}
          </v-chip>
          <v-chip
            v-if="filteredPrices.length !== prices.length"
            color="success"
            variant="outlined"
            size="small"
          >
            <v-icon start size="16">mdi-filter-check</v-icon>
            ສະແດງ: {{ filteredPrices.length }}
          </v-chip>
          <v-chip
            v-if="hasActiveFilters"
            color="warning"
            variant="outlined"
            size="small"
            class="ml-2"
            @click="clearAllFilters"
            style="cursor: pointer;"
          >
            <v-icon start size="16">mdi-filter-remove</v-icon>
            ລ້າງຟິວເຕີ
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="prices.length === 0" class="empty-state-container">
      <v-icon size="64" color="grey-lighten-2">mdi-currency-usd</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນລາຄາຄຳ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງກົດປຸ່ມ "ເພີ່ມ" ເພື່ອສ້າງຂໍ້ມູນລາຄາໃໝ່.</p>
    </div>

    <!-- Modern Data Table -->
    <v-card v-else class="table-card" elevation="2">
      <v-table class="modern-table">
        <thead>
          <tr>
            <th>ລຳດັບ</th>
            <th>ວັນທີ ແລະ ເວລາ</th>
            <th>ລາຄາຊື້ (ກີບ)</th>
            <th>ລາຄາຂາຍ (ກີບ)</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedPrices" :key="item.id" class="table-row">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ formatCurrency(item.buyPrice) }}</td>
            <td>{{ formatCurrency(item.sellPrice) }}</td>
            <td class="text-center">
              <div class="action-buttons">
                <v-tooltip text="ແກ້ໄຂ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="onEdit(index)"
                      class="action-btn"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="ລຶບ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="error"
                      @click="onDelete(index)"
                      class="action-btn"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Modern Pagination -->
      <div class="pagination-container">
        <v-card class="pagination-card" elevation="1">
          <v-card-text class="pa-4">
            <div class="pagination-content">
        <div class="pagination-info">
                <span class="pagination-text">
                  ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredPrices.length) }} 
            ຈາກ {{ filteredPrices.length }} ລາຍການ
          </span>
        </div>
        
        <div class="pagination-controls">
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredPrices.length / itemsPerPage)"
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
            @update:model-value="page = 1"
                />
        </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <v-icon class="mr-3" color="white">{{ dialogMode === 'edit' ? 'mdi-pencil-circle' : 'mdi-plus-circle' }}</v-icon>
          <span class="dialog-title">{{ dialogMode === 'edit' ? 'ແກ້ໄຂ' : 'ເພີ່ມ' }} ຂໍ້ມູນລາຄາຄຳ</span>
        </div>
        <v-form ref="formRef" @submit.prevent="save" v-model="formValid">
          <v-card-text class="dialog-content">
            <v-text-field 
              v-model="form.date" 
              label="ວັນທີ ແລະ ເວລາ (ບໍ່ບັງຄັບ)" 
              type="datetime-local"
              variant="outlined"
              hint="ຖ້າບໍ່ລະບຸຈະໃຊ້ວັນທີແລະເວລາປັດຈຸບັນ"
              persistent-hint
              color="#365a76"
            />
            <v-text-field
              :model-value="formatForInput(form.buyPrice)"
              @update:model-value="value => form.buyPrice = parseInput(value)"
              label="ລາຄາຊື້"
              variant="outlined"
              :rules="[required]"
              type="text"
              color="#365a76"
            />
            <v-text-field
              :model-value="formatForInput(form.sellPrice)"
              @update:model-value="value => form.sellPrice = parseInput(value)"
              label="ລາຄາຂາຍ"
              variant="outlined"
              :rules="[required]"
              type="text"
              color="#365a76"
            />
          </v-card-text>
          <v-card-actions class="dialog-actions">
            <v-spacer />
            <v-btn 
              variant="outlined" 
              color="error" 
              @click="dialog = false" 
              :disabled="loading.submitting"
              class="px-6"
            >
              <v-icon start>mdi-close</v-icon>
              ຍົກເລີກ
            </v-btn>
            <v-btn 
              color="#365a76" 
              @click="save" 
              :loading="loading.submitting"
              class="px-6"
            >
              <v-icon start>mdi-check</v-icon>
              {{ dialogMode === 'edit' ? 'ແກ້ໄຂ' : 'ເພີ່ມ' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="dialog-card">
        <div class="dialog-header">
          <v-icon class="mr-3" color="white">mdi-delete-circle</v-icon>
          <span class="dialog-title">ຢືນຢັນການລຶບ</span>
        </div>
        <v-card-text class="dialog-content">
          <div class="text-center py-4">
            <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle-outline</v-icon>
            <p class="text-h6 mb-2">ທ່ານແນ່ໃຈບໍ່?</p>
            <p class="text-body-2">ຕ້ອງການລຶບຂໍ້ມູນລາຄານີ້</p>
            <div class="mt-3 pa-3 bg-grey-lighten-4 rounded">
              <p class="text-body-2 mb-1"><strong>ວັນທີ:</strong> {{ itemToDelete ? formatDate(itemToDelete.date) : '' }}</p>
              <p class="text-body-2 mb-1"><strong>ລາຄາຊື້:</strong> {{ itemToDelete ? formatCurrency(itemToDelete.buyPrice) : '' }}</p>
              <p class="text-body-2"><strong>ລາຄາຂາຍ:</strong> {{ itemToDelete ? formatCurrency(itemToDelete.sellPrice) : '' }}</p>
            </div>
            <p class="text-caption text-error mt-3">ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້</p>
          </div>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn 
            variant="outlined" 
            @click="deleteDialog = false" 
            :disabled="loading.deleting"
            class="px-6"
          >
            <v-icon start>mdi-close</v-icon>
            ບໍ່
          </v-btn>
          <v-btn 
            color="error" 
            @click="confirmDelete" 
            :loading="loading.deleting"
            class="px-6"
          >
            <v-icon start>mdi-delete</v-icon>
            ແມ່ນ, ລຶບ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  fetchPrices as apiFetchPrices, 
  createPrice as apiCreatePrice, 
  updatePrice as apiUpdatePrice, 
  deletePrice as apiDeletePrice 
} from '~/services/priceApi';

const isLoading = ref(true);

const page = ref(1)
const itemsPerPage = ref(8)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const prices = ref([])

// Filter System
const showFilters = ref(false)
const filters = ref({
  dateFrom: '',
  dateTo: '',
  minPrice: '',
  maxPrice: '',
  priceType: 'all',
  sortBy: 'date_desc'
})

// Filter options
const priceTypeOptions = [
  { title: 'ທັງໝົດ', value: 'all' },
  { title: 'ລາຄາຊື້', value: 'buy' },
  { title: 'ລາຄາຂາຍ', value: 'sell' }
]

const sortOptions = [
  { title: 'ວັນທີຫຼ້າສຸດກ່ອນ', value: 'date_desc' },
  { title: 'ວັນທີເກົ່າກ່ອນ', value: 'date_asc' },
  { title: 'ລາຄາຊື້ສູງສຸດ', value: 'buy_desc' },
  { title: 'ລາຄາຊື້ຕ່ຳສຸດ', value: 'buy_asc' },
  { title: 'ລາຄາຂາຍສູງສຸດ', value: 'sell_desc' },
  { title: 'ລາຄາຂາຍຕ່ຳສຸດ', value: 'sell_asc' }
]

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(
    filters.value.dateFrom ||
    filters.value.dateTo ||
    filters.value.minPrice ||
    filters.value.maxPrice ||
    filters.value.priceType !== 'all' ||
    filters.value.sortBy !== 'date_desc'
  )
})

const filteredPrices = computed(() => {
  let result = [...prices.value]

  // Date range filter
  if (filters.value.dateFrom) {
    // Appending 'T00:00:00' ensures the date is parsed in the local timezone, not UTC.
    const fromDate = new Date(filters.value.dateFrom + 'T00:00:00');
    if (!isNaN(fromDate.getTime())) {
      result = result.filter(price => new Date(price.date) >= fromDate);
    }
  }

  if (filters.value.dateTo) {
    // Appending 'T23:59:59' ensures we cover the entire 'to' date.
    const toDate = new Date(filters.value.dateTo + 'T23:59:59');
    if (!isNaN(toDate.getTime())) {
      result = result.filter(price => new Date(price.date) <= toDate);
    }
  }

  // Price range filter
  if (filters.value.minPrice) {
    const minPrice = parseFloat(filters.value.minPrice)
    if (filters.value.priceType === 'buy') {
      result = result.filter(price => price.buyPrice >= minPrice)
    } else if (filters.value.priceType === 'sell') {
      result = result.filter(price => price.sellPrice >= minPrice)
    } else {
      result = result.filter(price => price.buyPrice >= minPrice || price.sellPrice >= minPrice)
    }
  }

  if (filters.value.maxPrice) {
    const maxPrice = parseFloat(filters.value.maxPrice)
    if (filters.value.priceType === 'buy') {
      result = result.filter(price => price.buyPrice <= maxPrice)
    } else if (filters.value.priceType === 'sell') {
      result = result.filter(price => price.sellPrice <= maxPrice)
    } else {
      result = result.filter(price => price.buyPrice <= maxPrice || price.sellPrice <= maxPrice)
    }
  }

  // Sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'date_asc':
        return new Date(a.date) - new Date(b.date)
      case 'date_desc':
        return new Date(b.date) - new Date(a.date)
      case 'buy_asc':
        return a.buyPrice - b.buyPrice
      case 'buy_desc':
        return b.buyPrice - a.buyPrice
      case 'sell_asc':
        return a.sellPrice - b.sellPrice
      case 'sell_desc':
        return b.sellPrice - a.sellPrice
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })

  return result
})

const paginatedPrices = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPrices.value.slice(start, end)
})

const dialog = ref(false)
const dialogMode = ref('add')
const form = ref({ date: '', buyPrice: '', sellPrice: '' })
const editIndex = ref(-1)
const formRef = ref(null)
const formValid = ref(false)
const loading = ref({
  submitting: false,
  deleting: false
})

const required = value => !!value || 'ຈຳເປັນຕ້ອງປ້ອນ'

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

const fetchPrices = async () => {
  isLoading.value = true;
  try {
    const data = await apiFetchPrices();
    prices.value = data || []; // Handle both paginated and simple response
  } catch (error) {
    console.error('Error fetching prices:', error);
    showSnackbar('ບໍ່ສາມາດໂຫລດຂໍ້ມູນລາຄາຄຳໄດ້', 'error');
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPrices);

const onOpenAddDialog = () => {
  dialogMode.value = 'add'
  resetForm()
  dialog.value = true
}

const resetForm = () => {
  form.value = { date: '', buyPrice: '', sellPrice: '' }
  formRef.value?.resetValidation()
  formValid.value = false
}

const onEdit = (index) => {
  const price = paginatedPrices.value[index];
  if (!price) return;

  editIndex.value = price.id
  dialogMode.value = 'edit'
  
  let formattedDate = '';
  if (price.date) {
  const dateObj = new Date(price.date)
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toISOString().slice(0, 16) // Remove seconds and timezone
    }
  }
  
  form.value = { 
    date: formattedDate,
    buyPrice: price.buyPrice,
    sellPrice: price.sellPrice
  }
  formRef.value?.resetValidation()
  formValid.value = true
  dialog.value = true
}

const save = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value.submitting = true;
  try {
    const requestData = {
      buyPrice: parseInput(form.value.buyPrice),
      sellPrice: parseInput(form.value.sellPrice)
    };

    if (form.value.date && form.value.date.trim() !== '') {
      try {
        const dateObj = new Date(form.value.date);
        if (isNaN(dateObj.getTime())) {
          throw new Error('ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ');
        }
        requestData.date = dateObj.toISOString();
      } catch {
        throw new Error('ຮູບແບບວັນທີແລະເວລາບໍ່ຖືກຕ້ອງ');
      }
    }
    
    if (dialogMode.value === 'edit' && editIndex.value !== -1) {
      await apiUpdatePrice(editIndex.value, requestData);
    } else {
      await apiCreatePrice(requestData);
    }

    await fetchPrices();
    if (dialogMode.value === 'add') {
      page.value = 1; // Reset to first page after adding new price
    }
    dialog.value = false;
    showSnackbar(dialogMode.value === 'edit' ? 'ແກ້ໄຂລາຄາສຳເລັດ' : 'ເພີ່ມລາຄາສຳເລັດ');
  } catch (error) {
    console.error('Error saving price:', error);
    showSnackbar(error.message || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ', 'error');
  } finally {
    loading.value.submitting = false;
  }
}

// เพิ่ม state สำหรับ delete dialog
const deleteDialog = ref(false)
const itemToDelete = ref(null)

const onDelete = (index) => {
  const priceToDelete = paginatedPrices.value[index];
  if (!priceToDelete) return;
  
  itemToDelete.value = priceToDelete;
  deleteDialog.value = true;
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  loading.value.deleting = true;
  try {
    await apiDeletePrice(itemToDelete.value.id);
    await fetchPrices();
    deleteDialog.value = false;
    itemToDelete.value = null;
    showSnackbar('ລຶບລາຄາສຳເລັດ');
  } catch (error) {
    console.error('Error deleting price:', error);
    showSnackbar('ບໍ່ສາມາດລຶບຂໍ້ມູນລາຄາໄດ້: ' + (error.message || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ'), 'error');
  } finally {
    loading.value.deleting = false;
  }
}

function goToPreviousPage() {
  if (page.value > 1) {
    page.value--
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(filteredPrices.value.length / itemsPerPage.value)
  if (page.value < totalPages) {
    page.value++
  }
}

// Filter Functions
const applyFilters = () => {
  page.value = 1 // Reset to first page when filters change
}

const setQuickFilter = (type) => {
  const today = new Date()
  const formatDate = (date) => date.toISOString().split('T')[0]
  
  // Clear existing filters first
  clearAllFilters()
  
  switch (type) {
    case 'today':
      filters.value.dateFrom = formatDate(today)
      filters.value.dateTo = formatDate(today)
      break
      
    case 'yesterday': {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      filters.value.dateFrom = formatDate(yesterday)
      filters.value.dateTo = formatDate(yesterday)
      break
    }
      
    case 'week': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      filters.value.dateFrom = formatDate(weekAgo)
      filters.value.dateTo = formatDate(today)
      break
    }
      
    case 'month': {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      filters.value.dateFrom = formatDate(monthAgo)
      filters.value.dateTo = formatDate(today)
      break
    }
  }
  
  applyFilters()
}

const clearAllFilters = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
    priceType: 'all',
    sortBy: 'date_desc'
  }
  applyFilters()
}

// Helper function to format date for display
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }); // MM/DD/YYYY HH:mm:ss format
}

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('lo-LA').format(value);
};

const formatForInput = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parseInput = (value) => {
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};
</script>

<style scoped>
/* Page Container */
.page-container {
  background: linear-gradient(135deg, #f8faff 0%, #e3f2fd 100%);
  min-height: 100vh;
  padding: 24px;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(54, 90, 118, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.page-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 4px 0 0 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Search Card */
.search-card {
  border-radius: 16px;
  border: 1px solid rgba(54, 90, 118, 0.1);
  margin-bottom: 24px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.search-card:hover {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

/* Quick Filters */
.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.filter-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.add-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 16px rgba(54, 90, 118, 0.3);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(54, 90, 118, 0.4);
}

/* Advanced Filters */
.advanced-filters {
  padding: 0;
}

.toggle-filters-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
}

/* Filter Info */
.filter-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Loading and Empty States */
.loading-container, .empty-state-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  margin: 24px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.loading-container p {
  color: #365a76;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Table Card */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

/* Modern Table */
.modern-table {
  background: white;
}

.modern-table thead th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: 700;
  padding: 16px 20px;
  border: none;
  font-size: 0.95rem;
  text-transform: none !important;
  letter-spacing: 0.5px;
}

.modern-table tbody .table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.modern-table tbody .table-row:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-table tbody td {
  padding: 16px 20px;
  font-size: 0.95rem;
  color: #2c3e50;
  border: none;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Modern Pagination */
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

/* Dialog Styles */
.dialog-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
}

.dialog-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.dialog-content {
  padding: 32px 24px 24px;
  background: white;
}

.dialog-actions {
  padding: 16px 24px 24px;
  background: white;
  gap: 12px;
}

/* Dark Mode Support */
.v-theme--dark .page-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.v-theme--dark .search-card,
.v-theme--dark .table-card,
.v-theme--dark .dialog-content,
.v-theme--dark .dialog-actions {
  background: #2d2d2d !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--dark .search-card .v-card-text,
.v-theme--dark .table-card .v-card-text,
.v-theme--dark .dialog-card .v-card-text {
  background: #2d2d2d !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table {
  background: #2d2d2d !important;
}

.v-theme--dark .modern-table tbody td {
  color: rgba(255, 255, 255, 0.9);
  background: #2d2d2d !important;
}

.v-theme--dark .modern-table tbody .table-row:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.06) 100%);
}

.v-theme--dark .pagination-card {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .pagination-info,
.v-theme--dark .pagination-controls,
.v-theme--dark .pagination-settings {
  color: white;
}

.v-theme--dark .pagination-text {
  color: #aaa !important;
}

.v-theme--dark .loading-container,
.v-theme--dark .empty-state-container {
  background: #2d2d2d;
}

.v-theme--dark .loading-container p {
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .pagination-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .pagination-info,
  .pagination-settings {
    flex: none;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px 20px;
    margin-bottom: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .quick-filters {
    gap: 8px;
  }
  
  .filter-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
  
  .modern-table tbody td,
  .modern-table thead th {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
  
  .action-buttons {
    gap: 2px;
  }
  
  .pagination-container {
    padding: 16px;
  }
  
  .modern-pagination :deep(.v-pagination__item) {
    min-width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px 16px;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .quick-filters {
    flex-direction: column;
    gap: 6px;
  }
  
  .filter-btn {
    width: 100%;
    justify-content: center;
  }
  
  .add-btn {
    width: 100%;
    margin-top: 12px;
  }
  
  .modern-table {
    font-size: 0.8rem;
  }
  
  .dialog-content {
    padding: 20px 16px;
  }
  
  .dialog-actions {
    padding: 12px 16px 16px;
    flex-direction: column;
  }
}
</style>
