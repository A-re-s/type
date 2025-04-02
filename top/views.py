from django.http import JsonResponse
from django.shortcuts import render
from users.models import User
from django.template.loader import render_to_string
# Create your views here.

def top(request):
    top_users = User.objects.order_by('-symbols_typed')[:100]
    context = {
       'top_users': top_users,
    }
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        html = render_to_string('top/leaderboard_ajax.html', context)
        return JsonResponse({'html': html})

    return render(request, 'top/leaderboard.html', context)