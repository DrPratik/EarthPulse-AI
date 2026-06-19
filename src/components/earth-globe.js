import * as THREE from 'three';

export function createEarthGlobe(container) {
  const width = container.clientWidth || 500;
  const height = container.clientHeight || 500;
  const size = Math.min(width, height, 500);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 2.8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(size, size);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.borderRadius = '50%';

  // Create Earth sphere with procedural texture
  const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

  // Create a canvas-based texture for realistic Earth
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 2048;
  texCanvas.height = 1024;
  const ctx = texCanvas.getContext('2d');

  // Draw ocean base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#1a4b7a');
  oceanGrad.addColorStop(0.3, '#1565c0');
  oceanGrad.addColorStop(0.5, '#1976d2');
  oceanGrad.addColorStop(0.7, '#1565c0');
  oceanGrad.addColorStop(1, '#0d3b66');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Draw simplified continents (Mercator-ish projection)
  ctx.fillStyle = '#2e7d32';
  
  // North America
  drawContinent(ctx, [
    [200, 150], [280, 120], [350, 130], [380, 160], [400, 200],
    [420, 250], [400, 300], [380, 340], [350, 380], [320, 400],
    [300, 420], [270, 430], [240, 410], [220, 380], [200, 350],
    [180, 320], [170, 280], [175, 240], [180, 200], [190, 170],
  ]);

  // South America
  drawContinent(ctx, [
    [350, 480], [380, 460], [400, 470], [420, 500], [430, 550],
    [435, 600], [430, 650], [420, 700], [400, 740], [380, 770],
    [360, 780], [340, 760], [330, 720], [325, 680], [320, 640],
    [325, 600], [330, 560], [335, 520],
  ]);

  // Europe
  drawContinent(ctx, [
    [900, 160], [950, 150], [1000, 155], [1040, 170], [1060, 200],
    [1050, 240], [1030, 270], [1000, 290], [970, 300], [940, 290],
    [920, 270], [910, 240], [900, 210], [895, 180],
  ]);

  // Africa
  drawContinent(ctx, [
    [920, 340], [960, 320], [1010, 320], [1050, 340], [1070, 380],
    [1080, 430], [1085, 480], [1080, 540], [1070, 600], [1050, 650],
    [1020, 690], [990, 710], [960, 700], [940, 670], [930, 630],
    [920, 580], [915, 530], [910, 480], [905, 430], [910, 380],
  ]);

  // Asia
  ctx.fillStyle = '#33813a';
  drawContinent(ctx, [
    [1060, 150], [1120, 130], [1200, 120], [1300, 110], [1400, 120],
    [1480, 140], [1550, 160], [1600, 200], [1630, 250], [1640, 300],
    [1620, 350], [1580, 380], [1530, 400], [1470, 410], [1400, 400],
    [1350, 420], [1300, 450], [1280, 420], [1250, 380], [1200, 350],
    [1150, 320], [1100, 300], [1080, 260], [1060, 220], [1055, 180],
  ]);

  // India
  ctx.fillStyle = '#2e7d32';
  drawContinent(ctx, [
    [1250, 380], [1280, 360], [1310, 370], [1320, 400], [1330, 440],
    [1320, 480], [1300, 510], [1280, 520], [1260, 500], [1250, 460],
    [1245, 420],
  ]);

  // Australia
  ctx.fillStyle = '#c17b2a';
  drawContinent(ctx, [
    [1500, 580], [1560, 560], [1620, 570], [1660, 590], [1680, 630],
    [1670, 670], [1640, 700], [1600, 710], [1550, 700], [1510, 680],
    [1490, 650], [1485, 620],
  ]);

  // Add some noise/variation
  const imageData = ctx.getImageData(0, 0, 2048, 1024);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15;
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
    imageData.data[i+1] = Math.max(0, Math.min(255, imageData.data[i+1] + noise));
    imageData.data[i+2] = Math.max(0, Math.min(255, imageData.data[i+2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Add ice caps
  ctx.fillStyle = 'rgba(220, 235, 245, 0.8)';
  ctx.fillRect(0, 0, 2048, 60);
  ctx.fillRect(0, 970, 2048, 54);

  const earthTexture = new THREE.CanvasTexture(texCanvas);
  earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpScale: 0.05,
    specular: new THREE.Color(0x333333),
    shininess: 15,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 0.6) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);

  // Cloud layer
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024;
  cloudCanvas.height = 512;
  const cctx = cloudCanvas.getContext('2d');
  cctx.fillStyle = 'rgba(0,0,0,0)';
  cctx.fillRect(0, 0, 1024, 512);
  
  // Generate cloud patterns
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 40 + 10;
    const grad = cctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.25)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    cctx.fillStyle = grad;
    cctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.015, 48, 48), cloudMaterial);
  scene.add(clouds);

  // Lighting
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
  scene.add(ambientLight);

  const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
  rimLight.position.set(-5, 0, -5);
  scene.add(rimLight);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let rotVelX = 0, rotVelY = 0;

  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      rotVelY += (e.clientX - prevMouseX) * 0.005;
      rotVelX += (e.clientY - prevMouseY) * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Animation
  let autoRotate = true;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (!isDragging) {
      earth.rotation.y += 0.002;
      rotVelX *= 0.95;
      rotVelY *= 0.95;
    }

    earth.rotation.y += rotVelX;
    earth.rotation.x += rotVelY;
    earth.rotation.x = Math.max(-0.5, Math.min(0.5, earth.rotation.x));

    clouds.rotation.y = earth.rotation.y + 0.001;
    clouds.rotation.x = earth.rotation.x * 0.5;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 500;
    const s = Math.min(w, h, 500);
    renderer.setSize(s, s);
  });
  resizeObserver.observe(container);

  return { scene, earth, renderer, camera };
}

function drawContinent(ctx, points) {
  if (points.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const xc = (points[i][0] + points[Math.min(i+1, points.length-1)][0]) / 2;
    const yc = (points[i][1] + points[Math.min(i+1, points.length-1)][1]) / 2;
    ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc);
  }
  ctx.closePath();
  ctx.fill();
}
