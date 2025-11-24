// Global script for Triply hotel booking website. Handles language
// switching, page initialization, searching, listing, detail view,
// booking flow, authentication, user dashboard, and a basic admin
// interface. The code is written in modular functions that run
// depending on the page ID defined on the body element.

document.addEventListener('DOMContentLoaded', () => {
  // Initialize language based on saved preference
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    currentLang = savedLang;
    const langSelectEl = document.getElementById('lang-select');
    if (langSelectEl) langSelectEl.value = currentLang;
  }
  updateTranslations();

  // Language selection handler
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('lang', currentLang);
      updateTranslations();
    });
  }

  // Mobile nav toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize page based on body id
  const pageId = document.body.id;
  switch (pageId) {
    case 'home':
      loadHome();
      break;
    case 'listings':
      loadListings();
      break;
    case 'hotel-detail':
      loadHotelDetail();
      break;
    case 'booking':
      loadBooking();
      break;
    case 'auth':
      loadAuth();
      break;
    case 'dashboard':
      loadDashboard();
      break;
    case 'admin':
      loadAdmin();
      break;
  }
});

// Translation: updates all elements with class 't' using their data-key attribute
function updateTranslations() {
  document.querySelectorAll('.t').forEach((el) => {
    const key = el.dataset.key;
    if (key) el.textContent = t(key);
  });
}

// Parse query parameters into an object
function parseQuery() {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = decodeURIComponent(value);
  }
  return obj;
}

// Format rating as stars and return HTML string
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  if (half) stars += '½';
  return stars;
}

