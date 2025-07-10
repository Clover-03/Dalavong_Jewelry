<template>
  <ModernPageLayout 
    title="ຈັດການການຊື້ຄືນສິນຄ້າ"
    subtitle="ສ້າງ, ແກ້ໄຂ ແລະຕິດຕາມການຊື້ຄືນສິນຄ້າ"
    icon="mdi-cash-refund"
  >
    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Main List View -->
        <!-- Summary Statistics -->
        <div class="summary-section mb-6">
          <v-row>
            <v-col cols="12" md="3">
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon size="32" color="#365a76">mdi-cash-refund</v-icon>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatNumber(repurchases.length) }}</h3>
                  <p class="stat-label">ການຊື້ຄືນທັງໝົດ</p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="stat-card">
                <div class="stat-icon">
                  <v-icon size="32" color="#10b981">mdi-trending-up</v-icon>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatNumber(thisMonthCount) }}</h3>
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
                  <v-icon size="32" color="#f59e0b">mdi-cash-minus</v-icon>
                </div>
                <div class="stat-content">
                  <h3 class="stat-number">{{ formatCurrency(totalDeductions) }}</h3>
                  <p class="stat-label">ຄ່າຫັກລວມ</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <v-row align="center" class="mb-6">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="ຄົ້ນຫາ (ລູກຄ້າ, ພະນັກງານ)"
                variant="outlined"
                density="comfortable"
                hide-details
                prepend-inner-icon="mdi-magnify"
                color="#365a76"
                clearable
              />
            </v-col>
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
            <v-spacer />
            <v-col cols="auto">
              <ModernButton 
                variant="primary"
                size="large"
                prepend-icon="mdi-plus"
                @click="openAddDialog"
              >
                ເພີ່ມການຊື້ຄືນ
              </ModernButton>
            </v-col>
          </v-row>
        </div>

        <!-- Loading State -->
        <div v-if="loading.list" class="text-center py-10">
          <v-progress-circular indeterminate color="#365a76" size="64"></v-progress-circular>
          <p class="mt-4">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
        </div>

        <!-- Data Table -->
        <div v-else class="table-container">
          <v-table class="modern-table elevation-2">
            <thead>
              <tr>
                <th>#</th>
                <th>ລູກຄ້າ</th>
                <th>ພະນັກງານ</th>
                <th>ວັນທີ</th>
                <th class="text-right">ລາຄາຮັບຊື້ຄືນ</th>
                <th class="text-right">ລາຄາສຸດທິ</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedRepurchases" :key="item.Re_ID">
                <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ getCustomerDisplayName(item) }}</td>
                <td>{{ item.Tb_User?.username || 'N/A' }}</td>
                <td>{{ formatDate(item.Re_date) }}</td>
                <td class="text-right">
                  <span class="price-original">{{ formatCurrency(item.Repurchase_Price) }}</span>
                </td>
                <td class="text-right">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-chip 
                        v-bind="props"
                        :color="getNetPriceColor(item)"
                        variant="tonal" 
                        size="small"
                        class="net-price-chip"
                      >
                        {{ formatCurrency(item.Net_Repurchase_Price) }}
                      </v-chip>
                    </template>
                    <div class="price-tooltip">
                      <div class="tooltip-item">
                        <span>ລາຄາເດີມ:</span>
                        <span>{{ formatCurrency(item.Repurchase_Price) }}</span>
                      </div>
                      <div v-if="item.Damage_Cost > 0" class="tooltip-item deduction">
                        <span>ຫັກຄ່າເສຍຫາຍ:</span>
                        <span>-{{ formatCurrency(item.Damage_Cost) }}</span>
                      </div>
                      <div v-if="item.Loose_Gold_Cost > 0" class="tooltip-item deduction">
                        <span>ຫັກຄ່າທອງຫຼຸດ:</span>
                        <span>-{{ formatCurrency(item.Loose_Gold_Cost) }}</span>
                      </div>
                      <hr class="tooltip-divider">
                      <div class="tooltip-item total">
                        <span>ລາຄາສຸດທິ:</span>
                        <span>{{ formatCurrency(item.Net_Repurchase_Price) }}</span>
                      </div>
                    </div>
                  </v-tooltip>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <v-tooltip text="ເບິ່ງລາຍລະອຽດ" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="small"
                          variant="text"
                          color="info"
                          @click="showDetails(item)"
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
                          @click="editItem(item)"
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
                          @click="deleteItem(item)"
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
          <div v-if="!loading.list && filteredRepurchases.length > 0" class="pagination-container">
            <v-card class="pagination-card" elevation="1">
              <v-card-text class="pa-4">
                <div class="pagination-content">
                  <div class="pagination-info">
                    <span class="pagination-text">
                      ສະແດງ {{ ((page - 1) * itemsPerPage) + 1 }} - {{ Math.min(page * itemsPerPage, filteredRepurchases.length) }} 
                      ຈາກ {{ filteredRepurchases.length }} ການຊື້ຄືນ
                    </span>
                  </div>
                  
                  <div class="pagination-controls">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredRepurchases.length / itemsPerPage)"
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

          <!-- Empty State -->
          <div v-if="!loading.list && filteredRepurchases.length === 0" class="text-center py-10">
            <v-icon size="64" color="grey-lighten-2">mdi-package-variant-closed-remove</v-icon>
            <p class="mt-4 text-h6 text-grey-lighten-1">ບໍ່ມີຂໍ້ມູນການຊື້ຄືນ</p>
          </div>
        </div>

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="1000px" persistent>
      <v-card class="modern-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon color="white" size="32" class="mr-3">mdi-cash-refund</v-icon>
            <div>
              <h3 class="header-title">ເພີ່ມການຊື້ຄືນສິນຄ້າ</h3>
              <p class="header-subtitle">ເລືອກປະເພດການຊື້ຄືນ</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeAddDialog" color="white"></v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="addForm" v-model="addFormValid" lazy-validation>
            <!-- Type Selection -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card variant="outlined" class="type-selection-card">
                  <v-card-title>ປະເພດການຊື້ຄືນ</v-card-title>
                  <v-card-text>
                    <v-radio-group v-model="addFormData.repurchaseType" :rules="[v => !!v || 'ກະລຸນາເລືອກປະເພດການຊື້ຄືນ']">
                      <v-radio 
                        label="ລູກຄ້າເກົ່າ (ຊື້ຈາກຮ້ານ)" 
                        value="existing"
                        color="#365a76"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon color="#365a76" class="mr-2">mdi-account-check</v-icon>
                            <span>ລູກຄ້າເກົ່າ (ຊື້ຈາກຮ້ານ)</span>
                          </div>
                        </template>
                      </v-radio>
                      <v-radio 
                        label="ລູກຄ້າໃໝ່ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)" 
                        value="new"
                        color="#365a76"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon color="#365a76" class="mr-2">mdi-account-plus</v-icon>
                            <span>ລູກຄ້າໃໝ່ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)</span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Customer Information -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="h-100">
                  <v-card-title>ຂໍ້ມູນລູກຄ້າ</v-card-title>
                  <v-card-text>
                    <!-- Existing Customer -->
                    <div v-if="addFormData.repurchaseType === 'existing'">
                      <v-autocomplete
                        v-model="addFormData.custId"
                        :items="customers"
                        item-title="name"
                        item-value="id"
                        label="ເລືອກລູກຄ້າ"
                        :rules="addFormData.repurchaseType === 'existing' ? [v => !!v || 'ກະລຸນາເລືອກລູກຄ້າ'] : []"
                        variant="outlined"
                        :loading="loading.customers"
                        clearable
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.phone"></v-list-item>
                        </template>
                      </v-autocomplete>
                    </div>
                    
                    <!-- New Customer -->
                    <div v-else-if="addFormData.repurchaseType === 'new'">
                      <v-text-field
                        v-model="addFormData.newCustomer.name"
                        label="ຊື່ລູກຄ້າ"
                        :rules="addFormData.repurchaseType === 'new' ? [rules.required] : []"
                        variant="outlined"
                        class="mb-3"
                      />
                      <v-text-field
                        v-model="addFormData.newCustomer.phone"
                        label="ເບີໂທ"
                        variant="outlined"
                        class="mb-3"
                      />
                      <v-text-field
                        v-model="addFormData.newCustomer.address"
                        label="ທີ່ຢູ່"
                        variant="outlined"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="h-100">
                  <v-card-title>ຂໍ້ມູນສິນຄ້າ</v-card-title>
                  <v-card-text>
                    <!-- Existing Product Selection -->
                    <div v-if="addFormData.repurchaseType === 'existing'">
                      <v-autocomplete
                        v-model="addFormData.productIds"
                        :items="availableProducts"
                        item-title="name"
                        item-value="id"
                        label="ເລືອກສິນຄ້າທີ່ຊື້ຄືນ"
                        :disabled="!addFormData.custId"
                        :loading="loading.products"
                        multiple
                        chips
                        deletable-chips
                        :rules="addFormData.repurchaseType === 'existing' ? [v => (v && v.length > 0) || 'ກະລຸນາເລືອກສິນຄ້າ'] : []"
                        variant="outlined"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :title="item.raw.name" :subtitle="`ນ້ຳໜັກ: ${item.raw.weight}g`"></v-list-item>
                        </template>
                      </v-autocomplete>
                    </div>
                    
                    <!-- Manual Product Entry -->
                    <div v-else-if="addFormData.repurchaseType === 'new'">
                      <v-text-field
                        v-model="addFormData.newProduct.name"
                        label="ຊື່ສິນຄ້າ"
                        :rules="addFormData.repurchaseType === 'new' ? [rules.required] : []"
                        variant="outlined"
                        class="mb-3"
                      />
                      <v-text-field
                        v-model="addFormData.newProduct.type"
                        label="ປະເພດສິນຄ້າ"
                        variant="outlined"
                        class="mb-3"
                      />
                      <v-text-field
                        v-model.number="addFormData.newProduct.weight"
                        label="ນ້ຳໜັກ (ກຣາມ)"
                        type="number"
                        :rules="addFormData.repurchaseType === 'new' ? [rules.required, rules.positive] : []"
                        variant="outlined"
                        step="0.01"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Price Information -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title>ຂໍ້ມູນລາຄາ</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="addFormData.repurchaseDate"
                          label="ວັນທີຊື້ຄືນ"
                          type="date"
                          :rules="[rules.required]"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(addFormData.repurchasePrice)"
                          @update:model-value="value => addFormData.repurchasePrice = parseInput(value)"
                          label="ລາຄາຊື້ຄືນ (ກີບ)"
                          :rules="[rules.requiredNumber]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(addFormData.damageCost)"
                          @update:model-value="value => addFormData.damageCost = parseInput(value)"
                          label="ຄ່າເສຍຫາຍຮູບປະພັນ (ກີບ)"
                          :rules="[rules.nonNegative]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(addFormData.lostWeightFee)"
                          @update:model-value="value => addFormData.lostWeightFee = parseInput(value)"
                          label="ຄ່ານ້ຳໜັກທອງຫຼຸດ (ກີບ)"
                          :rules="[rules.nonNegative]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatCurrency(addNetPrice)"
                          label="ລາຄາຊື້ຄືນສຸດທິ (ກີບ)"
                          readonly
                          variant="outlined"
                          color="success"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-textarea
                          v-model="addFormData.reReason"
                          label="ເຫດຜົນການຊື້ຄືນ"
                          rows="2"
                          variant="outlined"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="outlined" color="error" @click="closeAddDialog" :disabled="loading.saving">
            <v-icon start>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
          <v-btn color="primary" @click="saveAdd" :loading="loading.saving" :disabled="!addFormValid">
            <v-icon start>mdi-plus</v-icon>
            ບັນທຶກ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="800px" persistent>
      <v-card v-if="editingItem" class="modern-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon color="white" size="32" class="mr-3">mdi-pencil</v-icon>
            <div>
              <h3 class="header-title">ແກ້ໄຂການຊື້ຄືນ #{{ editingItem.Re_ID }}</h3>
              <p class="header-subtitle">ປັບປຸງຂໍ້ມູນລາຄາ</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="closeEditDialog" color="white"></v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="editForm" v-model="editFormValid" lazy-validation>
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card variant="tonal" color="blue-grey-lighten-5">
                  <v-card-title>ຂໍ້ມູນການຊື້ຄືນ (ບໍ່ສາມາດແກ້ໄຂໄດ້)</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          :model-value="getCustomerDisplayName(editingItem)"
                          label="ລູກຄ້າ"
                          readonly
                          variant="solo"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          :model-value="formatDate(editingItem.Re_date)"
                          label="ວັນທີຊື້ຄືນ"
                          readonly
                          variant="solo"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          :model-value="editingItem.Tb_User?.username || 'N/A'"
                          label="ພະນັກງານ"
                          readonly
                          variant="solo"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title>ປັບປຸງຂໍ້ມູນ</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(editFormData.repurchasePrice)"
                          @update:model-value="value => editFormData.repurchasePrice = parseInput(value)"
                          label="ລາຄາຊື້ຄືນ (ກີບ)"
                          :rules="[rules.requiredNumber]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(editFormData.damageCost)"
                          @update:model-value="value => editFormData.damageCost = parseInput(value)"
                          label="ຄ່າເສຍຫາຍຮູບປະພັນ (ກີບ)"
                          :rules="[rules.nonNegative]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatForInput(editFormData.lostWeightFee)"
                          @update:model-value="value => editFormData.lostWeightFee = parseInput(value)"
                          label="ຄ່ານ້ຳໜັກທອງຫຼຸດ (ກີບ)"
                          :rules="[rules.nonNegative]"
                          variant="outlined"
                          type="text"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          :model-value="formatCurrency(editNetPrice)"
                          label="ລາຄາຊື້ຄືນສຸດທິ (ກີບ)"
                          readonly
                          variant="outlined"
                          color="success"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="outlined" color="error" @click="closeEditDialog" :disabled="loading.saving">
            <v-icon start>mdi-close</v-icon>
            ຍົກເລີກ
          </v-btn>
          <v-btn color="primary" @click="saveEdit" :loading="loading.saving" :disabled="!editFormValid">
            <v-icon start>mdi-content-save</v-icon>
            ອັບເດດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="700px">
      <v-card v-if="selectedItem" class="modern-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon color="white" size="32" class="mr-3">mdi-cash-refund</v-icon>
            <div>
              <h3 class="header-title">ການຊື້ຄືນ #{{ selectedItem.Re_ID }}</h3>
              <p class="header-subtitle">{{ formatDate(selectedItem.Re_date) }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false" color="white"></v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-card">
                <h4><v-icon color="#365a76" class="mr-2">mdi-account</v-icon>ລູກຄ້າ</h4>
                <p class="customer-name">{{ getCustomerDisplayName(selectedItem) }}</p>
                <p class="customer-phone">{{ getCustomerPhone(selectedItem) }}</p>
                <p class="customer-address">{{ getCustomerAddress(selectedItem) }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-card">
                <h4><v-icon color="#365a76" class="mr-2">mdi-calculator</v-icon>ລາຄາ</h4>
                <div class="price-breakdown">
                  <div class="price-item">
                    <span>ລາຄາຊື້ຄືນ:</span>
                    <span>{{ formatCurrency(selectedItem.Repurchase_Price) }}</span>
                  </div>
                  <div v-if="selectedItem.Damage_Cost > 0" class="price-item deduction">
                    <span>ຄ່າເສຍຫາຍ:</span>
                    <span>-{{ formatCurrency(selectedItem.Damage_Cost) }}</span>
                  </div>
                  <div v-if="selectedItem.Loose_Gold_Cost > 0" class="price-item deduction">
                    <span>ຄ່າທອງຫຼຸດ:</span>
                    <span>-{{ formatCurrency(selectedItem.Loose_Gold_Cost) }}</span>
                  </div>
                  <div class="price-item total">
                    <span>ສຸດທິ:</span>
                    <v-chip color="success" size="small">{{ formatCurrency(selectedItem.Net_Repurchase_Price) }}</v-chip>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <div class="products-section mt-4">
            <h4><v-icon color="#365a76" class="mr-2">mdi-package-variant</v-icon>ຂໍ້ມູນສິນຄ້າທີ່ຊື້ຄືນ</h4>
            <div v-if="selectedItem.Tb_Product?.length > 0" class="products-list">
              <div v-for="(product, index) in selectedItem.Tb_Product" :key="product.Pd_ID" class="product-item">
                <span class="product-number">{{ index + 1 }}</span>
                <div class="product-info">
                  <div class="product-name">{{ product.Pd_name }}</div>
                  <div class="product-details">{{ product.Type }} • {{ product.Weight }}</div>
                </div>
              </div>
            </div>
            <div v-else class="products-list">
              <div class="external-product-info">
                <v-icon color="#365a76" class="mr-2">mdi-gold</v-icon>
                <span>ສິນຄ້າພາຍນອກ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)</span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="editItem(selectedItem)">ແກ້ໄຂ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :visible="deleteDialog"
      @update:visible="deleteDialog = $event"
      title="ຢືນຢັນການລຶບ"
      message="ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນການຊື້ຄືນນີ້?"
      @confirm="confirmDelete"
    />
  </ModernPageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useApi from '~/composables/useApi';

const api = useApi();

// State Management
const loading = ref({
  list: true,
  saving: false,
  customers: false,
  products: false
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Data
const repurchases = ref([]);
const customers = ref([]);
const availableProducts = ref([]);
const search = ref('');
const startDate = ref('');
const endDate = ref('');
const page = ref(1);
const itemsPerPage = ref(10);

// Dialogs
const addDialog = ref(false);
const editDialog = ref(false);
const detailsDialog = ref(false);
const deleteDialog = ref(false);
const selectedItem = ref(null);
const editingItem = ref(null);

// Form States
const addForm = ref(null);
const editForm = ref(null);
const addFormValid = ref(true);
const editFormValid = ref(true);

// Form Data
const addFormData = ref({
  repurchaseType: '',
  custId: null,
  productIds: [],
  newCustomer: {
    name: '',
    phone: '',
    address: ''
  },
  newProduct: {
    name: '',
    type: '',
    weight: ''
  },
  repurchasePrice: '',
  damageCost: '',
  lostWeightFee: '',
  repurchaseDate: new Date().toISOString().substr(0, 10),
  reReason: ''
});

const editFormData = ref({
  repurchasePrice: null,
  damageCost: 0,
  lostWeightFee: 0
});

// Validation Rules
const rules = {
  required: value => {
    // For text fields and general required fields
    if (!value || value === '' || value === null || value === undefined) {
      return 'ກະລຸນາປ້ອນຂໍ້ມູນ';
    }
    return true;
  },
  requiredNumber: value => {
    // For required number fields like repurchase price
    if (!value || value === '' || value === '0' || value === 0) {
      return 'ກະລຸນາປ້ອນຄ່າທີ່ມາກກວ່າ 0';
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return 'ກະລຸນາປ້ອນຄ່າທີ່ມາກກວ່າ 0';
    }
    return true;
  },
  positive: value => {
    if (!value || value === '') return true; // Allow empty for optional fields
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : parseFloat(value);
    return (!isNaN(numValue) && numValue > 0) || 'ຕ້ອງເປັນຄ່າບວກ';
  },
  nonNegative: value => {
    // For optional fields like damage cost and lost weight fee, empty or 0 or positive is OK
    if (!value || value === '') return true;
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : parseFloat(value);
    if (isNaN(numValue)) return 'ກະລຸນາປ້ອນຕົວເລກ';
    return (numValue >= 0) || 'ຕ້ອງເປັນຄ່າບວກ ຫຼື ສູນ';
  },
  arrayNotEmpty: value => (value && value.length > 0) || 'ກະລຸນາເລືອກຢ່າງໜ້ອຍ 1 ລາຍການ'
};

// Computed Statistics
const thisMonthCount = computed(() => {
  const currentMonth = new Date().getMonth();
  return repurchases.value.filter(item => 
    new Date(item.Re_date).getMonth() === currentMonth
  ).length;
});

const totalValue = computed(() => 
  repurchases.value.reduce((sum, item) => sum + (item.Net_Repurchase_Price || 0), 0)
);

const totalDeductions = computed(() => 
  repurchases.value.reduce((sum, item) => {
    const damage = Number(item.Damage_Cost || 0);
    const loose = Number(item.Loose_Gold_Cost || 0);
    return sum + damage + loose;
  }, 0)
);

// Form Computed
const addNetPrice = computed(() => {
  const initial = parseInput(addFormData.value.repurchasePrice) || 0;
  const damage = parseInput(addFormData.value.damageCost) || 0;
  const lost = parseInput(addFormData.value.lostWeightFee) || 0;
  const net = initial - damage - lost;
  return net >= 0 ? net : 0;
});

const editNetPrice = computed(() => {
  const initial = parseInput(editFormData.value.repurchasePrice) || 0;
  const damage = parseInput(editFormData.value.damageCost) || 0;
  const lost = parseInput(editFormData.value.lostWeightFee) || 0;
  const net = initial - damage - lost;
  return net >= 0 ? net : 0;
});

// Filtered Data
const filteredRepurchases = computed(() => {
  let filtered = repurchases.value;
  
  // Search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.Tb_Customer?.Cust_name.toLowerCase().includes(searchTerm) ||
      item.Tb_User?.username.toLowerCase().includes(searchTerm)
    );
  }
  
  // Date range filter
  if (startDate.value) {
    filtered = filtered.filter(item => new Date(item.Re_date) >= new Date(startDate.value));
  }
  if (endDate.value) {
    filtered = filtered.filter(item => new Date(item.Re_date) <= new Date(endDate.value));
  }
  
  return filtered;
});

const paginatedRepurchases = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRepurchases.value.slice(start, end);
});

