from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from . import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.core.serializers import serialize
from django.core.cache import cache
import json
import datetime
import os
import pandas as pd

def home(request):

    return render(request, 'home.html')


def register(request):

    if request.method == 'POST':
        company = request.POST['company']
        owner = request.POST['owner']
        email = request.POST['email']
        phone = request.POST['phone']
        password = request.POST['password']
        password1 = request.POST['password1']

        if password != password1:
            return redirect('sign_in')
        
        elif User.objects.filter(username=company).exists():
            user_exist = True
            data = {'company':company, 'owner':owner, 'email':email, 'phone':phone, 'password':password, 'password1':password1}
            return render(request, 'register.html', {'user_exist':user_exist, 'data':data})
        
        elif User.objects.filter(email=email).exists():
            email_exist = True
            data = {'company':company, 'owner':owner, 'email':email, 'phone':phone, 'password':password, 'password1':password1}
            return render(request, 'register.html', {'email_exist':email_exist, 'data':data})
        
        else:
            newuser = User.objects.create_user(
            			first_name=owner, 
            			last_name=phone,
            			username=company,
            			password=password,
            			email=email
            		)
            
            password = make_password(password)
            try:
                newuser.save()
                company_user = models.company_info(
                    company_name = company, 
                    owner_name = owner, 
                    email = email, 
                    phone_number = phone, 
                    password = password
                    )
                company_user.save()
                foreward_1 = 'Sales_WebApp'
                foreward_2 = 'static'
                foreward_3 = 'companies'
                path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, company)
                os.mkdir(path)

                return redirect('sign_in')

            except:
                return redirect('home')


    return render(request, 'register.html')

def sign_in(request):

    if request.method == 'POST':
        company = request.POST['company']
        email = request.POST['email']
        password = request.POST['password']
        

        if User.objects.filter(username=company).exists():
            pass

        else:
            user_exist = True
            data = {'company':company, 'email':email, 'password':password}
            return render(request, 'sign_in.html', {'user_exist':user_exist, 'data':data})


        if User.objects.filter(email=email).exists():
            pass

        else:
            email_exist = True
            data = {'company':company, 'email':email, 'password':password}
            return render(request, 'sign_in.html', {'email_exist':email_exist, 'data':data})
        
        user = authenticate(request, username=company, password=password)

        if user is not None:
            login(request, user)
            return redirect('company_page')

        else:
            incorrect_password = True
            data = {'company':company, 'email':email, 'password':password}
            return render(request, 'sign_in.html', {'incorrect_password':incorrect_password, 'data':data}) 

    return render(request, 'sign_in.html')

@login_required(login_url='sign_in')
def company_page(request):

    time = datetime.datetime.now().date

    bussiness = [i.bussiness_name for i in models.bussiness.objects.filter(company=request.user.id)]

    if request.method == 'POST':
        bussiness_name = request.POST.get('bussiness_location')
        request.session['bussiness_name'] = bussiness_name
        return redirect('bussiness_board')

    return render(request, 'company_page.html', {'time':time, 'bussiness':bussiness})

def sign_out(request):
    logout(request)
    return redirect('sign_in')

def add_bussiness(request):

    if request.method == 'POST':
        bussiness = request.POST['bussiness']
        location = request.POST['location']

        if request.user.is_authenticated:
            company = request.user.username

        else:
            logout(request)
            return redirect('sign_in')

        foreward_1 = 'Sales_WebApp'
        foreward_2 = 'static'
        foreward_3 = 'companies'
        path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, company, bussiness)

        if not os.path.exists(path):
            os.mkdir(path)
            bussiness_save = models.bussiness(
                bussiness_name=bussiness,
                location=location,
                company=request.user
                )
            
            bussiness_save.save()
            return redirect('company_page')
        
        else:
            logout(request)
            return redirect('sign_in')

    

    return redirect('company_page')

def remove_bussiness(request):
    
    return redirect('company_page')

