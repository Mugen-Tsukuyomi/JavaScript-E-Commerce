const regForm = document.querySelector('[data-reg-form]')
const firstName = document.querySelector('[data-fname]')
const lastName = document.querySelector('[data-lname]')
const email = document.querySelector('[data-email]')
const password = document.querySelector('[data-password]')

regForm.addEventListener('submit', function (e){
    e.preventDefault()
    if(!localStorage.getItem(`user-${email.value.trim()}`)){
        const userData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            password: password.value,
            cart: [],
            fav: []
        }
        localStorage.setItem(`user-${email.value.trim()}`,JSON.stringify(userData))
        setTimeout(function(){
            window.location = 'login.html'
        }, 500)
    } else {
        alert(`This Email is already registered`)
    }
})