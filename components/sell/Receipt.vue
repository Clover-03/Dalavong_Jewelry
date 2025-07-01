<template>
  <div class="receipt-container">
    <div class="a4-receipt">
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
          <h2 class="document-title">ໃບຂາຍ / ໃບຮັບປະກັນ</h2>
          <p class="document-subtitle">SALES RECEIPT / WARRANTY</p>
          <div class="receipt-number">
            <span class="receipt-label">ເລກທີ:</span>
            <span class="receipt-id"># {{ sale.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer and Sale Information -->
    <div class="info-section">
      <div class="info-row">
        <div class="info-group">
          <span class="info-label">ລູກຄ້າ:</span>
          <span class="info-value">{{ sale.customer || 'ບໍ່ລະບຸ' }}</span>
        </div>
        <div class="info-group">
          <span class="info-label">ວັນທີຂາຍ:</span>
          <span class="info-value">{{ formatDate(sale.saleDate) }}</span>
        </div>
        <div class="info-group">
          <span class="info-label">ສະຖານະ:</span>
          <span class="status-value">Completed</span>
        </div>
      </div>
    </div>

    <!-- Product Details Table -->
    <div class="table-section">
      <h3 class="section-title">ລາຍລະອຽດສິນຄ້າທີ່ຂາຍ</h3>
      
      <table class="product-table">
      <thead>
        <tr>
            <th class="text-center">ລຳດັບ</th>
            <th class="text-left">ຊື່ສິນຄ້າ</th>
            <th class="text-center">ນ້ຳໜັກ</th>
            <th class="text-center">ຈຳນວນ</th>
            <th class="text-right">ລາຄາຂາຍ (ກີບ)</th>
            <th class="text-right">ສ່ວນຫຼຸດ (ກີບ)</th>
            <th class="text-right">ລວມ (ກີບ)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td class="text-center">1</td>
            <td class="text-left">
              <div class="product-detail">
                <div class="product-name">{{ sale.product || 'ບໍ່ລະບຸຊື່ສິນຄ້າ' }}</div>
                <div class="product-id" v-if="sale.productCode && sale.productCode !== 'N/A'">ລະຫັດສິນຄ້າ: {{ sale.productCode }}</div>
              </div>
          </td>
            <td class="text-center">{{ sale.weight || '0 ກຣາມ' }}</td>
            <td class="text-center">1</td>
            <td class="text-right">{{ formatCurrency(sale.price || 0) }}</td>
            <td class="text-right">{{ formatCurrency(sale.discount || 0) }}</td>
            <td class="text-right total-amount">{{ formatCurrency(sale.total || 0) }}</td>
        </tr>
      </tbody>
      </table>

      <!-- Summary -->
      <div class="summary-section">
        <div class="summary-row">
          <span class="summary-label">ລາຄາສິນຄ້າ:</span>
          <span class="summary-value">{{ formatCurrency(sale.price || 0) }}</span>
        </div>
        <div class="summary-row" v-if="sale.discount > 0">
          <span class="summary-label">ສ່ວນຫຼຸດ:</span>
          <span class="summary-value discount-text">-{{ formatCurrency(sale.discount || 0) }}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">ລວມສຸດທິ:</span>
          <span class="summary-value total-value">{{ formatCurrency(sale.total || 0) }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="payment-section">
      <h3 class="section-title">ຂໍ້ມູນການຊຳລະເງິນ</h3>
      <div class="payment-info">
        <div class="payment-row">
          <div class="payment-group">
            <span class="payment-label">ວິທີການຊຳລະ:</span>
            <span class="payment-value">{{ sale.paymentMethod || 'ເງິນສົດ' }}</span>
          </div>
          <div class="payment-group">
            <span class="payment-label">ສະຖານະການຊຳລະ:</span>
            <span class="payment-status">ຊຳລະແລ້ວ</span>
          </div>
        </div>
        <div class="payment-row">
          <div class="payment-group">
            <span class="payment-label">ເງິນທີ່ຮັບ:</span>
            <span class="payment-value">{{ formatCurrency(sale.total || 0) }}</span>
          </div>
          <div class="payment-group">
            <span class="payment-label">ເງິນທອນ:</span>
            <span class="payment-value">0 ກີບ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Warranty Information -->
    <div class="warranty-section">
      <h3 class="section-title">ຂໍ້ມູນການຮັບປະກັນ</h3>
      <div class="warranty-info">
        <div class="warranty-row">
          <div class="warranty-group">
            <span class="warranty-label">ການຮັບປະກັນ:</span>
            <span class="warranty-value">ຄຸນນະພາບທອງຄຳ ແລະ ຄຸນນະພາບຝີມື ເປັນເວລາ 1 ປີ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Care Instructions -->
    <div class="care-section">
      <h3 class="section-title">ຄຳແນະນຳການດູແລ</h3>
      <div class="care-instructions">
        <div class="care-item">• ຫຼີກເວັ້ນການສຳພັດກັບນ້ຳຢາ ແລະ ສານເຄມີ</div>
        <div class="care-item">• ເກັບໃສ່ກ່ອງເພື່ອປ້ອງກັນການຂູດຂີດ</div>
        <div class="care-item">• ທຳຄວາມສະອາດດ້ວຍຜ້ານຸ່ມ ແລະ ນ້ຳອຸ່ນ</div>
      </div>
    </div>

    <!-- Signature Section -->
    <div class="signature-section">
      <div class="signature-row">
        <div class="signature-group">
          <div class="signature-title">ຜູ້ຂາຍ</div>
          <div class="signature-subtitle">ຮ້ານຄຳ ດາລາວົງ</div>
          <div class="signature-line"></div>
          <div class="signature-date">ວັນທີ: {{ getCurrentDate() }}</div>
        </div>
        <div class="signature-group">
          <div class="signature-title">ຜູ້ຊື້</div>
          <div class="signature-subtitle">{{ sale.customer || 'ລູກຄ້າ' }}</div>
          <div class="signature-line"></div>
          <div class="signature-date">ວັນທີ: {{ getCurrentDate() }}</div>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="terms-section">
      <h3 class="section-title">ເງື່ອນໄຂການຂາຍ ແລະ ການຮັບປະກັນ</h3>
      <div class="terms-content">
        <div class="term-item">
          <strong>1. ການຮັບປະກັນ:</strong> ສິນຄ້າທີ່ຂາຍມີການຮັບປະກັນຄຸນນະພາບທອງຄຳ ແລະ ຝີມືເປັນເວລາ 1 ປີ
        </div>
        <div class="term-item">
          <strong>2. ການຊ່ອມແຊມ:</strong> ບໍລິການຊ່ອມແຊມຟຣີພາຍໃນໄລຍະຮັບປະກັນ (ບໍ່ຮວມຄ່າເສຍຫາຍຈາກອຸບັດເຫດ)
        </div>
        <div class="term-item">
          <strong>3. ການທຳຄວາມສະອາດ:</strong> ບໍລິການທຳຄວາມສະອາດຟຣີຕະຫຼອດອາຍຸການຮັບປະກັນ
        </div>
      </div>
    </div>



    <!-- Footer -->
    <div class="document-footer no-print">
      <div class="footer-content">
        <p class="footer-note">
          ໃບຂາຍ/ໃບຮັບປະກັນນີ້ເປັນຫຼັກຖານການຊື້ຂາຍ ແລະ ການຮັບປະກັນສິນຄ້າ ກະລຸນາເກັບໄວ້ໃຫ້ດີ
        </p>
        <p class="footer-legal">ໃບຂາຍນີ້ຖືກສ້າງໂດຍລະບົບຄອມພິວເຕີ | ເລກທີໃບຂາຍ: {{ sale.id }} | ວັນທີ: {{ formatDate(sale.saleDate) }}</p>
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
        ພິມໃບຂາຍ/ໃບຮັບປະກັນ
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

const props = defineProps({
  sale: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

const formatCurrency = (value) => {
  if (value == null) return '0 ກີບ';
  return new Intl.NumberFormat('lo-LA').format(value) + ' ກີບ';
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

const formatWarrantyEndDate = (dateString) => {
  if (!dateString) return 'ບໍ່ລະບຸ';
  const endDate = new Date(dateString);
  endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
  return endDate.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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

const handlePrint = () => {
  // Hide all non-print elements and create print-only window
  const printContent = document.querySelector('.a4-receipt').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Receipt - ${props.sale.id || 'N/A'}</title>
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
        .logo-container { display: flex; align-items: center; justify-content: center; position: relative; width: 60px; height: 60px; }
        .logo-container .v-icon { display: none !important; }
        .logo-container::before { content: ""; position: absolute; opacity: 0; font-size: 50px; color: #FFD700; font-weight: bold; z-index: -1; }
        .company-name { font-size: 20px; font-weight: bold; margin: 0 0 3px 0; }
        .company-tagline { font-size: 14px; margin: 0 0 8px 0; color: #666; }
        .contact-details p { margin: 1px 0; font-size: 12px; }
        .document-header { text-align: right; }
        .document-title { font-size: 18px; font-weight: bold; margin: 0 0 3px 0; }
        .document-subtitle { font-size: 14px; margin: 0 0 8px 0; color: #666; }
        .receipt-number { font-size: 16px; }
        .receipt-label { color: #666; }
        .receipt-id { font-weight: bold; color: black; }
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
        .info-section, .payment-section, .warranty-section, .care-section, .signature-section, .terms-section { margin: 8px 0; }
        .info-row, .payment-row, .warranty-row { display: flex; justify-content: space-between; gap: 15px; }
        .info-group, .payment-group, .warranty-group { display: flex; gap: 5px; align-items: center; font-size: 11px; }
        .care-instructions { display: grid; gap: 3px; }
        .care-item { font-size: 11px; }
        .signature-row { display: flex; justify-content: space-between; gap: 30px; margin: 15px 0; }
        .signature-group { flex: 1; text-align: center; }
        .signature-title { font-weight: bold; margin-bottom: 3px; font-size: 12px; }
        .signature-subtitle { font-size: 11px; margin-bottom: 20px; color: #666; }
        .signature-line { height: 1px; border-bottom: 1px solid #000; margin-bottom: 3px; }
        .signature-date { font-size: 10px; color: #666; }
        .terms-content { display: grid; gap: 3px; }
        .term-item { font-size: 10px; line-height: 1.4; padding: 1px 0; }
        .status-value, .payment-status, .total-amount { color: #059669 !important; }
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
</script>

<style scoped>
.receipt-container {
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.a4-receipt {
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

/* Show fallback if v-icon is hidden or not working */
.logo-container:not(:has(.v-icon:not([style*="display: none"]))) .diamond-fallback {
  display: block;
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

.receipt-number {
  font-size: 16px;
}

.receipt-label {
  color: #666;
}

.receipt-id {
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
  font-size: 18px;
  font-weight: bold;
  color: #059669;
}

/* Payment Section */
.payment-section {
  margin: 20px 0;
}

.payment-info {
  display: grid;
  gap: 10px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.payment-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.payment-label {
  font-weight: bold;
  color: black;
}

.payment-value {
  color: black;
}

.payment-status {
  color: #059669;
    font-weight: bold;
}

/* Warranty Section */
.warranty-section {
  margin: 20px 0;
}

.warranty-info {
  display: grid;
  gap: 10px;
}

.warranty-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.warranty-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.warranty-label {
  font-weight: bold;
  color: black;
}

.warranty-value {
  color: black;
}

/* Care Section */
.care-section {
  margin: 20px 0;
}

.care-instructions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.care-item {
  color: black;
  font-size: 14px;
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
  color: black;
}

.signature-subtitle {
  font-size: 14px;
  margin-bottom: 30px;
  color: #666;
}

.signature-line {
  height: 1px;
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.signature-date {
  font-size: 14px;
  color: #666;
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

.print-date {
  font-size: 12px;
  color: #666;
  margin: 0;
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

/* Print Styles */
@media print {
  @page {
    size: A4;
    margin: 8mm;
    /* Hide browser headers/footers */
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
  
  .receipt-container {
    height: auto !important;
    overflow: visible !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .a4-receipt {
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
  
  /* Force full page content */
  .receipt-container {
    height: 281mm !important;
    min-height: 281mm !important;
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
  .payment-section,
  .warranty-section,
  .care-section,
  .signature-section,
  .terms-section {
    margin: 10px 0 !important;
  }
  
  .product-table th,
  .product-table td {
    padding: 4px !important;
    font-size: 11px !important;
  }
  
  .care-instructions {
    grid-template-columns: 1fr !important;
    gap: 4px !important;
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
  
  .document-footer {
    margin-top: 15px !important;
    padding-top: 8px !important;
  }
  
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

/* Clean white background and black text */
.receipt-container,
.a4-receipt {
  background-color: white !important;
  color: black !important;
}

.logo-container * {
  background-color: transparent !important;
  color: #FFD700 !important;
}

.status-value,
.payment-status,
.total-amount,
.total-value {
  color: #059669 !important;
}

.discount-text {
  color: #dc2626 !important;
}

.company-tagline,
.document-subtitle,
.receipt-label,
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
</style> 