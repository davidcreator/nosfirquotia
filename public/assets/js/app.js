document.addEventListener('DOMContentLoaded', () => {
  const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltips.forEach((tooltip) => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      new window.bootstrap.Tooltip(tooltip);
    }
  });

  const sidebarToggleButtons = [].slice.call(document.querySelectorAll('[data-admin-sidebar-toggle]'));
  const sidebarPinButton = document.querySelector('[data-admin-sidebar-pin]');
  const sidebar = document.getElementById('aqAdminSidebar');
  const canUseSidebar = !!sidebar && document.body.classList.contains('aq-admin-theme');

  const mediaMobile = window.matchMedia('(max-width: 991.98px)');
  const mediaCompactDefault = window.matchMedia('(max-width: 1199.98px)');
  const sidebarStorageKey = 'aq_admin_sidebar_mode';
  const sidebarLinks = canUseSidebar ? [].slice.call(sidebar.querySelectorAll('.aq-admin-menu-link')) : [];

  const readSidebarMode = () => {
    try {
      const value = localStorage.getItem(sidebarStorageKey);
      if (value === 'expanded' || value === 'collapsed' || value === 'auto') {
        return value;
      }
    } catch (error) {
      // ignore storage failures
    }

    return 'auto';
  };

  let sidebarMode = readSidebarMode();

  const writeSidebarMode = (mode) => {
    sidebarMode = mode;
    try {
      localStorage.setItem(sidebarStorageKey, mode);
    } catch (error) {
      // ignore storage failures
    }
  };

  const closeSidebarMobile = () => {
    document.body.classList.remove('aq-admin-sidebar-open');
  };

  const setCollapsedDesktop = (collapsed) => {
    document.body.classList.toggle('aq-admin-sidebar-collapsed', collapsed);
  };

  const setMenuLinkLabels = (collapsedDesktop) => {
    sidebarLinks.forEach((link) => {
      const labelNode = link.querySelector('.aq-admin-menu-label');
      const label = (labelNode ? labelNode.textContent : link.textContent || '').trim();
      if (label === '') {
        return;
      }

      link.setAttribute('title', label);
      if (collapsedDesktop && !mediaMobile.matches) {
        link.setAttribute('aria-label', label);
      } else {
        link.removeAttribute('aria-label');
      }
    });
  };

  const syncSidebarPinUi = () => {
    if (!sidebarPinButton) {
      return;
    }

    const pinned = sidebarMode !== 'auto';
    const collapsed = document.body.classList.contains('aq-admin-sidebar-collapsed');
    sidebarPinButton.classList.toggle('is-active', pinned);
    sidebarPinButton.setAttribute('aria-pressed', pinned ? 'true' : 'false');

    if (mediaMobile.matches) {
      sidebarPinButton.setAttribute('title', 'Menu responsivo automatico');
      return;
    }

    if (sidebarMode === 'auto') {
      sidebarPinButton.setAttribute('title', 'Modo automatico. Clique para fixar.');
      return;
    }

    if (collapsed) {
      sidebarPinButton.setAttribute('title', 'Menu fixo recolhido. Shift+clique: automatico.');
      return;
    }

    sidebarPinButton.setAttribute('title', 'Menu fixo expandido. Shift+clique: automatico.');
  };

  const applySidebarMode = () => {
    if (!canUseSidebar) {
      return;
    }

    const isMobile = mediaMobile.matches;

    if (isMobile) {
      document.body.classList.remove('aq-admin-sidebar-collapsed');
      setMenuLinkLabels(false);
      syncSidebarPinUi();
      return;
    }

    document.body.classList.remove('aq-admin-sidebar-open');

    let collapsed = false;
    if (sidebarMode === 'collapsed') {
      collapsed = true;
    } else if (sidebarMode === 'expanded') {
      collapsed = false;
    } else {
      collapsed = mediaCompactDefault.matches;
    }

    setCollapsedDesktop(collapsed);
    setMenuLinkLabels(collapsed);
    syncSidebarPinUi();
  };

  if (canUseSidebar) {
    sidebarToggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (mediaMobile.matches) {
          document.body.classList.toggle('aq-admin-sidebar-open');
          return;
        }

        const collapsed = !document.body.classList.contains('aq-admin-sidebar-collapsed');
        setCollapsedDesktop(collapsed);
        writeSidebarMode(collapsed ? 'collapsed' : 'expanded');
        setMenuLinkLabels(collapsed);
        syncSidebarPinUi();
      });
    });

    if (sidebarPinButton) {
      sidebarPinButton.addEventListener('click', (event) => {
        if (mediaMobile.matches) {
          return;
        }

        if (event.shiftKey) {
          writeSidebarMode('auto');
          applySidebarMode();
          return;
        }

        const collapsed = document.body.classList.contains('aq-admin-sidebar-collapsed');
        writeSidebarMode(collapsed ? 'expanded' : 'collapsed');
        applySidebarMode();
      });
    }

    sidebarLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mediaMobile.matches) {
          closeSidebarMobile();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mediaMobile.matches) {
        closeSidebarMobile();
        return;
      }

      const key = String(event.key || '').toLowerCase();
      if (!(event.ctrlKey || event.metaKey) || key !== 'b') {
        return;
      }

      event.preventDefault();

      if (mediaMobile.matches) {
        document.body.classList.toggle('aq-admin-sidebar-open');
        return;
      }

      const collapsed = !document.body.classList.contains('aq-admin-sidebar-collapsed');
      setCollapsedDesktop(collapsed);
      writeSidebarMode(collapsed ? 'collapsed' : 'expanded');
      setMenuLinkLabels(collapsed);
      syncSidebarPinUi();
    });

    document.addEventListener('click', (event) => {
      if (!mediaMobile.matches || !document.body.classList.contains('aq-admin-sidebar-open')) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const clickedToggle = sidebarToggleButtons.some((button) => button.contains(target));
      const clickedPin = !!(sidebarPinButton && sidebarPinButton.contains(target));
      const clickedInsideSidebar = sidebar.contains(target);

      if (!clickedToggle && !clickedPin && !clickedInsideSidebar) {
        closeSidebarMobile();
      }
    });

    const watchMediaChange = () => {
      applySidebarMode();
    };

    if (typeof mediaMobile.addEventListener === 'function') {
      mediaMobile.addEventListener('change', watchMediaChange);
      mediaCompactDefault.addEventListener('change', watchMediaChange);
    } else if (typeof mediaMobile.addListener === 'function') {
      mediaMobile.addListener(watchMediaChange);
      mediaCompactDefault.addListener(watchMediaChange);
    }

    applySidebarMode();
  }

  const clientNavCollapse = document.querySelector('[data-client-nav-collapse]');
  const clientNavbar = document.getElementById('aqClientNavbar');
  const canUseClientNav = !!clientNavCollapse && document.body.classList.contains('aq-client-theme');

  if (canUseClientNav) {
    const clientMediaMobile = window.matchMedia('(max-width: 991.98px)');
    const navLinks = [].slice.call(clientNavCollapse.querySelectorAll('a'));

    const setBodyClientNav = (open) => {
      document.body.classList.toggle('aq-client-nav-open', open && clientMediaMobile.matches);
    };

    if (window.bootstrap && window.bootstrap.Collapse) {
      const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(clientNavCollapse, { toggle: false });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (clientMediaMobile.matches && clientNavCollapse.classList.contains('show')) {
            collapseInstance.hide();
          }
        });
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && clientMediaMobile.matches && clientNavCollapse.classList.contains('show')) {
          collapseInstance.hide();
        }
      });
    }

    clientNavCollapse.addEventListener('show.bs.collapse', () => {
      setBodyClientNav(true);
    });

    clientNavCollapse.addEventListener('hidden.bs.collapse', () => {
      setBodyClientNav(false);
    });

    const syncClientMenuOnBreakpoint = () => {
      if (!clientMediaMobile.matches) {
        setBodyClientNav(false);
      }
    };

    if (typeof clientMediaMobile.addEventListener === 'function') {
      clientMediaMobile.addEventListener('change', syncClientMenuOnBreakpoint);
    } else if (typeof clientMediaMobile.addListener === 'function') {
      clientMediaMobile.addListener(syncClientMenuOnBreakpoint);
    }

    if (clientNavbar) {
      const syncScrolledState = () => {
        document.body.classList.toggle('aq-client-scrolled', window.scrollY > 12);
      };

      window.addEventListener('scroll', syncScrolledState, { passive: true });
      syncScrolledState();
    }
  }

  const phoneMaskInputs = [].slice.call(document.querySelectorAll('input[data-phone-mask="br"]'));
  if (phoneMaskInputs.length > 0) {
    const extractPhoneDigits = (value) => String(value || '').replace(/\D/g, '').slice(0, 11);
    const formatPhoneBr = (value) => {
      const digits = extractPhoneDigits(value);
      if (digits.length === 0) {
        return '';
      }

      if (digits.length <= 2) {
        return digits;
      }

      const ddd = digits.slice(0, 2);
      const number = digits.slice(2);

      if (number.length <= 4) {
        return `(${ddd}) ${number}`;
      }

      if (number.length <= 8) {
        return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
      }

      return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
    };

    phoneMaskInputs.forEach((input) => {
      const applyMask = () => {
        input.value = formatPhoneBr(input.value);
      };

      input.addEventListener('input', applyMask);
      input.addEventListener('blur', applyMask);
      applyMask();
    });
  }

  const consentKey = 'aq_cookie_consent';
  const banner = document.getElementById('cookieConsentBanner');
  const buttons = [].slice.call(document.querySelectorAll('[data-cookie-consent]'));

  if (banner && buttons.length > 0) {
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
  }
});