// Watch for search/filter changes
watch([search, startDate, endDate], () => {
  page.value = 1;
});

// API Functions
const fetchRepurchases = async () => {
  loading.value.list = true;
  try {
    const response = await api.get('/repurchases');
    repurchases.value = response || [];
  } catch (error) {
    console.error('Error fetching repurchases:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ', 'error');
  } finally {
    loading.value.list = false;
  }
};

// Actions
const showDetails = (item) => {
  selectedItem.value = item;
  detailsDialog.value = true;
};

const openAddDialog = () => {
  resetAddForm();
  addDialog.value = true;
};

const closeAddDialog = () => {
  addDialog.value = false;
  resetAddForm();
};

const editItem = (item) => {
  editingItem.value = item;
  // Pre-populate edit form
  editFormData.value = {
    repurchasePrice: item.Repurchase_Price,
    damageCost: item.Damage_Cost || 0,
    lostWeightFee: item.Loose_Gold_Cost || 0
  };
  
  editDialog.value = true;
  detailsDialog.value = false;
};

const closeEditDialog = () => {
  editDialog.value = false;
  editingItem.value = null;
};

const deleteItem = (item) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await api.del(`/repurchases/${selectedItem.value.Re_ID}`);
    showSnackbar('ລຶບຂໍ້ມູນສຳເລັດ', 'success');
    await fetchRepurchases();
  } catch (_error) {
    console.error('Error deleting repurchase:', _error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການລຶບ', 'error');
  } finally {
    deleteDialog.value = false;
    selectedItem.value = null;
  }
};

