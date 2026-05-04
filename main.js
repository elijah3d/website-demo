const canvas = document.getElementById('space');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

// ─── STARS ───
const STARS = 3000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(STARS * 3);
for (let i = 0; i < STARS; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 100;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
  color: 0xffffff, size: 0.07, sizeAttenuation: true,
  transparent: true, opacity: 0.75,
}));
scene.add(stars);

// ─── NEBULA ───
const NEB = 200;
const nebGeo = new THREE.BufferGeometry();
const nebPos = new Float32Array(NEB * 3);
const nebCol = new Float32Array(NEB * 3);
for (let i = 0; i < NEB; i++) {
  nebPos[i * 3] = (Math.random() - 0.5) * 40;
  nebPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
  nebPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 15;
  const hue = Math.random() > 0.5 ? 0.78 : 0.5;
  const c = new THREE.Color().setHSL(hue, 0.6, 0.4);
  nebCol[i * 3] = c.r; nebCol[i * 3 + 1] = c.g; nebCol[i * 3 + 2] = c.b;
}
nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
nebGeo.setAttribute('color', new THREE.BufferAttribute(nebCol, 3));
const nebula = new THREE.Points(nebGeo, new THREE.PointsMaterial({
  size: 0.45, sizeAttenuation: true, transparent: true, opacity: 0.12,
  vertexColors: true, blending: THREE.AdditiveBlending,
}));
scene.add(nebula);

// ─── COSMIC STRINGS ───
const stringsGroup = new THREE.Group();
scene.add(stringsGroup);
for (let i = 0; i < 25; i++) {
  const s = new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 15);
  const e = new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 15);
  const m = new THREE.Vector3().lerpVectors(s, e, 0.5);
  m.x += (Math.random() - 0.5) * 6; m.y += (Math.random() - 0.5) * 6;
  const curve = new THREE.QuadraticBezierCurve3(s, m, e);
  stringsGroup.add(new THREE.Mesh(
    new THREE.TubeGeometry(curve, 20, 0.006 + Math.random() * 0.01, 4, false),
    new THREE.MeshBasicMaterial({
      color: Math.random() > 0.4 ? 0x9D00FF : 0x00FFFF,
      transparent: true, opacity: 0.15 + Math.random() * 0.2,
      blending: THREE.AdditiveBlending,
    })
  ));
}

// ─── PLANET GROUP ───
const planetGroup = new THREE.Group();
scene.add(planetGroup);

const planetRotator = new THREE.Group();
planetGroup.add(planetRotator);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0x1a0a3e, roughness: 0.6, metalness: 0.3,
    emissive: 0x1a0a3e, emissiveIntensity: 0.4,
  })
);
planetRotator.add(planet);

const wireframe = new THREE.Mesh(
  new THREE.SphereGeometry(1.22, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x9D00FF, wireframe: true, transparent: true, opacity: 0.06 })
);
planetRotator.add(wireframe);

const ring1 = new THREE.Mesh(
  new THREE.RingGeometry(1.7, 2.3, 64),
  new THREE.MeshBasicMaterial({
    color: 0x9D00FF, transparent: true, opacity: 0.1,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  })
);
ring1.rotation.x = Math.PI * 0.4;
ring1.rotation.y = Math.PI * 0.1;
planetRotator.add(ring1);

const ring2 = new THREE.Mesh(
  new THREE.RingGeometry(2.0, 2.15, 64),
  new THREE.MeshBasicMaterial({
    color: 0x00FFFF, transparent: true, opacity: 0.05,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  })
);
ring2.rotation.x = Math.PI * 0.55;
ring2.rotation.y = Math.PI * 0.3;
planetRotator.add(ring2);

const atmo = new THREE.Mesh(
  new THREE.SphereGeometry(1.38, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x9D00FF, transparent: true, opacity: 0.1,
    side: THREE.BackSide, blending: THREE.AdditiveBlending,
  })
);
planetGroup.add(atmo);

const glow = new THREE.Mesh(
  new THREE.SphereGeometry(1.55, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x00FFFF, transparent: true, opacity: 0.03,
    side: THREE.BackSide, blending: THREE.AdditiveBlending,
  })
);
planetGroup.add(glow);

planetGroup.position.set(3, -0.5, -5);

// ─── BOOKS ON PLANET ───

