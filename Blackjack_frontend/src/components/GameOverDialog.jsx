import { React, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const GameOverDialog=({gameStart,playerWin,isDealerAccount,isPlayerAccount,withdrawHandler})=>{

    const [isWin,setIsWin]=useState(null)
    const [isOpen, setIsOpen] =useState(false);

    useEffect(()=>{
        if(gameStart===false){
            setIsOpen(true)
            setIsWin(playerWin)
        }

    },[gameStart,playerWin])


    return (

        <div>
        <Dialog
          open={isOpen}
          onClose={()=>{setIsOpen(false)}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {(isWin&&isPlayerAccount)?(<Typography>{"Congrats player"}</Typography>):(<Typography>{"Game over"}</Typography>)}
            
          </DialogTitle>
          <DialogContent>
            
            <DialogContentText id="alert-dialog-description" >
             {(isWin&&isPlayerAccount)?(<Typography>{`You have won!` }</Typography>):(<Typography>{`You have lost!` }</Typography>)}
  
              
            </DialogContentText>
           
          </DialogContent>
          <DialogActions>
          {<Button onClick={()=>
          {
            withdrawHandler()
            setIsOpen(false)

            }} >
            withdraw
          </Button>}
          </DialogActions>
        </Dialog>
      </div>
    );

}
export default GameOverDialog;