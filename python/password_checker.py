import re


COMMON_PASSWORDS = {
    "password",
    "password123",
    "123456",
    "12345678",
    "qwerty",
    "abcdef",
    "admin",
    "welcome",
    "letmein",
    "iloveyou"
}


def check_requirements(password):
    return {
        "Minimum Length": len(password) >= 8,
        "Uppercase Letter": bool(re.search(r"[A-Z]", password)),
        "Lowercase Letter": bool(re.search(r"[a-z]", password)),
        "Number": bool(re.search(r"[0-9]", password)),
        "Special Character": bool(re.search(r"[^A-Za-z0-9]", password))
    }


def has_repeated_characters(password):
    if len(password) < 4:
        return False

    repeated_count = 0

    for i in range(1, len(password)):
        if password[i].lower() == password[i - 1].lower():
            repeated_count += 1

    return repeated_count >= 3


def has_repeated_pattern(password):
    for size in range(1, 4):
        for i in range(len(password) - (size * 2) + 1):
            first = password[i:i + size]
            second = password[i + size:i + (size * 2)]

            if first.lower() == second.lower():
                return True

    return False


def has_common_password_pattern(password):
    password_lower = password.lower()

    weak_patterns = [
        "password",
        "123456",
        "12345678",
        "qwerty",
        "abcdef",
        "admin",
        "welcome",
        "letmein",
        "iloveyou"
    ]

    return any(pattern in password_lower for pattern in weak_patterns)


def calculate_diversity(password):
    if not password:
        return 0

    unique_characters = len(set(password.lower()))

    return unique_characters / len(password)


def calculate_score(password, requirements):
    score = 0

    # Length
    if len(password) >= 8:
        score += 15

    if len(password) >= 12:
        score += 10

    if len(password) >= 16:
        score += 10

    # Character types
    if requirements["Uppercase Letter"]:
        score += 10

    if requirements["Lowercase Letter"]:
        score += 10

    if requirements["Number"]:
        score += 10

    if requirements["Special Character"]:
        score += 10

    # Character diversity
    diversity = calculate_diversity(password)

    if diversity >= 0.70:
        score += 15
    elif diversity >= 0.50:
        score += 8

    # Security penalties
    if has_repeated_characters(password):
        score -= 20

    if has_repeated_pattern(password):
        score -= 15

    if has_common_password_pattern(password):
        score -= 25

    return max(0, min(100, score))


def get_strength(password, score, passed_count):
    if not password:
        return "Weak"

    if (
        score >= 75
        and passed_count == 5
        and not has_repeated_characters(password)
        and not has_repeated_pattern(password)
        and not has_common_password_pattern(password)
    ):
        return "Strong"

    if score >= 45 and passed_count >= 3:
        return "Medium"

    return "Weak"


def get_recommendation(password, strength):
    if not password:
        return "Enter a password to analyze its security strength."

    if has_common_password_pattern(password):
        return "Avoid common passwords or predictable words."

    if has_repeated_characters(password):
        return "Avoid using the same character repeatedly."

    if has_repeated_pattern(password):
        return "Avoid repeated patterns and use a more random combination."

    if strength == "Strong":
        return "Excellent password with good length, variety and unpredictability."

    if strength == "Medium":
        return "Increase the length and add more unique characters."

    return "Use at least 12 characters with uppercase, lowercase, numbers and symbols."


def analyze_password(password):
    requirements = check_requirements(password)

    passed_count = sum(requirements.values())

    score = calculate_score(password, requirements)

    strength = get_strength(
        password,
        score,
        passed_count
    )

    recommendation = get_recommendation(
        password,
        strength
    )

    print("\n" + "=" * 45)
    print("       PASSWORD SECURITY ANALYZER")
    print("=" * 45)

    print("\nSECURITY CHECKS")

    for requirement, passed in requirements.items():
        status = "PASS" if passed else "FAIL"
        print(f"{requirement:<22} : {status}")

    print("\nAdditional Security Checks")

    print(
        f"Repeated Characters    : "
        f"{'DETECTED' if has_repeated_characters(password) else 'Not Detected'}"
    )

    print(
        f"Repeated Pattern       : "
        f"{'DETECTED' if has_repeated_pattern(password) else 'Not Detected'}"
    )

    print(
        f"Common Password Pattern: "
        f"{'DETECTED' if has_common_password_pattern(password) else 'Not Detected'}"
    )

    print("\n" + "-" * 45)

    print(f"Requirements Passed    : {passed_count}/5")
    print(f"Security Score         : {score}/100")
    print(f"Password Strength      : {strength}")

    print(f"\nRecommendation:")
    print(recommendation)

    print("=" * 45)


def main():
    password = input("Enter your password: ")

    analyze_password(password)


if __name__ == "__main__":
    main()