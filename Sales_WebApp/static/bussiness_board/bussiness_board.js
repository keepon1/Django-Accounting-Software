document.addEventListener('DOMContentLoaded', function() {
    let total_asset = document.getElementById("total_asset");
    let inventory_value = document.getElementById("inventory_value");
    let liquid_asset = document.getElementById("liquid_asset");
    let profit_today = document.getElementById("profit_today");
    let profit_month = document.getElementById("profit_month");
    let profit_year = document.getElementById("profit_year");

    let now = new Date();

    let current_Day = now.toISOString().slice(0,10);
    let current_Month = now.toISOString().slice(0,7);
    let current_Year = now.getFullYear();

    let inventory_values = 0;

    for(let i=0; i < items[0].length; i++){
        inventory_values += parseInt(items[7][i])*parseFloat(items[8][i]);
    }

    total_asset.textContent = (inventory_values).toFixed(2);
    inventory_value.textContent = (inventory_values).toFixed(2);

    let day_sales = 0;
    let day_cost = 0;
    let day_quantity = 0;
    let list_items = [];
    let list_quantity = [];

    for (let i=0; i<sales_data[1].length; i++){
        if(sales_data[1][i].includes(current_Day)){
            let ref_index = sales_package[0].indexOf(String(sales_data[0][i]));
            let sale = sales_package[1][ref_index];

            for(let j=0; j<sale.length; j++){
                day_sales += sale[j].quantity * sale[j].sales_price;
                day_quantity += sale[j].quantity
                let item_name = sale[j].item_name.split('-');
                let item_index = items[2].indexOf(item_name[item_name.length - 1]);
                list_items.push(item_name[item_name.length - 1]);
                list_quantity.push(sale[j].quantity)
                day_cost += items[8][item_index] * sale[j].quantity;
            }
        }
    }

    profit_today.textContent = (day_sales - day_cost).toFixed(2);
    document.getElementById("today_quantity").textContent = day_quantity
    document.getElementById("today_sales").textContent = day_sales;
    document.getElementById("today_cost").textContent = (day_cost).toFixed(2);
    
    let daily_quantity_pie_data = [{labels:list_items, values:list_quantity, hole:0.4, type:"pie"}];
    let daily_quantity_bar_data = [{x:list_items, y:list_quantity, type:"bar"}];
    let layout_pie = {
        font: {size: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.03},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.04}
        }
    };
    let layout_pie_1 = {
        font: {size: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.04},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.06}
        }
    };
    let layout_bar = {font: {size: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.03},
        margin: {l: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.05, r: 0, t: 0,
        b: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.07}};

    let layout_bar_1 = {font: {size: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.05},
        margin: {l: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.08, r: 0, t: 0,
        b: Math.max(document.getElementById("daily_pie_label").offsetWidth, document.getElementById("daily_pie_label").offsetHeight) * 0.09}};

    let config = {responsive: true}
    Plotly.newPlot("daily_pie_label", daily_quantity_pie_data, layout_pie, config);
    Plotly.newPlot("big_daily_pie", daily_quantity_pie_data, layout_pie_1, config);
    Plotly.newPlot("daily_bar_label", daily_quantity_bar_data, layout_bar, config);
    Plotly.newPlot("big_daily_bar", daily_quantity_bar_data, layout_bar_1, config);

    let month_sales = 0;
    let month_cost = 0;
    let month_quantity = 0;
    let list_monthly_key = [];
    let list_monthly_values = [];
    let month_bar_dict = {}
    let monthly_line_key = [];
    let monthly_line_values = [];
    let month_days = {};

    for (let i=0; i<new Date(current_Year, current_Month.slice(5,7), 0).getDate(); i++){month_days[i+1] = 0}

    for (let i=0; i<sales_data[1].length; i++){
        if(sales_data[1][i].includes(current_Month)){
            let ref_index = sales_package[0].indexOf(String(sales_data[0][i]));
            let sale = sales_package[1][ref_index];
            let day = sales_data[1][i].slice(8,10)

            for(let j=0; j<sale.length; j++){
                month_sales += sale[j].quantity * sale[j].sales_price;
                month_quantity += sale[j].quantity;
                month_days[parseInt(day)] = month_days[parseInt(day)] + sale[j].quantity
                let item_name = sale[j].item_name.split('-');
                let item_index = items[2].indexOf(item_name[item_name.length - 1]);

                if (Object.keys(month_bar_dict).indexOf(item_name[item_name.length - 1]) == -1){
                    month_bar_dict[item_name[item_name.length - 1]] = sale[j].quantity;
                }
                else{
                    month_bar_dict[item_name[item_name.length - 1]] =month_bar_dict[item_name[item_name.length - 1]] + sale[j].quantity;
                }

                month_cost += items[8][item_index] * sale[j].quantity;
            }
        }
    }

    profit_month.textContent = (month_sales - month_cost).toFixed(2);
    document.getElementById("monthly_quantity").textContent = month_quantity
    document.getElementById("monthly_sales").textContent = month_sales;
    document.getElementById("monthly_cost").textContent = (month_cost).toFixed(2);
    for (let key of Object.keys(month_days)){
        monthly_line_key.push(key);
        monthly_line_values.push(month_days[key]);
    }

    for (let key of Object.keys(month_bar_dict)){
        list_monthly_key.push(key);
        list_monthly_values.push(month_bar_dict[key]);
    }

    let monthly_quantity_pie_data = [{labels:list_monthly_key, values:list_monthly_values, hole:0.4, type:"pie", showlegend: false}];
    let monthly_quantity_pie_data_1 = [{labels:list_monthly_key, values:list_monthly_values, hole:0.4, type:"pie"}];
    let monthly_quantity_bar_data = [{x:list_monthly_key, y:list_monthly_values, type:"bar"}];
    let monthly_quantity_line_data = [{x:monthly_line_key, y:monthly_line_values, mode:'lines+markers'}];
    let layout_monthly_pie = {
        font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.03},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.04}
        }
    };
    let layout_monthly_pie_1 = {
        font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.05},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.06}
        }
    };

    let layout_monthly_bar = {font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.03},
        margin: {l: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.05, r: 0, t: 0,
         b: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.21}
    };

    let layout_monthly_bar_1 = {font: {size: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.07},
        margin: {l: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.1,
         r: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.18, t: 0,
         b: Math.max(document.getElementById("monthly_pie_label").offsetWidth, document.getElementById("monthly_pie_label").offsetHeight) * 0.35}
    };

    let config_monthly = {responsive: true}
    Plotly.newPlot("monthly_pie_label", monthly_quantity_pie_data, layout_monthly_pie, config_monthly);
    Plotly.newPlot("big_monthly_pie", monthly_quantity_pie_data_1, layout_monthly_pie_1, config_monthly);
    Plotly.newPlot("monthly_bar_label", monthly_quantity_bar_data, layout_monthly_bar, config_monthly);
    Plotly.newPlot("big_monthly_bar", monthly_quantity_bar_data, layout_monthly_bar_1, config_monthly);
    Plotly.newPlot("monthly_line_label", monthly_quantity_line_data, layout_bar, config_monthly);
    Plotly.newPlot("big_monthly_line", monthly_quantity_line_data, layout_bar_1, config_monthly);

    let year_sales = 0;
    let year_cost = 0;
    let year_quantity = 0;
    let list_yearly_key = [];
    let list_yearly_values = [];
    let year_bar_dict = {}
    let yearly_key = [];
    let yearly_values = [];
    let year_days = {};

    for (let i=0; i<12; i++){year_days[i+1] = 0}

    for (let i=0; i<sales_data[1].length; i++){
        if(sales_data[1][i].includes(current_Year)){
            let ref_index = sales_package[0].indexOf(String(sales_data[0][i]));
            let sale = sales_package[1][ref_index];
            let day = sales_data[1][i].slice(5,7)

            for(let j=0; j<sale.length; j++){
                year_sales += sale[j].quantity * sale[j].sales_price;
                year_quantity += sale[j].quantity;
                year_days[parseInt(day)] = year_days[parseInt(day)] + sale[j].quantity
                let item_name = sale[j].item_name.split('-');
                let item_index = items[2].indexOf(item_name[item_name.length - 1]);

                if (Object.keys(year_bar_dict).indexOf(items[1][item_index].toLowerCase()) == -1){
                    year_bar_dict[items[1][item_index].toLowerCase()] = sale[j].quantity;
                }
                else{
                    year_bar_dict[items[1][item_index].toLowerCase()] = year_bar_dict[items[1][item_index].toLowerCase()] + sale[j].quantity;
                }

                year_cost += items[8][item_index] * sale[j].quantity;
            }
        }
    }

    profit_year.textContent = (year_sales - year_cost).toFixed(2);
    document.getElementById("yearly_quantity").textContent = year_quantity
    document.getElementById("yearly_sales").textContent = year_sales;
    document.getElementById("yearly_cost").textContent = (year_cost).toFixed(2);
    for (let key of Object.keys(year_days)){
        yearly_key.push(key);
        yearly_values.push(year_days[key]);
    }

    for (let key of Object.keys(year_bar_dict)){
        list_yearly_key.push(key);
        list_yearly_values.push(year_bar_dict[key]);
    }

    let yearly_quantity_pie_data = [{labels:list_yearly_key, values:list_yearly_values, hole:0.4, type:"pie", showlegend: false}];
    let yearly_quantity_pie_data_1 = [{labels:list_yearly_key, values:list_yearly_values, hole:0.4, type:"pie"}];
    let yearly_quantity_bar_data = [{x:list_yearly_key, y:list_yearly_values, type:"bar"}];
    let yearly_quantity_line_data = [{x:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], y:yearly_values, mode:'lines+markers'}];
    let layout_yearly_pie = {
        font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.03},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.04}
        }
    };

    let layout_yearly_pie_1 = {
        font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.04},
        margin: { l: 0, r: 0, t: 0, b: 0 },
        hoverlabel: {
            font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.06}
        }
    };
    let layout_yearly_bar = {font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.03},
        margin: {l: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.08, r: 0, t: 0,
         b: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.19}
    };

    let layout_yearly_bar_1 = {font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.07},
        margin: {l: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.14, r: 0, t: 0,
         b: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.25}
    };

    let layout_yearly_line = {autosize: true, font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.04},
        margin: {l: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.08, r: 0, t: 0,
         b: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.25}
    };

    let layout_yearly_line_1 = {autosize: true, font: {size: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.07},
        margin: {l: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.14,
         r: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.14, t: 0,
         b: Math.max(document.getElementById("yearly_pie_label").offsetWidth, document.getElementById("yearly_pie_label").offsetHeight) * 0.28}
    };

    let config_yearly = {responsive: true}
    Plotly.newPlot("yearly_pie_label", yearly_quantity_pie_data, layout_yearly_pie, config_yearly);
    Plotly.newPlot("big_yearly_pie", yearly_quantity_pie_data_1, layout_yearly_pie_1, config_yearly);
    Plotly.newPlot("yearly_bar_label", yearly_quantity_bar_data, layout_yearly_bar, config_yearly);
    Plotly.newPlot("big_yearly_bar", yearly_quantity_bar_data, layout_yearly_bar_1, config_yearly);
    Plotly.newPlot("yearly_line_label", yearly_quantity_line_data, layout_yearly_line, config_yearly);
    Plotly.newPlot("big_yearly_line", yearly_quantity_line_data, layout_yearly_line_1, config_yearly);

});