// HOME PAGE
function loadHome() {
  // Prefill dates: check‑in tomorrow, check‑out day after
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  if (checkinInput && checkoutInput) {
    checkinInput.value = tomorrow.toISOString().split('T')[0];
    checkoutInput.value = dayAfter.toISOString().split('T')[0];
  }

  // Search form submit handler
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('dest').value.trim();
      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const guests = document.getElementById('guests').value;
      if (dest && checkin && checkout && guests) {
        const url =
          'listings.html?dest=' +
          encodeURIComponent(dest) +
          '&checkin=' +
          encodeURIComponent(checkin) +
          '&checkout=' +
          encodeURIComponent(checkout) +
          '&guests=' +
          encodeURIComponent(guests);
        window.location.href = url;
      }
    });
  }

  // Populate popular destinations
  const popularDest = document.getElementById('popularDestinations');
  if (popularDest) {
    // Get unique destinations and count hotels per dest
    const destCount = {};
    hotels.forEach((h) => {
      destCount[h.destination] = (destCount[h.destination] || 0) + 1;
    });
    const destinations = Object.keys(destCount);
    destinations.forEach((dest) => {
      // Pick an image based on destination keywords
      let img = 'dest_city.png';
      if (/bali/i.test(dest)) img = 'hero.png';
      if (/bandung/i.test(dest)) img = 'dest_mountain.png';
      if (/lombok/i.test(dest)) img = 'hero.png';
      if (/surabaya/i.test(dest)) img = 'dest_city.png';
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="assets/images/${img}" alt="${dest}">
        <div class="card-body">
          <h3>${dest}</h3>
          <p>${destCount[dest]} hotel(s)</p>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `listings.html?dest=${encodeURIComponent(dest)}`;
      });
      popularDest.appendChild(card);
    });
  }

  // Populate featured deals (top 3 by rating)
  const featured = document.getElementById('featuredDeals');
  if (featured) {
    const sorted = [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 3);
    sorted.forEach((hotel) => {
      const card = document.createElement('div');
      card.className = 'card';
      const firstImg = hotel.images[0] || 'hero.png';
      card.innerHTML = `
        <img src="assets/images/${firstImg}" alt="${hotel.name}">
        <div class="card-body">
          <h3>${hotel.name}</h3>
          <p>${hotel.location}</p>
          <div class="stars">${renderStars(hotel.rating)} (${hotel.rating.toFixed(1)})</div>
          <div class="price">$${hotel.price}/night</div>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `hotel.html?id=${hotel.id}`;
      });
      featured.appendChild(card);
    });
  }
}

// LISTINGS PAGE
function loadListings() {
  const params = parseQuery();
  // Fill search inputs
  const destEl = document.getElementById('dest');
  const checkinEl = document.getElementById('checkin');
  const checkoutEl = document.getElementById('checkout');
  const guestsEl = document.getElementById('guests');
  if (destEl) destEl.value = params.dest || '';
  if (checkinEl) checkinEl.value = params.checkin || '';
  if (checkoutEl) checkoutEl.value = params.checkout || '';
  if (guestsEl) guestsEl.value = params.guests || 1;

  // Handle search submission from listings page
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = destEl.value.trim();
      const checkin = checkinEl.value;
      const checkout = checkoutEl.value;
      const guests = guestsEl.value;
      const url = `listings.html?dest=${encodeURIComponent(dest)}&checkin=${encodeURIComponent(
        checkin
      )}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;
      window.location.href = url;
    });
  }

  // Generate filter options
  buildFilterPanel();
  // Populate sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.innerHTML = `
      <option value="priceAsc">${t('price_low_high')}</option>
      <option value="priceDesc">${t('price_high_low')}</option>
      <option value="ratingDesc">${t('rating_high_low')}</option>
    `;
    sortSelect.addEventListener('change', updateList);
  }
  // Grid/list toggle
  const viewToggle = document.getElementById('viewToggle');
  if (viewToggle) {
    viewToggle.addEventListener('click', () => {
      document.getElementById('results').classList.toggle('list-view');
    });
  }
  // Initial listing
  updateList();
}

function buildFilterPanel() {
  const panel = document.getElementById('filterPanel');
  if (!panel) return;
  // Price ranges
  const priceSection = document.createElement('div');
  priceSection.className = 'filter-section';
  priceSection.innerHTML = `<h4>${t('price_low_high').split(':')[0]}</h4>`;
  const ranges = [
    { label: '$0 – $100', min: 0, max: 100 },
    { label: '$101 – $200', min: 101, max: 200 },
    { label: '$201+', min: 201, max: Infinity },
  ];
  ranges.forEach((range, idx) => {
    const id = `price-${idx}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="price" value="${range.min},${range.max}" id="${id}" /> ${range.label}`;
    priceSection.appendChild(label);
  });
  panel.appendChild(priceSection);
  // Ratings
  const ratingSection = document.createElement('div');
  ratingSection.className = 'filter-section';
  ratingSection.innerHTML = `<h4>${t('rating_high_low').split(':')[0]}</h4>`;
  [4, 3, 2].forEach((star) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="rating" value="${star}" /> ${star}+`;
    ratingSection.appendChild(label);
  });
  panel.appendChild(ratingSection);
  // Facilities
  const facilitySection = document.createElement('div');
  facilitySection.className = 'filter-section';
  facilitySection.innerHTML = `<h4>${t('facilities')}</h4>`;
  const facilities = new Set();
  hotels.forEach((h) => h.facilities.forEach((f) => facilities.add(f)));
  Array.from(facilities).forEach((fac) => {
    const id = `fac-${fac.replace(/\s+/g, '')}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="facility" value="${fac}" id="${id}" /> ${fac}`;
    facilitySection.appendChild(label);
  });
  panel.appendChild(facilitySection);
  // Add event listener to update list on filter change
  panel.addEventListener('change', updateList);
}

