"use strict";

// Class definition
var KTAppEcommerceOrderApproval = function () {
    // Shared variables
    var table;
    var datatable;
    var submitButton;
    var cancelButton;
	var openButton;
	var closeButton;
    var validator;
    var form;
    var modal;
	var parent;
	var productId;

    // Private functions
    var initDatatable = function () {
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'pageLength': 10,
            'columnDefs': [
                { render: DataTable.render.number(',', '.', 2), targets: 4},
                { orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
                { orderable: false, targets: 7 }, // Disable ordering on column 7 (actions)
            ]
        });

        // Re-init functions on datatable re-draws
        datatable.on('draw', function () {
            initToggleToolbar();
            toggleToolbars();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-ecommerce-product-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Handle status filter dropdown
    var handleStatusFilter = () => {
        const filterStatus = document.querySelector('[data-kt-ecommerce-product-filter="status"]');
        $(filterStatus).on('change', e => {
            let value = e.target.value;
            if(value === 'all'){
                value = '';
            }
            datatable.column(6).search(value).draw();
        });
    }

    // Delete product
    var handleChangeStatus = () => {
        // Select all delete buttons
        const approveButtons = table.querySelectorAll('[data-kt-ecommerce-order-filter="approve_row"]');
        approveButtons.forEach(a => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
                const parent = e.target.closest('tr');
                const customerName = parent.querySelector('[data-kt-ecommerce-order-filter="customerName"]').innerText;
                const orderId = parent.querySelector('[data-kt-ecommerce-order-filter="order_id"]').textContent;
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
                                    const status = parent.querySelector('[data-kt-ecommerce-order-filter="status"]');
                                    status.setAttribute("data-order", 'Approved');
                                    const divStatus = status.querySelector('.badge');
                                    divStatus.className = "badge badge-light-success";
                                    divStatus.textContent = "Approved";
                                    window.location = "";
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
        });
        const cancelButtons = table.querySelectorAll('[data-kt-ecommerce-order-filter="cancel_row"]');
        cancelButtons.forEach(c => {
            c.addEventListener('click', function (e) {
                e.preventDefault();
                var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
                const parent = e.target.closest('tr');
                const customerName = parent.querySelector('[data-kt-ecommerce-order-filter="customerName"]').innerText;
                const orderId = parent.querySelector('[data-kt-ecommerce-order-filter="order_id"]').textContent;
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
                                    const status = parent.querySelector('[data-kt-ecommerce-order-filter="status"]');
                                    status.setAttribute("data-order", 'Denied');
                                    const divStatus = status.querySelector('.badge');
                                    divStatus.className = "badge badge-light-danger";
                                    divStatus.textContent = "Denied";
                                    window.location = "";
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
        });
    }

    // Init toggle toolbar
    var initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        const checkboxes = table.querySelectorAll('[type="checkbox"]');

        // Select elements
        const deleteSelected = document.querySelector('[data-kt-customer-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function (e) {
                setTimeout(function () {
                    toggleToolbars();
                }, 0.001);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function () {
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
            Swal.fire({
                text: "Are you sure you want to delete selected customers?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    var listId = [];
                    checkboxes.forEach(c => {
                        if(c.checked) {
                            const parent = c.closest('tr');
                            const productId = parent.querySelector('[data-kt-ecommerce-product-filter="product_id"]').value;
                            listId.push(productId)
                        }
                    });
                    var data = {
                        'ids': listId
                    };
                    $.ajax({
                        url: '/admin/home/deleteProduct/', // Đường dẫn đến view trong Django
                        type: 'POST', // Phương thức HTTP
                        headers: {'X-CSRFToken': csrfToken},
                        data: JSON.stringify(data), // Dữ liệu gửi đi, chuyển sang dạng JSON
                        contentType: 'application/json', // Loại dữ liệu gửi đi
                        success: function(response) {
                            Swal.fire({
                                text: "You have deleted all selected customers!.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function () {
                                // Remove all selected customers
                                checkboxes.forEach(c => {
                                    if (c.checked) {
                                        datatable.row($(c.closest('tbody tr'))).remove().draw();
                                    }
                                });

                                // Remove header checked box
                                const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                                headerCheckbox.checked = false;
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
                        text: "Selected customers was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }


    // Toggle toolbars
    const toggleToolbars = () => {
        // Define variables
        const toolbarBase = document.querySelector('[data-kt-customer-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-customer-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-customer-table-select="selected_count"]');

        // Select refreshed checkbox DOM elements
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }




    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_ecommerce_products_table');
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_edit_product'));
            openButton = table.querySelectorAll('[data-kt-ecommerce-product-filter="edit_row"]');
            form = document.querySelector('#kt_modal_edit_product_form');
            submitButton = form.querySelector('#kt_modal_edit_product_submit');
            cancelButton = form.querySelector('#kt_modal_edit_product_cancel');
			closeButton = form.querySelector('#kt_modal_edit_product_close');

            if (!table) {
                return;
            }

            initDatatable();
            initToggleToolbar();
            handleSearchDatatable();
            handleStatusFilter();
            handleChangeStatus();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceOrderApproval.init();
});
