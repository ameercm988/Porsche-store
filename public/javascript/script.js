    



function addToWishlist(proId){
    $.ajax({
        url : '/addto-wishlist/'+proId,
        method : 'get',
        success : (response) => {
            if(response.status){
                // let count = $('#cart-count').html()
                // count = parseInt(count) + 1
                //location.reload()
                $(" #count").load(location.href+" #count")
                              
            }
        }
    })
}

function addToCart(proId){
    $.ajax({
        url : '/addto-cart/'+proId,
        method : 'get',
        success : (response) => {
            if(response.status){
                // let count = $('#cart-count').html()
                // // count = parseInt(count) + 1
                // $("#cart-count").html(count)
                // $("#cart-count").load(location.href+"#cart-count")
                // $("#cart-count").load(location.href+"#cart-count")
                $("#count").load(location.href+" #count")
                              
            }
        }
    })
}