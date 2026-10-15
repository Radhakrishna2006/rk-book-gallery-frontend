import { sampleBooks, categories, userData, sampleOrders } from './data.js';
import { api } from './api.js';
import { BOOK_COVER_FALLBACK_URL } from './config.js';

const app = document.getElementById('app');
let activeView = 'home';
let activeViewParams = {};

const state = {
  user: null,
  cart: [],
  books: sampleBooks,
  selectedCategory: 'All',
  currentPage: 1,
  searchKeyword: '',
  orders: sampleOrders,
};

const menuItems = [
  { label: 'Home', href: '#home' },
  { label: 'Books', href: '#books' },
  { label: 'Categories', href: '#categories' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const categoryIcons = {
  Stories: '📖',
  Comics: '🦸',
  Biographies: '👤',
  Novels: '📚',
  'Educational Books': '🎓',
  'Self-Help Books': '💡',
  Fiction: '✨',
};

const currency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

function getBookById(id) {
  return state.books.find((book) => Number(book.id) === Number(id));
}

function formatRating(rating) {
  return `${rating.toFixed(1)} ★`;
}

function setActiveView(view, params = {}) {
  const routes = {
    home: renderHome,
    books: renderBooksPage,
    details: renderBookDetail,
    register: renderRegisterPage,
    login: renderLoginPage,
    cart: renderCartPage,
    checkout: renderCheckoutPage,
    confirmation: renderConfirmationPage,
    profile: renderProfilePage,
    admin: renderAdminDashboard,
  };

  if (routes[view]) {
    activeView = view;
    activeViewParams = params;
    routes[view](params);
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll("'", '&#39;');
}

function renderBookImage(book) {
  const imageUrl = typeof book.imageUrl === 'string' && book.imageUrl.trim()
    ? book.imageUrl.trim()
    : BOOK_COVER_FALLBACK_URL;

  return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(book.title || 'Book cover')}" onerror="this.onerror=null;this.src='${BOOK_COVER_FALLBACK_URL}'" />`;
}

function setState(partial) {
  Object.assign(state, partial);
}

function setAuthenticatedUser(authResponse) {
  if (!authResponse?.token || !authResponse.user) {
    throw new TypeError('The authentication API response is missing its token or user.');
  }

  api.setAuthToken(authResponse.token);
  setState({
    user: {
      ...authResponse.user,
      role: String(authResponse.user.role || '').replace(/^ROLE_/, ''),
    },
  });
}

function buildNavbar() {
  const currentUser = state.user || null;
  const admin = currentUser && currentUser.role === 'ADMIN';

  return `
    <div class="topbar">
      <div class="container">
        <span>Free shipping above ₹799 • Secure payment • Fast delivery</span>
        <span>Call us: +91 98765 43210</span>
      </div>
    </div>
    <header class="navbar">
      <div class="container navbar-inner">
        <a class="logo" href="#" data-link="home">RK<span>’</span>s Book Gallery</a>

        <nav class="nav-links" aria-label="Main navigation">
          ${menuItems.map((item) => `<a href="${item.href}" data-link="${item.label.toLowerCase() === 'home' ? 'home' : item.label.toLowerCase() === 'books' ? 'books' : item.label.toLowerCase() === 'categories' ? 'categories' : item.label.toLowerCase() === 'about' ? 'about' : 'contact'}">${item.label}</a>`).join('')}
          ${admin ? '<a href="#" data-link="admin">Admin Dashboard</a>' : ''}
        </nav>

        <div class="nav-actions">
          <div class="search-box">
            <span>🔍</span>
            <input type="search" id="global-search" placeholder="Search books, authors..." />
          </div>
          <button type="button" class="icon-btn" data-link="cart" aria-label="Cart">
            🛒
            <span class="badge-count">${state.cart.length}</span>
          </button>

          ${currentUser ? `
            <div class="profile-menu">
              <button type="button" class="profile-btn" id="profileToggle">
                <span>👤</span>
                <span>${currentUser.name.split(' ')[0]}</span>
              </button>
              <div class="user-dropdown">
                <a href="#" data-link="profile">Profile</a>
                <a href="#" data-link="orders">My Orders</a>
                <button type="button" id="logoutBtn">Logout</button>
              </div>
            </div>
          ` : `
            <a href="#" class="auth-link" data-link="login">Login / Register</a>
          `}
        </div>
      </div>
    </header>
  `;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3 class="logo" style="color: white;">RK<span>’</span>s Book Gallery</h3>
            <p style="margin-top: 12px;">Your gateway to stories, knowledge and imagination.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul class="footer-links">
              <li><a href="#" data-link="home">Home</a></li>
              <li><a href="#" data-link="books">Books</a></li>
              <li><a href="#" data-link="books">Categories</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul class="footer-links">
              <li><a href="#" data-link="about">About</a></li>
              <li><a href="#" data-link="contact">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul class="footer-links">
              <li>+91 98765 43210</li>
              <li>hello@rkbookgallery.com</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-note">© 2026 RK’s Book Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

function homeCategoryCards() {
  return categories.map((category) => `
    <a href="#" class="category-card" data-category="${category}" data-link="books">
      <div class="category-icon">${categoryIcons[category] || '📘'}</div>
      <h3>${category}</h3>
      <p>Discover curated reads</p>
    </a>
  `).join('');
}

function renderHome() {
  const featuredBooks = state.books.slice(0, 8);

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="badge">Curated stories for curious minds</span>
            <h1>Discover Your Next Great Read</h1>
            <p>Explore thousands of stories, ideas and knowledge at RK’s Book Gallery.</p>
            <div class="hero-actions">
              <button type="button" class="primary-btn" data-link="books">Explore Books</button>
              <button type="button" class="secondary-btn" data-link="books">Browse Categories</button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="book-stack">
              <div class="book"><span>FIC</span></div>
              <div class="book"><span>SCI</span></div>
              <div class="book"><span>NOV</span></div>
            </div>
            <div class="stat-pill p1"><strong>18K+</strong><span>books sold</span></div>
            <div class="stat-pill p2"><strong>4.9/5</strong><span>reader rating</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge">Featured Categories</span>
              <h2>Explore by interest</h2>
            </div>
          </div>
          <div class="category-grid">
            ${homeCategoryCards()}
          </div>
        </div>
      </section>

      <section class="section" style="background: white;">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge">Popular Picks</span>
              <h2>Featured Books</h2>
            </div>
            <button type="button" class="ghost-btn" data-link="books">View all books</button>
          </div>
          <div class="product-grid">
            ${featuredBooks.map(renderBookCard).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge">Why choose us</span>
              <h2>Everything your reading habit deserves</h2>
            </div>
          </div>
          <div class="feature-card-grid">
            ${[
              ['📚', 'Wide Collection', 'From timeless classics to new bestsellers, we curate every shelf with care.'],
              ['💸', 'Affordable Prices', 'Enjoy competitive pricing and regular deals designed for avid readers.'],
              ['🔒', 'Secure Shopping', 'Your checkout is protected with trusted and seamless online purchasing.'],
              ['🚚', 'Fast Order Processing', 'Quick dispatch and hassle-free delivery keep your reading journey moving.'],
            ].map(([icon, title, desc]) => `
              <article class="feature-card">
                <div class="feature-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${desc}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderBookCard(book) {
  return `
    <article class="product-card">
      <div class="product-image">
        ${renderBookImage(book)}
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span>${book.category}</span>
          <span>${book.stock > 0 ? 'In stock' : 'Sold out'}</span>
        </div>
        <h3>${book.title}</h3>
        <div class="product-author">by ${book.author}</div>
        <div class="product-rating">⭐ ${formatRating(book.rating)}</div>
        <div class="product-footer">
          <div class="price">${currency(book.price)}</div>
        </div>
        <div class="product-actions">
          <button type="button" class="primary-btn" data-action="add-to-cart" data-book-id="${book.id}">Add to Cart</button>
          <button type="button" class="ghost-btn" data-action="view-details" data-book-id="${book.id}">View Details</button>
        </div>
      </div>
    </article>
  `;
}

function renderBooksPage() {
  const filtered = getFilteredBooks();

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>Books</h1>
          <p>Browse bestsellers, academic reads, stories, and more from every shelf.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="toolbar">
            <div class="filter-group" style="flex:1; min-width: 260px;">
              <label>
                Search
                <input id="bookSearchInput" type="text" value="${state.searchKeyword}" placeholder="Title, author or category" />
              </label>
            </div>
            <div class="filter-group">
              <label>
                Category
                <select id="categoryFilter">
                  <option value="All">All</option>
                  ${categories.map((category) => `<option value="${category}" ${state.selectedCategory === category ? 'selected' : ''}>${category}</option>`).join('')}
                </select>
              </label>
              <label>
                Price
                <select id="priceFilter">
                  <option value="all">Any</option>
                  <option value="low-400">Under ₹400</option>
                  <option value="400-600">₹400 – ₹600</option>
                  <option value="600-plus">₹600+</option>
                </select>
              </label>
              <label>
                Rating
                <select id="ratingFilter">
                  <option value="0">Any</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </label>
              <label>
                Sort by
                <select id="sortFilter">
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
          </div>

          <div class="product-grid">
            ${filtered.length ? filtered.map(renderBookCard).join('') : '<div class="empty-state" style="grid-column: 1 / -1;">No books match your filters.</div>'}
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
  bindBooksPageControls();
}

function getFilteredBooks() {
  let list = [...state.books];

  if (state.searchKeyword) {
    const keyword = state.searchKeyword.toLowerCase();
    list = list.filter((book) =>
      [book.title, book.author, book.category].some((field) => field.toLowerCase().includes(keyword))
    );
  }

  if (state.selectedCategory && state.selectedCategory !== 'All') {
    list = list.filter((book) => book.category === state.selectedCategory);
  }

  const priceFilter = document.getElementById('priceFilter')?.value;
  if (priceFilter && priceFilter !== 'all') {
    list = list.filter((book) => {
      if (priceFilter === 'low-400') return book.price < 400;
      if (priceFilter === '400-600') return book.price >= 400 && book.price <= 600;
      if (priceFilter === '600-plus') return book.price > 600;
      return true;
    });
  }

  const ratingFilter = document.getElementById('ratingFilter')?.value;
  if (ratingFilter && Number(ratingFilter) > 0) {
    list = list.filter((book) => book.rating >= Number(ratingFilter));
  }

  const sortValue = document.getElementById('sortFilter')?.value;
  if (sortValue === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sortValue === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sortValue === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (sortValue === 'name') list.sort((a, b) => a.title.localeCompare(b.title));

  return list;
}

function renderBookDetail(bookId) {
  const book = getBookById(bookId);
  if (!book) {
    renderError('Book not found');
    return;
  }

  const related = state.books.filter((item) => item.category === book.category && item.id !== book.id).slice(0, 3);

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>${book.title}</h1>
          <p>${book.category} • by ${book.author}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="book-detail-wrap">
            <div class="book-gallery">
              ${renderBookImage(book)}
            </div>
            <div>
              <span class="badge">${book.category}</span>
              <h2 style="margin: 16px 0 8px; font-size: clamp(2rem, 3vw, 3rem);">${book.title}</h2>
              <p style="color: var(--muted); font-size: 1.05rem;">by ${book.author}</p>
              <div class="product-rating" style="margin-top: 14px;">⭐ ${formatRating(book.rating)} • ${book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</div>
              <div class="price" style="margin: 18px 0; font-size: 2.3rem;">${currency(book.price)}</div>
              <p>${book.description}</p>

              <div class="detail-actions">
                <div class="qty-box">
                  <button type="button" data-action="qty-minus" data-book-id="${book.id}">−</button>
                  <span id="detailQty">1</span>
                  <button type="button" data-action="qty-plus" data-book-id="${book.id}">+</button>
                </div>
                <button type="button" class="primary-btn" data-action="add-to-cart" data-book-id="${book.id}">Add to Cart</button>
                <button type="button" class="secondary-btn" data-action="buy-now" data-book-id="${book.id}">Buy Now</button>
              </div>

              <div class="info-list">
                <div class="info-item"><span>ISBN</span><strong>${book.isbn}</strong></div>
                <div class="info-item"><span>Author</span><strong>${book.author}</strong></div>
                <div class="info-item"><span>Publisher</span><strong>${book.publisher}</strong></div>
                <div class="info-item"><span>Publication Year</span><strong>${book.publicationYear}</strong></div>
                <div class="info-item"><span>Category</span><strong>${book.category}</strong></div>
                <div class="info-item"><span>Pages</span><strong>${book.pages}</strong></div>
              </div>
            </div>
          </div>

          <div style="margin-top: 48px;">
            <div class="section-header">
              <div>
                <span class="badge">You may also like</span>
                <h2>Related Books</h2>
              </div>
            </div>
            <div class="product-grid">
              ${related.map(renderBookCard).join('')}
            </div>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderRegisterPage() {
  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="section">
        <div class="container" style="max-width: 760px;">
          <div class="form-wrap">
            <div class="section-header" style="display: block; margin-bottom: 22px;">
              <span class="badge">Create account</span>
              <h2 style="margin-top: 14px;">Register</h2>
            </div>
            <form id="registerForm">
              <div class="form-grid">
                <div class="form-field">
                  <label for="fullName">Full Name</label>
                  <input id="fullName" class="form-control" type="text" placeholder="Enter your full name" required />
                </div>
                <div class="form-field">
                  <label for="phone">Phone Number</label>
                  <input id="phone" class="form-control" type="tel" placeholder="Enter phone number" required />
                </div>
                <div class="form-field full">
                  <label for="email">Email</label>
                  <input id="email" class="form-control" type="email" placeholder="you@example.com" required />
                </div>
                <div class="form-field">
                  <label for="password">Password</label>
                  <input id="password" class="form-control" type="password" placeholder="Minimum 6 characters" required />
                </div>
                <div class="form-field">
                  <label for="confirmPassword">Confirm Password</label>
                  <input id="confirmPassword" class="form-control" type="password" placeholder="Confirm password" required />
                </div>
              </div>
              <div class="detail-actions" style="margin-top: 24px;">
                <button type="submit" class="primary-btn">Register</button>
                <button type="button" class="ghost-btn" data-link="login">Already have an account?</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !phone || !email || !password || !confirmPassword) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    try {
      const authResponse = await api.registerUser({ name: fullName, phone, email, password });
      setAuthenticatedUser(authResponse);
      showToast('Registration successful.');
      setTimeout(() => setActiveView('home'), 700);
    } catch (error) {
      showToast(error.message || 'Registration failed. Please try again.');
    }
  });
}

function renderLoginPage() {
  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="section">
        <div class="container" style="max-width: 620px;">
          <div class="form-wrap">
            <div class="section-header" style="display: block; margin-bottom: 22px;">
              <span class="badge">Welcome back</span>
              <h2 style="margin-top: 14px;">Login</h2>
            </div>
            <form id="loginForm">
              <div class="form-row">
                <div class="form-field">
                  <label for="loginEmail">Email</label>
                  <input id="loginEmail" class="form-control" type="email" required />
                </div>
                <div class="form-field">
                  <label for="loginPassword">Password</label>
                  <input id="loginPassword" class="form-control" type="password" required />
                </div>
                <div class="inline-switch">
                  <label>Remember Me</label>
                  <input type="checkbox" checked />
                </div>
              </div>
              <div class="detail-actions" style="margin-top: 18px; justify-content: space-between;">
                <button type="submit" class="primary-btn">Login</button>
                <a href="#" class="ghost-btn" data-link="register">Create Account</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('Please enter your email and password.');
      return;
    }

    try {
      const authResponse = await api.loginUser({ email, password });
      setAuthenticatedUser(authResponse);
      showToast('Login successful.');
      const destination = state.user.role === 'ADMIN' ? 'admin' : 'home';
      setTimeout(
        () => setActiveView(destination),
        700,
      );
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.');
    }
  });
}

function renderCartPage() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const discount = 0;
  const delivery = subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery - discount;

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>Your Cart</h1>
          <p>Review your selected books and proceed to checkout.</p>
        </div>
      </section>
      <section class="section">
        <div class="container cart-layout">
          <div>
            ${state.cart.length ? state.cart.map((entry) => `
              <div class="cart-item">
                ${renderBookImage(entry.book)}
                <div>
                  <h3>${entry.book.title}</h3>
                  <div class="meta">by ${entry.book.author}</div>
                  <div class="meta" style="margin-top: 8px;">${currency(entry.book.price)} each</div>
                </div>
                <div class="qty-box">
                  <button type="button" data-action="decrement-cart" data-book-id="${entry.book.id}">−</button>
                  <span>${entry.quantity}</span>
                  <button type="button" data-action="increment-cart" data-book-id="${entry.book.id}">+</button>
                </div>
                <div style="text-align: right;">
                  <div class="price" style="font-size: 1.3rem;">${currency(entry.book.price * entry.quantity)}</div>
                  <button type="button" class="danger-btn small-btn" data-action="remove-cart-item" data-book-id="${entry.book.id}" style="margin-top: 10px;">Remove</button>
                </div>
              </div>
            `).join('') : '<div class="empty-state">Your cart is empty. Add a few favorite books to get started.</div>'}
          </div>

          <aside class="summary-box">
            <h3>Order Summary</h3>
            <div class="summary-line" style="margin-top: 18px;"><span>Subtotal</span><strong>${currency(subtotal)}</strong></div>
            <div class="summary-line"><span>Discount</span><strong>${currency(discount)}</strong></div>
            <div class="summary-line"><span>Delivery charge</span><strong>${currency(delivery)}</strong></div>
            <div class="summary-total summary-line"><span>Total</span><strong>${currency(total)}</strong></div>
            <button type="button" class="primary-btn" style="width: 100%; margin-top: 18px;" data-link="checkout">Proceed to Checkout</button>
            <button type="button" class="ghost-btn" style="width: 100%; margin-top: 12px;" data-action="clear-cart">Clear cart</button>
          </aside>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderCheckoutPage() {
  if (!state.user) {
    renderError('Unauthorized access');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery;

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>Checkout</h1>
          <p>Complete your order with secure checkout details.</p>
        </div>
      </section>
      <section class="section">
        <div class="container checkout-layout">
          <div class="form-wrap">
            <h3 style="margin-bottom: 18px;">Customer Details</h3>
            <form id="checkoutForm">
              <div class="form-grid">
                <div class="form-field">
                  <label>Full Name</label>
                  <input class="form-control" value="${state.user.name}" required />
                </div>
                <div class="form-field">
                  <label>Email</label>
                  <input class="form-control" type="email" value="${state.user.email}" required />
                </div>
                <div class="form-field">
                  <label>Phone</label>
                  <input class="form-control" value="${state.user.phone || '+91 98765 43210'}" required />
                </div>
                <div class="form-field full">
                  <label>Address</label>
                  <input class="form-control" placeholder="House number, street, landmark" required />
                </div>
                <div class="form-field">
                  <label>City</label>
                  <input class="form-control" placeholder="City" required />
                </div>
                <div class="form-field">
                  <label>State</label>
                  <input class="form-control" placeholder="State" required />
                </div>
                <div class="form-field">
                  <label>Pincode</label>
                  <input class="form-control" placeholder="Pincode" required />
                </div>
              </div>

              <h3 style="margin: 28px 0 14px;">Payment Method</h3>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" name="payment" value="Cash on Delivery" checked /> Cash on Delivery</label>
                <label class="radio-item"><input type="radio" name="payment" value="Online Payment" /> Online Payment</label>
              </div>

              <button type="submit" class="primary-btn" style="margin-top: 24px; width: 100%;">Place Order</button>
            </form>
          </div>

          <aside class="summary-box">
            <h3>Order Summary</h3>
            <div style="margin-top:16px;">
              ${state.cart.map((item) => `
                <div class="summary-line">
                  <span>${item.book.title} x ${item.quantity}</span>
                  <strong>${currency(item.book.price * item.quantity)}</strong>
                </div>
              `).join('')}
            </div>
            <div class="summary-total summary-line"><span>Subtotal</span><strong>${currency(subtotal)}</strong></div>
            <div class="summary-line"><span>Delivery</span><strong>${currency(delivery)}</strong></div>
            <div class="summary-total summary-line"><span>Total</span><strong>${currency(total)}</strong></div>
          </aside>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
  document.getElementById('checkoutForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!state.cart.length) {
      showToast('Your cart is empty.');
      return;
    }

    const orderId = `RK${Date.now().toString().slice(-6)}`;
    const total = state.cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0) + 49;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'Cash on Delivery';

    state.orders.unshift({
      id: `#${orderId}`,
      customer: state.user.name,
      date: new Date().toISOString().slice(0, 10),
      total,
      paymentMethod,
      status: 'Pending',
    });

    state.cart = [];
    showToast('Order placed successfully!');
    setTimeout(() => setActiveView('confirmation', { orderId: `#${orderId}`, total, paymentMethod }), 800);
  });
}

function renderConfirmationPage({ orderId = '#RK0000', total = 0, paymentMethod = 'Cash on Delivery' } = {}) {
  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="section">
        <div class="container">
          <div class="confirmation-box">
            <div class="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p style="color: var(--muted); margin: 12px 0 20px;">Thank you for shopping with RK’s Book Gallery.</p>
            <div class="info-list" style="text-align: left;">
              <div class="info-item"><span>Order ID</span><strong>${orderId}</strong></div>
              <div class="info-item"><span>Order Date</span><strong>${new Date().toLocaleDateString()}</strong></div>
              <div class="info-item"><span>Customer</span><strong>${state.user ? state.user.name : 'Guest Customer'}</strong></div>
              <div class="info-item"><span>Total Amount</span><strong>${currency(total)}</strong></div>
              <div class="info-item"><span>Payment Method</span><strong>${paymentMethod}</strong></div>
              <div class="info-item"><span>Order Status</span><strong>Pending</strong></div>
            </div>
            <button type="button" class="primary-btn" style="margin-top: 24px;" data-link="home">Continue Shopping</button>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderProfilePage() {
  if (!state.user) {
    renderError('User not found');
    return;
  }

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>My Profile</h1>
          <p>Manage your account info and order history.</p>
        </div>
      </section>
      <section class="section">
        <div class="container profile-layout">
          <div class="form-wrap">
            <h3>Personal Information</h3>
            <div class="info-list" style="margin-top: 16px;">
              <div class="info-item"><span>Name</span><strong>${state.user.name}</strong></div>
              <div class="info-item"><span>Email</span><strong>${state.user.email}</strong></div>
              <div class="info-item"><span>Phone</span><strong>${state.user.phone}</strong></div>
              <div class="info-item"><span>Role</span><strong>${state.user.role || 'USER'}</strong></div>
            </div>

            <h3 style="margin-top: 30px;">Address</h3>
            <div class="info-list" style="margin-top: 16px;">
              <div class="info-item full"><span>Address</span><strong>25 Market Lane, Banjara Hills</strong></div>
              <div class="info-item"><span>City</span><strong>Hyderabad</strong></div>
              <div class="info-item"><span>State</span><strong>Telangana</strong></div>
              <div class="info-item"><span>Pincode</span><strong>500034</strong></div>
            </div>
          </div>

          <aside class="summary-box">
            <h3>My Orders</h3>
            <div style="margin-top:18px;">
              ${state.orders.map((order) => `
                <div style="padding: 12px 0; border-bottom: 1px solid var(--border);">
                  <strong>${order.id}</strong>
                  <div class="meta">${order.date}</div>
                  <div class="meta">${currency(order.total)} • ${order.status}</div>
                </div>
              `).join('')}
            </div>
          </aside>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderAdminDashboard() {
  const totalBooks = state.books.length;
  const totalUsers = userData.length;
  const totalOrders = state.orders.length;
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);

  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="page-banner">
        <div class="container">
          <h1>Admin Dashboard</h1>
          <p>Manage books, users, orders, and revenue summaries.</p>
        </div>
      </section>

      <section class="section">
        <div class="container dashboard-layout">
          <div class="dashboard-grid" style="grid-template-columns: repeat(2,minmax(0,1fr)); grid-column: 1 / -1;">
            <div class="stat-card" style="padding: 24px;">
              <p>Total Books</p>
              <h3>${totalBooks}</h3>
            </div>
            <div class="stat-card" style="padding: 24px;">
              <p>Total Users</p>
              <h3>${totalUsers}</h3>
            </div>
            <div class="stat-card" style="padding: 24px;">
              <p>Total Orders</p>
              <h3>${totalOrders}</h3>
            </div>
            <div class="stat-card" style="padding: 24px;">
              <p>Total Revenue</p>
              <h3>${currency(totalRevenue)}</h3>
            </div>
          </div>

          <div class="panel" style="padding: 24px;">
            <h3>Recent Orders</h3>
            <div class="table-wrap" style="margin-top: 18px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.orders.map((order) => `
                    <tr>
                      <td>${order.id}</td>
                      <td>${order.customer}</td>
                      <td>${currency(order.total)}</td>
                      <td><span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="panel" style="padding: 24px;">
            <h3>Manage Books</h3>
            <div class="table-wrap" style="margin-top: 18px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.books.map((book) => `
                    <tr>
                      <td>${book.id}</td>
                      <td>${book.title}</td>
                      <td>${book.author}</td>
                      <td>${currency(book.price)}</td>
                      <td>${book.stock}</td>
                      <td><button type="button" class="small-btn ghost-btn" data-action="admin-delete-book" data-book-id="${book.id}">Delete</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;

  bindGlobalInteractions();
}

function renderError(message) {
  app.innerHTML = `
    ${buildNavbar()}
    <main>
      <section class="section">
        <div class="container" style="max-width: 600px;">
          <div class="empty-state">
            <h2>Oops!</h2>
            <p style="margin-top: 10px; font-size: 1.05rem;">${message}</p>
            <button type="button" class="primary-btn" style="margin-top: 18px;" data-link="home">Back to Home</button>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  `;
  bindGlobalInteractions();
}

function bindBooksPageControls() {
  const searchInput = document.getElementById('bookSearchInput');
  const categorySelect = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const ratingFilter = document.getElementById('ratingFilter');
  const sortFilter = document.getElementById('sortFilter');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      setState({ searchKeyword: e.target.value });
      renderBooksPage();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      setState({ selectedCategory: e.target.value });
      renderBooksPage();
    });
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', () => renderBooksPage());
  }

  if (ratingFilter) {
    ratingFilter.addEventListener('change', () => renderBooksPage());
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', () => renderBooksPage());
  }
}

