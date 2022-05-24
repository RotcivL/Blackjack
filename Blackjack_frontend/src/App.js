
import { React, useState, useEffect } from 'react';
import Dealer from './components/Dealer';
import Player from './components/Players';
import styles from "../src/style/table.module.css"
import backgroundImage from "./table_background.jpeg"
import StartDialog from './components/StartDialog';
import Button from '@mui/material/Button';
import {initializeContract, joinGame, getStatus, startGame,getHandCard,playerHitCard, getGameStart} from "./Web3Client";
import GameOverDialog from './components/GameOverDialog';





//import ReactDOM from 'react-dom';



const App=()=> {

  const PROVIDER_URL='http://localhost:3000'

  const connectWalletHandler= async()=>{
    //const web3= new Web3(PROVIDER_URL)
    let provider=window.ethereum;
    if(typeof provider!=="undefined"){
      try{
        const accounts= await provider.request({method:"eth_requestAccounts"})
        setAccount(accounts[0])
      }catch(err){
        console.log("err:",err)
      }
       

    }
    else{
      alert("You need to install MetaMask.")
    }

  }
    

  



  /*
  This method is for initiallizing deck 
  */
  const deckBuilder=()=>{
    const temp_deck=[]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"]; 
    for (let i=0;i<types.length;i++ ){
      for(let j=0;j<values.length;j++){
       temp_deck.push({value:values[j],
                   type:types[i]})
      }
    }
    for (let i = temp_deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = temp_deck[i];
      temp_deck[i] = temp_deck[j];
      temp_deck[j] = temp;
  }
  return temp_deck
   }

   const cardInterpreter=(cardIndexList)=>{
     const temp_cardList=[]
     const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
     const types = ["C", "D", "H", "S"];
     for (let i=0;i<cardIndexList.length;i++){
       const index=cardIndexList[i]
       const value_index=index%52%13
       const type_index=Math.floor(index%52/13)
       const card={value:values[value_index],type:types[type_index]}
       temp_cardList.push(card)
     }
     return temp_cardList

   }
 
   
   
  const dealingInterval=2000;

  const [account,setAccount]=useState(null)

  const [dealer,setDealer]=useState(null)

  //const [metamaskAccount,setmetamaskAccount]=useState(null)

  const [dealerBal,setDealerBal]=useState(null)

  const[player,setPlayer]=useState(null)

  const[playerBal,setPlayerBal]=useState(null)

  const[contractBal,setContractBal]=useState(null)

  const[gameStart,setGameStart]=useState(null)



  
  const initialCardCount=2
  
  const [isInitialStarted,setIsInitialStarted]=useState(false)

  const[playerList,setPlayerList]=useState([])
  
  const[deck,]=useState(deckBuilder())

  const[dealerCardList, setDealerCardList]=useState([])

  const[turnIndex,setTurnIndex]=useState('')

  const[isDealerTurn,setIsDealerTurn]=useState(false)

  const [isPlayerAccount,setIsPlayerAccount]=useState(null)


  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  /*
  Fetch players' data and then initiallize player list.
  When isRoundStarted truns true, each player gets their initial cards by triggering dealing method
  */
  useEffect(() => {
    async function listenMMAccount() {
      window.ethereum.on("accountsChanged", async function() {
        // Time to reload your interface with accounts[0]!
        let provider=window.ethereum;
        const accounts= await provider.request({method:"eth_requestAccounts"})
        setAccount(accounts[0])
        // accounts = await web3.eth.getAccounts();
      });
    }
    listenMMAccount();
  }, []);
  
  


useEffect(()=>{
  connectWalletHandler()
  setStatusHandler()
},)

useEffect(()=>{
  connectWalletHandler()
  setStatusHandler()
},[isPlayerAccount])



const joinGameHandler= async ()=>{
  const result=await joinGame()
  if(result){
    setStatusHandler()
    //console.log(result)
  }

}

const startGameHandler=async()=>{
  const result=await startGame()
  if(result){
    await setStatusHandler()
    setHandHandler()
  }
}

const setStatusHandler=async()=>{
  const statusArr=await getStatus()
  //setmetamaskAccount(statusArr.metamask_account)
  setDealer(statusArr[0].dealer)
  setDealerBal(statusArr[0].dealerBal)
  setPlayer(statusArr[0].player)
  setPlayerBal(statusArr[0].playerBal)
  setContractBal(statusArr[0].contractBal)
  setIsPlayerAccount(statusArr[0].player.toLowerCase()===account.toLowerCase())
  //setGameStart(statusArr[0].gameStart)
  

}

const setHandHandler=async()=>{
   const handCard=await getHandCard()
   const player_add=player
   //TODO parameterize bet
   const temp_playerList=playerList
   const temp_dealerCardList=dealerCardList
   const dealerHand_index=handCard.dealerHand
   const playerHand_index=handCard.playerHand
   //console.log("dhindex: ",dealerHand_index)
   const dealerHand=cardInterpreter(dealerHand_index)
   const playerHand=cardInterpreter(playerHand_index)
   const player_json={address:player_add,cardList:[],name:"goodguy",isMe:true,bet:10}
   temp_playerList.push(player_json)
   for (let i=0;i<2;i++){
    temp_playerList[0].cardList.push(playerHand[i])
    setPlayerList([...temp_playerList])
    await wait(dealingInterval)
    temp_dealerCardList.push(dealerHand[i])
    setDealerCardList([...temp_dealerCardList])
    await wait(dealingInterval)
   }
   //setIsInitialStarted(false)
   setTurnIndex(0)
   //console.log(dealerHand,dealerHand_index)
   

   //console.log(dealerCardList,playerList)
   
}

 
   
    
/*
  In certain amount of duration, normal player gets card with clockwise order.
  Dealer gets card lastly.
  */
     
    
  


const dealing = async (playerList)=>{
    const temp_playerList=playerList
    const temp_dealerCardList=dealerCardList
    if(isInitialStarted!==true){
      return
    }
    else{
      for (let i=0; i <initialCardCount; i++ ){
        for (let j=0;j<temp_playerList.length;j++){
          await wait(dealingInterval)
          temp_playerList[j].cardList.push(deck.pop())
          setPlayerList([...temp_playerList])
      }
      await wait(dealingInterval)
      temp_dealerCardList.push(deck.pop())
      setDealerCardList([...temp_dealerCardList])
      }

    }
    setIsInitialStarted(false)
    setTurnIndex(0)
    
    
    
  }
/*
  Start dealing cards.
  */

  const startHandler=()=>{
    setIsInitialStarted(true)
  }

  const nextPlayerHandler=()=>{
    if (turnIndex<playerList.length-1){
    const nextIndex=turnIndex+1
    setTurnIndex(nextIndex)
    }
    else{
      setIsDealerTurn(true)
    }
  }

  const hitHandler= async (index)=>{
    
    const result=await playerHitCard()
    const temp_playerList=playerList
    const temp_cardList=temp_playerList[index].cardList
    const handCardNum=temp_cardList.length
    const handCard=await getHandCard()
    const playerHand_index=handCard.playerHand
    const playerHand=cardInterpreter(playerHand_index)
    temp_playerList[index].cardList.push(playerHand[handCardNum])
    console.log(result)
    console.log(playerHand)
    console.log(handCardNum)
    console.log(playerHand[handCardNum])
    setPlayerList([...temp_playerList])
    const gameStart_=await getGameStart()
    setGameStart(gameStart_)

  }


 
  


  

  return (
    <>
    <section
    style={
      {
        position:"absolute",
        marginLeft:"1800px",
        paddingTop:"30px",
        paddingRight:"30px"

      }
    }
    >
     <StartDialog
    startHandler={startHandler}
    initializeContract={initializeContract}
    dealer={dealer}
    player={player}
    account={account}
    joinGameHandler={joinGameHandler}
    setStatusHandler={setStatusHandler}
    startGameHandler={startGameHandler}
    setHandHandler={setHandHandler}
    

    />
    <GameOverDialog
    isWin_={true}
    gameStart={gameStart}
    bet={playerBal}
    />
   
   
  
   </section>
    <div 
    className={styles.table}
    style={{backgroundImage: `url(${backgroundImage})`}}
    >
   
   
    <Dealer
    cardList={dealerCardList}
    isDealerTurn={isDealerTurn}
    />
    
    {playerList.map((player, index)=><Player
      key={index}
      playerIndex={index}
      name={player.name}
      isMe={player.isMe}
      bet={player.bet}
      cardList={player.cardList}
      whosTurn={turnIndex}
      nextPlayerHandler={nextPlayerHandler}
      hitHandler={hitHandler}/>
    )}
    
    </div>
    </>
  )
}

export default App;