function updateList() {
  const params = parseQuery();
  // Start with all hotels
  let results = [...hotels];
  // Filter by destination
  if (params.dest) {
    const destLower = params.dest.toLowerCase();
    results = results.filter((h) => h.destination.toLowerCase().includes(destLower));
  }
  // Apply price filters
  const priceFilters = Array.from(document.querySelectorAll('input[name="price"]:checked')).map((el) => {
    const [min, max] = el.value.split(',');
    return { min: parseFloat(min), max: parseFloat(max) };
  });
  if (priceFilters.length) {
    results = results.filter((h) => {
      return priceFilters.some((f) => h.price >= f.min && h.price <= f.max);
    });
  }
  // Apply rating filters
  const ratingFilters = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map((el) => parseInt(el.value));
  if (ratingFilters.length) {
    results = results.filter((h) => {
      return ratingFilters.some((r) => h.rating >= r);
    });
  }
  // Apply facility filters
  const facilityFilters = Array.from(document.querySelectorAll('input[name="facility"]:checked')).map((el) => el.value);
  if (facilityFilters.length) {
    results = results.filter((h) => {
      return facilityFilters.every((fac) => h.facilities.includes(fac));
    });
  }
  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    const sortVal = sortSelect.value;
    if (sortVal === 'priceAsc') results.sort((a, b) => a.price - b.price);
    if (sortVal === 'priceDesc') results.sort((a, b) => b.price - a.price);
    if (sortVal === 'ratingDesc') results.sort((a, b) => b.rating - a.rating);
  }
  // Render results
  const container = document.getElementById('results');
  if (!container) return;
  container.innerHTML = '';
  if (results.length === 0) {
    const noResult = document.createElement('p');
    noResult.textContent = 'No hotels found.';
    container.appendChild(noResult);
    return;
  }
  results.forEach((hotel) => {
    const card = document.createElement('div');
    card.className = 'card';
    const firstImg = hotel.images[0] || 'hero.png';
    card.innerHTML = `
      <img src="assets/images/${firstImg}" alt="${hotel.name}">
      <div class="card-body">
        <h3>${hotel.name}</h3>
        <p>${hotel.location}</p>
        <div class="stars">${renderStars(hotel.rating)} (${hotel.rating.toFixed(1)})</div>
        <div class="price">$${hotel.price}/night</div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `hotel.html?id=${hotel.id}&checkin=${encodeURIComponent(
        params.checkin || ''
      )}&checkout=${encodeURIComponent(params.checkout || '')}&guests=${encodeURIComponent(
        params.guests || ''
      )}`;
    });
    container.appendChild(card);
  });
}

// DETAIL PAGE
function loadHotelDetail() {
  const params = parseQuery();
  const hotel = getHotelById(params.id);
  if (!hotel) {
    alert('Hotel not found');
    return;
  }

  // Merge any locally stored reviews for this hotel
  try {
    const storedReviews = JSON.parse(localStorage.getItem('reviews_' + hotel.id) || '[]');
    storedReviews.forEach((rev) => {
      if (!hotel.reviews.some((r) => r.user === rev.user && r.comment === rev.comment)) {
        hotel.reviews.push(rev);
      }
    });
  } catch (err) {
    console.error(err);
  }
  // Set title
  document.title = `${hotel.name} – Triply`;
  // Populate gallery
  const galleryEl = document.getElementById('gallery');
  if (galleryEl) {
    hotel.images.forEach((img) => {
      const imgEl = document.createElement('img');
      imgEl.src = `assets/images/${img}`;
      imgEl.alt = hotel.name;
      galleryEl.appendChild(imgEl);
    });
  }
  // Populate hotel name and location
  const nameEl = document.getElementById('hotelName');
  const locationEl = document.getElementById('hotelLocation');
  const ratingEl = document.getElementById('hotelRating');
  if (nameEl) nameEl.textContent = hotel.name;
  if (locationEl) locationEl.textContent = hotel.location;
  if (ratingEl) ratingEl.innerHTML = `${renderStars(hotel.rating)} (${hotel.rating.toFixed(1)})`;
  // Description
  const descEl = document.getElementById('hotelDescription');
  if (descEl) descEl.textContent = hotel.description;
  // Amenities
  const amenEl = document.getElementById('amenities');
  if (amenEl) {
    amenEl.innerHTML = '';
    hotel.amenities.forEach((a) => {
      const li = document.createElement('li');
      li.textContent = a;
      amenEl.appendChild(li);
    });
  }
  // Room types
  const roomList = document.getElementById('roomList');
  if (roomList) {
    roomList.innerHTML = '';
    hotel.rooms.forEach((room) => {
      const div = document.createElement('div');
      div.className = 'room-type';
      div.innerHTML = `
        <div class="info">
          <strong>${room.type}</strong><br />
          <span>$${room.price}/night</span>
        </div>
        <div class="action">
          <button class="btn primary">${t('book_now')}</button>
        </div>
      `;
      // On book now click, go to booking page with selected room
      div.querySelector('button').addEventListener('click', () => {
        const url = `booking.html?hotel=${hotel.id}&room=${encodeURIComponent(
          room.type
        )}&price=${room.price}&checkin=${encodeURIComponent(
          params.checkin || ''
        )}&checkout=${encodeURIComponent(params.checkout || '')}&guests=${encodeURIComponent(
          params.guests || ''
        )}`;
        window.location.href = url;
      });
      roomList.appendChild(div);
    });
  }
  // Reviews
  const reviewsEl = document.getElementById('reviews');
  if (reviewsEl) {
    reviewsEl.innerHTML = '';
    hotel.reviews.forEach((rev) => {
      const div = document.createElement('div');
      div.className = 'review';
      div.innerHTML = `
        <strong>${rev.user}</strong> – ${renderStars(rev.rating)}<br />
        <p>${rev.comment}</p>
      `;
      reviewsEl.appendChild(div);
    });
  }

  // Map display
  const mapContainer = document.getElementById('mapContainer');
  if (mapContainer && hotel.map) {
    const { lat, lng } = hotel.map;
    // Display coordinates with a link to Google Maps (opens in new tab)
    mapContainer.innerHTML = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener" style="color: var(--primary); font-weight:600">(${lat.toFixed(4)}, ${lng.toFixed(4)}) → Map</a>`;
  }

  // Review submission
  const reviewSection = document.getElementById('reviewSection');
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm && reviewSection) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      // Hide form and ask to log in
      reviewSection.innerHTML = `<p>${t('login')} to ${t('add_review').toLowerCase()}.</p>`;
    } else {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value.trim();
        if (!comment) {
          alert('Please enter a comment');
          return;
        }
        const newRev = {
          user: currentUser.fullName || currentUser.username || 'Guest',
          rating,
          comment,
        };
        // Append to hotel reviews and persist to localStorage (per hotel key)
        hotel.reviews.push(newRev);
        // Save to localStorage separate store
        const key = 'reviews_' + hotel.id;
        let stored = JSON.parse(localStorage.getItem(key) || '[]');
        stored.push(newRev);
        localStorage.setItem(key, JSON.stringify(stored));
        // Update UI
        const revDiv = document.createElement('div');
        revDiv.className = 'review';
        revDiv.innerHTML = `<strong>${newRev.user}</strong> – ${renderStars(newRev.rating)}<br /><p>${newRev.comment}</p>`;
        reviewsEl.appendChild(revDiv);
        // Clear form and thank you
        reviewForm.reset();
        alert(t('review_thanks'));
      });
      // Stored reviews are merged at page load; no need to add again here
    }
  }
}

