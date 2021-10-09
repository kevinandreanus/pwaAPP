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

    function renderPage(data){

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
   
    }

    var networkDataReceived = false

    // Fresh Data From Online
    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(function(data){
        networkDataReceived = true
        renderPage(data)
    })

    // Data From Cache
    caches.match(_url).then(function(response){
        if(!response) throw Error('No data on Cache')
        return response.json()
    }).then(function(data){
        if(!networkDataReceived){
            renderPage(data)
            console.log('Render data from Cache')
        }
    }).catch(function(){
        return networkUpdate
    })

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