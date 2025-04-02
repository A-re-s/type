import uuid
from xml.sax.xmlreader import AttributesImpl
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.template import context
from django.urls import reverse

from users.forms import UserLoginForm, UserRegistrationForm
from users.models import Attemp, User
from django.core.management import call_command

# Create your views here.


def login(request):
    if request.method == 'POST':
        if 'login' in request.POST:
            form = UserLoginForm(data=request.POST)
            if form.is_valid():
                username = request.POST['username']
                password = request.POST['password']
                user = auth.authenticate(username=username, password=password)
                if user:
                    auth.login(request, user)
                    return HttpResponseRedirect(reverse('main:index'))
        elif 'register' in request.POST:
            form = UserRegistrationForm(data=request.POST)
            if form.is_valid():
                form.save()
                user = form.instance
                auth.login(request, user)
                return HttpResponseRedirect(reverse('main:index'))
        else:
            form = UserLoginForm()
    else:
        form = UserLoginForm()

    context = {
        'title': 'login',
        'form': form
    }
    return render(request, 'users/login.html', context)

@login_required
def profile(request):
    attemps = Attemp.objects.filter(user=request.user).order_by('-attemp_time')
    telegram_id = request.user.telegram_id
    context = {
        'title': 'profile',
        'attemps':attemps,
        'telegram_id':telegram_id,
    }
    return render(request, 'users/profile.html', context)


@login_required
def logout(request):
    auth.logout(request)
    return redirect(reverse('main:index'))


def add_symbols(request):
    if request.method == 'POST':
        lettersTyped = int(request.POST.get("lettersTyped", 0)) 
        if request.user.is_authenticated:
            user = get_object_or_404(User, username=request.user.username)
            user.symbols_typed += lettersTyped
            if "wpm" not in request.POST:
                user.save()
                return JsonResponse({'success': True})
            wpm = int(request.POST.get("wpm", 0)) 
            accuracy = int(request.POST.get("accuracy", 0))
            error_cnt = int(request.POST.get("error_cnt", 0))
            mode = request.POST.get("mode", "")
            attemp_instance = Attemp.objects.create(user=user,
                                                            wpm=wpm,
                                                            accuracy=accuracy,
                                                            error_cnt=error_cnt,
                                                            mode=mode
                                                            )
            attemp_instance.save()
            user.save()
            if user.telegram_id:
                count = Attemp.objects.filter(user__username=request.user.username).count()
                call_command('send_attemp', user.telegram_id, f"{request.user.username}\n🟡Attemp {count}\n⚫mode: {mode}\n🟡WPM: {wpm}\n⚫ACC: {accuracy/100}%\n🟡ERR: {error_cnt}")
            return JsonResponse({'success': True})  # Ответ в формате JSON
        else:
            return JsonResponse({'success': False, 'error': 'User is not authentica ted'})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})


from django.shortcuts import redirect

@login_required
def link_telegram(request):
    user = request.user
    if not user.telegram_token:
        user.telegram_token = uuid.uuid4()
        user.save()
    
    telegram_link = f"https://t.me/typetesting_bot?start={user.telegram_token}"
    return redirect(telegram_link)


@login_required
def unlink_telegram(request):
    user = request.user
    user.telegram_id = None
    user.save()
    return redirect(reverse('users:profile'))