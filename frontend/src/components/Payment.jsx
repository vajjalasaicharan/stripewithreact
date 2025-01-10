

// import React, { useEffect, useState } from 'react';
// import CheckoutForm from './CheckoutForm';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import axios from 'axios';

// const stripePromise = loadStripe('pk_test_51NXNS9SHnZYTSMbTUbSPyuTxHWP55rOs8nWJAzuN9uQ4lNykuXA0t6R053HCX6NxS0YWUgfugCCK0yiBQHmvEjEr003cSi2zjp');

// const Payment = () => {
//   const [clientSecret, setClientSecret] = useState(null); // Initial state is null for better handling of loading state
//   const [loading, setLoading] = useState(true); // Loading state to manage the loading UI

//   const getClientSecret = async () => {
//     try {
//       // Make a request to your backend to get the client secret
//       const response = await axios.post('https://4j4pwiz7x1.execute-api.ap-south-1.amazonaws.com/prod/payment');
//       console.log(response);
//       console.log(response.data.totalResponse.id); 
//       console.log(response.data.clientSecret); 
//       localStorage.setItem("clientSecret",response.data.clientSecret); 
//       localStorage.setItem("id",response.data.totalResponse.id);
//       setClientSecret(response.data.clientSecret); 
//        // Assuming the response contains the clientSecret
//     } catch (error) {
//       console.error('Error fetching client secret:', error);
//     } finally {
//       setLoading(false); // Set loading to false once the request completes (either success or failure)
//     }
//   };

//   useEffect(() => {
//     if (!clientSecret) {
//       getClientSecret(); // Fetch client secret only if it's not already set
//     }
//   }, [clientSecret]); // Empty dependency array ensures it only runs once on mount or when clientSecret is updated

//   if (loading) {
//     return <div>Loading...</div>; // Show loading state while fetching clientSecret
//   }

//   if (!clientSecret) {
//     return <div>Error fetching payment details. Please try again.</div>; // Handle error case if clientSecret is not available
//   }

//   // Options for the Elements component
//   const options = {
//     clientSecret,
//   };

//   return (
//     <div>
//       <Elements stripe={stripePromise} options={options}>
//         <CheckoutForm /> 
//       </Elements>
//     </div>
//   );
// };

// export default Payment;


import React, { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51NXNS9SHnZYTSMbTUbSPyuTxHWP55rOs8nWJAzuN9uQ4lNykuXA0t6R053HCX6NxS0YWUgfugCCK0yiBQHmvEjEr003cSi2zjp');

const Payment = () => {
  const [clientSecret, setClientSecret] = useState(null); // Initial state is null for better handling of loading state
  const [loading, setLoading] = useState(true); // Loading state to manage the loading UI
  const [paymentIntentId, setPaymentIntentId] = useState(null); // State to store the payment intent ID

  const getClientSecret = async () => {
    try {
      // Make a request to your backend to get the client secret and payment intent ID
      const response = await axios.post('https://4j4pwiz7x1.execute-api.ap-south-1.amazonaws.com/prod/payment');
      console.log(response);
      console.log(response.data.totalResponse.id); 
      console.log(response.data.clientSecret); 

      // Store the clientSecret and payment intent ID in localStorage (optional)
      localStorage.setItem("clientSecret", response.data.clientSecret); 
      localStorage.setItem("paymentIntentId", response.data.totalResponse.id);

      // Set state with the response data
      setClientSecret(response.data.clientSecret); 
      setPaymentIntentId(response.data.totalResponse.id); 
    } catch (error) {
      console.error('Error fetching client secret:', error);
    } finally {
      setLoading(false); // Set loading to false once the request completes (either success or failure)
    }
  };

  // Only fetch the client secret once when the component mounts
  useEffect(() => {
    if (!clientSecret) {
      getClientSecret(); // Fetch client secret only if it's not already set
    }
  }, []); // Empty dependency array ensures it only runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching clientSecret
  }

  if (!clientSecret || !paymentIntentId) {
    return <div>Error fetching payment details. Please try again.</div>; // Handle error case if clientSecret or paymentIntentId is not available
  }

  // Options for the Elements component
  const options = {
    clientSecret,
  };

  return (
    <div>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm /> 
      </Elements>
    </div>
  );
};

export default Payment;
