function addToCart(proId){
    $.ajax({
        url : '/addto-cart/'+proId,
        method : 'get',
        success : (response) => {
            if(response.status){
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                //location.reload()
                $("#cart-count").load(location.href+" #cart-count")
                              
            }
        }
    })
}