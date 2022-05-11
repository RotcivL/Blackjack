
import { React, useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
//require('dotenv').config();
import styles from "../style/card.module.css";

const ROTATE_FACTOR=9
const MARGIN_TOP_DES_FACTOR=4
const Card = ({index,value,type,num,isDealer,isMe})=>{
   
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)
    //console.log(value)

    useEffect(()=>{
        const fetchImg= async () => {
            try{
                if(index===0&&!isMe){
                    const res = await import(`../cards/BACK.png`)
                    setImage(res.default) 
                }
                else{
                    const res= await import(`../cards/${value}-${type}.png`)
                    setImage(res.default) 
                }
                
            }catch(err){
                setError("can't find such card")
            }

        }
        fetchImg()
    },[value,type,index,isDealer,isMe])

    
    //console.log(index)

    //const cardSrc="../cards/"+value+"-"+type+".png"
    
    return (
        <>
       
        <div >
           {error==null?(<img 
           src={image} 
           alt="this is card"
           style={isDealer?{
            marginTop:"490px",
            padding:"4px"
           }:{
               transform:`rotate(${(index-((num-1)/2))*ROTATE_FACTOR}deg)`,
               marginTop:`${(200+index*MARGIN_TOP_DES_FACTOR)}px`,
               marginLeft: "-80px"

            }}
           className={styles.card}
           />):(<p>{error}</p>)}
        </div>
        </>
    )


}
export default Card