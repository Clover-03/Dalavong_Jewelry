<template>
  <ModernPageLayout 
    title="ຈັດການຂໍ້ມູນລູກຄ້າ"
    subtitle="ຄຸ້ມຄອງຂໍ້ມູນລູກຄ້າ ແລະ ການຕິດຕໍ່"
    icon="mdi-account-group"
  >
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Modern Search Section -->
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
            variant="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="onOpenAddDialog"
          >
            ເພີ່ມລູກຄ້າໃໝ່
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
      <v-icon size="64" color="grey-lighten-2">mdi-account-group-outline</v-icon>
      <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນລູກຄ້າ</p>
      <p class="text-body-1 text-grey-lighten-1">ລອງກົດປຸ່ມ "ເພີ່ມ" ເພື່ອສ້າງລູກຄ້າໃໝ່.</p>
    </div>

    <!-- Table -->
    <v-table v-else class="custom-table">
      <thead>
        <tr>
          <th @click="sortBy('code')" class="cursor-pointer">
            ລະຫັດລູກຄ້າ <v-icon>{{ getSortIcon('code') }}</v-icon>
          </th>
          <th @click="sortBy('name')" class="cursor-pointer">
            ຊື່ລູກຄ້າ <v-icon>{{ getSortIcon('name') }}</v-icon>
          </th>
          <th>ເບີໂທ</th>
          <th>ທີ່ຢູ່</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedCustomers" :key="item.id">
          <td>{{ item.id }}</td>
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
    <div v-if="!isLoading && customers.length > 0" class="pagination-container">
      <v-card class="pagination-card" elevation="1">
        <v-card-text class="pa-4">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="pagination-text">
                ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredCustomers.length) }} 
                ຈາກ {{ filteredCustomers.length }} ລູກຄ້າ
              </span>
            </div>
            
            <div class="pagination-controls">
      <v-pagination
        v-model="page"
        :length="Math.ceil(filteredCustomers.length / itemsPerPage)"
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

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="dialog-title">
          {{ isEditMode ? 'ແກ້ໄຂລູກຄ້າ' : 'ເພີ່ມລູກຄ້າ' }}
        </v-card-title>
        <v-form ref="formRef" @submit.prevent="save" v-model="formValid">
          <v-card-text>
            <v-text-field
              v-model="form.code"
              label="ລະຫັດລູກຄ້າ (ສ້າງອັດຕະໂນມັດ)"
              dense outlined
              readonly
              disabled
              placeholder="ສ້າງອັດຕະໂນມັດ"
            />
            <v-text-field
              v-model="form.name"
              :rules="[rules.required]"
              label="ຊື່ລູກຄ້າ"
              dense outlined
            />
            <v-text-field
              v-model="form.phone"
              :rules="[rules.required, rules.phone]"
              label="ເບີໂທ"
              dense outlined
            />
            <v-text-field
              v-model="form.address"
              :rules="[rules.required]"
              label="ທີ່ຢູ່"
              dense outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="outlined" color="error" @click="dialog = false" :disabled="isSaving">
              <v-icon left>mdi-close</v-icon>
              ຍົກເລີກ
            </v-btn>
            <v-btn class="btn-save" @click="save" :loading="isSaving" :disabled="!formValid">{{ isEditMode ? 'ແກ້ໄຂ' : 'ເພີ່ມ' }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="dialog-title">ຢືນຢັນການລຶບ</v-card-title>
        <v-card-text>
          ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລູກຄ້າ "{{ itemToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" color="error" @click="deleteDialog = false" :disabled="isSaving">
            <v-icon left>mdi-close</v-icon>
            ບໍ່
          </v-btn>
          <v-btn class="btn-save" @click="confirmDelete" :loading="isSaving">ແມ່ນ</v-btn>
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
const customers = ref([])

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

const fetchCustomers = async () => {
  isLoading.value = true;
  try {
    // Use public endpoint for reading customer data
    const response = await api.get('/public/customers');
    
    if (response && response.success && Array.isArray(response.data)) {
      customers.value = response.data;
    } else if (Array.isArray(response)) {
      customers.value = response;
    } else if (response && !response.success) {
      console.error('Customer fetch failed:', response);
      showSnackbar(response.error || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້', 'error');
      customers.value = [];
    } else {
      console.warn('Customer response format unexpected:', response);
      customers.value = [];
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້', 'error');
    customers.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchCustomers);

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
  const payload = {
    Cust_name: form.value.name,
    Phone: form.value.phone,
    Address: form.value.address,
    // ไม่ต้องส่ง Cust_ID เพราะเป็น auto-increment แล้ว
  };

  try {
    let response;
    if (isEditMode.value) {
      response = await api.put(`/customers/${form.value.id}`, payload);
    } else {
      response = await api.post('/customers', payload);
    }
    
    if (response && response.success) {
      showSnackbar(isEditMode.value ? 'ແກ້ໄຂລູກຄ້າສຳເລັດ' : 'ເພີ່ມລູກຄ້າສຳເລັດ', 'success');
      dialog.value = false;
      await fetchCustomers();
    } else {
      showSnackbar(response?.error || (isEditMode.value ? 'ບໍ່ສາມາດແກ້ໄຂລູກຄ້າໄດ້' : 'ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້'), 'error');
    }
  } catch (error) {
    console.error('Error saving customer:', error);
    showSnackbar(error.message || (isEditMode.value ? 'ບໍ່ສາມາດແກ້ໄຂລູກຄ້າໄດ້' : 'ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້'), 'error');
  } finally {
    isSaving.value = false;
  }
}

const onDelete = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
}

const confirmDelete = async () => {
  isSaving.value = true;
  try {
    const response = await api.del(`/customers/${itemToDelete.value.id}`);
    
    if (response && response.success) {
      showSnackbar('ລຶບລູກຄ້າສຳເລັດ', 'success');
      deleteDialog.value = false;
      itemToDelete.value = null;
      await fetchCustomers();
    } else {
      showSnackbar(response?.error || 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້', 'error');
  } finally {
    isSaving.value = false;
  }
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

const sortedCustomers = computed(() => {
  const key = sortKey.value;
  const order = sortDesc.value ? -1 : 1;
  return [...customers.value].sort((a, b) => {
    let valA, valB;
    
    if (key === 'code' || key === 'id') {
      // สำหรับตัวเลข
      valA = parseInt(a.id) || 0;
      valB = parseInt(b.id) || 0;
    } else {
      // สำหรับข้อความ
      valA = (a[key]?.toString().toLowerCase() || '');
      valB = (b[key]?.toString().toLowerCase() || '');
    }
    
    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });
});

const filteredCustomers = computed(() => {
  let data = sortedCustomers.value;
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    data = data.filter(c => 
      (c.code?.toString().toLowerCase() || '').includes(lowerSearch) || 
      (c.name?.toLowerCase() || '').includes(lowerSearch) ||
      (c.phone?.toString() || '').includes(search.value)
    );
  }
  return data;
})

const paginatedCustomers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCustomers.value.slice(start, end)
})
</script>

<style scoped>
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
.custom-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.custom-table :deep(thead tr) {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
}

.custom-table :deep(thead th) {
  color: white !important;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 20px 16px;
  border-bottom: none;
  text-transform: none !important;
  letter-spacing: 0.5px;
}

.custom-table :deep(tbody tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(54, 90, 118, 0.1);
}

.custom-table :deep(tbody tr:hover) {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.03) 0%, rgba(54, 90, 118, 0.06) 100%);
  transform: scale(1.01);
}

.custom-table :deep(tbody td) {
  padding: 16px;
  font-weight: 500;
  color: #2d3748;
}

.dialog-title {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: bold;
  padding: 20px 24px;
}

.btn-cancel {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%) !important;
  color: white !important;
  font-weight: 600;
}

.btn-save {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%) !important;
  color: white !important;
  font-weight: 600;
}

.cursor-pointer {
  cursor: pointer;
}

th.cursor-pointer {
  user-select: none;
  transition: background-color 0.2s ease;
}

th.cursor-pointer:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
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

/* Dark Mode Support */
.v-theme--dark .custom-table {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .custom-table :deep(tbody td) {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .custom-table :deep(tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.v-theme--dark .v-card {
  background: #1e1e1e !important;
}

.v-theme--dark .v-card-text {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-card-actions {
  background: #2a2a2a !important;
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

@media (max-width: 768px) {
  .search-section {
    padding: 16px;
  }
}
</style>
