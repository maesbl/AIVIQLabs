const wrapper = document.getElementById('globe-wrapper');
const hero = document.getElementById('hero');

let globeWidth = wrapper.clientWidth;
let globeHeight = wrapper.clientHeight;

const myGlobe = Globe()(wrapper)
  .width(globeWidth)
  .height(globeHeight)
  .backgroundColor('rgba(0,0,0,0)')
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .showAtmosphere(true)
  .atmosphereColor('#ffffff')
  .atmosphereAltitude(0.15);

/* ORIGEN */
const ORIGIN = { lat: 40.4168, lng: -3.7038 }; // Madrid

/* DESTINOS */
const DESTINATIONS = [
  { lat: 40.7128, lng: -74.0060 },   // New York
  { lat: 37.7749, lng: -122.4194 },  // San Francisco
  { lat: 43.6150, lng: -116.2023 },  // Boise
  { lat: 51.5074, lng: -0.1278 },    // London
  { lat: 35.6895, lng: 139.6917 },   // Tokyo
  { lat: 1.3521, lng: 103.8198 },    // Singapore
  { lat: -23.5505, lng: -46.6333 },  // Sao Paulo
  { lat: -33.8688, lng: 151.2093 }   // Sydney
];

const arcsData = DESTINATIONS.map(dest => ({
  startLat: ORIGIN.lat,
  startLng: ORIGIN.lng,
  endLat: dest.lat,
  endLng: dest.lng,
  color: '#ffffff'
}));

myGlobe
  .arcsData(arcsData)
  .arcColor('color')
  .arcDashLength(0.4)
  .arcDashGap(1.5)
  .arcDashInitialGap(() => Math.random() * 5)
  .arcDashAnimateTime(2500)
  .arcStroke(1.2)
  .arcAltitudeAutoScale(0.4);

const ringsData = [ORIGIN, ...DESTINATIONS];

myGlobe
  .ringsData(ringsData)
  .ringColor(() => '#ffffff')
  .ringMaxRadius(4)
  .ringPropagationSpeed(3)
  .ringRepeatPeriod(800);

/* Cámara */
myGlobe.pointOfView({ lat: 35, lng: -30, altitude: 2.2 });

/* Rotación */
myGlobe.controls().autoRotate = true;
myGlobe.controls().autoRotateSpeed = 0.8;
myGlobe.controls().enableZoom = false;

/* Fade-out del globo según scroll (desaparece al bajar) */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function updateGlobeFade() {
  const rect = hero.getBoundingClientRect();
  const heroHeight = rect.height || window.innerHeight;

  // Progreso del scroll dentro del hero: 0 (arriba) -> 1 (hero fuera)
  const scrolled = clamp((0 - rect.top) / (heroHeight * 0.85), 0, 1);

  // Opacidad: visible al inicio, se desvanece suavemente
  const opacity = 1 - scrolled;
  wrapper.style.opacity = String(opacity);

  // Pequeño desplazamiento para sensación premium
  wrapper.style.transform = `translateY(${scrolled * 18}px)`;
}

// Llama una vez y en scroll
updateGlobeFade();
window.addEventListener('scroll', updateGlobeFade, { passive: true });

/* Responsive */
window.addEventListener('resize', () => {
  globeWidth = wrapper.clientWidth;
  globeHeight = wrapper.clientHeight;
  myGlobe.width(globeWidth).height(globeHeight);
  updateGlobeFade();
});