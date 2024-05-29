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
                item.ItemId = genId()
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


def genId():
    product = Items.objects.last()
    max_id = product.ItemId
    prefix = re.search(r'^(\D+)', max_id).group(1)
    suffix = int(re.search(r'(\d+)$', max_id).group(1))
    new_suffix = suffix + 1
    new_id = f"{prefix}{new_suffix:08d}"
    return new_id
