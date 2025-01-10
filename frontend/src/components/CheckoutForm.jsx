import React from 'react'
import { useStripe, useElements, CardNumberElement, IdealBankElement, PaymentElement, PaymentRequestButtonElement} from '@stripe/react-stripe-js';  

const CheckoutForm = () => {   
    const elements = useElements();  
    const stripe = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
  
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/last`, 
      },
    }); 
    console.log(error);
    console.log(paymentIntent); 
    
    
  
    if (error) {
      console.error("Payment error:", error);
    } else if (paymentIntent.status === 'requires_action') {
      const { error: actionError, paymentIntent: updatedPaymentIntent } = await stripe.handleCardAction(paymentIntent.client_secret);
  
      if (actionError) {
        console.error("Authentication failed:", actionError);
      } else {
        console.log("Authentication successful:", updatedPaymentIntent);
        // Now you can check if the paymentIntent is successful
        if (updatedPaymentIntent.status === 'succeeded') {
          console.log("Payment succeeded:", updatedPaymentIntent);
          // Handle successful payment
        }
      }
    } else if (paymentIntent.status === 'succeeded') {  
      console.log(paymentIntent);
      localStorage.setItem("id", paymentIntent.id);
      console.log("Payment succeeded:", paymentIntent);
      // Handle successful payment
    } else {
      console.log("Payment not completed:", paymentIntent);
      // Handle incomplete payment
    }
  };
  
  return ( 

    <div>
       <form  onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" /> 
      {/* <IdealBankElement/> */} 
      {/* <CardNumberElement/> */} 
      {/* <AfterpayClearpayMessageElement/> */} 
      {/* <AddressElement/> */} 
      {/* <PaymentRequestButtonElement/> */}
      <button id="submit">
       Pay Now
      </button>
      
    </form>
    </div>
  )
}

export default CheckoutForm
