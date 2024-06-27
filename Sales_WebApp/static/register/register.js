function removered(){
    document.getElementById("userexist").style.display = 'none';
    document.getElementById("username").style.borderColor = 'rgb(1, 125, 156)';
}



function comfirm_password(){

    var password = document.getElementById('password');
    var confirmed = document.getElementById('comfirm');

    if (password.value != confirmed.value){
        document.getElementById('non').innerHTML = "Passwords Don't Match";
        confirmed.setCustomValidity("Passwords Don't Match");
    }

    else{
        document.getElementById('non').innerHTML = '';
        confirmed.setCustomValidity("");
    }
}