// BOOKING PAGE
function loadBooking() {
  const params = parseQuery();
  const hotel = getHotelById(params.hotel);
  if (!hotel) {
    alert('Hotel not found');
    return;
  }
  const roomType = params.room;
  const pricePerNight = parseFloat(params.price);
  const checkin = params.checkin;
  const checkout = params.checkout;
  const guests = params.guests || 1;
  // Compute nights
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const nights = Math.max(1, Math.round((checkoutDate - checkinDate) / (1000 * 3600 * 24)));
  // Populate summary
  document.getElementById('bookingHotelName').textContent = hotel.name;
  document.getElementById('bookingRoomType').textContent = roomType;
  document.getElementById('bookingDates').textContent = `${checkin} → ${checkout} (${nights} night${
    nights > 1 ? 's' : ''
  })`;
  document.getElementById('bookingGuests').textContent = guests;
  const totalPrice = pricePerNight * nights;
  document.getElementById('bookingTotal').textContent = `$${totalPrice.toFixed(2)}`;
  // Fill hidden fields
  document.getElementById('bookingHotelId').value = hotel.id;
  document.getElementById('bookingRoom').value = roomType;
  document.getElementById('bookingCheckin').value = checkin;
  document.getElementById('bookingCheckout').value = checkout;
  document.getElementById('bookingPrice').value = totalPrice;
  // Prefill user info if logged in
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user) {
    document.getElementById('guestName').value = user.fullName || '';
    document.getElementById('guestEmail').value = user.email || '';
  }
  // Handle booking form
  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Basic validation for card
    const card = document.getElementById('cardNumber').value.trim();
    const exp = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    if (!card || !exp || !cvv) {
      alert('Please fill in payment details');
      return;
    }
    // Simulate payment processing (no real gateway)
    // Save booking
    const booking = {
      id: 'B' + Date.now(),
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomType: roomType,
      checkin,
      checkout,
      guests,
      name: document.getElementById('guestName').value,
      email: document.getElementById('guestEmail').value,
      phone: document.getElementById('guestPhone').value,
      total: totalPrice,
      createdAt: new Date().toISOString(),
    };
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    // Show confirmation message
    form.innerHTML = `<p>Thank you, your booking is confirmed! Your reservation ID is <strong>${booking.id}</strong>. (Payment processed)</p>`;
  });
}

