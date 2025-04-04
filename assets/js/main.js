/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION skills ====================*/


/*==================== QUALIFICATION TABS ====================*/


/*==================== services MODAL ====================*/


/*==================== CERTIFICATION SWIPER  ====================*/
let certificationSwiper = new Swiper(".certification__container", {
    cssMode: true,
    loop: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});

/*==================== PORTFOLIO SWIPER  ====================*/
let portfolioSwiper = new Swiper(".portfolio__container", {
    cssMode: true,
    loop: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});

/*==================== TESTIMONIAL ====================*/


/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})



//==========
/*PEMISAH*/

const sessionId = crypto.randomUUID();
let recognition = null;
let isRecording = false;
let imageBase64 = null;
let chatCounter = 0;
const lastUserInputs = {};

function toggleChat() {
  const card = document.getElementById("chatbot-card");
  const toggle = document.getElementById("chat-toggle");
  const isHidden = card.classList.contains("hidden");
  card.classList.toggle("hidden");
  toggle.classList.toggle("hidden", isHidden);
  document.body.classList.remove("fullscreen-blur");
  card.classList.remove("fullscreen");
  clearPreview();
  if (isHidden) focusInput();
}

function expandChat() {
  const card = document.getElementById("chatbot-card");
  card.classList.toggle("fullscreen");
  document.body.classList.toggle("fullscreen-blur");
  focusInput();
}

function focusInput() {
  setTimeout(() => document.getElementById("user-input").focus(), 100);
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    imageBase64 = reader.result;
    const preview = document.getElementById("image-preview");
    preview.innerHTML = `
      <div class="preview-wrapper">
        <img src="${imageBase64}" alt="preview">
        <div class="preview-cancel" onclick="clearPreview()">
          <i class="uil uil-times"></i>
        </div>
      </div>`;    
    preview.classList.remove("hidden");
    focusInput();
  };
  reader.readAsDataURL(file);
}

function clearPreview() {
  imageBase64 = null;
  const preview = document.getElementById("image-preview");
  preview.classList.add("hidden");
  preview.innerHTML = "";
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message && !imageBase64) return;

  const currentImage = imageBase64;
  const chatId = `chat-${chatCounter++}`;
  lastUserInputs[chatId] = { message, image: currentImage, isVoice: false };

  if (currentImage) appendImageBubble("user", currentImage, chatId);
  if (message) appendMessage("user", message, chatId);

  clearPreview();
  input.value = "";
  textarea.style.height = "auto";
  toggleTyping(true, chatId);

  try {
    const res = await fetch("https://df1d0940-b0fd-4216-9518-3fc75927d8c4-00-11h3ajifm4h7i.pike.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message, image: currentImage })
    });
    const data = await res.json();
    toggleTyping(false);
    appendMessageTyping("bot", data.reply, chatId);
  } catch {
    toggleTyping(false);
    appendMessage("bot", "Oops, gagal ngejawab nih 😅", chatId, true);
  }

  document.getElementById("send-button").classList.add("hidden");
  document.getElementById("voice-button").classList.remove("hidden");
}