// Form Management
const fetchCustomers = async () => {
  loading.value.customers = true;
  try {
    const response = await api.get('/customers');
    customers.value = (response || []).map(customer => ({
      id: customer.Cust_ID,
      name: customer.Cust_name,
      phone: customer.Phone,
      address: customer.Address
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການໂຫລດລູກຄ້າ', 'error');
  } finally {
    loading.value.customers = false;
  }
};

const fetchProductsForCustomer = async (customerId) => {
  loading.value.products = true;
  availableProducts.value = [];
  try {
    const response = await api.get(`/customers/${customerId}/products`);
    availableProducts.value = response || [];
  } catch (error) {
    console.error('Error fetching products for customer:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການໂຫລດສິນຄ້າ', 'error');
  } finally {
    loading.value.products = false;
  }
};

const resetAddForm = () => {
  addFormData.value = {
    repurchaseType: '',
    custId: null,
    productIds: [],
    newCustomer: {
      name: '',
      phone: '',
      address: ''
    },
    newProduct: {
      name: '',
      type: '',
      weight: ''
    },
    repurchasePrice: '',
    damageCost: '',
    lostWeightFee: '',
    repurchaseDate: new Date().toISOString().substr(0, 10),
    reReason: ''
  };
  
  availableProducts.value = [];
  if (addForm.value) {
    addForm.value.resetValidation();
  }
};

const saveAdd = async () => {
  const { valid } = await addForm.value.validate();
  if (!valid) {
    showSnackbar('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ', 'error');
    return;
  }

  loading.value.saving = true;
  try {
    let payload;
    
    if (addFormData.value.repurchaseType === 'existing') {
      // Existing customer from shop
      payload = {
        custId: addFormData.value.custId,
        productIds: addFormData.value.productIds,
        repurchasePrice: addFormData.value.repurchasePrice,
        damageCost: addFormData.value.damageCost,
        lostWeightFee: addFormData.value.lostWeightFee,
        repurchaseDate: addFormData.value.repurchaseDate,
        reReason: addFormData.value.reReason,
        type: 'existingProduct'
      };
    } else {
      // New customer (external gold) - ส่งข้อมูลลูกค้าใหม่ไปให้ repurchase API จัดการ
      // ไม่ต้องสร้างลูกค้าแยกเพื่อป้องกันการซ้ำซ้อน
      payload = {
        newCustomer: {
          name: addFormData.value.newCustomer.name,
          phone: addFormData.value.newCustomer.phone,
          address: addFormData.value.newCustomer.address
        },
        newProduct: {
          name: addFormData.value.newProduct.name,
          type: addFormData.value.newProduct.type,
          weight: addFormData.value.newProduct.weight
        },
        repurchasePrice: addFormData.value.repurchasePrice,
        damageCost: addFormData.value.damageCost,
        lostWeightFee: addFormData.value.lostWeightFee,
        repurchaseDate: addFormData.value.repurchaseDate,
        reReason: addFormData.value.reReason,
        type: 'newGold',
        // Add customer name explicitly for display
        externalCustomerName: addFormData.value.newCustomer.name,
        externalCustomerPhone: addFormData.value.newCustomer.phone
      };
    }

    await api.post('/repurchases', payload);
    
    showSnackbar('ບັນທຶກຂໍ້ມູນສຳເລັດ', 'success');
    closeAddDialog();
    fetchRepurchases();
  } catch (error) {
    console.error('Error saving repurchase:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ', 'error');
  } finally {
    loading.value.saving = false;
  }
};

const saveEdit = async () => {
  const { valid } = await editForm.value.validate();
  if (!valid) {
    showSnackbar('ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ຖືກຕ້ອງ', 'error');
    return;
  }

  loading.value.saving = true;
  try {
    const payload = {
      custId: editingItem.value.Tb_Customer?.Cust_ID,
      productIds: editingItem.value.Tb_Product?.map(p => p.Pd_ID) || [],
      repurchasePrice: editFormData.value.repurchasePrice,
      damageCost: editFormData.value.damageCost,
      looseGoldCost: editFormData.value.lostWeightFee,
      repurchaseDate: editingItem.value.Re_date,
      reReason: editingItem.value.Re_reason || ''
    };

    await api.put(`/repurchases/${editingItem.value.Re_ID}`, payload);
    showSnackbar('ອັບເດດຂໍ້ມູນສຳເລັດ', 'success');
    closeEditDialog();
    fetchRepurchases();
  } catch (error) {
    console.error('Error updating repurchase:', error);
    showSnackbar('ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ', 'error');
  } finally {
    loading.value.saving = false;
  }
};

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('lo-LA');
};

const formatCurrency = (value) => {
  if (value == null || value === '') return '0 ກີບ';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0 ກີບ';
  return new Intl.NumberFormat('en-US').format(numValue) + ' ກີບ';
};

const formatNumber = (value) => {
  if (value == null || value === '') return '0';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  return new Intl.NumberFormat('en-US').format(numValue);
};

const showSnackbar = (message, color) => {
  snackbar.value = { show: true, message, color };
};

const getCustomerDisplayName = (item) => {
  // If it's from existing customer (has Tb_Customer data)
  if (item.Tb_Customer?.Cust_name) {
    return item.Tb_Customer.Cust_name;
  }
  
  // Check for external customer name (field we're sending)
  if (item.externalCustomerName) {
    return item.externalCustomerName;
  }
  
  // Check for external customer data stored in the repurchase record
  if (item.External_Customer_Name) {
    return item.External_Customer_Name;
  }
  
  // Check if there's any custom customer data stored
  if (item.Customer_Name) {
    return item.Customer_Name;
  }
  
  // Try to get name from embedded customer data
  if (item.newCustomer?.name) {
    return item.newCustomer.name;
  }
  
  // Check various possible field names that backend might use
  if (item.external_customer_name) {
    return item.external_customer_name;
  }
  
  if (item.ExtCustomerName) {
    return item.ExtCustomerName;
  }
  
  // Fallback for new/external customers - more descriptive
  return 'ລູກຄ້າພາຍນອກ (ບໍ່ໄດ້ຊື້ຈາກຮ້ານ)';
};

const getCustomerPhone = (item) => {
  // If it's from existing customer (has Tb_Customer data)
  if (item.Tb_Customer?.Phone) {
    return item.Tb_Customer.Phone;
  }
  
  // Check for external customer phone (field we're sending)
  if (item.externalCustomerPhone) {
    return item.externalCustomerPhone;
  }
  
  // If it's from new customer (external), check for stored phone
  if (item.External_Customer_Phone) {
    return item.External_Customer_Phone;
  }
  
  // Check if there's any custom phone data stored
  if (item.Customer_Phone) {
    return item.Customer_Phone;
  }
  
  // Try to get phone from embedded customer data
  if (item.newCustomer?.phone) {
    return item.newCustomer.phone;
  }
  
  // Check various possible field names that backend might use
  if (item.external_customer_phone) {
    return item.external_customer_phone;
  }
  
  // Fallback
  return 'ບໍ່ລະບຸ';
};

const getCustomerAddress = (item) => {
  // If it's from existing customer (has Tb_Customer data)
  if (item.Tb_Customer?.Address) {
    return item.Tb_Customer.Address;
  }
  
  // Check for external customer address (field we're sending)
  if (item.externalCustomerAddress) {
    return item.externalCustomerAddress;
  }
  
  // If it's from new customer (external), check for stored address
  if (item.External_Customer_Address) {
    return item.External_Customer_Address;
  }
  
  // Check if there's any custom address data stored
  if (item.Customer_Address) {
    return item.Customer_Address;
  }
  
  // Try to get address from embedded customer data
  if (item.newCustomer?.address) {
    return item.newCustomer.address;
  }
  
  // Check various possible field names that backend might use
  if (item.external_customer_address) {
    return item.external_customer_address;
  }
  
  // Fallback
  return 'ບໍ່ລະບຸ';
};

// Watchers
watch(() => addFormData.value.custId, (newCustId) => {
  if (newCustId) {
    addFormData.value.productIds = [];
    fetchProductsForCustomer(newCustId);
  } else {
    availableProducts.value = [];
    addFormData.value.productIds = [];
  }
});

// Watch for repurchase type changes
watch(() => addFormData.value.repurchaseType, (newType) => {
  if (newType === 'existing' && customers.value.length === 0) {
    fetchCustomers();
  }
  // Reset form data when switching types
  if (newType) {
    addFormData.value.custId = null;
    addFormData.value.productIds = [];
    addFormData.value.newCustomer = { name: '', phone: '', address: '' };
    addFormData.value.newProduct = { name: '', type: '', weight: '' };
    availableProducts.value = [];
  }
});

onMounted(() => {
  fetchRepurchases();
  fetchCustomers(); // Load customers initially
});

// Helper functions for number formatting (similar to goldprice.vue)
const formatForInput = (value) => {
  if (value === null || value === undefined || value === '' || value === 0) return '';
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(numValue) || numValue === 0) return '';
  return new Intl.NumberFormat('en-US').format(numValue);
};

const parseInput = (value) => {
  if (!value || value === '') return '';
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? '' : parsed;
};

// Get color for net price chip based on deductions
const getNetPriceColor = (item) => {
  const totalDeductions = (Number(item.Damage_Cost || 0) + Number(item.Loose_Gold_Cost || 0));
  
  if (totalDeductions === 0) {
    // No deductions - green (good)
    return 'success';
  } else if (totalDeductions <= 500000) {
    // Small deductions - yellow/orange (warning)
    return 'warning';
  } else {
    // Large deductions - red (attention needed)
    return 'error';
  }
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
  word-break: break-all;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
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

.header-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.dialog-content {
  padding: 24px !important;
}

.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
}

.info-card h4 {
  margin: 0 0 16px 0;
  color: #365a76;
  display: flex;
  align-items: center;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.customer-phone {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 4px 0;
}

.customer-address {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.price-breakdown {
  margin-top: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.price-item:last-child {
  border-bottom: none;
}

.price-item.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #e0e0e0;
  font-weight: 600;
}

.price-item.deduction {
  color: #f57c00;
}

.products-section h4 {
  margin: 0 0 16px 0;
  color: #365a76;
  display: flex;
  align-items: center;
}

.products-list {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-number {
  background: #365a76;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  margin-right: 16px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-details {
  font-size: 0.85rem;
  color: #666;
}

.dialog-actions {
  background: #f8f9fa;
  padding: 20px 24px !important;
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(54, 90, 118, 0.08);
  border: 1px solid rgba(54, 90, 118, 0.1);
}

.h-100 {
  height: 100%;
}

.v-card {
  border-radius: 12px !important;
}

.v-card-title {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.1) 0%, rgba(54, 90, 118, 0.05) 100%);
  color: #365a76 !important;
  font-weight: 600 !important;
}

/* Type Selection Card */
.type-selection-card {
  border: 2px solid rgba(54, 90, 118, 0.2) !important;
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.02) 0%, rgba(54, 90, 118, 0.05) 100%) !important;
}

