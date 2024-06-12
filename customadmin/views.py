import json
import re

from django.db.models import Max
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth import decorators

from app.models import *
from django.views import View
from .forms import *


# Create your views here.
# @decorators.login_required(login_url='login:login')
def home(request):
    # if not request.user.is_superuser:
    #     return redirect('login:login')
    return redirect('customadmin:dashboard')


# @decorators.login_required(login_url='login:login')
def dashboard(request):
    # if not request.user.is_superuser:
    #     return redirect('login:login')
    return render(request, 'customadmin/dashboard.html')


class DeleteProduct(View):
    def post(self, request):
        data = json.loads(request.body)
        ids = data.get('ids', [])
        try:
            Items.objects.filter(ItemId__in=ids).delete()
            # Trả về phản hồi thành công nếu xóa thành công
            return HttpResponse("Thành công")
        except Exception as e:
            print("NOT OK")
            return HttpResponse("Lỗi khi thêm dữ liệu", status=400)


class ProductClass(View):
    # login_url = 'login:login'
    #
    # def test_func(self):
    #     return self.request.user.is_authenticated and self.request.user.is_superuser
    #
    # def dispatch(self, request, *args, **kwargs):
    #     if not self.test_func():
    #         return self.handle_no_permission()
    #     return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        product = Items.objects.all()
        return render(request, 'customadmin/products.html', {'product': product})

    def post(self, request):
        itemId = request.POST.get('ItemId')
        if itemId is not None:
            item = get_object_or_404(Items, pk=itemId)
            form = ItemForm(request.POST, instance=item)
            if form.is_valid():
                form.save()
                print("OK")
                return HttpResponse("Thành công")
            else:
                print("NOT OK")
                return HttpResponse("Lỗi khi thêm dữ liệu", status=400)
        else:
            form = ItemForm(request.POST)
            if form.is_valid():
                print("form ok")
                item = Items()
                product = Items.objects.last()
                item.ItemId = genId(product.ItemId)
                item.Time = timezone.now()
                item.Descriptions = form.cleaned_data['Descriptions']
                item.Size = form.cleaned_data['Size']
                item.Weight = form.cleaned_data['Weight']
                item.Price = form.cleaned_data['Price']
                item.save()
                print("OK")
                return HttpResponse("Thành công")
            else:
                print("NOT OK")
                return HttpResponse("Lỗi khi thêm dữ liệu", status=400)


def genId(max_id):
    prefix = re.search(r'^(\D+)', max_id).group(1)
    suffix = int(re.search(r'(\d+)$', max_id).group(1))
    new_suffix = suffix + 1
    new_id = f"{prefix}{new_suffix:08d}"
    return new_id


class OrderApproval(View):
    def get(self, request):
        temOrders = TemporaryOrder.objects.all()
        temItems = TemporaryItems.objects.all()
        return render(request, 'customadmin/orderApproval.html', {'temOrders': temOrders, 'temItems': temItems})

    def post(self, request):
        data = json.loads(request.body)
        orderId = data.get('orderId', '')
        typeUpdate = data.get('type', '')
        try:
            temOrders = TemporaryOrder.objects.get(OrderId=orderId)
            if typeUpdate == 2:
                orders = Orders()
                order = Orders.objects.last()
                orders.OrderId = genId(order.OrderId)
                orders.OrderDate = temOrders.OrderDate
                print(temOrders.phone)
                phoneNum_query = PhoneNumber.objects.filter(phone=temOrders.phone)
                print(phoneNum_query)
                if phoneNum_query.exists():
                    phoneNum = phoneNum_query.first()
                    orders.CustomerId = Customers.objects.get(pk=phoneNum.CustomerId)
                else:
                    customer = Customers()
                    customer_last = Customers.objects.last()
                    customer.CustomerId = genId(customer_last.CustomerId)
                    customer.CustomerName = temOrders.CustomerName
                    customer.CityId = RepresentativeOffices.objects.get(pk="CT01")
                    customer.FirstOrderDate = temOrders.OrderDate
                    customer.save()
                    phone_number = PhoneNumber()
                    phone_number.phone = temOrders.phone
                    phone_number.CustomerId = Customers.objects.get(pk=customer.CustomerId)
                    phone_number.save()
                    orders.CustomerId = Customers.objects.get(pk=customer.CustomerId)
                orders.save()
                ItemIdList = TemporaryItems.objects.filter(OrderId__OrderId=orderId).values_list('ItemId', flat=True)
                ItemOrder = TemporaryItems.objects.filter(OrderId__OrderId=orderId)
                itemOrder_map = {orderItem.ItemId: orderItem.Amount for orderItem in ItemOrder}
                items = Items.objects.filter(ItemId__in=list(ItemIdList))
                for item in items:
                    orderItem = OrderedItems()
                    orderItem.OrderId = Orders.objects.get(pk=orders.OrderId)
                    orderItem.ItemId = Items.objects.get(pk=item.ItemId)
                    orderItem.OrderedQuantity = itemOrder_map.get(item.ItemId, 0)
                    orderItem.OrderCost = itemOrder_map.get(item.ItemId, 0) * item.Price
                    storeItem = get_object_or_404(StoredItems, ItemId=item.ItemId, StoreId="ST00000001")
                    storeItem.StoredQuantity = storeItem.StoredQuantity - itemOrder_map.get(item.ItemId, 0)
                    storeItem.save()
                    orderItem.save()
                temOrders.Status = 2
                temOrders.save()
                print(temOrders)
                return HttpResponse("Thành công")
            elif typeUpdate == 0:
                temOrders.Status = 0
                temOrders.save()
                return HttpResponse("Thành công")
        except Exception as e:
            print("NOT OK")
            print(e)
            return HttpResponse("Lỗi khi thay đổi dữ liệu", status=400)


class OrderDetail(View):
    def get(self, request, order_id):
        temOrders = TemporaryOrder.objects.get(OrderId=order_id)
        ItemIdList = TemporaryItems.objects.filter(OrderId__OrderId=order_id).values_list('ItemId', flat=True)
        ItemOrder = TemporaryItems.objects.filter(OrderId__OrderId=order_id)
        items = Items.objects.filter(ItemId__in=list(ItemIdList))
        storeItem = StoredItems.objects.filter(ItemId__in=list(ItemIdList), StoreId="ST00000001")
        itemOrder_map = {orderItem.ItemId: orderItem.Amount for orderItem in ItemOrder}
        storeItem_map = {store_item.ItemId_id: store_item.StoredQuantity for store_item in storeItem}
        combine_Item = []
        for item in items:
            combine_Item.append({
                'ItemId': item.ItemId,
                'Descriptions': item.Descriptions,
                'Size': item.Size,
                'Weight': item.Weight,
                'Price': item.Price,
                'Time': item.Time,
                'Quantity': int(storeItem_map.get(item.ItemId, 0)),
                'Amount': int(itemOrder_map.get(item.ItemId, 0)),
            })
        print(combine_Item)
        return render(request, 'customadmin/orderDetail.html', {'order': temOrders, 'items': combine_Item})


