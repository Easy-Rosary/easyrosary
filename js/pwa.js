/* Registers the service worker (offline support) and shows an install button where the browser offers one. */
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is optional */ });
    });
  }

  var deferred = null;
  function setInstallButtons(visible) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-install]'), function (b) { b.hidden = !visible; });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    setInstallButtons(true);
  });

  document.addEventListener('click', function (e) {
    var button = e.target.closest && e.target.closest('[data-install]');
    if (!button || !deferred) return;
    var prompt = deferred;
    deferred = null;
    prompt.prompt();
    prompt.userChoice.then(function () { setInstallButtons(false); });
  });

  window.addEventListener('appinstalled', function () { setInstallButtons(false); });
})();