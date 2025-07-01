<template>
  <ModernPageLayout 
    title="ຈັດການການປ່ຽນສິນຄ້າ"
    subtitle="ສ້າງ, ແກ້ໄຂ ແລະຕິດຕາມການປ່ຽນສິນຄ້າ"
    icon="mdi-swap-horizontal"
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
              <v-icon size="32" color="#365a76">mdi-swap-horizontal</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ exchanges.length }}</h3>
              <p class="stat-label">ການປ່ຽນທັງໝົດ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#10b981">mdi-trending-up</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ thisMonthCount }}</h3>
              <p class="stat-label">ເດືອນນີ້</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#8b5cf6">mdi-cash-multiple</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ formatCurrency(totalValue) }}</h3>
              <p class="stat-label">ມູນຄ່າລວມ</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <div class="stat-card">
            <div class="stat-icon">
              <v-icon size="32" color="#f59e0b">mdi-swap-horizontal-variant</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ averageValue }}</h3>
              <p class="stat-label">ສ່ວນຕ່າງເຫຼ່ຍ</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Search and Add Button -->
    <v-row align="center" class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          label="ຄົ້ນຫາ (ຊື່ລູກຄ້າ, ຊື່ສິນຄ້າ)"
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
          variant="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="openAddDialog"
        >
           ເພີ່ມການປ່ຽນສິນຄ້າ
        </ModernButton>
      </v-col>
    </v-row>
    
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <v-data-table
        :headers="headers"
        :items="paginatedExchanges"
        :items-per-page="-1"
        hide-default-footer
        class="modern-table"
        item-value="Exch_ID"
      >
      <template #[`item.index`]="{ index }">
        {{ (page - 1) * itemsPerPage + index + 1 }}
      </template>
      
      <template #[`item.Old_Product.Pd_name`]="{ item }">
        {{ item.Old_Product?.Pd_name || 'N/A' }}
      </template>

      <template #[`item.New_Product.Pd_name`]="{ item }">
        {{ item.New_Product?.Pd_name || 'N/A' }}
      </template>

      <template #[`item.Exch_Date`]="{ item }">
        {{ formatDate(item.Exch_Date) }}
      </template>
      
      <template #[`item.Different_price`]="{ item }">
        <v-chip :color="item.Different_price >= 0 ? 'green' : 'red'" class="text-white">
          {{ formatCurrency(item.Different_price) }}
        </v-chip>
      </template>
      
      <template #[`item.actions`]="{ item }">
        <div class="action-buttons">
          <v-tooltip text="ເບິ່ງລາຍລະອຽດ" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="small"
                variant="text"
                color="info"
                @click="openViewDialog(item)"
                class="action-btn"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          
          <v-tooltip text="ພິມໃບແລກປ່ຽນ" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="small"
                variant="text"
                color="success"
                @click="openReceiptDialog(item)"
                class="action-btn"
              >
                <v-icon>mdi-printer</v-icon>
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
                @click="openEditDialog(item)"
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
                @click="openDeleteDialog(item)"
                class="action-btn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>

       <template #no-data>
        <div class="text-center py-4">
          <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-swap-horizontal-bold</v-icon>
          <p class="text-h6 text-grey-lighten-1">ຍັງບໍ່ມີຂໍ້ມູນການປ່ຽນສິນຄ້າ</p>
        </div>
      </template>
      </v-data-table>
    </div>

    <!-- Modern Pagination -->
    <div v-if="!isLoading && filteredExchanges.length > 0" class="pagination-container mt-6">
      <div class="pagination-card">
        <div class="pagination-content">
          <div class="pagination-info">
            <span class="info-text">
              ສະແດງ {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredExchanges.length) }} ຈາກ {{ filteredExchanges.length }} ລາຍການ
            </span>
          </div>
          <div class="pagination-controls">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredExchanges.length / itemsPerPage)"
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
              @update:model-value="page = 1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card class="modern-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon color="white" size="32" class="mr-3">mdi-swap-horizontal</v-icon>
            <div>
              <h3 class="header-title">{{ isEditMode ? 'ແກ້ໄຂຂໍ້ມູນການປ່ຽນສິນຄ້າ' : 'ເພີ່ມການປ່ຽນສິນຄ້າ' }}</h3>
            </div>
          </div>
        </div>
        <v-card-text class="py-4">
          <v-form ref="formRef" v-model="formValid">
            <v-container fluid class="pa-0">
              <!-- Customer and Date Section -->
              <v-card class="mb-4" elevation="2">
                <v-card-subtitle class="pb-2 text-primary font-weight-bold">ຂໍ້ມູນລູກຄ້າ</v-card-subtitle>
                <v-card-text class="pt-0">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="form.Cust_ID"
                        :items="customers"
                        item-title="Cust_name"
                        item-value="Cust_ID"
                        label="ເລືອກລູກຄ້າ"
                        outlined dense
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="form.Exch_Date"
                        type="date"
                        :max="new Date().toISOString().split('T')[0]"
                        label="ວັນທີແລກເປລີ່ຍນ"
                        variant="outlined"
                        density="comfortable"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-calendar"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn 
                        color="success" 
                        variant="outlined" 
                        @click="openAddCustomerDialog" 
                        class="mt-1"
                        block
                      >
                        <v-icon start>mdi-plus</v-icon>
                        ເພີ່ມລູກຄ້າໃໝ່
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Old Product Section -->
              <v-card class="mb-4" elevation="2">
                <v-card-subtitle class="pb-2 text-warning font-weight-bold">ຂໍ້ມູນສິນຄ້າເກົ່າ (ຮັບຄືນ)</v-card-subtitle>
                <v-card-text class="pt-0">
                  <!-- แถวที่ 1: ชื่อสินค้า, ประเภท, น้ำหนัก -->
                  <v-row>
                    <v-col cols="12" md="5">
                 <v-text-field
                  v-model="form.Old_Pd_Description"
                  label="ຊື່ສິນຄ້າເກົ່າ"
                  placeholder=""
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                        prepend-inner-icon="mdi-jewel"
                />
              </v-col>
                    <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.Old_Pd_Type"
                  label="ປະເພດ"
                  placeholder=""
                  variant="outlined"
                  density="comfortable"
                        prepend-inner-icon="mdi-tag"
                />
              </v-col>
                    <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="form.Old_Pd_Actual_Weight"
                        label="ນ້ຳໜັກ (ກຣັມ)"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.isNumber]"
                        prepend-inner-icon="mdi-weight"
                        suffix="ກຣາມ"
                />
              </v-col>
                  </v-row>
                  
                  <!-- แถวที่ 2: สภาพสินค้า, ราคารับซื้อคืน -->
                  <v-row>
                    <v-col cols="12" md="6">
                <v-select
                  v-model="form.Old_Product_Condition"
                  :items="conditionOptions"
                  item-title="text"
                  item-value="value"
                  label="ສະພາບສິນຄ້າເກົ່າ"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-star"
                />
              </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="formatForInput(form.Old_Product_Value)"
                        @update:model-value="form.Old_Product_Value = parseInput($event)"
                        label="ລາຄາຮັບຊື້ຄືນ"
                        type="text"
                        variant="outlined"
                        density="comfortable"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-cash-minus"
                        suffix="LAK"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- New Product Section -->
              <v-card class="mb-4" elevation="2">
                <v-card-subtitle class="pb-2 text-success font-weight-bold">ຂໍ້ມູນສິນຄ້າໃໝ່ (ຂາຍ)</v-card-subtitle>
                <v-card-text class="pt-0">
                  <v-row>
                     <v-col cols="12" md="6">
                 <v-autocomplete
                  v-model="form.New_Pd_ID"
                        :items="availableProducts || []"
                        item-title="name"
                        item-value="id"
                  label="ເລືອກສິນຄ້າໃໝ່"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                        prepend-inner-icon="mdi-diamond-stone"
                />
              </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        :model-value="formatWeight(newProductWeight)"
                        label="ນ້ຳໜັກ"
                        readonly
                        variant="filled"
                        prepend-inner-icon="mdi-weight"
                        suffix="ກຣາມ"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                <v-text-field
                  :model-value="formatForInput(form.New_Product_Value)"
                  @update:model-value="form.New_Product_Value = parseInput($event)"
                        label="ລາຄາຂາຍ"
                  type="text"
                  outlined dense
                  :rules="[rules.required]"
                        prepend-inner-icon="mdi-cash-plus"
                        suffix="LAK"
                />
              </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              
              <!-- Summary Section -->
              <v-card class="mb-4" elevation="2">
                <v-card-subtitle class="pb-2 text-info font-weight-bold">ສະຫຼຸບຍອດ</v-card-subtitle>
                <v-card-text class="pt-0">
                  <v-row>
               <v-col cols="12" md="4">
                <v-text-field
                  :model-value="formatForInput(form.Gold_Change_Fee)"
                  @update:model-value="form.Gold_Change_Fee = parseInput($event)"
                        label="ຄ່າປ່ຽນ"
                  type="text"
                  outlined dense
                        prepend-inner-icon="mdi-swap-horizontal"
                        suffix="LAK"
                />
              </v-col>
               <v-col cols="12" md="4">
                <v-text-field
                  :model-value="formatForInput(form.Lost_Weight_Fee)"
                  @update:model-value="form.Lost_Weight_Fee = parseInput($event)"
                        label="ຄ່ານ້ຳໜັກທອງຫຼຸດ"
                  type="text"
                  outlined dense
                        prepend-inner-icon="mdi-minus-circle"
                        suffix="LAK"
                />
              </v-col>
               <v-col cols="12" md="4">
                <v-text-field
                  :model-value="formatForInput(calculatedDifference)"
                        label="ສ່ວນຕ່າງ"
                  readonly
                  variant="filled"
                  :hint="differenceHint"
                  persistent-hint
                        prepend-inner-icon="mdi-calculator"
                        suffix="LAK"
                        :color="calculatedDifference >= 0 ? 'success' : 'error'"
                />
              </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
               
               <!-- Notes Section -->
               <v-card class="mb-4" elevation="2">
                 <v-card-subtitle class="pb-2 text-grey-darken-1 font-weight-bold">ໝາຍເຫດ</v-card-subtitle>
                 <v-card-text class="pt-0">
                    <v-textarea
                        v-model="form.Notes"
                     label="ໝາຍເຫດເພີ່ມເຕີມ"
                        outlined
                        dense
                        rows="2"
                     prepend-inner-icon="mdi-note-text"
                     placeholder="ກະລຸນາໃສ່ໝາຍເຫດເພີ່ມເຕີມ (ຖ້າມີ)"
                    />
                 </v-card-text>
               </v-card>
             </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="outlined" color="error" @click="closeDialog" :disabled="isSaving">
            <v-icon start>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
          <v-btn color="primary" @click="saveExchange" :loading="isSaving" :disabled="!formValid">
            <v-icon start>mdi-content-save</v-icon>
            ບັນທຶກ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

        <!-- Details Dialog - Redesigned Simple -->
    <v-dialog v-model="viewDialog" max-width="650px">
      <v-card class="modern-card">
        <!-- Simple Header -->
        <div class="modern-header">
          <div class="header-content">
            <v-icon color="white" size="32" class="mr-3">mdi-swap-horizontal</v-icon>
            <div>
              <h3 class="header-title">ການປ່ຽນສິນຄ້າ #{{ selectedExchange?.Exch_ID }}</h3>
              <p class="header-subtitle">{{ formatDate(selectedExchange?.Exch_Date) }}</p>
            </div>
          </div>
        </div>

        <v-card-text v-if="selectedExchange" class="modern-content">
          <!-- Customer Info -->
          <div class="info-card customer-card">
            <div class="card-header">
              <v-icon color="primary" class="mr-2">mdi-account</v-icon>
              <span class="card-title">ຂໍ້ມູນລູກຄ້າ</span>
            </div>
            <p class="customer-name">{{ getCustomerDisplayName(selectedExchange.Cust_ID) }}</p>
            <div class="customer-details">
              <p class="detail-item">
                <v-icon size="16" class="mr-1">mdi-phone</v-icon>
                {{ getCustomerDisplayPhone(selectedExchange.Cust_ID) }}
              </p>
              <p class="detail-item">
                <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                {{ getCustomerDisplayAddress(selectedExchange.Cust_ID) }}
              </p>
            </div>
          </div>

          <!-- Exchange Details -->
          <div class="info-card">
            <div class="card-header">
              <v-icon color="info" class="mr-2">mdi-information</v-icon>
              <span class="card-title">ລາຍລະອຽດການແລກປ່ຽນ</span>
            </div>
            <div class="exchange-details">
              <div class="detail-row">
                <span class="detail-label">ລະຫັດການແລກປ່ຽນ:</span>
                <v-chip color="primary" size="small">#{{ selectedExchange.Exch_ID }}</v-chip>
              </div>
              <div class="detail-row">
                <span class="detail-label">ວັນທີ:</span>
                <span class="detail-value">{{ formatDate(selectedExchange.Exch_Date) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ຄ່າປ່ຽນທອງ:</span>
                <span class="detail-value">{{ formatCurrency(selectedExchange.Gold_Change_Fee || 0) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ຄ່ານ້ຳໜັກທອງຫຼຸດ:</span>
                <span class="detail-value">{{ formatCurrency(selectedExchange.Lost_Weight_Fee || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Exchange Summary -->
          <div class="exchange-summary">
            <div class="product-item old-item">
              <div class="product-label">
                <v-icon color="orange" size="20">mdi-arrow-left</v-icon>
                <span>ສິນຄ້າເກົ່າ (ຮັບຄືນ)</span>
              </div>
              <div class="product-info">
                <p class="product-name">{{ selectedExchange.Old_Product?.Pd_name || selectedExchange.Old_Pd_Description || 'N/A' }}</p>
                <div class="product-details">
                  <span>{{ formatWeight(selectedExchange.Old_Product?.Weight || selectedExchange.Old_Pd_Actual_Weight) }}</span>
                  <span class="divider">•</span>
                  <span>{{ selectedExchange.Old_Product?.Type || selectedExchange.Old_Pd_Type || 'N/A' }}</span>
                  <span class="divider">•</span>
                  <span>{{ formatCurrency(selectedExchange.Old_Product_Value) }}</span>
                </div>
                <div class="product-condition" v-if="selectedExchange.Old_Product?.condition">
                  <v-chip 
                    :color="getConditionColor(selectedExchange.Old_Product.condition)" 
                    size="small" 
                    variant="flat"
                  >
                    {{ getConditionText(selectedExchange.Old_Product.condition) }}
                  </v-chip>
                </div>
              </div>
            </div>

            <div class="exchange-arrow-simple">
              <v-icon color="primary" size="24">mdi-arrow-right</v-icon>
            </div>

            <div class="product-item new-item">
              <div class="product-label">
                <v-icon color="green" size="20">mdi-arrow-right</v-icon>
                <span>ສິນຄ້າໃໝ່ (ຂາຍ)</span>
              </div>
              <div class="product-info">
                <p class="product-name">{{ selectedExchange.New_Product?.Pd_name || 'N/A' }}</p>
                <div class="product-details">
                  <span>{{ formatWeight(selectedExchange.New_Product?.Weight) }}</span>
                  <span class="divider">•</span>
                  <span>{{ selectedExchange.New_Product?.Type || 'N/A' }}</span>
                  <span class="divider">•</span>
                  <span>{{ formatCurrency(selectedExchange.New_Product_Value) }}</span>
                </div>
                <div class="product-status" v-if="selectedExchange.New_Product?.status">
                  <v-chip 
                    :color="getStatusColor(selectedExchange.New_Product.status)" 
                    size="small" 
                    variant="flat"
                  >
                    {{ selectedExchange.New_Product.status }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- Final Result -->
          <div class="result-card">
            <div class="result-header">
              <v-icon color="info" class="mr-2">mdi-calculator</v-icon>
              <span>ສະຫຼຸບຍອດ</span>
            </div>
            <div class="result-content">
              <div class="result-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">ລາຄາສິນຄ້າໃໝ່:</span>
                  <span class="breakdown-value">{{ formatCurrency(selectedExchange.New_Product_Value) }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">ຄ່າປ່ຽນທອງ:</span>
                  <span class="breakdown-value">-{{ formatCurrency(selectedExchange.Gold_Change_Fee || 0) }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">ຄ່ານ້ຳໜັກທອງຫຼຸດ:</span>
                  <span class="breakdown-value">-{{ formatCurrency(selectedExchange.Lost_Weight_Fee || 0) }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">ລາຄາສິນຄ້າເກົ່າ:</span>
                  <span class="breakdown-value">-{{ formatCurrency(selectedExchange.Old_Product_Value) }}</span>
                </div>
                <hr class="breakdown-divider">
              </div>
              <div class="result-item">
                <span class="result-label">ສ່ວນຕ່າງສຸດທິ:</span>
                <v-chip :color="selectedExchange.Different_price >= 0 ? 'success' : 'error'" class="result-chip">
                  {{ formatCurrency(selectedExchange.Different_price) }}
                </v-chip>
              </div>
              <p class="result-note">
                {{ selectedExchange.Different_price >= 0 ? 'ລູກຄ້າຈ່າຍເພີ່ມ' : 'ຮ້ານຈ່າຍຄືນລູກຄ້າ' }}
              </p>
            </div>
          </div>

          <!-- Notes (if any) -->
          <div v-if="selectedExchange.Notes" class="notes-card">
            <div class="notes-header">
              <v-icon color="grey-darken-1" size="20" class="mr-2">mdi-note-text</v-icon>
              <span>ໝາຍເຫດ</span>
            </div>
            <p class="notes-text">{{ selectedExchange.Notes }}</p>
          </div>
            </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="closeViewDialog">
            <v-icon start>mdi-check</v-icon>
            ປິດ
          </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
    
    <!-- Add Customer Dialog -->
    <v-dialog v-model="addCustomerDialog" max-width="500px">
      <v-card class="modern-dialog">
        <v-card-title class="dialog-title">ເພີ່ມລູກຄ້າໃໝ່</v-card-title>
        <v-form ref="customerForm" @submit.prevent="saveNewCustomer" v-model="customerFormValid">
          <v-card-text class="pa-6">
            <v-text-field 
              v-model="newCustomer.name" 
              label="ຊື່ລູກຄ້າ" 
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-account"
              color="#365a76"
            />
            <v-text-field 
              v-model="newCustomer.phone" 
              label="ເບີໂທ" 
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-phone"
              color="#365a76"
            />
            <v-text-field 
              v-model="newCustomer.address" 
              label="ທີ່ຢູ່" 
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-map-marker"
              color="#365a76"
            />
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <v-btn variant="outlined" color="error" @click="addCustomerDialog = false" :disabled="savingCustomer">
              ຍົກເລີກ
            </v-btn>
            <v-btn color="primary" @click="saveNewCustomer" :loading="savingCustomer" :disabled="!customerFormValid">
              ບັນທຶກ
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Exchange Receipt Dialog -->
    <v-dialog v-model="receiptDialog" max-width="900px" fullscreen transition="dialog-bottom-transition">
      <ExchangeReceipt
        :exchange="selectedExchange"
        :customers="customers"
        @close="receiptDialog = false"
      />
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-model="deleteDialog"
      title="ຢືນຢັນການລຶບ"
      :message="`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນການປ່ຽນສິນຄ້າ #${selectedExchange?.Exch_ID}? ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້!`"
      @confirm="deleteExchange"
      @cancel="deleteDialog = false"
    />

  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import { useSnackbar } from '~/composables/useSnackbar';
import { formatWeight } from '~/utils/format.js';
import ExchangeReceipt from '~/components/sell/ExchangeReceipt.vue';

// ----- Utils -----
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('lo-LA', options);
};

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('lo-LA', { style: 'currency', currency: 'LAK' }).format(value);
}

const formatForInput = (value) => {
    if (value === null || value === undefined) return null;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseInput = (value) => {
    if (!value) return null;
    const num = Number(String(value).replace(/,/g, ''));
    return isNaN(num) ? null : num;
};

// --- State Management ---
const search = ref('');
const dialog = ref(false);
const viewDialog = ref(false);
const receiptDialog = ref(false);
const deleteDialog = ref(false);
const addCustomerDialog = ref(false);

const isEditMode = ref(false);
const isSaving = ref(false);
const savingCustomer = ref(false);
const selectedExchange = ref(null);
const selectedExchangeId = ref(null);
const formValid = ref(false);
const customerFormValid = ref(false);
const formRef = ref(null);
const customerForm = ref(null);
const snackbar = ref({ show: false, message: '', color: '' });

const newCustomer = ref({
  name: '',
  phone: '',
  address: ''
});

// Pagination
const page = ref(1);
const itemsPerPage = ref(10);

const emptyForm = () => ({
  Exch_ID: null,
  Cust_ID: '',
  Old_Pd_ID: null,
  Old_Pd_Description: '',
  Old_Pd_Type: '',
  New_Pd_ID: '',
  Exch_Date: new Date().toISOString().split('T')[0],
  Old_Pd_Actual_Weight: 0,
  Old_Product_Condition: 'GOOD',
  Old_Product_Value: 0,
  New_Product_Value: 0,
  Gold_Change_Fee: 0,
  Lost_Weight_Fee: 0,
  Different_price: 0,
  Notes: '',
});

const form = ref(emptyForm());

// Replace useAsyncData with regular reactive refs and fetch functions
const api = useApi();
const { showSnackbar } = useSnackbar();
const exchanges = ref([]);
const customers = ref([]);
const products = ref([]);
const latestPrice = ref(null);
const isLoading = ref(true);

const fetchExchanges = async () => {
  try {
    const data = await api.get('/exchanges');
    exchanges.value = data || [];
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    exchanges.value = [];
  }
};

const fetchCustomers = async () => {
  try {
    const response = await api.get('/public/customers');
    
    if (response && response.success) {
      customers.value = response.data || [];
    } else if (response && !response.success) {
      showSnackbar(response.error || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້', 'error');
      customers.value = [];
    } else {
      // response is null (likely due to auth redirect)
      customers.value = [];
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້', 'error');
    customers.value = [];
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/public/products');
    
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
  }
};

const fetchLatestPrice = async () => {
  try {
    const response = await api.get('/public/prices');
    
    if (response && response.success) {
      latestPrice.value = response.data;
    } else if (response && !response.success) {
      console.warn('Could not fetch gold price:', response.error);
      latestPrice.value = null;
    } else {
      latestPrice.value = response;
    }
  } catch (error) {
    console.warn('Could not fetch gold price:', error);
    latestPrice.value = null;
  }
};

const refreshExchanges = fetchExchanges;

// ----- Computed Properties -----
const filteredExchanges = computed(() => {
  if (!exchanges.value) return [];
  if (!search.value) return exchanges.value;
  const lowerCaseSearch = search.value.toLowerCase();
  return exchanges.value.filter(ex => {
    const customerName = ex.Tb_Customer?.Cust_name?.toLowerCase() || '';
    const oldProductDesc = ex.Old_Pd_Description?.toLowerCase() || '';
    const newProductName = ex.New_Product?.Pd_name?.toLowerCase() || '';
    return customerName.includes(lowerCaseSearch) || oldProductDesc.includes(lowerCaseSearch) || newProductName.includes(lowerCaseSearch);
  });
});

const paginatedExchanges = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredExchanges.value.slice(start, end);
});

const availableProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) return [];
  // Filter to show only available products
  return products.value.filter(product => product.status === 'AVAILABLE');
});

const calculatedDifference = computed(() => {
  const oldValue = Number(form.value.Old_Product_Value) || 0;
  const newValue = Number(form.value.New_Product_Value) || 0;
  const goldChangeFee = Number(form.value.Gold_Change_Fee) || 0;
  const lostWeightFee = Number(form.value.Lost_Weight_Fee) || 0;
  return (newValue + goldChangeFee + lostWeightFee) - oldValue;
});

const differenceHint = computed(() => {
  const diff = calculatedDifference.value;
  if (diff > 0) return 'ລູກຄ້າຕ້ອງຈ່າຍເພີ່ມ';
  if (diff < 0) return 'ຮ້ານຕ້ອງຈ່າຍຄືນລູກຄ້າ';
  return 'ບໍ່ມີສ່ວນຕ່າງ';
});

// Statistics computed properties
const thisMonthCount = computed(() => {
  const currentMonth = new Date().getMonth();
  return exchanges.value.filter(item => 
    new Date(item.Exch_Date).getMonth() === currentMonth
  ).length;
});

const totalValue = computed(() => 
  exchanges.value.reduce((sum, item) => sum + Math.abs(item.Different_price || 0), 0)
);

const averageValue = computed(() => {
  if (exchanges.value.length === 0) return formatCurrency(0);
  const avg = totalValue.value / exchanges.value.length;
  return formatCurrency(avg);
});

const _oldProductWeight = computed(() => {
  if (!form.value.Old_Pd_ID || !products.value) return 0;
  const product = products.value.find(p => p.id === form.value.Old_Pd_ID);
  return product?.weight || 0;
});

const newProductWeight = computed(() => {
  if (!form.value.New_Pd_ID || !products.value) return 0;
  const product = products.value.find(p => p.id === form.value.New_Pd_ID);
  return product?.weight || 0;
});


// ----- Watchers -----
watch(() => form.value.Old_Pd_ID, (newId) => {
  if (newId) {
    const selectedProduct = products.value?.find(p => p.id === newId);
    if (selectedProduct) {
        form.value.Old_Pd_Actual_Weight = selectedProduct.weight || 0;
    }
    if (newId === form.value.New_Pd_ID) {
        form.value.New_Pd_ID = null;
        form.value.New_Product_Value = 0;
    }
  } else {
    form.value.Old_Pd_Actual_Weight = 0;
  }
});

watch(() => form.value.New_Pd_ID, (newId) => {
  if (newId && latestPrice.value && products.value) {
    const selectedProduct = products.value.find(p => p.id === newId);
    if (selectedProduct) {
      const sellPricePerBaht = Number(latestPrice.value.Sell_price) || 0;
      const weightInGrams = Number(selectedProduct.weight) || 0;
      const patternValue = Number(selectedProduct.estimatePrice) || 0;
      
      if (sellPricePerBaht > 0) {
        const pricePerGram = sellPricePerBaht / 15.16;
        const goldValue = pricePerGram * weightInGrams;
        // Round to nearest 1000 LAK as is common
        form.value.New_Product_Value = Math.round((goldValue + patternValue) / 1000) * 1000;
      } else {
        // Fallback to pattern value if no price is set
        form.value.New_Product_Value = patternValue;
      }
    }
  } else {
     form.value.New_Product_Value = 0;
  }
});

// ----- Dialog and Form Logic -----
const openAddDialog = () => {
  isEditMode.value = false;
  form.value = emptyForm();
  dialog.value = true;
};

const openEditDialog = (item) => {
  isEditMode.value = true;
  selectedExchangeId.value = item.Exch_ID;
  form.value = {
    Exch_ID: item.Exch_ID,
    Cust_ID: item.Cust_ID,
    New_Pd_ID: item.New_Pd_ID,
    Old_Pd_ID: item.Old_Pd_ID,
    Exch_Date: item.Exch_Date ? new Date(item.Exch_Date).toISOString().split('T')[0] : '',
    Notes: item.Notes ?? '',
    
    Old_Pd_Description: item.Old_Product?.Pd_name ?? '',
    Old_Pd_Type: item.Old_Product?.Type ?? '',
    Old_Pd_Actual_Weight: Number(item.Old_Product?.Weight) || 0,

    Old_Product_Value: item.Old_Product_Value ?? 0,
    New_Product_Value: item.New_Product_Value ?? 0,
    Gold_Change_Fee: item.Gold_Change_Fee ?? 0,
    Lost_Weight_Fee: item.Lost_Weight_Fee ?? 0,
    Different_price: item.Different_price ?? 0,
  };
  dialog.value = true;
};

const openViewDialog = (item) => {
  selectedExchange.value = item;
  viewDialog.value = true;
};

const openReceiptDialog = (item) => {
  selectedExchange.value = item;
  receiptDialog.value = true;
};

const openDeleteDialog = (item) => {
  selectedExchange.value = item;
  deleteDialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    form.value = emptyForm();
    isEditMode.value = false;
    selectedExchangeId.value = null;
    formRef.value?.resetValidation();
  }, 300);
};

const closeViewDialog = () => {
  viewDialog.value = false;
  selectedExchange.value = null;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  selectedExchange.value = null;
};

// ----- Customer Dialog Functions -----
const openAddCustomerDialog = () => {
  newCustomer.value = {
    name: '',
    phone: '',
    address: ''
  };
  addCustomerDialog.value = true;
};

const saveNewCustomer = async () => {
  const { valid } = await customerForm.value.validate();
  if (!valid) return;

  savingCustomer.value = true;
  try {
    const payload = {
      Cust_name: newCustomer.value.name,
      Phone: newCustomer.value.phone,
      Address: newCustomer.value.address,
    };
    
    const response = await api.post('/customers', payload);
    
    if (response && response.success) {
      showSnackbar('ເພີ່ມລູກຄ້າໃໝ່ສຳເລັດ', 'success');
      addCustomerDialog.value = false;
      
      // Refresh customers and auto-select the new customer
      await fetchCustomers();
      
      // Find and select the newly created customer
      const newCustomerId = response.data?.Cust_ID || response.Cust_ID;
      if (newCustomerId) {
        form.value.Cust_ID = newCustomerId;
      }
    } else {
      showSnackbar(response?.error || 'ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້', 'error');
    }
  } catch (error) {
    console.error('Error adding customer:', error);
    showSnackbar(error.message || 'ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້', 'error');
  } finally {
    savingCustomer.value = false;
  }
};

// ----- API Calls -----
const saveExchange = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSaving.value = true;

  const payload = {
    ...form.value,
    Different_price: calculatedDifference.value,
    Gold_Change_Fee: Number(form.value.Gold_Change_Fee) || 0,
    Lost_Weight_Fee: Number(form.value.Lost_Weight_Fee) || 0,
    Old_Product_Value: Number(form.value.Old_Product_Value) || 0,
    New_Product_Value: Number(form.value.New_Product_Value) || 0,
    // Pass the old product details for creation on the backend
    Old_Pd_Description: form.value.Old_Pd_Description,
    Old_Pd_Type: form.value.Old_Pd_Type,
    Old_Pd_Actual_Weight: Number(form.value.Old_Pd_Actual_Weight) || 0,
    Old_Product_Condition: form.value.Old_Product_Condition || 'GOOD',
  };
  
  try {
    if (isEditMode.value) {
      await api.put(`/exchanges/${selectedExchangeId.value}`, payload);
      showSnackbar('ອັບເດດຂໍ້ມູນສຳເລັດ', 'success');
    } else {
      await api.post('/exchanges', payload);
      showSnackbar('ເພີ່ມຂໍ້ມູນການປ່ຽນສິນຄ້າໃໝ່ສຳເລັດ', 'success');
    }
    await refreshExchanges();
    closeDialog();
  } catch (error) {
    const errorMessage = error.message || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ';
    console.error('Error saving exchange:', error);
    showSnackbar(`ເກີດຂໍ້ຜິດພາດ: ${errorMessage}`, 'error');
  } finally {
    isSaving.value = false;
  }
};

const deleteExchange = async () => {
    if (!selectedExchange.value) return;
    isSaving.value = true;
    try {
        await api.del(`/exchanges/${selectedExchange.value.Exch_ID}`);
        await refreshExchanges();
        showSnackbar('ລຶບຂໍ້ມູນສຳເລັດ', 'success');
        closeDeleteDialog();
    } catch (error) {
        console.error('Error deleting exchange:', error);
        showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນ', 'error');
    } finally {
        isSaving.value = false;
    }
};

// ----- Headers -----
const headers = [
  { title: 'ລ/ດ', key: 'index', sortable: false, align: 'center' },
  { title: 'ລູກຄ້າ', key: 'Tb_Customer.Cust_name', sortable: true },
  { title: 'ວັນທີ', key: 'Exch_Date', sortable: true },
  { title: 'ສິນຄ້າເກົ່າ (ຮັບຄືນ)', key: 'Old_Product.Pd_name', sortable: true },
  { title: 'ສິນຄ້າໃໝ່ (ຂາຍ)', key: 'New_Product.Pd_name', sortable: true },
  { title: 'ສ່ວນຕ່າງ', key: 'Different_price', sortable: true, align: 'end' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
];

const rules = {
    required: v => !!v || 'ກະລຸນາປ້ອນຂໍ້ມູນ',
    isNumber: v => !isNaN(parseFloat(v)) && isFinite(v) || 'ກະລຸນາປ້ອນຕົວເລກ',
};

const conditionOptions = [
  { text: 'ສະພາບດີ', value: 'GOOD' },
  { text: 'ເສຍຫາຍ', value: 'DAMAGED' },
  { text: 'ຕ້ອງຊ່ອມ', value: 'NEEDS_REPAIR' },
];

const getCustomerDisplayName = (custId) => {
  if (!custId || !customers.value || !Array.isArray(customers.value)) return 'N/A';
  const customer = customers.value.find(c => c.Cust_ID === custId || c.id === custId);
  return customer?.Cust_name || customer?.name || 'N/A';
};

const getCustomerDisplayPhone = (custId) => {
  if (!custId || !customers.value || !Array.isArray(customers.value)) return 'ບໍ່ມີຂໍ້ມູນ';
  const customer = customers.value.find(c => c.Cust_ID === custId || c.id === custId);
  return customer?.Cust_phone || customer?.phone || 'ບໍ່ມີຂໍ້ມູນ';
};

const getCustomerDisplayAddress = (custId) => {
  if (!custId || !customers.value || !Array.isArray(customers.value)) return 'ບໍ່ມີຂໍ້ມູນ';
  const customer = customers.value.find(c => c.Cust_ID === custId || c.id === custId);
  return customer?.Cust_address || customer?.address || 'ບໍ່ມີຂໍ້ມູນ';
};

const _getCustomerInfo = (custId) => {
  if (!custId || !customers.value || !Array.isArray(customers.value)) return null;
  return customers.value.find(customer => 
    customer.Cust_ID === custId || 
    customer.id === custId
  );
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

const getStatusColor = (status) => {
  const colors = {
    AVAILABLE: 'green',
    SOLD: 'blue-grey',
    REPURCHASED: 'orange',
    DAMAGED: 'red',
    EXCHANGED: 'purple'
  };
  return colors[status] || 'grey';
};

// ----- Lifecycle Hooks -----
onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      fetchExchanges(),
      fetchCustomers(),
      fetchProducts(),
      fetchLatestPrice(),
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
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

/* Dialog Styles */
.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.dialog-actions {
  background: #f8f9fa;
  padding: 20px 24px !important;
  border-top: 1px solid #e0e0e0;
}

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

/* Modern Details Dialog - Updated to match returns.vue theme */
.modern-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  background: #2a2a2a !important;
}

.modern-header {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
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
  background: #2a2a2a;
}

.info-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #365a76;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-weight: 600;
  color: #ccc;
  font-size: 0.9rem;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.customer-details {
  margin-top: 8px;
}

.detail-item {
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: #ccc;
  display: flex;
  align-items: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.detail-label {
  font-weight: 600;
  color: #fff;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
  color: #ccc;
  font-size: 0.9rem;
}

.exchange-details {
  margin-bottom: 20px;
}

.breakdown-divider {
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 12px 0;
}

.product-condition,
.product-status {
  margin-top: 8px;
}

.exchange-summary {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-item {
  flex: 1;
}

.product-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ccc;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.divider {
  color: #ccc;
}

.exchange-arrow-simple {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
  border-radius: 50%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #10b981;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  color: #ccc;
  font-size: 0.9rem;
}

.result-content {
  text-align: center;
}

.result-breakdown {
  margin-bottom: 12px;
}

.breakdown-item {
  margin-bottom: 8px;
}

.breakdown-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.breakdown-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ccc;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.result-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.result-chip {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 0 16px !important;
  height: 36px !important;
}

.result-note {
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
  font-style: italic;
}

.notes-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #9e9e9e;
}

.notes-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ccc;
  font-size: 0.9rem;
}

.notes-text {
  color: #fff;
  line-height: 1.5;
  margin: 0;
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

/* Dark Mode for Dialog Content */
.v-theme--dark .modern-content {
  background: #1e1e1e !important;
}

.v-theme--dark .info-card,
.v-theme--dark .exchange-summary,
.v-theme--dark .result-card,
.v-theme--dark .notes-card {
  background: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-left-color: #365a76 !important;
}

.v-theme--dark .customer-name,
.v-theme--dark .product-name,
.v-theme--dark .product-details,
.v-theme--dark .notes-text,
.v-theme--dark .card-title,
.v-theme--dark .result-label {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Dark Mode for Form Dialog */
.v-theme--dark .modern-dialog {
  background: #1e1e1e !important;
}

.v-theme--dark .dialog-actions {
  background: #1e1e1e !important;
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}
</style>