@login_required(login_url='sign_in')
def bussiness_board(request):

    time = datetime.datetime.now()
    time = [time.date, time.strftime('%B'), time.year]

    foreward_1 = 'Sales_WebApp'
    foreward_2 = 'static'
    foreward_3 = 'companies'
    sales_path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'sale')
    purchase_path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'purchase')

    if not os.path.exists(sales_path):
        os.mkdir(sales_path)

    else:
        pass

    if not os.path.exists(purchase_path):
        os.mkdir(purchase_path)

    else:
        pass

    raw_sales = os.listdir(sales_path)
    raw_purchase = os.listdir(purchase_path)

    prepared_sales = []
    prepared_purchase = []

    for i in raw_sales:
        k = i.split('.')[0]
        j = pd.read_csv(os.path.join(sales_path,i))
        j = j.to_dict('records')
        prepared_sales.append({'ref':k, 'details':j})

    for j in raw_purchase:
        k = j.split('.')[0]
        l = pd.read_csv(os.path.join(purchase_path,j))
        l = l.to_dict('records')
        prepared_purchase.append({'ref':k, 'details':l})
    
    
    bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'))
    items = models.items.objects.filter(company=request.user, bussiness_name=bussiness_name).order_by('brand', 'item_name')
    json_items = serialize('json', items)

    sales = models.sale.objects.filter(company=request.user, bussiness_name=bussiness_name).order_by('-date')
    json_sales = serialize('json', sales)

    purchase = models.purchase.objects.filter(company=request.user, bussiness_name=bussiness_name).order_by('-date')
    json_purhase = serialize('json', purchase)

    location = models.inventory_location.objects.filter(company=request.user, bussiness_name=bussiness_name)
    json_location = serialize('json', location)

    qty_on_hand = sum([i.current_quantity for i in items])
    
    if items.exists():
        exist = True

        return render(request, 'bussiness_board.html', {'time':time, 'bussiness':request.session.get('bussiness_name'), 'items':items, 'qty':qty_on_hand,
                                                        'json_data':json_items, 'sales':sales, 'json_sales':json_sales, 'purchase':purchase, 'json_purchase':json_purhase, 'exist':exist,
                                                        'prepared_sales': prepared_sales, 'prepared_purchase':prepared_purchase, 'location':location, 'json_location':json_location})
   
    return render(request, 'bussiness_board.html', {'time':time, 'bussiness':request.session.get('bussiness_name')})

def add_items(request):

    if request.method == 'POST':
        serial = request.POST.getlist('serial')
        brand = request.POST.getlist('brand')
        item_name = request.POST.getlist('item_name')
        quantity = request.POST.getlist('quantity')
        purchase = request.POST.getlist('purchase')
        sales = request.POST.getlist('sales')
        location_address = request.POST.get('location')

        total_item = sum([int(i) for i in quantity])
        

        bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'))

        if location_address == None:
            location_address = 'unspecified location'
            unspecified = models.inventory_location(location_name='unspecified location', company=request.user,
                                                bussiness_name=bussiness_name, total_item=total_item)
            unspecified.save()

            location_name_1 = models.inventory_location.objects.get(location_name=location_address,
                                                                    company=request.user, bussiness_name=bussiness_name)

        else:
            location_name_1 = models.inventory_location.objects.get(location_name=location_address,
                                                                    company=request.user, bussiness_name=bussiness_name)
            location_name_1.total_item += total_item
            location_name_1.save()

        for i in range(len(item_name)):
            if quantity[i] == '':
                quantity[i] = 0

            if purchase[i] == '':
                purchase[i] = 0

            if sales[i] == '':
                sales[i] = 0
            
            if serial[i] == '':
                serial[i] = '-'
            
            if brand[i] == '':
                brand[i] = '_'

            item = models.items(
                serial_or_imei=serial[i], brand=brand[i], item_name=item_name[i], starting_quantity=quantity[i],
                current_quantity=quantity[i], starting_purchase_price=purchase[i], current_purchase_price=purchase[i],
                starting_sales_price=sales[i], current_sales_price=sales[i], company=request.user,
                bussiness_name=bussiness_name, location_address=location_address, location_name=location_name_1
            )
            item.save()

    return redirect('bussiness_board')

