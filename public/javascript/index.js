const e = require("express");

let data;
let token;
let saved_cnt = 0;
let products=[];

//create product by user input
function SearchImage() {
    saved_cnt = 0;
    products=[];
    $("#images tbody").empty();
    let str = $(".dropdown-toggle").html() + ' ' + $("#search").val();
    $.ajax({
        url: '/alamy/getacesstoken',
        type: 'Get',
        success: function (result) {
            if(result.statusCode == 200){
                token = result.body.access_token;
                $.ajax({
                    url: '/alamy/searchitem?str=' + str + "&token=" + token,
                    type: 'Get',
                    success: function (result) {
                        if(result.statusCode == 200){
                            alert("there are " + result.body.totalResults + " total results.");
                            data = result.body.items;
                            addImages(result.body.items);
                        }
                        else{
            
                        }
                    }
                });            
            }
            else if(result.statusCode == 400){
                alert("Invalid Alamy Client");
            }
            else{
                alert(result.error.error);
            }
        },
        error: function(result){
            alert(result.error.error);
        }
    });
    
}

$(".dropdown-item").click(function(){
    $(".dropdown-toggle").html($(this).html());
});

function addImages(images){
    let cnt = 0;
    images.forEach(element => {
        let row = '<tr><th style="align-content:center">'+'<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="' + cnt + '" name="example1" onclick="checkProduct('+ cnt +')"><label class="custom-control-label" for="' + cnt + '"></label></div>' +
        '</th><th style="align-content:center" scope="row" id="' + element.altids[1].value + '"><img src=' + element.renditions[2].href + ' style="width:100px;height:100px;"></th><td style="align-content:center">' + element.altids[2].value + '</td><td style="align-content:center">' + element.descriptions[0].value +
            '</td></tr>';
        $("#images tbody").append(row);
        cnt++;
    });
}

function addProduct(id){
    let imgid = data[id].altids[2].value;
    let itemdata;
    $.ajax({
        url: '/alamy/getiteminfo?imgid=' + imgid + "&token=" + token,
        type: 'Get',
        success: function (result) {
            if(result.statusCode == 200){
                itemdata = result.body;
                let title = itemdata.title.split('.')[0];
                let body_html = itemdata.title;
                let vendor = "My Store";
                let product_type = itemdata.profile;
                let tags = "";
                for(var i=0;i<itemdata.subjects.length;i++){
                    tags += itemdata.subjects[i].name;
                    if(i!=itemdata.subjects.length-1) tags+=',';
                }
                let product = {
                    title: title,
                    body_html: body_html,
                    vendor: vendor,
                    product_type: product_type,
                    images: [
                        {
                            "src": "http://alamy-api.vercel.app/uploads/tmp_"+ id +"_1.jpg"
                        }
                    ],
                    tags : tags
                }
                $.ajax({
                    url: '/alamy/downloaditem?url=' + itemdata.renditions[0].href + "&token=" + token + "&id=" + id,
                    type: 'Get',
                    success: function (result) {
                        $.ajax({
                            url: '/shopify/create-product?id=' + id,
                            type: 'Post', 
                            processData: false,
                            data: JSON.stringify(product),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (result) {
                                if (result.statusCode == 201) {
                                    saved_cnt++;
                                    if(saved_cnt >= products.length)
                                        $('#exampleModalCenter').modal('hide');
                                }
                                else if(result.statusCode == 401){
                                    alert("Invalid API key or access token");
                                    $('#exampleModalCenter').modal('hide');
                                }
                                else{
                                    alert(error.errors);
                                }
                            }
                        });
                    }
                });            
            }
            else{
            }
        }
    });
}

function checkProduct(id){
    for(var i=0;i<products.length;i++){
        if(products[i] == id)
            break;
    }
    if(i == products.length){
        products.push(id);
    }
    else{
        for(var j=i+1;j<products.length;j++)
            products[j-1] = products[j];
        products.length -= 1;
    }
}
function addProducts(){
    for(var i=0;i<products.length;i++){   
        $('#exampleModalCenter').modal('show');
        addProduct(products[i]);
    }
}