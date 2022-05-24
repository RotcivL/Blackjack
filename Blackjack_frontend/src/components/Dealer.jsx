import { React, useState, useEffect } from 'react';
import Card from "./Cards"
import styles from "../style/player.module.css";

const Dealer=({cardList,isDealerTurn,isDealerAccount,isPlayerAccount})=>{
    

    return(
        <div className={styles.handContainer}>
        <div className={styles.cardContainer} >
          {cardList.map((card, index)=><Card 
          key={index}
          index={index}
          value={card.value}
          type={card.type}
          num={cardList.length}
          isDealer={true}
          isDealerAccount={isDealerAccount}
          isPlayerAccount={isPlayerAccount}
         />)}
          
        </div>
        </div>
    )
}
export default Dealer