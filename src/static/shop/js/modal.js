"use strict";
var KTAppEcommerceProducts = function () {
    var form;
    var openButton;
    var closeButton;
    var modal;
    var sizeS;
    var sizeL;
    var sizeM;
    var sizeXL;
    var addToCart;
    var selectedValue

    var handelOpenModal = function () {
        openButton.forEach(o => {
			o.addEventListener('click', function(e) {
				e.preventDefault();
                $('.js-modal1').addClass('show-modal1');
                const parent = e.target.closest('.isotope-item');
                console.log(parent);
                modal.querySelector('[data-kt-product-modal="name"]').textContent = parent.querySelector('[data-kt-product-fill="name"]').textContent
                modal.querySelector('[data-kt-product-modal="price"]').textContent = parent.querySelector('[data-kt-product-fill="price"]').textContent
                const select = parent.querySelectorAll('[data-product-value-id="select"]')
                select.forEach(s => {
                    const id = s.querySelector('[data-product-value-id="id"]').textContent
                    const size = s.querySelector('[data-product-value-id="size"]').textContent

                    if (size==="S") {
                        sizeS.textContent = size;
                        sizeS.value = id;
                    }else if(size==="M"){
                        sizeM.textContent = size;
                        sizeM.value = id;
                    }else if(size==="L"){
                        sizeL.textContent = size;
                        sizeL.value = id;
                    }else if(size==="XL"){
                        sizeXL.textContent = size;
                        sizeXL.value = id;
                    }
                })
                if(sizeS.value==="") {
                    sizeS.setAttribute('disabled', 'disabled');
                }
                if(sizeL.value==="") {
                    sizeL.setAttribute('disabled', 'disabled');
                }
                if(sizeM.value==="") {
                    sizeM.setAttribute('disabled', 'disabled');
                }
                if(sizeXL.value==="") {
                    sizeXL.setAttribute('disabled', 'disabled');
                }
                $(".js-select2").each(function(){
                    $(this).select2({
                        minimumResultsForSearch: 20,
                        dropdownParent: $(this).next('.dropDownSelect2')
                    });
	            })
			});
		});

        closeButton.forEach(c => {
			c.addEventListener('click', function(e) {
				e.preventDefault();
                $('.js-modal1').removeClass('show-modal1');
                sizeS.value = "";
                sizeS.removeAttribute('disabled');
                sizeM.value = "";
                sizeM.removeAttribute('disabled');
                sizeL.value = "";
                sizeL.removeAttribute('disabled');
                sizeXL.value = "";
                sizeXL.removeAttribute('disabled');
                $(".js-select2").each(function(){
                    $(this).select2('destroy');
	            })
			});
		});

        $(".js-select2").on("change", function () {
            selectedValue = $(this).val();
        });
        addToCart.addEventListener('click', function(e) {
            e.preventDefault();
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
                var productId = selectedValue;
                var name = modal.querySelector('[data-kt-product-modal="name"]').textContent
                var price = modal.querySelector('[data-kt-product-modal="price"]').textContent
                var amount = modal.querySelector('[data-product-modal-number="count"]').value
                var item = {
                    Name: name.trim(),
                    ItemId: productId,
                    Price: price.trim(),
                    Amount: amount,
                }
                var cart = JSON.parse(localStorage.getItem(user)) || [];
                cart.push(item);
                localStorage.setItem(user, JSON.stringify(cart));
                var totalCount = cart.length;
                const data_notify = document.querySelector('#notification-cart');
                data_notify.setAttribute('data-notify', totalCount.toString());
                handelGetCart(cart);
                console.log("Số sản phẩm:", totalCount);
                console.log("sản phẩm gồm: ", cart);
            }
        });

    }

    const handelGetCart = function (cart) {
        const cart_list = document.querySelector('[data-product-card-list="list"]');
        if(!cart || cart.length === 0) {

        }else {
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


    return {
        init: function () {
            openButton = document.querySelectorAll('[data-kt-modal-open="open"]');
            closeButton = document.querySelectorAll('[data-kt-modal-close="close"]');
            addToCart = document.querySelector('#add-to-cart')
            modal = document.querySelector(".js-modal1");
            sizeS = modal.querySelector('[data-product-value-modal="S"]')
            sizeM = modal.querySelector('[data-product-value-modal="M"]')
            sizeL = modal.querySelector('[data-product-value-modal="L"]')
            sizeXL = modal.querySelector('[data-product-value-modal="XL"]')
            handelOpenModal();
        }
    };
}();


KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceProducts.init();
});

// (function ($) {
//     "use strict";
//     var form;
//     var openButton = document.querySelectorAll('[data-kt-modal-open="open"]');
//     var closeButton = document.querySelectorAll('[data-kt-modal-close="close"]');
//     var modal = document.querySelector(".js-modal1");
//
//     openButton.forEach(o => {
//         o.addEventListener('click', function(e) {
//             e.preventDefault();
//             $('.js-modal1').addClass('show-modal1');
//         });
//     });
//
//     closeButton.forEach(c => {
//         c.addEventListener('click', function(e) {
//             e.preventDefault();
//             $('.js-modal1').removeClass('show-modal1');
//         });
//     });
//
// })(jQuery);