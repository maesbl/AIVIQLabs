const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let time = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const base = Math.min(140, Math.floor((canvas.width + canvas.height) / 24));
  particles = Array.from({ length: base }, (_, index) => {
    const angle = (index / base) * Math.PI * 2;
    const radius = Math.random() * (canvas.width * 0.25) + 120;
    return {
      baseX: canvas.width / 2 + Math.cos(angle) * radius,
      baseY: canvas.height / 2 + Math.sin(angle) * radius,
      offset: Math.random() * Math.PI * 2,
      speed: 0.0015 + Math.random() * 0.0025,
      size: Math.random() * 2 + 1.2,
      hue: 180 + Math.random() * 80,
    };
  });
}

function drawParticles(delta) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";
  particles.forEach((particle, idx) => {
    const angle = time * particle.speed + particle.offset;
    const radius = 40 + Math.sin(time * 0.001 + idx) * 20;
    const x = particle.baseX + Math.cos(angle) * radius;
    const y = particle.baseY + Math.sin(angle) * radius;

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 8);
    gradient.addColorStop(0, `hsla(${particle.hue}, 90%, 65%, 0.8)`);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.arc(x, y, particle.size * 5, 0, Math.PI * 2);
    ctx.fill();

    particles.forEach((target, indexB) => {
      if (indexB <= idx) return;
      const angleB = time * target.speed + target.offset;
      const radiusB = 40 + Math.sin(time * 0.001 + indexB) * 20;
      const tx = target.baseX + Math.cos(angleB) * radiusB;
      const ty = target.baseY + Math.sin(angleB) * radiusB;
      const dist = Math.hypot(tx - x, ty - y);
      if (dist < 180) {
        const opacity = (1 - dist / 180) * 0.2;
        ctx.strokeStyle = `hsla(${(particle.hue + target.hue) / 2}, 90%, 65%, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    });
  });
  ctx.globalCompositeOperation = "source-over";
}

let lastTimestamp = 0;
function animate(timestamp) {
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  time += delta;
  drawParticles(delta);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(animate);

// Intersection Observer for reveals
const revealTargets = document.querySelectorAll("[data-animate]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

revealTargets.forEach(target => observer.observe(target));

// Subtle tilt hover effect
const tiltElements = document.querySelectorAll("[data-tilt]");
tiltElements.forEach(element => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    element.classList.add("hovered");
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
    element.classList.remove("hovered");
  });
});
