const cart = document.querySelector('[data-cart]')
const totalPrice = document.querySelector('[data-total-price]')
const favList = document.querySelector('[data-fav-products]')

function updateCart(){
    if(!loggedUser){
        document.querySelector('main').innerHTML = '<h2 class="text-center my-5">Please <a href="login.html">Login</a></h2>'
    }
    let total = 0
    cart.innerHTML = loggedUser.cart.map((product, index) => {
        total += product.price * product.quantity
        return (`
            <div class="card-cont p-2 col-lg-6 col-12" style="height: 250px;">
                <div class="product-card d-flex bg-secondary-subtle rounded-5 h-100 py-3 px-4 gap-4">
                    <div class="card-img h-100 d-flex justify-content-center">
                        <img src="${product.image}" class="rounded-3" style="max-height: 100%; max-width: 100%">
                    </div>
                    <div class="card-body d-flex flex-column h-100 justify-content-between">
                        <h5 class="card-title m-0">Product : ${product.title}</h5>
                        <h5 class="card-category m-0">Category : ${product.category}</h5>
                        <h5 class="card-price m-0">Price : ${product.price} $</h5>
                        <div class="d-flex align-items-center gap-3">
                            <span class="fs-5" style="font-weight: 500; line-height: 0; min-width: 23px">${product.quantity}</span>
                            <i class="fa-solid fa-plus text-success" onClick="addQuantity(${index}); updateCart()" style="cursor: pointer; user-select: none"></i>
                            <i class="fa-solid fa-minus text-danger" onClick="reduceQuantity(${index}); updateCart()" style="cursor: pointer; user-select: none"></i>
                            <button class="btn btn-danger" onClick="removeFromCart(${index})" style="height: fit-content;">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }).join('')
    totalPrice.innerHTML = `Total price : ${total === 0 ? total : total.toFixed(2)} $`
}

updateCart()

function removeFromCart(index){
    loggedUser.cart.splice(index, 1)
    updateCart()
    setUserData()
}

function updateFav(){
    favList.innerHTML = loggedUser.fav.map((product, index) => {
        return (`
            <li class="col-lg-4 col-md-6 col-sm-12 py-2 mx-auto">
                <div class="product-card bg-secondary-subtle py-3 px-4 px-xl-4 px-lg-3 position-relative rounded-5 d-flex flex-column" 
                style="transition: transform 0.4s, outline 0.4s; height: 400px;" 
                onmouseover="this.style.transform = 'translateY(-5px)'; this.style.outline = '1px #dc3545 solid';"
                onmouseout="this.style.transform = 'translateY(0px)'; this.style.outline = '1px transparent solid';">
                    <div class="img-cont text-center user-select-none mb-1">
                        <img src=${product.image} class="rounded-3" style="max-width: 100%; max-height: 200px" draggable="false">
                    </div>
                    <div class="card-body d-flex flex-column justify-content-around">
                        <h5 class="card-title">Product : ${product.title}</h5>
                        <h5 class="card-category pe-4">Category : ${product.category}</h5>
                    </div>
                    <i class="fa-solid fa-heart text-danger fs-4 position-absolute bottom-0 end-0 m-4 m-xl-4 m-lg-3" 
                    style="cursor: pointer;" onClick="removeFromFav(${index})"></i>
                </div>
            </li>
        `)
    }).join('')
}

updateFav()

function removeFromFav(index){
    loggedUser.fav.splice(index, 1)
    updateFav()
    setUserData()
    updateCarousel()
}

const carouselArrows = document.querySelectorAll('[data-carousel-arrow]')
const favCardWidth = favList.querySelector('li')?.offsetWidth

carouselArrows.forEach((arrow) => {
    arrow.addEventListener("click", function(){
        favList.scrollLeft += arrow.id === "left-arrow" ? -favCardWidth : favCardWidth
    })
})

// carousel dragging ////////////////////////////////
let isDragging = false, startX, startScrollLeft

const dragStart = (e) => {
    isDragging = true
    favList.classList.add('dragging')
    startX = e.pageX
    startScrollLeft = favList.scrollLeft
}

const dragging = (e) => {
    if(!isDragging) return
    favList.scrollLeft = startScrollLeft + (startX - e.pageX)
}

const dragStop = () => {
    isDragging = false
    favList.classList.remove('dragging')
}

favList.addEventListener('mousedown', dragStart)
favList.addEventListener('mousemove', dragging)
document.addEventListener('mouseup', dragStop)

// for infinite scroll (circular behaviour) ////////////
function updateCarousel(){
    let cardPerView = Math.round(favList.offsetWidth / favCardWidth)
    let carouselChildren = [...favList.children]

    if(carouselChildren.length > cardPerView){
        carouselChildren.slice(-cardPerView).reverse().forEach(card => {
            favList.insertAdjacentHTML("afterbegin", card.outerHTML)
        })
        
        carouselChildren.slice(0, cardPerView).forEach(card => {
            favList.insertAdjacentHTML("beforeend", card.outerHTML)
        })
    } else {
        carouselArrows.forEach((arrow) => {
            arrow.style.display = "none"
        })
        favList.removeEventListener('mousedown', dragStart)
        isDragging = false
    }
}

updateCarousel()

favList.addEventListener('scroll', infiniteScroll)

function infiniteScroll(){
    if(favList.scrollLeft === 0){
        favList.classList.add('dragging')
        favList.scrollLeft = favList.scrollWidth - ( 2 * favList.offsetWidth)
        favList.classList.remove('dragging')
    } else if(Math.ceil(favList.scrollLeft) === favList.scrollWidth - favList.offsetWidth){
        favList.classList.add('dragging')
        favList.scrollLeft = favList.offsetWidth
        favList.classList.remove('dragging')
    }
    clearTimeout(timeoutId)
    if(!carouselContainer.matches(":hover")) autoPlay()
}

window.addEventListener('resize', () => {
    updateFav()
    updateCarousel()
})

// for auto play carousel ////////////////////////
let timeoutId

function autoPlay(){
    if(window.matchMedia("(pointer: coarse)").matches) return
    timeoutId = setTimeout(() => favList.scrollLeft += favCardWidth, 4000)
}
autoPlay()

const carouselContainer = document.querySelector('[data-carousel-container]')

carouselContainer.addEventListener("mouseenter", ()=> {
    clearTimeout(timeoutId)
})

carouselContainer.addEventListener("mouseleave", autoPlay)