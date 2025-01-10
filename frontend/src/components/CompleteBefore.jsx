import React from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Complete from './Complete';
const CompleteBefore = () => { 
    const stripePromise = loadStripe('pk_test_51NXNS9SHnZYTSMbTUbSPyuTxHWP55rOs8nWJAzuN9uQ4lNykuXA0t6R053HCX6NxS0YWUgfugCCK0yiBQHmvEjEr003cSi2zjp');
  return (
    <div>
     <Elements stripe={stripePromise}>
      <Complete/>
    </Elements>
    </div>
  )
}

export default CompleteBefore 

