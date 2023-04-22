import { ethers } from 'ethers';

const getWeb3 = async () => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  const provider = window.ethereum || (window.web3 && window.web3.currentProvider);
  if (!provider) {
    throw new Error('No ethereum provider detected');
  }

  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      // Request account access
  


      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      return signer;
    } catch (error) {
      throw new Error('User denied account access');
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    return signer;
  }
};

export default getWeb3;
