from django.contrib import admin

# Register your models here.

from website import models
admin.site.register(models.Moment)

