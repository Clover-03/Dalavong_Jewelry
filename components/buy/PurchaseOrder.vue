<template>
  <div class="purchase-order-container">
    <div class="a4-purchase-order">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="company-brand">
          <div class="logo-container">
              <v-icon size="50" color="#FFD700">mdi-diamond-stone</v-icon>
              <span class="diamond-fallback">♦</span>
          </div>
          <div class="company-info">
            <h1 class="company-name">ຮ້ານຄຳ ດາລາວົງ</h1>
            <p class="company-tagline">Dalavong Jewelry</p>
            <div class="contact-details">
                <p>ຕະຫຼາດອຸດສາຫະກຳ ແຂວງຫຼວງນ້ຳທາ</p>
                <p>ໂທ: 020 58038333</p>
                <p>ເວລາເປີດ: ຈັນ-ເສົາ 8:00-18:00, ອາທິດ 9:00-17:00</p>
                <p>dalavong.jewelry@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div class="document-header">
          <h2 class="document-title">ໃບສັ່ງຊື້</h2>
          <p class="document-subtitle">PURCHASE ORDER</p>
            <div class="order-number">
              <span class="order-label">ເລກທີ:</span>
              <span class="order-id"># {{ order.Order_ID }}</span>
          </div>
        </div>
      </div>
    </div>

      <!-- Order and Supplier Information -->
    <div class="info-section">
        <div class="info-row">
          <div class="info-group">
            <span class="info-label">ຜູ້ສະໜອງ:</span>
            <span class="info-value">{{ order.Tb_Supplier?.Sup_name || 'ບໍ່ລະບຸ' }}</span>
            </div>
          <div class="info-group">
            <span class="info-label">ວັນທີສັ່ງ:</span>
            <span class="info-value">{{ formatDate(order.Order_Date) }}</span>
            </div>
          <div class="info-group">
            <span class="info-label">ສະຖານະ:</span>
            <span class="status-value">{{ order.status }}</span>
          </div>
            </div>
        <div class="info-row">
          <div class="info-group">
            <span class="info-label">ໂທລະສັບ:</span>
            <span class="info-value">{{ order.Tb_Supplier?.Phone || 'ບໍ່ລະບຸ' }}</span>
            </div>
          <div class="info-group">
            <span class="info-label">ທີ່ຢູ່:</span>
            <span class="info-value">{{ order.Tb_Supplier?.Address || 'ບໍ່ລະບຸ' }}</span>
          </div>
          <div class="info-group">
            <span class="info-label">ຈຳນວນລາຍການ:</span>
            <span class="info-value">{{ order.products?.length || 0 }} ລາຍການ</span>
            </div>
            </div>
    </div>

      <!-- Product Details Table -->
    <div class="table-section">
        <h3 class="section-title">ລາຍການສິນຄ້າທີ່ສັ່ງຊື້</h3>
        
        <table class="product-table">
            <thead>
            <tr>
                <th class="text-center">ລຳດັບ</th>
                <th class="text-left">ຊື່ສິນຄ້າ</th>
                <th class="text-center">ນ້ຳໜັກ</th>
                <th class="text-center">ຈຳນວນ</th>
              <th class="text-right">ລາຄາຊື້ (ກີບ)</th>
                <th class="text-right">ສ່ວນຫຼຸດ (ກີບ)</th>
                <th class="text-right">ລວມ (ກີບ)</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in order.products" :key="item.Pd_ID || item.id">
              <td class="text-center">{{ index + 1 }}</td>
                <td class="text-left">
                  <div class="product-detail">
                    <div class="product-name">{{ item.Pd_name || item.name || 'ບໍ່ລະບຸຊື່ສິນຄ້າ' }}</div>
                    <div class="product-id">ID: {{ item.Pd_ID || item.id || 'N/A' }}</div>
                  </div>
                </td>
              <td class="text-center">{{ formatWeight(item.weight || 0) }}</td>
              <td class="text-center">{{ item.quantity || 1 }}</td>
              <td class="text-right">{{ formatCurrency(item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0) }}</td>
              <td class="text-right">{{ formatCurrency(item.discount || 0) }}</td>
              <td class="text-right total-amount">{{ formatCurrency(getItemTotal(item)) }}</td>
              </tr>
              <tr v-if="!order.products || order.products.length === 0">
                <td colspan="7" class="text-center pa-4 text-grey">
                  ບໍ່ມີສິນຄ້າໃນການສັ່ງຊື້ນີ້
                </td>
              </tr>
            </tbody>
        </table>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">ລາຄາສິນຄ້າ:</span>
            <span class="summary-value">{{ formatCurrency(subtotal) }}</span>
            </div>
          <div class="summary-row" v-if="totalDiscount > 0">
            <span class="summary-label">ສ່ວນຫຼຸດ:</span>
            <span class="summary-value discount-text">-{{ formatCurrency(totalDiscount) }}</span>
          </div>
          <div class="summary-row total-row">
            <span class="summary-label">ລວມສຸດທິ:</span>
            <span class="summary-value total-value">{{ formatCurrency(grandTotal) }}</span>
        </div>
    </div>
    </div>

      <!-- Order Terms -->
    <div class="terms-section">
        <h3 class="section-title">ເງື່ອນໄຂການສັ່ງຊື້</h3>
        <div class="terms-content">
            <div class="term-item">
            <strong>1. ການຊຳລະເງິນ:</strong> ຊຳລະຄົບຖ້ວນກ່ອນການຮັບສິນຄ້າ ຫຼື ຕາມທີ່ຕົກລົງກັນ
            </div>
            <div class="term-item">
            <strong>2. ການສົ່ງສິນຄ້າ:</strong> ສິນຄ້າຈະຖືກສົ່ງຕາມເວລາທີ່ກຳນົດ ຫຼື ມາຮັບເອງທີ່ຮ້ານ
            </div>
            <div class="term-item">
            <strong>3. ການຮັບປະກັນ:</strong> ການຮັບປະກັນຄຸນນະພາບສິນຄ້າຕາມມາດຕະຖານຂອງຮ້ານ
            </div>
            <div class="term-item">
            <strong>4. ການປ່ຽນແປງ:</strong> ການແກ້ໄຂໃບສັ່ງຊື້ຕ້ອງແຈ້ງລ່ວງໜ້າກ່ອນການຜະລິດ
            </div>
          </div>
    </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-row">
          <div class="signature-group">
            <div class="signature-title">ຜູ້ສັ່ງຊື້</div>
            <div class="signature-subtitle">ຮ້ານຄຳ ດາລາວົງ</div>
            <div class="signature-line"></div>
            <div class="signature-date">ວັນທີ: {{ getCurrentDate() }}</div>
              </div>
          <div class="signature-group">
            <div class="signature-title">ຜູ້ຮັບຄຳສັ່ງ</div>
            <div class="signature-subtitle">{{ order.Tb_Supplier?.Sup_name || 'ຜູ້ສະໜອງ' }}</div>
            <div class="signature-line"></div>
            <div class="signature-date">ວັນທີ: ________________</div>
              </div>
        </div>
    </div>

    <!-- Footer -->
      <div class="document-footer no-print">
      <div class="footer-content">
        <p class="footer-note">
            ໃບສັ່ງຊື້ນີ້ເປັນເອກະສານທາງການ ກະລຸນາເກັບໄວ້ເປັນຫຼັກຖານ
        </p>
          <p class="footer-legal">ໃບສັ່ງຊື້ຖືກສ້າງໂດຍລະບົບຄອມພິວເຕີ | ເລກທີ: {{ order.Order_ID }} | ວັນທີ: {{ formatDate(order.Order_Date) }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
      <div class="action-bar no-print">
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
          @click="$emit('close')"
        prepend-icon="mdi-close"
      >
        ປິດ
      </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatWeight } from '~/utils/format.js';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const formatCurrency = (value) => {
  if (value == null) return '0';
  return new Intl.NumberFormat('lo-LA').format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

const getStatusColor = (status) => {
  const map = { 'Completed': 'green', 'Pending': 'orange', 'Cancelled': 'red' };
  return map[status] || 'grey';
};

const getItemTotal = (item) => {
  const itemPrice = item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0;
  const lineTotal = (itemPrice * (item.quantity || 1)) - (item.discount || 0);
  return Math.max(0, lineTotal);
};

const handlePrint = () => {
  // Hide all non-print elements and create print-only window
  const printContent = document.querySelector('.a4-purchase-order').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Purchase Order - ${props.order.Order_ID || 'N/A'}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Noto Sans Lao', sans-serif;
          background: white !important;
          color: black !important;
          padding: 8mm;
          line-height: 1.3;
          font-size: 12px;
        }
        .no-print, .action-bar, .document-footer { display: none !important; }
        .header-section { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #000; }
        .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
        .company-brand { display: flex; align-items: center; gap: 15px; }
        .logo-container { display: flex; align-items: center; justify-content: center; position: relative; }
        .logo-container::before { content: "♦"; font-size: 50px; color: #FFD700; font-weight: bold; }
        .company-name { font-size: 20px; font-weight: bold; margin: 0 0 3px 0; }
        .company-tagline { font-size: 14px; margin: 0 0 8px 0; color: #666; }
        .contact-details p { margin: 1px 0; font-size: 12px; }
        .document-header { text-align: right; }
        .document-title { font-size: 18px; font-weight: bold; margin: 0 0 3px 0; }
        .document-subtitle { font-size: 14px; margin: 0 0 8px 0; color: #666; }
        .order-number { font-size: 16px; }
        .order-label { color: #666; }
        .order-id { font-weight: bold; color: black; }
        .section-title { font-size: 14px; font-weight: bold; margin: 8px 0 5px 0; border-bottom: 1px solid #000; padding-bottom: 2px; }
        .product-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .product-table th, .product-table td { border: 1px solid #000; padding: 3px; font-size: 10px; }
        .product-table th { background-color: #f0f0f0; font-weight: bold; }
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .summary-section { max-width: 250px; margin-left: auto; border-top: 2px solid #000; padding-top: 5px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
        .total-row { border-top: 1px solid #000; margin-top: 5px; padding-top: 5px; }
        .total-value { font-size: 14px; font-weight: bold; color: #059669; }
        .info-section, .terms-section, .signature-section { margin: 8px 0; }
        .info-row { display: flex; justify-content: space-between; gap: 15px; }
        .info-group { display: flex; gap: 5px; align-items: center; font-size: 11px; }
        .signature-row { display: flex; justify-content: space-between; gap: 30px; margin: 15px 0; }
        .signature-group { flex: 1; text-align: center; }
        .signature-title { font-weight: bold; margin-bottom: 3px; font-size: 12px; }
        .signature-subtitle { font-size: 11px; margin-bottom: 20px; color: #666; }
        .signature-line { height: 1px; border-bottom: 1px solid #000; margin-bottom: 3px; }
        .signature-date { font-size: 10px; color: #666; }
        .terms-content { display: grid; gap: 3px; }
        .term-item { font-size: 10px; line-height: 1.4; padding: 1px 0; }
        .status-value, .total-amount { color: #059669 !important; }
        .discount-text { color: #dc2626 !important; }
      </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Computed properties for calculations
const subtotal = computed(() => {
  if (!props.order.products || !Array.isArray(props.order.products)) return 0;
  return props.order.products.reduce((sum, item) => {
    const itemPrice = item.buyPrice || ((item.goldValue || 0) + (item.craftsmanshipFee || 0)) || 0;
    return sum + (itemPrice * (item.quantity || 1));
  }, 0);
});

const totalDiscount = computed(() => {
  if (!props.order.products || !Array.isArray(props.order.products)) return 0;
  return props.order.products.reduce((sum, item) => sum + (item.discount || 0), 0);
});

const grandTotal = computed(() => {
  return subtotal.value - totalDiscount.value;
});
</script>

<style scoped>
.purchase-order-container {
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.a4-purchase-order {
  font-family: 'Noto Sans Lao', sans-serif;
  width: 190mm;
  max-width: 190mm;
  margin: 0 auto;
  background: white !important;
  color: black !important;
  padding: 10mm;
  box-sizing: border-box;
  line-height: 1.3;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-height: 277mm;
}

/* Header Section */
.header-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 60px;
  height: 60px;
}

.logo-container .v-icon {
  display: none !important;
}

.diamond-fallback {
  display: block;
  font-size: 50px;
  color: #FFD700 !important;
  font-weight: bold;
  position: absolute;
}

.logo-container::before {
  content: "";
  position: absolute;
  opacity: 0;
  font-size: 50px;
  color: #FFD700;
  font-weight: bold;
  z-index: -1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: black;
}

.company-tagline {
  font-size: 16px;
  font-style: italic;
  margin: 0 0 10px 0;
  color: #666;
}

.contact-details p {
  margin: 2px 0;
  font-size: 14px;
  color: black;
}

.document-header {
  text-align: right;
}

.document-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: black;
}

.document-subtitle {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #666;
}

.order-number {
  font-size: 16px;
}

.order-label {
  color: #666;
}

.order-id {
  font-weight: bold;
  color: black;
}

/* Information Section */
.info-section {
  margin: 15px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.info-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10px;
}

.info-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.info-label {
  font-weight: bold;
  color: black;
}

.info-value {
  color: black;
}

.status-value {
  color: #059669;
  font-weight: bold;
}

/* Section Titles */
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 10px 0;
  color: black;
  border-bottom: 1px solid #000;
  padding-bottom: 3px;
}

/* Table Section */
.table-section {
  margin: 15px 0;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.product-table th,
.product-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
}

.product-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: black;
}

.product-table td {
  color: black;
}

.text-center { text-align: center !important; }
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }

.product-detail {
  text-align: left;
}

.product-name {
  font-weight: bold;
  margin-bottom: 3px;
}

.product-id {
  font-size: 12px;
  color: #666;
}

.total-amount {
  font-weight: bold;
  color: #059669;
}

/* Summary Section */
.summary-section {
  max-width: 300px;
  margin-left: auto;
  border-top: 2px solid #000;
  padding-top: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 3px 0;
}

.summary-label {
  font-weight: 500;
  color: black;
}

.summary-value {
  font-weight: bold;
  color: black;
}

.discount-text {
  color: #dc2626;
}

.total-row {
  border-top: 1px solid #000;
  margin-top: 8px;
  padding-top: 8px;
}

.total-value {
  font-size: 16px;
  font-weight: bold;
  color: #059669;
}

/* Terms Section */
.terms-section {
  margin: 20px 0;
}

.terms-content {
  display: grid;
  gap: 8px;
}

.term-item {
  font-size: 14px;
  line-height: 1.5;
  color: black;
  padding: 5px 0;
}

/* Signature Section */
.signature-section {
  margin: 30px 0 20px 0;
}

.signature-row {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.signature-group {
  flex: 1;
  text-align: center;
}

.signature-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: black;
}

.signature-subtitle {
  font-size: 12px;
  margin-bottom: 30px;
  color: #666;
}

.signature-line {
  height: 1px;
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.signature-date {
  font-size: 12px;
  color: #666;
}

/* Footer */
.document-footer {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #000;
  text-align: center;
}

.footer-note {
  font-size: 14px;
  margin-bottom: 8px;
  color: black;
}

.footer-legal {
  font-size: 12px;
  margin-bottom: 4px;
  color: #666;
}

/* Action Bar */
.action-bar {
  margin-top: 20px;
  text-align: center;
  padding: 20px 0;
  background: white !important;
  border-top: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
}

/* Print styles - show fallback diamond only in print */
@media print {
  .logo-container .v-icon {
    display: none !important;
}

  .logo-container::before {
    content: "♦";
    opacity: 1;
    position: static;
    z-index: 1;
}
}

/* Print Styles */
@media print {
  @page {
    size: A4;
    margin: 8mm;
}

  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .no-print,
  .action-bar,
  .document-footer,
  .v-btn {
    display: none !important;
  }
  
  .purchase-order-container {
    height: auto !important;
    overflow: visible !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .a4-purchase-order {
    margin: 0 !important;
    padding: 5mm !important;
    width: 194mm !important;
    max-width: 194mm !important;
    min-height: 281mm !important;
    max-height: none !important;
    overflow: visible !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background: white !important;
    font-size: 12px !important;
    position: relative;
  }
  
  html, body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Compact sections for print */
  .section-title {
    font-size: 14px !important;
    margin: 10px 0 8px 0 !important;
  }
  
  .header-section {
    margin-bottom: 10px !important;
    padding-bottom: 8px !important;
  }
  
  .info-section,
  .table-section,
  .terms-section,
  .signature-section {
    margin: 10px 0 !important;
  }
  
  .product-table th,
  .product-table td {
    padding: 4px !important;
    font-size: 11px !important;
  }
  
  .signature-section {
    margin: 15px 0 10px 0 !important;
  }
  
  .signature-subtitle {
    margin-bottom: 15px !important;
  }
  
  .terms-content {
    gap: 4px !important;
  }
  
  .term-item {
    font-size: 11px !important;
    padding: 2px 0 !important;
  }
}

/* Clean white background and black text */
.purchase-order-container,
.a4-purchase-order {
  background-color: white !important;
  color: black !important;
  }
  
.logo-container * {
  background-color: transparent !important;
  color: #FFD700 !important;
}

.status-value,
.total-amount,
.total-value {
  color: #059669 !important;
}

.discount-text {
  color: #dc2626 !important;
}

.company-tagline,
.document-subtitle,
.order-label,
.product-id,
.signature-subtitle,
.signature-date,
.footer-legal {
  color: #666 !important;
  }
  
/* Hide elements in print only */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .purchase-order-container {
    padding: 8px;
  }
  
  .a4-purchase-order {
    width: 100%;
    padding: 15px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .signature-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