const booksData = [
  {
    name: 'The Glowing Earth',
    price: '\u20AC6.00',
    texture: 'assets/glowing-earth.png',
    url: 'product-glowing-earth.html',
    phi: Math.PI * 0.45, theta: 0.4,
  },
  {
    name: 'Dimensions',
    price: '\u20AC10.00',
    texture: 'assets/dimensions.png',
    url: 'product-dimensions.html',
    phi: Math.PI * 0.4, theta: 2.1,
  },
  {
    name: 'Too Good to Be Bad?',
    price: '\u20AC7.00',
    texture: 'assets/too-good.png',
    url: 'product-too-good.html',
    phi: Math.PI * 0.35, theta: -1.7,
  },
  {
    name: 'Tell Me More My Little Star',
    price: '\u20AC3.00',
    texture: 'assets/little-star.png',
    url: 'product-little-star.html',
    phi: Math.PI * 0.6, theta: Math.PI,
  },
];

const bookMeshes = [];
const bookGlowMeshes = [];

booksData.forEach((book, i) => {
  const r = 1.5;
  const pos = new THREE.Vector3().setFromSphericalCoords(r, book.phi, book.theta);

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x9D00FF, transparent: true, opacity: 0.0,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  });
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.75), glowMat);
  glowMesh.position.copy(pos.clone().normalize().multiplyScalar(r * 0.95));
  glowMesh.lookAt(0, 0, 0);
  glowMesh.rotateY(Math.PI);
  planetRotator.add(glowMesh);
  bookGlowMeshes.push(glowMesh);

  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.0,
    side: THREE.DoubleSide, depthWrite: false,
  });

  const htmlImg = document.getElementById('book-tex-' + i);
  if (htmlImg) {
    function applyTex() {
      const tex = new THREE.Texture(htmlImg);
      tex.needsUpdate = true;
      mat.map = tex;
      mat.needsUpdate = true;
    }
    if (htmlImg.complete && htmlImg.naturalWidth > 0) {
      applyTex();
    } else {
      htmlImg.addEventListener('load', applyTex);
    }
  }

  const bookMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.55), mat);
  bookMesh.position.copy(pos);
  bookMesh.lookAt(0, 0, 0);
  bookMesh.rotateY(Math.PI);
  bookMesh.userData = {
    url: book.url,
    name: book.name,
    price: book.price,
    isBook: true,
    baseY: pos.y,
    index: i,
  };
  bookMeshes.push(bookMesh);
  planetRotator.add(bookMesh);
});

// ─── LIGHTS ───
scene.add(new THREE.AmbientLight(0x1a0a3e, 0.5));
const mainLight = new THREE.PointLight(0xffffff, 1.2, 100);
mainLight.position.set(5, 3, 5);
scene.add(mainLight);
const purpleLight = new THREE.PointLight(0x9D00FF, 1.5, 50);
purpleLight.position.set(-5, 2, 3);
scene.add(purpleLight);
const blueLight = new THREE.PointLight(0x00FFFF, 1, 50);
blueLight.position.set(5, -2, -3);
scene.add(blueLight);

// ─── RAYCASTER ───
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();

// ─── PLANET INTERACTION STATE ───
let planetActive = false;
let planetScaleCurrent = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragTotal = 0;
let accRotY = 0;
let accRotX = 0;
let velY = 0;
let velX = 0;
let hoveredBook = null;
let bookOpacity = 0;

const tooltip = document.getElementById('bookTooltip');
const planetSection = document.getElementById('section-planet');

const AMBIENT_POS = new THREE.Vector3(3, -0.5, -5);
const ACTIVE_POS = new THREE.Vector3(0, 0, -3);
const AMBIENT_SCALE = 0.8;
const ACTIVE_SCALE = 1.6;

if (planetSection) {
  let savedScrollY = 0;
  let planetLocked = false;

  function lockForPlanet() {
    savedScrollY = window.scrollY;
    planetLocked = true;
  }

  function unlockFromPlanet(targetEl) {
    planetLocked = false;
    planetSection.classList.remove('active');
    canvas.classList.remove('interactive');
    planetActive = false;
    isDragging = false;
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  const planetObserver = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !planetLocked) {
      planetActive = true;
      planetSection.classList.add('active');
      canvas.classList.add('interactive');
      lockForPlanet();
    } else if (!visible && !planetLocked) {
      planetActive = false;
      planetSection.classList.remove('active');
      canvas.classList.remove('interactive');
      isDragging = false;
    }
  }, { threshold: 0.4 });
  planetObserver.observe(planetSection);

  const scrollUp = document.getElementById('planetScrollUp');
  const scrollDown = document.getElementById('planetScrollDown');

  if (scrollUp) {
    scrollUp.addEventListener('click', (e) => {
      e.stopPropagation();
      let prev = planetSection.previousElementSibling;
      while (prev && prev.classList && !prev.classList.contains('panel')) prev = prev.previousElementSibling;
      if (!prev) prev = document.querySelector('.scroll-container section:first-child');
      unlockFromPlanet(prev);
    });
  }

  if (scrollDown) {
    scrollDown.addEventListener('click', (e) => {
      e.stopPropagation();
      let next = planetSection.nextElementSibling;
      while (next && next.tagName === 'DIV') next = next.nextElementSibling;
      if (!next) next = planetSection.nextElementSibling;
      unlockFromPlanet(next);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!planetLocked) return;
    if (e.key === 'Escape') {
      unlockFromPlanet(planetSection.nextElementSibling);
    }
  });
}

