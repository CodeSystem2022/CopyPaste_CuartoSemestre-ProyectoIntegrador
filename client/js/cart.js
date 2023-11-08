const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const cart = [];

const displayCart = async () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    totalPrice = 0;
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
    modalTitle.innerText = "Carrito";    
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);
    modalContainer.append(modalHeader);

    //modal Body
    if(cart.length > 0){
        await Promise.all(cart.map(async (product) => {
        
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body";
            const response = await fetch(`/productos/${product.id}`);
            const producto = await response.json();
                    product.name = producto.name;
                    product.price = producto.price;
                    product.img = producto.img;
                    product.quantity = 1;
                    modalBody.innerHTML = `
                        <div class="product">
                            <img class="product-img" src="${producto.img}" />
                            <div class="product-info">
                            <h4>${producto.name}</h4>
                            </div>
                            <div class="quantity">
                                <span class="quantity-btn-decrese">-</span>
                                <span class="quantity-input">${product.quantity}</span>>
                                <span class="quantity-btn-increse">+</span>
                            </div>
                            <div class="price">$ ${producto.price * product.quantity} </div>
                            <div class="delete-product">❌</div>
                        </div>
                    `;
                    modalContainer.append(modalBody);
                    // Restar uno al producto

                    const decrese = modalBody.querySelector(".quantity-btn-decrese");
                    decrese.addEventListener("click", () => {
                        if(product.quantity !== 1){
                            product.quantity--;
                            const quantityInput = modalBody.querySelector(".quantity-input");
                            const price = modalBody.querySelector(".price");
                            quantityInput.innerText = product.quantity;
                            price.innerText = `$ ${producto.price * product.quantity}`;
                            updateTotalPrice();
                        }
                    });
                    //Aumentar uno al producto
                    const increse = modalBody.querySelector(".quantity-btn-increse");
                    increse.addEventListener("click", () => {
                        product.quantity++;
                        const quantityInput = modalBody.querySelector(".quantity-input");
                        const price = modalBody.querySelector(".price");
                        quantityInput.innerText = product.quantity;
                        price.innerText = `$ ${producto.price * product.quantity}`;
                        updateTotalPrice();
                    });
                    //Delete product
                    const deleteProduct = modalBody.querySelector(".delete-product");
                    deleteProduct.addEventListener("click", ()=> {
                        deleteCartProduct(producto.id)
                    });
                }));
        
    //modal footer
    const total = cart.reduce((acc,el) => acc + el.price * el.quantity, 0);
    totalPrice = total;

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
    <div class = "total-price">Total: $ ${total}</div>
    <button class = "btn-primary" id="checkout-btn"> Pagar </button> 
    <div id="button-checkout"></div>
`;

    modalContainer.append(modalFooter);

    //Mercado Pago;
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
        modalText.innerText = "El carrito está vació!";
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
    const cartLenght = cart.reduce((acc, el) => acc + el.quantity, 0);
    if (cartLenght > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLenght;
    }else{
        cartCounter.style.display = "none";
    }

};


function updateTotalPrice() {
    const modalFooter = document.querySelector(".modal-footer");
    const total = cart.reduce((acc, el) => acc + el.price * el.quantity, 0);
    totalPrice = total;
    const totalElement = modalFooter.querySelector(".total-price");
    totalElement.innerText = `Total: $ ${totalPrice}`;
}
