const pinLayer = document.querySelector('.pin-layer');
const mapImage = document.querySelector('.map-img');
const notifyBtn = document.querySelector('.notify-btn');

// LocalStorage からピンを読み込む
const loadPins = () => {
  const pins = JSON.parse(localStorage.getItem('pins') || '[]');
  pins.forEach((pin) => addPinToDOM(pin.x, pin.y));
};

const savePins = () => {
  const pins = [...document.querySelectorAll('.pin')].map((pin) => ({
    x: parseFloat(pin.style.left),
    y: parseFloat(pin.style.top),
  }));
  localStorage.setItem('pins', JSON.stringify(pins));
};

const addPinToDOM = (x, y) => {
  const pin = document.createElement('div');
  pin.className = 'pin';
  pin.style.left = `${x}%`;
  pin.style.top = `${y}%`;

  pin.addEventListener('click', (e) => {
    e.stopPropagation();
    pin.remove();
    savePins();
  });

  pinLayer.appendChild(pin);
};

// ピンを追加
pinLayer.addEventListener('click', (e) => {
  const rect = pinLayer.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  addPinToDOM(x, y);
  savePins();
});

// 通知
notifyBtn.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    alert('通知に対応していません');
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification('✉️ モック通知が届きました！', {
        body: 'これはモック通知です',
        requireInteraction: true,
      });
    } catch (error) {
      console.error('通知表示エラー:', error);
    }
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        new Notification('✉️ モック通知が届きました！', {
          body: 'これはモック通知です',
          requireInteraction: true,
        });
      } catch (error) {
        console.error('通知表示エラー:', error);
      }
    }
  }
});

// Service Worker 登録
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('SW 登録成功');
  });
}

// 初期化
window.addEventListener('DOMContentLoaded', loadPins);
