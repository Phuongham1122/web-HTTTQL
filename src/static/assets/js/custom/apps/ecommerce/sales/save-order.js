"use strict";

// Class definition
var KTAppEcommerceSalesSaveOrder = function () {
    // Shared variables
    var button;
    var cancel;

    // Submit form handler
    const handleSubmit = () => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
            const customerName = document.querySelector('[data-kt-ecommerce-order-filter="customerName"]').value;
            const orderId = document.querySelector('[data-kt-ecommerce-order-filter="order_id"]').value;
            Swal.fire({
                text: "Are you sure you want to accept order of " + customerName + "?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, accept!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    var data = {
                        'orderId': orderId,
                        'type': 2
                    };
                    $.ajax({
                        url: '/admin/home/apps/ecommerce/sales/orderApproval/', // Đường dẫn đến view trong Django
                        type: 'POST', // Phương thức HTTP
                        headers: {'X-CSRFToken': csrfToken},
                        data: JSON.stringify(data), // Dữ liệu gửi đi, chuyển sang dạng JSON
                        contentType: 'application/json', // Loại dữ liệu gửi đi
                        success: function(response) {
                            Swal.fire({
                                text: "You have accepted order of " + customerName + "!.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function () {
                                window.location = "/admin/home/apps/ecommerce/sales/orderApproval/";
                            });
                        },
                        error: function(xhr, status, error) {
                            Swal.fire({
                                text: "Sorry, looks like there are some errors detected, please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                            console.error(xhr.responseText);
                        }
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Status of this order was not changed.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        })
        cancel.addEventListener('click', function (e) {
                e.preventDefault();
                var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
                const customerName = document.querySelector('[data-kt-ecommerce-order-filter="customerName"]').value;
                const orderId = document.querySelector('[data-kt-ecommerce-order-filter="order_id"]').value;
                Swal.fire({
                    text: "Are you sure you want to cancel order of " + customerName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, accept!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        var data = {
                            'orderId': orderId,
                            'type': 0
                        };
                        $.ajax({
                            url: '/admin/home/apps/ecommerce/sales/orderApproval/', // Đường dẫn đến view trong Django
                            type: 'POST', // Phương thức HTTP
                            headers: {'X-CSRFToken': csrfToken},
                            data: JSON.stringify(data), // Dữ liệu gửi đi, chuyển sang dạng JSON
                            contentType: 'application/json', // Loại dữ liệu gửi đi
                            success: function(response) {
                                Swal.fire({
                                    text: "You have canceled order of " + customerName + "!.",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function () {
                                    window.location = "/admin/home/apps/ecommerce/sales/orderApproval/";
                                });
                            },
                            error: function(xhr, status, error) {
                                Swal.fire({
									text: "Sorry, looks like there are some errors detected, please try again.",
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Ok, got it!",
									customClass: {
										confirmButton: "btn btn-primary"
									}
								});
                                console.error(xhr.responseText);
                            }
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: "Status of this order was not changed.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
    }


    // Public methods
    return {
        init: function () {
            button = document.querySelector("#approveOrder");
            cancel = document.querySelector("#cancelOrder");
            handleSubmit();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceSalesSaveOrder.init();
});
