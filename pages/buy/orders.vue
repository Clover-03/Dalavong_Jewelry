<template>
  <v-container fluid class="page-container">
    <!-- Modern Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="header-title">ຈັດການຂໍ້ມູນການສັ່ງຊື້</h1>
          <p class="header-subtitle">ຄຸ້ມຄອງແລະຈັດການອໍເດີການສັ່ງຊື້ສິນຄ້າ</p>
        </div>
        <div class="header-actions">
          <v-btn 
            color="primary" 
            size="large"
            class="add-btn"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
          >
            ເພີ່ມການສັ່ງຊື້
          </v-btn>
        </div>
      </div>
    </div>

      <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
        {{ snackbar.message }}
      </v-snackbar>

    <!-- Modern Search Card -->
    <v-card class="search-card mb-6" elevation="2">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="4">
            <div class="search-wrapper">
          <v-text-field
            v-model="search"
                label="ຄົ້ນຫາອໍເດີ..."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-magnify"
                clearable
            hide-details
                class="search-field"
              />
            </div>
        </v-col>
          <v-col cols="12" md="3">
           <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="ກອງຕາມສະຖານະ"
              variant="outlined"
              density="comfortable"
            hide-details
            clearable
              prepend-inner-icon="mdi-filter"
          />
        </v-col>
          <v-col cols="12" md="5">
            <div class="filter-info">
              <v-chip 
                color="primary" 
                variant="tonal" 
                size="small"
                prepend-icon="mdi-database"
              >
                ທັງໝົດ {{ orders.length }} ອໍເດີ
              </v-chip>
              <v-chip 
                color="success" 
                variant="tonal" 
                size="small"
                prepend-icon="mdi-filter"
                class="ml-2"
              >
                ສະແດງ {{ filteredOrders.length }} ອໍເດີ
              </v-chip>
            </div>
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
      
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <v-card class="loading-card" elevation="2">
        <v-card-text class="text-center py-12">
          <v-progress-circular 
            indeterminate 
            color="primary" 
            size="64"
            width="6"
          />
          <p class="loading-text mt-6">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
        </v-card-text>
      </v-card>
      </div>

    <!-- Modern Data Table -->
    <v-card v-else class="data-card" elevation="2">
      <v-card-text class="pa-0">
        <div class="table-header">
          <h3 class="table-title">ລາຍການອໍເດີການສັ່ງຊື້</h3>
        </div>
        
        <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="paginatedOrders"
        :items-per-page="-1"
        hide-default-footer
            class="modern-data-table"
        item-value="Order_ID"
      >
        <template #[`item.index`]="{ index }">
              <div class="index-cell">
                <v-chip size="small" color="primary" variant="tonal">
          {{ (page - 1) * itemsPerPage + index + 1 }}
                </v-chip>
              </div>
        </template>

        <template #[`item.Order_Date`]="{ item }">
              <div class="date-cell">
                <v-icon size="small" color="primary" class="mr-2">mdi-calendar</v-icon>
                <span>{{ formatDate(item.Order_Date) }}</span>
              </div>
        </template>
        
        <template #[`item.products`]="{ item }">
              <div class="products-cell">
                <v-chip size="small" color="info" variant="tonal">
          {{ item.products.length }} ລາຍການ
                </v-chip>
              </div>
        </template>

        <template #[`item.status`]="{ item }">
              <v-chip :color="getStatusColor(item.status)" class="status-chip" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
              <div class="action-buttons">
                <v-tooltip text="ເບິ່ງສິນຄ້າ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
              color="info"
              @click="viewProducts(item)"
                      class="action-btn"
                    >
                      <v-icon>mdi-package-variant</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="ເບິ່ງໃບສັ່ງຊື້" location="top">
              <template v-slot:activator="{ props }">
                    <v-btn
                  v-bind="props"
                      icon
                      size="small"
                      variant="text"
                  color="teal"
                  @click="viewPurchaseOrder(item)"
                      class="action-btn"
                >
                      <v-icon>mdi-receipt-text</v-icon>
                    </v-btn>
              </template>
            </v-tooltip>
                
                <v-tooltip text="ແກ້ໄຂ" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      variant="text"
              color="primary"
              @click="editOrder(item)"
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
              @click="deleteOrderDialog(item)"
                      class="action-btn"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
          </div>
        </template>
      </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <!-- Modern Pagination -->
    <div v-if="!isLoading && orders.length > 0" class="pagination-container">
      <v-card class="pagination-card" elevation="1">
        <v-card-text class="pa-4">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="pagination-text">
                ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredOrders.length) }} 
                ຈາກ {{ filteredOrders.length }} ອໍເດີ
              </span>
            </div>
            
            <div class="pagination-controls">
        <v-pagination
          v-model="page"
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

      <!-- Dialog: Add/Edit Order -->
      <v-dialog v-model="dialog" max-width="1200px">
        <v-card>
          <v-card-title class="dialog-title">
            {{ isEditMode ? 'ແກ້ໄຂການສັ່ງຊື້' : 'ເພີ່ມການສັ່ງຊື້' }}
          </v-card-title>
            <v-card-text>
            <v-form ref="formRef" v-model="formValid">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    :model-value="isEditMode ? `#${form.Order_ID}` : '[ສ້າງໃໝ່ອັດຕະໂນມັດ]'"
                    label="ເລກທີໃບສັ່ງຊື້"
                    readonly
                    disabled
                    dense
                    outlined
                    class="order-id-field"
                    style="color: #222; font-weight: bold; background: #f5f5f5;"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
              <v-text-field
                    v-model="form.Order_Date"
                        label="ວັນທີສັ່ງ"
                    type="date"
                        outlined dense
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.Sup_ID"
                    :items="suppliers"
                    item-title="name"
                    item-value="id"
                    label="ເລືອກຜູ້ສະໜອງ"
                    outlined dense clearable
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.status"
                    :items="['Pending', 'Completed', 'Cancelled']"
                    label="ສະຖານະ"
                    outlined dense clearable
                     :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
                              <v-card class="mt-4" variant="outlined">
                <v-card-title class="text-subtitle-1 bg-blue-lighten-5 pa-3">
                  <v-icon left class="mr-2">mdi-cart</v-icon>
                  ເລືອກສິນຄ້າ
                  <v-spacer />
                  <v-btn color="primary" size="small" prepend-icon="mdi-plus" variant="elevated" @click="productSelectionDialog = true">
                    ເພີ່ມສິນຄ້າ
                  </v-btn>
                </v-card-title>
                
                <v-card-text>
                  <v-table v-if="form.products?.length" class="items-table elevation-1">
                    <thead>
                      <tr class="bg-grey-lighten-3">
                        <th class="text-left font-weight-bold" style="width: 15%;">ຊື່ສິນຄ້າ</th>
                        <th class="text-center font-weight-bold" style="width: 10%;">ນ້ຳໜັກ</th>
                        <th class="text-center font-weight-bold" style="width: 8%;">ຈຳນວນ</th>
                        <th class="text-right font-weight-bold" style="width: 16%;">ລາຄາຄຳ (ກີບ)</th>
                        <th class="text-right font-weight-bold" style="width: 16%;">ຄ່າກຳເໜັດ (ກີບ)</th>
                        <th class="text-right font-weight-bold" style="width: 13%;">ສ່ວນຫຼຸດ (ກີບ)</th>
                        <th class="text-right font-weight-bold" style="width: 12%;">ລວມ (ກີບ)</th>
                        <th class="text-center font-weight-bold" style="width: 10%;">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in form.products" :key="index" 
                          :class="index % 2 === 0 ? 'bg-grey-lighten-5' : ''">
                        <td class="font-weight-medium">{{ item.name }}</td>
                        <td class="text-center">
                          <v-chip size="small" color="primary" variant="outlined">
                            {{ getWeightText(item.weight) }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          <v-text-field
                            v-model.number="item.quantity"
                            type="number"
                            min="1"
                            density="compact"
                            hide-details
                            variant="outlined"
                            class="text-center quantity-field"
                          />
                        </td>
                        <td class="text-right">
                          <v-text-field
                            :model-value="formatForInput(item.goldValue)"
                            @update:model-value="value => { item.goldValue = parseInput(value); }"
                            type="text"
                            min="0"
                            density="compact"
                            hide-details
                            variant="outlined"
                            class="text-right price-field"
                            prepend-inner-icon="mdi-gold"
                          />
                        </td>
                        <td class="text-right">
                          <v-text-field
                            :model-value="formatForInput(item.craftsmanshipFee)"
                            @update:model-value="value => { item.craftsmanshipFee = parseInput(value); }"
                            type="text"
                            min="0"
                            density="compact"
                            hide-details
                            variant="outlined"
                            class="text-right price-field"
                            prepend-inner-icon="mdi-hammer-wrench"
                          />
                        </td>
                        <td class="text-right">
                          <v-text-field
                            :model-value="formatForInput(item.discount)"
                            @update:model-value="value => { item.discount = parseInput(value); }"
                            type="text"
                            min="0"
                            density="compact"
                            hide-details
                            variant="outlined"
                            class="text-right price-field"
                            prepend-inner-icon="mdi-sale"
                          />
                        </td>
                        <td class="text-right font-weight-bold text-green">
                          {{ formatCurrency(((item.quantity * (item.goldValue + item.craftsmanshipFee)) - item.discount) || 0) }}
                        </td>
                        <td class="text-center">
                          <v-tooltip text="ລຶບສິນຄ້ານີ້">
                            <template v-slot:activator="{ props }">
                              <v-btn v-bind="props" color="error" size="small" icon variant="text" @click="removeProduct(index)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="7" class="text-right font-weight-bold pa-2">ລວມກ່ອນສ່ວນຫຼຸດ:</td>
                        <td class="text-right font-weight-bold pa-2">{{ formatCurrency(totalAmountBeforeDiscount) }}</td>
                      </tr>
                      <tr>
                        <td colspan="7" class="text-right font-weight-bold pa-2">ສ່ວນຫຼຸດທັງໝົດ:</td>
                        <td class="text-right font-weight-bold pa-2">{{ formatCurrency(totalDiscount) }}</td>
                      </tr>
                      <tr>
                        <td colspan="7" class="text-right font-weight-bold text-h6 pa-3">ລວມທັງໝົດສຸດທິ:</td>
                        <td class="text-right font-weight-bold text-h6 text-green pa-3">{{ formatCurrency(grandTotal) }}</td>
                      </tr>
                    </tfoot>
                  </v-table>
                  <v-alert v-else type="info" text class="mt-2"> ກະລຸນາເພີ່ມສິນຄ້າ </v-alert>
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="outlined" color="error" @click="dialog = false" :disabled="isSaving">
              <v-icon left>mdi-close</v-icon>
              ຍົກເລີກ
            </v-btn>
            <v-btn class="btn-save" @click="saveOrder" :loading="isSaving" :disabled="!formValid">ບັນທຶກ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Product List Viewer - Modern Design -->
      <v-dialog v-model="productDialog" max-width="700px">
        <v-card class="modern-card">
          <!-- Simple Header -->
          <div class="modern-header">
            <div class="header-content">
              <v-icon color="white" size="32" class="mr-3">mdi-clipboard-list</v-icon>
              <div>
                <h3 class="header-title">ອໍເດີຊື້ #{{ selectedOrder?.Order_ID }}</h3>
                <p class="header-subtitle">{{ formatDate(selectedOrder?.Order_Date) }}</p>
              </div>
            </div>
          </div>

          <v-card-text class="modern-content">
            <!-- Supplier Info -->
            <div class="info-card supplier-card">
              <div class="card-header">
                <v-icon color="primary" class="mr-2">mdi-store</v-icon>
                <span class="card-title">ຜູ້ສະໜອງ</span>
              </div>
              <p class="supplier-name">{{ selectedOrder?.Tb_Supplier?.Sup_name || 'N/A' }}</p>
            </div>

            <!-- Order Status -->
            <div class="order-status">
              <div class="status-label">
                <v-icon color="info" size="20">mdi-check-circle</v-icon>
                <span>ສະຖານະ</span>
              </div>
              <v-chip :color="getStatusColor(selectedOrder?.status)" size="small" class="status-chip">
                {{ selectedOrder?.status }}
              </v-chip>
            </div>

            <!-- Products Summary -->
            <div class="products-card">
              <div class="card-header">
                <v-icon color="orange" class="mr-2">mdi-package-variant</v-icon>
                <span class="card-title">ສິນຄ້າທີ່ສັ່ງຊື້</span>
                <v-spacer></v-spacer>
                <v-chip color="info" variant="outlined" size="small">
                  {{ selectedOrder?.products?.length || 0 }} ລາຍການ
                </v-chip>
              </div>
              
              <div v-if="selectedOrder?.products?.length > 0" class="products-list">
                <div v-for="product in selectedOrder.products" :key="product.Pd_ID" class="product-row">
                  <div class="product-info">
                    <div class="product-name">{{ product.Pd_name }}</div>
                    <div class="product-details">
                      <span>{{ getWeightText(getProductWeight(product.Pd_ID)) }}</span>
                      <span class="divider">•</span>
                      <span>ຈຳນວນ: {{ product.quantity }}</span>
                    </div>
                  </div>
                  <div class="product-price">
                    <div class="price-value">{{ formatCurrency(product.buyPrice) }}</div>
                    <div v-if="product.discount > 0" class="discount-value">-{{ formatCurrency(product.discount) }}</div>
                  </div>
                </div>
              </div>
              
              <v-alert v-else type="info" variant="tonal" class="mt-3">
                <v-icon start>mdi-information</v-icon>
                ບໍ່ມີສິນຄ້າໃນການສັ່ງຊື້ນີ້
              </v-alert>
            </div>

            <!-- Total -->
            <div v-if="selectedOrder?.products?.length > 0" class="result-card">
              <div class="result-header">
                <v-icon color="info" class="mr-2">mdi-calculator</v-icon>
                <span>ຍອດລວມທັງໝົດ</span>
              </div>
              <div class="result-content">
                <v-chip color="success" class="total-chip">
                  {{ formatCurrency(calculateGrandTotal(selectedOrder.products)) }}
                </v-chip>
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="modern-actions">
            <v-spacer></v-spacer>
            <v-btn variant="elevated" color="primary" @click="productDialog = false" class="close-btn">
              <v-icon left>mdi-check</v-icon>
              ປິດ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog: Purchase Order Viewer -->
      <v-dialog v-model="purchaseOrderDialog" max-width="900px">
          <v-card>
              <PurchaseOrderComponent v-if="selectedOrder" :order="selectedOrder" @close="purchaseOrderDialog = false" />
        </v-card>
      </v-dialog>

      <!-- Product Selection Dialog -->
      <v-dialog v-model="productSelectionDialog" max-width="800px">
        <v-card>
          <v-card-title class="dialog-title">
            <v-icon left class="mr-2">mdi-package-variant</v-icon>
            ເລືອກສິນຄ້າເພື່ອເພີ່ມໃສ່ອໍເດີ
          </v-card-title>
          <v-card-text>
            <v-text-field 
              v-model="productSearch" 
              label="ຄົ້ນຫາສິນຄ້າ" 
              prepend-inner-icon="mdi-magnify" 
              variant="outlined" 
              density="comfortable"
              class="mt-4 mb-6" 
              clearable
              hide-details
            />
          <div class="table-responsive">
            <v-table class="elevation-1 product-selection-table">
              <thead>
                <tr>
                  <th class="product-name-col">ຊື່ສິນຄ້າ</th>
                  <th class="product-category-col">ປະເພດ</th>
                  <th class="product-weight-col">ນ້ຳໜັກ</th>
                  <th class="product-price-col">ລາຄາຊື້</th>
                  <th class="product-action-col">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in filteredAvailableProducts" :key="product.id"
                    :class="index % 2 === 0 ? 'bg-grey-lighten-5' : ''"
                    class="product-data-row">
                  <td class="product-name-col" :title="product.name">
                    <span class="product-name-text">{{ product.name }}</span>
                  </td>
                  <td class="product-category-col">
                    <v-chip size="small" color="info" variant="tonal" class="category-chip">
                      {{ product.category }}
                    </v-chip>
                  </td>
                  <td class="product-weight-col">
                    <v-chip size="small" color="primary" variant="outlined" class="weight-chip">
                      {{ getWeightText(product.weight) }}
                    </v-chip>
                  </td>
                  <td class="product-price-col">
                    <v-chip size="small" color="success" variant="tonal" class="price-chip">
                      {{ formatCurrency(product.estimatePrice || 0) }}
                    </v-chip>
                  </td>
                  <td class="product-action-col">
                    <v-btn 
                      color="primary" 
                      size="small" 
                      variant="elevated"
                      prepend-icon="mdi-plus"
                      @click="selectProduct(product)"
                      class="select-btn"
                    > 
                      ເລືອກ 
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="filteredAvailableProducts.length === 0">
                  <td colspan="5" class="text-center pa-4 text-grey empty-row">
                    <v-icon class="mr-2">mdi-information</v-icon>
                    ບໍ່ພົບສິນຄ້າທີ່ຕ້ອງການ
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="outlined" color="error" @click="productSelectionDialog = false">
              <v-icon left>mdi-close</v-icon>
              ປິດ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Delete Confirmation -->
      <v-dialog v-model="confirmDeleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="dialog-title">ຢືນຢັນການລຶບ</v-card-title>
          <v-card-text> ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບອໍເດີ #{{ orderToDelete?.Order_ID }}? </v-card-text>
            <v-card-actions>
              <v-spacer />
            <v-btn variant="outlined" color="error" @click="confirmDeleteDialog = false" :disabled="isSaving">
              <v-icon left>mdi-close</v-icon>
              ຍົກເລີກ
            </v-btn>
            <v-btn class="btn-save" @click="confirmDelete" :loading="isSaving">ແມ່ນ</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useApi from '~/composables/useApi';
import PurchaseOrderComponent from '~/components/buy/PurchaseOrder.vue';
import { formatWeight } from '~/utils/format.js';

const api = useApi();
const isLoading = ref(true);
const isSaving = ref(false);
const snackbar = ref({ show: false, message: '', color: 'success' });

const orders = ref([]);
const suppliers = ref([]);
const allProducts = ref([]);
const latestPrice = ref(null);
const search = ref('');
const page = ref(1);
const itemsPerPage = ref(10);

const dialog = ref(false);
const isEditMode = ref(false);
const form = ref({ products: [] });
const formRef = ref(null);
const formValid = ref(false);

const productDialog = ref(false);
const selectedOrder = ref(null);

const purchaseOrderDialog = ref(false);

const productSelectionDialog = ref(false);
const productSearch = ref('');

const confirmDeleteDialog = ref(false);
const orderToDelete = ref(null);

const rules = {
  required: v => !!v || 'Required.'
};

const headers = [
  { title: 'ລຳດັບ', value: 'index', sortable: false },
  { title: 'ວັນທີສັ່ງ', value: 'Order_Date' },
  { title: 'ຜູ້ສະໜອງ', value: 'Tb_Supplier.Sup_name' },
  { title: 'ລາຍການ', value: 'products' },
  { title: 'ສະຖານະ', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false, align: 'center' }
];

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color };
};

