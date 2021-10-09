// PWA Service Worker <<
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
// >>


$(document).ready(function(){
    var _url = "https://my-json-server.typicode.com/kevinandreanus/pwaAPI/products";

    var dataResult = '';
    var catResult = '';

    var categories = [];

    $.get(_url, function(data){

        $.each(data, function(key, items){

            _cat = items.category;

            dataResult += ` <div>
                                <h3>`+ items.name +`</h3>
                                <p>`+ _cat +`</p>
                            </div>`;

            if($.inArray(_cat, categories) == -1){
                categories.push(_cat);
                catResult += `<option value="`+ _cat + `">` + _cat + `</option>`;
            }

        });

        $('#products').html(dataResult);
        $('#cat_select').html(`<option value="all">All</option>` + catResult);

    });

    $('#cat_select').on('change', function(){
        updateProduct($(this).val());
    });
    
    function updateProduct(cat){
    
        var _newUrl = _url
        var dataResult = '';
    
        if(cat != 'all'){
            _newUrl = _url + "?category=" + cat;
        }
    
        $.get(_newUrl, function(data){
    
            $.each(data, function(key, items){
    
                _cat = items.category;
    
                dataResult += ` <div>
                                    <h3>`+ items.name +`</h3>
                                    <p>`+ _cat +`</p>
                                </div>`;
            });
    
            $('#products').html(dataResult);
    
        });
    }

});