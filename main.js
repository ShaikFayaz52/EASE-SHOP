
// ======================================
// SHOP EASE MAIN JS
// ======================================



// ======================================
// GET CART
// ======================================

function getCart() {

  return JSON.parse(
    localStorage.getItem('cart') || '[]'
  );

}




// ======================================
// SAVE CART
// ======================================

function saveCart(cart) {

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

}




// ======================================
// UPDATE CART COUNT
// ======================================

function updateCartCount() {

  const cart = getCart();

  const totalQty = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const countElement =
    document.getElementById('cart-count');

  if (countElement) {

    countElement.innerText = totalQty;

  }

}




// ======================================
// ADD TO CART
// ======================================

function addToCart(
  id,
  title,
  price,
  image
) {

  const cart = getCart();

  const existingItem = cart.find(
    item => item.id == id
  );


  if (existingItem) {

    existingItem.qty += 1;

  } else {

    cart.push({

      id: id,

      title: title,

      price: Number(price),

      image: image,

      qty: 1

    });

  }


  saveCart(cart);

  updateCartCount();

  renderCart();

  alert('Product added to cart');

}




// ======================================
// REMOVE FROM CART
// ======================================

function removeFromCart(id) {

  let cart = getCart();

  cart = cart.filter(
    item => item.id != id
  );

  saveCart(cart);

  updateCartCount();

  renderCart();

}




// ======================================
// UPDATE QUANTITY
// ======================================

function updateQuantity(
  id,
  change
) {

  const cart = getCart();

  const item = cart.find(
    i => i.id == id
  );


  if (!item) return;


  item.qty += change;


  // REMOVE ITEM IF QTY <= 0
  if (item.qty <= 0) {

    removeFromCart(id);

    return;

  }


  saveCart(cart);

  updateCartCount();

  renderCart();

}




// ======================================
// SET QUANTITY
// ======================================

function setQuantity(
  id,
  qty
) {

  const cart = getCart();

  const item = cart.find(
    i => i.id == id
  );


  if (!item) return;


  qty = parseInt(qty);


  if (qty <= 0) {

    removeFromCart(id);

    return;

  }


  item.qty = qty;

  saveCart(cart);

  updateCartCount();

  renderCart();

}




// ======================================
// CLEAR CART
// ======================================

function clearCart() {

  localStorage.removeItem('cart');

  updateCartCount();

  renderCart();

}




// ======================================
// CALCULATE TOTAL
// ======================================

function calculateTotal() {

  const cart = getCart();

  return cart.reduce(

    (total, item) => {

      return total + (
        item.price * item.qty
      );

    },

    0

  );

}




// ======================================
// RENDER CART
// ======================================

function renderCart() {

  const cartItems =
    document.getElementById('cart-items');

  const totalElement =
    document.getElementById('cart-total');


  if (!cartItems) return;


  const cart = getCart();


  // EMPTY CART
  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <h2>
          Your cart is empty
        </h2>

      </div>

    `;


    if (totalElement) {

      totalElement.innerText = '₹0';

    }

    return;

  }


  cartItems.innerHTML = '';


  // SHOW CART ITEMS
  cart.forEach(item => {

    cartItems.innerHTML += `

      <div class="cart-item">

        <img
          src="${item.image}"
          alt="${item.title}"
          class="cart-image"
        >


        <div class="cart-details">

          <h3>
            ${item.title}
          </h3>


          <div class="cart-price">

            ₹${item.price}

          </div>


          <div class="qty-controls">

            <button
              onclick="
                updateQuantity(
                  '${item.id}',
                  -1
                )
              "
            >
              -
            </button>


            <input

              type="number"

              min="1"

              value="${item.qty}"

              onchange="
                setQuantity(
                  '${item.id}',
                  this.value
                )
              "

              style="
                width:60px;
                text-align:center;
              "
            >


            <button
              onclick="
                updateQuantity(
                  '${item.id}',
                  1
                )
              "
            >
              +
            </button>

          </div>


          <div
            style="
              margin-top:10px;
              font-weight:600;
            "
          >

            Total:
            ₹${item.price * item.qty}

          </div>

        </div>


        <button

          class="remove-btn"

          onclick="
            removeFromCart(
              '${item.id}'
            )
          "
        >

          Remove

        </button>

      </div>

    `;

  });




  // SHOW TOTAL
  if (totalElement) {

    totalElement.innerText =
      `₹${calculateTotal()}`;

  }

}




// ======================================
// PROCEED TO CHECKOUT
// ======================================

function proceedToCheckout() {

  const cart = getCart();


  if (cart.length === 0) {

    alert('Your cart is empty');

    return false;

  }


  window.location.href =
    'checkout.html';

}




// ======================================
// DEALS CAROUSEL
// ======================================

let currentDeal = 0;


function startDealsCarousel() {

  const carousel =
    document.getElementById(
      'dealsCarousel'
    );


  if (!carousel) return;


  const items =
    carousel.querySelectorAll(
      '.deal-item'
    );


  if (items.length === 0) return;


  items.forEach((item, index) => {

    item.style.display =
      index === 0
      ? 'block'
      : 'none';

  });


  setInterval(() => {

    items[currentDeal]
      .style.display = 'none';


    currentDeal =
      (currentDeal + 1)
      % items.length;


    items[currentDeal]
      .style.display = 'block';

  }, 4000);

}




// ======================================
// INITIAL PAGE LOAD
// ======================================

document.addEventListener(

  'DOMContentLoaded',

  () => {

    updateCartCount();

    renderCart();

    startDealsCarousel();

  }

);
