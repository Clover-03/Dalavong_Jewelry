<template> 
  <ModernPageLayout 
    title="ຈັດການຂໍ້ມູນສິນຄ້າ"
    subtitle="ຄຸ້ມຄອງແລະປັບປຸງຂໍ້ມູນສິນຄ້າທັງໝົດ"
    icon="mdi-diamond-stone"
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
              <v-icon size="32" color="#365a76">mdi-diamond-stone</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalProducts }}</h3>
              <p class="stat-label">ສິນຄ້າທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-check-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ availableCount }}</h3>
              <p class="stat-label">ພ້ອມຂາຍ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-file-document-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ filteredProducts.length }}</h3>
              <p class="stat-label">ຜົນການຄົ້ນຫາ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Search and Filter Section -->
    <v-row align="center" class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          label="ຄົ້ນຫາສິນຄ້າ"
          variant="outlined"
          density="comfortable"
          hide-details
          class="search-field"
          color="#365a76"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          item-title="text"
          item-value="value"
          label="ກອງຕາມສະຖານະ"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          color="#365a76"
          prepend-inner-icon="mdi-filter"
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
      <ModernButton 
        variant="primary"
          size="large"
        prepend-icon="mdi-plus"
          @click="onOpenAddDialog"
        >
          ເພີ່ມສິນຄ້າໃໝ່
      </ModernButton>
      </v-col>
    </v-row>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-10">
      <v-icon size="64" color="grey-lighten-2">mdi-package-variant-closed-remove</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນສິນຄ້າ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງກົດປຸ່ມ "ເພີ່ມ" ເພື່ອສ້າງສິນຄ້າໃໝ່.</p>
    </div>

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th>ລຳດັບ</th>
            <th @click="sortBy('code')" class="cursor-pointer">
              ລະຫັດສິນຄ້າ <v-icon>{{ getSortIcon('code') }}</v-icon>
            </th>
            <th @click="sortBy('name')" class="cursor-pointer">
              ຊື່ສິນຄ້າ <v-icon>{{ getSortIcon('name') }}</v-icon>
            </th>
            <th @click="sortBy('category')" class="cursor-pointer">
              ປະເພດສິນຄ້າ <v-icon>{{ getSortIcon('category') }}</v-icon>
            </th>
            <th @click="sortBy('weight')" class="cursor-pointer">
              ນ້ຳຫນັກ <v-icon>{{ getSortIcon('weight') }}</v-icon>
            </th>
            <th @click="sortBy('estimatePrice')" class="cursor-pointer">
              ຄ່າກຳເໜັດ <v-icon>{{ getSortIcon('estimatePrice') }}</v-icon>
            </th>
            <th @click="sortBy('status')" class="cursor-pointer">
              ສະຖານະ <v-icon>{{ getSortIcon('status') }}</v-icon>
            </th>
            <th @click="sortBy('condition')" class="cursor-pointer">
              ສະພາບ <v-icon>{{ getSortIcon('condition') }}</v-icon>
            </th>
            <th class="text-center actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedProducts" :key="item.id" class="table-row">
            <td class="text-center">{{ (page - 1) * itemsPerPage + index + 1 }}</td>
            <td class="text-overflow">{{ item.code }}</td>
            <td class="text-overflow">{{ item.name }}</td>
            <td class="text-overflow">{{ item.category }}</td>
            <td class="text-overflow">{{ getWeightText(item.weight) }}</td>
            <td class="text-overflow price-cell">{{ formatCurrency(item.estimatePrice) }}</td>
            <td>
            <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                {{ item.status }}
              </v-chip>
            </td>
            <td>
              <v-chip :color="getConditionColor(item.condition)" size="small" variant="flat">
                {{ getConditionText(item.condition) }}
              </v-chip>
            </td>
            <td class="text-center actions-cell">
              <div class="action-buttons">
                <v-tooltip text="ແກ້ໄຂ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      @click="onEdit(item)"
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
                      @click="onDelete(item)"
                      class="action-btn"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip v-if="item.status === 'REPURCHASED' || item.status === 'DAMAGED' || item.condition === 'DAMAGED'" text="ຕັ້ງເປັນພ້ອມຂາຍ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
                      color="success"
                      @click="markAsAvailable(item)"
                      class="action-btn"
                    >
                      <v-icon>mdi-check-circle</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <!-- Modern Pagination -->
    <div v-if="!isLoading && products.length > 0" class="pagination-container">
      <v-card class="pagination-card" elevation="1">
        <v-card-text class="pa-4">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="pagination-text">
                ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredProducts.length) }} 
                ຈາກ {{ filteredProducts.length }} ສິນຄ້າ
              </span>
            </div>
            
            <div class="pagination-controls">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredProducts.length / itemsPerPage)"
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

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ເພີ່ມສິນຄ້າ</v-card-title>
        <v-form ref="addForm" @submit.prevent="saveAdd" v-model="addFormValid">
          <v-card-text class="pa-6">
            <v-text-field 
              v-model="addItem.code" 
              label="ລະຫັດສິນຄ້າ (ສ້າງອັດຕະໂນມັດ)" 
              variant="outlined"
              density="comfortable"
              readonly 
              disabled
              placeholder="ສ້າງອັດຕະໂນມັດ"
              color="#365a76"
            />
            <v-text-field 
              v-model="addItem.name" 
              label="ຊື່ສິນຄ້າ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-text-field 
              v-model="addItem.category" 
              label="ປະເພດສິນຄ້າ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-select
              v-model="addItem.weight"
              :items="weightOptions"
              item-title="text"
              item-value="value"
              label="ນ້ຳຫນັກ"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-text-field
              :model-value="formatForInput(addItem.estimatePrice)"
              @update:model-value="value => addItem.estimatePrice = parseInput(value)"
              label="ຄ່າກຳເໜັດ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              type="text"
              color="#365a76"
            />
            <v-select
              v-model="addItem.condition"
              :items="conditionOptions"
              item-title="text"
              item-value="value"
              label="ສະພາບສິນຄ້າ"
              variant="outlined"
              density="comfortable"
              color="#365a76"
            />
            <v-text-field 
              :model-value="formatCurrency(calculatedSellPrice)" 
              label="ລາຄາຂາຍໂດຍປະມານ" 
              variant="outlined"
              density="comfortable"
              readonly 
              disabled
              color="#365a76"
            />
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <ModernButton 
              variant="error"
              @click="cancelAdd"
              :disabled="loading.adding"
            >
              ຍົກເລີກ
            </ModernButton>
            <ModernButton 
              variant="primary"
              @click="saveAdd" 
              :loading="loading.adding"
              :disabled="!addFormValid"
            >
              ເພີ່ມ
            </ModernButton>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ແກ້ໄຂສິນຄ້າ</v-card-title>
        <v-form ref="editForm" @submit.prevent="saveEdit" v-model="editFormValid">
          <v-card-text class="pa-6">
            <v-text-field 
              v-model="editItem.code" 
              label="ລະຫັດສິນຄ້າ (ແກ້ໄຂບໍ່ໄດ້)" 
              variant="outlined"
              density="comfortable"
              readonly 
              disabled
              color="#365a76"
            />
            <v-text-field 
              v-model="editItem.name" 
              label="ຊື່ສິນຄ້າ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-text-field 
              v-model="editItem.category" 
              label="ປະເພດສິນຄ້າ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-select
              v-model="editItem.weight"
              :items="weightOptions"
              item-title="text"
              item-value="value"
              label="ນ້ຳຫນັກ"
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              color="#365a76"
            />
            <v-text-field
              :model-value="formatForInput(editItem.estimatePrice)"
              @update:model-value="value => editItem.estimatePrice = parseInput(value)"
              label="ຄ່າກຳເໜັດ" 
              variant="outlined"
              density="comfortable"
              :rules="[required]"
              type="text"
              color="#365a76"
            />
            <v-select
              v-model="editItem.status"
              :items="statusOptions"
              item-title="text"
              item-value="value"
              label="ສະຖານະສິນຄ້າ"
              variant="outlined"
              density="comfortable"
              color="#365a76"
            />
            <v-select
              v-model="editItem.condition"
              :items="conditionOptions"
              item-title="text"
              item-value="value"
              label="ສະພາບສິນຄ້າ"
              variant="outlined"
              density="comfortable"
              color="#365a76"
            />
            <v-text-field 
              :model-value="formatCurrency(calculatedEditSellPrice)" 
              label="ລາຄາຂາຍໂດຍປະມານ" 
              variant="outlined"
              density="comfortable"
              readonly 
              disabled
              color="#365a76"
            />
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <ModernButton 
              variant="error"
              @click="editDialog = false"
              :disabled="loading.editing"
            >
              ຍົກເລີກ
            </ModernButton>
            <ModernButton 
              variant="primary"
              @click="saveEdit" 
              :loading="loading.editing"
              :disabled="!editFormValid"
            >
              ແກ້ໄຂ
            </ModernButton>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ຢືນຢັນການລຶບ</v-card-title>
        <v-card-text class="pa-6">
          <div class="text-center py-4">
            <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle-outline</v-icon>
            <p class="text-h6 mb-2">ທ່ານແນ່ໃຈບໍ່?</p>
            <p class="text-body-2">ຕ້ອງການລຶບສິນຄ້າ "{{ itemToDelete?.name }}"?</p>
            <p class="text-caption text-error mt-3">ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້</p>
          </div>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="error"
            @click="deleteDialog = false" 
            :disabled="loading.deleting"
          >
            ບໍ່
          </ModernButton>
          <ModernButton 
            variant="primary"
            @click="confirmDelete" 
            :loading="loading.deleting"
          >
            ແມ່ນ
          </ModernButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ModernPageLayout>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useApi } from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';
