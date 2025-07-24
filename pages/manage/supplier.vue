<template>
  <ModernPageLayout 
    title="ຈັດການຂໍ້ມູນຜູ້ສະໜອງ"
    subtitle="ຈັດການແລະປັບປຸງຂໍ້ມູນຜູ້ສະໜອງທັງໝົດໃນລະບົບ"
    icon="mdi-truck-outline"
  >
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Summary Statistics -->
    <div class="summary-section mb-6">
            <v-row>
        <v-col cols="12" md="6">
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
        <v-col cols="12" md="6">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-file-document-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ Math.ceil(filteredSuppliers.length / itemsPerPage) }}</h3>
              <p class="stat-label">ໜ້າທັງໝົດ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Search + Add -->
    <div class="search-section">
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="ຄົ້ນຫາຜູ້ສະໜອງ"
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
            variant="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="onOpenAddDialog"
          >
            ເພີ່ມຜູ້ສະໜອງ
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
    <div v-else-if="suppliers.length === 0" class="text-center py-10">
      <v-icon size="64" color="grey-lighten-2">mdi-truck-off-outline</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນຜູ້ສະໜອງ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງກົດປຸ່ມ "ເພີ່ມ" ເພື່ອສ້າງຜູ້ສະໜອງໃໝ່.</p>
    </div>

    <!-- Modern Data Table -->
    <div v-else class="table-container">
      <v-table class="modern-table elevation-2">
        <thead>
          <tr>
            <th @click="sortBy('code')" class="cursor-pointer">
              ລະຫັດຜູ້ສະໜອງ <v-icon>{{ getSortIcon('code') }}</v-icon>
            </th>
            <th @click="sortBy('name')" class="cursor-pointer">
              ຊື່ຜູ້ສະໜອງ <v-icon>{{ getSortIcon('name') }}</v-icon>
            </th>
            <th>ເບີໂທ</th>
            <th>ທີ່ຢູ່</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedSuppliers" :key="item.id">
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
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
              </div>
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
                  ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredSuppliers.length) }} 
                  ຈາກ {{ filteredSuppliers.length }} ຜູ້ສະໜອງ
                </span>
              </div>
              
              <div class="pagination-controls">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredSuppliers.length / itemsPerPage)"
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

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          {{ isEditMode ? 'ແກ້ໄຂຜູ້ສະໜອງ' : 'ເພີ່ມຜູ້ສະໜອງ' }}
        </v-card-title>
        <v-form ref="formRef" @submit.prevent="save" v-model="formValid">
          <v-card-text class="pa-6">
            <v-text-field
              v-model="form.code"
              label="ລະຫັດຜູ້ສະໜອງ (ສ້າງອັດຕະໂນມັດ)"
              variant="outlined"
              density="comfortable"
              readonly
              disabled
              placeholder="ສ້າງອັດຕະໂນມັດ"
              class="mb-4"
            />
            <v-text-field
              v-model="form.name"
              :rules="[rules.required]"
              label="ຊື່ຜູ້ສະໜອງ"
              variant="outlined"
              density="comfortable"
              color="#365a76"
              class="mb-4"
            />
            <v-text-field
              v-model="form.phone"
              :rules="[rules.required, rules.phone]"
              label="ເບີໂທ"
              variant="outlined"
              density="comfortable"
              color="#365a76"
              class="mb-4"
            />
            <v-text-field
              v-model="form.address"
              :rules="[rules.required]"
              label="ທີ່ຢູ່"
              variant="outlined"
              density="comfortable"
              color="#365a76"
            />
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <ModernButton 
              variant="error"
              @click="dialog = false" 
              :disabled="isSaving"
            >
              ຍົກເລີກ
            </ModernButton>
            <ModernButton 
              variant="primary"
              @click="save" 
              :loading="isSaving" 
              :disabled="!formValid"
            >
              {{ isEditMode ? 'ແກ້ໄຂ' : 'ເພີ່ມ' }}
            </ModernButton>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ຢືນຢັນການລຶບ</v-card-title>
        <v-card-text class="pa-6">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <div class="text-h6 font-weight-bold mb-2">ເຕືອນ!</div>
            <div>ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ສະໜອງ <strong>"{{ itemToDelete?.name }}"</strong>?</div>
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="error"
            @click="deleteDialog = false" 
            :disabled="isSaving"
          >
            ບໍ່
          </ModernButton>
          <ModernButton 
            variant="primary"
            @click="confirmDelete" 
            :loading="isSaving"
          >
            ແມ່ນ
          </ModernButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';

const api = useApi();
const { snackbar, showSnackbar } = useSnackbar();

const isLoading = ref(true);
const isSaving = ref(false);

const search = ref('')
const page = ref(1)
const itemsPerPage = ref(8)
const sortKey = ref('name')
const sortDesc = ref(false)
const pageMenu = ref(false)