function big_frame(n){
    let frames = document.getElementsByClassName("bigger_frame");

    for (let i=0; i<frames.length; i++){
        frames[i].style.display = 'none';
    }

    document.getElementById("body").style.backgroundColor = 'rgb(0, 88, 110)';
    document.getElementById("logo").style.display = 'block';

    if (n < 8){
        frames[n].style.display = 'block';
        document.getElementById("body").style.backgroundColor = 'white';
        document.getElementById("logo").style.display = 'none';
    }
}

/* invent */

function display_invent(n){
    let invent = document.getElementsByClassName("invent_box");
    
    for (let i=0; i < invent.length; i++){
        if (i == n){
            invent[i].style.display = "block";
        }

        else{
            invent[i].style.display = "none";
        }
    }
}

/* workarea*/

function display_workarea(n){
    let invent = document.getElementsByClassName("invent_box");
    let workarea = document.getElementsByClassName("transaction_container");
    
    for (let i=0; i < workarea.length; i++){
        if (i == n){
            workarea[i].style.display = "block";
        }

        else{
            workarea[i].style.display = "none";
            for (let j=0; j < invent.length; j++){
                invent[j].style.display = 'none';
            }
        }
    }
}
/* display add inventory items container*/

function search_item(val){
    let search_value = val.value.toLowerCase();
    let search_criteria = document.getElementById("item_search_criteria");
    let table = document.getElementById("item_display_table_body");

    let search_result = [];

    if(search_value === ''){
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        for (let i=0; i<items[3].length; i++){

            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            cell1.setAttribute('class', 'col middle');
            
            let cell2 = row.insertCell(1);
            cell2.setAttribute('class', 'col middle');

            let cell3 = row.insertCell(2);
            cell3.setAttribute('class', 'col middle');
            cell3.textContent = items[0][i]

            let cell4 = row.insertCell(3);
            cell4.setAttribute('class', 'col middle');
            cell4.textContent = items[1][i]

            let cell5 = row.insertCell(4);
            cell5.setAttribute('class', 'col left');
            cell5.textContent = items[2][i]

            let cell6 = row.insertCell(5);
            cell6.setAttribute('class', 'col right');
            cell6.textContent = items[3][i]

            let cell7 = row.insertCell(6);
            cell7.setAttribute('class', 'col right');
            cell7.textContent = items[4][i]

            let cell8 = row.insertCell(7);
            cell8.setAttribute('class', 'col right');
            cell8.textContent = items[5][i]

            let cell9 = row.insertCell(8);
            cell9.setAttribute('class', 'col right');
            cell9.textContent = parseInt(items[3][i]) * parseFloat(items[4][i])

            let edit = document.createElement("button");
            edit.innerHTML = '<i class="fas fa-edit"></i>';
            edit.style.cursor = 'pointer';
            edit.setAttribute('class', 'eye');
            edit.onclick = function (){
                edit_item(this);
            }

            let view = document.createElement("button");
            view.innerHTML = '<i class="fas fa-eye"></i>';
            view.style.cursor = 'pointer';
            view.setAttribute('class', 'eye');
            view.onclick = function (){
                view_item(this);
            }

            cell1.appendChild(edit)
            cell2.appendChild(view)
        }
    }

    else {
        if(search_criteria.value == 'item name'){
            items[2].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([items[0][index], items[1][index], items[2][index], items[3][index], items[4][index], items[5][index]]);
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
                
                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                    
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col left');
                    let search_word = new RegExp(search_value, 'gi')
                    cell5.innerHTML = search_result[i][2].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col right');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col right');
                    cell7.textContent = search_result[i][4]

                    let cell8 = row.insertCell(7);
                    cell8.setAttribute('class', 'col right');
                    cell8.textContent = search_result[i][5]

                    let cell9 = row.insertCell(8);
                    cell9.setAttribute('class', 'col right');
                    cell9.textContent = parseInt(search_result[i][3]) * parseFloat(search_result[i][4])

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_item(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_item(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else if(search_criteria.value == 'brand'){
            items[1].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([items[0][index], items[1][index], items[2][index], items[3][index], items[4][index], items[5][index]])
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi');
                    cell4.innerHTML= search_result[i][1].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col left');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col right');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col right');
                    cell7.textContent = search_result[i][4]

                    let cell8 = row.insertCell(7);
                    cell8.setAttribute('class', 'col right');
                    cell8.textContent = search_result[i][5]

                    let cell9 = row.insertCell(8);
                    cell9.setAttribute('class', 'col right');
                    cell9.textContent = parseInt(search_result[i][3]) * parseFloat(search_result[i][4])

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_item(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_item(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else{
            items[0].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([items[0][index], items[1][index], items[2][index], items[3][index], items[4][index], items[5][index]])
                    }      
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi')
                    cell3.innerHTML = search_result[i][0].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col left');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col right');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col right');
                    cell7.textContent = search_result[i][4]

                    let cell8 = row.insertCell(7);
                    cell8.setAttribute('class', 'col right');
                    cell8.textContent = search_result[i][5]

                    let cell9 = row.insertCell(8);
                    cell9.setAttribute('class', 'col right');
                    cell9.textContent = parseInt(search_result[i][3]) * parseFloat(search_result[i][4])

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_item(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_item(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }
    }
}

function display_add_items(n){
     if (n == 1){
        document.getElementById("display_item").style.display = 'none';
        document.getElementById("add_item").style.display = 'block';
        document.getElementById("view_item_container").style.display = 'none';
        document.getElementById("edit_item_container").style.display = 'none';
        document.getElementById("item_name").style.borderColor = 'black';
        document.getElementById("serial").style.borderColor = 'black';

        document.getElementById("clear_item_form").reset();
        let clear_table = document.getElementsByClassName("item_name");

        let clear_rows  = []

        for (let i=0; i<clear_table.length; i++){
            clear_rows.push(clear_table[i].parentElement.parentElement);
        }

        clear_rows.forEach(function(item){
            item.remove();
        })

     }
     else{
        document.getElementById("add_item").style.display = 'none';
        document.getElementById("display_item").style.display = 'block';
        document.getElementById("view_item_container").style.display = 'none';
        document.getElementById("edit_item_container").style.display = 'none';

     }
}


/* add line */

function add_line(n){
    for(let i = 0; i<n; i++){
        var table = document.getElementById("come");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7)

        var input_0= document.createElement("input");
        input_0.setAttribute('type', 'text');
        input_0.setAttribute('name', 'serial');
        input_0.setAttribute('placeholder', 'optional');
        input_0.setAttribute('class', 'input');
        input_0.onkeyup = function(){
            if (items[0].indexOf(this.value) == -1){
                this.style.borderColor = 'black';
                this.setCustomValidity("");
            }

            else{
                this.style.borderColor = 'red';
                this.setCustomValidity("Item with this serial or Imei exist");
            }
        };

        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'brand');
        input_1.setAttribute('placeholder', 'optional');
        input_1.setAttribute('class', 'input');


        var input_2= document.createElement("input");
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'item_name');
        input_2.setAttribute('class', 'item_name input')
        input_2.setAttribute('placeholder', 'required');
        input_2.onkeyup = function(){
            if (items[2].indexOf(this.value) == -1){
                this.style.borderColor = 'black';
                this.setCustomValidity("");
            }

            else{
                this.style.borderColor = 'red';
                this.setCustomValidity("This item already exist");
            }
        };

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'quantities input');
        input_3.setAttribute('name', 'quantity');
        input_3.setAttribute('placeholder', 'optional');
        input_3.onkeyup = function(){total_2(); total_3();};
        input_3.onclick = function(){total_2(); total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'costs input');
        input_4.setAttribute('name', 'purchase');
        input_4.setAttribute('placeholder', 'optional');
        input_4.onkeyup = function(){total_2(); total_3();};
        input_4.onclick = function(){total_2(); total_3();};


        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'number');
        input_5.setAttribute('name', 'sales');
        input_5.setAttribute('placeholder', 'optional');
        input_5.setAttribute('class', 'input');
        input_5.style.borderRadius = '4px';


        var input_6= document.createElement("input");
        input_6.setAttribute('type', 'text');
        input_6.setAttribute('readonly', true);
        input_6.setAttribute('class', 'totals input');
        input_6.setAttribute('name', 'total');
        input_6.setAttribute('value', 0)


        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times')
        span.style.fontSize = '1.2vw'
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            total_3();
        }

        cell1.appendChild(input_0);
        cell2.appendChild(input_1);
        cell3.appendChild(input_2);
        cell4.appendChild(input_3);
        cell5.appendChild(input_4);
        cell6.appendChild(input_5);
        cell7.appendChild(input_6);
        cell8.appendChild(span);
    }   
}


