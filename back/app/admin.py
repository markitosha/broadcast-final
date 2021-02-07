import csv
import datetime

from django.http.response import HttpResponse
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from app.models import User, Broadcast, Poll
from io import StringIO


@admin.register(User)
class UserAdmin(BaseUserAdmin):

    list_display = ('id', 'phone', 'date_joined', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('partner', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('phone', 'email', 'first_name', 'last_name')
    readonly_fields = ('last_login', 'date_joined')
    fieldsets = (
        (None, {'fields': ('phone', 'email', 'partner', 'city')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'middle_name',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    ordering = (
        '-date_joined',
        'id',
    )
    actions = ['to_csv']

    def to_csv(self, request, queryset):
        data = []
        info = ['Номер телефона', 'Имя', 'Фамилия', 'Отчество', 'Почта', 'Город', 'Ссылка партнера', 'Дата регистрации',
                'Время регистрации']
        fields = ['phone', 'first_name', 'last_name', 'middle_name', 'email', 'city', 'partner', 'date_joined',
                  'date_joined']
        data.append(info)
        for row in queryset:
            item = list(map(lambda x: row.__getattribute__(x), fields))
            item[0] = item[0].as_e164
            item[-2] = (item[-2] + datetime.timedelta(hours=3)).strftime('%d.%m.%Y')
            item[-1] = (item[-1] + datetime.timedelta(hours=3)).strftime('%H:%M:%S')
            data.append(item)

        f = StringIO()
        writer = csv.writer(f, dialect='excel')
        writer.writerows(data)
        f.seek(0)

        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=users.csv'
        return response

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(Broadcast)
class BroadcastAdmin(admin.ModelAdmin):
    list_display = ('link', 'region')


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ('question', 'region', 'start', 'ended')
    readonly_fields = ('ended', 'timer')
