import React, { Component } from "react";
import TokenSwap from "./contracts/TokenSwap.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
  loaded:false, 
  totalBalance: 0,  
  userBalance: 0, 
  address: '', 
  amount: '', 
  DAI: "0xad6d458402f60fd3bd25163575031acdce07538d", 
  USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  COMP: "0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075", 
  thisAddr: "0xEEBaC4E637a53E5dE6Abc3F8be3547133D087C6B"
};

  componentDidMount = async () => {
    try {
    // Get network provider and web3 instance.
    this.web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    this.accounts = await this.web3.eth.getAccounts();

    // Get the contract instance.
    this.networkId = await this.web3.eth.getChainId();
    
    this.tokenSwap = new this.web3.eth.Contract(
      TokenSwap.abi,
      TokenSwap.networks[this.networkId] && TokenSwap.networks[this.networkId].address,
    );

    this.dai = new this.web3.eth.Contract(
      [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name_",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol_",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], "0xad6d458402f60fd3bd25163575031acdce07538d"
    );

    this.usdc = new this.web3.eth.Contract(
      [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name_",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol_",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
    );

    this.comp = new this.web3.eth.Contract(
      [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name_",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol_",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ], "0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075"
    )
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true }, this.getState);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  //Gets the current state from the Blockchain.
  getState = async () => {
    let result = await this.tokenSwap.methods.getBalance().call({from:this.accounts[0]});
    let result2 = await this.tokenSwap.methods.getTotalETHBalance().call({from:this.accounts[0]});
    this.setState({
      userBalance: this.web3.utils.fromWei(result, 'ether'),
      totalBalance: this.web3.utils.fromWei(result2, 'ether')
      
    })
  }

  //Checks which token is being swapped.
  swap = async() => {
    const {address, amount} = this.state;
    if(address === this.state.DAI) {
      this.swapDai();
    } else if(address === this.state.USDC) {
      this.swapUSDC();
    } else if(address === this.state.COMP) {
      this.swapCOMP();
    }


}

  swapDai = async () => {
    const {address, amount} = this.state;
    //Check Dai allowance, approve if the requested amount is higher than current.
    let allowedAmntDai = await this.dai.methods.allowance(this.accounts[0], this.state.thisAddr).call({from:this.accounts[0]});
    if(allowedAmntDai < this.web3.utils.toWei(amount, 'ether')) {
      await this.dai.methods.approve(this.state.thisAddr, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
      let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
      console.log(result);
      let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
      let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
      let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
      this.setState({
        userBalance: x,
        totalBalance: amountTotal,
        amount: ''
      })
     alert(amount+" DAI has been swapped for "+amountETHGained+" ETH successfully.");
    
    } else {
       let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
       console.log(result);
       let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
       let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
       let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
       this.setState({
        userBalance: x,
        totalBalance: amountTotal,
        amount: ''
      })
      alert(amount+" DAI has been swapped for "+amountETHGained+" ETH successfully.");
     }
  }

  swapUSDC = async () => {
    const {address, amount} = this.state;
    //Check USDC allowance, approve if the requested amount is higher than current.
    let allowedAmntUsdc = await this.usdc.methods.allowance(this.accounts[0], this.state.thisAddr).call({from:this.accounts[0]});
    if(allowedAmntUsdc < this.web3.utils.toWei(amount, 'mwei')) {
      await this.usdc.methods.approve(this.state.thisAddr, this.web3.utils.toWei(amount, 'mwei')).send({from:this.accounts[0]});
      let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'mwei')).send({from:this.accounts[0]});
      console.log(result);
      let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
      let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
      let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
      this.setState({
       userBalance: x,
       totalBalance: amountTotal,
       amount: ''
     })
     alert(amount+" USDC has been swapped for "+amountETHGained+" ETH successfully.");
    
    } else {
       let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'mwei')).send({from:this.accounts[0]});
       console.log(result);
       let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
       let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
       let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
       this.setState({
        userBalance: x,
        totalBalance: amountTotal,
        amount: ''
      })
      alert(amount+" USDC has been swapped for "+amountETHGained+" ETH successfully.");
     }
  }

  swapCOMP = async () => {
    const {address, amount} = this.state;
    //Check COMP allowance, approve if the requested amount is higher than current.
    let allowedAmntComp = await this.comp.methods.allowance(this.accounts[0], this.state.thisAddr).call({from:this.accounts[0]});
    if(allowedAmntComp < this.web3.utils.toWei(amount, 'ether')) {
      await this.comp.methods.approve(this.state.thisAddr, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
      let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
      console.log(result);
      let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
      let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
      let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
      this.setState({
        userBalance: x,
        totalBalance: amountTotal,
        amount: ''
      })
     alert(amount+" COMP has been swapped for "+amountETHGained+" ETH successfully.");
    
    } else {
       let result = await this.tokenSwap.methods.swap(address, this.web3.utils.toWei(amount, 'ether')).send({from:this.accounts[0]});
       console.log(result);
       let amountETHGained = this.web3.utils.fromWei(result.events.Swap.returnValues._amount[1], 'ether');
       let amountTotal = this.web3.utils.fromWei(result.events.Swap.returnValues._totalBalance, 'ether');
       let x = this.web3.utils.fromWei(result.events.Swap.returnValues._userBalance, 'ether');
       this.setState({
        userBalance: x,
        totalBalance: amountTotal,
        amount: ''
      })
      alert(amount+" DAI has been swapped for "+amountETHGained+" ETH successfully.");
     }
  }

  withdraw = async() => {
    let result = await this.tokenSwap.methods.withdrawETH().send({from:this.accounts[0]});
    console.log(result);
    let amountReceived = this.web3.utils.fromWei(result.events.WithdrawETH.returnValues._amount, 'ether');
    let amountTotal = this.web3.utils.fromWei(result.events.WithdrawETH.returnValues._totalBalance, 'ether');
    this.setState({
      totalBalance: amountTotal,
      userBalance: 0
    })
    alert(amountReceived+" ETH withdrawn successfully.");
  }

  //Gets the address of each token and pastes it for convienience. 
  getDai = () => {
    alert("DAI:  "+this.state.DAI);
    this.setState({
      address: this.state.DAI
    })
  }
  getUSDC = () => {
    alert("USDC:  "+this.state.USDC);
    this.setState({
      address: this.state.USDC
    })
  }
  getComp = () => {
    alert("COMP:  "+this.state.COMP);
    this.setState({
      address: this.state.COMP
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Token Swap</h1>
        <p>Swap ERC20 Tokens for Ether.</p>
        <div className='Info'>
        <h4>Total ETH: {this.state.totalBalance}</h4>
        <h4>  Your ETH available: {this.state.userBalance}</h4>
        </div>
        <h3>Choose a token to swap:</h3>
        <div className='Tokens'>
        <button type='button' onClick={this.getDai}>DAI</button>
        <button type='button' onClick={this.getUSDC}>USDC</button>
        <button type='button' onClick={this.getComp}>COMP</button>
        </div>
        <div className="Swap">
          <input type='text' name='address' placeholder='token address' value={this.state.address} onChange={this.handleInputChange}/>
          <input type='text' name='amount' placeholder='token amount' value={this.state.amount} onChange={this.handleInputChange}/>
          <button type='button' onClick={this.swap}>SWAP</button>
        </div>
        <h3>Withdraw</h3>
        <button type='text'onClick={this.withdraw}>WITHDRAW</button>
       
      </div>
    );
  }
}

export default App;
