const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const scoreText = document.getElementById("score");
const requirementCount = document.getElementById("requirementCount");

const lengthRequirement = document.getElementById("lengthRequirement");
const uppercaseRequirement = document.getElementById("uppercaseRequirement");
const lowercaseRequirement = document.getElementById("lowercaseRequirement");
const numberRequirement = document.getElementById("numberRequirement");
const specialRequirement = document.getElementById("specialRequirement");

const recommendationText = document.getElementById("recommendationText");
const recommendationTitle = document.querySelector("#recommendation h4");


// Show / Hide Password
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});


// Check repeated characters
function hasRepeatedCharacters(password) {
    if (password.length < 4) return false;

    let repeatedCount = 0;

    for (let i = 1; i < password.length; i++) {
        if (password[i].toLowerCase() === password[i - 1].toLowerCase()) {
            repeatedCount++;
        }
    }

    return repeatedCount >= 3;
}


// Check repeated patterns
function hasRepeatedPattern(password) {
    for (let size = 1; size <= 3; size++) {
        for (let i = 0; i <= password.length - size * 2; i++) {
            const first = password.substring(i, i + size);
            const second = password.substring(i + size, i + size * 2);

            if (
                first.length === second.length &&
                first.toLowerCase() === second.toLowerCase()
            ) {
                return true;
            }
        }
    }

    return false;
}


// Check character diversity
function calculateDiversity(password) {
    if (!password) return 0;

    const uniqueCharacters = new Set(password.toLowerCase()).size;

    return uniqueCharacters / password.length;
}


// Check common weak patterns
function hasWeakPattern(password) {
    const lower = password.toLowerCase();

    const weakPatterns = [
        "password",
        "123456",
        "12345678",
        "qwerty",
        "abcdef",
        "admin",
        "welcome",
        "letmein",
        "iloveyou"
    ];

    return weakPatterns.some(pattern => lower.includes(pattern));
}


// Analyze Password
function analyzePassword() {

    const password = passwordInput.value;

    // Requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const passedCount = [
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial
    ].filter(Boolean).length;

    // Update requirement UI
    updateRequirement(lengthRequirement, hasLength);
    updateRequirement(uppercaseRequirement, hasUppercase);
    updateRequirement(lowercaseRequirement, hasLowercase);
    updateRequirement(numberRequirement, hasNumber);
    updateRequirement(specialRequirement, hasSpecial);

    requirementCount.textContent = `${passedCount} / 5`;

    // Extra security checks
    const repeatedCharacters = hasRepeatedCharacters(password);
    const repeatedPattern = hasRepeatedPattern(password);
    const weakPattern = hasWeakPattern(password);
    const diversity = calculateDiversity(password);

    // Score calculation
    let score = 0;

    // Length score
    if (password.length >= 8) score += 15;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Character type score
    if (hasUppercase) score += 10;
    if (hasLowercase) score += 10;
    if (hasNumber) score += 10;
    if (hasSpecial) score += 10;

    // Diversity
    if (diversity >= 0.70) {
        score += 15;
    } else if (diversity >= 0.50) {
        score += 8;
    }

    // Repeated character penalty
    if (repeatedCharacters) {
        score -= 20;
    }

    // Repeated pattern penalty
    if (repeatedPattern) {
        score -= 15;
    }

    // Common password penalty
    if (weakPattern) {
        score -= 25;
    }

    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine strength
    let strength;

    if (!password) {
        strength = "Weak";
        score = 0;
    } else if (
        score >= 75 &&
        passedCount === 5 &&
        !repeatedCharacters &&
        !repeatedPattern &&
        !weakPattern
    ) {
        strength = "Strong";
    } else if (
        score >= 45 &&
        passedCount >= 3
    ) {
        strength = "Medium";
    } else {
        strength = "Weak";
    }

    // Update strength display
    strengthText.textContent = strength;
    scoreText.textContent = `${score}/100`;
    strengthFill.style.width = `${score}%`;

    // Recommendation
    updateRecommendation(
        strength,
        password,
        repeatedCharacters,
        repeatedPattern,
        weakPattern
    );
}


// Update requirement box
function updateRequirement(element, passed) {

    if (passed) {
        element.classList.add("passed");
    } else {
        element.classList.remove("passed");
    }

    const icon = element.querySelector(".requirement-icon");

    if (icon) {
        icon.textContent = passed ? "✓" : "×";
    }
}


// Recommendation messages
function updateRecommendation(
    strength,
    password,
    repeatedCharacters,
    repeatedPattern,
    weakPattern
) {

    if (!password) {
        recommendationTitle.textContent = "Password Recommendation";
        recommendationText.textContent =
            "Enter a password to analyze its security strength.";
        return;
    }

    if (weakPattern) {
        recommendationTitle.textContent = "Common Password Detected";
        recommendationText.textContent =
            "Avoid common passwords or predictable words such as password, admin, or 123456.";
        return;
    }

    if (repeatedCharacters) {
        recommendationTitle.textContent = "Too Many Repeated Characters";
        recommendationText.textContent =
            "Avoid using the same character repeatedly. Add more different letters, numbers and symbols.";
        return;
    }

    if (repeatedPattern) {
        recommendationTitle.textContent = "Repeated Pattern Detected";
        recommendationText.textContent =
            "Avoid repeated patterns. Use a more random combination of characters.";
        return;
    }

    if (strength === "Strong") {
        recommendationTitle.textContent = "Excellent Password";
        recommendationText.textContent =
            "Your password has good length, character variety and no major predictable patterns.";
    } else if (strength === "Medium") {
        recommendationTitle.textContent = "Improve Your Password";
        recommendationText.textContent =
            "Try increasing the length and adding more unique characters, numbers and symbols.";
    } else {
        recommendationTitle.textContent = "Weak Password";
        recommendationText.textContent =
            "Use at least 12 characters with uppercase, lowercase, numbers and special characters.";
    }
}


// Run analyzer whenever user types
passwordInput.addEventListener("input", analyzePassword);


// Initial state
analyzePassword();