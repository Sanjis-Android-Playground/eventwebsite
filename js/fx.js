// FX controller: enable background motion only on interaction (prevents constant high CPU)
(function () {
  const body = document.body;
  let timer = null;

  function enableFxFor(ms = 4000) {
    body.classList.add('fx-on');
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => body.classList.remove('fx-on'), ms);
  }

  // Enable briefly when the user interacts
  const onFirstInteraction = () => enableFxFor(6000);

  // Desktop: mousemove/scroll indicates interaction
  window.addEventListener('mousemove', onFirstInteraction, { passive: true });
  window.addEventListener('scroll', onFirstInteraction, { passive: true });

  // Mobile: touch
  window.addEventListener('touchstart', onFirstInteraction, { passive: true });

  // Also provide a manual way from console:
  window.__enableFx = enableFxFor;
})();