.type-selection-card .v-card-title {
  color: #365a76 !important;
  font-weight: 700 !important;
  padding: 16px 20px 8px !important;
}

.type-selection-card .v-radio-group {
  margin-top: 8px;
}

.type-selection-card :deep(.v-selection-control) {
  margin-bottom: 16px;
}

.type-selection-card :deep(.v-label) {
  font-weight: 500;
  color: #2d3748;
}

/* External Product Info */
.external-product-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #365a76;
  font-weight: 500;
  font-style: italic;
}

/* Dark Mode Support */
.v-theme--dark .stat-card,
.v-theme--dark .table-container,
.v-theme--dark .form-container {
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

.v-theme--dark .info-card {
  background: #2a2a2a !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .customer-name,
.v-theme--dark .customer-phone,
.v-theme--dark .customer-address,
.v-theme--dark .product-name,
.v-theme--dark .product-details,
.v-theme--dark .notes-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .products-list {
  background: #2a2a2a !important;
}

.v-theme--dark .type-selection-card {
  background: #2a2a2a !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.v-theme--dark .type-selection-card .v-card-title {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .type-selection-card :deep(.v-label) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .external-product-info {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .dialog-actions {
  background: #2a2a2a !important;
}

.v-theme--dark .dialog-content {
  background: #1e1e1e !important;
}

.v-theme--dark .modern-dialog {
  background: #1e1e1e !important;
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

/* Price Display */
.price-original {
  font-weight: 600;
  color: #365a76;
  font-size: 0.95rem;
}

.net-price-chip {
  font-weight: 700 !important;
  min-width: 120px;
  justify-content: center;
}

.v-theme--dark .price-original {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Enhanced table for price comparison */
.modern-table :deep(tbody td) {
  vertical-align: middle;
}

.modern-table :deep(.price-comparison) {
  background: linear-gradient(135deg, rgba(54, 90, 118, 0.02) 0%, rgba(54, 90, 118, 0.05) 100%);
}

/* Price Tooltip */
.price-tooltip {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  min-width: 200px;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 0.9rem;
}

.tooltip-item span:first-child {
  color: #666;
  font-weight: 500;
}

.tooltip-item span:last-child {
  font-weight: 600;
  color: #333;
}

.tooltip-item.deduction span:last-child {
  color: #f56565;
}

.tooltip-item.total {
  font-weight: 700;
  font-size: 1rem;
  margin-top: 4px;
}

.tooltip-item.total span {
  color: #365a76 !important;
}

.tooltip-divider {
  border: none;
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

/* Dark mode tooltip */
.v-theme--dark .price-tooltip {
  background: #2a2a2a !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.v-theme--dark .tooltip-item span:first-child {
  color: #aaa !important;
}

.v-theme--dark .tooltip-item span:last-child {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .tooltip-item.total span {
  color: #64b5f6 !important;
}

.v-theme--dark .tooltip-divider {
  background: rgba(255, 255, 255, 0.2) !important;
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
  
  /* Stack price columns on mobile */
  .modern-table :deep(th:nth-child(5)),
  .modern-table :deep(th:nth-child(6)),
  .modern-table :deep(td:nth-child(5)),
  .modern-table :deep(td:nth-child(6)) {
    font-size: 0.85rem;
  }
  
  .net-price-chip {
    min-width: 100px;
    font-size: 0.8rem;
  }
}
</style> 