def update_and_delete_item(request):
    if request.method == 'POST':
        if 'update' in request.POST:
            edit_serial = request.POST['serial_1']
            edit_brand = request.POST['brand_1']
            edit_name = request.POST['item_name_1']
            edit_quantity= request.POST['quantity_1']
            edit_purchase = request.POST['purchase_1']
            edit_sales = request.POST['sales_1']
            location = request.POST.get('location')

            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'), company=request.user)
            location_id = models.inventory_location.objects.get(bussiness_name=bussiness_name, company=request.user, location_name=location)
            update = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=edit_name)
            location_2 = models.inventory_location.objects.get(bussiness_name=bussiness_name, company=request.user, location_name=update.location_address)
            location_2.total_item -= int(update.starting_quantity)
            location_2.save()
            update.brand = edit_brand
            update.current_quantity = int(update.current_quantity) + (int(edit_quantity) - int(update.starting_quantity))
            update.current_purchase_price = float(update.current_purchase_price) + (float(edit_purchase) - float(update.starting_purchase_price))
            update.current_sales_price = edit_sales
            update.starting_quantity = edit_quantity
            update.starting_purchase_price = edit_purchase
            update.starting_sales_price = edit_sales
            update.location_address = location
            update.location_name = location_id
            location_id.total_item += int(edit_quantity)
            location_id.save()

            update.save()

        elif 'delete' in request.POST:
            edit_name = request.POST['item_name_1']

            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'))
            delete = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=edit_name)
            

    return redirect('bussiness_board')

def add_location(request):

    if request.method == 'POST':
        location = request.POST.getlist('location')
        description = request.POST.getlist('description')

        bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'), company=request.user)
        for i in range(len(location)):
            location_1 = models.inventory_location(location_name=location[i], description=description[i], company=request.user,
                                                bussiness_name=bussiness_name, total_item=0)
            location_1.save()

    return redirect('bussiness_board')

def update_and_delete_location(request):
    if request.method == 'POST':
        if 'update' in request.POST:
            location_id = request.POST['location_id']
            location_name = request.POST['location']
            description = request.POST['location_description']

            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'), company=request.user)
            location = models.inventory_location.objects.get(pk=int(location_id))
            location.location_name = location_name
            location.description = description

            items = models.items.objects.filter(bussiness_name=bussiness_name, company=request.user, location_name=location)
            sales = models.sale.objects.filter(bussiness_name=bussiness_name, company=request.user, location_name=location)
            purchase = models.purchase.objects.filter(bussiness_name=bussiness_name, company=request.user, location_name=location)
            for i in items:
                i.location_address = location_name
                i.save()

            for j in sales:
                j.location_address = location_name
                j.save()

            for k in purchase:
                k.location_address = location_name
                k.save()

            location.save()
            

        elif 'delete' in request.POST:
            pass

    return redirect('bussiness_board')

