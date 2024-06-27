# Generated by Django 5.0.3 on 2024-03-24 13:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Sales_WebApp', '0002_bussiness'),
    ]

    operations = [
        migrations.CreateModel(
            name='items',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('serial_or_imei', models.CharField(max_length=100)),
                ('brand', models.CharField(max_length=100)),
                ('item_name', models.CharField(max_length=100)),
                ('starting_quantity', models.BigIntegerField()),
                ('current_quantity', models.BigIntegerField()),
                ('starting_purchase_price', models.FloatField()),
                ('current_purchase_price', models.FloatField()),
                ('starting_sales_price', models.FloatField()),
                ('current_sales_price', models.FloatField()),
                ('total_cost', models.FloatField()),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('bussiness_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Sales_WebApp.bussiness')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Sales_WebApp.company_info')),
            ],
        ),
    ]
