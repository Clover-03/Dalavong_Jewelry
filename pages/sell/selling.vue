<template>
  <ModernPageLayout 
    title="ການຂາຍສິນຄ້າ"
    subtitle="ຈັດການແລະບັນທຶກການຂາຍສິນຄ້າທັງໝົດ"
    icon="mdi-point-of-sale"
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
              <v-icon size="32" color="#365a76">mdi-cart-outline</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalSales }}</h3>
              <p class="stat-label">ຂາຍທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-cash-plus</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalRevenue) }}</h3>
              <p class="stat-label">ລາຍຮັບລວມ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-scale</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalWeight.toFixed(2) }}</h3>
              <p class="stat-label">ນ້ຳໜັກຂາຍ (ກຣາມ)</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-account-group</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ uniqueCustomers }}</h3>
              <p class="stat-label">ລູກຄ້າທີ່ຊື້</p>
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
                        <v-text-field
                            v-model="search"
            label="ຄົ້ນຫາ (ລູກຄ້າ, ສິນຄ້າ)" 
            variant="outlined"
            density="comfortable"
                            hide-details
            prepend-inner-icon="mdi-magnify" 
            color="#365a76"
            clearable
          />
                    </v-col>
        <v-col cols="12" md="3">
          <div class="gold-price-display">
            <v-chip 
              color="amber" 
              variant="elevated" 
              size="large"
              prepend-icon="mdi-gold"
            >
              <template v-if="latestGoldPrice">
                ລາຄາຄຳ: {{ formatCurrency(latestGoldPrice.Sell_price || 0) }}/ບາດ
              </template>
              <template v-else>
                <v-progress-circular 
                  indeterminate 
                  size="16" 
                  width="2"
                  class="mr-2"
                />
                ກຳລັງໂຫລດລາຄາ...
              </template>
            </v-chip>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <ModernButton 
            variant="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="onOpenSaleDialog"
          >
                            ເພີ່ມການຂາຍ
          </ModernButton>
                    </v-col>
                </v-row>
            </div>
            
    <!-- Modern Data Table -->
    <div class="table-container">
      <v-table class="modern-table elevation-2">
                  <thead>
                    <tr>
                      <th>#</th>
            <th>ວັນທີຂາຍ</th>
            <th>ລູກຄ້າ</th>
            <th>ສິນຄ້າ</th>
            <th>ນ້ຳໜັກ</th>
            <th class="text-right">ລາຄາຂາຍ</th>
            <th class="text-right">ສ່ວນຫຼຸດ</th>
            <th class="text-right">ລວມສຸດທິ</th>
            <th>ວິທີຈ່າຍ</th>
            <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
          <tr v-for="(sale, index) in paginatedSales" :key="sale.id">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td>{{ formatDate(sale.saleDate) }}</td>
            <td>{{ sale.customer }}</td>
            <td>{{ sale.product }}</td>
            <td>{{ sale.weight }}</td>
            <td class="text-right">
              {{ formatCurrency(sale.price) }}
            </td>
            <td class="text-right">
              <span v-if="sale.discount > 0" class="text-orange-darken-2">
                -{{ formatCurrency(sale.discount) }}
              </span>
              <span v-else class="text-grey">0</span>
            </td>
            <td class="text-right">
              <v-chip color="green-darken-1" variant="flat" size="small">
                {{ formatCurrency(sale.total) }}
              </v-chip>
            </td>
            <td>
              <v-chip 
                :color="getPaymentMethodColor(sale.paymentMethod)" 
                variant="outlined" 
                size="small"
              >
                {{ sale.paymentMethod }}
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
                                @click="onViewDetails(sale)"
                                class="action-btn"
                              >
                    <v-icon>mdi-eye</v-icon>
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
                                @click="onEditSale(sale)"
                                class="action-btn"
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                          </v-tooltip>
                          
              <v-tooltip text="ພິມໃບຂາຍ/ໃບຮັບປະກັນ" location="top">
                          <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="small"
                                variant="text"
                                color="success"
                                @click="onPrintReceipt(sale)"
                                class="action-btn"
                              >
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                          </template>
                        </v-tooltip>
                          
              <v-tooltip text="ຍົກເລີກ" location="top">
                          <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="small"
                                variant="text"
                                color="error"
                                @click="onCancelSale(sale)"
                                class="action-btn"
                              >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                          </template>
                        </v-tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
        <tfoot>
          <tr class="total-row">
            <td :colspan="7" class="text-right font-weight-bold">ລວມທັງໝົດ:</td>
            <td class="text-right font-weight-bold">{{ formatCurrency(totalRevenue) }}</td>
            <td :colspan="2"></td>
          </tr>
        </tfoot>
                </v-table>
  
      <!-- Modern Pagination -->
      <div v-if="!isLoading && sales.length > 0" class="pagination-container mt-6">
        <div class="pagination-card">
          <div class="pagination-content">
            <div class="pagination-info">
              <span class="info-text">
                ສະແດງ {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredSales.length) }} ຈາກ {{ filteredSales.length }} ລາຍການ
              </span>
            </div>
            <div class="pagination-controls">
                <v-pagination
          v-model="currentPage"
          :length="Math.ceil(filteredSales.length / itemsPerPage)"
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
                @update:model-value="currentPage = 1"
              />
            </div>
          </div>
        </div>
              </div>
            </div>

    <!-- Add Sale Dialog -->
    <v-dialog v-model="saleDialog" max-width="800px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          ເພີ່ມການຂາຍໃໝ່
        </v-card-title>
        <v-form ref="formRef" @submit.prevent="saveSale" v-model="formValid">
          <v-card-text class="pa-6">
                      <v-row>
              <!-- วันที่ขาย -->
                          <v-col cols="12" md="6">
                                <v-text-field
                  v-model="form.saleDate"
                  label="ວັນທີຂາຍ"
                  type="date"
                                    variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  :rules="[rules.required]"
                />
                          </v-col>
              
              <!-- ເລືອກລູກຄ້າ -->
                          <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.customerId"
                  :items="customers"
                  item-title="name"
                  item-value="id"
                                    :rules="[rules.required]"
                  label="ເລືອກລູກຄ້າ"
                                    variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  clearable
                  :loading="loadingCustomers"
                  :return-object="false"
                  no-data-text="ບໍ່ມີຂໍ້ມູນລູກຄ້າ"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" :key="`customer-${item.raw.id}`">
                      <v-list-item-subtitle>{{ item.raw.phone }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              
              <!-- ເລືອກສິນຄ້າ -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.productId"
                  :items="availableProducts"
                  item-title="displayName"
                  item-value="id"
                  :rules="[rules.required]"
                  label="ເລືອກສິນຄ້າ"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  clearable
                  :loading="loadingProducts"
                  :return-object="false"
                  no-data-text="ບໍ່ມີສິນຄ້າທີ່ສາມາດຂາຍໄດ້"
                  @update:model-value="onProductSelect"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" :key="`product-${item.raw.id}`">
                      <v-list-item-subtitle>
                        {{ item.raw.Type || item.raw.category }} - {{ formatWeight(item.raw.Weight || item.raw.weight) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              
              <!-- น้ำหนัก (auto-filled) -->
              <v-col cols="12" md="6">
                                <v-text-field
                  :model-value="form.weight || (selectedProduct ? formatWeight(selectedProduct.weight || selectedProduct.Weight || 0) : '')"
                  label="ນ້ຳໜັກ (ກຣາມ)"
                                    variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  readonly
                  hint="ນ້ຳໜັກຈະຖືກເພີ່ມອັດຕະໂນມັດເມື່ອເລືອກສິນຄ້າ"
                  persistent-hint
                />
                          </v-col>
              
              <!-- ราคาขาย (calculated from gold price + pattern value) -->
              <v-col cols="12" md="6">
                                            <v-text-field
                  :model-value="formatCurrency(calculatedPrice)"
                  label="ລາຄາຂາຍ (ກີບ)"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  readonly
                  hint="ລາຄາຄິດໄລ່ຈາກລາຄາຄຳລ່າສຸດ + ຄ່າກຳເໜັດ"
                  persistent-hint
                />
                                        </v-col>
              
              <!-- ส่วนลด -->
              <v-col cols="12" md="6">
                                            <v-text-field
                  :model-value="formatForInput(form.discount)"
                  @update:model-value="value => form.discount = parseInput(value)"
                  :rules="[rules.discount]"
                  label="ສ່ວນຫຼຸດ (ກີບ)"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  type="text"
                  placeholder="0"
                />
                                        </v-col>
              
              <!-- วิธีการจ่ายเงิน -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.paymentMethod"
                  :items="paymentMethods"
                  item-title="label"
                  item-value="value"
                  :rules="[rules.required]"
                  label="ວິທີການຈ່າຍເງິນ"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                />
                          </v-col>
              

                                </v-row>
            
            <!-- Calculation Display -->
            <div v-if="selectedProduct && calculatedPrice > 0" class="calculation-card mt-4">
              <h4 class="mb-3">ສະຫຼຸບການຄິດໄລ່</h4>
                                <v-row>
                <v-col cols="6" md="3">
                  <div class="calc-item">
                    <span class="calc-label">ລາຄາຄຳ/ກຣາມ:</span>
                    <span class="calc-value">{{ formatCurrency(goldPricePerGram) }}</span>
                  </div>
                                </v-col>
                <v-col cols="6" md="3">
                  <div class="calc-item">
                    <span class="calc-label">ມູນຄ່າຄຳ:</span>
                    <span class="calc-value">{{ formatCurrency(goldValue) }}</span>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="calc-item">
                    <span class="calc-label">ຄ່າກຳເໜັດ:</span>
                    <span class="calc-value">{{ formatCurrency(selectedProduct?.estimatePrice || selectedProduct?.Pattern_value || 0) }}</span>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="calc-item">
                    <span class="calc-label">ລາຄາລວມ:</span>
                    <span class="calc-value">{{ formatCurrency(calculatedPrice) }}</span>
                  </div>
                </v-col>
                <v-col cols="6" md="3">
                  <div class="calc-item">
                    <span class="calc-label">ສ່ວນຫຼຸດ:</span>
                    <span class="calc-value">-{{ formatCurrency(form.discount || 0) }}</span>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-divider class="my-2"></v-divider>
                  <div class="calc-item total-calc">
                    <span class="calc-label">ລວມສຸດທິ:</span>
                    <span class="calc-total">{{ formatCurrency(calculateTotal()) }}</span>
                  </div>
                                </v-col>
                                </v-row>
                    </div>
                </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <ModernButton 
              variant="error"
              @click="saleDialog = false" 
              :disabled="isSaving"
            >
                    ຍົກເລີກ
            </ModernButton>
            <ModernButton 
              variant="primary"
              @click="saveSale" 
              :loading="isSaving" 
              :disabled="!formValid"
            >
              ບັນທຶກການຂາຍ
            </ModernButton>
                </v-card-actions>
        </v-form>
              </v-card>
            </v-dialog>

    <!-- Edit Sale Dialog -->
    <v-dialog v-model="editDialog" max-width="600px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          ແກ້ໄຂການຂາຍ
        </v-card-title>
        <v-form ref="editFormRef" @submit.prevent="updateSale" v-model="editFormValid">
        <v-card-text class="pa-6">
            <v-row v-if="selectedSale">
              <!-- ส่วนลด -->
              <v-col cols="12">
                <v-text-field
                  :model-value="formatForInput(editForm.discount)"
                  @update:model-value="value => editForm.discount = parseInput(value)"
                  :rules="[rules.discount]"
                  label="ສ່ວນຫຼຸດ (ກີບ)"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                  type="text"
                  placeholder="0"
                />
              </v-col>
              
              <!-- วิธีการจ่ายเงิน -->
              <v-col cols="12">
                <v-select
                  v-model="editForm.paymentMethod"
                  :items="paymentMethods"
                  item-title="label"
                  item-value="value"
                  :rules="[rules.required]"
                  label="ວິທີການຈ່າຍເງິນ"
                  variant="outlined"
                  density="comfortable"
                  color="#365a76"
                />
              </v-col>
              
              
              
              <!-- Calculation Display -->
              <v-col cols="12">
                <div class="calculation-card">
                  <h4 class="mb-3">ສະຫຼຸບການຄິດໄລ່</h4>
            <v-row>
                    <v-col cols="6">
                      <div class="calc-item">
                        <span class="calc-label">ລາຄາເດີມ:</span>
                        <span class="calc-value">{{ formatCurrency(selectedSale.price) }}</span>
                  </div>
              </v-col>
                    <v-col cols="6">
                      <div class="calc-item">
                        <span class="calc-label">ສ່ວນຫຼຸດ:</span>
                        <span class="calc-value">-{{ formatCurrency(editForm.discount || 0) }}</span>
                    </div>
              </v-col>
                    <v-col cols="12">
                      <v-divider class="my-2"></v-divider>
                      <div class="calc-item total-calc">
                        <span class="calc-label">ລວມສຸດທິ:</span>
                        <span class="calc-total">{{ formatCurrency(calculateEditTotal()) }}</span>
                  </div>
              </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <ModernButton 
              variant="error"
              @click="editDialog = false" 
              :disabled="isSaving"
            >
              ຍົກເລີກ
            </ModernButton>
            <ModernButton 
              variant="primary"
              @click="updateSale" 
              :loading="isSaving" 
              :disabled="!editFormValid"
            >
              ບັນທຶກການແກ້ໄຂ
            </ModernButton>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="700px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">
          <v-icon class="mr-3">mdi-receipt</v-icon>
          ລາຍລະອຽດການຂາຍ
        </v-card-title>
        <v-card-text class="details-dialog-content">
          <div v-if="selectedSale" class="details-content">
            <!-- Customer Information Card -->
            <div class="detail-card customer-info-card">
              <div class="card-header">
                <v-icon color="#365a76" class="mr-2">mdi-account</v-icon>
                <span class="card-title">ຂໍ້ມູນລູກຄ້າ</span>
                    </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="info-label">
                    <v-icon size="16" class="mr-2">mdi-account-circle</v-icon>
                    ລູກຄ້າ:
                  </span>
                  <span class="info-value">{{ selectedSale.customer }}</span>
                  </div>
                <div class="info-row">
                  <span class="info-label">
                    <v-icon size="16" class="mr-2">mdi-calendar</v-icon>
                    ວັນທີຂາຍ:
                  </span>
                  <span class="info-value">{{ formatDate(selectedSale.saleDate) }}</span>
                </div>
              </div>
            </div>

            <!-- Product Information Card -->
            <div class="detail-card product-info-card">
              <div class="card-header">
                <v-icon color="#365a76" class="mr-2">mdi-diamond-stone</v-icon>
                <span class="card-title">ຂໍ້ມູນສິນຄ້າ</span>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="info-label">
                    <v-icon size="16" class="mr-2">mdi-diamond</v-icon>
                    ສິນຄ້າ:
                  </span>
                  <span class="info-value">{{ selectedSale.product }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">
                    <v-icon size="16" class="mr-2">mdi-weight</v-icon>
                    ນ້ຳໜັກ:
                  </span>
                  <span class="info-value weight-value">{{ selectedSale.weight }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Information Card -->
            <div class="detail-card payment-info-card">
              <div class="card-header">
                <v-icon color="#365a76" class="mr-2">mdi-calculator</v-icon>
                <span class="card-title">ຂໍ້ມູນການຈ່າຍເງິນ</span>
              </div>
              <div class="card-content">
                <div class="price-breakdown">
                  <div class="price-row">
                    <span class="price-label">
                      <v-icon size="16" class="mr-2">mdi-currency-usd</v-icon>
                      ລາຄາຂາຍ:
                    </span>
                    <span class="price-value">{{ formatCurrency(selectedSale.price) }}</span>
                  </div>
                  <div class="price-row discount-row" v-if="selectedSale.discount > 0">
                    <span class="price-label">
                      <v-icon size="16" class="mr-2">mdi-percent</v-icon>
                      ສ່ວນຫຼຸດ:
                    </span>
                    <span class="price-value discount-value">-{{ formatCurrency(selectedSale.discount) }}</span>
                  </div>
                  <hr class="price-divider">
                  <div class="price-row total-row">
                    <span class="price-label total-label">
                      <v-icon size="18" class="mr-2">mdi-calculator</v-icon>
                      ລວມສຸດທິ:
                    </span>
                    <v-chip color="success" variant="flat" size="large" class="total-chip">
                      <v-icon start size="16">mdi-cash</v-icon>
                    {{ formatCurrency(selectedSale.total) }}
                  </v-chip>
                      </div>
                </div>
                <div class="payment-method-section">
                  <div class="info-row">
                    <span class="info-label">
                      <v-icon size="16" class="mr-2">mdi-credit-card</v-icon>
                      ວິທີຈ່າຍເງິນ:
                    </span>
                  <v-chip 
                    :color="getPaymentMethodColor(selectedSale.paymentMethod)" 
                    variant="outlined" 
                    size="small"
                      class="payment-chip"
                  >
                      <v-icon start size="14">{{ getPaymentMethodIcon(selectedSale.paymentMethod) }}</v-icon>
                    {{ selectedSale.paymentMethod }}
                        </v-chip>
                      </div>
                    </div>
              </div>
            </div>

            <!-- Notes Card (if exists) -->
            <div v-if="selectedSale.notes" class="detail-card notes-card">
              <div class="card-header">
                <v-icon color="#365a76" class="mr-2">mdi-note-text</v-icon>
                <span class="card-title">ໝາຍເຫດ</span>
              </div>
              <div class="card-content">
                <p class="notes-text">{{ selectedSale.notes }}</p>
              </div>
            </div>
                  </div>
                </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="info"
            @click="onPrintReceipt(selectedSale)" 
            prepend-icon="mdi-printer"
          >
            ພິມໃບຂາຍ/ໃບຮັບປະກັນ
          </ModernButton>
          <ModernButton 
            variant="primary"
            @click="detailsDialog = false" 
          >
            ປິດ
          </ModernButton>
                </v-card-actions>
              </v-card>
            </v-dialog>

    <!-- Cancel Confirmation Dialog -->
    <v-dialog v-model="cancelDialog" max-width="500px" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ຢືນຢັນການຍົກເລີກ</v-card-title>
        <v-card-text class="pa-6">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <div class="text-h6 font-weight-bold mb-2">ເຕືອນ!</div>
            <div>ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກການຂາຍນີ້?</div>
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <ModernButton 
            variant="error"
            @click="cancelDialog = false" 
          >
            ບໍ່
          </ModernButton>
          <ModernButton 
            variant="primary"
            @click="confirmCancel" 
            :loading="isSaving"
          >
            ແມ່ນ
          </ModernButton>
                </v-card-actions>
              </v-card>
            </v-dialog>

    <!-- Receipt Dialog -->
    <v-dialog v-model="receiptDialog" max-width="900px" persistent>
      <Receipt v-if="selectedSale" :sale="selectedSale" @close="receiptDialog = false" />
    </v-dialog>
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useApi from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';
import { formatCurrency, formatWeight } from '~/utils/format.js';
import Receipt from '~/components/sell/Receipt.vue';

const api = useApi();
const { snackbar, showSnackbar } = useSnackbar();

const isLoading = ref(false);
const isSaving = ref(false);
const loadingCustomers = ref(false);
const loadingProducts = ref(false);
const loadingGoldPrice = ref(false);

// Filters
const startDate = ref('');
const endDate = ref('');
const search = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Dialogs
const saleDialog = ref(false);
const editDialog = ref(false);
const detailsDialog = ref(false);
const cancelDialog = ref(false);
const receiptDialog = ref(false);
const selectedSale = ref(null);
const isEditing = ref(false);

// Form
const formRef = ref(null);
const editFormRef = ref(null);
const formValid = ref(false);
const editFormValid = ref(false);
const form = ref({
  saleDate: new Date().toISOString().split('T')[0], // Default to today
  customerId: '',
  productId: '',
  weight: '',
  discount: 0,
  paymentMethod: ''
});

const editForm = ref({
  discount: 0,
  paymentMethod: ''
});

// Data
const customers = ref([]);
const products = ref([]);
const sales = ref([]);
const latestGoldPrice = ref(null);

// Selected product for calculations
const selectedProduct = ref(null);

// Payment methods
const paymentMethods = ref([
  { label: 'ເງິນສົດ', value: 'ເງິນສົດ' },
  { label: 'ບັດເຄຣດິດ', value: 'ບັດເຄຣດິດ' },
  { label: 'ໂອນເງິນ', value: 'ໂອນເງິນ' }
]);

// Validation rules
const rules = {
  required: v => !!v || 'ຈຳເປັນຕ້ອງປ້ອນ',
  weight: v => (v && v > 0) || 'ນ້ຳໜັກຕ້ອງມາກກວ່າ 0',
  price: v => (v && v > 0) || 'ລາຄາຕ້ອງມາກກວ່າ 0',
  discount: v => {
    if (!v || v === '' || v === '0') return true;
    const numValue = parseFloat(String(v).replace(/,/g, ''));
    return !isNaN(numValue) && numValue >= 0 || 'ສ່ວນຫຼຸດຕ້ອງເປັນຕົວເລກແລະບໍ່ສາມາດເປັນລົບ';
  }
};

// Computed
const availableProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) {
    return [];
  }
  
  return products.value
    .filter(p => p.status === 'AVAILABLE')
    .map(p => ({
      ...p,
      displayName: p.name || p.Pd_name
    }));
});

const goldPricePerGram = computed(() => {
  if (!latestGoldPrice.value) return 0;
  return latestGoldPrice.value.Sell_price / 15.16; // Convert per baht to per gram
});

const goldValue = computed(() => {
  if (!selectedProduct.value || !goldPricePerGram.value) return 0;
  // ตรวจสอบ weight field ที่ถูกต้อง
  const weight = selectedProduct.value.weight || selectedProduct.value.Weight || 0;
  const weightInGrams = parseFloat(weight) || 0;
  const goldVal = goldPricePerGram.value * weightInGrams;
  console.log('Gold value calculation:', {
    goldPricePerGram: goldPricePerGram.value,
    weight: weightInGrams,
    goldValue: goldVal
  });
  return goldVal;
});

const calculatedPrice = computed(() => {
  if (!selectedProduct.value) return 0;
  // ตรวจสอบ estimatePrice field ที่ถูกต้อง
  const estimatePrice = selectedProduct.value.estimatePrice || selectedProduct.value.Pattern_value || 0;
  const patternValue = parseFloat(estimatePrice) || 0;
  const totalPrice = goldValue.value + patternValue;
  console.log('Price calculation:', {
    goldValue: goldValue.value,
    patternValue: patternValue,
    totalPrice: totalPrice
  });
  return totalPrice;
});

const totalSales = computed(() => sales.value.length);
const totalRevenue = computed(() => {
  return sales.value.reduce((sum, sale) => {
    const total = parseFloat(sale.total) || 0;
    return sum + total;
  }, 0);
});
const totalWeight = computed(() => {
  return sales.value.reduce((sum, sale) => {
    const weightStr = sale.weight?.toString() || '';
    const weight = parseFloat(weightStr.replace(' ກຣາມ', '').replace(',', '.')) || 0;
    return sum + weight;
  }, 0);
});
const uniqueCustomers = computed(() => {
  const customerSet = new Set();
  sales.value.forEach(sale => {
    customerSet.add(sale.customer);
  });
  return customerSet.size;
});

const filteredSales = computed(() => {
  let filtered = sales.value;
  
  // Filter by date
  if (startDate.value) {
    filtered = filtered.filter(s => s.saleDate >= startDate.value);
  }
  if (endDate.value) {
    filtered = filtered.filter(s => s.saleDate <= endDate.value);
  }
  
  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(s => 
      s.customer.toLowerCase().includes(searchLower) ||
      s.product.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
});

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSales.value.slice(start, end);
});

// Methods
const fetchCustomers = async () => {
  // ป้องกันการเรียกซ้ำขณะโหลด
  if (loadingCustomers.value) return;
  
  loadingCustomers.value = true;
  try {
    const response = await api.get('/public/customers');
    let customersData = [];
    
    if (response && response.success && Array.isArray(response.data)) {
      customersData = response.data;
    } else if (Array.isArray(response)) {
      customersData = response;
    } else {
      customersData = [];
    }
    
    // แปลงข้อมูลและกรองข้อมูลซ้ำ - ใช้ Map เพื่อประสิทธิภาพดีกว่า
    const customerMap = new Map();
    customersData.forEach(customer => {
      const id = customer.Cust_ID || customer.id;
      if (!customerMap.has(id)) {
        customerMap.set(id, {
          id: id,
          name: customer.Cust_name || customer.name,
          phone: customer.Phone || customer.phone || '',
          address: customer.Address || customer.address || ''
        });
      }
    });
    
    customers.value = Array.from(customerMap.values());
    console.log(`Loaded ${customers.value.length} unique customers`);
  } catch (error) {
    console.error('Error fetching customers:', error);
    showSnackbar('ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້', 'error');
    customers.value = [];
  } finally {
    loadingCustomers.value = false;
  }
};

const fetchProducts = async () => {
  // ป้องกันการเรียกซ้ำขณะโหลด
  if (loadingProducts.value) return;
  
  loadingProducts.value = true;
  try {
    const response = await api.get('/products');
    let productsData = [];
    
    if (response && response.success && Array.isArray(response.data)) {
      productsData = response.data;
    } else if (Array.isArray(response)) {
      productsData = response;
    } else {
      productsData = [];
    }
    
    // กรองข้อมูลซ้ำโดยใช้ Map เพื่อประสิทธิภาพดีกว่า
    const productMap = new Map();
    productsData.forEach(product => {
      const id = product.id || product.Pd_ID;
      if (!productMap.has(id)) {
        productMap.set(id, product);
      }
    });
    
    products.value = Array.from(productMap.values());
    console.log(`Loaded ${products.value.length} unique products`);
  } catch (error) {
    console.error('Error fetching products:', error);
    showSnackbar('ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້', 'error');
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
};

const fetchLatestGoldPrice = async () => {
  // ป้องกันการเรียกซ้ำขณะโหลด
  if (loadingGoldPrice.value) return;
  
  loadingGoldPrice.value = true;
  try {
    const response = await api.get('/public/prices');
    console.log('Gold price response:', response);
    
    if (response && response.success && response.data) {
      latestGoldPrice.value = response.data;
      console.log('Latest gold price:', latestGoldPrice.value);
    } else if (response && (response.Sell_price || response.Buy_price)) {
      // API ส่งข้อมูลโดยตรงไม่ได้ wrap ใน success/data
      latestGoldPrice.value = response;
      console.log('Latest gold price (direct):', latestGoldPrice.value);
    } else {
      console.warn('Could not fetch gold price:', response?.error || 'Unknown error');
      latestGoldPrice.value = null;
    }
  } catch (error) {
    console.warn('Could not fetch gold price:', error);
    latestGoldPrice.value = null;
  } finally {
    loadingGoldPrice.value = false;
  }
};

const fetchSales = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/sells');

    
    // Backend returns array directly, not wrapped in success/data
    if (Array.isArray(response)) {
      sales.value = response.map(sale => ({
        id: sale.Sell_ID,
        saleDate: sale.Sell_Date,
        customer: sale.Tb_Customer?.Cust_name || 'N/A',
        product: sale.Tb_Product?.Pd_name || 'N/A',
        weight: sale.Tb_Product?.Weight ? `${sale.Tb_Product.Weight} ກຣາມ` : 'N/A',
        price: parseFloat(sale.Price_At_Sale) || 0,
        discount: parseFloat(sale.Discount) || 0,
        total: parseFloat(sale.Total) || 0,
        paymentMethod: sale.Payment_Method || 'ເງິນສົດ'
      }));
    } else if (response && response.success && Array.isArray(response.data)) {
      // Fallback for wrapped response
      sales.value = response.data.map(sale => ({
        id: sale.Sell_ID,
        saleDate: sale.Sell_Date,
        customer: sale.Tb_Customer?.Cust_name || 'N/A',
        product: sale.Tb_Product?.Pd_name || 'N/A',
        weight: sale.Tb_Product?.Weight ? `${sale.Tb_Product.Weight} ກຣາມ` : 'N/A',
        price: parseFloat(sale.Price_At_Sale) || 0,
        discount: parseFloat(sale.Discount) || 0,
        total: parseFloat(sale.Total) || 0,
        paymentMethod: sale.Payment_Method || 'ເງິນສົດ'
      }));
    } else {
      sales.value = [];
    }
  } catch (error) {
    console.error('Error fetching sales:', error);
    showSnackbar('ບໍ່ສາມາດໂຫລດຂໍ້ມູນການຂາຍໄດ້', 'error');
    sales.value = [];
  } finally {
    isLoading.value = false;
  }
};