def add_sales(request):
    if request.method == 'POST':
        date_created = request.POST['date']
        description = request.POST['description']
        customer = request.POST['customer_name']
        phone = request.POST['customer_phone']
        address = request.POST['customer_address']
        sales_grand_total = request.POST['sales_grand_total']
        location_address = request.POST.get('location')

        item_name = request.POST.getlist('item_name')
        serial = request.POST.getlist('serial')
        quantity = request.POST.getlist('quantity')
        sales_price = request.POST.getlist('sales')
        total_sales = request.POST.getlist('total')

        total_item = sum([int(i) for i in quantity])

        bussiness_name = models.bussiness.objects.get(company=request.user, bussiness_name=request.session.get('bussiness_name'))
        if location_address == None:
            location_address = 'unspecified location'
            unspecified = models.inventory_location(location_name='unspecified location', company=request.user, total_item=0,
                                                bussiness_name=bussiness_name)
            unspecified.save()
            location_name_1 = models.inventory_location.objects.get(location_name='unspecified location', 
                                                                    company=request.user, bussiness_name=bussiness_name)

        else:
            location_name_1 = models.inventory_location.objects.get(location_name=location_address,
                                                                    company=request.user, bussiness_name=bussiness_name)


        sales_details = models.sale(date=date_created, description=description, customer=customer, 
                                    phone=phone, address=address, sales_total=sales_grand_total,
                                    company=request.user, bussiness_name=bussiness_name, location_address=location_address,
                                    location_name=location_name_1)
        
        location_name_1.total_item -= int(total_item)
        location_name_1.save()

        foreward_1 = 'Sales_WebApp'
        foreward_2 = 'static'
        foreward_3 = 'companies'
        path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'sale')

        if not os.path.exists(path):
            os.mkdir(path)

            sales_data = {
                'item_name': item_name, 'serial':serial, 'quantity':quantity, 'sales_price':sales_price,
                'total_sales':total_sales
                }
            
            data = pd.DataFrame(sales_data)
            sales_details.save()
            reference = sales_details.id
            data.to_csv(f'{path}/{reference}.csv')

            for i in range(len(item_name)):
                item = item_name[i].split('-')[-1]
                update_item = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                update_item.current_quantity = int(update_item.current_quantity) - int(quantity[i])
                update_item.current_sales_price = float(sales_price[i])

                update_item.save()

        
        else:
            sales_data = {
                'item_name': item_name, 'serial':serial, 'quantity':quantity, 'sales_price':sales_price,
                'total_sales':total_sales
                }
            
            data = pd.DataFrame(sales_data)
            sales_details.save()
            reference = sales_details.id
            data.to_csv(f'{path}/{reference}.csv')

            for i in range(len(item_name)):
                item = item_name[i].split('-')[-1]
                update_item = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                update_item.current_quantity = int(update_item.current_quantity) - int(quantity[i])

                update_item.save()

    return redirect('bussiness_board')

def update_and_delete_sales(request):

    if request.method == 'POST':
        if 'update' in request.POST:
            ref = request.POST['reference']
            date = request.POST['date']
            description = request.POST['description']
            customer = request.POST['customer_name']
            phone = request.POST['customer_phone']
            address = request.POST['customer_address']
            grand_total = request.POST['sales_grand_total']
            location = request.POST.get('location')

            items = request.POST.getlist('item_name')
            serial = request.POST.getlist('serial')
            quantity = request.POST.getlist('quantity')
            sales = request.POST.getlist('sales')
            total = request.POST.getlist('total')

            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'), company=request.user)
            location_id = models.inventory_location.objects.get(bussiness_name=bussiness_name, company=request.user, location_name=location)
            update = models.sale.objects.get(bussiness_name=bussiness_name, company=request.user, id=ref)

            foreward_1 = 'Sales_WebApp'
            foreward_2 = 'static'
            foreward_3 = 'companies'
            path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, bussiness_name.bussiness_name, 'sale', f'{ref}.csv')

            old_sales = pd.read_csv(path).to_dict('list')
            os.remove(path)

            sales_data = {
                'item_name': items, 'serial':serial, 'quantity':quantity, 'sales_price':sales,
                'total_sales':total
                }
            
            data = pd.DataFrame(sales_data)
            data.to_csv(path)



            for i in range(len(old_sales['item_name'])):
                item = old_sales['item_name'][i].split('-')[-1]
                item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                location_name.total_item += int(old_sales['quantity'][i])
                item_name.current_quantity += int(old_sales['quantity'][i])

                location_name.save()
                item_name.save()

            update.date = date
            update.description = description
            update.customer = customer
            update.phone = phone
            update.address = address
            update.sales_total = grand_total
            update.location_address = location
            update.location_name = location_id

            for j in range(len(items)):
                new_item = items[j].split('-')[-1]
                new_item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=new_item)
                new_location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                new_location_name.total_item -= int(quantity[j])
                new_item_name.current_quantity -= int(quantity[j])

                new_location_name.save()
                new_item_name.save()

            update.save()


        elif 'delete' in request.POST:
            ref_1 = request.POST['reference']
            
            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'))
            update = models.sale.objects.get(bussiness_name=bussiness_name, company=request.user, id=ref_1)

            foreward_1 = 'Sales_WebApp'
            foreward_2 = 'static'
            foreward_3 = 'companies'
            path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'sale', f'{ref_1}.csv')

            old_sales = pd.read_csv(path).to_dict('list')
            os.remove(path)

            for i in range(len(old_sales['item_name'])):
                item = old_sales['item_name'][i].split('-')[-1]
                item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                location_name.total_item += int(old_sales['quantity'][i])
                item_name.current_quantity = item_name.current_quantity + int(old_sales['quantity'][i])
                
                location_name.save()
                item_name.save()
            update.delete()



    return redirect('bussiness_board')

