import { React, useState, useEffect } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "../style/timer.module.css";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const PlayerStatus = ({ playerPosition, playerName, isStartCount, nextPlayerHandler, hitHandler, playerIndex, playerStandHandler,isPlayerAccount,isDealerRevealHandler }) => {

    const [isCount, setIsCount] = useState(false)
    const [key, setKey] = useState('0')
    const [duration,] = useState(200)

    useEffect(() => {
        if (isStartCount === true) {
            setIsCount(true)
        }


    }, [isStartCount])

    const abbreviationAvatar = (playerName) => {
        return {
            sx: {
                bgcolor: "#8c9eff",
            },
            children: playerName[0].toUpperCase(),
        };


    }
    //console.log(abbreviationAvatar(playerName))



    return (
        <div className={styles[playerPosition]}>

            <CountdownCircleTimer
                onComplete={
                    () => {
                        setIsCount(false)
                        nextPlayerHandler()
                    }
                }
                key={key}
                isPlaying={isCount}
                strokeWidth={3}
                duration={duration}
                size={46}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[15, 10, 5, 0]}>
                {() => <Avatar{...abbreviationAvatar(playerName)} />}
            </CountdownCircleTimer>
            {isPlayerAccount&&(
            <div><Button onClick={() => {
                hitHandler(playerIndex)
                
                setKey((preKey) => preKey + 1)
            }}
                disabled={!isCount}
            >{"hit"}</Button>

            <Button onClick={() => {
                playerStandHandler()
                nextPlayerHandler()
                setKey((preKey) => preKey + 1)
                setIsCount(false)
                isDealerRevealHandler()
            }}
                disabled={!isCount}
            >{"stand"}</Button></div>)}
        </div>

    )

}
export default PlayerStatus