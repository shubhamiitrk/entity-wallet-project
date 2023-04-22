import { useState } from "react";
import React from 'react';

const ChildWalletForm = ({ onChildWalletCreate }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onChildWalletCreate(address);
    setAddress("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Child wallet address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <button type="submit">Create Child Wallet</button>
    </form>
  );
};

// Sample definition of the onChildWalletCreate function
const onChildWalletCreate = (address) => {
  console.log(`Creating child wallet with address ${address}`);
};

export default ChildWalletForm;