// AUTH PAGE (login / register)
function loadAuth() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  // Show login by default
  registerForm.style.display = 'none';
  switchToLogin.style.display = 'none';
  // Switch to register
  switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    switchToRegister.style.display = 'none';
    switchToLogin.style.display = 'block';
  });
  // Switch to login
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    switchToRegister.style.display = 'block';
    switchToLogin.style.display = 'none';
  });
  // Handle login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid credentials');
    }
  });
  // Handle register
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value.trim();
    if (!fullName || !username || !password || !email) {
      alert('Please complete all fields');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.username === username)) {
      alert('Username already exists');
      return;
    }
    const newUser = { fullName, username, password, email };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    // Switch back to login
    registerForm.reset();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    switchToRegister.style.display = 'block';
    switchToLogin.style.display = 'none';
  });
}

// DASHBOARD PAGE
function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('userName').textContent = user.fullName;
  // Show bookings
  const bookingList = document.getElementById('bookingList');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const userBookings = bookings.filter((b) => b.email === user.email);
  if (userBookings.length === 0) {
    bookingList.innerHTML = `<p>${t('no_bookings')}</p>`;
  } else {
    const table = document.createElement('table');
    table.className = 'admin-table';
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Hotel</th><th>Room</th><th>Dates</th><th>Total</th></tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    userBookings.forEach((b) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.hotelName}</td>
        <td>${b.roomType}</td>
        <td>${b.checkin} → ${b.checkout}</td>
        <td>$${b.total.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
    bookingList.appendChild(table);
  }
  // Log out button
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
}

