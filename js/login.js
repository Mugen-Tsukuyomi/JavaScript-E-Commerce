const logForm = document.querySelector('[data-log-form]')
const email = document.querySelector('[data-email]')
const password = document.querySelector('[data-password]')
const rememberMe = document.querySelector('[data-remember-me]')

logForm.addEventListener('submit', function(e){
    e.preventDefault()
    if(localStorage.getItem(`user-${email.value.trim()}`)){
        const userData = JSON.parse(localStorage.getItem(`user-${email.value.trim()}`))
        if(password.value === userData.password){
            if(rememberMe.checked){
                localStorage.setItem("logged-user", JSON.stringify(userData))
            } else {
                localStorage.removeItem("logged-user")
                sessionStorage.setItem("logged-user", JSON.stringify(userData))
            }
            setTimeout(function(){
                window.location.href = "../index.html"
            }, 500)
        } else {
            alert("Email or password is not correct")
        }
    } else {
        alert("Email or password is not correct")
    }
})