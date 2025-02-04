document.addEventListener("DOMContentLoaded", initQuiz);

function initQuiz() {
    const quizOverlay = document.getElementById("quizOverlay");
    const quizOpenBtns = document.querySelectorAll(".quiz__open");
    if (!quizOverlay || quizOpenBtns.length === 0) return;

    const quizCloseBtn = document.getElementById("quizClose");
    let currentStep = 1;
    const steps = document.querySelectorAll(".quiz__step");
    const nextBtn = document.querySelector(".quiz__btn--next");
    const prevBtn = document.querySelector(".quiz__btn--prev");
    const dots = document.querySelectorAll(".quiz__dot");
    const progress = document.querySelector(".quiz__progress");
    const stepCounter = document.querySelector(".quiz__step-counter");
    const form = document.getElementById("quizForm");

    quizOpenBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            resetQuiz(); // 🔥 Сброс перед открытием
            quizOverlay.classList.add("quiz__overlay--visible");
            updateStep(1);
        });
    });

    if (quizCloseBtn) {
        quizCloseBtn.addEventListener("click", () => {
            quizOverlay.classList.remove("quiz__overlay--visible");
        });
    }

    function resetQuiz() {
        currentStep = 1;
        updateStep(1);

        document.querySelectorAll(".quiz__option input").forEach(input => {
            input.checked = false;
            input.parentElement.classList.remove("quiz__option--selected");
        });

        nextBtn.disabled = true;
        nextBtn.style.display = "flex";
        prevBtn.style.display = "none";

        quizOverlay.classList.remove("quiz__overlay--final");
    }

    function updateStep(step) {
        steps.forEach(s => s.classList.remove("quiz__step--active"));
        const activeStep = document.querySelector(`.quiz__step[data-step="${step}"]`);
        if (activeStep) activeStep.classList.add("quiz__step--active");

        nextBtn.disabled = true;
        prevBtn.disabled = step === 1;

        dots.forEach((dot, index) => dot.classList.toggle("quiz__dot--active", index < step));
        if (progress) progress.style.width = `${(step - 1) / (steps.length - 1) * 100}%`;

        if (stepCounter) stepCounter.innerHTML = `${step} з ${steps.length}`;

        if (step === 4) {
            quizOverlay.classList.add("quiz__overlay--final");
            nextBtn.style.display = "none";
            prevBtn.style.display = "none";
        } else {
            quizOverlay.classList.remove("quiz__overlay--final");
            nextBtn.style.display = "flex";
            prevBtn.style.display = step === 1 ? "none" : "flex";
        }

        // 🔥 После переключения проверяем, есть ли уже выбранный ответ
        checkStepInputs();
    }

    function checkStepInputs() {
        const activeStep = document.querySelector(".quiz__step--active");
        if (!activeStep) return;

        const checkedInput = activeStep.querySelector("input:checked");
        if (checkedInput) {
            nextBtn.disabled = false; // 🔥 Разблокируем кнопку, если уже выбран ответ
        }
    }

    document.querySelectorAll(".quiz__option input").forEach(option => {
        option.addEventListener("change", function () {
            nextBtn.disabled = false;
            nextBtn.classList.add("active");

            const parent = this.closest(".quiz__options");
            parent.querySelectorAll(".quiz__option").forEach(opt => opt.classList.remove("quiz__option--selected"));
            this.parentElement.classList.add("quiz__option--selected");
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentStep < steps.length) {
                currentStep++;
                updateStep(currentStep);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                updateStep(currentStep);
            }
        });
    }
}