import { formatCurrency, formatWeight } from '~/utils/format.js';
import ModernPageLayout from '~/components/ModernPageLayout.vue';
import ModernButton from '~/components/ModernButton.vue';

const api = useApi();
const { snackbar, showSnackbar } = useSnackbar();

const search = ref('');
const statusFilter = ref(null);
const products = ref([]);
const isLoading = ref(true);
const loading = ref({
  adding: false,
  editing: false,
  deleting: false
});
const latestGoldPrice = ref(null);

// Dialogs
const addDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

// Forms
const addForm = ref(null);
const editForm = ref(null);
const addFormValid = ref(false);
const editFormValid = ref(false);

const addItem = ref({
    code: '',
    name: '',
    category: '',
    weight: null,
    estimatePrice: 0,
    condition: 'GOOD',
});
const editItem = ref({});
const itemToDelete = ref(null);

const required = (value) => !!value || 'ກະລຸນາປ້ອນຂໍ້ມູນ';

// Sorting
const sortKey = ref('name');
const sortDesc = ref(false);

// Pagination
const page = ref(1);
const itemsPerPage = ref(10);
const pageMenu = ref(false);

// Fetch initial data
onMounted(async () => {
  // Fetch products first as it's more critical
  await fetchProducts();
  
  // Fetch gold price in parallel (non-blocking)
  fetchLatestGoldPrice().catch(err => {
    console.warn('Gold price fetch failed:', err);
  });
});

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/products');
    
    if (response && response.success) {
      products.value = response.data || [];
    } else if (response && !response.success) {
      showSnackbar(response.error || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້', 'error');
      products.value = [];
    } else {
      // response is null (likely due to auth redirect)
      products.value = [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້', 'error');
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchLatestGoldPrice = async () => {
  try {
    const response = await api.get('/prices/latest');
    if (response && response.success) {
      latestGoldPrice.value = response.data;
    } else if (response) {
      latestGoldPrice.value = response; // Direct response format
    }
  } catch (error) {
    console.warn('Could not fetch gold price:', error);
    // Don't show error for gold price as it's not critical
  }
};

// Add Dialog Logic
const onOpenAddDialog = async () => {
  addItem.value = {
    code: '',
    name: '',
    category: '',
    weight: null,
    estimatePrice: 0,
    condition: 'GOOD',
  };
  addDialog.value = true;
  await nextTick();
  addForm.value.resetValidation();
};

const cancelAdd = () => {
  addDialog.value = false;
};

const saveAdd = async () => {
  const { valid } = await addForm.value.validate();
  if (!valid) return;

  loading.value.adding = true;
  try {
    const payload = {
      Pd_name: addItem.value.name,
      Type: addItem.value.category,
      Weight: addItem.value.weight,
      Pattern_value: addItem.value.estimatePrice,
      condition: addItem.value.condition,
    };
    
    const response = await api.post('/products', payload);
    
    if (response && response.success) {
      showSnackbar('ເພີ່ມສິນຄ້າສຳເລັດ', 'success');
      addDialog.value = false;
      await fetchProducts();
    } else {
      showSnackbar(response?.error || 'ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້', 'error');
  } finally {
    loading.value.adding = false;
  }
};

// Edit Dialog Logic
const onEdit = (item) => {
  editItem.value = { ...item };
  editDialog.value = true;
};

const saveEdit = async () => {
  const { valid } = await editForm.value.validate();
  if (!valid) return;

  loading.value.editing = true;
  try {
    const payload = {
      Pd_name: editItem.value.name,
      Type: editItem.value.category,
      Weight: editItem.value.weight,
      Pattern_value: editItem.value.estimatePrice,
      status: editItem.value.status,
      condition: editItem.value.condition,
    };
    
    const response = await api.put(`/products/${editItem.value.id}`, payload);
    
    if (response && response.success) {
      showSnackbar('ແກ້ໄຂສິນຄ້າສຳເລັດ', 'success');
      editDialog.value = false;
      await fetchProducts();
    } else {
      showSnackbar(response?.error || 'ບໍ່ສາມາດແກ້ໄຂສິນຄ້າໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error editing product:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດແກ້ໄຂສິນຄ້າໄດ້', 'error');
  } finally {
    loading.value.editing = false;
  }
};

// Delete Dialog Logic
const onDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  loading.value.deleting = true;
  try {
    const response = await api.del(`/products/${itemToDelete.value.id}`);
    
    if (response && response.success) {
      showSnackbar('ລຶບສິນຄ້າສຳເລັດ', 'success');
      deleteDialog.value = false;
      itemToDelete.value = null;
      await fetchProducts();
    } else {
      showSnackbar(response?.error || 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້', 'error');
  } finally {
    loading.value.deleting = false;
  }
};

// Mark as Available
const markAsAvailable = async (item) => {
    try {
        const response = await api.put(`/products/${item.id}/status`, { status: 'AVAILABLE' });
        
        if (response && response.success) {
            showSnackbar('ອັບເດດສະຖານະສຳເລັດ', 'success');
            await fetchProducts();
        } else {
            showSnackbar(response?.error || 'ບໍ່ສາມາດອັບເດດສະຖານະໄດ້', 'error');
        }
    } catch (error) {
        console.error('Error updating product status:', error);
        showSnackbar('ບໍ່ສາມາດອັບເດດສະຖານະໄດ້: ' + (error.message || 'ເກີດຂໍ້ຜິດພາດ'), 'error');
    }
};

// Computed Properties for Display and Filtering
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const searchLower = search.value.toLowerCase();
    const matchesSearch =
      String(p.code || '').toLowerCase().includes(searchLower) ||
      p.name?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower);
    const matchesStatus = !statusFilter.value || p.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const sortedProducts = computed(() => {
  const data = [...filteredProducts.value];
  return data.sort((a, b) => {
    const keyA = a[sortKey.value];
    const keyB = b[sortKey.value];
    const order = sortDesc.value ? -1 : 1;
    if (keyA < keyB) return -1 * order;
    if (keyA > keyB) return 1 * order;
    return 0;
  });
});

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return sortedProducts.value.slice(start, start + itemsPerPage.value);
});

// Helper and Formatting Functions
const getSortIcon = (key) => {
  if (sortKey.value !== key) return 'mdi-sort';
  return sortDesc.value ? 'mdi-sort-descending' : 'mdi-sort-ascending';
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortKey.value = key;
    sortDesc.value = false;
  }
};

const statusOptions = [
  { text: 'AVAILABLE', value: 'AVAILABLE' },
  { text: 'SOLD', value: 'SOLD' },
  { text: 'REPURCHASED', value: 'REPURCHASED' },
  { text: 'DAMAGED', value: 'DAMAGED' },
];

const getWeightText = (value) => {
  return formatWeight(value);
};

const getStatusColor = (status) => {
  const colors = {
    AVAILABLE: 'green',
    SOLD: 'blue-grey',
    REPURCHASED: 'orange',
    DAMAGED: 'red',
  };
  return colors[status] || 'grey';
};

const getConditionColor = (condition) => {
  const colors = {
    GOOD: 'success',
    DAMAGED: 'error',
    NEEDS_REPAIR: 'warning',
  };
  return colors[condition] || 'grey';
};

const getConditionText = (condition) => {
  const texts = {
    GOOD: 'ສະພາບດີ',
    DAMAGED: 'ເສຍຫາຍ',
    NEEDS_REPAIR: 'ຕ້ອງຊ່ອມ',
  };
  return texts[condition] || condition;
};

const conditionOptions = [
  { text: 'ສະພາບດີ', value: 'GOOD' },
  { text: 'ເສຍຫາຍ', value: 'DAMAGED' },
  { text: 'ຕ້ອງຊ່ອມ', value: 'NEEDS_REPAIR' },
];

// Currency Input Handling
const formatForInput = (value) => {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parseInput = (value) => {
  return Number(String(value).replace(/,/g, ''));
};

// Pagination Controls
const goToPreviousPage = () => { if (page.value > 1) page.value--; };
const goToNextPage = () => {
  if (page.value < Math.ceil(filteredProducts.value.length / itemsPerPage.value)) {
    page.value++;
  }
};

// Calculated Sell Price
const calculatedSellPrice = computed(() => {
  if (!latestGoldPrice.value || !addItem.value.weight) return addItem.value.estimatePrice;

  const weightInGrams = parseFloat(addItem.value.weight);
  if (isNaN(weightInGrams)) return addItem.value.estimatePrice;

  const goldPricePerGram = latestGoldPrice.value.Sell_price / 15.16;
  const goldValue = goldPricePerGram * weightInGrams;

  return (addItem.value.estimatePrice || 0) + goldValue;
});

const calculatedEditSellPrice = computed(() => {
  if (!latestGoldPrice.value || !editItem.value.weight) return editItem.value.estimatePrice;

  const weightInGrams = parseFloat(editItem.value.weight);
  if (isNaN(weightInGrams)) return editItem.value.estimatePrice;

  const goldPricePerGram = latestGoldPrice.value.Sell_price / 15.16;
  const goldValue = goldPricePerGram * weightInGrams;

  return (editItem.value.estimatePrice || 0) + goldValue;
});

const weightOptions = [
  { text: "3.79g (1 ສະຫຼຶງ)", value: 3.79 },
  { text: "7.58g (2 ສະຫຼຶງ)", value: 7.58 },
  { text: "15.16g (1 ບາດ)", value: 15.16 },
  { text: "22.74g (1.5 ບາດ)", value: 22.74 },
  { text: "30.32g (2 ບາດ)", value: 30.32 },
  { text: "37.90g (2.5 ບາດ)", value: 37.90 },
  { text: "45.48g (3 ບາດ)", value: 45.48 },
  { text: "60.64g (4 ບາດ)", value: 60.64 },
  { text: "75.80g (5 ບາດ)", value: 75.80 },
];

// Statistics computed properties
const totalProducts = computed(() => products.value.length || 0);

const availableCount = computed(() => 
  products.value.filter(p => p.status === 'AVAILABLE').length || 0
);

const averagePrice = computed(() => {
  if (products.value.length === 0) return 0;
  const total = products.value.reduce((sum, p) => sum + (p.estimatePrice || 0), 0);
  return Math.round(total / products.value.length);
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

/* Form Field Styling */
.search-field :deep(.v-field__outline) {
  --v-field-border-color: #365a76;
}

.search-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #365a76;
  --v-field-border-width: 2px;
}

:deep(.v-text-field .v-field__outline) {
  border-radius: 12px;
}

:deep(.v-select .v-field__outline) {
  border-radius: 12px;
}

:deep(.v-text-field--focused .v-field__outline) {
  border-width: 2px;
}

:deep(.v-select--focused .v-field__outline) {
  border-width: 2px;
}

/* Modern Data Table */
:deep(.modern-table) {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

:deep(.modern-table thead tr) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
}

:deep(.modern-table thead th) {
  color: white !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 20px 16px;
  border-bottom: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.modern-table tbody tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(54, 90, 118, 0.1);
}

:deep(.modern-table tbody tr:hover) {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%);
  transform: scale(1.01);
}

:deep(.modern-table tbody td) {
  padding: 16px;
  font-weight: 500;
  color: #2d3748;
}

/* Cursor pointer for sortable columns */
.cursor-pointer {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.cursor-pointer:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
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

/* Actions Header */
.actions-header {
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
}

/* Table Cell Text Overflow */
.text-overflow {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-cell {
  max-width: 150px;
  text-align: right;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.actions-cell {
  min-width: 120px;
  width: 120px;
}

/* Table Row Styling */
.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.table-row:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Modern Table Styling */
.modern-table {
  border-radius: 12px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.modern-table thead th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  padding: 16px 20px !important;
  border: none !important;
  font-size: 0.95rem !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
}

.modern-table tbody td {
  padding: 16px 20px !important;
  font-size: 0.95rem !important;
  color: #2c3e50 !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Modern Dialog Styles */
:deep(.modern-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.dialog-title) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white !important;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  text-align: center;
  position: relative;
}

:deep(.dialog-title::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffd700, #f9a825);
  border-radius: 2px;
}

/* Status Chip Enhancement */
:deep(.v-chip) {
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
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

/* Card Actions Spacing */
:deep(.v-card-actions) {
  gap: 12px;
}

/* Loading and Empty States */
.text-center {
  color: #64748b;
}

:deep(.v-progress-circular) {
  margin: 20px auto;
}

/* Form Validation */
:deep(.v-messages__message) {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  :deep(.modern-table) {
    font-size: 0.875rem;
  }
  
  :deep(.modern-table thead th),
  :deep(.modern-table tbody td) {
    padding: 12px 8px;
  }
}

/* Dark Mode Support */
.v-theme--dark .stat-card,
.v-theme--dark .table-container {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .stat-number,
.v-theme--dark .stat-label {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode Table */
.v-theme--dark .modern-table {
  background: #1e1e1e !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .modern-table tbody td {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table tbody .table-row {
  background: #1e1e1e !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.v-theme--dark .modern-table tbody .table-row:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.06) 100%) !important;
}

.v-theme--dark .price-cell {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* Dark Mode Form Fields */
.v-theme--dark .search-field :deep(.v-field__outline) {
  --v-field-border-color: rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark .search-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #365a76 !important;
}

.v-theme--dark :deep(.v-text-field .v-field__outline),
.v-theme--dark :deep(.v-select .v-field__outline) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark :deep(.v-text-field--focused .v-field__outline),
.v-theme--dark :deep(.v-select--focused .v-field__outline) {
  border-color: #365a76 !important;
}

.v-theme--dark :deep(.v-text-field .v-field__input),
.v-theme--dark :deep(.v-select .v-field__input) {
  color: rgba(255, 255, 255, 0.9) !important;
  background: #1e1e1e !important;
}

.v-theme--dark :deep(.v-text-field .v-field__field),
.v-theme--dark :deep(.v-select .v-field__field) {
  background: #1e1e1e !important;
}

.v-theme--dark :deep(.v-text-field .v-label),
.v-theme--dark :deep(.v-select .v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark :deep(.v-text-field .v-field--focused .v-label),
.v-theme--dark :deep(.v-select .v-field--focused .v-label) {
  color: #365a76 !important;
}

/* Dark Mode Dialog Elements */
.v-theme--dark :deep(.v-dialog .v-card) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark :deep(.v-dialog .v-card-text) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark :deep(.v-dialog .v-card-actions) {
  background: #2a2a2a !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode Pagination */
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

/* Dark Mode Menu and List */
.v-theme--dark :deep(.v-menu .v-list) {
  background: #1e1e1e !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark :deep(.v-list-item) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark :deep(.v-list-item:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode Progress Circular */
.v-theme--dark :deep(.v-progress-circular) {
  color: #365a76 !important;
}
</style>
