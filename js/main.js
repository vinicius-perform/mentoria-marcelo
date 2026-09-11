/**
 * ===================================================================
 * INTERATIVIDADE & CONVERSÃO
 * Dr. Marcelo Vasconcelos — Mentoria Empresarial Médica
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppMask();
  initFaqAccordion();
  initVslModal();
  initSmoothScroll();
  initFormHandling();
  initScrollReveal();
});

/**
 * Máscara Inteligente para WhatsApp Brasileiro (XX) 9XXXX-XXXX
 */
function initWhatsAppMask() {
  const phoneInput = document.getElementById('whatsapp');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formatted = '';
    if (value.length > 0) {
      formatted = '(' + value.substring(0, 2);
    }
    if (value.length >= 3) {
      formatted += ') ' + value.substring(2, value.length >= 7 ? 7 : value.length);
    }
    if (value.length >= 8) {
      formatted += '-' + value.substring(7, 11);
    }

    e.target.value = formatted;
  });
}

/**
 * FAQ Accordion Interativo
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha outros itens para foco limpo
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherAnswer = other.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Controle da VSL e Modal de Vídeo
 */
function initVslModal() {
  const vslTrigger = document.getElementById('vslTrigger');
  const vslModal = document.getElementById('vslModal');
  const modalClose = document.getElementById('modalClose');
  const modalVideoFrame = document.getElementById('modalVideoFrame');

  if (!vslTrigger || !vslModal) return;

  const openModal = () => {
    vslModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Se houver iframe ou vídeo nativo, podemos acionar o autoplay
    const video = modalVideoFrame.querySelector('video');
    if (video) {
      video.play().catch(() => {});
    }
  };

  const closeModal = () => {
    vslModal.classList.remove('is-active');
    document.body.style.overflow = '';

    const video = modalVideoFrame.querySelector('video');
    if (video) {
      video.pause();
    }
  };

  vslTrigger.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  vslModal.addEventListener('click', (e) => {
    if (e.target === vslModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && vslModal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/**
 * Scroll Suave para o Formulário de Aplicação
 */
function initSmoothScroll() {
  const ctaLinks = document.querySelectorAll('a[href^="#"], button[data-scroll-to]');

  ctaLinks.forEach((el) => {
    el.addEventListener('click', (e) => {
      const targetId = el.getAttribute('href') || el.getAttribute('data-scroll-to');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Foca automaticamente no primeiro campo do formulário
        setTimeout(() => {
          const firstInput = target.querySelector('input, select');
          if (firstInput) firstInput.focus();
        }, 600);
      }
    });
  });
}

/**
 * Validação e Envio do Formulário de Qualificação
 */
function initFormHandling() {
  const form = document.getElementById('leadForm');
  const formContainer = document.getElementById('formContainer');
  const successState = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const especialidade = document.getElementById('especialidade').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const faturamentoEl = form.querySelector('input[name="faturamento"]:checked');
    const desafioEl = form.querySelector('input[name="desafio"]:checked');

    if (!nome || !whatsapp || !email || !especialidade || !cidade || !faturamentoEl || !desafioEl) {
      alert('Por favor, preencha todos os campos e selecione seu faturamento e principal desafio.');
      return;
    }

    // Feedback de carregamento no botão
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="width:20px;height:20px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"></circle>
      </svg>
      Processando análise estratégica...
    `;

    // Simulação de requisição para CRM / Webhook com transição suave
    setTimeout(() => {
      form.style.display = 'none';
      if (successState) {
        successState.style.display = 'block';

        // Personaliza a mensagem com os dados do médico
        const clientNameEl = document.getElementById('successDoctorName');
        const specialtyEl = document.getElementById('successSpecialty');
        if (clientNameEl) clientNameEl.textContent = nome;
        if (specialtyEl) specialtyEl.textContent = `${especialidade} (${cidade})`;

        // Configura link do WhatsApp com mensagem pronta
        const directWaBtn = document.getElementById('directWhatsAppBtn');
        if (directWaBtn) {
          const msg = encodeURIComponent(
            `Olá, equipe do Dr. Marcelo Vasconcelos! Sou o(a) Dr(a). ${nome}, especialista em ${especialidade} em ${cidade}. Acabei de solicitar o diagnóstico estratégico da minha clínica e gostaria de alinhar o melhor horário para os 30 minutos de reunião.`
          );
          directWaBtn.href = `https://wa.me/5511999999999?text=${msg}`;
        }
      }

      // Scroll suave para a mensagem de sucesso
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
}

/**
 * Scroll Reveal via IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
