
import { React, useState, useEffect } from 'react';
import Dealer from './components/Dealer';
import Player from './components/Players';
import styles from "../src/style/table.module.css"
import backgroundImage from "./table_background.jpeg"
import StartDialog from './components/StartDialog';
import Button from '@mui/material/Button';
import {initializeContract, joinGame, getStatus, startGame,getHandCard,playerHitCard, getGameStart, getPlayerWin, playerStand,startGameEventListener,joinGameEventListener,playerHitEventListener, playerStandEventListener,withdraw} from "./Web3Client";
import GameOverDialog from './components/GameOverDialog';
import Typography from '@mui/material/Typography';




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

  const nullPlayer="0x0000000000000000000000000000000000000000";

  const [account,setAccount]=useState(null)

  const [dealer,setDealer]=useState(null)

  //const [metamaskAccount,setmetamaskAccount]=useState(null)

  const [dealerBal,setDealerBal]=useState(null)

  const[player,setPlayer]=useState(null)

  const[playerBal,setPlayerBal]=useState(null)

  const[contractBal,setContractBal]=useState(null)

  const[gameStart,setGameStart]=useState(null)

  const[playerWin,setPlayerWin]=useState(null)

  



  
  const initialCardCount=2
  
  const [isDealerStart,setisDealerStart]=useState(false)

  const[playerList,setPlayerList]=useState([])
  
  //const[deck,]=useState(deckBuilder())

  const[dealerCardList, setDealerCardList]=useState([])

  const[turnIndex,setTurnIndex]=useState('')

  const[isDealerTurn,setIsDealerTurn]=useState(false)

  const [isPlayerAccount,setIsPlayerAccount]=useState(null)

  const [isDealerAccount,setIsDealerAccount]=useState(null)

  const[isPlayerJoin,setIsPlayerJoin]=useState(null)

  const [isDealerReveal,setIsDealerReveal]=useState(false)


  const [time, setTime] = useState(Date.now());

   useEffect(() => {
     const interval = setInterval(() => setTime(Date.now()), 1000);
     return () => {
       clearInterval(interval);
      
     };
    
   }, []);



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
  
},[isDealerStart,player])

useEffect(()=>{
  const currentUser= async()=>{
    if(player!==null&&dealer!==null&&account!==null){
   
      setIsDealerAccount(dealer.toLowerCase()===account.toLowerCase());
      setIsPlayerAccount(player.toLowerCase()===account.toLowerCase());
    }

  }
  currentUser()
},[account,player,dealer])





const joinGameHandler= async ()=>{
  const result=await joinGame()
  if(result){
    await setStatusHandler()
  
  }

}

const isDealerRevealHandler=()=>{
  setIsDealerReveal(true)
}

