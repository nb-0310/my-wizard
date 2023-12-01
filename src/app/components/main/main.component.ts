import { Component } from '@angular/core';
import { erc20 } from '@openzeppelin/wizard';
import { ERC20Options } from '@openzeppelin/wizard/dist/erc20';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  contract: string = '';
  staking: boolean = false;
  minStakingDuration: string = '2 days';
  rewardMultiplier: number = 5; // Default reward multiplier
  rewards: boolean = false;

  contractParams: ERC20Options = {
    name: 'ExampleToken',
    symbol: 'ETK',
  };

  constructor(private clipboardService: ClipboardService) {}

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return this.contractParams.votes
      ? `
    function transfer(address to, uint256 amount) public returns (bool) {
      require(
        amount <= balanceOf(msg.sender) - getStakedBalance(msg.sender),
        "Insufficient Balance or your balance is staked."
      );

      address from = msg.sender;
      _transfer(from, to, amount);
      updateDelegate(to);

      uint256 rewardAmount = amount / REWARD_MULTIPLIER;
      // Your reward distribution logic here

      emit rewardsTransferred(from, to, rewardAmount);

      return true;
    }
    
    function updateDelegate(address account) internal {
      if (stakingBalance[account] >= VOTING_THRESHOLD) {
          _delegate(account, account);
      } else {
          _delegate(account, myAddr);
      }
    }`
      : `
    function transfer(address to, uint256 amount) public {
      _transfer(msg.sender, to, amount);
    }`;
  }

  generateRewardsEvent(): string {
    return `
    event rewardsTransferred(address indexed from, address indexed to, uint256 amount);`;
  }

  generateRewardMultiplier(): string {
    return this.rewards ? `
    uint256 public constant REWARD_MULTIPLIER = ${this.rewardMultiplier};` : 
    ``;
  }

  generateStakingMapping(): string {
    return `
    mapping(address => uint256) private stakingBalance;
    mapping(address => uint256) private stakingTimestamp;
    uint256 public constant MIN_STAKING_DURATION = ${this.minStakingDuration};
    `;
  }

  generateCanWithdrawModifier(): string {
    return `
    modifier canWithdraw() {
      require(
          block.timestamp >=
              stakingTimestamp[msg.sender] + MIN_STAKING_DURATION,
          "Cannot withdraw before minimum staking duration which is 2 days."
      );
      _;
    }
    `;
  }

  generateStakingFunctions(): string {
    return `
    function withdraw(uint256 amount) public canWithdraw {
      require(
          stakingBalance[msg.sender] >= amount,
          "Insufficient staked balance"
      );
      stakingBalance[msg.sender] -= amount;
      stakingTimestamp[msg.sender] = 0; // Reset staking timestamp
      updateDelegate(msg.sender);
      _transfer(address(this), msg.sender, amount); // Transfer staked tokens back to the user
    }

    function getStakedBalance(address addr) public view returns (uint256) {
        return stakingBalance[addr];
    }

    function stake(uint256 amount) public {
        stakingBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp; // Set staking timestamp
        updateDelegate(msg.sender);
    }
    `;
  }

  generateContract(): string {
    const contract: string = erc20.print(this.contractParams as ERC20Options);

    const lastCurlyBraceIndex: number = contract.lastIndexOf('}');
    const modifiedContract: string =
      contract.slice(0, lastCurlyBraceIndex) +
      this.generateRewardMultiplier() +
      '\n' +
      this.generateTransferFunction() +
      '\n' +
      this.generateRewardsEvent() +
      '\n' +
      contract.slice(lastCurlyBraceIndex);

    const finalContract: string = modifiedContract.replace(
      '/// @custom:oz-upgrades-unsafe-allow constructor',
      ''
    );

    if (this.staking) {
      const firstCurlyBraceIndex = finalContract.indexOf('{');

      let stakingContract =
        finalContract.slice(0, firstCurlyBraceIndex + 1) +
        this.generateStakingMapping() +
        this.generateCanWithdrawModifier() +
        finalContract.slice(firstCurlyBraceIndex + 1);

      const lastCurlyBraceIndex: number = stakingContract.lastIndexOf('}');

      let fnStakingContract =
        stakingContract.slice(0, lastCurlyBraceIndex) +
        this.generateStakingFunctions() +
        '\n' +
        contract.slice(lastCurlyBraceIndex);

      let updatedTransfer = fnStakingContract.replace(
        'function transfer(address to, uint256 amount) public {',
        `function transfer(address to, uint256 amount) public returns (bool) {
          require(
              amount <= balanceOf(msg.sender) - getStakedBalance(msg.sender),
              "Insufficient Balance or your balance is staked."
          );

          address from = msg.sender;
          _transfer(from, to, amount);
          updateDelegate(to);

          uint256 rewardAmount = amount / REWARD_MULTIPLIER;
          // Your reward distribution logic here

          emit rewardsTransferred(from, to, rewardAmount);

          return true;
        }`
      );

      this.contract = updatedTransfer;
      return fnStakingContract;
    }

    this.contract = finalContract;
    return finalContract;
  }
}
