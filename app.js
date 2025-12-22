// Basic front-end behavior for the CRP marketing site and AI assistant demo.

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const quickForm = document.getElementById('quick-form');
  const contactForm = document.getElementById('contact-form');

  // Optional: still treat quick-form as a simple demo form if it exists
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = quickForm.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : null;
      if (button) {
        button.disabled = true;
        button.textContent = 'Received';
      }
      setTimeout(() => {
        if (button && originalText) {
          button.disabled = false;
          button.textContent = originalText;
        }
        quickForm.reset();
      }, 600);
    });
  }

  // Contact form with EmailJS
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : null;
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending...';
      }

      // Ensure EmailJS is available
      if (!window.emailjs || typeof emailjs.sendForm !== 'function') {
        alert(
          'Email service is not available in the browser. Please check your internet connection and EmailJS configuration.'
        );
        if (button && originalText) {
          button.disabled = false;
          button.textContent = originalText;
        }
        return;
      }

      // Use your actual EmailJS service ID and template ID
      // NOTE: service IDs usually look like "service_xxxxx" (no leading extra characters)
      const serviceId = 'service_jos6vfs';
      const templateId = 'template_1iyq2vq';

      emailjs
        .sendForm(serviceId, templateId, '#contact-form')
        .then(() => {
          alert('Message sent! We will get back to you soon.');
          contactForm.reset();
        })
        .catch((error) => {
          console.error('EmailJS error:', error);
          alert(
            'Sorry, there was a problem sending your message. Error info:\n' +
              (error && (error.text || error.message || JSON.stringify(error)))
          );
        })
        .finally(() => {
          if (button && originalText) {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
    });
  }

  // Assistant UI
  const assistantToggle = document.getElementById('assistant-toggle');
  const assistantPanel = document.getElementById('assistant-panel');
  const assistantClose = document.getElementById('assistant-close');
  const assistantBody = document.getElementById('assistant-body');
  const assistantForm = document.getElementById('assistant-form');
  const assistantInput = document.getElementById('assistant-input');
  const openAssistantBtn = document.getElementById('open-assistant');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Image preview overlay elements (created on demand)
  let imagePreviewOverlay = null;

  function closeImagePreview() {
    if (imagePreviewOverlay && imagePreviewOverlay.parentNode) {
      imagePreviewOverlay.parentNode.removeChild(imagePreviewOverlay);
      imagePreviewOverlay = null;
    }
  }

  function openAssistant() {
    if (!assistantPanel) return;
    assistantPanel.classList.add('open');
    assistantPanel.setAttribute('aria-hidden', 'false');
    if (assistantInput) {
      assistantInput.focus();
    }
  }

  function closeAssistant() {
    if (!assistantPanel) return;
    assistantPanel.classList.remove('open');
    assistantPanel.setAttribute('aria-hidden', 'true');
  }

  if (assistantToggle) {
    assistantToggle.addEventListener('click', openAssistant);
  }
  if (assistantClose) {
    assistantClose.addEventListener('click', closeAssistant);
  }
  if (openAssistantBtn) {
    openAssistantBtn.addEventListener('click', openAssistant);
  }

  // Mobile nav toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Close assistant on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imagePreviewOverlay) {
        closeImagePreview();
      } else {
        closeAssistant();
      }
    }
  });

  // Click-to-preview for service images
  const previewableImages = document.querySelectorAll('.previewable-image');

  function openImagePreview(src, alt) {
    closeImagePreview();
    imagePreviewOverlay = document.createElement('div');
    imagePreviewOverlay.className = 'image-preview-overlay';

    const inner = document.createElement('div');
    inner.className = 'image-preview-inner';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-preview-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeImagePreview);

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';

    const caption = document.createElement('div');
    caption.className = 'image-preview-caption';
    caption.textContent = alt || 'Service image';

    inner.appendChild(closeBtn);
    inner.appendChild(img);
    inner.appendChild(caption);

    imagePreviewOverlay.appendChild(inner);
    imagePreviewOverlay.addEventListener('click', (event) => {
      if (event.target === imagePreviewOverlay) {
        closeImagePreview();
      }
    });

    document.body.appendChild(imagePreviewOverlay);
  }

  previewableImages.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      openImagePreview(img.src, img.alt);
    });
  });

  // Very simple rule-based "AI" for demo purposes.
  const serviceKeywords = [
    'repair',
    'fix',
    'service',
    'support',
    'help',
    'issue',
    'problem',
  ];
  const osInstallKeywords = [
    'windows 10',
    'win10',
    'windows10',
    'windows 11',
    'win11',
    'windows11',
    'zorin',
    'os install',
    'operating system',
    'format',
    'reinstall',
  ];
  const activationKeywords = [
    'activate',
    'activation',
    'license',
    'licence',
    'product key',
    'office 2021',
    'microsoft office',
  ];
  const softwareInstallKeywords = [
    'autocad',
    'photoshop',
    'adobe',
    'office',
    'word',
    'excel',
    'powerpoint',
    'software install',
    'program install',
    'app install',
  ];
  const unlockingKeywords = [
    'unlock',
    'locked',
    'password',
    'forgot password',
    'bitlocker',
    'user account',
    'cannot login',
    'cant login',
  ];
  const upgradeKeywords = [
    'upgrade',
    'ram',
    'memory',
    'ssd',
    'hdd to ssd',
    'slow',
    'speed',
    'performance',
  ];
  const driverKeywords = [
    'driver',
    'drivers',
    'wifi not working',
    'sound not working',
    'no audio',
    'no network',
    'display driver',
    'graphics driver',
  ];
  const performanceKeywords = ['slow', 'lag', 'freeze', 'freezing', 'upgrade', 'ssd', 'ram'];
  const virusKeywords = ['virus', 'malware', 'ransomware', 'popup', 'adware', 'hacked'];
  const dataKeywords = ['data', 'files', 'photos', 'backup', 'recover', 'recovery', 'lost'];
  const contactKeywords = ['contact', 'phone', 'email', 'address', 'where', 'location', 'hours'];
  const priceKeywords = ['price', 'cost', 'how much', 'fee', 'charge', 'pricing', 'quote'];

  function addMessage(text, from = 'bot') {
    if (!assistantBody) return;
    const wrapper = document.createElement('div');
    wrapper.className =
      'assistant-message ' +
      (from === 'user' ? 'assistant-message-user' : 'assistant-message-bot');
    const p = document.createElement('p');
    p.textContent = text;
    wrapper.appendChild(p);
    assistantBody.appendChild(wrapper);
    assistantBody.scrollTop = assistantBody.scrollHeight;
  }

  function generateAssistantReply(rawInput) {
    const input = rawInput.toLowerCase();

    if (!rawInput.trim()) {
      return "I didn't catch that. Could you rephrase your question about your computer issue?";
    }

    if (contactKeywords.some((k) => input.includes(k))) {
      return (
        'You can reach Pro‑Tech Computer Repairs by phone at +263 71 769 2705 or email shepherdmakasa06@gmail.com. ' +
        'You can also use the contact form on this page to describe your issue and we will get back to you as soon as possible.'
      );
    }

    if (osInstallKeywords.some((k) => input.includes(k))) {
      return (
        'We offer full operating system installation services for Windows 10, Windows 11 and Zorin OS. ' +
        'We can back up your important files (if possible), perform a clean or upgrade install, install basic drivers and updates, and make sure the system is ready for use. ' +
        'Tell me which OS you are using now and what you would like to move to.'
      );
    }

    if (activationKeywords.some((k) => input.includes(k))) {
      return (
        'Activating Windows or Microsoft Office (including Office 2021) unlocks all the features and keeps your system properly updated. ' +
        'At Pro‑Tech we can handle the activation for you and make sure everything is set up correctly. ' +
        'To arrange this, please send us a message using the contact form on this page or call us on +263 71 769 2705.'
      );
    }

    if (softwareInstallKeywords.some((k) => input.includes(k))) {
      return (
        'We install and configure software such as AutoCAD, Microsoft Office and Adobe Photoshop, as well as other common applications. ' +
        'We check compatibility with your hardware, make sure installation completes correctly, and configure basic settings for you.'
      );
    }

    if (unlockingKeywords.some((k) => input.includes(k))) {
      return (
        'PC unlocking is one of our main services. If you are locked out of your account or forgot your password, we try to restore access without losing your data. ' +
        'Please tell me if you are locked out of Windows itself, or just a specific account or file, so I can explain the safest options.'
      );
    }

    if (upgradeKeywords.some((k) => input.includes(k))) {
      return (
        'Upgrading RAM and moving from an HDD to an SSD is often the best way to speed up an older PC. ' +
        'We can recommend the right RAM size and SSD type for your machine, install the parts, and move your system so it boots from the new drive.'
      );
    }

    if (driverKeywords.some((k) => input.includes(k))) {
      return (
        'If things like Wi‑Fi, sound, or graphics are not working properly, you may need correct drivers. ' +
        'We install and update all required drivers so your hardware works reliably, then test that everything is stable.'
      );
    }

    if (serviceKeywords.some((k) => input.includes(k))) {
      return (
        'Here at Pro-Tech we focus on: operating system installation (Windows 10/11 and Zorin), Windows and Office activation, ' +
        'software installation (AutoCAD, Office, Photoshop), PC unlocking, RAM and SSD upgrades, and driver installation. ' +
        'Describe your problem in a sentence or two and I will tell you which of these services fits best and what the next step would be.'
      );
    }

    if (performanceKeywords.some((k) => input.includes(k))) {
      return (
        'Slowness is often caused by background apps, an older hard drive, or limited RAM. ' +
        'We can perform a full tune‑up and, if needed, upgrade you to an SSD or add more memory for a big speed boost.'
      );
    }

    if (virusKeywords.some((k) => input.includes(k))) {
      return (
        'It sounds like you may have malware or unwanted software. We can run deep scans, remove infections, and help secure your system ' +
        'with updates and better protection. Avoid entering passwords or banking details until the machine is cleaned.'
      );
    }

    if (dataKeywords.some((k) => input.includes(k))) {
      return (
        'Data loss can be serious. If the drive is failing, turn the computer off and avoid using it to prevent further damage. ' +
        'We can attempt recovery of important files and then set up a proper backup so you are protected in the future.'
      );
    }

    if (priceKeywords.some((k) => input.includes(k))) {
      return (
        'Pricing depends on the issue and any parts needed. We provide a clear quote after diagnosis, and you can decide before any work is done. ' +
        'Share your issue and we can estimate whether it is usually a quick fix or a more involved repair.'
      );
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return (
        'Hello! I am the Pro‑Tech assistant. I can help with operating system installation,' +
        ' Windows / Office activation, software installation (AutoCAD, Office, Photoshop),' +
        ' PC unlocking, RAM / SSD upgrades, and driver installation. ' +
        'Tell me what is happening with your computer and which of these you think you need.'
      );
    }

    // Fallback: keep the answer focused on Pro‑Tech services
    return (
      'Unfortunately I specialise in explaining the services offered at Pro‑Tech Computer Repairs only. ' +
      'Our main services are: OS installation (Windows 10/11, Zorin), Windows and Office activation, software installs (AutoCAD, Office, Photoshop), ' +
      'PC unlocking, RAM / SSD upgrades, and driver installation. If your message is not clearly about these, I would recommend sending us a message ' +
      'using the contact form on this page or calling us directly on +263 71 769 2705 so we can help you properly.'
    );
  }

  if (assistantForm && assistantInput) {
    assistantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = assistantInput.value;
      if (!value.trim()) return;
      addMessage(value, 'user');
      assistantInput.value = '';

      setTimeout(() => {
        const reply = generateAssistantReply(value);
        addMessage(reply, 'bot');
      }, 350);
    });
  }
});


