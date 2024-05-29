from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from django.views import View

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