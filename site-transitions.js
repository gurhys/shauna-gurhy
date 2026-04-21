(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function isSameDocumentNavigation(url) {
    return (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    );
  }

  function shouldHandleLink(link, event) {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) {
      return false;
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return false;
    }

    if (link.target && link.target !== "_self") {
      return false;
    }

    if (link.hasAttribute("download")) {
      return false;
    }

    let url;

    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return false;
    }

    if (!["http:", "https:", "file:"].includes(url.protocol)) {
      return false;
    }

    if (
      window.location.protocol !== "file:" &&
      url.origin !== window.location.origin
    ) {
      return false;
    }

    if (isSameDocumentNavigation(url)) {
      return false;
    }

    return true;
  }

  function beginTransition(url) {
    if (document.body.classList.contains("is-page-leaving")) {
      return;
    }

    document.body.classList.add("is-page-leaving");

    window.setTimeout(() => {
      window.location.href = url;
    }, 260);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");

    if (!link || prefersReducedMotion.matches || !shouldHandleLink(link, event)) {
      return;
    }

    event.preventDefault();
    beginTransition(link.href);
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("is-page-leaving");
  });
})();