/* calculate total*/

function total_1(){
    let quantity = document.getElementById("quantity");
    let cost = document.getElementById("cost");
    let total = document.getElementById("total");

    if (quantity.value==='' || cost.value===''){
        total.value = 0;
    }
    
    else{
        total.value = parseInt(quantity.value)*parseFloat(cost.value);
    }

    total_3();
}

function total_2(){
    var quantities = document.getElementsByClassName("quantities");
    var costs = document.getElementsByClassName("costs");
    var totals = document.getElementsByClassName("totals");

    for (let i=0; i<quantities.length; i++){
        if (quantities[i].value==='' || costs[i].value===''){
            totals[i].value = 0;
        }
        else{
            totals[i].value = parseInt(quantities[i].value)*parseFloat(costs[i].value);
        }
    }
}

function total_3(){
    var grand_1 = document.getElementsByClassName("totals");
    var grand_2 = document.getElementById("total");

    let grand_total = parseFloat(grand_2.value);

    for (let i=0; i<grand_1.length; i++){
        grand_total += parseFloat(grand_1[i].value);
    }

    document.getElementById("grand_total").innerHTML = grand_total;
}

function total_4(){
    let quantity = document.getElementById("quantity_1").value;
    let purchase = document.getElementById("purchase_1").value;

    if (quantity==='' || purchase===''){
        document.getElementById("total_1").value = 0;
    }
    else{
        document.getElementById("total_1").value = parseInt(quantity)*parseFloat(purchase);
    }
}
    
/* scrutiny of inventory items */

function check_items(){
    let serial = document.getElementById("serial");
    if (items[0].indexOf(serial.value) == -1){
        serial.style.borderColor = 'black';
        serial.setCustomValidity("");
    }

    else{
        serial.style.borderColor = 'red';
        serial.setCustomValidity("Item with this serial or Imei exist");
    }
}

function check_items_name(){
    let serial = document.getElementById("item_name");
    if (items[2].indexOf(serial.value) == -1){
        serial.style.borderColor = 'black';
        serial.setCustomValidity("");
    }

    else{
        serial.style.borderColor = 'red';
        serial.setCustomValidity("This item already exist");
    }
}

function add_items_btn(event){
    var items_1 = document.getElementsByClassName("item_name");

    let empty_item = [];
    let list_item = [];
    let existed_item = [];
    list_item.push(document.getElementById("item_name").value)

    for (let i=0; i<items_1.length; i++){
        if(items_1[i].value === ''){
            empty_item.push(items_1[i].parentElement.parentElement);
        }

        else{
            list_item.push(items_1[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    })

    let duplicate = list_item.filter((item, index) => list_item.some((element, indexes) => element === item && indexes !== index));
    let serial = document.getElementById("item_name");

    list_item.forEach(item => {
        if (items[2].indexOf(item) !== -1){
            existed_item.push(item)
        }
    });
    
    var comfirm = confirm("Do you want to add these inventory items");

    if (!comfirm){
        event.preventDefault();
    }

    if (duplicate.length !== 0 || existed_item.length !== 0){
        serial.setCustomValidity("Your items contains duplicates or already exist");  
    }
}
/*document.addEventListener('DOMContentLoaded', function() {
    console.log(items);
});*/

function view_item(button){
    var row = button.parentNode.parentNode;

    let item_info = []
    let view_inplace = document.getElementsByClassName("view_inplace");

    var serial = row.cells[4].textContent;
    let item_index = items[2].indexOf(serial);

    for (let i=0; i<items.length; i++){

        if (i === 7){
            item_info.push(items[i][item_index].slice(0,10))
        }

        else{
            item_info.push(items[i][item_index]);
        }

    }

    for (let i=0; i<view_inplace.length; i++){
        view_inplace[i].innerHTML = item_info[i];
    }

    document.getElementById("view_item_container").style.display = 'block';
    document.getElementById("add_item").style.display = 'none';
    document.getElementById("display_item").style.display = 'none';
    document.getElementById("edit_item_container").style.display = 'none';

}

function edit_item(button){
    var row = button.parentNode.parentNode;
    
    let location = []
    let item_info = []
    let input = document.getElementsByClassName("input_1")

    data.forEach(item => {
        location.push(item.fields.location_address)
    });

    var serial = row.cells[4].textContent;
    let item_index = items[2].indexOf(serial);

    for (let i=0; i<items.length; i++){
        item_info.push(items[i][item_index])
    }

    for (let i=0; i<input.length; i++){
        input[i].value = item_info[i];
    }

    let select = document.getElementById("edit_item_location");
    let the_one = location[item_index]
    let option = select.querySelector(`option[value="${the_one}"]`);
    option.selected = true;
    document.getElementById("total_1").value = item_info[3] * item_info[4];

    document.getElementById("view_item_container").style.display = 'none';
    document.getElementById("add_item").style.display = 'none';
    document.getElementById("display_item").style.display = 'none';
    document.getElementById("edit_item_container").style.display = 'block';
}

function edit_item_2(){

    let item_info = []
    let input = document.getElementsByClassName("input_1")

    var serial = document.getElementById("edit_name").textContent;
    let item_index = items[2].indexOf(serial);

    for (let i=0; i<items.length; i++){
        item_info.push(items[i][item_index])
    }

    for (let i=0; i<input.length; i++){
        input[i].value = item_info[i];
    }

    document.getElementById("view_item_container").style.display = 'none';
    document.getElementById("add_item").style.display = 'none';
    document.getElementById("display_item").style.display = 'none';
    document.getElementById("edit_item_container").style.display = 'block';
}

/* inventory loction */

function close_create_location(n){
    let container_1 = document.getElementById("display_location");
    let container_2 = document.getElementById("create_location_container");
    let container_3 = document.getElementById("edit_location_container");
    let container_4 = document.getElementById("view_location_container");
    let form = document.getElementById("create_location_form");
    let row = document.getElementsByClassName("location_clear");

    if (n==1){
        container_1.style.display = 'none';
        container_2.style.display = 'block';
        container_3.style.display = 'none';
        container_4.style.display = 'none';
        form.reset();

        for(let i=row.length - 1; i>=0; i--){
            row[i].parentElement.parentElement.remove();
        }
        
    }

    else{
        container_1.style.display = 'block';
        container_2.style.display = 'none';
        container_3.style.display = 'none';
        container_4.style.display = 'none';
    }
}

function add_location_line(n){
    for(let i=0; i<n; i++){
        let table = document.getElementById("collect_location_table");
        let row = table.insertRow(-1);

        let cell_1 = row.insertCell(0);
        let cell_2 = row.insertCell(1);
        let cell_3 = row.insertCell(2)

        let input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'location');
        input_1.setAttribute('class', 'input collect_location_input location_clear loc_check')
        input_1.onkeyup = function(){
            let existed_location = []
            location_data.forEach(item => {
                existed_location.push(item.fields.location_name);
            });

            if (existed_location.indexOf(this.value) == -1){
                this.style.borderColor = 'black';
            }
        
            else{
                this.style.borderColor = 'red';
            }
        }

        cell_1.appendChild(input_1);
        
        let input_2= document.createElement("input");
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'description');
        input_2.setAttribute('class', 'input collect_location_input')

        cell_2.appendChild(input_2);

        let span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times')
        span.onclick = function(){
            this.parentElement.parentElement.remove();
        }

        cell_3.appendChild(span)
        
    }
}

function check_location(){
    let existed_location = []
    location_data.forEach(item => {
        existed_location.push(item.fields.location_name);
    });
    let serial = document.getElementById("location_1");
    if (existed_location.indexOf(serial.value) == -1){
        serial.style.borderColor = 'black';
        serial.setCustomValidity("");
    }

    else{
        serial.style.borderColor = 'red';
        serial.setCustomValidity("This item already exist");
    }
}

