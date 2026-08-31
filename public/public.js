const list = document.querySelector('#product-list');
const message = document.querySelector('#public-message');
const updated = document.querySelector('#last-updated');

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) throw new Error('De voorraad kon niet worden geladen.');
    const { products } = await response.json();
    message.textContent = '';
    list.innerHTML = products.length
      ? products.map((product) => `
          <article class="product-card ${product.status === 'Beschikbaar' ? '' : 'unavailable'}">
            <h2>${escapeHtml(product.name)}</h2>
            <div><p class="stock-number">${product.stock}</p><p class="stock-label">op voorraad</p></div>
            <p class="status">${escapeHtml(product.status)}</p>
          </article>`).join('')
      : '<p class="empty-state">Er zijn nog geen producten toegevoegd.</p>';
    updated.textContent = `Bijgewerkt: ${new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' }).format(new Date())}`;
  } catch (error) {
    message.textContent = error.message;
    message.className = 'message error';
    updated.textContent = 'Bijwerken mislukt';
  }
}

loadProducts();
setInterval(loadProducts, 60_000);

