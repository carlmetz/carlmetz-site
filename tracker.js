// ============================================
// Tracker de trafic — carlmetz.fr
// ============================================
(function () {
  'use strict';

  var API_BASE = '/api/track.php';

  // Générer ou récupérer un visitorId persistant
  function getVisitorId() {
    var id = localStorage.getItem('_cm_vid');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('_cm_vid', id);
    }
    return id;
  }

  var visitorId = getVisitorId();

  // Envoyer un event au serveur
  function send(data) {
    try {
      var payload = JSON.stringify(data);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API_BASE, payload);
      } else {
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // Page view
  send({
    type: 'pageview',
    visitorId: visitorId,
    page: location.pathname,
    pageTitle: document.title,
    referrer: document.referrer || '',
    screenWidth: screen.width,
    screenHeight: screen.height,
    language: navigator.language || ''
  });

  // Heartbeat toutes les 30s
  function heartbeat() {
    send({
      type: 'heartbeat',
      visitorId: visitorId,
      page: location.pathname
    });
  }

  heartbeat();
  setInterval(heartbeat, 30000);
})();
