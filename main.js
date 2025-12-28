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
  if(cart.length===0){ el.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent='₹0'; return; }
  cart.forEach(item=>{
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div style="flex:1">
        <div style="font-weight:600">${item.title}</div>
        <div>Qty: ${item.qty} • ₹${(item.price*item.qty).toFixed(2)}</div>
      </div>
      <div>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </div>`;
    el.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
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
});

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
