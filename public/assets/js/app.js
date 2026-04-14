document.addEventListener('DOMContentLoaded', () => {
  const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltips.forEach((tooltip) => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      new window.bootstrap.Tooltip(tooltip);
    }
  });

  const consentKey = 'aq_cookie_consent';
  const banner = document.getElementById('cookieConsentBanner');
  const buttons = [].slice.call(document.querySelectorAll('[data-cookie-consent]'));

  if (!banner || buttons.length === 0) {
    return;
  }

  const existing = localStorage.getItem(consentKey);
  if (!existing) {
    banner.classList.remove('d-none');
  }

  const writeCookie = (value) => {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `aq_cookie_consent=${encodeURIComponent(value)}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secureFlag}`;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-cookie-consent') || 'essential';
      localStorage.setItem(consentKey, value);
      writeCookie(value);
      banner.classList.add('d-none');
    });
  });
});
