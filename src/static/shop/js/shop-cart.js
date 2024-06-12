"use strict";
var KTShopCart = function () {
    var cart;
    var tbody;
    var update;
    var sendOrderButton;
    var form;
    var validator;
    var subTotal;
    var totalFullPrice;

    var handelGetShopCart = function () {
        const user = document.querySelector('[data-user-check-login="check"]').value;
        if(user === "") {

        }else {
            cart = JSON.parse(localStorage.getItem(user)) || [];
            tbody.innerHTML = '';
            if (!cart || cart.length === 0) {

            } else {
                let totalPrice = 0;
                let productItem;
                cart.forEach(product => {
                    totalPrice += (Number(product.Amount) * Number(product.Price))
                    productItem = document.createElement('tr');
                    productItem.className = "table_row";
                    productItem.setAttribute("data-product-shop-cart", "list");
                    const td1 = document.createElement('td');
                    td1.className = "column-1";
                    const divImg = document.createElement('div');
                    divImg.className = "how-itemcart1";
                    const img = document.createElement('img');
                    img.src = "/static/shop/images/item-cart-04.jpg";
                    img.setAttribute("alt", "IMG");
                    divImg.appendChild(img);
                    td1.appendChild(divImg);
                    const td2 = document.createElement('td');
                    td2.className = "column-2";
                    td2.textContent = product.Name;
                    td2.setAttribute("data-product-cart-change", "name");
                    const td3 = document.createElement('td');
                    td3.className = "column-3";
                    td3.textContent = product.Price;
                    td3.setAttribute("data-product-cart-change", "price");
                    const td4 = document.createElement('td');
                    td4.className = "column-4";
                    const divOfTd4 = document.createElement('div');
                    divOfTd4.className = "wrap-num-product flex-w m-l-auto m-r-0";
                    const divChild1 = document.createElement('div');
                    divChild1.className = "btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m";
                    const i1 = document.createElement('i');
                    i1.className = "fs-16 zmdi zmdi-minus";
                    divChild1.appendChild(i1);
                    const inputChild = document.createElement('input');
                    inputChild.className = "mtext-104 cl3 txt-center num-product";
                    inputChild.setAttribute("data-product-cart-change", "amount");
                    inputChild.setAttribute("name", "num-product2");
                    inputChild.setAttribute("type", "number");
                    inputChild.value = product.Amount;
                    const divChild2 = document.createElement('div');
                    divChild2.className = "btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m";
                    const i2 = document.createElement('i');
                    i2.className = "fs-16 zmdi zmdi-plus";
                    divChild2.appendChild(i2);
                    divOfTd4.appendChild(divChild1);
                    divOfTd4.appendChild(inputChild);
                    divOfTd4.appendChild(divChild2);
                    td4.appendChild(divOfTd4);
                    const td5 = document.createElement('td');
                    td5.className = "column-5";
                    let totalPriceOfProduct = Number(inputChild.value) * Number(td3.textContent);
                    td5.textContent = totalPriceOfProduct.toString();
                    const inputHide = document.createElement('input');
                    inputHide.setAttribute("type", "hidden");
                    inputHide.setAttribute("data-product-cart-change", "ItemId");
                    inputHide.value = product.ItemId;
                    productItem.appendChild(td1);
                    productItem.appendChild(td2);
                    productItem.appendChild(td3);
                    productItem.appendChild(td4);
                    productItem.appendChild(td5);
                    productItem.appendChild(inputHide);
                    tbody.appendChild(productItem);
                });
                subTotal.textContent = totalPrice.toString();
                totalFullPrice.textContent = totalPrice.toString();
            }
        }
        handelChangNumber();
    }

    var handelChangNumber = function () {
        var change = document.querySelectorAll('[data-product-cart-amount="change"]');
        console.log(change);
        var decreaseButtons = document.querySelectorAll('.btn-num-product-down');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const td = button.closest('td');
                const nextTd = td.nextElementSibling;
                const preTd = td.previousElementSibling;
                var numProduct = Number(this.nextElementSibling.value);
                if(numProduct > 0) {
                    this.nextElementSibling.value = numProduct - 1;
                    nextTd.textContent = ((numProduct - 1) * Number(preTd.textContent)).toString();
                }
            });
        });

        var increaseButtons = document.querySelectorAll('.btn-num-product-up');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const td = button.closest('td');
                const nextTd = td.nextElementSibling;
                const preTd = td.previousElementSibling;
                var numProduct = Number(this.previousElementSibling.value);
                this.previousElementSibling.value = numProduct + 1;
                nextTd.textContent = ((numProduct + 1) * Number(preTd.textContent)).toString();
            });
        });
    }

    var handelUpdateCart = function () {
        update.addEventListener('click', function (e) {
            var newItems = document.querySelectorAll('[data-product-shop-cart="list"]');
            const user = document.querySelector('[data-user-check-login="check"]').value;
            if(user === "") {
                swal({
                    title: "Not log in",
                    text: "Let log in to continue!",
                    icon: "error",
                    buttons: true,
                }).then((ok) => {
                    if (ok) {
                        window.location.href = "/view/login/";
                    }
                });
            }else {
                swal({
                    title: "Update Cart",
                    text: "Are you sure to update your cart!",
                    icon: "warning",
                    buttons: true,
                }).then((ok) => {
                    if(ok) {
                        let newProducts = [];
                        newItems.forEach(newItem => {
                            console.log(newItem);
                            const amount = newItem.querySelector('[data-product-cart-change="amount"]').value;
                            var newProduct = {
                                Name: newItem.querySelector('[data-product-cart-change="name"]').textContent.trim(),
                                ItemId: newItem.querySelector('[data-product-cart-change="ItemId"]').value,
                                Price: newItem.querySelector('[data-product-cart-change="price"]').textContent.trim(),
                                Amount: amount,
                            }
                            if(Number(amount) !== 0) newProducts.push(newProduct);
                        });
                        localStorage.setItem(user,JSON.stringify(newProducts));
                        handelGetCart();
                        handelGetShopCart();
                    }
                });
            }
        });
    }

    const handelGetCart = function () {
        const user = document.querySelector('[data-user-check-login="check"]').value;
        if(user === "") {

        }else {
            cart = JSON.parse(localStorage.getItem(user)) || [];
            const data_notify = document.querySelectorAll('[data-notify-number="notification-cart"]');
            data_notify.forEach(dn => {
                dn.setAttribute('data-notify', cart.length.toString());
            });
            const cart_list = document.querySelector('[data-product-card-list="list"]');

            cart_list.innerHTML = '';
            if (!cart || cart.length === 0) {
                const divEmpty = document.createElement('div');
                divEmpty.style.fontWeight = "bold";
                divEmpty.textContent = "No product on your cart";
                cart_list.appendChild(divEmpty);
            } else {
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


    var handelSendOrder = function () {
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'phone': {
                        validators: {
                            notEmpty: {
                                message: 'Fill your phone'
                            },
                            regexp: {
                                regexp: /^[0-9]{9,10}$/,
                                message: 'The phone number must be 9 or 10 digits'
                            }
                        }
                    },
                    'CustomerName': {
                        validators: {
                            notEmpty: {
                                message: 'Fill your name'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );

        sendOrderButton.addEventListener('click', function (e) {
            e.preventDefault();
            const user = document.querySelector('[data-user-check-login="check"]').value;
            const listItems = JSON.parse(localStorage.getItem(user)) || [];
            if(validator) {
                validator.validate().then(function (status) {
                    if(status == 'Valid') {
                        if(listItems.length === 0 || !listItems) {
                            swal({
                                title: "No product",
                                text: "You don't have any products on your cart",
                                icon: "error",
                                buttons: true,
                            })
                        }else {
                            swal({
                                text: "Are you sure you want to place this order?",
                                icon: "warning",
                                buttons: true,
                            }).then((ok) => {
                                if (ok) {
                                    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
                                    var data = {
                                        products: listItems,
                                        CustomerName: form.querySelector('[data-product-form-order="name"]').value,
                                        phone: form.querySelector('[data-product-form-order="phone"]').value,
                                    }
                                    $.ajax({
                                        type: 'POST',
                                        url: '/cart/',
                                        data: JSON.stringify(data),
                                        headers: {'X-CSRFToken': csrfToken},
                                        success: function(response) {
                                            console.log("test ok");
                                            swal("Your order have been saved!", "", "success");
                                            localStorage.removeItem(user);
                                            handelGetShopCart();
                                            handelGetCart();
                                            window.location = "/home/";
                                        },
                                        error: function(response) {
                                            console.log("error");
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    return {
        init: function () {
            tbody = document.querySelector("#tbody-shop-cart");
            update = document.querySelector("#update-shop-cart");
            sendOrderButton = document.querySelector("#send-order");
            form = document.querySelector("#form-order-send");
            subTotal = document.querySelector("#subtotal");
            totalFullPrice = document.querySelector("#totalFullProduct");
            console.log(form);
            handelGetShopCart();
            // handelChangNumber();
            handelUpdateCart();
            handelSendOrder();
        }
    };
}();


KTUtil.onDOMContentLoaded(function () {
    KTShopCart.init();
});
