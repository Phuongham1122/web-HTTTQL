"use strict";

// Class definition
var KTAppEcommerceProducts = function () {
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
            handleDeleteRows();
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
    var handleDeleteRows = () => {
        // Select all delete buttons
        const deleteButtons = table.querySelectorAll('[data-kt-ecommerce-product-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();
                var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get category name
                const productName = parent.querySelector('[data-kt-ecommerce-product-filter="product_name"]').innerText;
                const productId = parent.querySelector('[data-kt-ecommerce-product-filter="product_id"]').value;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + productName + "?",
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
                        listId.push(productId);
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
                                    text: "You have deleted " + productName + "!.",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-primary",
                                    }
                                }).then(function () {
                                    // Remove current row
                                    datatable.row($(parent)).remove().draw();
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
                            text: productName + " was not deleted.",
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


    var handleEditRows = function () {
        // datatable.on('page.dt', function () {
        //     openButton = table.querySelectorAll('[data-kt-ecommerce-product-filter="edit_row"]');
        //     console.log('Người dùng đã chuyển trang.');
        // });
        //
        // datatable.on('length.dt', function () {
        //     openButton = table.querySelectorAll('[data-kt-ecommerce-product-filter="edit_row"]');
        //     console.log('Người dùng đã đổi số lượng.');
        // });

        openButton.forEach(o => {
			o.addEventListener('click', function(e) {
				e.preventDefault();
				parent = e.target.closest('tr');
				const title = document.querySelector('#kt_modal_edit_product_value_header');
				productId = parent.querySelector('[data-kt-ecommerce-product-filter="product_id"]').value;
                form.querySelector('input[name="ItemId"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_id"]').value;
				form.querySelector('input[name="Descriptions"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_des"]').value;
				form.querySelector('input[name="Size"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_size"]').value;
				form.querySelector('input[name="Weight"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_weight"]').value;
				form.querySelector('input[name="Price"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_price"]').value;
				title.textContent = "Sửa thông tin của " + parent.querySelector('[data-kt-ecommerce-product-filter="product_des"]').value;
				modal.show();
			});
		});


        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		validator = FormValidation.formValidation(
			form,
			{
				fields: {
                    'Descriptions': {
						validators: {
							notEmpty: {
								message: 'Tên bắt buộc'
							}
						}
					},
                    'Price': {
						validators: {
							notEmpty: {
								message: 'Giá bắt buộc'
							}
						}
					},
					'Weight': {
						validators: {
							notEmpty: {
								message: 'Khối lượng bắt buộc'
							}
						}
					},
					'Size': {
						validators: {
							notEmpty: {
								message: 'Kích thước bắt buộc'
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

		// Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="country"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validator.revalidateField('country');
        });

		// Action buttons
		submitButton.addEventListener('click', function (e) {
			e.preventDefault();

			// Validate form before submit
			if (validator) {
				validator.validate().then(function (status) {
					console.log('validated!');
					if (status == 'Valid') {
						var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

						var data = {
							'ItemId': $(form.querySelector('[name="ItemId"]')).val(),
							'Descriptions': $(form.querySelector('[name="Descriptions"]')).val(),
							'Price': $(form.querySelector('[name="Price"]')).val(),
							'Weight': $(form.querySelector('[name="Weight"]')).val(),
							'Size': $(form.querySelector('[name="Size"]')).val(),
						}

						$.ajax({
							type: 'POST',
							url: '/admin/home/apps/ecommerce/catalog/products/', // Thay đổi đường dẫn này thành địa chỉ URL của view Django xử lý dữ liệu
							data: data,
							headers: {'X-CSRFToken': csrfToken},
							success: function(response) {
								console.log('Cập nhật thành công.');
								submitButton.setAttribute('data-kt-indicator', 'on');

								// Disable submit button whilst loading
								submitButton.disabled = true;

								setTimeout(function() {
									submitButton.removeAttribute('data-kt-indicator');

									Swal.fire({
										text: "Form has been successfully submitted!",
										icon: "success",
										buttonsStyling: false,
										confirmButtonText: "Ok, got it!",
										customClass: {
											confirmButton: "btn btn-primary"
										}
									}).then(function (result) {
										if (result.isConfirmed) {
											// Hide modal
											modal.hide();

											// Enable submit button after loading
											submitButton.disabled = false;

											// Redirect to customers list page
											window.location = "";
										}
									});
								}, 2000);
							},
							error: function(xhr, errmsg, err) {
								Swal.fire({
									text: "Sorry, looks like there are some errors detected, please try again.",
									icon: "error",
									buttonsStyling: false,
									confirmButtonText: "Ok, got it!",
									customClass: {
										confirmButton: "btn btn-primary"
									}
								});
								console.log('Lỗi khi gửi dữ liệu: ' + errmsg);
							}
						});

					} else {
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn btn-primary"
							}
						});
					}
				});
			}
		});

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form
                    modal.hide(); // Hide modal
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

		closeButton.addEventListener('click', function(e){
			e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form
                    modal.hide(); // Hide modal
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
		})
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
            handleDeleteRows();
            handleEditRows();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceProducts.init();
});
