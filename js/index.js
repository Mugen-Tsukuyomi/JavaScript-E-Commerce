let products = []
const productsDiv = document.querySelector('[data-products]')
const searchInput = document.querySelector('[data-search]')

function fetchProducts(){
    let loadingInterval = setInterval(function(){
        if(!productsDiv.innerHTML){
            productsDiv.innerHTML = `
            <div class="text-primary text-center fw-bold fs-1">
                Loading Products
            </div>
            `
        } else {
            if(productsDiv.firstElementChild.innerText === "Loading Products . . ."){
                productsDiv.firstElementChild.innerText = "Loading Products"
            } else {
                productsDiv.firstElementChild.innerText += " ."
            }
        }
    }, 800)

    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>{
        products = json
        products.forEach((product) => {
            product.quantity = 0
        })
        console.log(products);
        localStorage.setItem("all-products", JSON.stringify(products))
        clearInterval(loadingInterval)
        showProducts(products)
    }).catch(error => {
        clearInterval(loadingInterval)
        console.log('Fetch error:', error.message);
        productsDiv.innerHTML = `
            <div class="text-danger text-center fw-bold fs-1">
                Server Error
            </div>
            `
    })
}
fetchProducts()
// if(localStorage.getItem('all-products')){
//     products = JSON.parse(localStorage.getItem('all-products'))
//     showProducts(products)
// } else {
//     fetchProducts()
// }

function showProducts(products){
    productsDiv.innerHTML = products.map((product, index) => {
        const btnClass = loggedUser?.cart.some((p) => p.id === product.id) ? "btn-danger" : ""
        const btnText = loggedUser?.cart.some((p) => p.id === product.id) ? "Remove from cart" : "Add to cart"
        const iconClasses = loggedUser?.fav.some((p) => p.id === product.id) ? "text-danger opacity-100" : ""
        return (`<div class="card col-lg-4 col-md-6 col-sm-12 mx-auto" style="transition: transform 0.4s, outline 0.4s" 
            onmouseover="this.style.transform = 'translateY(-5px)'; this.style.outline = '1px #0d6efd solid'; this.style.zIndex = '9'"
            onmouseout="this.style.transform = 'translateY(0px)'; this.style.outline = '1px transparent solid'; this.style.zIndex = '0'">
            <img src="${product.image}" class="card-img-top" height="350">
            <div class="card-body">
                <h5 class="card-title">Product : ${product.title}</h5>
                <h5 class="card-price">Price : ${product.price} $</h5>
                <h5 class="card-category">Category : ${product.category}</h5>
                <button class="btn btn-primary ${"product"+product.id} ${btnClass}" onClick="toggleToCart(this, ${index})">${btnText}</button>
            </div>
            <i class="fa-solid fa-heart text-secondary opacity-50 ${iconClasses} fs-5 position-absolute bottom-0 end-0 m-4" 
            style="cursor: pointer;" onClick="toggleToFav(this, ${index})"></i>
        </div>`)
    }).join('')
}

searchInput.addEventListener("input", search)

function search(){
    const searchType = document.querySelector('[data-byName]').selected ? "title" : "category"

    if(products){
        const searchValue = searchInput.value.trim().toLowerCase()
        const result = products.filter((product) => product[searchType].toLowerCase().includes(searchValue))
        showProducts(result)
    }
}

document.querySelector('[data-search-type]').addEventListener("change", search)

function toggleToCart(btn, index){
    if(isLoggedIn()){
        if(!loggedUser.cart.some((p) => p.id === products[index].id)){
            products[index].quantity += 1
            loggedUser.cart.push(products[index])
            btn.textContent = "Remove from cart"
        } else {
            loggedUser.cart = loggedUser.cart.filter((p) => p.id !== products[index].id)
            btn.textContent = "Add to cart"
        }
        btn.classList.toggle('btn-danger')
        cartCounter.innerHTML = loggedUser.cart.length
        updateCartList()
        setUserData()
    } else {
        window.location.href = "./pages/login.html"
    }
}

function toggleToFav(icon, index){
    if(isLoggedIn()){
        if(!loggedUser.fav.some((p) => p.id === products[index].id)){
            loggedUser.fav.push(products[index])
            icon.classList.add('text-danger', 'opacity-100')
        } else {
            loggedUser.fav = loggedUser.fav.filter((p) => p.id !== products[index].id)
            icon.classList.remove('text-danger', 'opacity-100')
        }
        setUserData()
    } else {
        window.location.href = "./pages/login.html"
    }
}
