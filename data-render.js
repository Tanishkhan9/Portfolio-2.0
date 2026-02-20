async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Fetch error');
    return await res.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

// Append certifications to existing list (preserve existing items)
async function loadCertifications() {
  const data = await fetchJSON('public/data/certifications.json');
  if (!data) return;
  const list = document.querySelector('.cert-list') || document.getElementById('cert-list');
  if (!list) return;

  const existing = Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim());
  data.certifications.forEach(cert => {
    if (!existing.includes(cert)) {
      const li = document.createElement('li');
      li.textContent = cert;
      list.appendChild(li);
    }
  });
}

// Load skills and append an "Additional Skills" category if present
async function loadSkills() {
  const data = await fetchJSON('public/data/skills.json');
  if (!data) return;
  const container = document.querySelector('.skills-container');
  if (!container) return;

  data.skills.forEach(category => {
    // Check if a category with same title exists
    const exists = Array.from(container.querySelectorAll('.skill-category h3')).some(h3 => h3.textContent.trim() === category.category);
    if (exists) {
      // append items to existing category
      const catEl = Array.from(container.querySelectorAll('.skill-category')).find(el => el.querySelector('h3').textContent.trim() === category.category);
      if (catEl) {
        category.items.forEach(item => {
          const skillItem = document.createElement('div');
          skillItem.className = 'skill-item';
          skillItem.innerHTML = `\n            <div class="skill-name">\n              <span>${item.name}</span>\n              <span>${item.level}</span>\n            </div>\n            <div class="skill-bar">\n              <div class="skill-progress" style="width: ${item.level};"></div>\n            </div>`;
          catEl.appendChild(skillItem);
        });
      }
    } else {
      // create new category
      const cat = document.createElement('div');
      cat.className = 'skill-category';
      const heading = document.createElement('h3');
      heading.textContent = category.category;
      cat.appendChild(heading);
      category.items.forEach(item => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `\n          <div class="skill-name">\n            <span>${item.name}</span>\n            <span>${item.level}</span>\n          </div>\n          <div class="skill-bar">\n            <div class="skill-progress" style="width: ${item.level};"></div>\n          </div>`;
        cat.appendChild(skillItem);
      });
      container.appendChild(cat);
    }
  });
}

// Load projects and append new ones
async function loadProjects() {
  const data = await fetchJSON('public/data/projects.json');
  if (!data) return;
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  const existingTitles = Array.from(grid.querySelectorAll('.project-card h3')).map(h => h.textContent.trim());
  data.projects.forEach(p => {
    if (!existingTitles.includes(p.title)) {
      const card = document.createElement('div');
      card.className = 'project-card';
      const links = [];
      if (p.live) links.push(`<a href="${p.live}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`);
      if (p.source) links.push(`<a href="${p.source}" target="_blank"><i class="fab fa-github"></i> Source Code</a>`);

      card.innerHTML = `\n        <h3>${p.title}</h3>\n        <p>${p.description}</p>\n        <div class="project-links">${links.join('')}</div>`;
      grid.appendChild(card);
    }
  });
}

// Initialize all dynamic loaders
document.addEventListener('DOMContentLoaded', () => {
  loadCertifications();
  loadSkills();
  loadProjects();
});

// tune animations for new UI
function animateInsertion(selector) {
  const root = document.querySelector(selector);
  if (!root) return;
  const items = root.querySelectorAll('li, .project-card, .skill-item, .achievement-card');
  items.forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(8px)';
    setTimeout(() => {
      node.style.transition = 'all 420ms cubic-bezier(.2,.9,.3,1)';
      node.style.opacity = '1';
      node.style.transform = 'none';
    }, 70 * i);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { animateInsertion('.cert-list'); animateInsertion('.projects-grid'); animateInsertion('#skills'); }, 300);
});

// Contact tab switching and query form handling
document.addEventListener('DOMContentLoaded', () => {
  const tabInfo = document.getElementById('tab-info');
  const tabQuery = document.getElementById('tab-query');
  const info = document.getElementById('contact-info');
  const query = document.getElementById('contact-query');

  if (tabInfo && tabQuery && info && query) {
    function showInfo() {
      info.style.display = '';
      query.style.display = 'none';
    }
    function showQuery() {
      info.style.display = 'none';
      query.style.display = '';
    }
    tabInfo.addEventListener('click', showInfo);
    tabQuery.addEventListener('click', showQuery);
  }

  const form = document.getElementById('query-form');
  const status = document.getElementById('query-status');
  const reset = document.getElementById('query-reset');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('q-name').value.trim();
      const email = document.getElementById('q-email').value.trim();
      const subject = document.getElementById('q-subject').value.trim() || 'Website Query';
      const message = document.getElementById('q-message').value.trim();
      if (!name || !email || !message) {
        status.textContent = 'Please fill required fields.';
        return;
      }

      // Fallback: open user's mail client with prefilled values using mailto
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailto = `mailto:coolkhantanish@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      // Try opening mailto; also show success message
      status.textContent = 'Opening mail client...';
      window.location.href = mailto;
      setTimeout(() => { status.textContent = 'If your mail client did not open, you can email: tanishkhan953@gmail.com'; }, 1500);
    });
    if (reset) reset.addEventListener('click', () => { form.reset(); status.textContent = ''; });
  }
});

// small enhancement: animate newly added cert/project/skill entries when inserted
function animateInsertion(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.querySelectorAll('li, .project-card, .skill-item, .achievement-card').forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(12px)';
    setTimeout(() => {
      node.style.transition = 'all 500ms cubic-bezier(.2,.9,.3,1)';
      node.style.opacity = '';
      node.style.transform = '';
    }, 80 * i);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { animateInsertion('.cert-list'); animateInsertion('.projects-grid'); animateInsertion('#skills'); }, 400);
});
