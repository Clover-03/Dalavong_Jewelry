<template>
  <div class="exchange-receipt-container">
    <div class="a4-exchange-receipt">
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
            <h2 class="document-title">ໃບແລກປ່ຽນ / ໃບຮັບປະກັນ</h2>
            <p class="document-subtitle">EXCHANGE RECEIPT / WARRANTY</p>
            <div class="exchange-number">
              <span class="exchange-label">ເລກທີ:</span>
              <span class="exchange-id"># {{ exchange.Exch_ID }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer and Exchange Information -->
      <div class="info-section">
        <div class="info-row">
          <div class="info-group">
            <span class="info-label">ລູກຄ້າ:</span>
            <span class="info-value">{{ getCustomerName() }}</span>
          </div>
          <div class="info-group">
            <span class="info-label">ວັນທີແລກປ່ຽນ:</span>
            <span class="info-value">{{ formatDate(exchange.Exch_Date) }}</span>
          </div>
          <div class="info-group">
            <span class="info-label">ສະຖານະ:</span>
            <span class="status-value">Completed</span>
          </div>
        </div>
        <div class="info-row" v-if="getCustomerPhone() !== 'ບໍ່ມີຂໍ້ມູນ' || getCustomerAddress() !== 'ບໍ່ມີຂໍ້ມູນ'">
          <div class="info-group" v-if="getCustomerPhone() !== 'ບໍ່ມີຂໍ້ມູນ'">
            <span class="info-label">ໂທລະສັບ:</span>
            <span class="info-value">{{ getCustomerPhone() }}</span>
          </div>
          <div class="info-group" v-if="getCustomerAddress() !== 'ບໍ່ມີຂໍ້ມູນ'">
            <span class="info-label">ທີ່ຢູ່:</span>
            <span class="info-value">{{ getCustomerAddress() }}</span>
          </div>
          <div class="info-group">
            <span class="info-label">ຜູ້ຮັບຜິດຊອບ:</span>
            <span class="info-value">ຮ້ານຄຳ ດາລາວົງ</span>
          </div>
        </div>
      </div>

      <!-- Exchange Details -->
      <div class="exchange-section">
        <h3 class="section-title">ລາຍລະອຽດການແລກປ່ຽນ</h3>
        
        <!-- Old Product (Return) -->
        <div class="product-section old-product">
          <h4 class="product-section-title">
            <v-icon size="20" color="#f59e0b" class="mr-2">mdi-arrow-left</v-icon>
            ສິນຄ້າເກົ່າ (ຮັບຄືນ)
          </h4>
          <table class="product-table">
            <thead>
              <tr>
                <th class="text-left">ຊື່ສິນຄ້າ</th>
                <th class="text-center">ປະເພດ</th>
                <th class="text-center">ນ້ຳໜັກ</th>
                <th class="text-center">ສະພາບ</th>
                <th class="text-right">ລາຄາຮັບຄືນ (ກີບ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">{{ getOldProductName() }}</td>
                <td class="text-center">{{ getOldProductType() }}</td>
                <td class="text-center">{{ getOldProductWeight() }}</td>
                <td class="text-center">{{ getConditionText(exchange.Old_Product?.condition || exchange.Old_Product_Condition) }}</td>
                <td class="text-right total-amount">{{ formatCurrency(exchange.Old_Product_Value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- New Product (Sale) -->
        <div class="product-section new-product">
          <h4 class="product-section-title">
            <v-icon size="20" color="#10b981" class="mr-2">mdi-arrow-right</v-icon>
            ສິນຄ້າໃໝ່ (ຂາຍ)
          </h4>
          <table class="product-table">
            <thead>
              <tr>
                <th class="text-left">ຊື່ສິນຄ້າ</th>
                <th class="text-center">ນ້ຳໜັກ</th>
                <th class="text-center">ຈຳນວນ</th>
                <th class="text-right">ລາຄາຂາຍ (ກີບ)</th>
                <th class="text-right">ລວມ (ກີບ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">{{ exchange.New_Product?.Pd_name || 'N/A' }}</td>
                <td class="text-center">{{ formatWeight(exchange.New_Product?.Weight) }}</td>
                <td class="text-center">1</td>
                <td class="text-right">{{ formatCurrency(exchange.New_Product_Value) }}</td>
                <td class="text-right total-amount">{{ formatCurrency(exchange.New_Product_Value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">ລາຄາສິນຄ້າໃໝ່:</span>
            <span class="summary-value">{{ formatCurrency(exchange.New_Product_Value) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">ຄ່າປ່ຽນທອງ:</span>
            <span class="summary-value">{{ formatCurrency(exchange.Gold_Change_Fee || 0) }}</span>
          </div>
          <div class="summary-row" v-if="exchange.Lost_Weight_Fee > 0">
            <span class="summary-label">ຄ່ານ້ຳໜັກທອງຫຼຸດ:</span>
            <span class="summary-value">{{ formatCurrency(exchange.Lost_Weight_Fee) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">ລາຄາສິນຄ້າເກົ່າ:</span>
            <span class="summary-value discount-text">-{{ formatCurrency(exchange.Old_Product_Value) }}</span>
          </div>
          <div class="summary-row total-row">
            <span class="summary-label">ສ່ວນຕ່າງສຸດທິ:</span>
            <span class="summary-value total-value">{{ formatCurrency(exchange.Different_price) }}</span>
          </div>
          <div class="summary-note">
            <em>{{ exchange.Different_price >= 0 ? 'ລູກຄ້າຈ່າຍເພີ່ມ' : 'ຮ້ານຈ່າຍຄືນລູກຄ້າ' }}</em>
          </div>
        </div>
      </div>

      <!-- Warranty Information -->
      <div class="warranty-section">
        <h3 class="section-title">ຂໍ້ມູນການຮັບປະກັນ</h3>
        <div class="warranty-content">
          <div class="warranty-item">
            <strong>ການຮັບປະກັນຄຸນນະພາບ:</strong> ຮັບປະກັນຄຸນນະພາດສິນຄ້າ ແລະ ຄວາມບໍລິສຸດຂອງທອງຄຳ
          </div>
          <div class="warranty-item">
            <strong>ການຮັບປະກັນການຜະລິດ:</strong> ຮັບປະກັນຄຸນນະພາບການຜະລິດ ແລະ ການຕິດຕັ້ງອົບປະກອບ
          </div>
          <div class="warranty-item">
            <strong>ການບໍລິການຫຼັງການຂາຍ:</strong> ໃຫ້ບໍລິການທຳຄວາມສະອາດ ແລະ ຕກແຕ່ງໃໝ່ໂດຍບໍ່ເສຍຄ່າ
          </div>
        </div>
      </div>

      <!-- Care Instructions -->
      <div class="care-section">
        <h3 class="section-title">ຄຳແນະນຳການດູແລ</h3>
        <div class="care-content">
          <div class="care-item">
            <strong>1. ການທຳຄວາມສະອາດ:</strong> ໃຊ້ນ້ຳອຸ່ນ ແລະ ສະບູອ່ອນໆ ເຊັດໃຫ້ແຫ້ງດ້ວຍຜ້າອ່ອນ
          </div>
          <div class="care-item">
            <strong>2. ການເກັບຮັກສາ:</strong> ເກັບໃສ່ກ່ອງຫຼືຖົງຜ້າ ແຍກຈາກເຄື່ອງປະດັບອື່ນ
          </div>
          <div class="care-item">
            <strong>3. ການໃຊ້ງານ:</strong> ຫຼີກເວັ້ນການສຳພັດກັບສານເຄມີ ແລະ ກິດຈະກຳທີ່ຮຸນແຮງ
          </div>
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
            <div class="signature-subtitle">{{ getCustomerName() }}</div>
            <div class="signature-line"></div>
            <div class="signature-date">ວັນທີ: {{ getCurrentDate() }}</div>
          </div>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="terms-section">
        <h3 class="section-title">ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ</h3>
        <div class="terms-content">
          <div class="term-item">
            <strong>1. ການຮັບປະກັນ:</strong> ໃບແລກປ່ຽນນີ້ເປັນຫຼັກຖານການຮັບປະກັນສິນຄ້າ ແລະ ບໍລິການ
          </div>
          <div class="term-item">
            <strong>2. ການແລກເປລີ່ຍນ:</strong> ການແລກປ່ຽນສິນຄ້າຕ້ອງມີໃບແລກປ່ຽນນີ້ເປັນຫຼັກຖານ
          </div>
          <div class="term-item">
            <strong>3. ຄວາມຮັບຜິດຊອບ:</strong> ຮ້ານບໍ່ຮັບຜິດຊອບຕໍ່ຄວາມເສຍຫາຍທີ່ເກີດຈາກການໃຊ້ງານຜິດວິທີ
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="notes-section" v-if="exchange.Notes">
        <h3 class="section-title">ໝາຍເຫດ</h3>
        <div class="notes-content">
          <p>{{ exchange.Notes }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="document-footer no-print">
        <div class="footer-content">
          <p class="footer-note">
            ໃບແລກປ່ຽນ/ໃບຮັບປະກັນນີ້ເປັນຫຼັກຖານການແລກປ່ຽນສິນຄ້າ ແລະ ການຮັບປະກັນ ກະລຸນາເກັບໄວ້ໃຫ້ດີ
          </p>
          <p class="footer-legal">ໃບແລກປ່ຽນນີ້ຖືກສ້າງໂດຍລະບົບຄອມພິວເຕີ | ເລກທີ: {{ exchange.Exch_ID }} | ວັນທີ: {{ formatDate(exchange.Exch_Date) }}</p>
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
          ພິມໃບແລກປ່ຽນ
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
  exchange: {
    type: Object,
    required: true
  },
  customers: {
    type: Array,
    default: () => []
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
  return date.toLocaleDateString('en-CA');
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-CA');
};

const getCustomerName = () => {
  if (!props.exchange.Cust_ID || !props.customers.length) return 'N/A';
  const customer = props.customers.find(c => c.Cust_ID === props.exchange.Cust_ID);
  return customer?.Cust_name || 'N/A';
};

const getCustomerPhone = () => {
  if (!props.exchange.Cust_ID || !props.customers.length) return 'ບໍ່ມີຂໍ້ມູນ';
  const customer = props.customers.find(c => c.Cust_ID === props.exchange.Cust_ID);
  return customer?.Cust_phone || customer?.phone || 'ບໍ່ມີຂໍ້ມູນ';
};

const getCustomerAddress = () => {
  if (!props.exchange.Cust_ID || !props.customers.length) return 'ບໍ່ມີຂໍ້ມູນ';
  const customer = props.customers.find(c => c.Cust_ID === props.exchange.Cust_ID);
  return customer?.Cust_address || customer?.address || 'ບໍ່ມີຂໍ້ມູນ';
};

const getConditionText = (condition) => {
  // แสดงเป็นภาษาอังกฤษตามที่ผู้ใช้ต้องการ
  return condition || 'GOOD';
};

const getOldProductName = () => {
  return props.exchange.Old_Product?.Pd_name || props.exchange.Old_Pd_Description || 'N/A';
};

const getOldProductType = () => {
  // Try multiple sources for type data
  const type = props.exchange.Old_Product?.Type || props.exchange.Old_Pd_Type;
  
  // If type is empty string or null, return default
  if (!type || type.trim() === '') {
    return 'ສິນຄ້າແລກປ່ຽນ';
  }
  
  return type;
};

const getOldProductWeight = () => {
  // Try multiple sources for weight data
  const weight = props.exchange.Old_Product?.Weight || props.exchange.Old_Pd_Actual_Weight;
  
  // Handle different weight formats
  let parsedWeight = 0;
  if (typeof weight === 'string') {
    parsedWeight = parseFloat(weight) || 0;
  } else if (typeof weight === 'number') {
    parsedWeight = weight;
  }
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Weight debug:', {
      oldProductWeight: props.exchange.Old_Product?.Weight,
      actualWeight: props.exchange.Old_Pd_Actual_Weight,
      finalWeight: parsedWeight
    });
  }
  
  return formatWeight(parsedWeight);
};

const handlePrint = () => {
  // Hide all non-print elements and create print-only window
  const printContent = document.querySelector('.a4-exchange-receipt').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Exchange Receipt - ${props.exchange.Exch_ID || 'N/A'}</title>
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
        
        /* Header */
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
        .exchange-number { font-size: 16px; }
        .exchange-label { color: #666; }
        .exchange-id { font-weight: bold; color: black; }
        
        /* Sections */
        .section-title { font-size: 14px; font-weight: bold; margin: 8px 0 5px 0; border-bottom: 1px solid #000; padding-bottom: 2px; }
        .info-section, .exchange-section, .warranty-section, .care-section, .terms-section, .signature-section, .notes-section { margin: 8px 0; }
        .info-row { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 3px; }
        .info-group { display: flex; gap: 5px; align-items: center; font-size: 11px; }
        .info-label { font-weight: bold; }
        .info-value { color: #333; }
        .status-value { color: #059669 !important; font-weight: bold; }
        
        /* Product Tables */
        .product-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .product-table th, .product-table td { border: 1px solid #000; padding: 4px; font-size: 10px; }
        .product-table th { background-color: #f0f0f0; font-weight: bold; }
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .total-amount { color: #059669 !important; font-weight: bold; }
        .product-section { margin: 10px 0; }
        .product-section-title { font-size: 12px; margin: 5px 0; color: #666; }
        
        /* Summary */
        .summary-section { max-width: 250px; margin-left: auto; border-top: 2px solid #000; padding-top: 5px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
        .summary-label { font-weight: bold; }
        .summary-value { color: #333; }
        .total-row { border-top: 1px solid #000; margin-top: 5px; padding-top: 5px; }
        .total-value { font-size: 14px; font-weight: bold; color: #059669; }
        .discount-text { color: #dc2626 !important; }
        .summary-note { font-size: 10px; color: #666; font-style: italic; text-align: center; margin-top: 5px; }
        
        /* Signature */
        .signature-row { display: flex; justify-content: space-between; gap: 30px; margin: 15px 0; }
        .signature-group { flex: 1; text-align: center; }
        .signature-title { font-weight: bold; margin-bottom: 3px; font-size: 12px; }
        .signature-subtitle { font-size: 11px; margin-bottom: 20px; color: #666; }
        .signature-line { height: 1px; border-bottom: 1px solid #000; margin-bottom: 3px; }
        .signature-date { font-size: 10px; color: #666; }
        
        /* Content Sections */
        .warranty-content, .care-content, .terms-content, .notes-content { display: grid; gap: 3px; }
        .warranty-item, .care-item, .term-item { font-size: 10px; line-height: 1.4; padding: 1px 0; }
        .notes-content p { font-size: 11px; line-height: 1.4; }
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
.exchange-receipt-container {
  background: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
}

.a4-exchange-receipt {
  width: 194mm;
  min-height: 281mm;
  margin: 20px auto;
  padding: 8mm;
  background: white;
  color: black;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'Noto Sans Lao', sans-serif;
  line-height: 1.4;
}

/* Header Styling */
.header-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #365a76;
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

.diamond-fallback {
  display: block;
  font-size: 50px;
  color: #FFD700 !important;
  font-weight: bold;
  position: absolute;
}

.logo-container .v-icon {
  display: none !important;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: #365a76;
}

.company-tagline {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: #666;
  font-style: italic;
}

.contact-details p {
  margin: 2px 0;
  font-size: 14px;
  color: #333;
}

.document-header {
  text-align: right;
  min-width: 280px;
}

.document-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: #365a76;
}

.document-subtitle {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: #666;
}

.exchange-number {
  font-size: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.exchange-label {
  color: #666;
}

.exchange-id {
  font-weight: bold;
  color: #365a76;
}

/* Info Section */
.info-section {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #365a76;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-group {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.info-label {
  font-weight: 600;
  color: #365a76;
}

.info-value {
  color: #333;
}

.status-value {
  color: #059669 !important;
  font-weight: bold;
}

/* Exchange Section */
.exchange-section {
  margin: 25px 0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 12px 0;
  color: #365a76;
  border-bottom: 2px solid #365a76;
  padding-bottom: 5px;
}

.product-section {
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.product-section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  padding: 12px 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #365a76;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 12px 8px;
  font-size: 14px;
}

.product-table th {
  background: linear-gradient(135deg, #365a76 0%, #2c4960 100%);
  color: white;
  font-weight: 600;
  text-align: center;
}

.product-table td {
  background: white;
}

.text-center {
  text-align: center !important;
}

.text-left {
  text-align: left !important;
}

.text-right {
  text-align: right !important;
}

.total-amount {
  color: #059669 !important;
  font-weight: bold;
}

/* Summary Section */
.summary-section {
  max-width: 350px;
  margin-left: auto;
  margin-top: 25px;
  border: 2px solid #365a76;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fa;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-label {
  font-weight: 600;
  color: #365a76;
}

.summary-value {
  color: #333;
  font-weight: 500;
}

.total-row {
  border-top: 2px solid #365a76;
  margin-top: 12px;
  padding-top: 12px;
}

.total-value {
  font-size: 18px;
  font-weight: bold;
  color: #059669;
}

.discount-text {
  color: #dc2626 !important;
}

.summary-note {
  font-size: 12px;
  color: #666;
  font-style: italic;
  text-align: center;
  margin-top: 8px;
}

/* Warranty, Care, Terms Sections */
.warranty-section,
.care-section,
.terms-section,
.notes-section {
  margin: 25px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #365a76;
}

.warranty-content,
.care-content,
.terms-content {
  display: grid;
  gap: 8px;
}

.warranty-item,
.care-item,
.term-item {
  font-size: 14px;
  line-height: 1.5;
  padding: 5px 0;
}

.notes-content p {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

/* Signature Section */
.signature-section {
  margin: 30px 0 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
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
  font-size: 16px;
  color: #365a76;
}

.signature-subtitle {
  font-size: 14px;
  margin-bottom: 30px;
  color: #666;
}

.signature-line {
  height: 2px;
  border-bottom: 1px solid #333;
  margin-bottom: 8px;
}

.signature-date {
  font-size: 12px;
  color: #666;
}

/* Action Bar */
.action-bar {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

/* Footer */
.document-footer {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-top: 1px solid #e0e0e0;
}

.footer-content {
  text-align: center;
}

.footer-note {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.footer-legal {
  font-size: 11px;
  color: #999;
  margin: 0;
}

/* Print Media Query */
@media print {
  .exchange-receipt-container {
    background: white !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .a4-exchange-receipt {
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
  
  .no-print,
  .action-bar,
  .document-footer {
    display: none !important;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .a4-exchange-receipt {
    width: 95%;
    margin: 10px auto;
    padding: 15px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .document-header {
    text-align: left;
  }
  
  .info-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .signature-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .summary-section {
    max-width: 100%;
  }
}
</style> 