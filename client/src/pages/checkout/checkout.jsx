import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import abi from "../../contract/chai.json"
import "./checkout.css";

export const Checkout = () => {
  ////////////////////
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null
  })

  const [account, setAccount] = useState("None")

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xa9980978cAb6555785EBBC9351b03bDd0C59a75e";
      const contractAbi = abi.abi;

      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts"
          });  //metamask will open

          window.ethereum.on("chainChanged", () => { //when user switches netwok then page reloads
            window.location.reload();
          });

          window.ethereum.on("accountschanged", () => { //when user switches account then page reloads
            window.location.reload();
          })

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractAbi, signer);
          setState({ provider, signer, contract });
          setAccount(account);           //account and provider value are same
        }
        else { alert("please install metamask"); }
      } catch (error) {
        //console.log(error);
      }
    };
    connectWallet();

  }, []);

  

  ///////////////////

  const location = useLocation();

  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();

  const buyChai = async (event) => {
    event.preventDefault();        //to prevent page from reloading
    const { contract } = state;

    
    let k = (totalAmount%0.05).toString();
    const amount = { value: ethers.utils.parseEther(k) };  //to convert int to ether kind of int
    
    const trasaction = await contract.buyChai(amount);
    await trasaction.wait();
    setisTransactionDone(1);
    console.log("transaction is done");
    console.log(isTransactionDone);
  }

  
  const [isTransactionDone, setisTransactionDone] = useState(0);


  
  
  return (
    <div>
      <div className='cart1'>

        <div className='cartItem1'>
          <div className="amt">
        
        <h1>
          {totalAmount > 0 ? totalAmount : "faltu"}
        </h1>
        
          </div>
         
       
        <div className="chk">

        <button className="checkout1" onClick={buyChai} disabled={isTransactionDone}>Pay</button>
        </div>

        <div>
          {isTransactionDone==0?<></>:<>Transaction Done</>}
        </div>
        </div>
      </div>
    </div>
  )
}
