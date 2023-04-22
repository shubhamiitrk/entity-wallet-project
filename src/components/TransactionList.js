import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const TransactionList = ({ childWallet }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const filter = childWallet.filters.TransactionExecuted(null, null, null);
      const logs = await provider.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: childWallet.address,
        topics: filter.topics,
      });
      const txs = logs.map((log) => {
        const parsedLog = childWallet.interface.parseLog(log);
        const { to, value, data } = parsedLog.args;
        return { to, value, data };
      });
      setTransactions(txs);
    };
    fetchTransactions();
  }, [childWallet]);

  return (
    <table>
      <thead>
        <tr>
          <th>Target</th>
          <th>Value (ETH)</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, index) => (
          <tr key={index}>
            <td>{tx.to}</td>
            <td>{ethers.utils.formatEther(tx.value)}</td>
            <td>{tx.data}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;