const formatCurrency = (value) => {
  if (value == null) return '0';
  return new Intl.NumberFormat('lo-LA').format(value);
};

const formatForInput = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parseInput = (value) => {
  return Number(String(value).replace(/,/g, '')) || 0;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
};

const getStatusColor = (status) => {
  const map = { 'Completed': 'green', 'Pending': 'orange', 'Cancelled': 'red' };
  return map[status] || 'grey';
};

const statusFilter = ref(null);
const statusOptions = ['Pending', 'Completed', 'Cancelled'];

const filteredOrders = computed(() => {
  // Ensure orders.value is always an array
  let filtered = Array.isArray(orders.value) ? orders.value : [];

  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.Tb_Supplier?.Sup_name?.toLowerCase().includes(searchTerm) ||
      order.Order_ID.toString().includes(searchTerm)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }

  return filtered;
});

const paginatedOrders = computed(() => {
  const filtered = Array.isArray(filteredOrders.value) ? filteredOrders.value : [];
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.slice(start, end);
});

const totalAmountBeforeDiscount = computed(() => {
  const products = Array.isArray(form.value.products) ? form.value.products : [];
  return products.reduce((sum, item) => {
    const itemTotal = item.quantity * (item.goldValue + item.craftsmanshipFee);
    return sum + (itemTotal || 0);
  }, 0);
});

