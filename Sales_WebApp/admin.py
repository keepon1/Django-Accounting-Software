from django.contrib import admin
from . import models

admin.site.register(models.company_info)
admin.site.register(models.bussiness)
admin.site.register(models.items)
admin.site.register(models.sale)
admin.site.register(models.purchase)
