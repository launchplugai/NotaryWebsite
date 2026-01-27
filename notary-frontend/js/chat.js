/**
 * Chat Widget — Live Chat for The Ink Spot Notary
 * Provides a floating chat widget with automated responses.
 */

(function () {
  'use strict';

  // Automated responses keyed by topic
  var responses = {
    pricing: 'Our pricing is straightforward:\n\n• Standard Notarization — $25/document\n• Mobile Notary — $75 (we come to you)\n• Business Package — $199/month\n\nView full details at our <a href="pricing.html">pricing page</a>.',
    hours: 'We\'re available Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 2 PM. Same-day appointments are often available for mobile services.',
    location: 'We serve the greater Charlotte, NC area within a 25-mile radius of downtown, including Huntersville, Matthews, Concord, and surrounding communities.',
    documents: 'You\'ll need to bring:\n\n• A valid government-issued photo ID (driver\'s license, passport, or state ID)\n• Your unsigned documents\n\nMost notarizations take 5–15 minutes.',
    mobile: 'Our mobile notary service means we come to your home, office, or any convenient location in the Charlotte area. The fee is $75 per visit with same-day availability.',
    book: 'You can book an appointment right now on our <a href="scheduling.html">scheduling page</a>. We offer instant confirmation and free rescheduling.',
    services: 'We offer:\n\n• General Notary Services (affidavits, POA, wills, I-9s)\n• Certified Loan Signing Agent services\n• Notary Trust Delivery Agent\n• Field Inspections\n\nLearn more on our <a href="index.html">homepage</a>.',
    contact: 'You can reach us through the <a href="index.html#contact">contact form</a> on our website, or use this chat. We respond within 24 hours.',
    loan: 'As NNA certified signing agents, we handle all real estate closings including purchases, refinances, HELOCs, and reverse mortgages. Accuracy and professionalism guaranteed.'
  };

  // Keywords mapped to response keys
  var keywords = {
    pricing: ['price', 'pricing', 'cost', 'how much', 'fee', 'fees', 'rate', 'rates', 'charge', 'pay', 'payment', 'afford', 'expensive', 'cheap'],
    hours: ['hours', 'open', 'close', 'schedule', 'availability', 'available', 'when', 'time', 'today'],
    location: ['location', 'where', 'address', 'area', 'charlotte', 'distance', 'far', 'serve', 'travel', 'radius'],
    documents: ['document', 'documents', 'bring', 'need', 'id', 'identification', 'require', 'what do i'],
    mobile: ['mobile', 'come to me', 'travel', 'house', 'home', 'office', 'on-site', 'onsite'],
    book: ['book', 'booking', 'appointment', 'schedule', 'reserve', 'sign up', 'slot'],
    services: ['service', 'services', 'offer', 'do you', 'what can', 'notarize', 'notarization', 'help with'],
    contact: ['contact', 'reach', 'email', 'phone', 'call', 'talk', 'speak', 'person', 'human'],
    loan: ['loan', 'signing', 'mortgage', 'real estate', 'closing', 'refinance', 'heloc']
  };

  var quickReplies = [
    { label: 'Pricing', value: 'What are your prices?' },
    { label: 'Book Now', value: 'How do I book an appointment?' },
    { label: 'Services', value: 'What services do you offer?' },
    { label: 'Hours', value: 'What are your hours?' }
  ];

  var fallbackResponse = 'Thanks for your question! For specific inquiries, feel free to use our <a href="index.html#contact">contact form</a> or call us directly. We typically respond within 24 hours.\n\nIn the meantime, I can help with pricing, services, booking, hours, locations, or document requirements.';

  function matchResponse(message) {
    var lower = message.toLowerCase();
    for (var key in keywords) {
      var words = keywords[key];
      for (var i = 0; i < words.length; i++) {
        if (lower.indexOf(words[i]) !== -1) {
          return responses[key];
        }
      }
    }
    return fallbackResponse;
  }

  function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function createWidget() {
    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'chat-toggle';
    toggle.setAttribute('aria-label', 'Open chat');
    toggle.innerHTML =
      '<svg class="chat-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>' +
      '<svg class="chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"/>' +
        '<line x1="6" y1="6" x2="18" y2="18"/>' +
      '</svg>';

    // Chat window
    var win = document.createElement('div');
    win.className = 'chat-window';
    win.innerHTML =
      '<div class="chat-header">' +
        '<div class="chat-header__avatar">IS</div>' +
        '<div class="chat-header__info">' +
          '<h4>The Ink Spot</h4>' +
          '<p>Typically replies instantly</p>' +
        '</div>' +
      '</div>' +
      '<div class="chat-messages" id="chatMessages"></div>' +
      '<div class="chat-quick-replies" id="chatQuickReplies"></div>' +
      '<div class="chat-input">' +
        '<input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off">' +
        '<button id="chatSend" aria-label="Send">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    var messages = document.getElementById('chatMessages');
    var input = document.getElementById('chatInput');
    var sendBtn = document.getElementById('chatSend');
    var quickContainer = document.getElementById('chatQuickReplies');

    // Build quick reply buttons
    quickReplies.forEach(function (qr) {
      var btn = document.createElement('button');
      btn.className = 'chat-quick-reply';
      btn.textContent = qr.label;
      btn.addEventListener('click', function () {
        sendMessage(qr.value);
      });
      quickContainer.appendChild(btn);
    });

    // Welcome message
    addMessage('Hi there! Welcome to The Ink Spot. How can I help you today?', 'bot');

    // Toggle chat open/close
    toggle.addEventListener('click', function () {
      var isOpen = win.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
      if (isOpen) {
        input.focus();
      }
    });

    // Send on button click
    sendBtn.addEventListener('click', function () {
      sendMessage(input.value);
    });

    // Send on Enter
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        sendMessage(input.value);
      }
    });

    function sendMessage(text) {
      text = (text || '').trim();
      if (!text) return;

      // Add user message
      addMessage(text, 'user');
      input.value = '';

      // Hide quick replies after first message
      quickContainer.style.display = 'none';

      // Show typing indicator
      var typingEl = showTyping();

      // Simulate reply delay
      setTimeout(function () {
        typingEl.remove();
        var reply = matchResponse(text);
        addMessage(reply, 'bot', true);
      }, 800 + Math.random() * 600);
    }

    function addMessage(text, sender, isHTML) {
      var msg = document.createElement('div');
      msg.className = 'chat-msg chat-msg--' + sender;
      if (isHTML) {
        msg.innerHTML = text;
      } else {
        msg.textContent = text;
      }
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      var typing = document.createElement('div');
      typing.className = 'chat-msg chat-msg--typing';
      typing.innerHTML = '<div class="chat-typing-dots"><span></span><span></span><span></span></div>';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      return typing;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