const totalDiscount = computed(() => {
  const products = Array.isArray(form.value.products) ? form.value.products : [];
  return products.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
});

const grandTotal = computed(() => {
  return totalAmountBeforeDiscount.value - totalDiscount.value;
});

const filteredAvailableProducts = computed(() => {
  const products = Array.isArray(allProducts.value) ? allProducts.value : [];
  if (!productSearch.value) return products;
  return products.filter(p => p.name && p.name.toLowerCase().includes(productSearch.value.toLowerCase()));
});

const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const [ordersResponse, suppliersResponse, productsResponse, priceResponse] = await Promise.all([
      api.get('/orders'),
      api.get('/public/suppliers'),
      api.get('/public/products'),
      api.get('/public/prices')
    ]);
    
    // Handle orders - check for null/undefined response
    if (ordersResponse && ordersResponse.success && Array.isArray(ordersResponse.data)) {
      orders.value = ordersResponse.data;
    } else if (ordersResponse && Array.isArray(ordersResponse.orders)) {
      orders.value = ordersResponse.orders;
    } else if (Array.isArray(ordersResponse)) {
      orders.value = ordersResponse;
    } else {
      orders.value = [];
    }
    
    // Handle latest price - check for null/undefined response
    if (priceResponse && priceResponse.success) {
      latestPrice.value = priceResponse.data;
    } else if (priceResponse && (priceResponse.Buy_price || priceResponse.buyPrice)) {
      latestPrice.value = priceResponse;
    } else if (ordersResponse && ordersResponse.latestPrice) {
      latestPrice.value = ordersResponse.latestPrice;
    } else {
      latestPrice.value = null;
    }

    // Handle suppliers - check for null/undefined response
    if (suppliersResponse && suppliersResponse.success && Array.isArray(suppliersResponse.data)) {
      suppliers.value = suppliersResponse.data.map(s => ({
        id: s.Sup_ID,
        name: s.Sup_name,
        phone: s.Phone,
        address: s.Address,
      }));
    } else if (Array.isArray(suppliersResponse)) {
      suppliers.value = suppliersResponse.map(s => ({
        id: s.Sup_ID,
        name: s.Sup_name,
        phone: s.Phone,
        address: s.Address,
      }));
    } else {
      suppliers.value = [];
    }
    
    // Handle products - check for null/undefined response first
    if (productsResponse && productsResponse.success && Array.isArray(productsResponse.data)) {
      allProducts.value = productsResponse.data.map(p => ({
        id: p.id || p.Pd_ID,
        name: p.name || p.Pd_name,
        category: p.category || p.Type || p.Pd_type,
        weight: p.weight || p.Weight,
        estimatePrice: p.estimatePrice || p.Pattern_value || 0,
      }));
    } else if (Array.isArray(productsResponse)) {
      allProducts.value = productsResponse.map(p => ({
        id: p.id || p.Pd_ID,
        name: p.name || p.Pd_name,
        category: p.category || p.Type || p.Pd_type,
        weight: p.weight || p.Weight,
        estimatePrice: p.estimatePrice || p.Pattern_value || 0,
      }));
    } else {
      console.warn('Products response is not an array:', productsResponse);
      allProducts.value = [];
    }

    console.log('Latest price data:', latestPrice.value);
    console.log('Products loaded:', allProducts.value.length);
    console.log('Products data:', allProducts.value);
    console.log('Products response:', productsResponse);

  } catch (error) {
    showSnackbar('ບໍ່ສາມາດໂຫລດຂໍ້ມູນເບື້ອງຕົ້ນໄດ້', 'error');
    console.error("Error fetching initial data:", error);
    
    // Set default values on error
    orders.value = [];
    suppliers.value = [];
    allProducts.value = [];
    latestPrice.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInitialData);