function verify_location(event){
    var locations = document.getElementsByClassName("loc_check");

    let empty_item = []
    let list_item = []
    let existed_location_1 = []
    let existed_location = []
    location_data.forEach(item => {
        existed_location.push(item.fields.location_name);
    });

    for (let i=0; i<locations.length; i++){
        if(locations[i].value === ''){
            empty_item.push(locations[i].parentElement.parentElement);
        }

        else{
            list_item.push(locations[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    })

    let duplicate = list_item.filter((item, index) => list_item.some((element, indexes) => element === item && indexes !== index));
    let serial = document.getElementById("location_1");
    list_item.forEach(item => {
        if (existed_location.indexOf(item) !== -1){
            existed_location_1.push(item)
        }
    });
    var comfirm = confirm("Do you want to add these Locations");

    if (!comfirm){
        event.preventDefault();
    }

    if (duplicate.length !== 0 || existed_location_1.length !== 0){
        serial.setCustomValidity("Your locations contains duplicates or already exist");  
    }

}

function edit_location(button){
    let container_1 = document.getElementById("display_location");
    let container_2 = document.getElementById("create_location_container");
    let container_3 = document.getElementById("edit_location_container");
    let container_4 = document.getElementById("view_location_container");

    let location_info = [[],[],[]];

    location_data.forEach(item => {
        location_info[0].push(item.pk);
        location_info[1].push(item.fields.location_name);
        location_info[2].push(item.fields.description);
    });

    let row = button.parentElement.parentElement;
    let id_content = parseInt(row.cells[2].textContent);
    let index = location_info[0].indexOf(id_content);

    document.getElementById("edit_location_id").value = location_info[0][index];
    document.getElementById("edit_location_name").value = location_info[1][index];
    document.getElementById("edit_location_description").value = location_info[2][index];

    container_1.style.display = 'none';
    container_2.style.display = 'none';
    container_3.style.display = 'block';
    container_4.style.display = 'none';
}

function view_location(button){
    let container_1 = document.getElementById("display_location");
    let container_2 = document.getElementById("create_location_container");
    let container_3 = document.getElementById("edit_location_container");
    let container_4 = document.getElementById("view_location_container");

    let table = document.getElementById("location_display_table_body");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let row = button.parentElement.parentElement;
    let location_content = row.cells[3].textContent;
    
    items[10].forEach((location, index) => {
        if(location === location_content){
            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            cell1.setAttribute('class', 'col middle');
            
            let cell2 = row.insertCell(1);
            cell2.setAttribute('class', 'col middle');

            let cell3 = row.insertCell(2);
            cell3.setAttribute('class', 'col middle');
            cell3.textContent = items[0][index];

            let cell4 = row.insertCell(3);
            cell4.setAttribute('class', 'col middle');
            cell4.textContent = items[1][index];

            let cell5 = row.insertCell(4);
            cell5.setAttribute('class', 'col left');
            cell5.textContent = items[2][index]

            let cell6 = row.insertCell(5);
            cell6.setAttribute('class', 'col right');
            cell6.textContent = items[7][index]

            let cell7 = row.insertCell(6);
            cell7.setAttribute('class', 'col right');
            cell7.textContent = (items[8][index]).toFixed(2)

            let cell8 = row.insertCell(7);
            cell8.setAttribute('class', 'col right');
            cell8.textContent = items[9][index]

            let cell9 = row.insertCell(8);
            cell9.setAttribute('class', 'col right');
            cell9.textContent = (parseInt(items[7][index]) * parseFloat(items[8][index])).toFixed(2)


            let edit = document.createElement("button");
            edit.innerHTML = '<i class="fas fa-edit"></i>';
            edit.style.cursor = 'pointer';
            edit.setAttribute('class', 'eye');
            edit.onclick = function (){
                edit_sales(this);
            }

            let view = document.createElement("button");
            view.innerHTML = '<i class="fas fa-eye"></i>';
            view.style.cursor = 'pointer';
            view.setAttribute('class', 'eye');
            view.onclick = function (){
                view_sales(this);
            }

            cell1.appendChild(edit)
            cell2.appendChild(view)
        }
    });


    container_1.style.display = 'none';
    container_2.style.display = 'none';
    container_3.style.display = 'none';
    container_4.style.display = 'block';
}


/* sales invoice */

function search_sales(val){
    let search_value = val.value.toLowerCase();
    let search_criteria = document.getElementById("sales_search_criteria");
    let table = document.getElementById("sales_display_table_body");

    let search_result = [];

    if(search_value === ''){
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        for (let i=0; i<sales_data[3].length; i++){

            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            cell1.setAttribute('class', 'col middle');
            
            let cell2 = row.insertCell(1);
            cell2.setAttribute('class', 'col middle');

            let cell3 = row.insertCell(2);
            cell3.setAttribute('class', 'col middle');
            cell3.textContent = sales_data[0][i]

            let cell4 = row.insertCell(3);
            cell4.setAttribute('class', 'col middle');
            cell4.textContent = sales_data[1][i]

            let cell5 = row.insertCell(4);
            cell5.setAttribute('class', 'col middle');
            cell5.textContent = sales_data[5][i]

            let cell6 = row.insertCell(5);
            cell6.setAttribute('class', 'col middle');
            cell6.textContent = sales_data[2][i]

            let cell7 = row.insertCell(6);
            cell7.setAttribute('class', 'col middle');
            cell7.textContent = sales_data[6][i]

            let edit = document.createElement("button");
            edit.innerHTML = '<i class="fas fa-edit"></i>';
            edit.style.cursor = 'pointer';
            edit.setAttribute('class', 'eye');
            edit.onclick = function (){
                edit_sales(this);
            }

            let view = document.createElement("button");
            view.innerHTML = '<i class="fas fa-eye"></i>';
            view.style.cursor = 'pointer';
            view.setAttribute('class', 'eye');
            view.onclick = function (){
                view_sales(this);
            }

            cell1.appendChild(edit)
            cell2.appendChild(view)
        }
    }

    else {
        if(search_criteria.value == 'date'){
            sales_data[1].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([sales_data[0][index], sales_data[1][index], sales_data[5][index], sales_data[2][index], sales_data[6][index]]);
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
                
                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                    
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi')
                    cell4.innerHTML = search_result[i][1].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.innerHTML = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_sales(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_sales(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else if(search_criteria.value == 'reference'){
            sales_data[0].map(v => String(v)).forEach((item, index) => {
                console.log(item, index)
                if(String(item).includes(search_value)){
                    if(index != -1){
                        search_result.push([sales_data[0][index], sales_data[1][index], sales_data[5][index], sales_data[2][index], sales_data[6][index]])
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi');
                    cell3.innerHTML = String(search_result[i][0]).replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]


                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_sales(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_sales(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else if(search_criteria.value == 'description'){
            sales_data[5].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([sales_data[0][index], sales_data[1][index], sales_data[5][index], sales_data[2][index], sales_data[6][index]])
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = String(search_result[i][0])

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi');
                    cell5.innerHTML = search_result[i][2].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]


                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_sales(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_sales(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else{
            sales_data[2].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([sales_data[0][index], sales_data[1][index], sales_data[5][index], sales_data[2][index], sales_data[6][index]])
                    }      
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent= search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi')
                    cell6.innerHTML = search_result[i][3].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_sales(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_sales(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }
    }
}


function create_sales(n){
    if(n === 1){
        document.getElementById("show_sales_list").style.display = 'none';
        document.getElementById("create_sales_container").style.display = 'block';
        document.getElementById("edit_sales_container").style.display = 'none';
        document.getElementById("clear_sales_form").reset();
        document.getElementById("sales_item").style.borderColor = 'black'
        let clear_table = document.getElementsByClassName("sales_inputs");

        let clear_rows = []

        for(let i=0; i<clear_table.length; i++){
            clear_rows.push(clear_table[i].parentElement.parentElement);
        }

        clear_rows.forEach(function(item){
            item.remove();
        })

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0,10);
        document.getElementById("set_date").value = formattedDate;
    }

    else{
        document.getElementById("show_sales_list").style.display = 'block';
        document.getElementById("create_sales_container").style.display = 'none';
        document.getElementById("view_sales_container").style.display = 'none';
        document.getElementById("edit_sales_container").style.display = 'none';
    }
    
}

function view_sales(button){
    let row = button.parentElement.parentElement;
    let sales_details = document.getElementsByClassName("sales_description");
    let table = document.getElementById("view_sales_table_body");

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    let ref = parseInt(row.cells[2].textContent);
    let ref_1 = row.cells[2].textContent;
    let position = sales_data[0].indexOf(ref);
    let sales_positon = sales_package[0].indexOf(ref_1);
    let sales_items_bulk = sales_package[1][sales_positon]

    

    for(let i=0; i<sales_details.length; i++){
        sales_details[i].innerHTML = sales_data[i][position];
    }

    for(let i = 0; i<sales_items_bulk.length; i++){
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        cell1.style.backgroundColor = 'rgb(13, 133, 170)';
        cell1.style.fontSize = '1.2vw';
        cell1.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell1.textContent = sales_items_bulk[i].item_name;

        let cell2 = row.insertCell(1);
        cell2.style.backgroundColor = 'rgb(13, 133, 170)';
        cell2.style.textAlign = 'center';
        cell2.style.fontSize = '1.2vw';
        cell2.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell2.textContent = sales_items_bulk[i].serial;

        let cell3 = row.insertCell(2);
        cell3.style.backgroundColor = 'rgb(13, 133, 170)';
        cell3.style.textAlign = 'right';
        cell3.style.fontSize = '1.2vw';
        cell3.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell3.textContent = sales_items_bulk[i].quantity;

        let cell4 = row.insertCell(3);
        cell4.style.backgroundColor = 'rgb(13, 133, 170)';
        cell4.style.textAlign = 'right';
        cell4.style.fontSize = '1.2vw';
        cell4.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell4.textContent = sales_items_bulk[i].sales_price;

        let cell5 = row.insertCell(4);
        cell5.style.backgroundColor = 'rgb(10, 109, 139)';
        cell5.style.textAlign = 'center';
        cell5.style.fontSize = '1.3vw';
        cell5.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell5.textContent = sales_items_bulk[i].total_sales;
    }
    document.getElementById("view_sales_description").innerHTML = sales_data[5][position];
    document.getElementById("view_sales_grand_total").textContent = sales_data[6][position];
    document.getElementById("show_sales_list").style.display = 'none';
    document.getElementById("view_sales_container").style.display = 'block';
    document.getElementById("edit_sales_container").style.display = 'none';
}

function edit_sales(button){
    let row = button.parentElement.parentElement;
    let sales_details = document.getElementsByClassName("edit_sales");
    let sales_edit_input = document.getElementsByClassName("sales_edit_input");
    let ref = parseInt(row.cells[2].textContent);
    let position = sales_data[0].indexOf(ref);

    let ref_1 = row.cells[2].textContent;
    let sales_positon = sales_package[0].indexOf(ref_1);
    let sales_items_bulk = sales_package[1][sales_positon]

    let remove_edit_sales_line = document.getElementsByClassName("edit_sales_item");
    let location = []
    let remove_edit_sales_line_box = [];

    sales.forEach(item => {
        location.push(item.fields.location_address)
    });

    for(let i=0; i<remove_edit_sales_line.length; i++){
        remove_edit_sales_line_box.push(remove_edit_sales_line[i].parentElement.parentElement);
    }

    remove_edit_sales_line_box.forEach(function(item){
        item.remove();
    });

    document.getElementById("edit_sales_1").value = sales_data[5][position];
    for(let i=0; i<sales_details.length; i++){
        sales_details[i].value = sales_data[i][position];
    }

    for(let i=0; i<1; i++){
        sales_edit_input[0].value = sales_items_bulk[0].item_name;
        sales_edit_input[1].value = sales_items_bulk[0].serial;
        sales_edit_input[2].value = sales_items_bulk[0].quantity;
        sales_edit_input[3].value = sales_items_bulk[0].sales_price;
        sales_edit_input[4].value = sales_items_bulk[0].total_sales;
    }

    for (let i=1; i<sales_items_bulk.length; i++){
        var table = document.getElementById("edit_sales_table");
        let row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('class', 'edit_sales_item sales_input')
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('value', sales_items_bulk[i].item_name);
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                edit_sales_total_2();
                edit_sales_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'sales_inputs sales_input');
        input_2.setAttribute('value', sales_items_bulk[i].serial);

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_sales_quantities sales_input');
        input_3.setAttribute('name', 'quantity');
        input_3.setAttribute('value', sales_items_bulk[i].quantity);
        input_3.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_3.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_sales_sale sales_input');
        input_4.setAttribute('name', 'sales');
        input_4.setAttribute('value', sales_items_bulk[i].sales_price);
        input_4.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_4.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_sales_totals sales_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', sales_items_bulk[i].total_sales)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw'
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_sales_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }

    edit_sales_total_3()

    let select = document.getElementById("sales_location");
    let the_one = location[position]
    let option = select.querySelector(`option[value="${the_one}"]`);
    option.selected = true;

    document.getElementById("show_sales_list").style.display = 'none';
    document.getElementById("view_sales_container").style.display = 'none';
    document.getElementById("edit_sales_container").style.display = 'block';
}

function view_edit_sales(){
    let row = document.getElementById("view_edit_sales").textContent;
    let sales_details = document.getElementsByClassName("edit_sales");
    let sales_edit_input = document.getElementsByClassName("sales_edit_input");
    let ref = parseInt(row);
    let position = sales_data[0].indexOf(ref);

    let sales_positon = sales_package[0].indexOf(row);
    let sales_items_bulk = sales_package[1][sales_positon]

    let remove_edit_sales_line = document.getElementsByClassName("edit_sales_item");
    let remove_edit_sales_line_box = [];

    for(let i=0; i<remove_edit_sales_line.length; i++){
        remove_edit_sales_line_box.push(remove_edit_sales_line[i].parentElement.parentElement);
    }

    remove_edit_sales_line_box.forEach(function(item){
        item.remove();
    });

    document.getElementById("edit_sales_1").value = sales_data[5][position];
    for(let i=0; i<sales_details.length; i++){
        sales_details[i].value = sales_data[i][position];
    }

    for(let i=0; i<1; i++){
        sales_edit_input[0].value = sales_items_bulk[0].item_name;
        sales_edit_input[1].value = sales_items_bulk[0].serial;
        sales_edit_input[2].value = sales_items_bulk[0].quantity;
        sales_edit_input[3].value = sales_items_bulk[0].sales_price;
        sales_edit_input[4].value = sales_items_bulk[0].total_sales;
    }

    for (let i=1; i<sales_items_bulk.length; i++){
        var table = document.getElementById("edit_sales_table");
        let row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('class', 'edit_sales_item sales_input')
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('value', sales_items_bulk[i].item_name);
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                edit_sales_total_2();
                edit_sales_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'sales_inputs sales_input');
        input_2.setAttribute('value', sales_items_bulk[i].serial);


        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_sales_quantities sales_input');
        input_3.setAttribute('name', 'quantity');
        input_3.setAttribute('value', sales_items_bulk[i].quantity);
        input_3.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_3.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_sales_sale sales_input');
        input_4.setAttribute('name', 'sales');
        input_4.setAttribute('value', sales_items_bulk[i].sales_price);
        input_4.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_4.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_sales_totals sales_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', sales_items_bulk[i].total_sales)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_sales_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }

    edit_sales_total_3()
    document.getElementById("show_sales_list").style.display = 'none';
    document.getElementById("view_sales_container").style.display = 'none';
    document.getElementById("edit_sales_container").style.display = 'block';
}

function sales_line(n){
    for(let i = 0; i<n; i++){
        var table = document.getElementById("sales_table");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--')
        input_1.setAttribute('class', 'main_sales_input sales_input')
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                sales_total_2();
                sales_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'sales_inputs sales_input');


        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'sales_quantities sales_input');
        input_3.setAttribute('name', 'quantity');
        input_3.onkeyup = function(){sales_total_2(); sales_total_3();};
        input_3.onclick = function(){sales_total_2(); sales_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'sales_sale sales_input');
        input_4.setAttribute('name', 'sales');
        input_4.onkeyup = function(){sales_total_2(); sales_total_3();};
        input_4.onclick = function(){sales_total_2(); sales_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'sales_totals sales_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', 0)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times')
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            sales_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }   
}

function edit_sales_line(n){
    for(let i = 0; i<n; i++){
        var table = document.getElementById("edit_sales_table");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--')
        input_1.setAttribute('class', 'edit_sales_input sales_input')
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                edit_sales_total_2();
                edit_sales_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'sales_inputs sales_input');


        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_sales_quantities sales_input');
        input_3.setAttribute('name', 'quantity');
        input_3.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_3.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_sales_sale sales_input');
        input_4.setAttribute('name', 'sales');
        input_4.onkeyup = function(){edit_sales_total_2(); edit_sales_total_3();};
        input_4.onclick = function(){edit_sales_total_2(); edit_sales_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_sales_totals sales_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', 0)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_sales_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }   
}

function fill_sales(){
    let item_name = document.getElementById("sales_item");
    let serial = document.getElementById("sales_serial");
    let quantity = document.getElementById("sales_quantity");
    let sales = document.getElementById("sales_sales");
    let total = document.getElementById("sales_total")

    let item = item_name.value.split('-').slice(-1)
    if (items[2].indexOf(item[0]) == -1 ){
        item_name.style.borderColor = 'red';
    }

    else{
        item_name.value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
        serial.value = items[0][items[2].indexOf(item[0])];
        quantity.value = 1;
        sales.value = items[5][items[2].indexOf(item[0])];
        total.value = parseInt(quantity.value)*parseFloat(sales.value)
        item_name.style.borderColor = 'black';
        sales_total_2();
        sales_total_3();
        }
}

function edit_fill_sales(){
    let item_name = document.getElementById("edit_sales_item");
    let serial = document.getElementById("edit_sales_serial");
    let quantity = document.getElementById("edit_sales_quantity");
    let sales = document.getElementById("edit_sales_sales");
    let total = document.getElementById("edit_sales_total")

    let item = item_name.value.split('-').slice(-1)
    if (items[2].indexOf(item[0]) == -1 ){
        item_name.style.borderColor = 'red';
    }

    else{
        item_name.value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
        serial.value = items[0][items[2].indexOf(item[0])];
        quantity.value = 1;
        sales.value = items[5][items[2].indexOf(item[0])];
        total.value = parseInt(quantity.value)*parseFloat(sales.value)
        item_name.style.borderColor = 'black';
        edit_sales_total_2();
        edit_sales_total_3();
        }
}

function sales_total_1(){
    let quantity = document.getElementById("sales_quantity");
    let sales = document.getElementById("sales_sales");
    let total = document.getElementById("sales_total");

    if (quantity.value==='' || sales.value===''){
        total.value = 0;
    }
    else{
        total.value = parseInt(quantity.value)*parseFloat(sales.value);
    }
    sales_total_3();
}

function edit_sales_total_1(){
    let quantity = document.getElementById("edit_sales_quantity");
    let sales = document.getElementById("edit_sales_sales");
    let total = document.getElementById("edit_sales_total");

    if (quantity.value==='' || sales.value===''){
        total.value = 0;
    }
    else{
        total.value = parseInt(quantity.value)*parseFloat(sales.value);
    }
    edit_sales_total_3();
}

function sales_total_2(){
    var quantities = document.getElementsByClassName("sales_quantities");
    var costs = document.getElementsByClassName("sales_sale");
    var totals = document.getElementsByClassName("sales_totals");

    for (let i=0; i<quantities.length; i++){
        if (quantities[i].value==='' || costs[i].value===''){
            totals[i].value = 0;
        }
        else{
            totals[i].value = parseInt(quantities[i].value)*parseFloat(costs[i].value);
        }
    }
}

function edit_sales_total_2(){
    var quantities = document.getElementsByClassName("edit_sales_quantities");
    var costs = document.getElementsByClassName("edit_sales_sale");
    var totals = document.getElementsByClassName("edit_sales_totals");

    for (let i=0; i<quantities.length; i++){
        if (quantities[i].value==='' || costs[i].value===''){
            totals[i].value = 0;
        }
        else{
            totals[i].value = parseInt(quantities[i].value)*parseFloat(costs[i].value);
        }
    }
}

function sales_total_3(){
    var grand_1 = document.getElementsByClassName("sales_totals");
    var grand_2 = document.getElementById("sales_total");

    let grand_total = parseFloat(grand_2.value);

    for (let i=0; i<grand_1.length; i++){
        grand_total += parseFloat(grand_1[i].value);
    }
    document.getElementById("sales_grand_total").value = grand_total;
}

function edit_sales_total_3(){
    var grand_1 = document.getElementsByClassName("edit_sales_totals");
    var grand_2 = document.getElementById("edit_sales_total");

    let grand_total = parseFloat(grand_2.value);

    for (let i=0; i<grand_1.length; i++){
        grand_total += parseFloat(grand_1[i].value);
    }
    document.getElementById("edit_sales_grand_total").value = grand_total;
}

function add_sales_btn(event){
    let sales_items = document.getElementsByClassName("main_sales_input");
    let show_info = document.getElementById("sales_item");

    let empty_item = [];
    let collected_item = [];
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }
    

    for (let i=0; i<sales_items.length; i++){
        if(sales_items[i].value === ''){
            empty_item.push(sales_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(sales_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });

    var comfirm = confirm("Do you want to add this sales ?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });
    

    if (!comfirm){
        event.preventDefault();
    }

    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}

function edit_update_sales_btn(event){
    let sales_items = document.getElementsByClassName("edit_sales_input");
    let show_info = document.getElementById("edit_sales_item");

    let empty_item = [];
    let collected_item = [];
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }
    

    for (let i=0; i<sales_items.length; i++){
        if(sales_items[i].value === ''){
            empty_item.push(sales_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(sales_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });

    var comfirm = confirm("Do you want to update this sales?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });
    

    if (!comfirm){
        event.preventDefault();
    }

    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}

function edit_delete_sales_btn(event){
    let sales_items = document.getElementsByClassName("edit_sales_input");
    let show_info = document.getElementById("edit_sales_item");

    let empty_item = [];
    let collected_item = [];
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }
    

    for (let i=0; i<sales_items.length; i++){
        if(sales_items[i].value === ''){
            empty_item.push(sales_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(sales_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });

    var comfirm = confirm("Do you want to delete this sales?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });
    

    if (!comfirm){
        event.preventDefault();
    }

    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}



/* purchase invoice */

function search_purchase(val){
    let search_value = val.value.toLowerCase();
    let search_criteria = document.getElementById("purchase_search_criteria");
    let table = document.getElementById("purchase_display_table_body");

    let search_result = [];

    if(search_value === ''){
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        for (let i=0; i<purchase_data[3].length; i++){

            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            cell1.setAttribute('class', 'col middle');
            
            let cell2 = row.insertCell(1);
            cell2.setAttribute('class', 'col middle');

            let cell3 = row.insertCell(2);
            cell3.setAttribute('class', 'col middle');
            cell3.textContent = purchase_data[0][i]

            let cell4 = row.insertCell(3);
            cell4.setAttribute('class', 'col middle');
            cell4.textContent = purchase_data[1][i]

            let cell5 = row.insertCell(4);
            cell5.setAttribute('class', 'col middle');
            cell5.textContent = purchase_data[5][i]

            let cell6 = row.insertCell(5);
            cell6.setAttribute('class', 'col middle');
            cell6.textContent = purchase_data[2][i]

            let cell7 = row.insertCell(6);
            cell7.setAttribute('class', 'col middle');
            cell7.textContent = purchase_data[6][i]

            let edit = document.createElement("button");
            edit.innerHTML = '<i class="fas fa-edit"></i>';
            edit.style.cursor = 'pointer';
            edit.setAttribute('class', 'eye');
            edit.onclick = function (){
                edit_purchase(this);
            }

            let view = document.createElement("button");
            view.innerHTML = '<i class="fas fa-eye"></i>';
            view.style.cursor = 'pointer';
            view.setAttribute('class', 'eye');
            view.onclick = function (){
                view_purchase(this);
            }

            cell1.appendChild(edit)
            cell2.appendChild(view)
        }
    }

    else {
        if(search_criteria.value == 'date'){
            purchase_data[1].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([purchase_data[0][index], purchase_data[1][index], purchase_data[5][index], purchase_data[2][index], purchase_data[6][index]]);
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
                
                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                    
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi')
                    cell4.innerHTML = search_result[i][1].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.innerHTML = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_purchase(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_purchase(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else if(search_criteria.value == 'reference'){
            purchase_data[0].map(v => String(v)).forEach((item, index) => {
                console.log(item, index)
                if(String(item).includes(search_value)){
                    if(index != -1){
                        search_result.push([purchase_data[0][index], purchase_data[1][index], purchase_data[5][index], purchase_data[2][index], purchase_data[6][index]])
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi');
                    cell3.innerHTML = String(search_result[i][0]).replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]


                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_purchase(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_purchase(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else if(search_criteria.value == 'description'){
            purchase_data[5].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([purchase_data[0][index], purchase_data[1][index], purchase_data[5][index], purchase_data[2][index], purchase_data[6][index]])
                    }
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent = String(search_result[i][0])

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi');
                    cell5.innerHTML = search_result[i][2].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    cell6.textContent = search_result[i][3]

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]


                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_purchase(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_purchase(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }

        else{
            purchase_data[2].map(v => v.toLowerCase()).forEach((item, index) => {
                if(item.includes(search_value)){
                    if(index != -1){
                        search_result.push([purchase_data[0][index], purchase_data[1][index], purchase_data[5][index], purchase_data[2][index], purchase_data[6][index]])
                    }      
                }
            });

            if (search_result == ''){
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            }

            else{
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                for (let i=0; i<search_result.length; i++){

                    let row = table.insertRow(-1);
                    let cell1 = row.insertCell(0);
                    cell1.setAttribute('class', 'col middle');
                        
                    let cell2 = row.insertCell(1);
                    cell2.setAttribute('class', 'col middle');

                    let cell3 = row.insertCell(2);
                    cell3.setAttribute('class', 'col middle');
                    cell3.textContent= search_result[i][0]

                    let cell4 = row.insertCell(3);
                    cell4.setAttribute('class', 'col middle');
                    cell4.textContent = search_result[i][1]

                    let cell5 = row.insertCell(4);
                    cell5.setAttribute('class', 'col middle');
                    cell5.textContent = search_result[i][2]

                    let cell6 = row.insertCell(5);
                    cell6.setAttribute('class', 'col middle');
                    let search_word = new RegExp(search_value, 'gi')
                    cell6.innerHTML = search_result[i][3].replace(search_word, match => `<span style="background-color: green;">${match}</span>`)

                    let cell7 = row.insertCell(6);
                    cell7.setAttribute('class', 'col middle');
                    cell7.textContent = search_result[i][4]

                    let edit = document.createElement("button");
                    edit.innerHTML = '<i class="fas fa-edit"></i>';
                    edit.style.cursor = 'pointer';
                    edit.setAttribute('class', 'eye')
                    edit.onclick = function(){
                        edit_purchase(this);
                    };

                    let view = document.createElement("button");
                    view.innerHTML = '<i class="fas fa-eye"></i>';
                    view.style.cursor = 'pointer';
                    view.setAttribute('class', 'eye')
                    view.onclick = function(){
                        view_purchase(this);
                    }

                    cell1.appendChild(edit)
                    cell2.appendChild(view)
                }
            }
        }
    }
}


function create_purchase(n){
    if(n === 1){
        document.getElementById("show_purchase_list").style.display = 'none';
        document.getElementById("create_purchase_container").style.display = 'block';
        document.getElementById("clear_purchase_form").reset();
        document.getElementById("purchase_item").style.borderColor = 'black'
        let clear_table = document.getElementsByClassName("purchase_inputs");

        let clear_rows = []

        for(let i=0; i<clear_table.length; i++){
            clear_rows.push(clear_table[i].parentElement.parentElement);
        }

        clear_rows.forEach(function(item){
            item.remove();
        })

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0,10);
        document.getElementById("set_purchase_date").value = formattedDate;
    }

    else{
        document.getElementById("show_purchase_list").style.display = 'block';
        document.getElementById("create_purchase_container").style.display = 'none';
        document.getElementById("view_purchase_container").style.display = 'none';
        document.getElementById("edit_purchase_container").style.display = 'none';
    }
    
}

function view_purchase(button){
    let row = button.parentElement.parentElement;
    let purchase_details = document.getElementsByClassName("purchase_description");
    let clear_view_purchase = document.getElementsByClassName("clear_view_purchase");
    let clear_view_purchase_box = []

    for(let i=0; i<clear_view_purchase.length; i++){
        clear_view_purchase_box.push(clear_view_purchase[i].parentElement);
    }

    clear_view_purchase_box.forEach(function(item){
        item.remove();
    });

    let selected_purchase = []

    let ref = parseInt(row.cells[2].textContent);
    let ref_1 = row.cells[2].textContent;
    let position = purchase_data[0].indexOf(ref);
    let purchase_positon = purchase_package[0].indexOf(ref_1);
    let purchase_items_bulk = purchase_package[1][purchase_positon]

    for(let i=0; i<purchase_details.length; i++){
        purchase_details[i].innerHTML = purchase_data[i][position];
    }

    for(let i = 0; i<purchase_items_bulk.length; i++){
        let table = document.getElementById("view_purchase_table");
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        cell1.style.backgroundColor = 'rgb(13, 133, 170)';
        cell1.setAttribute('class', 'clear_view_purchase');
        cell1.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell1.style.fontSize = '1.2vw';
        cell1.textContent = purchase_items_bulk[i].item_name;

        let cell2 = row.insertCell(1);
        cell2.style.backgroundColor = 'rgb(13, 133, 170)';
        cell2.style.textAlign = 'center';
        cell2.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell2.style.fontSize = '1.2vw';
        cell2.textContent = purchase_items_bulk[i].serial;

        let cell3 = row.insertCell(2);
        cell3.style.backgroundColor = 'rgb(13, 133, 170)';
        cell3.style.textAlign = 'right';
        cell3.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell3.style.fontSize = '1.2vw';
        cell3.textContent = purchase_items_bulk[i].quantity;

        let cell4 = row.insertCell(3);
        cell4.style.backgroundColor = 'rgb(13, 133, 170)';
        cell4.style.textAlign = 'right';
        cell4.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell4.style.fontSize = '1.2vw';
        cell4.textContent = purchase_items_bulk[i].purchase_price;

        let cell5 = row.insertCell(4);
        cell5.style.backgroundColor = 'rgb(10, 109, 139)';
        cell5.style.textAlign = 'center';
        cell5.style.fontFamily = 'Arial, Helvetica, sans-serif';
        cell5.style.fontSize = '1.3vw';
        cell5.textContent = purchase_items_bulk[i].total_purchase;
    }
    document.getElementById("view_purchase_description").innerHTML = purchase_data[5][position];
    document.getElementById("view_purchase_grand_total").textContent = purchase_data[6][position];
    document.getElementById("show_purchase_list").style.display = 'none';
    document.getElementById("view_purchase_container").style.display = 'block';
    document.getElementById("edit_purchase_container").style.display = 'none';
}

function edit_purchase(button){
    let row = button.parentElement.parentElement;
    let purchase_details = document.getElementsByClassName("edit_purchase");
    let purchase_edit_input = document.getElementsByClassName("purchase_edit_input");
    let ref = parseInt(row.cells[2].textContent);
    let position = purchase_data[0].indexOf(ref);

    let ref_1 = row.cells[2].textContent;
    let purchase_positon = purchase_package[0].indexOf(ref_1);
    let purchase_items_bulk = purchase_package[1][purchase_positon]

    let remove_edit_purchase_line = document.getElementsByClassName("edit_purchase_item");
    let location = []
    let remove_edit_purchase_line_box = [];

    for(let i=0; i<remove_edit_purchase_line.length; i++){
        remove_edit_purchase_line_box.push(remove_edit_purchase_line[i].parentElement.parentElement);
    }

    remove_edit_purchase_line_box.forEach(function(item){
        item.remove();
    });

    purchase.forEach(item => {
        location.push(item.fields.location_address)
    });

    document.getElementById("edit_purchase_1").value = purchase_data[5][position];
    for(let i=0; i<purchase_details.length; i++){
        purchase_details[i].value = purchase_data[i][position];
    }

    for(let i=0; i<1; i++){
        purchase_edit_input[0].value = purchase_items_bulk[0].item_name;
        purchase_edit_input[1].value = purchase_items_bulk[0].serial;
        purchase_edit_input[2].value = purchase_items_bulk[0].quantity;
        purchase_edit_input[3].value = purchase_items_bulk[0].purchase_price;
        purchase_edit_input[4].value = purchase_items_bulk[0].total_purchase;
    }

    for (let i=1; i<purchase_items_bulk.length; i++){
        var table = document.getElementById("edit_purchase_table");
        let row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('class', 'edit_purchase_item purchase_input')
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('value', purchase_items_bulk[i].item_name);
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                edit_purchase_total_2();
                edit_purchase_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'purchase_inputs purchase_input');
        input_2.setAttribute('value', purchase_items_bulk[i].serial);

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_purchase_quantities purchase_input');
        input_3.setAttribute('name', 'quantity');
        input_3.setAttribute('value', purchase_items_bulk[i].quantity);
        input_3.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_3.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_purchase_purchase purchase_input');
        input_4.setAttribute('name', 'purchase');
        input_4.setAttribute('value', purchase_items_bulk[i].purchase_price);
        input_4.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_4.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};

        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_purchase_totals purchase_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', purchase_items_bulk[i].total_purchase)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times')
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_purchase_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }

    edit_purchase_total_3();

    let select = document.getElementById("purchase_location");
    let the_one = location[position]
    let option = select.querySelector(`option[value="${the_one}"]`);
    option.selected = true;

    document.getElementById("show_purchase_list").style.display = 'none';
    document.getElementById("view_purchase_container").style.display = 'none';
    document.getElementById("edit_purchase_container").style.display = 'block';
}

function view_edit_purchase(){
    let row = document.getElementById("view_edit_purchase").textContent;
    let purchase_details = document.getElementsByClassName("edit_purchase");
    let purchase_edit_input = document.getElementsByClassName("purchase_edit_input");
    let ref = parseInt(row);
    let position = purchase_data[0].indexOf(ref);

    let purchase_positon = purchase_package[0].indexOf(row);
    let purchase_items_bulk = purchase_package[1][purchase_positon]

    let remove_edit_purchase_line = document.getElementsByClassName("edit_purchase_item");
    let remove_edit_purchase_line_box = [];

    for(let i=0; i<remove_edit_purchase_line.length; i++){
        remove_edit_purchase_line_box.push(remove_edit_purchase_line[i].parentElement.parentElement);
    }

    remove_edit_purchase_line_box.forEach(function(item){
        item.remove();
    });

    document.getElementById("edit_purchase_1").value = purchase_data[5][position];
    for(let i=0; i<purchase_details.length; i++){
        purchase_details[i].value = purchase_data[i][position];
    }

    for(let i=0; i<1; i++){
        purchase_edit_input[0].value = purchase_items_bulk[0].item_name;
        purchase_edit_input[1].value = purchase_items_bulk[0].serial;
        purchase_edit_input[2].value = purchase_items_bulk[0].quantity;
        purchase_edit_input[3].value = purchase_items_bulk[0].purchase_price;
        purchase_edit_input[4].value = purchase_items_bulk[0].total_purchase;
    }

    for (let i=1; i<purchase_items_bulk.length; i++){
        var table = document.getElementById("edit_purchase_table");
        let row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('class', 'edit_purchase_item purchase_input')
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('value', purchase_items_bulk[i].item_name);
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[5][items[2].indexOf(item[0])];
                edit_purchase_total_2();
                edit_purchase_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'purchase_inputs purchase_input');
        input_2.setAttribute('value', purchase_items_bulk[i].serial);

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_purchase_quantities purchase_input');
        input_3.setAttribute('name', 'quantity');
        input_3.setAttribute('value', purchase_items_bulk[i].quantity);
        input_3.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_3.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_purchase_purchase purchase_input');
        input_4.setAttribute('name', 'purchase');
        input_4.setAttribute('value', purchase_items_bulk[i].purchase_price);
        input_4.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_4.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_purchase_totals purchase_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', purchase_items_bulk[i].total_purchase)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_purchase_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }

    edit_purchase_total_3()
    document.getElementById("show_purchase_list").style.display = 'none';
    document.getElementById("view_purchase_container").style.display = 'none';
    document.getElementById("edit_purchase_container").style.display = 'block';
}

function purchase_line(n){
    for(let i = 0; i<n; i++){
        var table = document.getElementById("purchase_table");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('class', 'main_purchase_input purchase_input');
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1);
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[4][items[2].indexOf(item[0])];
                purchase_total_2();
                purchase_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'purchase_inputs purchase_input');

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'purchase_quantities purchase_input');
        input_3.setAttribute('name', 'quantity');
        input_3.onkeyup = function(){purchase_total_2(); purchase_total_3();};
        input_3.onclick = function(){purchase_total_2(); purchase_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'purchase_purchase purchase_input');
        input_4.setAttribute('name', 'purchase');
        input_4.onkeyup = function(){purchase_total_2(); purchase_total_3();};
        input_4.onclick = function(){purchase_total_2(); purchase_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'purchase_totals purchase_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', 0)
        input_5.style.outline = 'none';

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            sales_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }   
}

function edit_purchase_line(n){
    for(let i = 0; i<n; i++){
        var table = document.getElementById("edit_purchase_table");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);


        var input_1= document.createElement("input");
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'item_name');
        input_1.setAttribute('list', document.getElementById("item_point").id);
        input_1.setAttribute('placeholder', '--select item--');
        input_1.setAttribute('class', 'edit_purchase_input purchase_input');
        input_1.onkeyup = function(){
            let item = this.value.split('-').slice(-1)
            let row = this.parentElement.parentElement;
            if (items[2].indexOf(item[0]) == -1 ){
                this.style.borderColor = 'red';
            }

            else{
                let cell = row.children;
                cell[0].querySelector("input").value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
                cell[1].querySelector("input").value = items[0][items[2].indexOf(item[0])];
                cell[2].querySelector("input").value = 1;
                cell[3].querySelector("input").value = items[4][items[2].indexOf(item[0])];
                edit_purchase_total_2();
                edit_purchase_total_3();
                this.style.borderColor = 'black';
            }
        };

        var input_2= document.createElement("input");
        input_2.setAttribute('readonly', true);
        input_2.setAttribute('type', 'text');
        input_2.setAttribute('name', 'serial');
        input_2.setAttribute('class', 'purchase_inputs purchase_input');

        var input_3= document.createElement("input");
        input_3.setAttribute('type', 'number');
        input_3.setAttribute('class', 'edit_purchase_quantities purchase_input');
        input_3.setAttribute('name', 'quantity');
        input_3.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_3.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};

        var input_4= document.createElement("input");
        input_4.setAttribute('type', 'number');
        input_4.setAttribute('class', 'edit_purchase_purchase purchase_input');
        input_4.setAttribute('name', 'purchase');
        input_4.onkeyup = function(){edit_purchase_total_2(); edit_purchase_total_3();};
        input_4.onclick = function(){edit_purchase_total_2(); edit_purchase_total_3();};



        var input_5= document.createElement("input");
        input_5.setAttribute('type', 'text');
        input_5.setAttribute('readonly', true);
        input_5.setAttribute('class', 'edit_purchase_totals purchase_input');
        input_5.setAttribute('name', 'total');
        input_5.setAttribute('value', 0)

        var span = document.createElement("span");
        span.innerHTML = '<i class="fas fa-times"></i>';
        span.style.cursor = 'pointer';
        span.setAttribute('class', 'times');
        span.style.fontSize = '1.3vw';
        span.onclick = function(){
            this.parentElement.parentElement.remove();
            edit_purchase_total_3();
        }

        cell1.appendChild(input_1);
        cell2.appendChild(input_2);
        cell3.appendChild(input_3);
        cell4.appendChild(input_4);
        cell5.appendChild(input_5);
        cell6.appendChild(span);
    }   
}

function fill_purchase(){
    let item_name = document.getElementById("purchase_item");
    let serial = document.getElementById("purchase_serial");
    let quantity = document.getElementById("purchase_quantity");
    let purchase = document.getElementById("purchase_purchases");
    let total = document.getElementById("purchase_total")

    let item = item_name.value.split('-').slice(-1)
    if (items[2].indexOf(item[0]) == -1 ){
        item_name.style.borderColor = 'red';
    }

    else{
        item_name.value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
        serial.value = items[0][items[2].indexOf(item[0])];
        quantity.value = 1;
        purchase.value = items[4][items[2].indexOf(item[0])];
        total.value = parseInt(quantity.value)*parseFloat(purchase.value)
        item_name.style.borderColor = 'black';
        purchase_total_2();
        purchase_total_3();
        }
}

function edit_fill_purchase(){
    let item_name = document.getElementById("edit_purchase_item");
    let serial = document.getElementById("edit_purchase_serial");
    let quantity = document.getElementById("edit_purchase_quantity");
    let purchase = document.getElementById("edit_purchase_purchases");
    let total = document.getElementById("edit_purchase_total")

    let item = item_name.value.split('-').slice(-1)
    if (items[2].indexOf(item[0]) == -1 ){
        item_name.style.borderColor = 'red';
    }

    else{
        item_name.value = `${items[1][items[2].indexOf(item[0])]}-${items[2][items[2].indexOf(item[0])]}`;
        serial.value = items[0][items[2].indexOf(item[0])];
        quantity.value = 1;
        purchase.value = items[4][items[2].indexOf(item[0])];
        total.value = parseInt(quantity.value)*parseFloat(purchase.value)
        item_name.style.borderColor = 'black';
        edit_purchase_total_2();
        edit_purchase_total_3();
        }
}

function purchase_total_1(){
    let quantity = document.getElementById("purchase_quantity");
    let sales = document.getElementById("purchase_purchases");
    let total = document.getElementById("purchase_total");

    if (quantity.value==='' || sales.value===''){
        total.value = 0;
    }
    else{
        total.value = parseInt(quantity.value)*parseFloat(sales.value);
    }
    purchase_total_3();
}

function edit_purchase_total_1(){
    let quantity = document.getElementById("edit_purchase_quantity");
    let purchase = document.getElementById("edit_purchase_purchases");
    let total = document.getElementById("edit_purchase_total");

    if (quantity.value==='' || purchase.value===''){
        total.value = 0;
    }
    else{
        total.value = parseInt(quantity.value)*parseFloat(purchase.value);
    }
    edit_purchase_total_3();
}

function purchase_total_2(){
    var quantities = document.getElementsByClassName("purchase_quantities");
    var costs = document.getElementsByClassName("purchase_purchase");
    var totals = document.getElementsByClassName("purchase_totals");

    for (let i=0; i<quantities.length; i++){
        if (quantities[i].value==='' || costs[i].value===''){
            totals[i].value = 0;
        }
        else{
            totals[i].value = parseInt(quantities[i].value)*parseFloat(costs[i].value);
        }
    }
}

function edit_purchase_total_2(){
    var quantities = document.getElementsByClassName("edit_purchase_quantities");
    var costs = document.getElementsByClassName("edit_purchase_purchase");
    var totals = document.getElementsByClassName("edit_purchase_totals");

    for (let i=0; i<quantities.length; i++){
        if (quantities[i].value==='' || costs[i].value===''){
            totals[i].value = 0;
        }
        else{
            totals[i].value = parseInt(quantities[i].value)*parseFloat(costs[i].value);
        }
    }
}

function purchase_total_3(){
    var grand_1 = document.getElementsByClassName("purchase_totals");
    var grand_2 = document.getElementById("purchase_total");

    let grand_total = parseFloat(grand_2.value);

    for (let i=0; i<grand_1.length; i++){
        grand_total += parseFloat(grand_1[i].value);
    }
    document.getElementById("purchase_grand_total").value = grand_total;
}

function edit_purchase_total_3(){
    var grand_1 = document.getElementsByClassName("edit_purchase_totals");
    var grand_2 = document.getElementById("edit_purchase_total");

    let grand_total = parseFloat(grand_2.value);

    for (let i=0; i<grand_1.length; i++){
        grand_total += parseFloat(grand_1[i].value);
    }
    document.getElementById("edit_purchase_grand_total").value = grand_total;
}

function add_purchase_btn(event){
    let purchase_items = document.getElementsByClassName("main_purchase_input");
    let show_info = document.getElementById("purchase_item");

    let empty_item = [];
    let collected_item = []
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }

    for (let i=0; i<purchase_items.length; i++){
        if(purchase_items[i].value === ''){
            empty_item.push(purchase_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(purchase_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });


    var comfirm = confirm("Do you want to add this purchase?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });

    if (!comfirm){
        event.preventDefault();
    }
    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}

function edit_update_purchase_btn(event){
    let purchase_items = document.getElementsByClassName("edit_purchase_input");
    let show_info = document.getElementById("edit_purchase_item");

    let empty_item = [];
    let collected_item = []
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }

    for (let i=0; i<purchase_items.length; i++){
        if(purchase_items[i].value === ''){
            empty_item.push(purchase_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(purchase_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });


    var comfirm = confirm("Do you want to update this purchase?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });

    if (!comfirm){
        event.preventDefault();
    }
    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}

function edit_delete_purchase_btn(event){
    let purchase_items = document.getElementsByClassName("edit_purchase_input");
    let show_info = document.getElementById("edit_purchase_item");

    let empty_item = [];
    let collected_item = []
    let verify_item_list = [];
    let non_exist_list = [];

    for (let i=0; i<items[1].length; i++){
        verify_item_list.push(`${items[1][i]}-${items[2][i]}`);
    }

    for (let i=0; i<purchase_items.length; i++){
        if(purchase_items[i].value === ''){
            empty_item.push(purchase_items[i].parentElement.parentElement);
        }
        else{
            collected_item.push(purchase_items[i].value);
        }
    }

    empty_item.forEach(function(item){
        item.remove();
    });


    var comfirm = confirm("Do you want to delete this purchase?");
    collected_item.forEach(item => {
        if (verify_item_list.indexOf(item) == -1){
            non_exist_list.push(item);
        }
    });

    if (!comfirm){
        event.preventDefault();
    }
    if (non_exist_list.length !== 0){
        show_info.setCustomValidity(`These list of items [${non_exist_list}] does not exist`);
    }
}