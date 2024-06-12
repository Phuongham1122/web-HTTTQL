import json
import re

from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from django.views import View

from .models import *

from collections import defaultdict


# Create your views here.
def main(request):
    items = Items.objects.all()
    product_dict = {}
    for product in items:
        size = product.Size
        price = product.Price
        id = product.ItemId
        name = product.Descriptions
        if product.Descriptions in product_dict:
            product_dict[name]['value'][id] = size
            product_dict[name]['price'] = price
        else:
            product_dict[name] = {}
            product_dict[name]['value'] = {}
            product_dict[name]['price'] = price
            product_dict[name]['value'][id] = size

    print(product_dict)

    return render(request, "app/home.html", {'product': product_dict})


class ShopCart(View):
    def get(self, request):
        return render(request, 'app/shop-cart.html')

    def post(self, request):
        data = json.loads(request.body)
        order = TemporaryOrder()
        idOrder = genId()
        order.OrderId = idOrder
        order.CustomerName = data.get('CustomerName', 'No Name')
        order.phone = data.get('phone', 'No Phone')
        order.OrderDate = timezone.now()
        order.Status = 1
        order.save()
        productList = data.get('products', [])
        for product in productList:
            tItem = TemporaryItems()
            tItem.ItemId = product.get('ItemId')
            tItem.Amount = int(product.get('Amount'))
            tItem.OrderId = TemporaryOrder.objects.get(pk=idOrder)
            tItem.save()
        print(data)
        return HttpResponse('success')


def genId():
    tOrder = TemporaryOrder.objects.last()
    new_id = "OD00000001"
    if tOrder is not None:
        max_id = tOrder.OrderId
        prefix = re.search(r'^(\D+)', max_id).group(1)
        suffix = int(re.search(r'(\d+)$', max_id).group(1))
        new_suffix = suffix + 1
        new_id = f"{prefix}{new_suffix:08d}"
    return new_id
