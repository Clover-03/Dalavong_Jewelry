<template>
  <div class="modern-purchase-order">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="company-brand">
          <div class="logo-container">
            <v-icon size="40" color="#FFD700">mdi-diamond-stone</v-icon>
          </div>
          <div class="company-info">
            <h1 class="company-name">ຮ້ານຄຳ ດາລາວົງ</h1>
            <p class="company-tagline">Dalavong Jewelry</p>
            <div class="contact-details">
              <p><v-icon size="12" class="mr-1">mdi-map-marker</v-icon> ບ້ານ ໂພນຕ້ອງ, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ</p>
              <p><v-icon size="12" class="mr-1">mdi-phone</v-icon> ໂທ: 020 1234 5678</p>
              <p><v-icon size="12" class="mr-1">mdi-email</v-icon> dalavong.jewelry@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div class="document-header">
          <h2 class="document-title">ໃບສັ່ງຊື້</h2>
          <p class="document-subtitle">PURCHASE ORDER</p>
          <div class="order-badge">
            <v-chip color="white" text-color="primary" size="large" prepend-icon="mdi-receipt">
              # {{ order.Order_ID }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- Information Section -->
    <div class="info-section">
      <v-row class="ma-0">
        <v-col cols="12" md="4" class="pa-2">
          <div class="info-compact">
            <div class="info-header">
              <v-icon size="16" color="primary">mdi-account-tie</v-icon>
              <span class="info-title">ຜູ້ສະໜອງ</span>
            </div>
            <div class="info-content">
              <div class="font-weight-bold">{{ order.Tb_Supplier?.Sup_name || 'ບໍ່ລະບຸ' }}</div>
              <div class="text-caption">ໂທ: {{ order.Tb_Supplier?.Phone || 'ບໍ່ລະບຸ' }}</div>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" md="4" class="pa-2">
          <div class="info-compact">
            <div class="info-header">
              <v-icon size="16" color="primary">mdi-calendar</v-icon>
              <span class="info-title">ວັນທີສັ່ງ</span>
            </div>
            <div class="info-content">
              <div class="font-weight-bold">{{ formatDate(order.Order_Date) }}</div>
              <v-chip :color="getStatusColor(order.status)" size="x-small" class="mt-1">
                {{ order.status }}
              </v-chip>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" md="4" class="pa-2">
          <div class="info-compact">
            <div class="info-header">
              <v-icon size="16" color="primary">mdi-package-variant</v-icon>
              <span class="info-title">ຈຳນວນ</span>
            </div>
            <div class="info-content">
              <div class="font-weight-bold">{{ order.products?.length || 0 }} ລາຍການ</div>
              <div class="text-caption">ອໍເດີ #{{ order.Order_ID }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Products Table -->
    <div class="table-section">
      <v-card class="table-card" rounded="lg">
        <v-card-title class="table-header">
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
          ລາຍການສິນຄ້າທີ່ສັ່ງຊື້
        </v-card-title>
        
        <div class="table-wrapper">
          <v-table class="premium-table">
            <thead>
              <tr class="table-head">
                <th class="text-center">ລຳດັບ</th>
                <th class="text-left">ຊື່ສິນຄ້າ</th>
                <th class="text-center">ນ້ຳໜັກ</th>
                <th class="text-center">ຈຳນວນ</th>
                <th class="text-right">ລາຄາຕໍ່ໜ່ວຍ (ກີບ)</th>
                <th class="text-right">ລວມ (ກີບ)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.products" :key="item.Pd_ID || item.id" class="table-body-row">
                <td class="text-center">
                  <v-chip size="small" color="primary" variant="tonal">{{ index + 1 }}</v-chip>
                </td>
                <td class="text-left">
                  <div class="product-detail">
                    <div class="product-name">{{ item.Pd_name || item.name || 'ບໍ່ລະບຸຊື່ສິນຄ້າ' }}</div>
                    <div class="product-id">ID: {{ item.Pd_ID || item.id || 'N/A' }}</div>
                  </div>
                </td>
                <td class="text-center">
                  <v-chip size="small" color="amber" variant="outlined">
                    {{ formatWeight(item.weight || 0) }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-chip size="small" color="success" variant="tonal">{{ item.quantity || 1 }}</v-chip>
                </td>
                <td class="text-right price-cell">
                  {{ formatCurrency(item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0) }}
                </td>
                <td class="text-right total-cell">
                  {{ formatCurrency(getItemTotal(item)) }}
                </td>
              </tr>
              
              <tr v-if="!order.products || order.products.length === 0">
                <td colspan="6" class="text-center pa-4 text-grey">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  ບໍ່ມີສິນຄ້າໃນການສັ່ງຊື້ນີ້
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <!-- Summary Section -->
        <div class="summary-container">
          <div class="summary-grid">
            <div class="summary-row">
              <span class="summary-label">ລວມຍ່ອຍ:</span>
              <span class="summary-value">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">ສ່ວນຫຼຸດທັງໝົດ:</span>
              <span class="summary-value discount-value">{{ formatCurrency(totalDiscount) }}</span>
            </div>
            <div class="summary-row grand-total-row">
              <span class="summary-label">ລວມທັງໝົດສຸດທິ:</span>
              <span class="summary-value grand-total-value">{{ formatCurrency(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Signature Section -->
    <div class="signature-area">
      <v-row class="ma-0">
        <v-col cols="12" md="6" class="pa-2">
          <v-card class="signature-card" variant="outlined" rounded="lg">
            <v-card-text class="text-center signature-content">
              <h4 class="signature-title">ຜູ້ສັ່ງຊື້</h4>
              <p class="signature-subtitle">ຜູ້ມີອຳນາດລົງນາມ</p>
              <div class="signature-line"></div>
              <p class="signature-date">ວັນທີ: {{ getCurrentDate() }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="pa-2">
          <v-card class="signature-card" variant="outlined" rounded="lg">
            <v-card-text class="text-center signature-content">
              <h4 class="signature-title">ຜູ້ຮັບຄຳສັ່ງ</h4>
              <p class="signature-subtitle">ຜູ້ສະໜອງສິນຄ້າ</p>
              <div class="signature-line"></div>
              <p class="signature-date">ວັນທີ: ________________</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Footer -->
    <div class="document-footer">
      <div class="footer-content">
        <p class="footer-note">
          <v-icon size="14" class="mr-1">mdi-information</v-icon>
          ໃບສັ່ງຊື້ນີ້ມີຜົນບັງຄັບໃຊ້ເມື່ອໄດ້ຮັບການອະນຸມັດຈາກທັງສອງຝ່າຍແລ້ວ
        </p>
        <p class="footer-legal">ໃບສັ່ງຊື້ນີ້ຖືກສ້າງໂດຍລະບົບຄອມພິວເຕີ</p>
        <p class="print-date">ສ້າງເມື່ອ: {{ new Date().toLocaleString('lo-LA') }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-bar">
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        @click="handlePrint"
        prepend-icon="mdi-printer"
        class="mr-3"
      >
        ພິມໃບສັ່ງຊື້
      </v-btn>
      <v-btn
        color="grey-darken-1"
        size="large"
        variant="outlined"
        @click="_emit('close')"
        prepend-icon="mdi-close"
      >
        ປິດ
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatWeight } from '~/utils/format.js';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const _emit = defineEmits(['close']);

const subtotal = computed(() => {
  if (!props.order?.products) return 0;
  return props.order.products.reduce((sum, item) => {
    const buyPrice = item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0;
    return sum + ((item.quantity || 1) * buyPrice);
  }, 0);
});

const totalDiscount = computed(() => {
  if (!props.order?.products) return 0;
  return props.order.products.reduce((sum, item) => sum + (item.discount || 0), 0);
});

const grandTotal = computed(() => subtotal.value - totalDiscount.value);

const formatCurrency = (value) => {
  if (value == null) return '0';
  return new Intl.NumberFormat('lo-LA').format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'ບໍ່ລະບຸ';
  return new Date(dateString).toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusColor = (status) => {
  const colors = { 'Pending': 'orange', 'Completed': 'green', 'Cancelled': 'red' };
  return colors[status] || 'grey';
};

const getItemTotal = (item) => {
  const buyPrice = item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0;
  const quantity = item.quantity || 1;
  const discount = item.discount || 0;
  return (quantity * buyPrice) - discount;
};

const handlePrint = () => {
  window.print();
};
</script>

<style scoped>
.modern-purchase-order {
  font-family: 'Noto Sans Lao', sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.company-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.company-tagline {
  font-size: 16px;
  opacity: 0.9;
  font-style: italic;
  margin-bottom: 12px;
}

.contact-details p {
  font-size: 13px;
  margin: 2px 0;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.document-title {
  font-size: 24px;
  font-weight: 700;
  text-align: right;
  margin-bottom: 6px;
}

.document-subtitle {
  font-size: 16px;
  opacity: 0.8;
  text-align: right;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.order-badge {
  text-align: right;
  margin-top: 8px;
}

.info-section {
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.info-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  min-height: 60px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 90px;
}

.info-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e3a8a;
}

.info-content {
  flex: 1;
  font-size: 14px;
}

.info-content .font-weight-bold {
  color: #1e293b;
  font-weight: 600;
}

.table-section {
  padding: 0 24px 24px;
}

.table-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  color: white;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.table-wrapper {
  overflow-x: auto;
}

.premium-table {
  width: 100%;
  background: white;
}

.table-head th {
  background: #f8fafc;
  padding: 16px 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e2e8f0;
  font-size: 14px;
}

.table-body-row td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 14px;
}

.table-body-row:nth-child(even) {
  background: #fafbfc;
}

.table-body-row:hover {
  background: #f0f9ff;
}

.product-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
}

.product-id {
  font-size: 12px;
  color: #64748b;
}

.price-cell {
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', monospace;
  color: #374151;
  font-size: 13px;
}

.total-cell {
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', monospace;
  color: #059669;
  font-size: 14px;
}

.summary-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 24px;
  border-top: 3px solid #3b82f6;
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin-left: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-label {
  font-weight: 500;
  color: #64748b;
  font-size: 14px;
}

.summary-value {
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', monospace;
  color: #1e293b;
  font-size: 14px;
}

.discount-value {
  color: #dc2626;
}

.grand-total-row {
  border-top: 2px solid #d1d5db;
  padding-top: 12px;
  margin-top: 10px;
  background: #f0f9ff;
  margin: 12px -20px -20px -20px;
  padding: 20px;
  border-radius: 0 0 8px 8px;
}

.grand-total-row .summary-label {
  font-size: 16px;
  font-weight: 700;
  color: #1e3a8a;
}

.grand-total-value {
  font-size: 18px;
  font-weight: 700;
  color: #059669;
}

.signature-area {
  padding: 24px;
  background: #fafbfc;
}

.signature-card {
  background: white;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
  padding: 24px 16px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.signature-card:hover {
  border-color: #3b82f6;
}

.signature-content {
  text-align: center;
}

.signature-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 8px;
}

.signature-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  font-style: italic;
}

.signature-line {
  border-bottom: 2px solid #374151;
  margin: 20px auto;
  width: 180px;
}

.signature-date {
  font-size: 14px;
  color: #64748b;
  margin-top: 12px;
  font-weight: 500;
}

.document-footer {
  background: #1e293b;
  color: #94a3b8;
  padding: 20px 24px;
  text-align: center;
}

.footer-note {
  margin-bottom: 8px;
  font-weight: 500;
  color: #cbd5e1;
  font-size: 13px;
}

.footer-legal {
  margin-bottom: 8px;
  font-style: italic;
  font-size: 12px;
}

.print-date {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 12px;
}

.action-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  z-index: 10;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .action-bar {
    display: none !important;
  }
  
  .modern-purchase-order {
    box-shadow: none !important;
    border-radius: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    background: white !important;
  }
  
  .header-section {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
    color: white !important;
    page-break-inside: avoid;
  }
  
  .table-header {
    background: linear-gradient(90deg, #1e3a8a, #3b82f6) !important;
    color: white !important;
  }
  
  .summary-container {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    page-break-inside: avoid;
  }
  
  .document-footer {
    background: #1e293b !important;
    color: #94a3b8 !important;
    page-break-inside: avoid;
  }
  
  .v-chip {
    border: 1px solid #ccc !important;
    background: white !important;
    color: black !important;
    display: inline-block !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
  }
}

@media (max-width: 768px) {
  .modern-purchase-order {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .company-brand {
    flex-direction: column;
    text-align: center;
  }
  
  .document-title,
  .document-subtitle {
    text-align: center;
  }
  
  .info-section {
    padding: 12px;
  }
  
  .table-section {
    padding: 0 12px 12px;
  }
  
  .signature-area {
    padding: 12px;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 