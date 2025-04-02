let bgColor = '#333333';
let textPrimary = '#ffffff';
let panelColor = '#2c2c2c';
let panelText = '#525252';
let textSecondary = '#666666';
let primaryColor = '#ffdd44';

var register = document.querySelectorAll('.register');
var login = document.querySelectorAll('.login');

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePassword(password) {
    if (password.length <= 5) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[.,]/.test(password)) {
        return false;
    }
    return true;
}

register.forEach(function(input) {
    input.addEventListener("input", function() {
        if (this.value === "") {
            this.style.color = panelText;
            this.style.borderColor = 'none';
        } else {
            this.style.color = textPrimary;
            this.style.borderColor = panelText;
        }

        const passwordInput = document.getElementById("id_password1");
        const verifyPasswordInput = document.getElementById("id_password2");
        const usernameInput = document.getElementById("id_username");
        const emailInput = document.getElementById("id_email");
        const registerButton = document.getElementById("register-button");

        const isValidPassword = validatePassword(passwordInput.value);
        const isValidEmail = validateEmail(emailInput.value);
        const passwordsMatch = passwordInput.value === verifyPasswordInput.value;
        const isEmptyUsername = usernameInput.value !== "";

        if (this.id === "id_email") {
            this.style.border = "1.5px solid " + (isValidEmail ? textPrimary : 'red');
        } else if (this.id === "id_password1" || this.id === "id_password2") {
            passwordInput.style.border = "1.5px solid " + ((isValidPassword && passwordsMatch) ? textPrimary : 'red');
            verifyPasswordInput.style.border = "1.5px solid " + ((isValidPassword && passwordsMatch) ? textPrimary : 'red');
        } else if (this.id === "id_username") {
            this.style.border = "1.5px solid " + (isEmptyUsername ? textPrimary : 'red');
        }
        registerButton.disabled = !isValidPassword || !isValidEmail || !passwordsMatch || !isEmptyUsername;
    });
});

login.forEach(function(input) {
    input.addEventListener("input", function() {
        if (this.value === "") {
            this.style.color = panelText;
            this.style.borderColor = 'none';
        } else {
            this.style.color = textPrimary;
            this.style.borderColor = panelText;
        }

        const passwordInput = document.getElementById("id_password");
        const usernameInput = document.getElementById("id_username_");
        const loginButton = document.getElementById("login-button");

        const isValidPassword = passwordInput.value.trim() !== "";
        const isValidUsername = usernameInput.value.trim() !== "";

        if (this.id === "id_username_") {
            this.style.border = "1.5px solid " + (isValidUsername ? textPrimary : 'red');
        } else if (this.id === "id_password") {
            this.style.border = "1.5px solid " + (isValidPassword ? textPrimary : 'red');
        }
        loginButton.disabled = !isValidPassword || !isValidUsername;
    });
});
