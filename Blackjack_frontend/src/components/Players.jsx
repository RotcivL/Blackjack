import { React, useState, useEffect } from 'react';
import Card from "./Cards"
import styles from "../style/player.module.css";
import PlayerStatus from './PlayerStatus';
//import betIcon from "../bet_chips.webp"


const Player=({playerIndex,name,cardList,isPlayerAccount,isDealerAccount,whosTurn,nextPlayerHandler,hitHandler,playerStandHandler,isDealerRevealHandler,isDealerReveal})=>{

  const [position,setPosition]=useState(null)
  const [isTurn,setIsTurn]=useState(false)

  useEffect(()=>{
    const positionSetter=()=>{
      switch(playerIndex){
        case 0:
          setPosition("bottom")
          return;
        case 1:
          setPosition("left")
          return;
        case 2:
          setPosition("top")
          return;
        case 3:
          setPosition("right")
          return
        default:
          setPosition("bottom")
        
      }
    }
    positionSetter()

  },[playerIndex])

  useEffect(()=>{
    const timerStart=()=>{
      if(whosTurn===playerIndex){
        setIsTurn(true)
      }
    }
    timerStart()
  },[whosTurn,playerIndex])

          
      return (
        
        
        <div className={styles[position]}>
           
           <PlayerStatus
         playerPosition={position}
         playerName={name}
         isStartCount={isTurn}
         nextPlayerHandler={nextPlayerHandler}
         playerIndex={playerIndex}
         hitHandler={hitHandler}
         playerStandHandler={playerStandHandler}
         isPlayerAccount={isPlayerAccount}
         isDealerRevealHandler={isDealerRevealHandler}
         />
          
        <div className={styles.cardContainer}
              style={
                {transform:`rotate(${(playerIndex)*90}deg)`}
              }>
          
          {cardList.map((card, index)=><Card 
          key={index}
          index={index}
          value={card.value}
          type={card.type}
          num={cardList.length}
          playerIndex={playerIndex}
          isDealer={false}
          isPlayerAccount={isPlayerAccount}
          isDealerAccount={isDealerAccount}
          isDealerReveal={isDealerReveal}
          
          
         />)}
         
        
         
        </div>
        </div>
        
      );

}
export default Player