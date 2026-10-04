/* ============================================================
   Appliance Energy Consumption - shared script
   Runs on every page. Each feature checks that the elements it
   needs exist, so the same file can be reused across all pages.
   ============================================================ */

/* ------------------------------------------------------------
   1. Footer year
   Writes the current year into the footer so it never goes stale.
   ------------------------------------------------------------ */
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ------------------------------------------------------------
   2. Mobile navigation
   The menu button is only visible below 900px. It shows and
   hides the navigation list by toggling an .open class.
   ------------------------------------------------------------ */
const navToggle = document.getElementById("nav-toggle");
const navList = document.querySelector(".nav-links");

if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
        const isOpen = navList.classList.toggle("open");

        navToggle.setAttribute("aria-expanded", isOpen);
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
}


/* ------------------------------------------------------------
   3. FAQ accordion
   Answers are hidden by CSS (display: none). Clicking a question
   toggles the .show class, which switches the answer to display:
   block. The .open class on the button rotates the chevron.
   ------------------------------------------------------------ */
const questions = document.querySelectorAll(".faq-question");

questions.forEach(function (question) {
    question.addEventListener("click", function () {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.toggle("show");

        question.classList.toggle("open", isOpen);
        question.setAttribute("aria-expanded", isOpen);
    });
});
