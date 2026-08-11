// ============================================================
// CONTENT RENDERERS — turn GAME_CONTENT into HTML strings for
// the retro windows. Keeps RoomScene.js free of markup.
// ============================================================

const Renderers = {

  desktop() {
    const icons = [
      { label: 'About Me', action: 'about' },
      { label: 'Education', action: 'education' },
      { label: 'Projects', action: 'projects' },
      { label: 'Experience', action: 'experience' },
      { label: 'Skills', action: 'skills' },
      { label: 'Contact', action: 'contact' },
      { label: 'Achievements', action: 'achievements' }
    ];
    return `
      <div class="desktop-grid">
        ${icons.map(i => `
          <div class="desktop-icon" data-action="${i.action}">
            <div class="desktop-icon-glyph"></div>
            <span>${i.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  projects() {
    const p = GAME_CONTENT.project;
    return `
      <h3 class="retro-h">QUEST: ${p.title}</h3>
      <p class="retro-meta">Difficulty: ${'★'.repeat(4)}${'☆'.repeat(1)} (${p.difficulty}) — Status: ${p.status}</p>
      <p>${p.description}</p>
      <p class="retro-meta"><strong>Skills used:</strong> ${p.skills.join(', ')}</p>
      <p class="retro-meta" style="opacity:0.7">${p.context}</p>
    `;
  },

  experience() {
    const chapters = GAME_CONTENT.experience;
    return chapters.map(ch => `
      <div class="chapter-block">
        <h3 class="retro-h">CHAPTER: ${ch.chapter}</h3>
        <p class="retro-meta">${ch.role}</p>
        <p>${ch.description}</p>
      </div>
    `).join('<hr class="retro-hr">');
  },

  skills() {
    const skills = GAME_CONTENT.skills;
    return `
      <div class="skills-grid">
        ${skills.map(s => `
          <div class="skill-card">
            <span class="skill-icon">${s.icon}</span>
            <div>
              <div class="skill-name">${s.name}</div>
              <div class="skill-blurb">${s.blurb}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  about() {
    const a = GAME_CONTENT.about;
    return `
      <div class="about-header">
        <img src="${PROFILE_PHOTO}" class="about-photo" alt="Profile photo" />
        <div>
          <p>${a.text}</p>
        </div>
      </div>
      <p class="retro-meta" style="font-style:italic">${a.quirk}</p>
      <h3 class="retro-h" style="margin-top:14px">Certificates</h3>
      <div class="cert-grid">
        ${CERTIFICATES.map(c => `
          <div class="cert-card">
            <img src="${c.thumb}" class="cert-thumb" alt="${c.title}" />
            <div class="cert-title">${c.title}</div>
            <div class="cert-issuer">${c.issuer}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  education() {
    const list = GAME_CONTENT.education;
    const logos = { SCHOOL_JUNIOR_LOGO, SCHOOL_SENIOR_LOGO };
    return `
      <div class="education-list">
        ${list.map(e => `
          <div class="chapter-block education-block">
            ${logos[e.logo] ? `<img src="${logos[e.logo]}" class="education-logo" alt="${e.school} logo" />` : ''}
            <div>
              <h3 class="retro-h">${e.school}</h3>
              <p>${e.description}</p>
            </div>
          </div>
        `).join('<hr class="retro-hr">')}
      </div>
    `;
  },

  contact() {
    const c = GAME_CONTENT.contact;
    return `
      <p>Find me here:</p>
      <div class="contact-links">
        <a href="${c.github}" target="_blank" class="retro-btn">GitHub</a>
        <a href="${c.linkedin}" target="_blank" class="retro-btn">LinkedIn</a>
      </div>
    `;
  },

  achievements(scene) {
    const list = AchievementSystem.getAll(scene);
    return `
      <div class="achievements-list">
        ${list.map(a => `
          <div class="achievement-row ${a.unlocked ? '' : 'locked'}">
            <div class="achievement-row-icon">${a.unlocked ? '🏆' : '🔒'}</div>
            <div>
              <div class="achievement-row-title">${a.title}</div>
              <div class="achievement-row-desc">${a.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

};
