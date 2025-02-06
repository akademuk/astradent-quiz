document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    const quizOverlay = document.getElementById("quizOverlay");
    const quizOpenBtns = document.querySelectorAll(".quiz__open");
    const quizCloseBtn = document.getElementById("quizClose");
    const steps = document.querySelectorAll(".quiz__step");
    const nextBtn = document.querySelector(".quiz__btn--next");
    const prevBtn = document.querySelector(".quiz__btn--prev");
    const dots = document.querySelectorAll(".quiz__dot");
    const progress = document.querySelector(".quiz__progress");
    const stepCounter = document.querySelector(".quiz__step-counter");
    const totalSteps = steps.length;

    quizOpenBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            resetQuiz();
            quizOverlay.classList.add("quiz__overlay--visible");
            updateStep(1);
        });
    });

    if (quizCloseBtn) {
        quizCloseBtn.addEventListener("click", function () {
            quizOverlay.classList.remove("quiz__overlay--visible");
        });
    }

    function resetQuiz() {
        currentStep = 1;
        localStorage.clear();
        updateStep(1);

        document.querySelectorAll(".quiz__option input").forEach(input => {
            input.checked = false;
            input.parentElement.classList.remove("quiz__option--selected");
        });

        nextBtn.disabled = true;
        prevBtn.style.display = "none";
        quizOverlay.classList.remove("quiz__overlay--final");
    }

    function updateStep(step) {
        currentStep = step;

        steps.forEach(s => s.classList.remove("quiz__step--active"));
        const activeStep = document.querySelector(`.quiz__step[data-step="${step}"]`);
        if (activeStep) activeStep.classList.add("quiz__step--active");

        prevBtn.style.display = step === 1 ? "none" : "flex";
        nextBtn.style.display = step === totalSteps ? "none" : "flex";

        dots.forEach((dot, index) => {
            dot.classList.toggle("quiz__dot--active", index < step);
        });
        if (progress) {
            progress.style.width = `${((step - 1) / (totalSteps - 1)) * 100}%`;
        }

        if (stepCounter) {
            stepCounter.textContent = `${step} з ${totalSteps}`;
        }

        if (step === totalSteps) {
            quizOverlay.classList.add("quiz__overlay--final");
        } else {
            quizOverlay.classList.remove("quiz__overlay--final");
        }

        restoreSelectedAnswers();
        checkStepInputs();
    }

    function checkStepInputs() {
        const activeStep = document.querySelector(".quiz__step--active");
        if (!activeStep) return;

        const checkedInput = activeStep.querySelector("input:checked");
        nextBtn.disabled = !checkedInput;
    }

    document.querySelectorAll(".quiz__option input").forEach(input => {
        input.addEventListener("change", function () {
            nextBtn.disabled = false;

            const parent = this.closest(".quiz__options");
            parent.querySelectorAll(".quiz__option").forEach(opt => opt.classList.remove("quiz__option--selected"));
            this.parentElement.classList.add("quiz__option--selected");

            localStorage.setItem(`step-${currentStep}`, this.value);
        });
    });

    function restoreSelectedAnswers() {
        document.querySelectorAll(".quiz__step--active .quiz__option input").forEach(input => {
            const savedAnswer = localStorage.getItem(`step-${currentStep}`);
            if (savedAnswer && input.value === savedAnswer) {
                input.checked = true;
                input.parentElement.classList.add("quiz__option--selected");
            }
        });

        checkStepInputs();
    }

    nextBtn.addEventListener("click", function () {
        if (currentStep < totalSteps) {
            updateStep(currentStep + 1);
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
    });
});