function bindGlobalInteractions() {
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (event) => {
      setState({ searchKeyword: event.target.value });
      setActiveView('books');
    });
  }

  document.querySelectorAll('[data-link]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      const link = element.dataset.link;
      if (link === 'login') setActiveView('login');
      else if (link === 'register') setActiveView('register');
      else if (link === 'home') setActiveView('home');
      else if (link === 'books') setActiveView('books');
      else if (link === 'cart') setActiveView('cart');
      else if (link === 'checkout') setActiveView('checkout');
      else if (link === 'profile') setActiveView('profile');
      else if (link === 'admin') setActiveView('admin');
    });
  });

  document.querySelectorAll('[data-action="add-to-cart"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      addItemToCart(bookId, 1);
    });
  });

  document.querySelectorAll('[data-action="view-details"]').forEach((button) => {
    button.addEventListener('click', () => {
      setActiveView('details', Number(button.dataset.bookId));
    });
  });

  document.querySelectorAll('[data-action="remove-cart-item"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      removeFromCart(bookId);
    });
  });

  document.querySelectorAll('[data-action="increment-cart"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      updateCartQuantity(bookId, 1);
    });
  });

  document.querySelectorAll('[data-action="decrement-cart"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      updateCartQuantity(bookId, -1);
    });
  });

  document.querySelectorAll('[data-action="clear-cart"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.cart = [];
      renderCartPage();
    });
  });

  document.querySelectorAll('[data-action="qty-plus"]').forEach((button) => {
    button.addEventListener('click', () => {
      const qty = Number(document.getElementById('detailQty')?.textContent || 1);
      document.getElementById('detailQty').textContent = String(qty + 1);
    });
  });

  document.querySelectorAll('[data-action="qty-minus"]').forEach((button) => {
    button.addEventListener('click', () => {
      const qtyDisplay = document.getElementById('detailQty');
      if (!qtyDisplay) return;
      const current = Number(qtyDisplay.textContent || 1);
      qtyDisplay.textContent = String(Math.max(1, current - 1));
    });
  });

  document.querySelectorAll('[data-action="buy-now"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      addItemToCart(bookId, 1);
      setActiveView('cart');
    });
  });

  document.querySelectorAll('[data-action="admin-delete-book"]').forEach((button) => {
    button.addEventListener('click', () => {
      const bookId = Number(button.dataset.bookId);
      state.books = state.books.filter((book) => book.id !== bookId);
      renderAdminDashboard();
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      api.setAuthToken(null);
      setState({ user: null });
      setActiveView('home');
    });
  }

  const profileToggle = document.getElementById('profileToggle');
  if (profileToggle) {
    profileToggle.addEventListener('click', () => {
      const menu = profileToggle.closest('.profile-menu');
      menu.classList.toggle('open');
    });
  }
}

