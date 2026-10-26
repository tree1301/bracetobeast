const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  const setMenuOpen = (open) => {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formStatus = document.getElementById("formStatus");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const fallback = "Please try again, or email bracetobeast@gmail.com.";

  const showStatus = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = `form-status is-${type}`;
    formStatus.hidden = false;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);

    if (data.get("botcheck")) {
      return;
    }

    if (String(data.get("access_key")).startsWith("YOUR_")) {
      showStatus("The form isn’t connected yet. For now, please email bracetobeast@gmail.com.", "error");
      return;
    }

    const shareable = data.get("publish_permission") === "Yes";
    data.set("publish_permission", shareable ? "Yes" : "No");
    data.set("subject", shareable ? "New feedback (OK to publish)" : "New private message");

    submitButton.disabled = true;
    showStatus("Sending…", "pending");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed");
      }
      contactForm.reset();
      showStatus("Thank you! Your message was sent. I read every one.", "success");
    } catch (error) {
      showStatus(`Sorry, something went wrong. ${fallback}`, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
