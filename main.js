// Simple cart implementation using localStorage
function getCart()
{
  try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){ return []; }
}
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }

function addToCart(id, title, price, img){
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; }
  else{ cart.push({ id, title, price: Number(price), img, qty: 1 }); }
  saveCart(cart);
  if(window.showToast) showToast('Added to cart'); else alert('Added to cart');
  renderCartPreview();
}

function removeFromCart(id){
  let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCart(); renderCartPreview();
}

function clearCart(){ localStorage.removeItem('cart'); renderCart(); renderCartPreview(); }

function renderCart(){
  const el = document.getElementById('cart-items');
  if(!el) return;
  const cart = getCart();
  el.innerHTML = '';
  if(cart.length===0){
    el.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent='₹0';
    renderCartPreview();
    updateCheckoutState();
    return;
  }
  cart.forEach(item=>{
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div style="flex:1">
        <div style="font-weight:600">${item.title}</div>
        <div style="margin-top:6px; display:flex; align-items:center; gap:8px">
          <button aria-label="Decrease quantity" class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
          <input aria-label="Quantity for ${item.title}" class="qty-input" type="number" min="1" value="${item.qty}" onchange="setQuantity('${item.id}', this.value)" style="width:56px; text-align:center" />
          <button aria-label="Increase quantity" class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          <div style="margin-left:8px">₹${(item.price*item.qty).toFixed(2)}</div>
        </div>
      </div>
      <div>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </div>`;
    el.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
  renderCartPreview();
  updateCheckoutState();
}

function updateQuantity(id, delta){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = Math.max(0, item.qty + Number(delta));
  if(item.qty === 0){
    const newCart = cart.filter(i=>i.id!==id); saveCart(newCart);
  } else {
    saveCart(cart);
  }
  renderCart();
}

function setQuantity(id, raw){
  let qty = parseInt(raw, 10) || 0;
  qty = Math.max(0, qty);
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  if(qty === 0){
    const newCart = cart.filter(i=>i.id!==id); saveCart(newCart);
  } else {
    item.qty = qty; saveCart(cart);
  }
  renderCart();
}

function updateCheckoutState(){
  const link = document.getElementById('checkout-link');
  const countEl = document.getElementById('cart-count');
  const count = countEl ? parseInt(countEl.textContent) || 0 : 0;
  if(!link) return;
  if(count === 0){
    link.style.backgroundColor = '#6c757d';
    link.style.pointerEvents = 'none';
    link.style.cursor = 'not-allowed';
    link.title = 'Cart is empty';
  } else {
    link.style.backgroundColor = '';
    link.style.pointerEvents = '';
    link.style.cursor = '';
    link.title = '';
  }
}

function renderCartPreview(){
  const el = document.getElementById('cart-count');
  if(!el) return;
  const cart = getCart();
  const qty = cart.reduce((s,i)=>s+i.qty,0);
  el.textContent = qty;
}

// init on pages
document.addEventListener('DOMContentLoaded', ()=>{
  renderCartPreview();
  if(document.getElementById('cart-items')) renderCart();
  // render homepage products if container exists
  if(document.getElementById('homeProducts')) renderHomeProducts();
  // start deals carousel simple rotation
  startDealsCarousel();
  // attach global search if present
  const search = document.getElementById('globalSearch');
  if(search){
    search.addEventListener('input', function(){ renderSearchResults(this.value); });
  }
  // create cart drawer container
  if(!document.getElementById('cart-drawer')){
    const drawer = document.createElement('div'); drawer.id='cart-drawer'; drawer.className='cart-drawer';
    drawer.innerHTML = `
      <div class="header"><strong>Your Cart</strong><button onclick="closeCartDrawer()">Close</button></div>
      <div class="items" id="drawer-items"></div>
      <div class="footer"><div style="display:flex;justify-content:space-between;align-items:center"><strong>Total:</strong><div id="drawer-total">₹0</div></div><div style="margin-top:10px;text-align:right"><a class="primary" href="checkout.html">Checkout</a></div></div>
    `;
    document.body.appendChild(drawer);
    renderCartDrawer();
  }
});

function renderCartDrawer(){
  const itemsEl = document.getElementById('drawer-items'); if(!itemsEl) return;
  const cart = getCart(); itemsEl.innerHTML='';
  if(cart.length===0){ itemsEl.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('drawer-total').textContent='₹0'; return; }
  cart.forEach(it=>{
    const r = document.createElement('div'); r.style.display='flex'; r.style.gap='10px'; r.style.alignItems='center'; r.style.marginBottom='10px';
    r.innerHTML = `<img src="${it.img}" style="width:56px;height:42px;object-fit:cover;border-radius:6px"><div style="flex:1"><div style="font-weight:600">${it.title}</div><div style="font-size:13px">${it.qty} × ₹${it.price}</div></div><div>₹${(it.price*it.qty).toFixed(2)}</div>`;
    itemsEl.appendChild(r);
  });
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0); document.getElementById('drawer-total').textContent = `₹${total.toFixed(2)}`;
}

function openCartDrawer(){ document.getElementById('cart-drawer').classList.add('open'); renderCartDrawer(); }
function closeCartDrawer(){ document.getElementById('cart-drawer').classList.remove('open'); }

function renderSearchResults(q){
  const container = document.getElementById('homeProducts') || document.getElementById('productGrid');
  if(!container) return;
  const term = (q||'').trim().toLowerCase();
  if(!term){ renderHomeProducts(); return; }
  const list = PRODUCT_CATALOG.filter(p=>p.title.toLowerCase().includes(term) || (p.category||'').toLowerCase().includes(term));
  container.innerHTML=''; list.forEach(p=> container.appendChild(createProductCard(p)));
}

// Sample product catalog used on homepage
const PRODUCT_CATALOG = [
  { id:'p1', title:'Smartphone XL', price:15999, img:'https://source.unsplash.com/800x600/?smartphone', category:'electronics', rating:4.5, old:19999 },
  { id:'p2', title:'Wireless Headphones', price:1999, img:'https://source.unsplash.com/800x600/?headphones', category:'audio', rating:4.2, old:2499 },
  { id:'p3', title:'Smart Watch Pro', price:2499, img:'https://source.unsplash.com/800x600/?smartwatch', category:'wearables', rating:4.1, old:3299 },
  { id:'p4', title:'Bluetooth Speaker', price:1299, img:'https://source.unsplash.com/800x600/?speaker', category:'audio', rating:4.3, old:1599 },
  { id:'p5', title:'Running Shoes', price:2999, img:'https://source.unsplash.com/800x600/?shoes', category:'fashion', rating:4.4, old:3999 },
  { id:'p6', title:'Microwave Oven', price:6999, img:'https://source.unsplash.com/800x600/?microwave', category:'home', rating:4.0, old:8999 }
];

function createProductCard(p){
  const div = document.createElement('div'); div.className='card'; div.dataset.id = p.id; div.dataset.category = p.category;
  div.innerHTML = `
    <div style="position:relative;width:100%">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
    </div>
    <div class="title">${p.title}</div>
    <div class="price-row"><div class="price">₹${p.price}</div><div class="old">${p.old? '₹'+p.old : ''}</div></div>
    <div class="rating">${'★'.repeat(Math.round(p.rating))}</div>
    <button onclick="addToCart('${p.id}','${p.title}',${p.price},'${p.img}')">Add to cart</button>
  `;
  return div;
}

function renderHomeProducts(opts){
  const container = document.getElementById('homeProducts'); if(!container) return;
  const search = (document.getElementById('searchBox')||{}).value || '';
  const sort = (document.getElementById('sortSelect')||{}).value || 'popular';
  let list = PRODUCT_CATALOG.slice();
  if(search) list = list.filter(p=>p.title.toLowerCase().includes(search.toLowerCase()));
  if(sort==='price_asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='price_desc') list.sort((a,b)=>b.price-a.price);
  container.innerHTML='';
  list.forEach(p=> container.appendChild(createProductCard(p)));
}

// hook up search/sort on homepage
document.addEventListener('input', function(e){ if(e.target && (e.target.id==='searchBox' || e.target.id==='sortSelect')) renderHomeProducts(); });

// Deals carousel rotation
let _dealIndex = 0;
function startDealsCarousel(){
  const c = document.getElementById('dealsCarousel'); if(!c) return;
  const items = c.querySelectorAll('.deal-item'); if(!items.length) return;
  items.forEach((it,i)=>{ if(i!==0) it.style.display='none'; });
  setInterval(()=>{
    items[_dealIndex].style.display='none';
    _dealIndex = (_dealIndex+1) % items.length;
    items[_dealIndex].style.display='block';
  }, 4000);
}
