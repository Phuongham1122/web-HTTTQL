"use strict";
var KTAppAddToCart = function () {
    var cart;

    var handelGetCart = function () {
        const user = document.querySelector('[data-user-check-login="check"]').value;
        if(user === "") {

        }else {
            cart = JSON.parse(localStorage.getItem(user)) || [];
            const data_notify = document.querySelector('#notification-cart');
            data_notify.setAttribute('data-notify', cart.length.toString());
            const cart_list = document.querySelector('[data-product-card-list="list"]');
            if (!cart || cart.length === 0) {

            } else {
                cart_list.innerHTML = '';
                let totalPrice = 0;
                let productItem;
                cart.forEach(product => {
                    productItem = document.createElement('li');
                    productItem.className = "header-cart-item flex-w flex-t m-b-12";
                    const imageTag = document.createElement('div');
                    imageTag.className = "header-cart-item-img";
                    const dataTag = document.createElement('div');
                    dataTag.className = "header-cart-item-txt p-t-8";
                    const img = document.createElement('img');
                    img.src = "/static/shop/images/item-cart-01.jpg";
                    img.setAttribute("alt", "IMG");
                    imageTag.appendChild(img);
                    const nameTag = document.createElement('a');
                    nameTag.className = "header-cart-item-name m-b-18 hov-cl1 trans-04";
                    nameTag.textContent = product.Name;
                    const spanTag = document.createElement('span');
                    const spanId = document.createElement('span');
                    spanTag.className = "header-cart-item-info";
                    const spanAmount = document.createElement('span');
                    const spanPrice = document.createElement('span');
                    spanAmount.textContent = product.Amount;
                    spanPrice.textContent = product.Price;
                    spanPrice.style.fontWeight = "bold";
                    spanId.textContent = product.ItemId;
                    spanId.style.display = "none";
                    totalPrice += (product.Amount * product.Price);
                    let textNote = document.createTextNode("Amount: ");
                    spanTag.appendChild(spanAmount);
                    spanTag.appendChild(spanPrice);
                    spanTag.insertBefore(textNote, spanAmount);
                    textNote = document.createTextNode(", Price: ");
                    spanTag.insertBefore(textNote, spanPrice);
                    dataTag.appendChild(nameTag);
                    dataTag.appendChild(spanTag);
                    dataTag.appendChild(spanId);
                    productItem.appendChild(imageTag);
                    productItem.appendChild(dataTag);
                    cart_list.appendChild(productItem);
                });
                const total = document.querySelector('[data-product-card-allprice="total"]');
                total.textContent = "Total: " + totalPrice;
            }
        }
    }


    return {
        init: function () {

            handelGetCart();
        }
    };
}();


KTUtil.onDOMContentLoaded(function () {
    KTAppAddToCart.init();
});
