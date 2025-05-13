const piercingList = document.getElementById('piercing-list');
const cameraContainer = document.getElementById('camera-container');
const video = document.getElementById('video');
const overlay = document.getElementById('piercing-overlay');
const closeBtn = document.getElementById('close-btn');

// Fetch piercings from backend
fetch('http://10.0.2.2:3000/piercings')
  .then(res => res.json())
  .then(data => {
    data.forEach(p => {
      const card = document.createElement('div');
      card.className = 'piercing-card';

      card.innerHTML = `
        <img src="${p.image_url}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>${p.price}€</p>
        <button onclick="tryPiercing('${p.image_url}')">Try</button>
      `;

      piercingList.appendChild(card);
    });
  });

window.tryPiercing = function(url) {
  overlay.src = url;
  cameraContainer.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    });
};

closeBtn.addEventListener('click', () => {
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  video.srcObject = null;
  cameraContainer.classList.add('hidden');
});