const suppliers = ref([])

const dialog = ref(false)
const deleteDialog = ref(false)
const form = ref({})
const itemToDelete = ref(null)
const formValid = ref(false)
const formRef = ref(null)
const isEditMode = ref(false)

const rules = {
  required: v => !!v || 'ຈຳເປັນຕ້ອງປ້ອນ',
  phone: v => /^\d{8,15}$/.test(v) || 'ເບີໂທບໍ່ຖືກຕ້ອງ'
}

// Helper to map backend data to frontend format
const mapToFrontend = (supplier) => ({
  id: supplier.Sup_ID,
  code: supplier.Sup_ID, // ตอนนี้เป็น INT เช่น 1, 2, 3
  name: supplier.Sup_name,
  phone: supplier.Phone,
  address: supplier.Address,
});

// Helper to map frontend form data to backend format
const mapToBackend = (formData) => ({
  Sup_name: formData.name,
  Phone: formData.phone,
  Address: formData.address,
  // ไม่ต้องส่ง Sup_ID เพราะเป็น auto-increment แล้ว
});

const totalSuppliers = computed(() => suppliers.value.length || 0);

const sortedSuppliers = computed(() => {
  const key = sortKey.value;
  const order = sortDesc.value ? -1 : 1;
  return [...suppliers.value].sort((a, b) => {
    const valA = a[key]?.toLowerCase() || '';
    const valB = b[key]?.toLowerCase() || '';
    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });
});

const filteredSuppliers = computed(() => {
  let data = sortedSuppliers.value;
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    data = data.filter(s => 
      (s.code?.toLowerCase() || '').includes(lowerSearch) || 
      (s.name?.toLowerCase() || '').includes(lowerSearch)
    );
  }
  return data;
});

const paginatedSuppliers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSuppliers.value.slice(start, end)
})

const getSuppliers = async () => {
  isLoading.value = true;
  try {
    const data = await api.get('/suppliers');
    suppliers.value = Array.isArray(data) ? data.map(mapToFrontend) : [];
  } catch (error) {
    showSnackbar('Failed to load suppliers: ' + error.message, 'error');
    suppliers.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(getSuppliers);

watch(search, () => {
  page.value = 1;
});

const resetForm = () => {
  form.value = { code: '', name: '', phone: '', address: '' }
  formRef.value?.resetValidation()
  formValid.value = false
}

const onOpenAddDialog = () => {
  resetForm()
  isEditMode.value = false
  dialog.value = true
}

const onEdit = (item) => {
  form.value = { ...item }
  isEditMode.value = true
  dialog.value = true
  formRef.value?.resetValidation()
  formValid.value = true
}

const save = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSaving.value = true;
  const backendData = mapToBackend(form.value);

  try {
    if (isEditMode.value) {
      await api.put(`/suppliers/${form.value.id}`, backendData);
    } else {
      await api.post('/suppliers', backendData);
    }

    await getSuppliers();
    dialog.value = false;
    showSnackbar(isEditMode.value ? 'ແກ້ໄຂຜູ້ສະໜອງສຳເລັດ' : 'ເພີ່ມຜູ້ສະໜອງສຳເລັດ', 'success');
  } catch (error) {
    console.error('Error saving supplier:', error);
    const errorMessage = error.message || 'An unknown error occurred';
    showSnackbar(errorMessage, 'error');
  } finally {
    isSaving.value = false;
  }
}

const onDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isSaving.value = true;
  try {
    await api.del(`/suppliers/${itemToDelete.value.id}`);
    await getSuppliers();
    deleteDialog.value = false;
    itemToDelete.value = null;
    showSnackbar('ລຶບຜູ້ສະໜອງສຳເລັດ', 'success');
  } catch (error) {
    console.error('Error deleting supplier:', error);
    showSnackbar('Failed to delete supplier: ' + error.message, 'error');
  } finally {
    isSaving.value = false;
  }
}

function goToPreviousPage() {
  if (page.value > 1) page.value--
}

function goToNextPage() {
  const totalPages = Math.ceil(filteredSuppliers.value.length / itemsPerPage.value)
  if (page.value < totalPages) page.value++
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortKey.value = key;
    sortDesc.value = false;
  }
  page.value = 1;
};

const getSortIcon = (key) => {
  if (sortKey.value !== key) {
    return 'mdi-sort';
  }
  return sortDesc.value ? 'mdi-sort-descending' : 'mdi-sort-ascending';
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
  text-transform: none !important;
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

/* Modern Dialog */
.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-title {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: 600;
  padding: 20px 24px;
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

.cursor-pointer {
  cursor: pointer;
  user-select: none;
}

.cursor-pointer:hover {
  background-color: rgba(54, 90, 118, 0.05);
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

.v-theme--dark .modern-table :deep(tbody td) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-table :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>
