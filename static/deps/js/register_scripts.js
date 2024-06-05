
let bgColor = '#333333';
let textPrimary = '#ffffff';
let panelColor = '#2c2c2c';
let panelText = '#525252';
let textSecondary = '#666666';
let primaryColor = '#ffdd44';

var register = document.querySelectorAll('.register');
var login = document.querySelectorAll('.login');

function validateEmail(email) {
    const re = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;
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

        const passwordInput = document.getElementById("register-password");
        const verifyPasswordInput = document.getElementById("verify-password");
        const usernameInput = document.getElementById("register-username");
        const emaiInput = document.getElementById("register-email");
        const registerButton = document.getElementById("register-button");

        const isValidPassword = validatePassword(passwordInput.value);
        const isValidEmail = validateEmail(emaiInput.value);
        const passwordsMatch = passwordInput.value === verifyPasswordInput.value;
        const isEmptyUsername = usernameInput.value !=="";
        
        if (this.id === "register-email") {    
            this.style.border= "1.5px solid " + (isValidEmail ? textPrimary : 'red');
            
        } else if (this.id === "register-password" || this.id === "verify-password") {
            passwordInput.style.border= "1.5px solid " + ((isValidPassword && passwordsMatch) ? textPrimary : 'red');
            verifyPasswordInput.style.border= "1.5px solid " + ((isValidPassword && passwordsMatch) ? textPrimary : 'red');
        } else if (this.id === "register-username") {
            if (this.value !== ""){
                this.style.border= "1.5px solid " + textPrimary;
            }
            else{
                this.style.border= "1.5px solid " + 'red';
            }
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

        const passwordInput = document.getElementById("login-password");
        const emailInput = document.getElementById("login-email");
        const loginButton = document.getElementById("login-button")

        const isValidPassword = validatePassword(passwordInput.value);
        const isValidEmail = validateEmail(emailInput.value);

        
        if (this.id === "login-email") {    
            this.style.border= "1.5px solid " + (isValidEmail ? textPrimary : 'red');
        } else if (this.id === "login-password") {
            passwordInput.style.border= "1.5px solid " + (isValidPassword  ? textPrimary : 'red');
        }
        loginButton.disabled = !isValidPassword || !isValidEmail;

    });
});
