import { React, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const GameOverDialog=({gameStart,playerWin,isDealerAccount,isPlayerAccount,withdrawHandler,playerBal})=>{

    const [isWin,setIsWin]=useState(null)
    const [isOpen, setIsOpen] =useState(false);

    useEffect(()=>{
        if(gameStart===false&&playerWin!==null){
            setIsOpen(false)
            setIsWin(playerWin)
            
        }
        console.log("win: ",isWin)

    },[gameStart,playerWin])


    return (

        <div>
        <Dialog
          open={isOpen&&isPlayerAccount}
          //onClose={()=>{setIsOpen(false)}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {(isWin&&isPlayerAccount)&&<Typography>{"Congrats player"}</Typography>}
            {(!isWin&&isPlayerAccount)&&<Typography>{"Game over"}</Typography>}
            
          </DialogTitle>
          <DialogContent>
            
            <DialogContentText id="alert-dialog-description" >
            {(isWin&&isPlayerAccount)&&<Typography>{"You won!"}</Typography>}
            {(!isWin&&isPlayerAccount)&&<Typography>{"You lost!"}</Typography>}
  
              
            </DialogContentText>
           
          </DialogContent>
          <DialogActions>
          {<Button onClick={()=>
          {
            withdrawHandler()
            setIsOpen(false)

            }}
            disabled={playerBal>0} >
            withdraw
          </Button>}

          {isPlayerAccount&&<Button onClick={()=>
          {
           
            setIsOpen(false)

            }} >
           quit
          </Button>}
          </DialogActions>
        </Dialog>
      </div>
    );

}
export default GameOverDialog;