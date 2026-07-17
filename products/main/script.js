const nav = document.querySelector('.glass-nav');
const menuToggle = document.querySelector('.menu-toggle');
const links = [...document.querySelectorAll('.project-nav a')];
const projects = [...document.querySelectorAll('[data-project]')];
const revealSections = [...document.querySelectorAll('.intro, .project')];

const updateDepth = () => {
  nav.classList.toggle('is-deep', window.scrollY > window.innerHeight * 0.72);
  const start = window.innerHeight * 0.78;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, maxScroll - start)));
  const eased = Math.pow(progress, 0.82);
  const from = [39, 76, 99];
  const to = [7, 23, 34];
  const color = from.map((channel, index) => Math.round(channel + (to[index] - channel) * eased));
  document.documentElement.style.setProperty('--scroll-depth', `rgb(${color.join(', ')})`);
  document.documentElement.style.setProperty('--page-progress', String(window.scrollY / maxScroll));
};

const setMenu = (open) => {
  nav.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Закрыть' : 'Меню';
};

menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
links.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenu(false);
});

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const activeId = visible.target.dataset.project;
  links.forEach((link) => {
    const isActive = link.dataset.section === activeId;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { threshold: [0.25, 0.5, 0.75] });

projects.forEach((project) => observer.observe(project));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

revealSections.forEach((section) => {
  section.classList.add('reveal-ready');
  revealObserver.observe(section);
});
window.addEventListener('scroll', updateDepth, { passive: true });
updateDepth();
