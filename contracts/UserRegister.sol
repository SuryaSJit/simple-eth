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
        uint count;
    }
  struct investments{ 
      uint amount;
      uint investedTime;
      uint interest;
    }
    mapping(address => user) public profile;
    mapping(address =>mapping(uint => investments)) public investement;
    // mapping(address => uint) public totalInvestment;
    // mapping(uint => investments) public investor;

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
        

        console.log("Registration time is :",profile[msg.sender].registration_time);
        

}
    /**
     *@dev User can invest amount.
     *As per the invest amount a percent is given to the referrer as bonus.
     *Requirement : 
     * - Investor should have a minimum balance to invest.
     *Note : This function will allow user to invest an amount not less than a given amount.
     *The referrer will be recieving a 10% of invested amount as bonus for every new investment made.
     *The investment can be done multiple times.The data will be stored .
     *Also the investemnt time will registered to the same index;
     */

    function invest () public payable{
        require(profile[msg.sender].myAddress!=address(0),"User not registered");
        require(msg.value >= 10  ,"Should have a minimum  to invest" );
        uint bonus = (msg.value * 100)/1000;

        investement[msg.sender][profile[msg.sender].count].amount = msg.value;
        investement[msg.sender][profile[msg.sender].count].investedTime = block.timestamp;

        console.log("Invested time is",investement[msg.sender][profile[msg.sender].count].investedTime);
        console.log("No.",profile[msg.sender].count,"investment is",investement[msg.sender][profile[msg.sender].count].amount);
     

        profile[msg.sender].count++;

       
        if(profile[msg.sender].count == 0){
        payable(profile[msg.sender].referrer).transfer(bonus);
        console.log("bonus is", bonus);
        }
    }

    /**
     *@dev Checks the rate iof interest obtained till date.
     *Requirements : 
     * - the caller should be registered.
     * - the count should be a valid count with investment.
     *@param _count represents the count of the investment made.
     *Note : This function will check your duration of investemnt and  sets the interest according to the duration and amount; 
     */
    function checkInterest (uint _count) public {
        require(profile[msg.sender].myAddress!=address(0),"User not registered");
        require(investement[msg.sender][_count].amount != 0, "No investment found");
        uint timePeriod = block.timestamp - investement[msg.sender][_count].investedTime;
        timePeriod = timePeriod + 2592000;
        require(timePeriod>2592000,"You havent reached any maturity period");
         
        uint duration = timePeriod/2592000;
        console.log("Duration is",duration);
        uint roi = (investement[msg.sender][_count].amount*50)/1000; 

        investement[msg.sender][_count].interest =  duration * roi ;
        console.log("Interest obtained is",investement[msg.sender][_count].interest);
    }


    



    
}