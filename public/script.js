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
const aiChatForm = document.getElementById("aiChatForm");
const aiChatInput = document.getElementById("aiChatInput");
const aiChatMessages = document.getElementById("aiChatMessages");

aiChatButton.onclick = () => {
  aiChatWindow.classList.toggle("active");
};

aiCloseBtn.onclick = () => {
  aiChatWindow.classList.remove("active");
};

const replies = [
  {
    keywords: ["price", "pricing", "cost", "rate", "how much", "package"],
    answer:
      "Our pricing starts at ₱3,000+ for starter websites, ₱8,000+ for business websites, and custom pricing for SaaS platforms, dashboards, automation, and business systems.",
  },
  {
    keywords: [
      "website",
      "landing page",
      "web development",
      "business website",
    ],
    answer:
      "Yes, we build modern, responsive, and premium websites for businesses, portfolios, landing pages, booking systems, and online services.",
  },
  {
    keywords: [
      "business management",
      "bms",
      "inventory",
      "sales",
      "expenses",
      "customers",
      "employees",
    ],
    answer:
      "Our Business Management System helps manage inventory, sales, expenses, customers, employees, reports, and business performance in one dashboard.",
  },
  {
    keywords: ["ai", "automation", "chatbot", "agent"],
    answer:
      "We create AI automation tools such as smart chatbots, FAQ assistants, booking assistants, business workflow automation, and AI-powered dashboards.",
  },
  {
    keywords: ["booking", "reservation", "rental", "camera"],
    answer:
      "Yes, we build booking and reservation systems with admin dashboards, customer records, payment tracking, availability control, and confirmation features.",
  },
  {
    keywords: ["rsvp", "wedding", "invitation"],
    answer:
      "We offer elegant Wedding RSVP websites with guest confirmation forms, countdown timers, event details, location sections, and premium romantic designs.",
  },
  {
    keywords: ["time", "timeline", "how long", "duration"],
    answer:
      "A simple website can usually be completed faster, while full systems like dashboards, SaaS platforms, and booking systems depend on the number of features required.",
  },
  {
    keywords: ["contact", "message", "email", "hire", "start project"],
    answer:
      "You can start by sending your project details through the contact form on this website. Tell us what system or website you need, and we’ll guide you from there.",
  },
];

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `ai-message ${sender}`;
  message.textContent = text;
  aiChatMessages.appendChild(message);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function getSmartReply(userMessage) {
  const message = userMessage.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  replies.forEach((item) => {
    let score = 0;

    item.keywords.forEach((keyword) => {
      if (message.includes(keyword)) {
        score++;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  });

  if (bestMatch) {
    return bestMatch.answer;
  }

  return "I can help you with websites, business systems, SaaS platforms, AI automation, booking systems, pricing, and project inquiries. What would you like to build?";
}

aiChatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userMessage = aiChatInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  aiChatInput.value = "";

  addMessage("Typing...", "bot");

  setTimeout(() => {
    const typingMessage = aiChatMessages.lastChild;
    typingMessage.textContent = getSmartReply(userMessage);
  }, 600);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    addMessage(
      "Hi! I’m M Digital AI. I can help you with pricing, websites, business systems, AI automation, booking systems, and project inquiries.",
      "bot",
    );
  }, 800);
});