def add_purchase(request):

    if request.method == 'POST':
        date_created = request.POST['date']
        description = request.POST['description']
        supplier = request.POST['supplier_name']
        phone = request.POST['supplier_phone']
        address = request.POST['supplier_address']
        purchase_grand_total = request.POST['purchase_grand_total']
        location_address = request.POST.get('location')

        item_name = request.POST.getlist('item_name')
        serial = request.POST.getlist('serial')
        quantity = request.POST.getlist('quantity')
        purchase_price = request.POST.getlist('purchase')
        total_purchase = request.POST.getlist('total')

        total_item = sum([int(i) for i in quantity])

        bussiness_name = models.bussiness.objects.get(company=request.user, bussiness_name=request.session.get('bussiness_name'))
        
        if location_address == None:
            location_address = 'unspecified location'
            unspecified = models.inventory_location(location_name='unspecified location', company=request.user, total_item=0,
                                                bussiness_name=bussiness_name)
            unspecified.save()
            location_name_1 = models.inventory_location.objects.get(location_name='unspecified location', 
                                                                    company=request.user, bussiness_name=bussiness_name)

        else:
            location_name_1 = models.inventory_location.objects.get(location_name=location_address,
                                                                    company=request.user, bussiness_name=bussiness_name)

        purchase_details = models.purchase(date=date_created, description=description, supplier=supplier, 
                                    phone=phone, address=address, purchase_total=purchase_grand_total,
                                    company=request.user, bussiness_name=bussiness_name, location_address=location_address,
                                    location_name=location_name_1)
        
        location_name_1.total_item += int(total_item)
        location_name_1.save()

        foreward_1 = 'Sales_WebApp'
        foreward_2 = 'static'
        foreward_3 = 'companies'
        path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'purchase')

        if not os.path.exists(path):
            os.mkdir(path)

            purchase_data = {
                'item_name': item_name, 'serial':serial, 'quantity':quantity, 'purchase_price':purchase_price,
                'total_purchase':total_purchase
                }
            
            data = pd.DataFrame(purchase_data)
            purchase_details.save()
            reference = purchase_details.id
            data.to_csv(f'{path}/{reference}.csv')

            for i in range(len(item_name)):
                item = item_name[i].split('-')[-1]
                update_item = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                update_item.current_purchase_price = (update_item.current_quantity*update_item.current_purchase_price + float(total_purchase[i])) / (update_item.current_quantity + int(quantity[i]))
                update_item.current_quantity = int(update_item.current_quantity) + int(quantity[i])

                update_item.save()

        
        else:
            purchase_data = {
                'item_name': item_name, 'serial':serial, 'quantity':quantity, 'purchase_price':purchase_price,
                'total_purchase':total_purchase
                }
            
            data = pd.DataFrame(purchase_data)
            purchase_details.save()
            reference = purchase_details.id
            data.to_csv(f'{path}/{reference}.csv')

            for i in range(len(item_name)):
                item = item_name[i].split('-')[-1]
                update_item = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                update_item.current_purchase_price = (update_item.current_quantity*update_item.current_purchase_price + float(total_purchase[i])) / (update_item.current_quantity + int(quantity[i]))
                update_item.current_quantity = int(update_item.current_quantity) + int(quantity[i])

                update_item.save()

    return redirect('bussiness_board')


