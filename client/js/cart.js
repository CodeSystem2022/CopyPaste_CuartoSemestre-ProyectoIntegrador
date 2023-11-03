const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const cart = []; // Inicializamos el carrito como un array vacío.

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    //modal Header
    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);
    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);
    modalContainer.append(modalHeader);

    //modal Body
    if(cart.length > 0){
        cart.forEach((product) => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            fetch(`/productos/${product.id}`) // Ruta en el servidor
                .then((response) => response.json())
                .then((producto) => {
                    modalBody.innerHTML = `
                        <div class="product">
                            <img class="product-img" src="${producto.img}" />
                            <div class="product-info">
                                <h4>${producto.product_name}</h4>
                            </div>
                            <div class="quantity">
                                <span class="quantity-btn-decrese">-</span>
                                <span class="quantity-input">${producto.quantity}</span>
                                <span class="quantity-btn-increse">+</span>
                            </div>
                            <div class="price">${producto.price * producto.quantity} $</div>
                            <div class="delete-product">❌</div>
                        </div>
                    `;
                    modalContainer.append(modalBody);
                    modalContainer.append(modalBody);
                    const decrese = modalBody.querySelector(".quantity-btn-decrese");
                    decrese.addEventListener("click", () => {
                        if(product.quantity !== 1){
                            producto.quantity--;
                            displayCart();
                            displayCartCounter();
                        }
                    });
                    //Add product
                    const increse = modalBody.querySelector(".quantity-btn-increse");
                    increse.addEventListener("click", () => {
                        producto.quantity++;
                        displayCart();
                        displayCartCounter();
                    });
                    //Delete product
                    const deleteProduct = modalBody.querySelector(".delete-product");
                    deleteProduct.addEventListener("click", ()=> {
                        deleteCartProduct(producto.id)
                    });
                });
        });
        
    //modal footer
    const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
       <div class = "total-price">Total: ${total}</div>
    <button class = "btn-primary" id="checkout-btn"> go to checkout</button>
    <div id="button-checkout"></div>
    `; 

    modalContainer.append(modalFooter);
    //mp;
        const mercadopago = new MercadoPago("APP_USR-5edee690-9d67-4f22-b564-0bffaa7bf97a", {
            locale: "es-AR",
         }); 

        const checkoutButton = modalFooter.querySelector("#checkout-btn"); //capturamos el boton para el evento click y ejecutar
        checkoutButton.addEventListener("click", function (){
            checkoutButton.remove(); 

            const orderData = {
                quantity: 1,
                description: "compra de ecommerce",
                price: total,
            };
            fetch("http://localhost:8080/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (preference) {
                    createCheckoutButton(preference.id);
                })
                .catch(function () {
                    alert("Unexpected error");
                });
        });
                function createCheckoutButton(preferenceId) {
            //Initialize the checkout
            const bricksBuilder = mercadopago.bricks();
            const renderComponent = async (bricksBuilder) => {
                //if (window.checkoutButton) checkoutButton.unmount();
                await bricksBuilder.create(
                    "wallet",
                    "button-checkout", // class/id where the payment button will be displayed
                    {
                        initialization: {
                            preferenceId: preferenceId,
                        },
                        callbacks: {
                            onError: (error) => console.error(error),
                            onReady: () => {},
                        },
                    }
                );
            };
            window.checkoutButton = renderComponent(bricksBuilder);
        }
    }else{
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "your cart is empty";
        modalContainer.append(modalText);
    }
};

cartBtn.addEventListener("click", displayCart);

const deleteCartProduct =(id) => {
    const foundId = cart.findIndex((element)=> element.id === id);
    cart.splice(foundId, 1);
    displayCart()
    displayCartCounter();
};

const displayCartCounter = ()=> {
    const cartLenght = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartLenght > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLenght;
    }else{
        cartCounter.style.display = "none";
    }

};