function addItemToCart(bookId, quantity) {
  const book = getBookById(bookId);
  if (!book) {
    showToast('Book not found');
    return;
  }

  if (book.stock <= 0) {
    showToast('This book is out of stock.');
    return;
  }

  const existing = state.cart.find((item) => item.book.id === bookId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ book, quantity });
  }

  showToast(`${book.title} added to cart.`);
  setActiveView('cart');
}

function updateCartQuantity(bookId, delta) {
  const entry = state.cart.find((item) => item.book.id === bookId);
  if (!entry) return;

  entry.quantity += delta;
  if (entry.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.book.id !== bookId);
  }

  renderCartPage();
}

function removeFromCart(bookId) {
  state.cart = state.cart.filter((item) => item.book.id !== bookId);
  renderCartPage();
}

function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = '#122643';
  toast.style.color = 'white';
  toast.style.padding = '12px 16px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 18px 45px rgba(15, 23, 42, 0.2)';
  toast.style.zIndex = '2000';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2200);
}

async function loadBooksFromApi() {
  try {
    const books = await api.getBooks();
    if (!Array.isArray(books)) {
      throw new TypeError('The books API response must be an array.');
    }

    setState({ books });
    setActiveView(activeView, activeViewParams);
  } catch (error) {
    console.warn('Could not load books from the Spring Boot API; showing sample books instead.', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveView('home');
  void loadBooksFromApi();
});
