import { React, useState, useEffect } from 'react';
import Card from "./Cards"
import styles from "../style/player.module.css";

const Dealer=({cardList})=>{
    

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
         />)}
          
        </div>
        </div>
    )
}
export default Dealer