// ─── SCROLL PROGRESS BAR ───
const progressBar = document.getElementById('scrollProgress');
function updateProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0 && progressBar) {
    progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
  }
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ─── SECTION REVEAL (per-element staggered) ───
const animateElements = document.querySelectorAll('[data-animate]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
animateElements.forEach((el) => revealObserver.observe(el));

// ─── SCROLL PARALLAX ───
const parallaxElements = document.querySelectorAll('[data-parallax]');
let scrollTicking = false;
function updateParallax() {
  const scrollY = window.pageYOffset;
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.03;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const offset = (centerY - window.innerHeight / 2) * speed;
    el.style.transform = 'translateY(' + (-offset) + 'px)';
  });
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateParallax);
    scrollTicking = true;
  }
}, { passive: true });

// ─── PROMO POPUP ───
(function() {
  var popup = document.getElementById('promoPopup');
  if (!popup) return;
  if (sessionStorage.getItem('popup_dismissed')) { popup.remove(); return; }

  var closeBtn = document.getElementById('popupClose');

  function closePopup() {
    popup.classList.remove('active');
    sessionStorage.setItem('popup_dismissed', '1');
    setTimeout(function() { popup.remove(); }, 400);
  }

  setTimeout(function() { popup.classList.add('active'); }, 2500);

  closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closePopup(); });
  popup.addEventListener('click', function(e) { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });
})();

// ─── MOUSE / TOUCH EVENTS ───
function updateNDC(x, y) {
  mouseNDC.x = (x / window.innerWidth) * 2 - 1;
  mouseNDC.y = -(y / window.innerHeight) * 2 + 1;
}

let isTouchDevice = false;

function handleDown(x, y, isTouch) {
  if (!planetActive) return;
  if (isTouch) isTouchDevice = true;
  updateNDC(x, y);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObject(planet, false);
  const bookHits = raycaster.intersectObjects(bookMeshes, false);
  if (hits.length > 0 || bookHits.length > 0 || (isTouch && planetActive)) {
    isDragging = true;
    dragStart = { x, y };
    dragTotal = 0;
  }
}

function handleMove(x, y) {
  if (isDragging) {
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    dragTotal += Math.abs(dx) + Math.abs(dy);
    velY = dx * 0.006;
    velX = dy * 0.003;
    accRotY += velY;
    accRotX += velX;
    accRotX = Math.max(-0.8, Math.min(0.8, accRotX));
    dragStart = { x, y };
  }

  if (!planetActive) { hoveredBook = null; return; }

  updateNDC(x, y);
  raycaster.setFromCamera(mouseNDC, camera);
  const bookHits = raycaster.intersectObjects(bookMeshes, false);
  if (bookHits.length > 0) {
    hoveredBook = bookHits[0].object;
    canvas.style.cursor = 'pointer';
  } else {
    hoveredBook = null;
    if (isDragging) {
      canvas.style.cursor = 'grabbing';
    } else {
      const pHits = raycaster.intersectObject(planet, false);
      canvas.style.cursor = pHits.length > 0 ? 'grab' : '';
    }
  }
}

function handleUp(x, y) {
  const clickThreshold = isTouchDevice ? 15 : 6;
  if (isDragging && dragTotal < clickThreshold && planetActive) {
    updateNDC(x, y);
    raycaster.setFromCamera(mouseNDC, camera);
    const bookHits = raycaster.intersectObjects(bookMeshes, false);
    if (bookHits.length > 0) {
      window.open(bookHits[0].object.userData.url, '_blank');
    }
  }
  isDragging = false;
  canvas.style.cursor = hoveredBook ? 'pointer' : '';
}

document.addEventListener('mousedown', (e) => {
  handleDown(e.clientX, e.clientY, false);
  if (isDragging) e.preventDefault();
});
document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
document.addEventListener('mouseup', (e) => handleUp(e.clientX, e.clientY));

