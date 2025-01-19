const signInList = document.querySelector('[data-sign-in]')
const userList = document.querySelector('[data-user]')
const cartBtn = document.querySelector('[data-cart-btn]')
const cartCounter = document.querySelector('[data-cart-counter]')
const cartArrow = document.querySelector('[data-cart-arrow]')
const cartList = document.querySelector('[data-cart-list]')
const logout = document.querySelector('[data-logout]')
const welcomeUser = document.querySelector('[data-welcome-user]')

if(isLoggedIn()){
    var loggedUser = localStorage.getItem('logged-user') ? JSON.parse(localStorage.getItem('logged-user')) :
        JSON.parse(sessionStorage.getItem('logged-user'))
    signInList.classList.add("d-none")
    userList.classList.remove("d-none")
    welcomeUser.innerHTML = `welcome ${loggedUser.firstName}`
    cartCounter.innerHTML = loggedUser.cart.length
    updateCartList()
}

function isLoggedIn(){
    return localStorage.getItem('logged-user') || sessionStorage.getItem('logged-user')
}

logout.addEventListener('click', function (){
    localStorage.removeItem('logged-user')
    sessionStorage.removeItem('logged-user')
    window.location.href = logout.dataset.logout
})

cartBtn.addEventListener('click', function (){
    cartArrow.classList.toggle("fa-caret-down")
    cartArrow.classList.toggle("fa-caret-up")
    cartList.classList.toggle('d-none')
})

function updateCartList(){
    let cart = loggedUser.cart
    let list = ''
    for(let i = 1; i <= 3 && i <= cart.length; i++){
        list += `<li class="bg-white rounded p-2 d-flex justify-content-between"><span class="text-truncate" 
            style="max-width: 70%">${cart[cart.length-i].title}</span> <span>${cart[cart.length-i].quantity}</span>
            <span class="fs-5 lh-1 text-success user-select-none" style="cursor: pointer;" onClick="addQuantity(${cart.length-i})">+</span> 
            <span class="fs-5 lh-1 text-danger user-select-none" style="cursor: pointer;" onClick="reduceQuantity(${cart.length-i})">-</span></li>`
    }
    cartList.innerHTML = list + `<li><a class="text-decoration-none" href="pages/cart.html">View all products</a></li>`
}

function addQuantity(index){
    loggedUser.cart[index].quantity += 1
    updateCartList()
    setUserData()
}

function reduceQuantity(index){
    loggedUser.cart[index].quantity -= 1
    if(loggedUser.cart[index].quantity === 0){
        if(window.location.pathname === "/index.html" || document.querySelector('[data-search-type]')){
            let btn = document.querySelector(`.btn.product${loggedUser.cart[index].id}`)
            btn.textContent = "Add to cart"
            btn.classList.toggle('btn-danger')
        }
        loggedUser.cart.splice(index, 1)
        cartCounter.innerHTML = loggedUser.cart.length
    }
    updateCartList()
    setUserData()
}

cartList.addEventListener('click', function(event){
    event.stopPropagation()
})

function setUserData(){
    localStorage.setItem(`user-${loggedUser.email}`, JSON.stringify(loggedUser))
    localStorage.getItem('logged-user') ? localStorage.setItem('logged-user', JSON.stringify(loggedUser)) :
        sessionStorage.setItem('logged-user', JSON.stringify(loggedUser))
}