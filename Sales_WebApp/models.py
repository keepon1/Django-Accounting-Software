from django.db import models
from django.contrib.auth.models import User

class company_info(models.Model):
    company_name = models.CharField(max_length = 100)
    owner_name = models.CharField(max_length = 100)
    email = models.EmailField()
    phone_number = models.BigIntegerField()
    password = models.CharField(max_length = 100)
    password1 = models.CharField(max_length = 100)
    date = models.DateTimeField(auto_now_add = True)
    update_date = models.DateTimeField(auto_now = True)
    image = models.ImageField()

    def __str__(self):
        return self.company_name
    
class bussiness(models.Model):
    bussiness_name = models.CharField(max_length = 100)
    location = models.CharField(max_length = 100)
    company = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.bussiness_name
    
class inventory_location(models.Model):
    location_name = models.CharField(max_length=100)
    description = models.CharField(max_length=150)
    creation_date = models.DateTimeField(auto_now_add = True)
    total_item = models.BigIntegerField()
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    bussiness_name = models.ForeignKey(bussiness, on_delete=models.CASCADE)


class items(models.Model):
    image = models.ImageField()
    serial_or_imei = models.CharField(max_length = 100)
    brand = models.CharField(max_length = 100)
    item_name = models.CharField(max_length = 100)
    starting_quantity = models.BigIntegerField()
    current_quantity = models.BigIntegerField()
    starting_purchase_price = models.FloatField()
    current_purchase_price = models.FloatField()
    starting_sales_price = models.FloatField()
    current_sales_price = models.FloatField()
    creation_date = models.DateTimeField(auto_now_add = True)
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    bussiness_name = models.ForeignKey(bussiness, on_delete=models.CASCADE)
    location_name = models.ForeignKey(inventory_location, on_delete=models.CASCADE)
    location_address = models.CharField(max_length=100)


    @property
    def total_cost(self):
        return self.current_quantity * self.current_purchase_price

    def __str__(self):
        return self.item_name
    
    
class sale(models.Model):

    image = models.ImageField()
    date = models.DateField()
    description = models.CharField(max_length = 200)
    customer = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 50)
    address = models.CharField(max_length = 100)
    sales_total = models.FloatField()
    location_address = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add = True)
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    bussiness_name = models.ForeignKey(bussiness, on_delete=models.CASCADE)
    location_name = models.ForeignKey(inventory_location, on_delete=models.CASCADE)

    def __str__(self):
        return self.customer

class purchase(models.Model):

    image = models.ImageField()
    date = models.DateField()
    description = models.CharField(max_length = 200)
    supplier = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 50)
    address = models.CharField(max_length = 100)
    purchase_total = models.FloatField()
    location_address = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add = True)
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    bussiness_name = models.ForeignKey(bussiness, on_delete=models.CASCADE)
    location_name = models.ForeignKey(inventory_location, on_delete=models.CASCADE)

    def __str__(self):
        return self.supplier
    