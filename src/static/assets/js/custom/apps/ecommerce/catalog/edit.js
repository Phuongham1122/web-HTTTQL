// "use strict";
//
// // Class definition
// var KTModalProductEdit = function () {
//     var submitButton;
//     var cancelButton;
// 	var openButton;
// 	var closeButton;
//     var validator;
//     var form;
//     var modal;
// 	var parent;
// 	var productId;
// 	var table;
//
//     // Init form inputs
//     var handleForm = function () {
// 		openButton.forEach(o => {
// 			o.addEventListener('click', function(e) {
// 				e.preventDefault();
// 				parent = e.target.closest('tr');
// 				const title = document.querySelector('#kt_modal_edit_product_value_header');
// 				form.querySelector('input[name="ItemId"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_id"]').value;
// 				form.querySelector('input[name="Descriptions"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_des"]').value;
// 				form.querySelector('input[name="Size"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_size"]').value;
// 				form.querySelector('input[name="Weight"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_weight"]').value;
// 				form.querySelector('input[name="Price"]').value = parent.querySelector('[data-kt-ecommerce-product-filter="product_price"]').value;
// 				title.textContent = "Sửa thông tin của " + parent.querySelector('[data-kt-ecommerce-product-filter="product_des"]').value;
// 				modal.show();
// 			});
// 		});
//
//
//         // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
// 		validator = FormValidation.formValidation(
// 			form,
// 			{
// 				fields: {
//                     'Descriptions': {
// 						validators: {
// 							notEmpty: {
// 								message: 'Tên bắt buộc'
// 							}
// 						}
// 					},
//                     'Price': {
// 						validators: {
// 							notEmpty: {
// 								message: 'Giá bắt buộc'
// 							}
// 						}
// 					},
// 					'Weight': {
// 						validators: {
// 							notEmpty: {
// 								message: 'Khối lượng bắt buộc'
// 							}
// 						}
// 					},
// 					'Size': {
// 						validators: {
// 							notEmpty: {
// 								message: 'Kích thước bắt buộc'
// 							}
// 						}
// 					},
// 				},
// 				plugins: {
// 					trigger: new FormValidation.plugins.Trigger(),
// 					bootstrap: new FormValidation.plugins.Bootstrap5({
// 						rowSelector: '.fv-row',
//                         eleInvalidClass: '',
//                         eleValidClass: ''
// 					})
// 				}
// 			}
// 		);
//
// 		// Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
//         $(form.querySelector('[name="country"]')).on('change', function() {
//             // Revalidate the field when an option is chosen
//             validator.revalidateField('country');
//         });
//
// 		// Action buttons
// 		submitButton.addEventListener('click', function (e) {
// 			e.preventDefault();
//
// 			// Validate form before submit
// 			if (validator) {
// 				validator.validate().then(function (status) {
// 					console.log('validated!');
// 					if (status == 'Valid') {
// 						var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
//
// 						var data = {
// 							'ItemId': $(form.querySelector('[name="ItemId"]')).val(),
// 							'Descriptions': $(form.querySelector('[name="Descriptions"]')).val(),
// 							'Price': $(form.querySelector('[name="Price"]')).val(),
// 							'Weight': $(form.querySelector('[name="Weight"]')).val(),
// 							'Size': $(form.querySelector('[name="Size"]')).val(),
// 						}
// 						console.log(data)
//
// 						$.ajax({
// 							type: 'POST',
// 							url: '/admin/home/editProduct/', // Thay đổi đường dẫn này thành địa chỉ URL của view Django xử lý dữ liệu
// 							data: data,
// 							headers: {'X-CSRFToken': csrfToken},
// 							success: function(response) {
// 								console.log('Thêm sản phẩm mới thành công.');
//
// 								submitButton.setAttribute('data-kt-indicator', 'on');
//
// 								// Disable submit button whilst loading
// 								submitButton.disabled = true;
//
// 								setTimeout(function() {
// 									submitButton.removeAttribute('data-kt-indicator');
//
// 									Swal.fire({
// 										text: "Form has been successfully submitted!",
// 										icon: "success",
// 										buttonsStyling: false,
// 										confirmButtonText: "Ok, got it!",
// 										customClass: {
// 											confirmButton: "btn btn-primary"
// 										}
// 									}).then(function (result) {
// 										if (result.isConfirmed) {
// 											// Hide modal
// 											modal.hide();
//
// 											// Enable submit button after loading
// 											submitButton.disabled = false;
//
// 											// Redirect to customers list page
// 											window.location = "";
// 										}
// 									});
// 								}, 2000);
// 							},
// 							error: function(xhr, errmsg, err) {
// 								// Xử lý lỗi nếu có
// 								console.log('Lỗi khi gửi dữ liệu: ' + errmsg);
// 							}
// 						});
//
// 					} else {
// 						Swal.fire({
// 							text: "Sorry, looks like there are some errors detected, please try again.",
// 							icon: "error",
// 							buttonsStyling: false,
// 							confirmButtonText: "Ok, got it!",
// 							customClass: {
// 								confirmButton: "btn btn-primary"
// 							}
// 						});
// 					}
// 				});
// 			}
// 		});
//
//         cancelButton.addEventListener('click', function (e) {
//             e.preventDefault();
//
//             Swal.fire({
//                 text: "Are you sure you would like to cancel?",
//                 icon: "warning",
//                 showCancelButton: true,
//                 buttonsStyling: false,
//                 confirmButtonText: "Yes, cancel it!",
//                 cancelButtonText: "No, return",
//                 customClass: {
//                     confirmButton: "btn btn-primary",
//                     cancelButton: "btn btn-active-light"
//                 }
//             }).then(function (result) {
//                 if (result.value) {
//                     form.reset(); // Reset form
//                     modal.hide(); // Hide modal
//                 } else if (result.dismiss === 'cancel') {
//                     Swal.fire({
//                         text: "Your form has not been cancelled!.",
//                         icon: "error",
//                         buttonsStyling: false,
//                         confirmButtonText: "Ok, got it!",
//                         customClass: {
//                             confirmButton: "btn btn-primary",
//                         }
//                     });
//                 }
//             });
//         });
//
// 		closeButton.addEventListener('click', function(e){
// 			e.preventDefault();
//
//             Swal.fire({
//                 text: "Are you sure you would like to cancel?",
//                 icon: "warning",
//                 showCancelButton: true,
//                 buttonsStyling: false,
//                 confirmButtonText: "Yes, cancel it!",
//                 cancelButtonText: "No, return",
//                 customClass: {
//                     confirmButton: "btn btn-primary",
//                     cancelButton: "btn btn-active-light"
//                 }
//             }).then(function (result) {
//                 if (result.value) {
//                     form.reset(); // Reset form
//                     modal.hide(); // Hide modal
//                 } else if (result.dismiss === 'cancel') {
//                     Swal.fire({
//                         text: "Your form has not been cancelled!.",
//                         icon: "error",
//                         buttonsStyling: false,
//                         confirmButtonText: "Ok, got it!",
//                         customClass: {
//                             confirmButton: "btn btn-primary",
//                         }
//                     });
//                 }
//             });
// 		})
//     }
//
//     return {
//         // Public functions
//         init: function () {
//             // Elements
//             modal = new bootstrap.Modal(document.querySelector('#kt_modal_edit_product'));
// 			table = document.querySelector('#kt_ecommerce_products_table');
// 			openButton = table.querySelectorAll('[data-kt-ecommerce-product-filter="edit_row"]');
//             form = document.querySelector('#kt_modal_edit_product_form');
//             submitButton = form.querySelector('#kt_modal_edit_product_submit');
//             cancelButton = form.querySelector('#kt_modal_edit_product_cancel');
// 			closeButton = form.querySelector('#kt_modal_edit_product_close');
//
//
//             handleForm();
//         }
//     };
// }();
//
// // On document ready
// KTUtil.onDOMContentLoaded(function () {
// 	KTModalProductEdit.init();
// });
//
//
//
//
//
//
//
//
