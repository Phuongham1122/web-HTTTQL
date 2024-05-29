from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse, JsonResponse


def main(request):
    return render(request, 'login/login.html')


class UserSignUp(View):
    def get(self, request):
        return render(request, 'login/signup.html')

    def post(self, request):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            print("OK")
            user = form.save(commit=False)
            user.first_name = request.POST.get('first_name')
            user.last_name = request.POST.get('last_name')
            user.email = request.POST.get('email')
            password1 = form.cleaned_data.get('password1')  # Lấy mật khẩu từ form
            password2 = form.cleaned_data.get('password2')
            user.set_password(password2)  # Sử dụng phương thức set_password() để lưu mật khẩu đã được mã hóa
            user.save()
            user = authenticate(username=user.username, password=password2)
            login(request, user)
            return redirect('web:main')  # Thay 'home' bằng tên view của trang chính của bạn
        else:
            print("NOT")
            return HttpResponse("Dữ liệu không hơ lệ", status=500)

class UserLogin(View):
    def get(self, request):
        return render(request, 'login/login.html')

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_superuser:
                print("OK")
                return JsonResponse({'status': 1})
            else:
                print("NOTOK")
                return JsonResponse({'status': 0})
        else:
            print("NOTNOTOK")
            return HttpResponse("Lỗi", status=500)


def logout_view(request):
    logout(request)
    if request.user.is_superuser:
        return redirect('login:login')
    else:
        return redirect('web:main')