const resetForm = () => {
  form.value = {
    Order_Date: formatDate(new Date()),
    Sup_ID: null,
    status: 'Pending',
    products: []
  };
  formRef.value?.resetValidation();
};

const openAddDialog = () => {
  isEditMode.value = false;
  resetForm();
  dialog.value = true;
};

const editOrder = (order) => {
  isEditMode.value = true;
  
  // Ensure order.products is an array
  const orderProducts = Array.isArray(order.products) ? order.products : [];
  
  form.value = {
      ...order,
      Order_Date: formatDate(order.Order_Date),
    products: orderProducts.map(p => {
      // ใช้น้ำหนักจากข้อมูลสินค้าที่มีอยู่แล้ว หรือหาจาก allProducts
      const allProductsList = Array.isArray(allProducts.value) ? allProducts.value : [];
      const productData = allProductsList.find(prod => prod.id === p.Pd_ID);
      const actualWeight = productData ? productData.weight : p.weight;
      const weightInGrams = convertWeightCodeToGrams(actualWeight);
      
      let goldValue = 0;
      let craftsmanshipFee = p.buyPrice || 0; // เริ่มต้นด้วยราคาซื้อทั้งหมด
      
      const buyPrice = latestPrice.value?.Buy_price || latestPrice.value?.buyPrice || latestPrice.value?.buy_price;
      if (latestPrice.value && buyPrice && weightInGrams > 0) {
          const buyPriceNum = Number(buyPrice);
          if (!isNaN(buyPriceNum) && buyPriceNum > 0) {
            const goldPricePerGram = buyPriceNum / 15.16;
            goldValue = goldPricePerGram * weightInGrams;
            craftsmanshipFee = Math.max(0, (p.buyPrice || 0) - goldValue); // คำนวณค่ากำเหน็จที่ถูกต้อง
          }
      }

      return {
        id: p.Pd_ID,
        name: p.Pd_name,
        quantity: p.quantity,
        weight: actualWeight, // ใช้น้ำหนักที่ถูกต้อง
        discount: p.discount || 0,
        goldValue: Math.round(goldValue),
        craftsmanshipFee: Math.round(craftsmanshipFee)
      }
    })
  };
  dialog.value = true;
};

