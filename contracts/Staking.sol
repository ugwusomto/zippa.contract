// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./IIERC20.sol";

contract ZippaStaking is Initializable, OwnableUpgradeable {

    //user stakes zippa 
    // user claims zipp and is taxed
    // user can only claim after 1 week of staking

    using SafeMathUpgradeable for uint256;
    struct StakedData {
        uint256 amountStaked;
        uint256 lastTimeStaked;
        uint256 accuredBeforeZipRestake;
    }
    address public StakeToken;
    address public RewardToken;
    address public DeadAddress;
    uint256 public MinStakeAmount;
    uint256 public EarningPercentagePerSeconds;
    uint256 public amountEarnedForReferral;
    uint256 public minimumClaimSeconds;

    mapping(address => StakedData) public stakings;
    mapping(address => address) public referrals;
    event StakeComplete(address staker, uint256 amount , uint256 time);
    event ClaimComplete(address staker, uint256 claimAmount , uint256 time);

    function initialize() external virtual initializer {
        __Ownable_init();
        DeadAddress = 0x000000000000000000000000000000000000dEaD;
        MinStakeAmount = 100e18;
        EarningPercentagePerSeconds = 1;
        amountEarnedForReferral = 10000000000000000000;
        minimumClaimSeconds = 86400;
    }

     
    // look into referral in staking
    function stake(uint256 _amount , address _staker) external {
        require(_amount > 0 , "Amount must be above zero");
        require(MinStakeAmount > _amount , "Amount must be above minimum");
        require(_staker != address(0) , "Invalid stakers address");
        require(IIERC20(StakeToken).balanceOf(_staker) >= _amount , "Insufficient stake amount");
        require(IIERC20(StakeToken).allowance(address(this),_staker) >= _amount , "Insufficient allowance to spend  the stake amount");
        IIERC20(StakeToken).transferFrom(_staker,address(this),_amount);
        uint amountStaked = _amount;
        // check for referrer and give him his earning
        if(referrals[_staker] != address(0) && stakings[_staker].amountStaked == 0){
            IIERC20(StakeToken).transfer(referrals[_staker],amountEarnedForReferral); // burn it 
            amountStaked = amountStaked.sub(amountEarnedForReferral);
        }
        if(stakings[_staker].amountStaked > 0){
            uint256 totalSeconds = block.timestamp.sub(stakings[_staker].lastTimeStaked);
            uint256 earningPerSec = stakings[_staker].amountStaked.mul(EarningPercentagePerSeconds.div(100));
            uint256 totalEarning = earningPerSec * totalSeconds * 10e18;
            stakings[_staker].accuredBeforeZipRestake = stakings[_staker].accuredBeforeZipRestake.add(totalEarning);
        }
        stakings[_staker].amountStaked = stakings[_staker].amountStaked.add(_amount);
        stakings[_staker].lastTimeStaked = block.timestamp;
        IIERC20(StakeToken).transfer(DeadAddress,amountStaked); // burn it 
        emit StakeComplete(_staker,_amount,block.timestamp);
    }


    function addReferrer(address ref) external {
        require(referrals[_msgSender()] == address(0), "You already have a referrer");
        require(ref != address(0), "Invalid referral  address");
        referrals[_msgSender()] = ref;
    }

    function claim() external{
        StakedData storage userData = stakings[_msgSender()];
        require(block.timestamp.sub(userData.lastTimeStaked) >= minimumClaimSeconds , "You can not claim after staking for less that 1 day");
        require(userData.amountStaked > 0 , "Insufficient amount to claim");
        uint256 totalSeconds = block.timestamp.sub(userData.lastTimeStaked);
        uint256 earningPerSec = userData.amountStaked.mul(EarningPercentagePerSeconds.div(100));
        uint256 totalClaim = (earningPerSec * totalSeconds * 10e18).add(userData.accuredBeforeZipRestake);
        userData.accuredBeforeZipRestake = 0;
        userData.lastTimeStaked = block.timestamp;
        IIERC20(RewardToken).mint(_msgSender(),totalClaim);
        emit ClaimComplete(_msgSender(), totalClaim , block.timestamp);
    }

    // function transferRewardTokenOwnership()  external onlyOwner{

    // }
 

 

  
}
