pragma solidity ^0.8.0;

import "../client/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../client/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../client/node_modules/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol"; 



contract TokenSwap  {
    
    //Uniswap Router address.
    address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; 
  
    address tokenSwap = address(this);
    uint public totalETH;
    
    IUniswapV2Router02 public uniswapRouter;
    
    event Swap (uint[] _amount, uint _userBalance, uint _totalBalance);
    event WithdrawETH (uint _amount, uint _totalBalance);
    

  constructor() {
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
  }
    
    //Mapping data structure to keep track of individual ETH accumulated from swaps.
    mapping(address => uint256) public ETHBalance;
    
    
    //View functions for the front-end.
    function getBalance() public view returns(uint) {
        return ETHBalance[msg.sender];
    }
    
    function getTotalETHBalance() public view returns(uint) {
        return totalETH;
    }
    
    
    //Initates a swap via Uniswap Router.  Can be used for any ERC20 token.
    function swap(address _token, uint _amount) public payable {
        
        //sets the deadline to 300 seconds from now.
        uint deadlineTime = block.timestamp + 300;
        
        //gets the token address an approves + transfers the token to this contract, 
        //which then approves the uniswap contract to swap the tokens for ETH.
        IERC20 token = IERC20(_token);
        token.approve(address(this), _amount);
        token.transferFrom(msg.sender, address(this), _amount);
        token.approve(UNISWAP_ROUTER_ADDRESS, _amount);
        
        //Sets the path for the token, and WETH.  Swaps via swapExactTokensForETH function in uniswapRouter.
        //The ETH is sent to this address and assigned according to the sender.
        address[] memory path;
        path = new address[](2);
        path[0] = _token;
        path[1] = uniswapRouter.WETH();
        uint[] memory amount = uniswapRouter.swapExactTokensForETH(_amount, 1000000000, path, tokenSwap, deadlineTime);
        
        //Takes the output amount(ETH) and assigns the value to the sender's balance.
        ETHBalance[msg.sender] += amount[1];
        totalETH += amount[1];
        emit Swap(amount, ETHBalance[msg.sender], totalETH);
    }
    
    //Sends the full amount of ETH available to the sender's address according to their balance accumulated.
    function withdrawETH() public {
        require(ETHBalance[msg.sender] > 0, 'You have no ETH to withdraw.');
        payable(msg.sender).transfer(ETHBalance[msg.sender]);
        totalETH -= ETHBalance[msg.sender];
        emit WithdrawETH(ETHBalance[msg.sender], totalETH);
        ETHBalance[msg.sender] = 0;
    }

    //Allows this contract to receive ETH from swaps.
    receive() external payable {}
    

}