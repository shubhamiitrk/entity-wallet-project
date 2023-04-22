import React, { useState, useEffect } from 'react';
import getWeb3 from './utils/getWeb3';
import { ethers } from 'ethers';
import ChildWalletList from './components/ChildWalletList';
import ChildWalletForm from './components/ChildWalletForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import MasterWallet from './contracts/MasterWallet.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [masterWallet, setMasterWallet] = useState(null);
  const [childWallets, setChildWallets] = useState([]);
  const [selectedChildWallet, setSelectedChildWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);
        const accounts = await web3Instance.listAccounts();
        setAccounts(accounts);
        const provider = new ethers.providers.Web3Provider(web3Instance.provider);
        const masterWalletInstance = new ethers.Contract(MasterWallet.networks['5777'].address, MasterWallet.abi, provider);
        setMasterWallet(masterWalletInstance);
        const childWallets = await masterWalletInstance.getChildWallets();
        setChildWallets(childWallets);
        if (childWallets.length > 0) {
          setSelectedChildWallet(childWallets[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  const handleCreateChildWallet = async (name) => {
    try {
      await masterWallet.createChildWallet(name);
      const childWallets = await masterWallet.getChildWallets();
      setChildWallets(childWallets);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChildWallet = async (childWallet) => {
    setSelectedChildWallet(childWallet);
    try {
      const transactions = await masterWallet.getChildWalletTransactions(childWallet);
      setTransactions(transactions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendTransaction = async (to, amount) => {
    try {
      const tx = await masterWallet.sendChildWalletTransaction(selectedChildWallet, to, amount);
      setTransactions([...transactions, tx]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Entity Wallet</h1>
      <div className="row">
        <div className="col-md-4">
          <ChildWalletList childWallets={childWallets} selectedChildWallet={selectedChildWallet} onSelectChildWallet={handleSelectChildWallet} />
          <ChildWalletForm onCreateChildWallet={handleCreateChildWallet} />
        </div>
        <div className="col-md-8">
          {selectedChildWallet && (
            <>
              <h2>Transactions for {selectedChildWallet}</h2>
              <TransactionList transactions={transactions} />
              <TransactionForm onSendTransaction={handleSendTransaction} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