const onProductSelect = (productId) => {
  console.log('Product selected:', productId);
  const product = products.value.find(p => p.id === productId);
  console.log('Found product:', product);
  
  if (product) {
    selectedProduct.value = product;
    // ตรวจสอบ weight field ที่ถูกต้อง
    const weight = product.weight || product.Weight || 0;
    form.value.weight = formatWeight(weight);
    console.log('Set weight:', weight, 'formatted:', form.value.weight);
  } else {
    selectedProduct.value = null;
    form.value.weight = '';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('lo-LA');
};

const getPaymentMethodColor = (method) => {
  const colors = {
    'ເງິນສົດ': 'green',
    'ບັດເຄຣດິດ': 'blue',
    'ໂອນເງິນ': 'purple'
  };
  return colors[method] || 'grey';
};

const getPaymentMethodIcon = (method) => {
  const icons = {
    'ເງິນສົດ': 'mdi-cash',
    'ບັດເຄຣດິດ': 'mdi-credit-card',
    'ໂອນເງິນ': 'mdi-bank-transfer'
  };
  return icons[method] || 'mdi-credit-card';
};

const formatForInput = (value) => {
  if (value == null || value === '') return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parseInput = (value) => {
  return Number(String(value).replace(/,/g, '')) || 0;
};

const onOpenSaleDialog = () => {
  resetForm();
  saleDialog.value = true;
};

const resetForm = () => {
  form.value = {
    saleDate: new Date().toISOString().split('T')[0],
    customerId: '',
    productId: '',
    weight: '',
    discount: 0,
    paymentMethod: ''
  };
  selectedProduct.value = null;
  formRef.value?.resetValidation();
  formValid.value = false;
};

const calculateTotal = () => {
  const price = calculatedPrice.value || 0;
  const discountStr = String(form.value.discount || '0').replace(/,/g, '');
  const discount = parseFloat(discountStr) || 0;
  return Math.max(0, price - discount);
};

const saveSale = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  if (!selectedProduct.value) {
    showSnackbar('ກະລຸນາເລືອກສິນຄ້າກ່ອນ', 'error');
    return;
  }

  isSaving.value = true;
  try {
    const priceAtSale = calculatedPrice.value;
    const discountStr = String(form.value.discount || '0').replace(/,/g, '');
    const discount = parseFloat(discountStr) || 0;
    const total = Math.max(0, priceAtSale - discount);
    
    const payload = {
      Cust_ID: form.value.customerId,
      Pd_ID: form.value.productId,
      Sell_Date: form.value.saleDate,
      Quantity: 1, // Each jewelry item is sold as quantity 1
      Price_At_Sale: priceAtSale,
      Discount: discount,
      Payment_Method: form.value.paymentMethod,
      Total: total
    };

    const response = await api.post('/sells', payload);
    
    
    // Backend returns the created sale object directly
    if (response && response.Sell_ID) {
      // Update product status to SOLD
      await api.put(`/products/${form.value.productId}/status`, { status: 'SOLD' });
      
      showSnackbar('ບັນທຶກການຂາຍສຳເລັດ', 'success');
      saleDialog.value = false;
      await fetchSales();
      await fetchProducts(); // Refresh products to update availability
    } else {
      showSnackbar(response?.error || response?.message || 'ບໍ່ສາມາດບັນທຶກການຂາຍໄດ້', 'error');
    }
    } catch (error) {
    console.error('Error saving sale:', error);
    showSnackbar(error.message || 'ເກີດຂໍ້ຜິດພາດ', 'error');
  } finally {
    isSaving.value = false;
    }
};

const onViewDetails = (sale) => {
  selectedSale.value = sale;
  detailsDialog.value = true;
};

const onEditSale = (sale) => {
  selectedSale.value = sale;
  editForm.value = {
    discount: sale.discount || 0,
    paymentMethod: sale.paymentMethod || 'ເງິນສົດ'
  };
  editDialog.value = true;
};

const calculateEditTotal = () => {
  if (!selectedSale.value) return 0;
  const price = selectedSale.value.price || 0;
  const discountStr = String(editForm.value.discount || '0').replace(/,/g, '');
  const discount = parseFloat(discountStr) || 0;
  return Math.max(0, price - discount);
};

const updateSale = async () => {
  const { valid } = await editFormRef.value.validate();
  if (!valid) return;

  if (!selectedSale.value) return;

  isSaving.value = true;
  try {
    const discountStr = String(editForm.value.discount || '0').replace(/,/g, '');
    const discount = parseFloat(discountStr) || 0;
    const total = calculateEditTotal();
    
    const payload = {
      Discount: discount,
      Payment_Method: editForm.value.paymentMethod,
      Total: total
    };

    const response = await api.put(`/sells/${selectedSale.value.id}`, payload);
    
    if (response && (response.success || response.Sell_ID)) {
      showSnackbar('ແກ້ໄຂການຂາຍສຳເລັດ', 'success');
      editDialog.value = false;
      await fetchSales();
    } else {
      showSnackbar(response?.error || response?.message || 'ບໍ່ສາມາດແກ້ໄຂການຂາຍໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error updating sale:', error);
    showSnackbar(error.message || 'ເກີດຂໍ້ຜິດພາດ', 'error');
  } finally {
    isSaving.value = false;
  }
};

const onPrintReceipt = (sale) => {
  selectedSale.value = sale;
  receiptDialog.value = true;
};

const onCancelSale = (sale) => {
  selectedSale.value = sale;
  cancelDialog.value = true;
};

const confirmCancel = async () => {
  if (!selectedSale.value) return;
  
  isSaving.value = true;
  try {
    // Call API to delete the sale record
    await api.del(`/sells/${selectedSale.value.id}`);
    
    // Close dialog
    cancelDialog.value = false;
    
    // Refresh data
    await Promise.all([
      fetchSales(),
      fetchProducts() // Refresh products to update their status back to AVAILABLE
    ]);
    
    showSnackbar('ຍົກເລີກການຂາຍສຳເລັດ', 'success');
  } catch (error) {
    console.error('Error canceling sale:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດຍົກເລີກການຂາຍໄດ້', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Initialize data on mount
let isInitialized = false;
onMounted(async () => {
  if (isInitialized) return;
  isInitialized = true;
  
  console.log('Initializing selling page data...');
  await Promise.all([
    fetchCustomers(),
    fetchProducts(),
    fetchLatestGoldPrice(),
    fetchSales()
  ]);
  
  console.log('Selling page data initialized');
  console.log('Final data state:', {
    customers: customers.value.length,
    products: products.value.length,
    goldPrice: latestGoldPrice.value,
    sales: sales.value.length
  });
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
  word-break: break-all;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Filters Section */
.filters-section {
  background: transparent;
  margin-bottom: 24px;
}

.gold-price-display {
  display: flex;
  align-items: center;
  height: 100%;
}

.gold-price-display .v-chip {
  font-weight: 600;
  font-size: 0.95rem;
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

.total-row {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%) !important;
  font-weight: 700 !important;
}

.total-row td {
  color: #365a76 !important;
  font-weight: 700 !important;
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

/* Calculation Card */
.calculation-card {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.05) 0%, rgba(54, 90, 118, 0.02) 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.calc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calc-label {
  font-weight: 500;
  color: #6b7280;
}

.calc-value {
  font-weight: 600;
  color: #365a76;
}

.total-calc {
  margin-bottom: 0 !important;
}

.calc-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #365a76;
}

.detail-item {
  margin-bottom: 12px;
  padding: 8px 0;
}

.details-content {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.02) 0%, rgba(54, 90, 118, 0.01) 100%);
  border-radius: 8px;
  padding: 16px;
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

.v-theme--dark .total-row td {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .calculation-card {
  background: #2a2a2a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .details-content {
  background: #2a2a2a !important;
}

.v-theme--dark .detail-item {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Details Dialog Specific Styles */
.details-dialog-content {
  padding: 24px !important;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
}

.details-content {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.detail-card {
  background: rgba(54, 90, 118, 0.95);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.3);
  border: 1px solid rgba(54, 90, 118, 0.3);
  overflow: hidden;
}

.detail-card:last-child {
  margin-bottom: 0;
}

.card-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
}

.card-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}

.card-content {
  padding: 16px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  flex: 0 0 auto;
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.info-value {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  text-align: right;
  flex: 1;
}

.weight-value {
  color: #8ab4f8;
  font-weight: 600;
}

.price-breakdown {
  margin-bottom: 16px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.price-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.price-value {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
}

.discount-value {
  color: #f57c00;
}

.price-divider {
  border: none;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  margin: 12px 0;
}

.total-row {
  padding: 16px 0 8px 0;
  border-top: 2px solid #e8f5e8;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%);
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
}

.total-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2e7d32;
}

.total-chip {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  padding: 0 16px !important;
  height: 36px !important;
}

.payment-method-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.payment-chip {
  font-weight: 600 !important;
  transition: all 0.3s ease;
}

.payment-chip:hover {
  transform: scale(1.05);
}

/* Icon styling in labels */
.info-label .v-icon,
.price-label .v-icon {
  color: #8ab4f8 !important;
  opacity: 0.9;
}

.weight-value {
  position: relative;
}

.weight-value::after {
  content: '⚖️';
  margin-left: 4px;
  font-size: 0.8rem;
}

/* Total chip with enhanced styling */
.total-chip {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
  transition: all 0.3s ease !important;
}

.total-chip:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4) !important;
}

.notes-text {
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #8ab4f8;
}

/* Dark mode for details dialog */
.v-theme--dark .details-dialog-content {
  background: #2a2a2a !important;
}

.v-theme--dark .detail-card {
  background: #3a3a3a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .info-row {
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .info-label,
.v-theme--dark .price-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-theme--dark .info-value,
.v-theme--dark .price-value {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .weight-value {
  color: #8ab4f8 !important;
}

.v-theme--dark .notes-text {
  background: #404040 !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-left-color: #8ab4f8 !important;
}

.v-theme--dark .price-divider {
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .total-row {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%) !important;
  border-top-color: rgba(76, 175, 80, 0.3) !important;
}

.v-theme--dark .payment-method-section {
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

/* Dark mode icon styling */
.v-theme--dark .info-label .v-icon,
.v-theme--dark .price-label .v-icon {
  color: #8ab4f8 !important;
  opacity: 0.9;
}

.v-theme--dark .total-chip {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2) !important;
}

.v-theme--dark .total-chip:hover {
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3) !important;
}
</style> 