document.addEventListener('DOMContentLoaded', () => {
  const resolveCspNonce = (targetDocument) => {
    if (!targetDocument || typeof targetDocument.querySelector !== 'function') {
      return '';
    }

    const nonceNode = targetDocument.querySelector('script[nonce], style[nonce]');
    if (!nonceNode) {
      return '';
    }

    return String(nonceNode.nonce || nonceNode.getAttribute('nonce') || '').trim();
  };

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
  const sidebarItems = canUseSidebar ? [].slice.call(sidebar.querySelectorAll('.aq-admin-menu-item')) : [];
  const sidebarSearchInput = canUseSidebar ? sidebar.querySelector('[data-admin-sidebar-search]') : null;
  let sidebarNoResultsNotice = null;

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

  const normalizeMenuText = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const filterSidebarMenu = () => {
    if (!canUseSidebar || !sidebarSearchInput) {
      return;
    }

    const query = normalizeMenuText(sidebarSearchInput.value);
    let visibleCount = 0;

    sidebarItems.forEach((item) => {
      const link = item.querySelector('.aq-admin-menu-link');
      if (!link) {
        return;
      }

      const labelNode = link.querySelector('.aq-admin-menu-label');
      const label = normalizeMenuText(labelNode ? labelNode.textContent : link.textContent);
      const shouldShow = query === '' || label.includes(query);

      item.hidden = !shouldShow;
      item.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (sidebarNoResultsNotice) {
      sidebarNoResultsNotice.classList.toggle('d-none', visibleCount > 0);
    }
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
      filterSidebarMenu();
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
    filterSidebarMenu();
  };

  if (canUseSidebar) {
    if (sidebarSearchInput) {
      const menuContainer = sidebar.querySelector('.aq-admin-menu');
      if (menuContainer) {
        sidebarNoResultsNotice = document.createElement('div');
        sidebarNoResultsNotice.className = 'aq-admin-menu-empty d-none';
        sidebarNoResultsNotice.textContent = 'Nenhum item encontrado.';
        menuContainer.appendChild(sidebarNoResultsNotice);
      }

      sidebarSearchInput.addEventListener('input', filterSidebarMenu);
      sidebarSearchInput.addEventListener('search', filterSidebarMenu);
    }

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
    filterSidebarMenu();
  }

  const toolFrame = document.querySelector('[data-admin-tool-frame]');
  const canUseToolFrame = !!toolFrame && document.body.classList.contains('aq-admin-tools-open');

  if (canUseToolFrame) {
    const applyToolWorkspaceChrome = () => {
      let frameDoc = null;

      try {
        frameDoc = toolFrame.contentDocument || (toolFrame.contentWindow ? toolFrame.contentWindow.document : null);
      } catch (error) {
        return;
      }

      if (!frameDoc || !frameDoc.body) {
        return;
      }

      const toolName = (toolFrame.getAttribute('data-tool-name')
        || frameDoc.title
        || 'Ferramenta').trim();
      const toolListUrl = (toolFrame.getAttribute('data-tool-list-url') || '/admin/ferramentas').trim();
      const toolOpenUrl = (toolFrame.getAttribute('data-tool-open-url')
        || toolFrame.getAttribute('src')
        || '#').trim();

      frameDoc.documentElement.classList.add('aq-tool-embedded');
      frameDoc.body.classList.add('aq-tool-embedded-body');

      if (!frameDoc.getElementById('aqToolEmbeddedStyle')) {
        const frameNonce = resolveCspNonce(frameDoc);
        const style = frameDoc.createElement('style');
        if (frameNonce !== '') {
          style.setAttribute('nonce', frameNonce);
        }
        style.id = 'aqToolEmbeddedStyle';
        style.textContent = `
html.aq-tool-embedded,
body.aq-tool-embedded-body {
  width: 100%;
  min-height: 100%;
}
body.aq-tool-embedded-body {
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(180deg, #f4f8ff 0%, #edf4fc 100%);
  color: #223249;
  font-family: "Source Sans 3", "Segoe UI", Arial, sans-serif !important;
}
#aqToolChrome {
  position: sticky;
  top: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.56rem 0.84rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
  background: linear-gradient(92deg, #0e2750 0%, #18447f 62%, #116d80 100%);
  color: #ffffff;
}
#aqToolChrome .aq-tool-chrome-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.52rem;
  min-width: 0;
}
#aqToolChrome .aq-tool-chrome-dot {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  background: #9be0ff;
  box-shadow: 0 0 0 0.2rem rgba(155, 224, 255, 0.22);
  flex: 0 0 auto;
}
#aqToolChrome .aq-tool-chrome-brand strong {
  display: block;
  font-size: 0.87rem;
  line-height: 1.1;
  color: #ffffff;
}
#aqToolChrome .aq-tool-chrome-brand small {
  display: block;
  color: rgba(233, 246, 255, 0.86);
  font-size: 0.69rem;
  line-height: 1.15;
}
#aqToolChrome .aq-tool-chrome-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
#aqToolChrome .aq-tool-chrome-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  padding: 0.24rem 0.62rem;
  text-decoration: none;
  color: #ffffff;
  background: rgba(8, 26, 50, 0.18);
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.2;
}
#aqToolChrome .aq-tool-chrome-link:hover {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(8, 26, 50, 0.34);
  color: #ffffff;
}
#aqToolChrome .aq-tool-chrome-link.is-secondary {
  background: rgba(255, 255, 255, 0.1);
}
body.aq-tool-embedded-body .container,
body.aq-tool-embedded-body .container-grid,
body.aq-tool-embedded-body .page,
body.aq-tool-embedded-body .main,
body.aq-tool-embedded-body .main-content {
  width: min(1260px, 100%) !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
body.aq-tool-embedded-body .panel,
body.aq-tool-embedded-body .card,
body.aq-tool-embedded-body .upload-option-card,
body.aq-tool-embedded-body .upload-validation,
body.aq-tool-embedded-body .upload-info-card {
  border-radius: 0.9rem !important;
  border: 1px solid #d8e3f2 !important;
  box-shadow: 0 8px 20px rgba(20, 38, 63, 0.08) !important;
}
body.aq-tool-embedded-body button,
body.aq-tool-embedded-body .btn,
body.aq-tool-embedded-body input,
body.aq-tool-embedded-body textarea,
body.aq-tool-embedded-body select {
  border-radius: 0.62rem !important;
}
@media (max-width: 900px) {
  #aqToolChrome {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;
        (frameDoc.head || frameDoc.documentElement).appendChild(style);
      }

      let chrome = frameDoc.getElementById('aqToolChrome');
      if (!chrome) {
        chrome = frameDoc.createElement('div');
        chrome.id = 'aqToolChrome';

        const brand = frameDoc.createElement('div');
        brand.className = 'aq-tool-chrome-brand';

        const dot = frameDoc.createElement('span');
        dot.className = 'aq-tool-chrome-dot';
        dot.setAttribute('aria-hidden', 'true');
        brand.appendChild(dot);

        const brandMeta = frameDoc.createElement('div');
        const titleNode = frameDoc.createElement('strong');
        titleNode.setAttribute('data-tool-title', '');
        brandMeta.appendChild(titleNode);
        const subtitleNode = frameDoc.createElement('small');
        subtitleNode.textContent = 'Quotia Tools Workspace';
        brandMeta.appendChild(subtitleNode);
        brand.appendChild(brandMeta);

        const actions = frameDoc.createElement('div');
        actions.className = 'aq-tool-chrome-actions';

        const backLink = frameDoc.createElement('a');
        backLink.className = 'aq-tool-chrome-link';
        backLink.setAttribute('data-tool-back-link', '');
        backLink.setAttribute('target', '_top');
        backLink.textContent = 'Voltar para ferramentas';
        actions.appendChild(backLink);

        const openLink = frameDoc.createElement('a');
        openLink.className = 'aq-tool-chrome-link is-secondary';
        openLink.setAttribute('data-tool-open-link', '');
        openLink.setAttribute('target', '_blank');
        openLink.setAttribute('rel', 'noopener noreferrer');
        openLink.textContent = 'Abrir fora do painel';
        actions.appendChild(openLink);

        chrome.appendChild(brand);
        chrome.appendChild(actions);

        frameDoc.body.insertBefore(chrome, frameDoc.body.firstChild);
      }

      const titleNode = chrome.querySelector('[data-tool-title]');
      if (titleNode) {
        titleNode.textContent = toolName;
      }

      const backLink = chrome.querySelector('[data-tool-back-link]');
      if (backLink) {
        backLink.setAttribute('href', toolListUrl);
      }

      const openLink = chrome.querySelector('[data-tool-open-link]');
      if (openLink) {
        openLink.setAttribute('href', toolOpenUrl);
      }
    };

    toolFrame.addEventListener('load', applyToolWorkspaceChrome);
    window.setTimeout(applyToolWorkspaceChrome, 120);
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
