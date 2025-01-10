// import { useStripe } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const Complete = () => {
//   const [invoiceUrl, setInvoiceUrl] = useState(null);
//   const [id,setId] = useState("");
//   const stripe = useStripe();
//   const location = useLocation(); 
//   console.log(id); 

//   useEffect(() => { 
//     console.log("hello")
//     // Get the payment intent ID from the URL query parameters
//     const queryParams = new URLSearchParams(location.search);
//     const paymentIntentId = queryParams.get('payment_intent');  
//     console.log(paymentIntentId);

//     if (paymentIntentId) { 
//       setId(paymentIntentId);
//       // Retrieve the payment intent status
//       stripe.retrievePaymentIntent(paymentIntentId).then(({ paymentIntent, error }) => {
//         if (error) {
//           console.error("Error retrieving payment intent:", error);
//           // Handle error (e.g., show a message to the user)
//         } else {
//           console.log("Payment Intent Status:", paymentIntent.status);
//           if (paymentIntent.status === 'succeeded') {
//             console.log("Payment succeeded:", paymentIntent); 
//             localStorage.setItem("id",paymentIntentId);
//             // You can show a success message or display success content here
//           } else {
//             console.log("Payment failed or pending:", paymentIntent);
//             // Handle failed or pending payment
//             // Optionally, show an error message
//           }
//         }
//       });
//     }
//   }, [location, stripe]);


//   const handleSubmit = async () => {  
//     console.log("hello");
//     try { 
//        const sendData = {
//         paymentIntentId:id
//        }
//       // Make a request to the backend to generate the invoice
//       const response = await axios.post(
//         "https://4j4pwiz7x1.execute-api.ap-south-1.amazonaws.com/prod/invoice", JSON.stringify(sendData),  {headers: 
//           {
//           'Content-Type': 'application/json', } },
//       ); 
//       console.log(response); 
//       console.log(response.data.invoice.lines.url);

//       // Assuming the backend sends the invoice URL in the response
//       const { invoice } = response.data;

//       // Check if the invoice has a hosted URL
//       if (response.data.invoice.lines.url) {
//         setInvoiceUrl(response.data.invoice.hosted_invoice_url); // Set the invoice URL in state
//         // window.open(invoice.lines.url, "_blank"); // Open the invoice in a new tab
//       } else {
//         console.error('Invoice URL not found');
//       }
//     } catch (error) {
//       console.error('Error fetching invoice:', error);
//     }

    
//   };

//   return (
//     <div>
//       <h1>Payment Success</h1>
//       <button onClick={handleSubmit}>View Invoice</button>
//       {invoiceUrl && (
//         <div>
//           <p>Invoice URL: <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">{invoiceUrl}</a></p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Complete;

import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Complete = () => {
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentIntent, setPaymentIntent] = useState(null); // Store paymentIntent here
  const stripe = useStripe();
  const location = useLocation();
 

 
   
  useEffect(() => { 

  
    // Wait for stripe to be initialized
    if (!stripe) {
      return;
    }

    // Extract the client secret from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const clientSecret = localStorage.getItem("clientSecret"); 
    // console.log();

    if (clientSecret) {
      // Retrieve the payment intent using the client secret
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => { 
        console.log(paymentIntent);
        if (error) {
          console.error("Error retrieving payment intent:", error);
          setErrorMessage("Failed to retrieve payment details. Please try again.");
        } else if (paymentIntent) {
          console.log("Payment Intent Status:", paymentIntent.status);
          setPaymentIntent(paymentIntent); // Store paymentIntent here
          if (paymentIntent.status === 'succeeded') {
            console.log("Payment succeeded:", paymentIntent);
            // You can store the paymentIntent ID or do something else here
            // For example, send the paymentIntent ID to your backend
            sendPaymentIntentToBackend(paymentIntent.id);
          } else {
            console.log("Payment not successful:", paymentIntent.status);
            setErrorMessage("Payment is not successful. Please check your details.");
          }
        }
      });
    } else {
      console.error('Client secret not found in URL');
      setErrorMessage("Client secret not found in URL.");
    }
  }, [location, stripe]);

  // Function to send the payment intent to your backend
  const sendPaymentIntentToBackend = async (paymentIntentId) => {
    setLoading(true);
    setErrorMessage(""); 
    const sendData = { 
      paymentIntentId: paymentIntentId
    }

    try {
      const response = await axios.post(
        "https://4j4pwiz7x1.execute-api.ap-south-1.amazonaws.com/prod/invoice",
        JSON.stringify({ sendData }), // Send the payment intent ID
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Backend Response:", response.data);

      // Handle the response from your backend (e.g., invoice URL)
      const { invoice } = response.data;
      if (invoice?.hosted_invoice_url) {
        setInvoiceUrl(invoice.hosted_invoice_url);
      } else {
        console.error('Invoice URL not found in response');
        setErrorMessage("Unable to retrieve the invoice URL. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending payment intent to backend:", error);
      setErrorMessage("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Payment Success</h1>
      <p>Your payment has been processed successfully.</p>
      <button
        onClick={() => sendPaymentIntentToBackend(localStorage.getItem("paymentIntentId"))} // Use paymentIntent.id here
        disabled={loading || !paymentIntent}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Fetching Invoice..." : "View Invoice"}
      </button>
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}
      {invoiceUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>
            Invoice URL:{" "}
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
              {invoiceUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Complete;
