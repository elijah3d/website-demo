var NadCart = (function() {
  var STORAGE_KEY = 'nadwismar_cart';

  var products = {
    'dimensions': {
      id: 'dimensions',
      name: 'Book 2 "Dimensions" the series The Glowing Earth',
      price: 10.00,
      image: 'https://nadwismar.com/wp-content/uploads/2026/04/uZPT3lBS7CGD.png',
    },
    'too-good': {
      id: 'too-good',
      name: 'Too Good to Be Bad? Too Bad to Be Good?',
      price: 7.00,
      image: 'https://nadwismar.com/wp-content/uploads/2024/08/Untitled_design__3_-removebg-preview.png',
    },
    'little-star': {
      id: 'little-star',
      name: 'Tell Me More My Little Star',
      price: 3.00,
      image: 'https://nadwismar.com/wp-content/uploads/2024/08/Tell-Me-More-My-Little-Star.png',
    },
    'glowing-earth': {
      id: 'glowing-earth',
      name: 'The Glowing Earth',
      price: 6.00,
      image: 'https://nadwismar.com/wp-content/uploads/2024/08/Untitled_design__4_-removebg-preview.png',
    },
  };

  function getItems() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  }

  function addItem(productId) {
    var items = getItems();
    var existing = items.find(function(i) { return i.id === productId; });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id: productId, qty: 1 });
    }
    saveItems(items);
  }

  function removeItem(productId) {
    var items = getItems().filter(function(i) { return i.id !== productId; });
    saveItems(items);
  }

  function updateQty(productId, qty) {
    var items = getItems();
    var item = items.find(function(i) { return i.id === productId; });
    if (item) {
      item.qty = Math.max(1, qty);
    }
    saveItems(items);
  }

  function getTotal() {
    var total = 0;
    getItems().forEach(function(item) {
      var p = products[item.id];
      if (p) total += p.price * item.qty;
    });
    return total;
  }

  function getCount() {
    var count = 0;
    getItems().forEach(function(i) { count += i.qty; });
    return count;
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateBadge();
  }

  function getProduct(id) { return products[id] || null; }

  function updateBadge() {
    var badges = document.querySelectorAll('.cart-count');
    var count = getCount();
    badges.forEach(function(b) {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    updateBadge();

    document.querySelectorAll('[data-add-cart]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var id = btn.getAttribute('data-add-cart');
        addItem(id);

        var orig = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.pointerEvents = 'none';
        setTimeout(function() {
          btn.textContent = orig;
          btn.style.pointerEvents = '';
        }, 1200);
      });
    });
  });

  return {
    getItems: getItems,
    addItem: addItem,
    removeItem: removeItem,
    updateQty: updateQty,
    getTotal: getTotal,
    getCount: getCount,
    clearCart: clearCart,
    getProduct: getProduct,
    updateBadge: updateBadge,
  };
})();
