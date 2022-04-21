import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';

const contractAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0';
const contractABI = abi.abi;

function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState('');

  const checkIfWalletsConnected = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        console.log('please install metamask');
      }
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const account = accounts[0];
      setAccount(account);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkIfWalletsConnected().then(()=>{
      getCounts();
    })
  },[])

  const connectWallet = async() =>{
    try {
      const { ethereum } = window;
      if(ethereum) {
        console.log('metamask is available');
      } else {
        console.log('please install metamask');
      }

      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log(`funds account with address ${account}`);
        setAccount(account);
      }else{
        console.log('no authorized accounts found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const hi = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
        let tx = await CounterContract.add();
        await tx.wait()
        await getCounts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getCounts = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum){
        console.log('please install metamask');
        return 
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
      const counts = await CounterContract.getCounts();
      setCount(counts.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold text-white text-shadow text-center">Hello Web3</h1>
      {!account ? (
        <button 
          className='rounded-full py-6 px-12 text-3xl mt-24 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition'
          onClick={() => {
            connectWallet();
          }}  
        >
          Connect wallet
        </button>
      ):
        (
          <>
            <h2 className="text-6xl text-center mt-24 text-yellow-300 font-bold">
              👋 {count}
            </h2>
            <h3 className="text-3xl text-center text-white text-hold mt-12">
              Logged in as {""}
              <strong>
                {
                  `${account.substring(0,4)}...${account.substring(account.length-4)}`
                }
              </strong>
            </h3>
          </>
        )
      }
      <button 
        className="rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition"
        onClick={() => {
          hi();
        }}
      >
        Say Hi
      </button>
    </div>
  );
}

export default App;
