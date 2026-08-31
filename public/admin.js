const loginSection = document.querySelector('#login-section');
const managementSection = document.querySelector('#management-section');
const message = document.querySelector('#message');
const productList = document.querySelector('#admin-product-list');

function showMessage(text = '', error = false) {
  message.textContent = text;
  message.className = `message${error ? ' error' : ''}`;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({ error: 'Ongeldig antwoord van de server.' }));
  if (!response.ok) {
    const error = new Error(data.error || 'Er ging iets mis.');
    error.status = response.status;
    throw error;
  }
  return data;
}

function setLoggedIn(user) {
  loginSection.hidden = true;
  managementSection.hidden = false;
  document.querySelector('#current-user').textContent = user.username;
}

function setLoggedOut() {
  loginSection.hidden = false;
  managementSection.hidden = true;
  productList.innerHTML = '';
}

function productCard(product) {
  const card = document.createElement('article');
  card.className = 'admin-product';
  card.dataset.productId = product.id;

  const summary = document.createElement('div');
  summary.className = 'product-summary';
  const titleGroup = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = product.name;
  const stock = document.createElement('p');
  stock.innerHTML = `Voorraad: <strong>${product.stock}</strong>`;
  titleGroup.append(title, stock);
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = product.status;
  summary.append(titleGroup, badge);

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = `
    <button type="button" class="secondary" data-action="decrease" data-amount="1">− 1</button>
    <button type="button" class="secondary" data-action="increase" data-amount="1">+ 1</button>
    <button type="button" class="secondary" data-action="increase" data-amount="10">+ 10</button>
    <button type="button" class="${product.available ? 'danger' : 'primary'}" data-action="availability" data-available="${!product.available}">${product.available ? 'Niet beschikbaar' : 'Beschikbaar'}</button>`;

  const setForm = document.createElement('form');
  setForm.className = 'set-stock-form';
  setForm.innerHTML = `
    <label class="sr-only" for="set-${product.id}">Voorraad direct instellen voor ${product.name}</label>
    <input id="set-${product.id}" name="stock" type="number" min="0" max="1000000" step="1" value="${product.stock}" required>
    <button type="submit" class="primary">Instellen</button>`;

  card.append(summary, controls, setForm);
  return card;
}

async function loadProducts() {
  try {
    const { products } = await api('/api/products');
    productList.replaceChildren(...products.map(productCard));
    if (!products.length) productList.textContent = 'Er zijn nog geen producten.';
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function changeStock(id, operation, amount) {
  await api(`/api/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ operation, amount }) });
  await loadProducts();
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) });
    setLoggedIn(data.user);
    event.currentTarget.reset();
    showMessage('Je bent ingelogd.');
    await loadProducts();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  try {
    await api('/api/auth/logout', { method: 'POST' });
    setLoggedOut();
    showMessage('Je bent uitgelogd.');
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.querySelector('#add-product-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await api('/api/products', { method: 'POST', body: JSON.stringify({ name: form.get('name'), stock: Number(form.get('stock')), available: true }) });
    event.currentTarget.reset();
    document.querySelector('#initial-stock').value = '0';
    showMessage('Product toegevoegd.');
    await loadProducts();
  } catch (error) {
    showMessage(error.message, true);
  }
});

productList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.closest('.admin-product').dataset.productId);
  button.disabled = true;
  try {
    if (button.dataset.action === 'availability') {
      await api(`/api/products/${id}/availability`, { method: 'PATCH', body: JSON.stringify({ available: button.dataset.available === 'true' }) });
      showMessage('Beschikbaarheid aangepast.');
      await loadProducts();
    } else {
      await changeStock(id, button.dataset.action, Number(button.dataset.amount));
      showMessage('Voorraad aangepast.');
    }
  } catch (error) {
    showMessage(error.message, true);
    button.disabled = false;
  }
});

productList.addEventListener('submit', async (event) => {
  if (!event.target.matches('.set-stock-form')) return;
  event.preventDefault();
  const id = Number(event.target.closest('.admin-product').dataset.productId);
  const amount = Number(new FormData(event.target).get('stock'));
  try {
    await changeStock(id, 'set', amount);
    showMessage('Voorraad ingesteld.');
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.querySelector('#refresh-button').addEventListener('click', loadProducts);

api('/api/auth/status')
  .then(({ user }) => { setLoggedIn(user); return loadProducts(); })
  .catch(() => setLoggedOut());
