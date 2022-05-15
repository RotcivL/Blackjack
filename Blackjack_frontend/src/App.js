
import { React, useState, useEffect } from 'react';
import Dealer from './components/Dealer';
import Player from './components/Players';
import styles from "../src/style/table.module.css"
import backgroundImage from "./table_background.jpeg"
import StartDialog from './components/StartDialog';

import Web3 from 'web3'



//import ReactDOM from 'react-dom';



const App=()=> {

  const PROVIDER_URL='http://localhost:3000'

  const connectWalletHandler=()=>{
    //const web3= new Web3(PROVIDER_URL)
    let provider=window.ethereum;

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
 
   
   
  const dealingInterval=1000;

  const initialCardCount=2
  
  const [isInitialStarted,setIsInitialStarted]=useState(false)

  const[playerList,setPlayerList]=useState([])
  
  const[deck,]=useState(deckBuilder())

  const[dealerCardList, setDealerCardList]=useState([])

  const[turnIndex,setTurnIndex]=useState('')

  const[isDealerTurn,setIsDealerTurn]=useState(false)



  /*
  Fetch players' data and then initiallize player list.
  When isRoundStarted truns true, each player gets their initial cards by triggering dealing method
  */

  
  useEffect(()=>{
    const fetchPlayer= async () => {
        try{
          const res= await import("./data")
          setPlayerList(res.default)
          
          dealing(res.default)   
              
        }catch(err){
            console.log("err: ",err)
        }

    }
    fetchPlayer()
   
},[isInitialStarted])




 
   
    
/*
  In certain amount of duration, normal player gets card with clockwise order.
  Dealer gets card lastly.
  */
     
    
  
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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

  const hitHandler=(index)=>{
    const temp_playerList=playerList
    temp_playerList[index].cardList.push(deck.pop())
    setPlayerList([...temp_playerList])
  }


 
  


  

  return (
    <>
    <div>
    <StartDialog
    startHandler={startHandler}
    />
   <button onClick={connectWalletHandler}/>
    </div>
   
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
