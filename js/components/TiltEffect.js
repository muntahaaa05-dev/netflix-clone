// Interactive 3D Tilt Physics and Specular Glare Effect
export function apply3dTilt(card) {
  if (!card || card.dataset.hasTilt) return;
  card.dataset.hasTilt = 'true';

  // Ensure 3D glare overlay exists
  let glare = card.querySelector('.card-3d-glare');
  if (!glare) {
    glare = document.createElement('div');
    glare.className = 'card-3d-glare';
    card.appendChild(glare);
  }

  let isHovered = false;

  card.addEventListener('mouseenter', () => {
    isHovered = true;
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease';
  });

  card.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Calculate 3D angles (-14 to +14 deg)
    const tiltX = (0.5 - y) * 22;
    const tiltY = (x - 0.5) * 22;

    card.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.06, 1.06, 1.06)`;

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0) 70%)`;
      glare.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    isHovered = false;
    card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glare) {
      glare.style.opacity = '0';
    }
  });
}

// 3D Parallax for Hero Billboard
export function initBillboard3dParallax() {
  const billboard = document.getElementById('hero-billboard');
  const content = document.querySelector('.billboard-content');
  if (!billboard || !content) return;

  billboard.addEventListener('mousemove', (e) => {
    const rect = billboard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    content.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(15px)`;
  });

  billboard.addEventListener('mouseleave', () => {
    content.style.transition = 'transform 0.5s ease-out';
    content.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
}
