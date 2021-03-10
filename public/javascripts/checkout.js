const stripe = Stripe('pk_test_51ISwPwIxhydthNECsuV4WqyNN6XN5V4PBeaXAoNHho6YpRVZVoY3gCvXw0BHoyuRQY8wwhtn2biHPihy5KTIkhsA00hC7qeVJC');

/*const checkoutBtn = document.getElementById('checkout-button')
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function(e) {           
  })
}*/

const checkoutButton = (id) =>{
  axios.post(`/service/${id}/buy`)
  .then(response => {
   stripe.redirectToCheckout({
      sessionId: response.data.sessionId,
    })
      .then(function(result) {
        if (result.error) {
          console.error(result.error.message)
        }
      });
  })
}