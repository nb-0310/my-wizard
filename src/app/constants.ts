export const contract: string = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyICO is Ownable {
    using SafeMath for uint256;

    ERC20 public token;
    address public tokenOwner;

    // Sale Phase struct
    struct SalePhase {
        uint256 startTime;
        uint256 endTime;
        uint256 discountRate;
    }

    SalePhase[] public salePhases;
    uint256 public currentPhaseIndex;

    uint256 public tokenPrice;
    address payable public wallet;

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public registeredTokens;

    event ICOStarted(uint256 startTime, uint256 endTime, uint256 initialPhaseDiscount);
    event ICOEnded(uint256 endTime);
    event TokenPriceSet(uint256 tokenPrice);
    event TokensRegistered(address indexed buyer, uint256 amount);
    event RegistrationCancelled(address indexed buyer, uint256 amount);
    event ETHWithdrawn(uint256 amount);
    event PhaseChanged(uint256 phaseIndex, uint256 startTime, uint256 endTime, uint256 discountRate);

    modifier onlyDuringICO() {
        require(block.timestamp >= salePhases[currentPhaseIndex].startTime && block.timestamp <= salePhases[currentPhaseIndex].endTime, "ICO not active");
        _;
    }

    modifier onlyAfterICO() {
        require(block.timestamp > salePhases[salePhases.length - 1].endTime, "ICO has not ended yet");
        _;
    }

    constructor(
        address _tokenAddress,
        uint256[] memory _startTimes,
        uint256[] memory _endTimes,
        uint256[] memory _discountRates,
        uint256 _tokenPrice,
        address payable _wallet,
        address _tokenOwner
    ) Ownable(_wallet) {
        require(_startTimes.length == _endTimes.length && _endTimes.length == _discountRates.length, "Mismatched array lengths");

        token = ERC20(_tokenAddress);
        tokenPrice = _tokenPrice;
        wallet = _wallet;
        tokenOwner = _tokenOwner;

        for (uint256 i = 0; i < _startTimes.length; i++) {
            salePhases.push(SalePhase({
                startTime: _startTimes[i],
                endTime: _endTimes[i],
                discountRate: _discountRates[i]
            }));
        }

        currentPhaseIndex = 0;
    }

    function startICO() external onlyOwner {
        require(block.timestamp < salePhases[0].startTime, "ICO has already started or ended");
        emit ICOStarted(salePhases[0].startTime, salePhases[0].endTime, salePhases[0].discountRate);
        emit PhaseChanged(currentPhaseIndex, salePhases[0].startTime, salePhases[0].endTime, salePhases[0].discountRate);
    }

    function endICO() external onlyOwner {
        require(block.timestamp >= salePhases[salePhases.length - 1].endTime, "ICO not active");
        emit ICOEnded(block.timestamp);

        // Transfer tokens to registered buyers
        for (uint256 i = 0; i < salePhases.length; i++) {
            address[] memory buyers = getRegisteredBuyersInPhase(i);
            for (uint256 j = 0; j < buyers.length; j++) {
                address buyer = buyers[j];
                uint256 amount = registeredTokens[buyer];
                token.transferFrom(tokenOwner, buyer, amount);
            }
        }
    }

    function setTokenPrice(uint256 _tokenPrice) external onlyOwner onlyDuringICO {
        require(_tokenPrice > 0, "Token price must be greater than zero");
        tokenPrice = _tokenPrice;
        emit TokenPriceSet(_tokenPrice);
    }

    function getCurrentPhase() external view returns (uint256 startTime, uint256 endTime, uint256 discountRate) {
        return (
            salePhases[currentPhaseIndex].startTime,
            salePhases[currentPhaseIndex].endTime,
            salePhases[currentPhaseIndex].discountRate
        );
    }

    function buyTokens(uint256 _amount) external payable onlyDuringICO {
        require(msg.value > 0, "Must send ETH to purchase tokens");
        require(_amount > 0, "Amount of tokens must be greater than zero");

        uint256 totalPrice = calculateTotalPrice(_amount);
        require(msg.value >= totalPrice, "Insufficient ETH sent");

        registeredTokens[msg.sender] = registeredTokens[msg.sender].add(_amount);
        contributions[msg.sender] = contributions[msg.sender].add(totalPrice);

        emit TokensRegistered(msg.sender, _amount);
    }

    function cancelRegistration() external onlyDuringICO {
        uint256 amount = registeredTokens[msg.sender];
        require(amount > 0, "No tokens registered for cancellation");

        registeredTokens[msg.sender] = 0;

        // Refund the user
        contributions[msg.sender] = contributions[msg.sender].sub(calculateTotalPrice(amount));
        payable(msg.sender).transfer(calculateTotalPrice(amount));

        emit RegistrationCancelled(msg.sender, amount);
    }

    function withdrawETH() external onlyOwner onlyAfterICO {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        wallet.transfer(balance);

        emit ETHWithdrawn(balance);
    }

    function calculateTotalPrice(uint256 _amount) internal view returns (uint256) {
        uint256 discountedPrice = tokenPrice.mul(100 - salePhases[currentPhaseIndex].discountRate).div(100);
        return discountedPrice.mul(_amount);
    }

    function changePhase() external onlyOwner onlyDuringICO {
        require(currentPhaseIndex < salePhases.length - 1, "No more phases left");

        currentPhaseIndex++;

        emit PhaseChanged(
            currentPhaseIndex,
            salePhases[currentPhaseIndex].startTime,
            salePhases[currentPhaseIndex].endTime,
            salePhases[currentPhaseIndex].discountRate
        );
    }

    function getRegisteredBuyersInPhase(uint256 _phaseIndex) public view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < salePhases[_phaseIndex].endTime; i++) {
            if (registeredTokens[msg.sender] > 0) {
                count++;
            }
        }

        address[] memory buyers = new address[](count);

        return buyers;
    }
}
`

export const bytecode = `608060405234801562000010575f80fd5b506040516200298a3803806200298a8339818101604052810190620000369190620005e0565b815f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000aa575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000a19190620006fc565b60405180910390fd5b620000bb81620002c760201b60201c565b5084518651148015620000cf575083518551145b62000111576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001089062000775565b60405180910390fd5b8660015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550826005819055508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505f5b8651811015620002b2576003604051806060016040528089848151811062000207576200020662000795565b5b602002602001015181526020018884815181106200022a576200022962000795565b5b602002602001015181526020018784815181106200024d576200024c62000795565b5b6020026020010151815250908060018154018082558091505060019003905f5260205f2090600302015f909190919091505f820151815f0155602082015181600101556040820151816002015550508080620002a990620007ef565b915050620001da565b505f600481905550505050505050506200083b565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f620003c48262000399565b9050919050565b620003d681620003b8565b8114620003e1575f80fd5b50565b5f81519050620003f481620003cb565b92915050565b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6200044682620003fe565b810181811067ffffffffffffffff821117156200046857620004676200040e565b5b80604052505050565b5f6200047c62000388565b90506200048a82826200043b565b919050565b5f67ffffffffffffffff821115620004ac57620004ab6200040e565b5b602082029050602081019050919050565b5f80fd5b5f819050919050565b620004d581620004c1565b8114620004e0575f80fd5b50565b5f81519050620004f381620004ca565b92915050565b5f6200050f62000509846200048f565b62000471565b90508083825260208201905060208402830185811115620005355762000534620004bd565b5b835b818110156200056257806200054d8882620004e3565b84526020840193505060208101905062000537565b5050509392505050565b5f82601f830112620005835762000582620003fa565b5b815162000595848260208601620004f9565b91505092915050565b5f620005aa8262000399565b9050919050565b620005bc816200059e565b8114620005c7575f80fd5b50565b5f81519050620005da81620005b1565b92915050565b5f805f805f805f60e0888a031215620005fe57620005fd62000391565b5b5f6200060d8a828b01620003e4565b975050602088015167ffffffffffffffff81111562000631576200063062000395565b5b6200063f8a828b016200056c565b965050604088015167ffffffffffffffff81111562000663576200066262000395565b5b620006718a828b016200056c565b955050606088015167ffffffffffffffff81111562000695576200069462000395565b5b620006a38a828b016200056c565b9450506080620006b68a828b01620004e3565b93505060a0620006c98a828b01620005ca565b92505060c0620006dc8a828b01620003e4565b91505092959891949750929550565b620006f681620003b8565b82525050565b5f602082019050620007115f830184620006eb565b92915050565b5f82825260208201905092915050565b7f4d69736d617463686564206172726179206c656e6774687300000000000000005f82015250565b5f6200075d60188362000717565b91506200076a8262000727565b602082019050919050565b5f6020820190508181035f8301526200078e816200074f565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f620007fb82620004c1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820362000830576200082f620007c2565b5b600182019050919050565b61214180620008495f395ff3fe60806040526004361061011e575f3560e01c80637ff9b5961161009f578063db6f595311610063578063db6f595314610398578063e086e5ec146103ae578063e5a078a7146103c4578063f2fde38b146103da578063fc0c546a146104025761011e565b80637ff9b596146102b25780638c0bd916146102dc5780638da5cb5b14610318578063a3a40ea514610342578063a3e676101461036e5761011e565b80636a61e5fc116100e65780636a61e5fc146101f8578063700a311c1461022057806370af64271461024a578063715018a6146102865780637fa8c1581461029c5761011e565b80633610724e1461012257806342e94c901461013e5780634f2484091461017a578063509864a514610190578063521eb273146101ce575b5f80fd5b61013c60048036038101906101379190611716565b61042c565b005b348015610149575f80fd5b50610164600480360381019061015f919061179b565b61070b565b60405161017191906117d5565b60405180910390f35b348015610185575f80fd5b5061018e610720565b005b34801561019b575f80fd5b506101b660048036038101906101b19190611716565b610948565b6040516101c5939291906117ee565b60405180910390f35b3480156101d9575f80fd5b506101e261097d565b6040516101ef9190611843565b60405180910390f35b348015610203575f80fd5b5061021e60048036038101906102199190611716565b6109a2565b005b34801561022b575f80fd5b50610234610ac5565b60405161024191906117d5565b60405180910390f35b348015610255575f80fd5b50610270600480360381019061026b9190611716565b610acb565b60405161027d9190611913565b60405180910390f35b348015610291575f80fd5b5061029a610bb9565b005b3480156102a7575f80fd5b506102b0610bcc565b005b3480156102bd575f80fd5b506102c6610d84565b6040516102d391906117d5565b60405180910390f35b3480156102e7575f80fd5b5061030260048036038101906102fd919061179b565b610d8a565b60405161030f91906117d5565b60405180910390f35b348015610323575f80fd5b5061032c610d9f565b6040516103399190611942565b60405180910390f35b34801561034d575f80fd5b50610356610dc6565b604051610365939291906117ee565b60405180910390f35b348015610379575f80fd5b50610382610e45565b60405161038f9190611942565b60405180910390f35b3480156103a3575f80fd5b506103ac610e6a565b005b3480156103b9575f80fd5b506103c2611025565b005b3480156103cf575f80fd5b506103d8611188565b005b3480156103e5575f80fd5b5061040060048036038101906103fb919061179b565b61141b565b005b34801561040d575f80fd5b5061041661149f565b60405161042391906119b6565b60405180910390f35b600360045481548110610442576104416119cf565b5b905f5260205f2090600302015f015442101580156104855750600360045481548110610471576104706119cf565b5b905f5260205f209060030201600101544211155b6104c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104bb90611a56565b60405180910390fd5b5f3411610506576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104fd90611abe565b60405180910390fd5b5f8111610548576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161053f90611b4c565b60405180910390fd5b5f610552826114c4565b905080341015610597576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058e90611bb4565b60405180910390fd5b6105e78260085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205461153c90919063ffffffff16565b60085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055506106788160075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205461153c90919063ffffffff16565b60075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff167f593dda0c899651565f66c0b7935c88bd9c24c8998e8862c66baa77bed234863f836040516106ff91906117d5565b60405180910390a25050565b6007602052805f5260405f205f915090505481565b610728611551565b6003600160038054905061073c9190611bff565b8154811061074d5761074c6119cf565b5b905f5260205f2090600302016001015442101561079f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079690611a56565b60405180910390fd5b7fbbf40e708b73b2d2689ef2694587d8e2ed884907ff46892bd20cc8098d3fb2fa426040516107ce91906117d5565b60405180910390a15f5b600380549050811015610945575f6107ef82610acb565b90505f5b8151811015610930575f8282815181106108105761080f6119cf565b5b602002602001015190505f60085f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905060015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684846040518463ffffffff1660e01b81526004016108da93929190611c32565b6020604051808303815f875af11580156108f6573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061091a9190611c9c565b505050808061092890611cc7565b9150506107f3565b5050808061093d90611cc7565b9150506107d8565b50565b60038181548110610957575f80fd5b905f5260205f2090600302015f91509050805f0154908060010154908060020154905083565b60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6109aa611551565b6003600454815481106109c0576109bf6119cf565b5b905f5260205f2090600302015f01544210158015610a0357506003600454815481106109ef576109ee6119cf565b5b905f5260205f209060030201600101544211155b610a42576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3990611a56565b60405180910390fd5b5f8111610a84576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7b90611d7e565b60405180910390fd5b806005819055507f4b59d61d9ffdc3db926d0ce7e06ebabb6bd1bf9dcdae262667e48be36822721681604051610aba91906117d5565b60405180910390a150565b60045481565b60605f805b60038481548110610ae457610ae36119cf565b5b905f5260205f20906003020160010154811015610b62575f60085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20541115610b4f578180610b4b90611cc7565b9250505b8080610b5a90611cc7565b915050610ad0565b505f8167ffffffffffffffff811115610b7e57610b7d611d9c565b5b604051908082528060200260200182016040528015610bac5781602001602082028036833780820191505090505b5090508092505050919050565b610bc1611551565b610bca5f6115d8565b565b610bd4611551565b60035f81548110610be857610be76119cf565b5b905f5260205f2090600302015f01544210610c38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2f90611e13565b60405180910390fd5b7f0cd54aed8231a11737e8d161ec89f24c7d8707a7ccc2dd66556dbf77bf71f11a60035f81548110610c6d57610c6c6119cf565b5b905f5260205f2090600302015f015460035f81548110610c9057610c8f6119cf565b5b905f5260205f2090600302016001015460035f81548110610cb457610cb36119cf565b5b905f5260205f20906003020160020154604051610cd3939291906117ee565b60405180910390a17f3f070ee620be5c50c3688c8271cf20ee5eba1cd40f0bc737693c71a56327576160045460035f81548110610d1357610d126119cf565b5b905f5260205f2090600302015f015460035f81548110610d3657610d356119cf565b5b905f5260205f2090600302016001015460035f81548110610d5a57610d596119cf565b5b905f5260205f20906003020160020154604051610d7a9493929190611e31565b60405180910390a1565b60055481565b6008602052805f5260405f205f915090505481565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f805f600360045481548110610ddf57610dde6119cf565b5b905f5260205f2090600302015f0154600360045481548110610e0457610e036119cf565b5b905f5260205f20906003020160010154600360045481548110610e2a57610e296119cf565b5b905f5260205f20906003020160020154925092509250909192565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610e72611551565b600360045481548110610e8857610e876119cf565b5b905f5260205f2090600302015f01544210158015610ecb5750600360045481548110610eb757610eb66119cf565b5b905f5260205f209060030201600101544211155b610f0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f0190611a56565b60405180910390fd5b6001600380549050610f1c9190611bff565b60045410610f5f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f5690611ebe565b60405180910390fd5b60045f815480929190610f7190611cc7565b91905055507f3f070ee620be5c50c3688c8271cf20ee5eba1cd40f0bc737693c71a563275761600454600360045481548110610fb057610faf6119cf565b5b905f5260205f2090600302015f0154600360045481548110610fd557610fd46119cf565b5b905f5260205f20906003020160010154600360045481548110610ffb57610ffa6119cf565b5b905f5260205f2090600302016002015460405161101b9493929190611e31565b60405180910390a1565b61102d611551565b600360016003805490506110419190611bff565b81548110611052576110516119cf565b5b905f5260205f2090600302016001015442116110a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161109a90611f26565b60405180910390fd5b5f4790505f81116110e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110e090611f8e565b60405180910390fd5b60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc8290811502906040515f60405180830381858888f1935050505015801561114d573d5f803e3d5ffd5b507f043f607a14d3b4f0a11a0b2e192bbfcd894298ba5abf22553be6081406db28aa8160405161117d91906117d5565b60405180910390a150565b60036004548154811061119e5761119d6119cf565b5b905f5260205f2090600302015f015442101580156111e157506003600454815481106111cd576111cc6119cf565b5b905f5260205f209060030201600101544211155b611220576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161121790611a56565b60405180910390fd5b5f60085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490505f81116112a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161129a9061201c565b60405180910390fd5b5f60085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f208190555061133d6112f1826114c4565b60075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205461169990919063ffffffff16565b60075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff166108fc6113a1836114c4565b90811502906040515f60405180830381858888f193505050501580156113c9573d5f803e3d5ffd5b503373ffffffffffffffffffffffffffffffffffffffff167ff99656fd4bffd1d3614865f257416db395fc198c6bc577311aec7228e9190cc98260405161141091906117d5565b60405180910390a250565b611423611551565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603611493575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161148a9190611942565b60405180910390fd5b61149c816115d8565b50565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f8061151f60646115116003600454815481106114e4576114e36119cf565b5b905f5260205f2090600302016002015460646115009190611bff565b6005546116ae90919063ffffffff16565b6116c390919063ffffffff16565b905061153483826116ae90919063ffffffff16565b915050919050565b5f8183611549919061203a565b905092915050565b6115596116d8565b73ffffffffffffffffffffffffffffffffffffffff16611577610d9f565b73ffffffffffffffffffffffffffffffffffffffff16146115d65761159a6116d8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016115cd9190611942565b60405180910390fd5b565b5f805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f81836116a69190611bff565b905092915050565b5f81836116bb919061206d565b905092915050565b5f81836116d091906120db565b905092915050565b5f33905090565b5f80fd5b5f819050919050565b6116f5816116e3565b81146116ff575f80fd5b50565b5f81359050611710816116ec565b92915050565b5f6020828403121561172b5761172a6116df565b5b5f61173884828501611702565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61176a82611741565b9050919050565b61177a81611760565b8114611784575f80fd5b50565b5f8135905061179581611771565b92915050565b5f602082840312156117b0576117af6116df565b5b5f6117bd84828501611787565b91505092915050565b6117cf816116e3565b82525050565b5f6020820190506117e85f8301846117c6565b92915050565b5f6060820190506118015f8301866117c6565b61180e60208301856117c6565b61181b60408301846117c6565b949350505050565b5f61182d82611741565b9050919050565b61183d81611823565b82525050565b5f6020820190506118565f830184611834565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b61188e81611760565b82525050565b5f61189f8383611885565b60208301905092915050565b5f602082019050919050565b5f6118c18261185c565b6118cb8185611866565b93506118d683611876565b805f5b838110156119065781516118ed8882611894565b97506118f8836118ab565b9250506001810190506118d9565b5085935050505092915050565b5f6020820190508181035f83015261192b81846118b7565b905092915050565b61193c81611760565b82525050565b5f6020820190506119555f830184611933565b92915050565b5f819050919050565b5f61197e61197961197484611741565b61195b565b611741565b9050919050565b5f61198f82611964565b9050919050565b5f6119a082611985565b9050919050565b6119b081611996565b82525050565b5f6020820190506119c95f8301846119a7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f82825260208201905092915050565b7f49434f206e6f74206163746976650000000000000000000000000000000000005f82015250565b5f611a40600e836119fc565b9150611a4b82611a0c565b602082019050919050565b5f6020820190508181035f830152611a6d81611a34565b9050919050565b7f4d7573742073656e642045544820746f20707572636861736520746f6b656e735f82015250565b5f611aa86020836119fc565b9150611ab382611a74565b602082019050919050565b5f6020820190508181035f830152611ad581611a9c565b9050919050565b7f416d6f756e74206f6620746f6b656e73206d75737420626520677265617465725f8201527f207468616e207a65726f00000000000000000000000000000000000000000000602082015250565b5f611b36602a836119fc565b9150611b4182611adc565b604082019050919050565b5f6020820190508181035f830152611b6381611b2a565b9050919050565b7f496e73756666696369656e74204554482073656e7400000000000000000000005f82015250565b5f611b9e6015836119fc565b9150611ba982611b6a565b602082019050919050565b5f6020820190508181035f830152611bcb81611b92565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611c09826116e3565b9150611c14836116e3565b9250828203905081811115611c2c57611c2b611bd2565b5b92915050565b5f606082019050611c455f830186611933565b611c526020830185611933565b611c5f60408301846117c6565b949350505050565b5f8115159050919050565b611c7b81611c67565b8114611c85575f80fd5b50565b5f81519050611c9681611c72565b92915050565b5f60208284031215611cb157611cb06116df565b5b5f611cbe84828501611c88565b91505092915050565b5f611cd1826116e3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611d0357611d02611bd2565b5b600182019050919050565b7f546f6b656e207072696365206d7573742062652067726561746572207468616e5f8201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b5f611d686025836119fc565b9150611d7382611d0e565b604082019050919050565b5f6020820190508181035f830152611d9581611d5c565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f49434f2068617320616c72656164792073746172746564206f7220656e6465645f82015250565b5f611dfd6020836119fc565b9150611e0882611dc9565b602082019050919050565b5f6020820190508181035f830152611e2a81611df1565b9050919050565b5f608082019050611e445f8301876117c6565b611e5160208301866117c6565b611e5e60408301856117c6565b611e6b60608301846117c6565b95945050505050565b7f4e6f206d6f726520706861736573206c656674000000000000000000000000005f82015250565b5f611ea86013836119fc565b9150611eb382611e74565b602082019050919050565b5f6020820190508181035f830152611ed581611e9c565b9050919050565b7f49434f20686173206e6f7420656e6465642079657400000000000000000000005f82015250565b5f611f106015836119fc565b9150611f1b82611edc565b602082019050919050565b5f6020820190508181035f830152611f3d81611f04565b9050919050565b7f4e6f2045544820746f20776974686472617700000000000000000000000000005f82015250565b5f611f786012836119fc565b9150611f8382611f44565b602082019050919050565b5f6020820190508181035f830152611fa581611f6c565b9050919050565b7f4e6f20746f6b656e73207265676973746572656420666f722063616e63656c6c5f8201527f6174696f6e000000000000000000000000000000000000000000000000000000602082015250565b5f6120066025836119fc565b915061201182611fac565b604082019050919050565b5f6020820190508181035f83015261203381611ffa565b9050919050565b5f612044826116e3565b915061204f836116e3565b925082820190508082111561206757612066611bd2565b5b92915050565b5f612077826116e3565b9150612082836116e3565b9250828202612090816116e3565b915082820484148315176120a7576120a6611bd2565b5b5092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f6120e5826116e3565b91506120f0836116e3565b925082612100576120ff6120ae565b5b82820490509291505056fea2646970667358221220bc1761cb2477a25c39ac0261329bc6b96e41ef9b0970568fbb78ffc491e3c08c64736f6c63430008140033`