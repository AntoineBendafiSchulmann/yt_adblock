let adInterval = null;
let observer = null;

function showToast(text, type = 'default') {
  const toast = document.createElement('div');
  toast.innerText = text;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.left = '20px';
  toast.style.padding = '6px 12px';
  toast.style.color = 'black';
  toast.style.fontWeight = 'bold';
  toast.style.zIndex = '9999';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.5s ease';
  toast.style.background = type === 'skip' ? 'gold' : type === 'click' ? '#4caf50' : '#ccc';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 1200);
}

function clickForce(btn) {
  if (!btn) return;
  btn.style.outline = '2px solid gold';
  btn.style.background = 'rgba(255,215,0,0.3)';
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  btn.dispatchEvent(event);
  showToast('⏩ Bouton "Ignorer" cliqué', 'click');
}

function trySkipAd() {
  const skipBtn = document.querySelector('.ytp-skip-ad-button');
  if (skipBtn && skipBtn.offsetParent !== null) {
    clickForce(skipBtn);
    return true;
  }
  return false;
}

function removeOverlays() {
  const overlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-module, #player-ads');
  overlays.forEach(el => {
    el.style.outline = '2px solid gold';
    el.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    setTimeout(() => el.remove(), 100);
  });
}

function handleAd() {
  const player = document.querySelector('.html5-video-player');
  const video = player?.querySelector('video');
  const isAd = player?.classList.contains('ad-showing');

  if (isAd && video) {
    if (
      video.duration &&
      isFinite(video.duration) &&
      !isNaN(video.duration) &&
      video.duration < 60 &&
      video.currentTime < video.duration - 0.5
    ) {
      video.currentTime = video.duration;
      showToast('🔥 Pub sautée', 'skip');
    }

    removeOverlays();
    if (trySkipAd()) return;

    video.muted = true;
    player.style.outline = '3px solid gold';
    setTimeout(() => player.style.outline = '', 300);
  }
}

function startBlocking() {
  if (adInterval) return;
  adInterval = setInterval(handleAd, 100);

  observer = new MutationObserver(() => {
    handleAd();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function stopBlocking() {
  if (adInterval) clearInterval(adInterval);
  if (observer) observer.disconnect();
  adInterval = null;
  observer = null;
}

chrome.storage.local.get(['adsEnabled'], (result) => {
  if (result.adsEnabled !== false) startBlocking();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.adsEnabled === true) startBlocking();
  if (msg.adsEnabled === false) stopBlocking();
});