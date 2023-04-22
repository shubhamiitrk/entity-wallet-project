import React, { useState } from 'react';
import { ethers } from 'ethers';

const TransactionForm = ({ childWallet, onSubmit }) => {
  const [target, setTarget] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');
  const [gasLimit, setGasLimit] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transaction = {
      to: target,
      value: ethers.utils.parseEther(value),
      data: data,
      gasLimit: ethers.utils.parseUnits(gasLimit, 'gwei'),
    };
    const tx = await signer.sendTransaction(transaction);
    onSubmit(tx);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="target">Target address</label>
        <input type="text" id="target" onChange={(e) => setTarget(e.target.value)} value={target} required />
      </div>
      <div>
        <label htmlFor="value">Value (ETH)</label>
        <input type="number" id="value" onChange={(e) => setValue(e.target.value)} value={value} required />
      </div>
      <div>
        <label htmlFor="data">Data</label>
        <textarea id="data" onChange={(e) => setData(e.target.value)} value={data} />
      </div>
      <div>
        <label htmlFor="gasLimit">Gas limit (Gwei)</label>
        <input type="number" id="gasLimit" onChange={(e) => setGasLimit(e.target.value)} value={gasLimit} required />
      </div>
      <button type="submit">Submit transaction</button>
    </form>
  );
};

export default TransactionForm;