function toggleTyping(show, chatId = null) {
  const log = document.getElementById("chat-log");
  const old = document.getElementById("typing-bubble");
  if (old) old.remove();
  if (!show) return;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bot";
  bubble.id = "typing-bubble";
  if (chatId) bubble.setAttribute("data-chat-id", chatId);
  bubble.innerHTML = `
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>`;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function appendMessage(sender, text, chatId, isFeedback = false) {
  const log = document.getElementById("chat-log");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  if (chatId) bubble.setAttribute("data-chat-id", chatId);
  if (isFeedback) bubble.classList.add("feedback");
  bubble.innerHTML = text.replace(/\n/g, "<br>");
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function appendImageBubble(sender, image, chatId) {
  const log = document.getElementById("chat-log");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.setAttribute("data-chat-id", chatId);
  bubble.innerHTML = `<img src="${image}" alt="uploaded image" style="max-width:100%; border-radius:8px;">`;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function appendMessageTyping(sender, text, chatId) {
  const log = document.getElementById("chat-log");
  let wrapper = log.querySelector(`.chat-bubble.${sender}[data-chat-id="${chatId}"]`);
  if (wrapper) {
    let found = false;
    const bubbles = [...log.children];
    for (let i = 0; i < bubbles.length; i++) {
      const el = bubbles[i];
      if (el === wrapper) {
        found = true;
        continue;
      }
      if (found) log.removeChild(el);
    }
    wrapper.innerHTML = "";
  } else {
    wrapper = document.createElement("div");
    wrapper.className = `chat-bubble ${sender}`;
    wrapper.setAttribute("data-chat-id", chatId);
    log.appendChild(wrapper);
  }

  const messageDiv = document.createElement("div");
  wrapper.appendChild(messageDiv);

  let index = 0;
  const interval = setInterval(() => {
    const sliced = text.slice(0, index++);
    messageDiv.innerHTML = sliced.replace(/\n/g, "<br>");
    if (index > text.length) {
      clearInterval(interval);
      if (sender === "bot") wrapper.appendChild(createBotActions(chatId));
    }
    log.scrollTop = log.scrollHeight;
  }, 15);
}

function createBotActions(chatId) {
  const container = document.createElement("div");
  container.className = "bubble-actions";
  container.innerHTML = `
    <i class="uil uil-copy" onclick="copyText(this)" title="Salin"></i>
    <i class="uil uil-thumbs-up" title="Suka"></i>
    <i class="uil uil-thumbs-down" title="Kurang suka"></i>
    <i class="uil uil-sync" onclick="regenerate('${chatId}')" title="Regenerate"></i>`;
  return container;
}

function copyText(el) {
  const text = el.closest(".chat-bubble").querySelector("div").innerText;
  navigator.clipboard.writeText(text).then(() => {
    el.classList.add("copied");
    el.title = "Disalin!";
    setTimeout(() => {
      el.classList.remove("copied");
      el.title = "Salin";
    }, 1000);
  });
}

function regenerate(chatId) {
  const data = lastUserInputs[chatId];
  if (!data) return;

  toggleTyping(true, chatId);
  fetch("https://df1d0940-b0fd-4216-9518-3fc75927d8c4-00-11h3ajifm4h7i.pike.replit.dev/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message: data.message, image: data.image })
  })
    .then(res => res.json())
    .then(data => {
      toggleTyping(false);
      appendMessageTyping("bot", data.reply, chatId);
      focusInput();
    })
    .catch(() => {
      toggleTyping(false);
      appendMessage("bot", "Gagal regenerate 😅", chatId, true);
    });
}

function startVoiceInput() {
  const micBtn = document.getElementById("voice-button");
  if (isRecording) {
    stopVoiceInput(true);
    appendMessage("bot", "Perekaman dibatalkan 😶‍🌫️", null, true);
    return;
  }

  micBtn.classList.add("recording");
  isRecording = true;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Browser tidak mendukung voice input");
    micBtn.classList.remove("recording");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "id-ID";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startTime = new Date();

  recognition.onresult = (e) => {
    const chatId = `chat-${chatCounter++}`;
    const transcript = e.results[0][0].transcript;
    const duration = ((new Date() - startTime) / 1000).toFixed(0);
    const formatted = `${Math.floor(duration / 60)}:${("0" + (duration % 60)).slice(-2)}`;
    const bubble = `<em>"${transcript}"</em><div class="bubble-actions" style="font-size:12px;color:gray;margin-top:4px;display:flex;gap:6px;align-items:center;"><i class="uil uil-microphone"></i> ${formatted}</div>`;

    lastUserInputs[chatId] = { message: transcript, image: imageBase64, isVoice: true };
    if (imageBase64) appendImageBubble("user", imageBase64, chatId);
    appendMessage("user", bubble, chatId);

    const currentImage = imageBase64;
    clearPreview();
    toggleTyping(true, chatId);
    fetch("https://df1d0940-b0fd-4216-9518-3fc75927d8c4-00-11h3ajifm4h7i.pike.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: transcript, image: currentImage })
    })
      .then(res => res.json())
      .then(data => {
        toggleTyping(false);
        appendMessageTyping("bot", data.reply, chatId);
        focusInput();
      })
      .catch(() => {
        toggleTyping(false);
        appendMessage("bot", "Gagal mengirim hasil suara 😅", chatId, true);
      });

    stopVoiceInput();
  };

  recognition.onerror = () => {
    stopVoiceInput();
    appendMessage("bot", "Terjadi error saat rekaman suara.", null, true);
  };

  recognition.onend = () => stopVoiceInput();
  recognition.start();
}

function stopVoiceInput(isCanceled = false) {
  const micBtn = document.getElementById("voice-button");
  micBtn.classList.remove("recording");
  isRecording = false;
  if (recognition) recognition.stop();
  if (isCanceled && recognition) recognition.onresult = null;
}

document.getElementById("image-upload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) previewImage(file);
});

document.getElementById("chat-log").addEventListener("dragover", e => e.preventDefault());
document.getElementById("chat-log").addEventListener("drop", e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) previewImage(file);
});

document.getElementById("user-input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

document.getElementById("user-input").addEventListener("input", () => {
  const input = document.getElementById("user-input").value.trim();
  document.getElementById("send-button").classList.toggle("hidden", input === "");
  document.getElementById("voice-button").classList.toggle("hidden", input !== "");
});

const textarea = document.getElementById("user-input");
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
});

/*PEMISAH*/
//==========