const saveOrder = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    // Ensure form.value.products is an array
    const formProducts = Array.isArray(form.value.products) ? form.value.products : [];
    
    const payload = {
        ...form.value,
        products: formProducts.map(p => ({
          id: p.id,
          quantity: p.quantity,
          buyPrice: p.goldValue + p.craftsmanshipFee,
          discount: p.discount
        }))
    };
    
    if (isEditMode.value) {
      await api.put(`/orders/${form.value.Order_ID}`, payload);
      showSnackbar('ອັບເດດການສັ່ງຊື້ສຳເລັດ');
    } else {
      await api.post('/orders', payload);
      showSnackbar('ສ້າງການສັ່ງຊື້ສຳເລັດ');
    }
    dialog.value = false;
    await fetchInitialData();
  } catch (error) {
    showSnackbar(error.message, 'error');
  }
};

const deleteOrderDialog = (order) => {
  orderToDelete.value = order;
  confirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.del(`/orders/${orderToDelete.value.Order_ID}`);
    showSnackbar('ລຶບອໍເດີສຳເລັດ');
    confirmDeleteDialog.value = false;
    await fetchInitialData(); // Refresh data
  } catch (error) {
    showSnackbar(error.message, 'error');
  }
};

const viewProducts = (order) => {
  selectedOrder.value = order;
  productDialog.value = true;
};

const viewPurchaseOrder = (order) => {
  console.log('viewPurchaseOrder - Original order:', order);
  
  // Ensure order.products is an array
  const orderProducts = Array.isArray(order.products) ? order.products : [];
  const allProductsList = Array.isArray(allProducts.value) ? allProducts.value : [];
  
  // เตรียมข้อมูลสำหรับ PurchaseOrder โดยเพิ่มข้อมูลที่จำเป็น
  const orderForPurchase = {
    ...order,
    products: orderProducts.map(p => {
      // หาข้อมูลน้ำหนักจากรายการสินค้าทั้งหมด
      const productDetail = allProductsList.find(prod => prod.id === (p.Pd_ID || p.id));
      console.log('viewPurchaseOrder - Product mapping:', {
        original: p,
        productDetail: productDetail,
        weight: productDetail ? productDetail.weight : p.weight || 0
      });
      
      return {
        ...p,
        Pd_ID: p.Pd_ID || p.id,
        Pd_name: p.Pd_name || p.name,
        id: p.Pd_ID || p.id,
        name: p.Pd_name || p.name,
        weight: productDetail ? productDetail.weight : p.weight || 0,
        quantity: p.quantity || 1,
        buyPrice: p.buyPrice || ((p.goldValue || 0) + (p.craftsmanshipFee || 0)),
        goldValue: p.goldValue || 0,
        craftsmanshipFee: p.craftsmanshipFee || 0,
        discount: p.discount || 0
      };
    })
  };
  
  console.log('viewPurchaseOrder - Prepared order:', orderForPurchase);
  selectedOrder.value = orderForPurchase;
  purchaseOrderDialog.value = true;
}

const calculateGrandTotal = (products) => {
  if (!Array.isArray(products)) return 0;
  return products.reduce((sum, p) => {
    const lineTotal = (p.quantity * p.buyPrice) - (p.discount || 0);
    return sum + lineTotal;
  }, 0);
};

const convertWeightCodeToGrams = (weight) => {
  if (weight === null || weight === undefined) return 0;
  
  // ตอนนี้ weight จากฐานข้อมูลเป็นกรัมแล้ว ไม่ต้องแปลง
  const weightInGrams = parseFloat(weight);
  if (isNaN(weightInGrams)) return 0;
  
  return weightInGrams;
};

const getWeightText = (value) => {
  return formatWeight(value);
};

const getProductWeight = (productId) => {
  const productsList = Array.isArray(allProducts.value) ? allProducts.value : [];
  const product = productsList.find(p => p.id === productId);
  return product ? product.weight : 0;
};