const startGameHandler=async()=>{
  const result=await startGame()
  if(result){
    await setStatusHandler()
    await setHandHandler()
    //setisDealerStart(true)
   
    await wait(dealingInterval*4)
    const gameStart_=await getGameStart()
    const playerWin_=await getPlayerWin()
    setGameStart(gameStart_)
    setPlayerWin(playerWin_)
    
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
  
  //setGameStart(statusArr[0].gameStart)
  

}

const setHandHandler=async()=>{
   const handCard=await getHandCard()
   const player_add=player
  
   const temp_playerList=playerList
   const temp_dealerCardList=dealerCardList
   const dealerHand_index=handCard.dealerHand
   const playerHand_index=handCard.playerHand
   if(dealerHand_index==null||playerHand_index==null){
     return
   }
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

   //setisDealerStart(false)
   setTurnIndex(0)
   //console.log(dealerHand,dealerHand_index)

   //console.log(dealerCardList,playerList)
   
}

 

     
    
  



/*
  Start dealing cards.
  */

  const setisDealerStartHandler=()=>{
    setisDealerStart(true)
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
   
    setPlayerList([...temp_playerList])
    const gameStart_=await getGameStart()
    const playerWin_=await getPlayerWin()
    setGameStart(gameStart_)
    setPlayerWin(playerWin_)

  }

  const playerStandHandler= async ()=>{
    const result=await playerStand()
    //console.log("player stand: ",result)
    // const temp_dealerCardList=dealerCardList
    // const oldHandCardNum=temp_dealerCardList.length
    // const handCard=await getHandCard()
    //const dealerHandCard_index=handCard.dealerHand
    //const dealerHandCard=cardInterpreter(dealerHandCard_index)
    console.log("dealerhand: ",dealerCardList)
    // const addedCardNum=dealerHandCard.length-oldHandCardNum
    // if(addedCardNum>0){
    //   for (let i=0;i<addedCardNum;i++){
    //     temp_dealerCardList.push(dealerHandCard[i+2])
    //     console.log(temp_dealerCardList)
    //     setDealerCardList([...temp_dealerCardList])
    //     await wait(dealingInterval)

    //   }
    // }
    // const gameStart_=await getGameStart()
    // const playerWin_=await getPlayerWin()

    // setGameStart(gameStart_)
    // setPlayerWin(playerWin_)

    
   
  }

  const withdrawHandler= async ()=>{
    const result=await withdraw()
    if(result){
      console.log("successfully withdraw ")
    }
  }
 

  const startGameListener= async ()=>{
    const results=await startGameEventListener()
    if(results){
      const _gameStart=results.returnValues._gameStart
      const _playerWin=results.returnValues._playerWin
      const _dealerBalance=results.returnValues._dealerBalance
      const _playerBalance=results.returnValues._playerBalance
      setisDealerStart(_gameStart)
      await wait(dealingInterval*4)
      setPlayerWin(_playerWin)
      setDealerBal(_dealerBalance)
      setPlayerBal(_playerBalance)
    
      console.log("test gamestart listener",results.returnValues._gameStart)
    }
    // else{
    //   console.log("invalid res")
    // }
    
  }

  startGameListener();

  const joinGameListener= async ()=>{
    const results=await joinGameEventListener()
    if(results){
      const _player=results.returnValues._player
      setPlayer(_player)
      setIsPlayerJoin(true)
      //console.log("test joingame listener",results.returnValues._player)
    }
    // else{
    //   console.log("invalid res")
    // }
    
  }

  joinGameListener();
  
  const playerHitCardListener= async ()=>{
    const results=await playerHitEventListener()
    if(results){
      const temp_playerList=playerList
      const playerHand_index=results.returnValues._playerHand
      const _playerWin=results.returnValues._playerWin
      const _dealerBalance=results.returnValues._dealerBalance
      const _playerBalance=results.returnValues._playerBalance
      const playerHand=cardInterpreter(playerHand_index)
      //const temp_cardList=temp_playerList[0].cardList
      //const handCardNum=temp_cardList.length-1
      temp_playerList[0].cardList=playerHand
      
      setPlayerList([...temp_playerList])
      //setIsDealerReveal(true)
      setPlayerWin(_playerWin)
      setDealerBal(_dealerBalance)
      setPlayerBal(_playerBalance)

      
      //console.log("test handcard listener",results.returnValues._playerHand,playerHand,temp_playerList)
    }
    // else{
    //   console.log("invalid res")
    // }
    
  }
  
  playerHitCardListener();

  const playerDealerCardListener= async ()=>{
    const results=await playerStandEventListener()
    if(results){
      //const temp_dealerList=dealerCardList
      const dealerHand_index=results.returnValues._dealerHand
      const _playerWin=results.returnValues._playerWin
      const _dealerBalance=results.returnValues._dealerBalance
      const _playerBalance=results.returnValues._playerBalance
      const dealerHand=cardInterpreter(dealerHand_index)
      //const temp_cardList=temp_playerList[0].cardList
      //const handCardNum=temp_cardList.length-1
      //temp_dealerList=dealerHand
      
      setDealerCardList([...dealerHand])
      setIsDealerReveal(true)
      setPlayerWin(_playerWin)
      setDealerBal(_dealerBalance)
      setPlayerBal(_playerBalance)
      //console.log("test standcard listener",temp_dealerList,dealerHand)
    }
    // else{
    //   console.log("invalid res")
    // }
    
  }
  
  playerDealerCardListener();


  

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
    setisDealerStartHandler={setisDealerStartHandler}
    initializeContract={initializeContract}
    isPlayerJoin={isPlayerJoin}
    isDealerStart={isDealerStart}
    dealer={dealer}
    player={player}
    account={account}
    joinGameHandler={joinGameHandler}
    setStatusHandler={setStatusHandler}
    startGameHandler={startGameHandler}
    setHandHandler={setHandHandler}
    startGameEventListener={startGameEventListener}
    joinGameEventListener={joinGameEventListener}
    
    

    />
    <GameOverDialog
    gameStart={gameStart}
    withdrawHandler={withdrawHandler}
    playerBal={playerBal}
    playerWin={playerWin}
    isPlayerAccount={isPlayerAccount}
    isDealerAccount={isDealerAccount}
    />
  
   {(dealerBal&&isPlayerAccount)&&(<Typography>{`Current balance: ${playerBal}`}</Typography>)}
   {(dealerBal&&!isPlayerAccount&&isPlayerJoin!==null)&&(<Typography>{`Current balance: ${dealerBal}`}</Typography>)}
   {<Button onClick={()=>
          {
            withdrawHandler()


            }}
             >
            withdraw
          </Button>}
   
  
   </section>
    <div 
    className={styles.table}
    style={{backgroundImage: `url(${backgroundImage})`}}
    >
   
   
    <Dealer
    cardList={dealerCardList}
    isDealerTurn={isDealerTurn}
    isDealerAccount={isDealerAccount}
    isPlayerAccount={isPlayerAccount}
    isDealerReveal={isDealerReveal}
    
    />
    
    {playerList.map((player, index)=><Player
      key={index}
      playerIndex={index}
      name={player.name}
      isDealerAccount={isDealerAccount}
      isPlayerAccount={isPlayerAccount}
      bet={player.bet}
      cardList={player.cardList}
      whosTurn={turnIndex}
      nextPlayerHandler={nextPlayerHandler}
      hitHandler={hitHandler}
      playerStandHandler={playerStandHandler}
      isDealerRevealHandler={isDealerRevealHandler}
      isDealerReveal={isDealerReveal}
      />
    )}
    
    </div>
    </>
  )
}

export default App;
