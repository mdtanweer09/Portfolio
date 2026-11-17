// Logo helper. Logos come from simpleicons.org; use the logo name from that site (for example "python", "mysql", "powerbi").
const logo = (name) => "https://cdn.simpleicons.org/" + name + "/white";

function makeChip(label, logoName) {
  const li = document.createElement("li");
  if (logoName) {
    const img = new Image();
    img.src = logo(logoName);
    img.alt = "";
    img.width = 20;
    img.height = 20;
    img.onerror = () => img.remove(); // if a logo can't load, the text label still shows
    li.appendChild(img);
  }
  li.appendChild(document.createTextNode(label));
  return li;
}

// Typing effect for the hero title
const typedEl = document.getElementById("typed");
const words = ["Data Analyst", "Python Programmer", "Power BI", "SQL", "Excel"];

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typedEl.textContent = words.join(" / ");
} else {
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  (function tick() {
    const word = words[wordIndex];
    typedEl.textContent = word.slice(0, charIndex);
    let delay = deleting ? 50 : 100;      // erase speed / typing speed (ms per letter)

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1400;                        // pause after the full word is typed
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;                         // short pause before the next word
    } else {
      charIndex += deleting ? -1 : 1;
    }
    setTimeout(tick, delay);
  })();
}

// 1. Skills strip (moves right to left). Edit this list: [label, logo name]
const skills = [
  ["Python", "python"], ["SQL", "mysql"], ["Excel", "microsoftexcel"], ["Power BI", "powerbi"],
  ["Tableau", "tableau"], ["Pandas", "pandas"], ["NumPy", "numpy"], ["Jupyter", "jupyter"],
  ["Git", "git"], ["GitHub", "github"], ["Statistics", ""], ["Data Cleaning", ""]
];
const track = document.getElementById("skillTrack");
skills.forEach(([label, name]) => track.appendChild(makeChip(label, name)));
skills.forEach(([label, name]) => { // second copy makes the loop seamless
  const copy = makeChip(label, name);
  copy.setAttribute("aria-hidden", "true");
  track.appendChild(copy);
});

// 2. Technology logos on each project: reads data-tech="Label:logo,Label:logo"
document.querySelectorAll("[data-tech]").forEach((list) => {
  list.dataset.tech.split(",").forEach((pair) => {
    const [label, name] = pair.split(":");
    list.appendChild(makeChip(label.trim(), name ? name.trim() : ""));
  });
});


// Technology logos (devicon). Items without a logo stay text-only.
const iconBase = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
document.querySelectorAll("[data-icon]").forEach((el) => {
  const name = el.dataset.icon;
  const img = new Image(18, 18);
  img.alt = "";
  img.loading = "lazy";
  img.src = iconBase + name + "/" + name + "-original.svg";
  img.onerror = () => img.remove();
  el.prepend(img);
});

// Skills strip: duplicate items so the loop is seamless
const track1 = document.querySelector(".track");
[...track1.children].forEach((li) => {
  const clone = li.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track1.appendChild(clone);
});


// 3. Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// 4. Highlight the current section in the nav
const links = document.querySelectorAll(".nav a[href^='#']");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));

// 5. Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// Resume pop-up preview
const resumeDialog = document.getElementById("resumeDialog");
const resumeFrame = document.getElementById("resumeFrame");

document.getElementById("viewResume").addEventListener("click", () => {
  if (!resumeFrame.getAttribute("src")) resumeFrame.src = "assets/resume.pdf#view=FitH"; // loads only when opened
  resumeDialog.showModal();
  document.body.style.overflow = "hidden";
});
document.getElementById("closeResume").addEventListener("click", () => resumeDialog.close());
resumeDialog.addEventListener("click", (e) => { if (e.target === resumeDialog) resumeDialog.close(); }); // click outside to close
resumeDialog.addEventListener("close", () => { document.body.style.overflow = ""; });


// Contact Form - Formspree Integration

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function show(msg, ok) {
    statusEl.textContent = msg;
    statusEl.className = "status-msg " + (ok ? "ok" : "err");
}

// Handle form submission
if (form && statusEl) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        // Validate form fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const btn = form.querySelector("button");

        btn.disabled = true;
        btn.textContent = "Sending...";

        show("Sending your message...", true);

        try {

            const res = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!res.ok) {
                throw new Error("Request failed");
            }

            form.reset();

            show(
                "Thanks! Your message was sent successfully. I'll reply soon.",
                true
            );

        } catch (err) {

            show(
                "Sorry, something went wrong. Please try again or email me directly.",
                false
            );

        } finally {

            btn.disabled = false;
            btn.textContent = "Send Message";

        }

    });

}

// Dynamic copyright year
const yearEl = document.getElementById("year");

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}


// Dark / light theme toggle
const themeRoot = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function syncThemeLabel() {
  const dark = themeRoot.getAttribute("data-theme") === "dark";
  themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}
syncThemeLabel();

themeBtn.addEventListener("click", () => {
  const next = themeRoot.getAttribute("data-theme") === "dark" ? "light" : "dark";
  themeRoot.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  syncThemeLabel();
});