const selectProduct = (product) => {
  // Ensure form.value.products is an array
  if (!Array.isArray(form.value.products)) {
    form.value.products = [];
  }
  
  const exists = form.value.products.some(p => p.id === product.id);
  if (exists) {
    showSnackbar('ສິນຄ້ານີ້ຖູກເພີ່ມແລ້ວ', 'warning');
    return;
  }

  const calculatedDiscount = 0; // Set default discount to 0
  const craftsmanshipFee = parseFloat(product.estimatePrice) || 0;
  let goldValue = 0;

  console.log('selectProduct: product.weight:', product.weight);
  console.log('selectProduct: latestPrice.value:', latestPrice.value);

  // Check for different possible field names for the buy price
  const buyPrice = latestPrice.value?.Buy_price || latestPrice.value?.buyPrice || latestPrice.value?.buy_price;
  console.log('selectProduct: buyPrice found:', buyPrice);

  if (latestPrice.value && buyPrice) {
    const buyPriceNum = Number(buyPrice);
    console.log('selectProduct: converted buyPrice:', buyPriceNum);

    if (!isNaN(buyPriceNum) && buyPriceNum > 0) {
      const weightInGrams = convertWeightCodeToGrams(product.weight);
      console.log('selectProduct: weightInGrams:', weightInGrams);
    
      if (weightInGrams > 0) {
        const goldPricePerGram = buyPriceNum / 15.16;
        goldValue = goldPricePerGram * weightInGrams;
        console.log('selectProduct: calculated goldValue:', goldValue);
      } else {
        console.log('selectProduct: weightInGrams is 0 or invalid.');
      }
    } else {
        console.log('selectProduct: Converted buyPrice is NaN or 0.');
        showSnackbar('ບໍ່ສາມາດດຶງລາຄາຄຳລ່າສຸດໄດ້, ລາຄາຊື້ຈະສະແດງເປັນ 0', 'warning');
    }
  } else {
     console.log('selectProduct: latestPrice or buyPrice is missing.');
     showSnackbar('ບໍ່ສາມາດດຶງລາຄາຄຳລ່າສຸດໄດ້, ລາຄາຊື້ຈະສະແດງເປັນ 0', 'warning');
  }

  const newProduct = {
    id: product.id,
    name: product.name,
    quantity: 1, // default quantity to 1
    weight: product.weight,
    discount: calculatedDiscount, // Use the new default
    goldValue: Math.round(goldValue),
    craftsmanshipFee: craftsmanshipFee
  };

  form.value.products.push(newProduct);
  productSelectionDialog.value = false;
};

const removeProduct = (index) => {
  if (Array.isArray(form.value.products) && index >= 0 && index < form.value.products.length) {
    form.value.products.splice(index, 1);
  }
};

watch([search, statusFilter], () => {
  page.value = 1;
});
</script>

<style scoped>
/* Page Container */
.page-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px;
}

