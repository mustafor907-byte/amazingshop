/* BozorGo — umumiy skript: header/footer, savat, saralanganlar, sahifalar */
(function () {
  'use strict';

  /* ---------- Yordamchilar ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage yopiq */ } };
  const byId = id => PRODUCTS.find(p => p.id === Number(id));
  const catOf = id => CATEGORIES.find(c => c.id === id);

  let cart = load('bg_cart', {});   // { id: qty }
  let wish = load('bg_wish', []);   // [id]
  const hooks = {};

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- Savat / saralanganlar ---------- */
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  function updateBadges() {
    const c = $('#cart-count'), w = $('#wish-count');
    if (c) { c.textContent = cartCount(); c.hidden = cartCount() === 0; }
    if (w) { w.textContent = wish.length; w.hidden = wish.length === 0; }
  }
  function addToCart(id, n) {
    const p = byId(id); if (!p) return;
    cart[id] = Math.min((cart[id] || 0) + (n || 1), p.stock);
    save('bg_cart', cart); updateBadges();
    toast('✓ Savatga qo\'shildi: ' + p.name);
    if (hooks.cart) hooks.cart();
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, byId(id).stock);
    save('bg_cart', cart); updateBadges();
    if (hooks.cart) hooks.cart();
  }
  function toggleWish(id) {
    id = Number(id);
    wish = wish.includes(id) ? wish.filter(x => x !== id) : wish.concat(id);
    save('bg_wish', wish); updateBadges();
    toast(wish.includes(id) ? '❤️ Saralanganlarga qo\'shildi' : 'Saralanganlardan olib tashlandi');
    $$('[data-wish="' + id + '"]').forEach(b => b.classList.toggle('on', wish.includes(id)));
    if (hooks.wish) hooks.wish();
  }

  /* ---------- Header / Footer ---------- */
  const user = () => load('bg_user', null);
  function renderChrome() {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const links = [
      ['index.html', 'Bosh sahifa'], ['catalog.html', 'Katalog'],
      ['catalog.html?sale=1', 'Chegirmalar'], ['about.html', 'Biz haqimizda'], ['contact.html', 'Aloqa']
    ];
    const u = user();
    const h = $('#site-header');
    if (h) h.innerHTML = `
      <div class="topbar"><div class="container topbar__in">
        <span>🚚 500 000 so'mdan yuqori buyurtmalarga bepul yetkazib berish</span>
        <span class="hide-sm">📞 +998 71 200 00 00</span>
      </div></div>
      <header class="header"><div class="container header__in">
        <button class="burger" id="burger" aria-label="Menyu" aria-expanded="false"><span></span><span></span><span></span></button>
        <a href="index.html" class="logo">Bozor<b>Go</b></a>
        <form class="search" action="catalog.html" method="get">
          <input name="q" type="search" placeholder="Mahsulot qidirish..." aria-label="Qidirish">
          <button type="submit">Qidirish</button>
        </form>
        <nav class="actions">
          <a href="login.html" class="action"><span>👤</span><small>${u ? esc(u.name.split(' ')[0]) : 'Kirish'}</small></a>
          <a href="wishlist.html" class="action"><span>❤️</span><small>Saralangan</small><i id="wish-count" class="badge" hidden></i></a>
          <a href="cart.html" class="action"><span>🛒</span><small>Savat</small><i id="cart-count" class="badge" hidden></i></a>
        </nav>
        <nav class="menu" id="menu">
          ${links.map(l => `<a href="${l[0]}" class="${(l[0] === file || (file === 'index.html' && l[0] === 'index.html')) && !l[0].includes('?') ? 'active' : ''}">${l[1]}</a>`).join('')}
        </nav>
      </div></header>`;

    const f = $('#site-footer');
    if (f) f.innerHTML = `
      <footer class="footer"><div class="container footer__in">
        <div><a href="index.html" class="logo logo--w">Bozor<b>Go</b></a><p>Qulay va ishonchli onlayn market. Minglab mahsulot, hamyonbop narxlar.</p></div>
        <div><h4>Xaridorlarga</h4><a href="catalog.html">Katalog</a><a href="cart.html">Savat</a><a href="wishlist.html">Saralanganlar</a></div>
        <div><h4>Kompaniya</h4><a href="about.html">Biz haqimizda</a><a href="contact.html">Aloqa</a><a href="login.html">Shaxsiy kabinet</a></div>
        <div><h4>Aloqa</h4><a href="tel:+998712000000">+998 71 200 00 00</a><a href="mailto:info@bozorgo.uz">info@bozorgo.uz</a><span>Toshkent, O'zbekiston</span></div>
      </div><div class="copy">© 2026 BozorGo. Barcha huquqlar himoyalangan.</div></footer>`;

    const b = $('#burger'), m = $('#menu');
    if (b && m) b.addEventListener('click', () => {
      const open = m.classList.toggle('open');
      b.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open);
    });
    updateBadges();
  }

  /* ---------- Mahsulot kartasi ---------- */
  function card(p) {
    const disc = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    return `<article class="card">
      <a href="product.html?id=${p.id}" class="card__img c-${p.cat}" aria-label="${esc(p.name)}">${p.icon}</a>
      ${disc ? `<span class="sale">-${disc}%</span>` : ''}
      <button class="heart ${wish.includes(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Saralanganlarga">♥</button>
      <a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a>
      <div class="rate">★ ${p.rating}</div>
      <div class="price"><b>${fmt(p.price)}</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div>
      <button class="buy" data-add="${p.id}">Savatga</button>
    </article>`;
  }
  const emptyBox = (icon, title, text, btn) => `<div class="empty"><span>${icon}</span><h2>${title}</h2><p>${text}</p>${btn || ''}</div>`;

  /* ---------- Sahifalar ---------- */
  function initHome() {
    $('#cats').innerHTML = CATEGORIES.map(c => `<a href="catalog.html?cat=${c.id}" class="cat"><span>${c.icon}</span>${c.name}</a>`).join('');
    $('#deals').innerHTML = PRODUCTS.filter(p => p.old).slice(0, 4).map(card).join('');
    $('#featured').innerHTML = PRODUCTS.slice(0, 8).map(card).join('');
    const nf = $('#newsForm');
    if (nf) nf.addEventListener('submit', e => { e.preventDefault(); toast("✓ Obuna bo'ldingiz!"); nf.reset(); });
  }

  function initCatalog() {
    const params = new URLSearchParams(location.search);
    const state = { cat: params.get('cat') || 'all', q: (params.get('q') || '').trim(), sort: 'pop', sale: params.get('sale') === '1' };
    if (state.cat !== 'all' && !catOf(state.cat)) state.cat = 'all';
    $('#chips').innerHTML = '<button class="chip" data-cat="all">Barchasi</button>' +
      CATEGORIES.map(c => `<button class="chip" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join('');
    $('#csearch').value = state.q;
    $('#sale').checked = state.sale;

    function draw() {
      let list = PRODUCTS.filter(p =>
        (state.cat === 'all' || p.cat === state.cat) &&
        (!state.sale || p.old) &&
        (!state.q || p.name.toLowerCase().includes(state.q.toLowerCase())));
      const s = state.sort;
      if (s === 'cheap') list.sort((a, b) => a.price - b.price);
      else if (s === 'exp') list.sort((a, b) => b.price - a.price);
      else if (s === 'new') list.sort((a, b) => b.id - a.id);
      else list.sort((a, b) => b.rating - a.rating);
      const c = catOf(state.cat);
      $('#ctitle').textContent = state.q ? `“${state.q}” bo'yicha natijalar` : (state.sale ? 'Chegirmadagi mahsulotlar' : (c ? c.name : 'Barcha mahsulotlar'));
      $('#count').textContent = list.length + ' ta mahsulot';
      $('#list').innerHTML = list.length ? list.map(card).join('')
        : `<div style="grid-column:1/-1">${emptyBox('🔍', 'Hech narsa topilmadi', "Boshqa so'z yoki kategoriyani sinab ko'ring.", '<button class="btn" id="reset">Filtrlarni tozalash</button>')}</div>`;
      $$('.chip').forEach(ch => ch.classList.toggle('active', ch.dataset.cat === state.cat));
    }
    $('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { state.cat = b.dataset.cat; draw(); } });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; draw(); });
    $('#sale').addEventListener('change', e => { state.sale = e.target.checked; draw(); });
    $('#csearch').addEventListener('input', e => { state.q = e.target.value.trim(); draw(); });
    document.addEventListener('click', e => {
      if (e.target.id === 'reset') { state.cat = 'all'; state.q = ''; state.sale = false; $('#csearch').value = ''; $('#sale').checked = false; draw(); }
    });
    hooks.wish = null;
    draw();
  }

  function initProduct() {
    const id = new URLSearchParams(location.search).get('id');
    const p = byId(id);
    const box = $('#pdetail');
    if (!p) { box.innerHTML = emptyBox('😕', 'Mahsulot topilmadi', "Bu mahsulot mavjud emas yoki o'chirilgan.", '<a class="btn" href="catalog.html">Katalogga qaytish</a>'); return; }
    document.title = p.name + ' — BozorGo';
    const c = catOf(p.cat);
    const disc = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    let qty = 1;
    box.innerHTML = `
      <nav class="crumbs"><a href="index.html">Bosh sahifa</a> / <a href="catalog.html?cat=${c.id}">${c.name}</a> / <span>${esc(p.name)}</span></nav>
      <div class="pd">
        <div class="pd__img c-${p.cat}">${p.icon}${disc ? `<span class="sale">-${disc}%</span>` : ''}</div>
        <div class="pd__info">
          <h1>${esc(p.name)}</h1>
          <div class="rate">★ ${p.rating} <span class="muted">· Omborda: ${p.stock} dona</span></div>
          <div class="price big"><b>${fmt(p.price)}</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div>
          <p class="pd__desc">${esc(p.desc)}</p>
          <ul class="specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
          <div class="pd__buy">
            <div class="qty"><button type="button" id="qm" aria-label="Kamaytirish">−</button><span id="qv">1</span><button type="button" id="qp" aria-label="Ko'paytirish">+</button></div>
            <button class="btn" id="addbig">🛒 Savatga qo'shish</button>
            <button class="btn btn--ghost heart-btn ${wish.includes(p.id) ? 'on' : ''}" data-wish="${p.id}">♥ Saralash</button>
          </div>
          <ul class="info-list"><li>🚚 Toshkent bo'ylab 24 soatda yetkazish</li><li>↩️ 14 kun ichida qaytarish</li><li>🔒 Xavfsiz to'lov</li></ul>
        </div>
      </div>`;
    $('#qm').onclick = () => { qty = Math.max(1, qty - 1); $('#qv').textContent = qty; };
    $('#qp').onclick = () => { qty = Math.min(p.stock, qty + 1); $('#qv').textContent = qty; };
    $('#addbig').onclick = () => addToCart(p.id, qty);
    $('#related').innerHTML = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0, 4).map(card).join('');
  }

  function initCart() {
    const promoOk = () => load('bg_promo', '') === 'BOZOR10';
    function draw() {
      const box = $('#cartbox');
      const ids = Object.keys(cart).filter(id => byId(id));
      if (!ids.length) { box.innerHTML = emptyBox('🛒', "Savat bo'sh", "Hali hech narsa qo'shmadingiz. Katalogdan mahsulot tanlang.", '<a class="btn" href="catalog.html">Katalogga o\'tish</a>'); return; }
      let sub = 0;
      const rows = ids.map(id => {
        const p = byId(id), q = cart[id]; sub += p.price * q;
        return `<div class="crow">
          <a href="product.html?id=${p.id}" class="crow__img c-${p.cat}">${p.icon}</a>
          <div class="crow__info"><a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a><span class="muted">${fmt(p.price)} / dona</span></div>
          <div class="qty qty--sm"><button data-dec="${p.id}" aria-label="Kamaytirish">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="Ko'paytirish">+</button></div>
          <b class="crow__sum">${fmt(p.price * q)}</b>
          <button class="crow__del" data-del="${p.id}" aria-label="O'chirish">✕</button>
        </div>`;
      }).join('');
      const disc = promoOk() ? Math.round(sub * 0.1) : 0;
      const delivery = (sub - disc) >= 500000 ? 0 : 25000;
      const total = sub - disc + delivery;
      box.innerHTML = `<div class="cart-layout">
        <div class="cart-list">${rows}<button class="link-btn" id="clear">Savatni tozalash</button></div>
        <aside class="summary">
          <h3>Buyurtma</h3>
          <div class="srow"><span>Mahsulotlar (${cartCount()})</span><b>${fmt(sub)}</b></div>
          ${disc ? `<div class="srow ok"><span>Promokod (-10%)</span><b>-${fmt(disc)}</b></div>` : ''}
          <div class="srow"><span>Yetkazish</span><b>${delivery ? fmt(delivery) : 'Bepul'}</b></div>
          <div class="srow total"><span>Jami</span><b>${fmt(total)}</b></div>
          <form class="promo-form" id="promoForm"><input id="promo" placeholder="Promokod (BOZOR10)" value="${promoOk() ? 'BOZOR10' : ''}"><button class="btn btn--sm" type="submit">OK</button></form>
          <button class="btn btn--block" id="goCheckout">Rasmiylashtirish</button>
        </aside>
      </div>
      <form class="form checkout" id="checkout" hidden>
        <h2>Yetkazib berish ma'lumotlari</h2>
        <div class="form__grid">
          <label class="field"><span>Ism-familiya</span><input name="name" required minlength="3" autocomplete="name"></label>
          <label class="field"><span>Telefon</span><input name="phone" type="tel" required pattern="[+0-9 ()-]{9,}" placeholder="+998 90 123 45 67" autocomplete="tel"></label>
          <label class="field full"><span>Manzil</span><input name="addr" required minlength="5" autocomplete="street-address"></label>
          <label class="field full"><span>To'lov usuli</span>
            <select name="pay"><option>Naqd pul (yetkazilganda)</option><option>Karta orqali (Uzcard / Humo)</option><option>Click / Payme</option></select></label>
        </div>
        <button class="btn btn--block" type="submit">Buyurtmani tasdiqlash — ${fmt(total)}</button>
      </form>`;
    }
    hooks.cart = draw;
    document.addEventListener('click', e => {
      const t = e.target;
      if (t.dataset.inc) setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1);
      else if (t.dataset.dec) setQty(t.dataset.dec, (cart[t.dataset.dec] || 0) - 1);
      else if (t.dataset.del) setQty(t.dataset.del, 0);
      else if (t.id === 'clear') { cart = {}; save('bg_cart', cart); updateBadges(); draw(); }
      else if (t.id === 'goCheckout') { const f = $('#checkout'); f.hidden = false; f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    document.addEventListener('submit', e => {
      if (e.target.id === 'promoForm') {
        e.preventDefault();
        const v = $('#promo').value.trim().toUpperCase();
        if (v === 'BOZOR10') { save('bg_promo', v); toast('✓ Promokod qo\'llandi: -10%'); }
        else { save('bg_promo', ''); toast(v ? "Promokod noto'g'ri" : 'Promokod olib tashlandi'); }
        draw();
      } else if (e.target.id === 'checkout') {
        e.preventDefault();
        const fd = new FormData(e.target);
        const orders = load('bg_orders', []);
        const num = 'BG-' + Date.now().toString().slice(-6);
        orders.push({ num, name: fd.get('name'), items: cart, date: new Date().toISOString() });
        save('bg_orders', orders);
        cart = {}; save('bg_cart', cart); save('bg_promo', ''); updateBadges();
        $('#cartbox').innerHTML = emptyBox('✅', 'Buyurtma qabul qilindi!', `Buyurtma raqami: <b>${num}</b>. Operatorimiz tez orada siz bilan bog'lanadi.`, '<a class="btn" href="index.html">Bosh sahifaga</a>');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    draw();
  }

  function initWish() {
    function draw() {
      const list = PRODUCTS.filter(p => wish.includes(p.id));
      $('#wcount').textContent = list.length + ' ta mahsulot';
      $('#wlist').innerHTML = list.length ? list.map(card).join('')
        : `<div style="grid-column:1/-1">${emptyBox('💔', "Saralanganlar bo'sh", "Yoqqan mahsulotlardagi ♥ tugmasini bosing.", '<a class="btn" href="catalog.html">Katalogga o\'tish</a>')}</div>`;
    }
    hooks.wish = draw; draw();
  }

  function initLogin() {
    const box = $('#authbox');
    const users = () => load('bg_users', []);
    // DEMO: haqiqiy saytda autentifikatsiya serverda bo'lishi shart. Bu yerda parol faqat brauzerda saqlanadi.
    const enc = s => btoa(unescape(encodeURIComponent(s)));
    function show() {
      const u = user();
      if (u) {
        const orders = load('bg_orders', []).length;
        box.innerHTML = `<div class="profile"><div class="avatar">${esc(u.name.charAt(0).toUpperCase())}</div>
          <h2>${esc(u.name)}</h2><p class="muted">${esc(u.email)}</p>
          <div class="stats"><div><b>${orders}</b><span>Buyurtma</span></div><div><b>${wish.length}</b><span>Saralangan</span></div><div><b>${cartCount()}</b><span>Savatda</span></div></div>
          <a class="btn btn--block" href="catalog.html">Xarid qilish</a>
          <button class="btn btn--ghost btn--block" id="logout">Chiqish</button></div>`;
        $('#logout').onclick = () => { localStorage.removeItem('bg_user'); toast('Hisobdan chiqdingiz'); renderChrome(); show(); };
        return;
      }
      box.innerHTML = `<div class="tabs"><button class="tab active" data-t="in">Kirish</button><button class="tab" data-t="up">Ro'yxatdan o'tish</button></div>
        <form class="form" id="fin">
          <label class="field"><span>Email</span><input name="email" type="email" required autocomplete="email"></label>
          <label class="field"><span>Parol</span><input name="pass" type="password" required minlength="6" autocomplete="current-password"></label>
          <button class="btn btn--block" type="submit">Kirish</button>
        </form>
        <form class="form" id="fup" hidden>
          <label class="field"><span>Ism-familiya</span><input name="name" required minlength="3" autocomplete="name"></label>
          <label class="field"><span>Email</span><input name="email" type="email" required autocomplete="email"></label>
          <label class="field"><span>Parol (kamida 6 belgi)</span><input name="pass" type="password" required minlength="6" autocomplete="new-password"></label>
          <button class="btn btn--block" type="submit">Ro'yxatdan o'tish</button>
        </form>
        <p class="msg" id="msg" role="alert"></p>`;
      $$('.tab', box).forEach(t => t.onclick = () => {
        $$('.tab', box).forEach(x => x.classList.toggle('active', x === t));
        $('#fin').hidden = t.dataset.t !== 'in'; $('#fup').hidden = t.dataset.t !== 'up'; $('#msg').textContent = '';
      });
      $('#fin').onsubmit = e => {
        e.preventDefault();
        const f = new FormData(e.target), email = f.get('email').toLowerCase();
        const u = users().find(x => x.email === email && x.pass === enc(f.get('pass')));
        if (!u) { $('#msg').textContent = "Email yoki parol noto'g'ri"; return; }
        save('bg_user', { name: u.name, email: u.email }); toast('Xush kelibsiz, ' + u.name + '!'); renderChrome(); show();
      };
      $('#fup').onsubmit = e => {
        e.preventDefault();
        const f = new FormData(e.target), email = f.get('email').toLowerCase();
        if (users().some(x => x.email === email)) { $('#msg').textContent = "Bu email allaqachon ro'yxatdan o'tgan"; return; }
        const list = users(); list.push({ name: f.get('name'), email, pass: enc(f.get('pass')) }); save('bg_users', list);
        save('bg_user', { name: f.get('name'), email }); toast("✓ Ro'yxatdan o'tdingiz!"); renderChrome(); show();
      };
    }
    show();
  }

  function initContact() {
    const f = $('#contactForm');
    f.addEventListener('submit', e => { e.preventDefault(); toast('✓ Xabaringiz yuborildi. Tez orada javob beramiz!'); f.reset(); });
  }

  /* ---------- Global hodisalar ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { addToCart(a.dataset.add, 1); return; }
    const w = e.target.closest('[data-wish]');
    if (w) toggleWish(w.dataset.wish);
  });

  /* ---------- Ishga tushirish ---------- */
  function boot() {
    renderChrome();
    const init = { home: initHome, catalog: initCatalog, product: initProduct, cart: initCart, wishlist: initWish, login: initLogin, contact: initContact }[document.body.dataset.page];
    if (init) init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
