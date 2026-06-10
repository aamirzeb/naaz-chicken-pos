let selectedProduct = '';
let selectedPrice = 0;

let cart = [];
let allOrders = [];

let currentFilter = 'all';

const ADMIN_PASSWORD = 'admin123';

/* PRODUCT SELECT */

function selectProduct(name, price, event) {

  selectedProduct = name;
  selectedPrice = price;

  document.querySelectorAll('.product-card')
  .forEach(card => {
    card.classList.remove('active-product');
  });

  event.currentTarget.classList.add('active-product');
}

/* CUSTOMER POPUP */

function openCustomerPopup() {

  if (!selectedProduct) {
    alert('Select Product');
    return;
  }

  let weight =
  document.getElementById('weight').value;

  if (!weight || weight <= 0) {
    alert('Enter Weight');
    return;
  }

  document.getElementById('customerPopup')
  .style.display = 'flex';
}

function closeCustomerPopup() {

  document.getElementById('customerPopup')
  .style.display = 'none';
}

function confirmAddToCart() {

  closeCustomerPopup();
  addToCart();
}

/* ADD TO CART */

function addToCart() {

  let weight = parseFloat(
    document.getElementById('weight').value
  );

  let unit =
  document.getElementById('unit').value;

  let customer =
  document.getElementById('customerName').value
  || 'Walk-in';

  let paymentMode =
  document.querySelector(
    'input[name="paymentMode"]:checked'
  ).value;

  let displayWeight =
  weight + (unit === 'kg' ? 'kg' : 'g');

  if (unit === 'gram') {
    weight = weight / 1000;
  }

  let total = weight * selectedPrice;

  const item = {
    customer: customer,
    name: selectedProduct,
    paymentMode: paymentMode,
    weightDisplay: displayWeight,
    total: total,
    date: new Date().toLocaleString()
  };

  cart.push(item);
  allOrders.push(item);

  renderCart();
  updateQRCode();
  updateAdminPanel();

  document.getElementById('weight').value = '';
  document.getElementById('customerName').value = '';
}

/* CART */

function renderCart() {

  const cartDiv =
  document.getElementById('cart');

  cartDiv.innerHTML = '';

  let grandTotal = 0;

  cart.forEach((item, index) => {

    grandTotal += item.total;

    cartDiv.innerHTML += `
      <div class="cart-item">

        <div>
          <strong>${item.name}</strong><br>
          ${item.weightDisplay} - ₹${item.total.toFixed(2)}
        </div>

        <div class="actions">

          <button class="edit-btn"
          onclick="editItem(${index})">
            Edit
          </button>

          <button class="delete-btn"
          onclick="deleteItem(${index})">
            Delete
          </button>

        </div>

      </div>
    `;
  });

  document.getElementById('total')
  .innerText = grandTotal.toFixed(2);
}

/* QR */

function updateQRCode() {

  const totalAmount =
  document.getElementById('total').innerText;

  const upiLink =
  `upi://pay?pa=paytmqr6m6owz@ptys&pn=NAAZ CHIKEN&am=${totalAmount}&cu=INR`;

  document.getElementById('upiQR').src =
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;
}

/* DELETE */

function deleteItem(index) {

  cart.splice(index, 1);

  renderCart();
  updateQRCode();
}

/* EDIT */

function editItem(index) {

  let newWeight =
  prompt('Enter New Weight');

  if (newWeight) {

    cart[index].weightDisplay =
    newWeight + 'kg';

    renderCart();
    updateQRCode();
  }
}

/* NEW ORDER */

function newOrder() {

  cart = [];

  renderCart();
  updateQRCode();
}

/* PRINT */

function printReceipt() {

  let total =
  document.getElementById('total').innerText;

  let receiptItems = '';

  cart.forEach((item, index) => {

    receiptItems += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.weightDisplay}</td>
        <td>₹${item.total.toFixed(2)}</td>
      </tr>
    `;
  });

  let printWindow =
  window.open('', '', 'width=400,height=700');

  printWindow.document.write(`

  <html>

  <head>

  <title>Receipt</title>

  <style>

  body{
    font-family:Arial;
    padding:20px;
  }

  .header{
    text-align:center;
    border-bottom:2px dashed black;
    padding-bottom:15px;
  }

  .logo{
    font-size:60px;
  }

  .shop{
    font-size:24px;
    font-weight:bold;
    margin-top:10px;
  }

  .details{
    margin-top:8px;
    line-height:1.6;
    font-size:14px;
  }

  table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
  }

  th{
    border-bottom:2px solid black;
    padding:10px 5px;
    text-align:left;
  }

  td{
    padding:10px 5px;
    border-bottom:1px dashed #999;
  }

  .total{
    margin-top:20px;
    text-align:right;
    font-size:24px;
    font-weight:bold;
  }

  .footer{
    text-align:center;
    margin-top:30px;
  }

  </style>

  </head>

  <body>

  <div class="header">

    <div class="logo">🐔</div>

    <div class="shop">
      NAAZ CHIKEN
    </div>

    <div class="details">
      Bharat Bhawan, Chakradharpur<br>
      Contact: 8709443171<br>
      Nazish Hussain<br>
      Bobi: 9262917988<br>
      Noor Mohammad: 9939622799
    </div>

  </div>

  <table>

    <thead>

      <tr>
        <th>S.No</th>
        <th>Product</th>
        <th>Weight</th>
        <th>Price</th>
      </tr>

    </thead>

    <tbody>

      ${receiptItems}

    </tbody>

  </table>

  <div class="total">
    Total: ₹${total}
  </div>

  <div class="footer">
    Thank You Visit Again ❤️
  </div>

  </body>

  </html>

  `);

  printWindow.document.close();
  printWindow.print();
}

/* ADMIN */

function openAdminPopup() {

  document.getElementById('adminPopup')
  .style.display = 'flex';
}

function closeAdminPopup() {

  document.getElementById('adminPopup')
  .style.display = 'none';
}

function checkAdminPassword() {

  let pass =
  document.getElementById('adminPassword').value;

  if (pass === ADMIN_PASSWORD) {

    closeAdminPopup();

    document.getElementById('posSection')
    .style.display = 'none';

    document.getElementById('adminSection')
    .style.display = 'block';

  } else {

    alert('Wrong Password');
  }
}

function showPOS() {

  document.getElementById('adminSection')
  .style.display = 'none';

  document.getElementById('posSection')
  .style.display = 'grid';
}

/* FILTER */

function filterOrders(type, event) {

  currentFilter = type;

  document
  .querySelectorAll('.filter-btn')
  .forEach(btn => {
    btn.classList.remove('active-filter');
  });

  event.currentTarget
  .classList.add('active-filter');

  updateAdminPanel();
}

/* ADMIN UPDATE */

function updateAdminPanel() {

  document.getElementById('totalOrders')
  .innerText = allOrders.length;

  let totalSales = 0;

  const ordersTable =
  document.getElementById('ordersTable');

  ordersTable.innerHTML = '';

  let filteredOrders = allOrders;

  if (currentFilter !== 'all') {

    filteredOrders =
    allOrders.filter(order =>
      order.paymentMode === currentFilter
    );
  }

  filteredOrders.forEach((order, index) => {

    totalSales += order.total;

    ordersTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${order.customer}</td>
        <td>${order.name}</td>
        <td>${order.weightDisplay}</td>
        <td>₹${order.total.toFixed(2)}</td>
        <td>${order.date}</td>
      </tr>
    `;
  });

  document.getElementById('totalSales')
  .innerText =
  '₹' + totalSales.toFixed(2);
}

/* INIT */

updateQRCode();