/* Modern Header */
.page-header {
  background: linear-gradient(135deg, #365a76 0%, #1e3a48 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(54, 90, 118, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text {
  color: white;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.add-btn {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

/* Search Card */
.search-card {
  border-radius: 16px !important;
  border: 1px solid rgba(54, 90, 118, 0.1) !important;
}

.search-wrapper {
  position: relative;
}

.search-field {
  border-radius: 12px !important;
}

.filter-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

/* Loading & Empty States */
.loading-container,
.empty-container {
  margin: 24px 0;
}

.loading-card,
.empty-card {
  border-radius: 16px !important;
  border: 1px solid rgba(54, 90, 118, 0.1) !important;
}

.loading-text {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

/* Data Card */
.data-card {
  border-radius: 16px !important;
  border: 1px solid rgba(54, 90, 118, 0.1) !important;
  overflow: hidden;
}

.table-header {
  background: linear-gradient(135deg, #365a76 0%, #1e3a48 100%);
  padding: 20px 24px;
}

.table-title {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.table-container {
  overflow-x: auto;
}

.modern-data-table {
  background: white !important;
}

.modern-data-table .v-data-table__wrapper {
  border-radius: 0 !important;
}

.modern-data-table thead th {
  background: rgba(54, 90, 118, 0.05) !important;
  font-weight: 600 !important;
  color: #365a76 !important;
  padding: 16px 20px !important;
  border-bottom: 2px solid rgba(54, 90, 118, 0.1) !important;
}

.modern-data-table tbody tr {
  transition: all 0.2s ease !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.modern-data-table tbody tr:hover {
  background: rgba(54, 90, 118, 0.03) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-data-table tbody td {
  padding: 20px !important;
  vertical-align: middle !important;
}

.index-cell,
.date-cell,
.products-cell {
  display: flex;
  align-items: center;
}

.status-chip {
  font-weight: 600 !important;
  border-radius: 8px !important;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
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

.dialog-title { 
  background-color: #365a76; 
  color: white; 
  font-weight: bold; 
  padding: 16px !important;
}
.btn-cancel { background-color: #f44336 !important; color: white !important; }
.btn-save { background-color: #4caf50 !important; color: white !important; }
.cursor-pointer { cursor: pointer; }

/* Dark Mode Support */
.v-theme--dark .page-container {
  background: #121212;
}

.v-theme--dark .search-card,
.v-theme--dark .loading-card,
.v-theme--dark .data-card,
.v-theme--dark .pagination-card {
  background: #1e1e1e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .search-card .v-card-text,
.v-theme--dark .loading-card .v-card-text,
.v-theme--dark .data-card .v-card-text,
.v-theme--dark .pagination-card .v-card-text {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .loading-text,
.v-theme--dark .pagination-text {
  color: #aaa !important;
}

.v-theme--dark .modern-data-table {
  background: #1e1e1e !important;
}

.v-theme--dark .modern-data-table thead th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .modern-data-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: #1e1e1e !important;
}

.v-theme--dark .modern-data-table tbody td {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .modern-data-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.2) 0%, rgba(54, 90, 118, 0.3) 100%) !important;
}

/* Dark Mode Dialog Support */
.v-theme--dark .modern-card {
  background: #1e1e1e !important;
}

.v-theme--dark .modern-content {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .info-card,
.v-theme--dark .order-status,
.v-theme--dark .products-card,
.v-theme--dark .result-card {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .supplier-name,
.v-theme--dark .product-name,
.v-theme--dark .price-value {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .card-title,
.v-theme--dark .status-label,
.v-theme--dark .product-details,
.v-theme--dark .result-header {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .modern-actions {
  background: #2a2a2a !important;
}

/* Dark Mode Form Elements */
.v-theme--dark .items-table {
  background: #1e1e1e !important;
}

.v-theme--dark .items-table th {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .items-table td {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .items-table tbody tr:hover {
  background: rgba(54, 90, 118, 0.2) !important;
}

.v-theme--dark .items-table tfoot tr {
  border-top: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .order-id-field .v-field__input,
.v-theme--dark .order-id-field.v-input--is-disabled .v-field__input {
  background-color: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode Dialog Elements */
.v-theme--dark .v-dialog .v-card {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-dialog .v-card-text {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-dialog .v-card-actions {
  background: #2a2a2a !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-card-title {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode Product Selection Dialog */
.v-theme--dark .product-selection-table {
  background: #1e1e1e !important;
}

.v-theme--dark .product-selection-table tbody td {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .bg-grey-lighten-5 {
  background: #2a2a2a !important;
}

/* Dark Mode Form Cards inside Dialogs */
.v-theme--dark .v-card.elevation-1,
.v-theme--dark .v-card[variant="outlined"],
.v-theme--dark .v-card.bg-blue-lighten-5 {
  background: #2a2a2a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-card .v-card-title {
  background: #365a76 !important;
  color: white !important;
}

.v-theme--dark .v-card .v-card-text {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode Alert */
.v-theme--dark .v-alert {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode Tables in Dialogs */
.v-theme--dark .items-table thead tr {
  background: #365a76 !important;
}

.v-theme--dark .items-table thead th {
  background: #365a76 !important;
  color: white !important;
}

.v-theme--dark .items-table tbody tr {
  background: #1e1e1e !important;
}

.v-theme--dark .items-table tbody tr:nth-child(even) {
  background: #2a2a2a !important;
}

/* Dark Mode Product Row Hover */
.v-theme--dark .product-row:hover {
  background-color: rgba(54, 90, 118, 0.2) !important;
}

.v-theme--dark .table-responsive {
  background: #1e1e1e !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

/* Dark Mode Empty Row */
.v-theme--dark .empty-row {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Dark Mode Dialog Content Wrapper */
.v-theme--dark .modern-dialog .dialog-content {
  background: #1e1e1e !important;
}

/* Dark Mode for specific dialog elements */
.v-theme--dark .product-selection-dialog .v-card,
.v-theme--dark .add-order-dialog .v-card {
  background: #1e1e1e !important;
}

/* Force override for any remaining white backgrounds */
.v-theme--dark .v-card,
.v-theme--dark .v-table,
.v-theme--dark .v-sheet {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-card .v-card-subtitle,
.v-theme--dark .v-card .v-card-text,
.v-theme--dark .v-table .v-table__wrapper {
  background: inherit !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-title {
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
  
  .filter-info {
    justify-content: center;
    margin-top: 12px;
  }
}
.order-id-field .v-field__input {
  background-color: #f5f5f5;
  color: #222 !important;
  font-weight: bold;
  opacity: 1 !important;
}
.order-id-field.v-input--is-disabled .v-field__input {
  background-color: #e0e0e0;
  color: #222 !important;
  font-weight: bold;
  opacity: 1 !important;
}

.items-table th {
  font-weight: bold;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.items-table td, .items-table th {
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
}

.items-table tbody tr:hover {
  background-color: #f0f8ff !important;
}

/* Improved form field styling */
.quantity-field {
  max-width: 80px;
  margin: 0 auto;
}

.price-field {
  min-width: 120px;
}

/* Better spacing for cards */
.v-card-title {
  border-bottom: 1px solid #e0e0e0;
}

/* Color classes for better visual hierarchy */
.text-green {
  color: #2e7d32 !important;
}

.text-orange {
  color: #f57c00 !important;
}

.text-blue {
  color: #1565c0 !important;
}

/* Enhanced table footer styling */
.items-table tfoot tr {
  border-top: 2px solid #ddd;
}

.items-table tfoot td {
  font-size: 0.95rem;
}

/* Dialog improvements */
.v-dialog .v-card {
  border-radius: 12px;
}

.v-dialog .v-card-actions {
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

/* Product selection table styling */
.product-row:hover {
  background-color: #e3f2fd !important;
  cursor: pointer;
}

/* Modern Simple Details Dialog */
.modern-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.modern-header {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.modern-content {
  padding: 24px !important;
  background: #fafafa;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #1976d2;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.supplier-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.order-status {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.status-chip {
  font-weight: 600 !important;
}

.products-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #ff9800;
}

.products-list {
  margin-top: 16px;
}

.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-row:last-child {
  border-bottom: none;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-details {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  color: #ccc;
}

.product-price {
  text-align: right;
}

.price-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.discount-value {
  font-size: 0.85rem;
  color: #f57c00;
  font-weight: 500;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4caf50;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.result-content {
  text-align: center;
}

.total-chip {
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  padding: 0 24px !important;
  height: 40px !important;
}

.modern-actions {
  background: #f8f9fa;
  padding: 20px 24px !important;
  border-top: 1px solid #e0e0e0;
}

.close-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 24px !important;
}

/* Product Selection Table Styling */
.product-selection-table {
  table-layout: fixed !important;
  width: 100% !important;
  border-collapse: collapse !important;
}

.product-selection-table th,
.product-selection-table td {
  padding: 12px 8px !important;
  vertical-align: middle !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  overflow: hidden !important;
  word-wrap: break-word !important;
}

/* Fixed column widths that add up to 100% */
.product-name-col {
  width: 30% !important;
  text-align: left !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.product-category-col {
  width: 15% !important;
  text-align: center !important;
}

.product-weight-col {
  width: 15% !important;
  text-align: center !important;
}

.product-price-col {
  width: 20% !important;
  text-align: center !important;
}

.product-action-col {
  width: 20% !important;
  text-align: center !important;
}

.product-selection-table tbody tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.product-selection-table tbody tr:hover {
  background-color: rgba(54, 90, 118, 0.05) !important;
}

.product-selection-table thead th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 50px !important;
}

/* Override any inherited styles */
.product-selection-table thead th.product-name-col {
  text-align: left !important;
}

.product-selection-table thead th.product-category-col,
.product-selection-table thead th.product-weight-col,
.product-selection-table thead th.product-price-col,
.product-selection-table thead th.product-action-col {
  text-align: center !important;
}

/* Ensure data columns match header alignment */
.product-selection-table tbody td.product-name-col {
  text-align: left !important;
  padding-left: 12px !important;
}

.product-selection-table tbody td.product-category-col,
.product-selection-table tbody td.product-weight-col,
.product-selection-table tbody td.product-price-col,
.product-selection-table tbody td.product-action-col {
  text-align: center !important;
}

/* Dark Mode Support for Product Selection Table */
.v-theme--dark .product-selection-table {
  background: #2d2d2d !important;
}

.v-theme--dark .product-selection-table th,
.v-theme--dark .product-selection-table td {
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .product-selection-table tbody tr:hover {
  background-color: rgba(54, 90, 118, 0.15) !important;
}

/* Table Responsive Wrapper */
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Additional styling for better UX */
.product-data-row:hover {
  background-color: rgba(54, 90, 118, 0.08) !important;
  transition: background-color 0.2s ease;
}

.product-name-text {
  font-weight: 500;
  color: #333;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-chip,
.weight-chip,
.price-chip {
  font-size: 12px !important;
  height: 24px !important;
  min-width: auto !important;
}

.select-btn {
  min-width: 80px !important;
  height: 32px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
  text-transform: none !important;
}

.empty-row {
  font-style: italic;
  color: #666 !important;
}

/* Dark mode support for new elements */
.v-theme--dark .product-name-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .empty-row {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .product-selection-table {
    font-size: 12px !important;
  }
  
  .product-name-col {
    width: 35% !important;
  }
  
  .product-category-col,
  .product-weight-col {
    width: 12% !important;
  }
  
  .product-price-col {
    width: 18% !important;
  }
  
  .product-action-col {
    width: 23% !important;
  }
  
  .select-btn {
    min-width: 60px !important;
    height: 28px !important;
    font-size: 11px !important;
  }
  
  .category-chip,
  .weight-chip,
  .price-chip {
    font-size: 10px !important;
    height: 20px !important;
  }
}

/* Dark mode support for new elements */
.v-theme--dark .product-name-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .empty-row {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Comprehensive Dark Mode Support for ALL Dialog Elements */
.v-theme--dark .v-overlay__content .v-card {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-overlay__content .v-card .v-card-title {
  background: #365a76 !important;
  color: white !important;
}

.v-theme--dark .v-overlay__content .v-card .v-card-text {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-overlay__content .v-card .v-card-actions {
  background: #2a2a2a !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode for nested cards in dialogs */
.v-theme--dark .v-card .v-card {
  background: #2a2a2a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-card .v-card .v-card-title {
  background: rgba(54, 90, 118, 0.8) !important;
  color: white !important;
}

.v-theme--dark .v-card .v-card .v-card-text {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode for specific classes used in dialogs */
.v-theme--dark .bg-blue-lighten-5 {
  background: #2a2a2a !important;
}

.v-theme--dark .bg-grey-lighten-5 {
  background: #2a2a2a !important;
}

.v-theme--dark .bg-grey-lighten-3 {
  background: #365a76 !important;
}

/* Dark Mode for tables in dialogs */
.v-theme--dark .v-table .v-table__wrapper {
  background: #1e1e1e !important;
}

.v-theme--dark .v-table thead tr {
  background: #365a76 !important;
}

.v-theme--dark .v-table thead th {
  background: #365a76 !important;
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-table tbody tr {
  background: #1e1e1e !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-table tbody tr:nth-child(even) {
  background: #2a2a2a !important;
}

.v-theme--dark .v-table tbody td {
  background: inherit !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-table tbody tr:hover {
  background: rgba(54, 90, 118, 0.2) !important;
}

.v-theme--dark .v-table tfoot tr {
  background: #2a2a2a !important;
  border-top: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .v-table tfoot td {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode Alerts */
.v-theme--dark .v-alert {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Dark Mode for Product Selection Dialog */
.v-theme--dark .product-selection-table tbody tr {
  background: #1e1e1e !important;
}

.v-theme--dark .product-selection-table tbody tr:nth-child(even) {
  background: #2a2a2a !important;
}

.v-theme--dark .product-selection-table tbody td {
  background: inherit !important;
}

/* Force Dark Mode for any remaining white elements */
.v-theme--dark .v-sheet,
.v-theme--dark .v-card,
.v-theme--dark .v-list,
.v-theme--dark .v-menu .v-list {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .elevation-1,
.v-theme--dark .elevation-2,
.v-theme--dark .elevation-3 {
  background: #2a2a2a !important;
}

/* Dialog specific overrides */
.v-theme--dark .v-dialog .v-card,
.v-theme--dark .v-dialog .v-sheet {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Additional Dark Mode Fixes for remaining white areas */
.v-theme--dark .v-field__field,
.v-theme--dark .v-field__input,
.v-theme--dark .v-field__append-inner,
.v-theme--dark .v-field__prepend-inner {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-field--disabled .v-field__field,
.v-theme--dark .v-field--disabled .v-field__input {
  background: #333 !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .v-input {
  background: transparent !important;
}

.v-theme--dark .v-text-field .v-field__field,
.v-theme--dark .v-text-field .v-field__input {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-select .v-field__field,
.v-theme--dark .v-select .v-field__input {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .v-field__outline {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.v-theme--dark .v-field--focused .v-field__outline {
  border-color: #365a76 !important;
}

/* Dark mode for any remaining white containers */
.v-theme--dark .v-container,
.v-theme--dark .v-row,
.v-theme--dark .v-col {
  background: transparent !important;
}

/* Force background for any stubborn white areas */
.v-theme--dark * {
  box-shadow: none !important;
}

.v-theme--dark .v-field:not(.v-field--disabled) .v-field__field {
  background: #2a2a2a !important;
}

.v-theme--dark .order-id-field .v-field__field,
.v-theme--dark .order-id-field .v-field__input {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>