// ADMIN PAGE
function loadAdmin() {
  // For simplicity, no authentication; in production, restrict access
  // Sidebar navigation
  const navLinks = document.querySelectorAll('.admin-sidebar nav a');
  const sections = document.querySelectorAll('.admin-content section');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      sections.forEach((sec) => {
        if (sec.id === link.dataset.target) sec.style.display = 'block';
        else sec.style.display = 'none';
      });
    });
  });
  // Default section visible
  if (navLinks.length) navLinks[0].click();
  // Populate hotels in admin table
  renderAdminHotels();
  // Populate bookings and users lists
  renderAdminBookings();
  renderAdminUsers();
  // Handle add hotel
  const addForm = document.getElementById('addHotelForm');
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const name = formData.get('name').trim();
    const destination = formData.get('destination').trim();
    const location = formData.get('location').trim();
    const rating = parseFloat(formData.get('rating'));
    const price = parseFloat(formData.get('price'));
    const description = formData.get('description').trim();
    const amenities = formData.get('amenities').split(',').map((s) => s.trim()).filter(Boolean);
    const facilities = formData.get('facilities').split(',').map((s) => s.trim()).filter(Boolean);
    const roomsStr = formData.get('rooms');
    const rooms = roomsStr
      .split(';')
      .map((r) => {
        const parts = r.split(':');
        return { type: parts[0].trim(), price: parseFloat(parts[1]), availability: 5 };
      })
      .filter((r) => r.type && r.price);
    const newHotel = {
      id: 'H' + (hotels.length + 1).toString().padStart(3, '0'),
      name,
      location,
      destination,
      rating,
      reviews: [],
      price,
      images: ['hero.png'],
      description,
      rooms,
      amenities,
      facilities,
      map: { lat: 0, lng: 0 },
    };
    hotels.push(newHotel);
    renderAdminHotels();
    renderAdminBookings();
    renderAdminUsers();
    addForm.reset();
    alert('Hotel added successfully');
  });
}

function renderAdminHotels() {
  const table = document.getElementById('adminHotelsTable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  hotels.forEach((hotel) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${hotel.id}</td>
      <td>${hotel.name}</td>
      <td>${hotel.destination}</td>
      <td>$${hotel.price}</td>
      <td><button class="btn secondary" data-id="${hotel.id}">${t('delete')}</button></td>
    `;
    tbody.appendChild(tr);
  });
  // Attach delete handlers
  tbody.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const index = hotels.findIndex((h) => h.id === id);
      if (index >= 0) {
        hotels.splice(index, 1);
        renderAdminHotels();
        // Refresh other admin lists
        renderAdminBookings();
        renderAdminUsers();
      }
    });
  });
}

// Render bookings in admin section
function renderAdminBookings() {
  const list = document.getElementById('adminBookingList');
  if (!list) return;
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (bookings.length === 0) {
    list.innerHTML = '<p>No bookings.</p>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'admin-table';
  table.innerHTML = `
    <thead>
      <tr><th>ID</th><th>Hotel</th><th>User</th><th>Dates</th><th>Total</th><th>Action</th></tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  bookings.forEach((b) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.hotelName}</td>
      <td>${b.email}</td>
      <td>${b.checkin} → ${b.checkout}</td>
      <td>$${b.total.toFixed(2)}</td>
      <td><button class="btn secondary" data-id="${b.id}">${t('delete')}</button></td>
    `;
    tbody.appendChild(tr);
  });
  list.innerHTML = '';
  list.appendChild(table);
  tbody.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      let bookingsArr = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookingsArr = bookingsArr.filter((b) => b.id !== id);
      localStorage.setItem('bookings', JSON.stringify(bookingsArr));
      renderAdminBookings();
    });
  });
}

// Render users in admin section
function renderAdminUsers() {
  const list = document.getElementById('adminUserList');
  if (!list) return;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    list.innerHTML = '<p>No registered users.</p>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'admin-table';
  table.innerHTML = `
    <thead><tr><th>Username</th><th>Name</th><th>Email</th><th>Action</th></tr></thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  users.forEach((u) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.fullName}</td>
      <td>${u.email}</td>
      <td><button class="btn secondary" data-username="${u.username}">${t('delete')}</button></td>
    `;
    tbody.appendChild(tr);
  });
  list.innerHTML = '';
  list.appendChild(table);
  tbody.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const username = btn.dataset.username;
      let usersArr = JSON.parse(localStorage.getItem('users') || '[]');
      usersArr = usersArr.filter((u) => u.username !== username);
      localStorage.setItem('users', JSON.stringify(usersArr));
      const curr = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (curr && curr.username === username) localStorage.removeItem('currentUser');
      renderAdminUsers();
    });
  });
}