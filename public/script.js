const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* TYPING EFFECT */

const typingElement = document.querySelector(".typing");

const texts = [
  "We create modern websites.",
  "We build SaaS platforms.",
  "We develop digital systems.",
  "We design premium user experiences.",
  "We help businesses grow online.",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = texts[textIndex];

  if (!isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 40 : 80);
}

typeEffect();

/* PREMIUM SERVICE CARD 3D TILT */

const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-14px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button");
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      alert(result.message);

      if (result.success) {
        contactForm.reset();
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }

    submitBtn.textContent = "Submit Message";
    submitBtn.disabled = false;
  });
}

/* AI FAQ ASSISTANT */

const aiChatButton = document.getElementById("aiChatButton");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiCloseBtn = document.getElementById("aiCloseBtn");
const aiChatMessages = document.getElementById("aiChatMessages");
const aiChatForm = document.getElementById("aiChatForm");
const aiChatInput = document.getElementById("aiChatInput");

let aiOpenedOnce = false;

const faqAnswers = [
  {
    keywords: ["price", "pricing", "package", "packages", "cost", "how much"],
    answer:
      "Our website packages start at ₱3,000+ for a starter landing page and ₱8,000+ for business websites. Custom SaaS platforms and systems are priced based on features.",
  },
  {
    keywords: ["custom system", "custom systems", "premium system", "saas"],
    answer:
      "Yes, we build custom systems such as SaaS platforms, dashboards, booking systems, financial trackers, business tools, and automation platforms.",
  },
  {
    keywords: ["services", "offer", "do you do", "what do you offer"],
    answer:
      "We offer Website Development, SaaS Platforms, Business Systems, UI/UX Design, AI Automation, and Responsive Web Applications.",
  },
  {
    keywords: ["admin", "dashboard", "dashboards"],
    answer:
      "Yes, we create admin dashboards for managing bookings, users, payments, reports, analytics, inventory, and business operations.",
  },
  {
    keywords: ["ai", "automation", "chatbot"],
    answer:
      "Yes, we create AI automation such as FAQ chatbots, booking assistants, automated emails, workflow automation, and smart business tools.",
  },
  {
    keywords: ["how long", "timeline", "duration", "development take"],
    answer:
      "A landing page usually takes 3–7 days. A business website may take 1–3 weeks. Custom systems depend on complexity and required features.",
  },
  {
    keywords: ["responsive", "mobile", "tablet"],
    answer:
      "Yes, all websites and systems we build are fully responsive for desktop, tablet, and mobile devices.",
  },
  {
    keywords: ["redesign", "existing website", "revamp"],
    answer:
      "Yes, we can redesign existing websites and improve their UI, responsiveness, speed, layout, and overall premium look.",
  },
  {
    keywords: ["payment", "gcash", "bank", "method"],
    answer:
      "We accept common payment methods such as GCash and bank transfer. Payment terms can be discussed before starting the project.",
  },
  {
    keywords: ["downpayment", "deposit", "advance"],
    answer:
      "Yes, we usually require a downpayment before starting the project, then the remaining balance after completion or before final deployment.",
  },
  {
    keywords: ["contact", "message", "reach", "email"],
    answer:
      "You can contact us through the contact form on this website or message us through our official Facebook page.",
  },
  {
    keywords: ["location", "where", "based"],
    answer:
      "M Digital Solution can work with clients online. We can discuss your project remotely through chat, email, or online meetings.",
  },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addAiMessage(text, sender = "bot") {
  const message = document.createElement("div");
  message.className = `ai-message ${sender}`;
  message.innerHTML = `
    ${text}
    <span class="ai-time">${getCurrentTime()}</span>
  `;
  aiChatMessages.appendChild(message);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "ai-message bot";
  typing.id = "typingIndicator";
  typing.innerHTML = `
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  aiChatMessages.appendChild(typing);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function getAiReply(question) {
  const lowerQuestion = question.toLowerCase();

  const match = faqAnswers.find((faq) =>
    faq.keywords.some((keyword) => lowerQuestion.includes(keyword)),
  );

  if (match) return match.answer;

  return "Please contact us directly for more details. You can use the contact form and we’ll get back to you as soon as possible.";
}

aiChatButton.addEventListener("click", () => {
  aiChatWindow.classList.add("active");

  if (!aiOpenedOnce) {
    addAiMessage(
      "Hi! I'm the M Digital Solution AI Assistant. How can I help you today?",
    );
    aiOpenedOnce = true;
  }
});

aiCloseBtn.addEventListener("click", () => {
  aiChatWindow.classList.remove("active");
});

aiChatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userQuestion = aiChatInput.value.trim();
  if (!userQuestion) return;

  addAiMessage(userQuestion, "user");
  aiChatInput.value = "";

  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    addAiMessage(getAiReply(userQuestion), "bot");
  }, 900);
});
