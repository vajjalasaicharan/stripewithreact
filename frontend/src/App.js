import './App.css';
import CompleteBefore from './components/CompleteBefore';
import Payment from './components/Payment';
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {   
  
  
  return (
    <div className="App">
      {/* <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements> */} 
       <BrowserRouter> 
       <Routes>
        <Route  path="/" element={<Payment/>}></Route> 
        <Route  path="/last" element={<CompleteBefore/>}></Route>
       </Routes>
       </BrowserRouter>
      
    </div>
  );
}

export default App;
