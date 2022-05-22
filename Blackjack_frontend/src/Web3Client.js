import Web3 from "web3"
import BlackJackContractBuild from "contracts/BlackJackV2.json"

//let BlackJackContract;
let provider = window.ethereum 
const web3 =new Web3(provider)

let isInitial=false;

let contractAddress;
let BlackJackContract;
let accounts;
let currentP
//balance
let dealer;
let dealerBal;
let player;
let playerBal;
let contractBal;

//const PROVIDER_URL='http://localhost:3000'

export const initializeContract= async ()=>{

if(!isInitial){

const networkID= await web3.eth.net.getId()
contractAddress=BlackJackContractBuild.networks[networkID].address 
BlackJackContract= new web3.eth.Contract(BlackJackContractBuild.abi,contractAddress)

isInitial=true

//should be removed in production.


}


//dealerBal= await BlackJackContract.methods.dealerBalance().call()
//const maxb=await BlackJackContract.methods.maxBet().call()
//const join=await BlackJackContract.methods.joinGame().send({from:accounts[0],value:10})
//data= await web3.eth.getCode(contractAddress)
//const deploy= await  BlackJackContract.deploy({data:data,arguments: [10, 1000]})
//console.log(dealerBal)
//console.log(maxb)
//const dealer= await BlackJackContract.methods.dealer().call()
//const balance=await web3.eth.getBalance(contractAddress)

} 



export const joinGame= async ()=>{
    if(!isInitial){
        await initializeContract();}
   
        return BlackJackContract.methods.joinGame().send({from:accounts[0],value:10})
    }

export const startGame= async ()=>{
        if(!isInitial){
            await initializeContract();}
       
        return BlackJackContract.methods.startGame().send({from:accounts[0]})
    } 



export const getDealer= async ()=>{
    if(!isInitial){
        await initializeContract();
    }
        return BlackJackContract.methods.dealer().call()
    }

export const getStatus=async()=>{
    if (!isInitial) {
        await initializeContract();
    }
    const statusArr = []
    accounts = await web3.eth.getAccounts();
    currentP=accounts[0]
    player = await BlackJackContract.methods.player().call()
    playerBal = await BlackJackContract.methods.playerBalance().call()
    dealer = await BlackJackContract.methods.dealer().call()
    dealerBal = await BlackJackContract.methods.dealerBalance().call()
    contractBal = await web3.eth.getBalance(contractAddress)

    console.log(`current player (Metamask...):${currentP}`)
    console.log(`player :${player}`)
    console.log(`player bal:${playerBal}`)
    console.log(`current dealer:${dealer}`)
    console.log(`dealer bal:${dealerBal}`)
    console.log(`contract bal:${contractBal}`)
    statusArr.push({
        metamask_account:currentP,
        player:player,
        playerBal:playerBal,
        dealer:dealer,
        dealerBal:dealerBal,
        contractBal:contractBal})
    return statusArr;

    }



    