canvas.addEventListener('touchstart', (e) => {
  if (planetActive && e.touches.length === 1) {
    e.preventDefault();
    handleDown(e.touches[0].clientX, e.touches[0].clientY, true);
  }
}, { passive: false });
document.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });
document.addEventListener('touchend', (e) => {
  const t = e.changedTouches[0];
  handleUp(t.clientX, t.clientY);
});

// ─── MOUSE PARALLAX ───
window.addEventListener('mousemove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ─── RESIZE ───
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── MOBILE MENU ───
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');
if (mobileToggle && mainNav) {
  mobileToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

// ─── ANIMATION ───
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  mouse.x += (mouse.targetX - mouse.x) * 0.04;
  mouse.y += (mouse.targetY - mouse.y) * 0.04;

  stars.rotation.y = t * 0.006;
  stars.rotation.x = t * 0.002;
  nebula.rotation.y = t * 0.004;
  stringsGroup.rotation.y = t * 0.008;

  // ─── planet position & scale ───
  const targetPos = planetActive ? ACTIVE_POS : AMBIENT_POS;
  const targetScale = planetActive ? ACTIVE_SCALE : AMBIENT_SCALE;

  planetGroup.position.x += (targetPos.x - planetGroup.position.x) * 0.035;
  planetGroup.position.y += (targetPos.y - planetGroup.position.y) * 0.035;
  planetGroup.position.z += (targetPos.z - planetGroup.position.z) * 0.035;

  if (!planetActive) {
    planetGroup.position.x += (mouse.x * 0.6 - planetGroup.position.x) * 0.01;
    planetGroup.position.y += (mouse.y * 0.4 - planetGroup.position.y) * 0.01;
  }

  planetScaleCurrent += (targetScale - planetScaleCurrent) * 0.035;
  planetGroup.scale.setScalar(Math.max(0.001, planetScaleCurrent));

  // ─── planet rotation ───
  if (!isDragging) {
    accRotY += velY;
    accRotX += velX;
    accRotX = Math.max(-0.8, Math.min(0.8, accRotX));
    velY *= 0.95;
    velX *= 0.92;
    if (Math.abs(velY) < 0.0001) velY = 0;
    if (Math.abs(velX) < 0.0001) velX = 0;
    if (velY === 0) {
      accRotY += planetActive ? 0.0015 : 0.003;
    }
  }
  planetRotator.rotation.y = accRotY;
  planetRotator.rotation.x = accRotX;

  wireframe.rotation.y = t * 0.02;
  ring1.rotation.z = t * 0.04;
  ring2.rotation.z = -t * 0.03;
  atmo.material.opacity = 0.08 + Math.sin(t * 0.8) * 0.03;

  // ─── book opacity ───
  const targetBookOp = planetActive ? 1 : 0;
  bookOpacity += (targetBookOp - bookOpacity) * 0.04;

  bookMeshes.forEach((bm, i) => {
    bm.material.opacity = bookOpacity;
    bm.position.y = bm.userData.baseY + Math.sin(t * 1.5 + i * 1.5) * 0.02;
  });

  bookGlowMeshes.forEach((gm, i) => {
    const isHovered = hoveredBook === bookMeshes[i];
    const targetOp = isHovered ? 0.25 * bookOpacity : 0.08 * bookOpacity;
    gm.material.opacity += (targetOp - gm.material.opacity) * 0.1;
    const dir = gm.position.clone().normalize();
    const bookPos = bookMeshes[i].position;
    gm.position.copy(dir.multiplyScalar(bookPos.length() * 0.95));
    gm.position.y = bookMeshes[i].position.y * 0.95;
    const targetScale = isHovered ? 1.2 : 1.0;
    gm.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
  });

  // ─── tooltip ───
  if (tooltip && hoveredBook && planetActive && bookOpacity > 0.5) {
    const worldPos = new THREE.Vector3();
    hoveredBook.getWorldPosition(worldPos);
    const screenPos = worldPos.clone().project(camera);
    const sx = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
    tooltip.style.display = 'block';
    tooltip.style.left = sx + 'px';
    tooltip.style.top = (sy - 55) + 'px';
    tooltip.textContent = hoveredBook.userData.name + '  ' + hoveredBook.userData.price;
  } else if (tooltip) {
    tooltip.style.display = 'none';
  }

  // ─── camera ───
  camera.position.x += (mouse.x * 0.1 - camera.position.x) * 0.02;
  camera.position.y += (mouse.y * 0.06 - camera.position.y) * 0.02;
  camera.lookAt(0, 0, 0);

  purpleLight.intensity = 1.2 + Math.sin(t * 0.8) * 0.3;
  blueLight.intensity = 0.8 + Math.cos(t * 0.6) * 0.2;

  renderer.render(scene, camera);
}

animate();
