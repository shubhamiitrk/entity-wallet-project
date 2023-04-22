import React from 'react';


const ChildWalletList = ({ childWallets }) => {
    return (
      <div>
        <h2>Child Wallets</h2>
        <ul>
          {childWallets.map((wallet) => (
            <li key={wallet.address}>{wallet.address}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ChildWalletList;

  