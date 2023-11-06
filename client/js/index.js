const shopContent = document.getElementById("shopContent");

fetch("/productos")
    .then((response) => response.json())
    .then((productos) => {
        productos.forEach((product) =>{
            const content = document.createElement("div");
            content.className = "card";
            content.innerHTML = `
            <img src="${product.img}">
            <h3>${product.name}</h3>
            <p>${product.price} $</p>
            `;
            shopContent.append(content);

            const buyButton = document.createElement("button");
            buyButton.innerText = "Comprar";

            content.append(buyButton);

            buyButton.addEventListener("click", ()=>{
                const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id);
                if (repeat) {
                    cart.map((prod) => {
                        if (prod.id === product.id){
                            prod.quanty++;
                            displayCartCounter();
                        }
                    });
                }else{
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        img: product.img,
                    });
                    displayCartCounter();
                }
            });
        });
    });