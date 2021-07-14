pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
 *@title UserRegister
 *@dev This contract registers new user with a referrer address and stores their details and transfers reward for the referrers on each investment.
 */

contract UserRegister {

    

  struct user  {
        address myAddress;
        address referrer;
        uint registration_time;
        uint[] investments;
        uint[] investment_time;
        
      
       

    }

    mapping(address => user) public profile;

    /**
     *@dev Registers user and stores data
     *Requirements : 
     * - should not be a registered user.
     *@param _referrer represents the address of the user's referrer.
     *Note: This function will register user with a referrer
     *Already registered users cant avail this function.
     */

    function register (address _referrer) public {
        require(profile[msg.sender].myAddress==address(0),"User already registered");

        profile[msg.sender].myAddress=msg.sender;
        profile[msg.sender].referrer= _referrer;
        profile[msg.sender].registration_time= block.timestamp;
        

        console.log("Registration time is :",profile[msg.sender].registration_time,"balance is",msg.sender.balance);
        

}
    /**
     *@dev User can invest amount.
     *As per the invest amount a percent is given to the referrer as bonus.
     *Requirement : 
     * - Investor should have a minimum balance to invest.
     *Note : This function will allow user to invest an amount not less than a given amount.
     *The referrer will be recieving a 10% of invested amount as bonus for every new investment made.
     *The investment can be done multiple times.The data will be stored in an array.
     *Also the investemnt time will registered to the same index;
     */

    function invest () public payable{
        require(msg.value >= 10  ,"Should have a minimum  to invest" );

        uint bonus = (msg.value * 100)/1000;
        console.log("bonus is", bonus);
        
        payable(profile[msg.sender].referrer).transfer(bonus);

        profile[msg.sender].investments.push(msg.value);
        profile[msg.sender].investment_time.push(block.timestamp);
        console.log("First investment amount is :",profile[msg.sender].investments[0]);
        console.log("First investment time is :",profile[msg.sender].investment_time[0]);

    }
}