pragma solidity ^0.8.0;

/**
 *@title UserRegister
 *@dev This contract registers new user with a referrer address and stores their details and transfers reward for the referrers on each investment.
 */

contract UserRegister {

    

    struct user  {
        address referrer;
        uint registration_time;
        uint count;
        uint totalROI;
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

    function register (address _referrer) public payable {
        require(profile[msg.sender].count==0,"User already registered");
        require(msg.value >= 10  ,"Should have a minimum  to invest" );

        profile[msg.sender].referrer= _referrer;
        profile[msg.sender].registration_time= block.timestamp;
        investement[msg.sender][profile[msg.sender].count].amount = msg.value;
        investement[msg.sender][profile[msg.sender].count].investedTime = block.timestamp;

        profile[msg.sender].count++;
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
        require(profile[msg.sender].count!=0,"User not registered");
        require(msg.value >= 10  ,"Should have a minimum  to invest" );
        uint bonus = (msg.value * 100)/1000;

        investement[msg.sender][profile[msg.sender].count].amount = msg.value;
        investement[msg.sender][profile[msg.sender].count].investedTime = block.timestamp;

        profile[msg.sender].count++;
       
        if(profile[msg.sender].count == 0){
        payable(profile[msg.sender].referrer).transfer(bonus);
        }
    }

    /**
     *@dev Checks the rate of interest of investments obtained till date.
     *Requirements : 
     * - the caller should be registered.
     * - the count should be a valid count with investment.
     *Note : This function will check your duration of investemnt and  sets the interest according to the duration and amount and calculates the total Rate of Interest; 
     */
    function ROI () public {
        require(profile[msg.sender].count!=0,"User not registered");
        uint totalInterest;
        for (uint i=0;i<profile[msg.sender].count;i++){
            uint duration  = block.timestamp - investement[msg.sender][i].investedTime;
            uint day = duration/86400; 

            uint months = day/30;
            uint roi = (investement[msg.sender][i].amount*50)/1000;
 
            investement[msg.sender][i].interest =  months * roi ;
            totalInterest = totalInterest + investement[msg.sender][i].interest;
        }
        profile[msg.sender].totalROI = totalInterest;     
    }    
}