from django.shortcuts import redirect
from django.urls import reverse


class AppAuthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/'):
            login_url = reverse('login:login')
            if not request.user.is_authenticated:
                return redirect(f'{login_url}?next={request.path}')
            if not request.user.is_superuser:
                return redirect(f'{login_url}?next={request.path}&status=notPermission')
        response = self.get_response(request)
        return response