def update_and_delete_purchase(request):

    if request.method == 'POST':
        if 'update' in request.POST:
            ref = request.POST['reference']
            date = request.POST['date']
            description = request.POST['description']
            supplier = request.POST['supplier_name']
            phone = request.POST['supplier_phone']
            address = request.POST['supplier_address']
            grand_total = request.POST['purchase_grand_total']
            location = request.POST.get('location')

            items = request.POST.getlist('item_name')
            serial = request.POST.getlist('serial')
            quantity = request.POST.getlist('quantity')
            purchase = request.POST.getlist('purchase')
            total = request.POST.getlist('total')

            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'), company=request.user)
            location_id = models.inventory_location.objects.get(bussiness_name=bussiness_name, company=request.user, location_name=location)
            update = models.purchase.objects.get(bussiness_name=bussiness_name, company=request.user, id=ref)
            

            foreward_1 = 'Sales_WebApp'
            foreward_2 = 'static'
            foreward_3 = 'companies'
            path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'purchase', f'{ref}.csv')

            old_purchase = pd.read_csv(path).to_dict('list')
            os.remove(path)

            purchase_data = {
                'item_name': items, 'serial':serial, 'quantity':quantity, 'purchase_price':purchase,
                'total_purchase':total
                }
            
            data = pd.DataFrame(purchase_data)
            data.to_csv(path)



            for i in range(len(old_purchase['item_name'])):
                item = old_purchase['item_name'][i].split('-')[-1]
                item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                location_name.total_item -= int(old_purchase['quantity'][i])

                if old_purchase['item_name'][i] in items:
                    index_1 = items.index(old_purchase['item_name'][i])
                    item_name.current_purchase_price = float(item_name.current_purchase_price) + (float(purchase[index_1]) - float(old_purchase['purchase_price'][i]))
                else:
                    pass
                item_name.current_quantity = item_name.current_quantity - int(old_purchase['quantity'][i])

                item_name.save()
                location_name.save()

            update.date = date
            update.description = description
            update.customer = supplier
            update.phone = phone
            update.address = address
            update.purchase_total = grand_total
            update.location_address = location
            update.location_name = location_id

            for j in range(len(items)):
                new_item = items[j].split('-')[-1]
                new_item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=new_item)
                new_location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                new_location_name.total_item += int(quantity[j])
                if items[j] not in old_purchase['item_name']:
                    new_item_name.current_purchase_price = (new_item_name.current_quantity*new_item_name.current_purchase_price + float(total[j])) / (new_item_name.current_quantity + int(quantity[i]))
                else:
                    pass
                new_item_name.current_quantity += int(quantity[j])

                new_location_name.save()
                new_item_name.save()
            update.save()


        elif 'delete' in request.POST:
            ref_1 = request.POST['reference']
            
            bussiness_name = models.bussiness.objects.get(bussiness_name=request.session.get('bussiness_name'))
            update = models.purchase.objects.get(bussiness_name=bussiness_name, company=request.user, id=ref_1)

            foreward_1 = 'Sales_WebApp'
            foreward_2 = 'static'
            foreward_3 = 'companies'
            path = os.path.join(os.getcwd(), foreward_1, foreward_2, foreward_3, request.user.username, request.session.get('bussiness_name'), 'purchase', f'{ref_1}.csv')

            old_purchase = pd.read_csv(path).to_dict('list')
            os.remove(path)

            for i in range(len(old_purchase['item_name'])):
                item = old_purchase['item_name'][i].split('-')[-1]
                item_name = models.items.objects.get(bussiness_name=bussiness_name, company=request.user, item_name=item)
                location_name = models.inventory_location.objects.get(location_name=update.location_address, bussiness_name=bussiness_name, company=request.user)
                location_name.total_item -= int(old_purchase['quantity'][i])
                item_name.current_quantity = item_name.current_quantity - int(old_purchase['quantity'][i])

                location_name.save()
                item_name.save()
            update.delete()

    return redirect('bussiness_board')