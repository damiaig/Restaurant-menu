// home.js — consolidated version
// Data
const menuItems = [
    // Entrées
    { category: 'entrees', name: 'Velouté de potimarron à la crème de châtaigne', price: '8,50 €', description: 'Douceur d’automne, servie chaude avec éclats de noisettes.', img: 's1.jpg' },
    { category: 'entrees', name: 'Tartare de saumon à l’aneth et citron vert', price: '10,90 €', description: 'Frais et acidulé, relevé d’une touche d’huile d’olive.', img: 's2.jpg' },
    { category: 'entrees', name: 'Salade de chèvre chaud', price: '9,20 €', description: 'Toasts de fromage de chèvre, miel et noix sur lit de roquette.', img: 's3.jpg' },
  
    // Plats
    { category: 'plats', name: 'Magret de canard au miel et romarin', price: '19,90 €', description: 'Servi avec gratin dauphinois et légumes de saison.', img: 's4.jpg' },
    { category: 'plats', name: 'Pavé de saumon rôti', price: '18,50 €', description: 'Cuit à la perfection, accompagné de riz basmati et sauce citronnée.', img: 's5.jpg' },
    { category: 'plats', name: 'Risotto aux champignons sauvages', price: '17,00 €', description: 'Crémeux et parfumé à la truffe noire.', img: 's7.jpg' },
  
    // Desserts
    { category: 'desserts', name: 'Tiramisu classique', price: '6,80 €', description: 'Café, mascarpone et cacao pur.', img: 's8.jpg' },
    { category: 'desserts', name: 'Crème brûlée à la vanille Bourbon', price: '6,50 €', description: 'Croustillante sur le dessus, fondante à cœur.', img: 's9.jpg' },
    { category: 'desserts', name: 'Moelleux au chocolat cœur fondant', price: '7,00 €', description: 'Servi tiède avec boule de glace vanille.', img: 's10.jpg' },
  
    // Boissons
    { category: 'boissons', name: 'Vin rouge (verre)', price: '5,00 €', description: 'Corsé et fruité, idéal avec la viande.', img: 's11.jpg' },
    { category: 'boissons', name: 'Vin blanc (verre)', price: '5,00 €', description: 'Frais et léger, parfait avec le poisson.', img: 's12.jpg' },
    { category: 'boissons', name: 'Eau minérale (50 cl)', price: '2,00 €', description: 'Eau fraîche et désaltérante.', img: 's13.jpg' },
    { category: 'boissons', name: 'Café expresso', price: '2,50 €', description: 'Court et intense, plein d’arôme.', img: 's14.jpg' },
    { category: 'boissons', name: 'Thé ou infusion', price: '3,00 €', description: 'Chaud et apaisant, selon votre choix.', img: 's15.jpg' }
  ];
  menuItems.forEach(item => {
    if (item.img) {
      const img = new Image();
      img.src = item.img;
    }
  });
  
  const CHAR_LIMIT = 60;
  const grid = document.getElementById('menuGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sectionTitle = document.querySelector('.section-title');
  
  // util: map category to heading text
  function getTitleForCategory(cat) {
    switch (cat) {
      case 'entrees': return 'Entrées';
      case 'plats': return 'Plats';
      case 'desserts': return 'Desserts';
      case 'boissons': return 'Boissons';
      case 'all': return 'Tous les plats';
      default: return '';
    }
  }
  function flipCard(card) {
    if (card.animating) return; // ignore if animation in progress
    card.animating = true;
  
    card.classList.add('flipped');
    card.setAttribute('aria-pressed', 'true');
  
    // unlock after CSS transition ends
    const inner = card.querySelector('.flip-card-inner');
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'transform') {
        card.animating = false;
        inner.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    inner.addEventListener('transitionend', onTransitionEnd);
  
    // automatic unflip
    const jitter = Math.floor(Math.random() * AUTO_UNFLIP_JITTER);
    if (card.flipTimeout) clearTimeout(card.flipTimeout);
    card.flipTimeout = setTimeout(() => queueUnflip(card), AUTO_UNFLIP_BASE + jitter);
  }
  
  function unflipCard(card) {
    if (!card.classList.contains('flipped') || card.animating) return;
    card.animating = true;
  
    card.classList.remove('flipped');
    card.setAttribute('aria-pressed', 'false');
  
    const inner = card.querySelector('.flip-card-inner');
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'transform') {
        card.animating = false;
        inner.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    inner.addEventListener('transitionend', onTransitionEnd);
  }
  
  // modal: shows only the full description
  function openDescriptionModal(description) {
    const existing = document.getElementById('descModal');
    if (existing) existing.remove();
  
    const modal = document.createElement('div');
    modal.id = 'descModal';
    modal.className = 'desc-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="desc-modal-content" role="document" tabindex="-1" aria-labelledby="descModalDesc">
        <button class="desc-modal-close" aria-label="Fermer la description">&times;</button>
        <p id="descModalDesc">${description}</p>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  
    const modalContent = modal.querySelector('.desc-modal-content');
    const closeBtn = modal.querySelector('.desc-modal-close');
    modalContent.focus();
  
    function closeModal() {
      modal.remove();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', escHandler);
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  
    function escHandler(e) { if (e.key === 'Escape') closeModal(); }
    window.addEventListener('keydown', escHandler);
  }

  // create single card (flip behaviour + voir plus)
// global constants & queue (only once)
const AUTO_UNFLIP_BASE = 4000;
const AUTO_UNFLIP_JITTER = 120;
const unflipQueue = [];
let unflipRunning = false;

function queueUnflip(card) {
  if (!card || !card.classList || !card.classList.contains('flipped')) return;
  if (unflipQueue.indexOf(card) === -1) unflipQueue.push(card);
  if (!unflipRunning) processUnflipQueue();
}

function processUnflipQueue() {
  if (unflipQueue.length === 0) {
    unflipRunning = false;
    return;
  }
  unflipRunning = true;
  const nextCard = unflipQueue.shift();

  const inner = nextCard.querySelector('.flip-card-inner');

  const onEnd = (e) => {
    if (e.propertyName === 'transform') {
      nextCard.animating = false;
      inner.removeEventListener('transitionend', onEnd);
      setTimeout(processUnflipQueue, 20); // slight gap before next
    }
  };

  nextCard.animating = true;
  nextCard.classList.remove('flipped');
  nextCard.setAttribute('aria-pressed', 'false');
  inner.addEventListener('transitionend', onEnd);

  if (nextCard.flipTimeout) {
    clearTimeout(nextCard.flipTimeout);
    nextCard.flipTimeout = null;
  }
}


function createCard(item) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `${item.name}, prix ${item.price}. Cliquer pour voir la description et la photo.`);
    card.animating = false; // lock flag
  
    const inner = document.createElement('div');
    inner.className = 'flip-card-inner';
  
    const front = document.createElement('div');
    front.className = 'flip-card-front';
    front.innerHTML = `<strong>${item.name}</strong><span class="price">${item.price}</span>`;
  
    const back = document.createElement('div');
    back.className = 'flip-card-back';
    const imgHtml = item.img ? `<img src="${item.img}" alt="Photo de ${item.name}" class="card-img">` : '';
    const fullDesc = item.description || '';
    const descHtml = fullDesc.length > CHAR_LIMIT
      ? `<p class="card-desc">${fullDesc.slice(0, CHAR_LIMIT).trim()}… <strong class="voir-plus" role="button" tabindex="0">Voir plus</strong></p>`
      : `<p class="card-desc">${fullDesc}</p>`;
    back.innerHTML = `${imgHtml}${descHtml}`;
  
    inner.append(front, back);
    card.appendChild(inner);
  
    function flip() {
      if (card.animating) return;
      card.animating = true;
      card.classList.add('flipped');
      card.setAttribute('aria-pressed', 'true');
  
      inner.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'transform') {
          card.animating = false;
          inner.removeEventListener('transitionend', onEnd);
        }
      });
  
      const jitter = Math.floor(Math.random() * AUTO_UNFLIP_JITTER);
      if (card.flipTimeout) clearTimeout(card.flipTimeout);
      card.flipTimeout = setTimeout(() => queueUnflip(card), AUTO_UNFLIP_BASE + jitter);
    }
  
    function unflip() {
      if (!card.classList.contains('flipped') || card.animating) return;
      card.animating = true;
      card.classList.remove('flipped');
      card.setAttribute('aria-pressed', 'false');
  
      inner.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'transform') {
          card.animating = false;
          inner.removeEventListener('transitionend', onEnd);
        }
      });
  
      if (card.flipTimeout) {
        clearTimeout(card.flipTimeout);
        card.flipTimeout = null;
      }
    }
  
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('voir-plus')) return;
      if (card.classList.contains('flipped')) return unflip();
      flip();
    });
  
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  
    back.addEventListener('click', (e) => {
      if (e.target.classList.contains('voir-plus')) {
        e.stopPropagation();
        openDescriptionModal(fullDesc);
      }
    });
  
    back.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (active.classList.contains('voir-plus') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openDescriptionModal(fullDesc);
      }
    });
  
    return card;
  }
  
  // Queue processor — waits for the card animation to finish
  function queueUnflip(card) {
    if (!card || !card.classList || !card.classList.contains('flipped')) return;
    if (!unflipQueue.includes(card)) unflipQueue.push(card);
    if (!unflipRunning) processUnflipQueue();
  }
  
  function processUnflipQueue() {
    if (unflipQueue.length === 0) {
      unflipRunning = false;
      return;
    }
    unflipRunning = true;
    const nextCard = unflipQueue.shift();
  
    const tryUnflip = () => {
      if (!nextCard.animating) {
        nextCard.classList.remove('flipped');
        nextCard.setAttribute('aria-pressed', 'false');
        if (nextCard.flipTimeout) {
          clearTimeout(nextCard.flipTimeout);
          nextCard.flipTimeout = null;
        }
        setTimeout(processUnflipQueue, 50); // small gap between unflips
      } else {
        requestAnimationFrame(tryUnflip);
      }
    };
    tryUnflip();
  }
  

  
  
  // Renders filtered menu into grid (no title handling)
  function renderMenu(category = 'all') {
    grid.innerHTML = '';
    const filtered = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);
    
    let index = 0;
    function renderNext() {
      if (index >= filtered.length) return;
      grid.appendChild(createCard(filtered[index]));
      index++;
      requestAnimationFrame(renderNext);
    }
    renderNext();
  }
  
  
  // Render + insert/update section title + scroll to first item
  function renderMenuAndShowTitle(category = 'all', scroll = true) {
    const filtered = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);
  
    // update section title element text
    const titleText = getTitleForCategory(category);
    if (sectionTitle) sectionTitle.textContent = titleText;
  
    // render cards
    grid.innerHTML = '';
    if (filtered.length === 0) {
      const noItem = document.createElement('div');
      noItem.className = 'no-items';
      noItem.textContent = 'Aucun plat disponible dans cette catégorie.';
      grid.appendChild(noItem);
      return;
    }
    filtered.forEach(item => grid.appendChild(createCard(item)));
  
    // scroll to first card (after next paint)
    if (scroll) {
      requestAnimationFrame(() => {
        const firstCard = grid.querySelector('.flip-card');
        if (firstCard && sectionTitle) {
          // scroll title into view so users see the section heading
          sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
          sectionTitle.setAttribute('tabindex', '-1');
          sectionTitle.focus({ preventScroll: true });
          setTimeout(() => sectionTitle.removeAttribute('tabindex'), 800);
        }
      });
    }
  }
  
  // wire filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      renderMenuAndShowTitle(btn.dataset.category);
    });
  });
  
  // initial load
  document.addEventListener('DOMContentLoaded', () => {
    // if there's a pre-existing sectionTitle element, set its initial text
    if (sectionTitle) sectionTitle.textContent = getTitleForCategory('all');
    renderMenuAndShowTitle('all', false);
  });
  




  // Select the button and the section title
const learnMoreBtn = document.getElementById('learn-more-btn');
const navi = document.querySelector('.navi');

learnMoreBtn.addEventListener('click', () => {
  if (navi) {
    navi.scrollIntoView({ 
      behavior: 'smooth',  // smooth scrolling
      block: 'start'       // align section title to top
    });
  }
});
