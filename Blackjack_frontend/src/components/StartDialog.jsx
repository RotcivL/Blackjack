import { React, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
//import { getDealer } from '../Web3Client';


const StartDialog=({startHandler,isDealerStart,dealer,account,player,joinGameHandler,setStatusHandler,startGameHandler,setHandHandler,isPlayerJoin})=>{

const [isOpen, setIsOpen] =useState(true);
const [isReady,setIsReady]=useState(false);
const [user,setUser]=useState(null);
const [isGO,setIsGO]=useState(null);
const [isJoin,setIsJoin]=useState(null)

const nullPlayer="0x0000000000000000000000000000000000000000";


useEffect(()=>{
  if(account!==null&&dealer!==null){
    if(account.toLowerCase()===dealer.toLowerCase()&&player!==nullPlayer){
    setIsReady(true)
    return}
    
  else{
    setIsReady(false)
  }
  }
  else{
    setIsReady(false)
  }
  
},[dealer,account,player])

useEffect(()=>{
  if(account!==null&&dealer!==null){
  if(account.toLowerCase()===dealer.toLowerCase()){
    if(player!==nullPlayer){
      setUser(-1)
      return
    }
    else{
      setUser(0)
    return
    }
    
  }
  if(account.toLowerCase()===player.toLowerCase()){
    setUser(1)
    return
  }
  else{
    setUser(null)

  }
  
}

},[dealer,account,player])



  useEffect(()=>{
    setIsGO(isDealerStart)

  },[isDealerStart])

  useEffect(()=>{
    setIsJoin(isPlayerJoin)

  },[isPlayerJoin])







  return (
    <div>
      <Dialog
        open={isOpen}
        //onClose={()=>{setIsOpen(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {user===1&&(<Typography>{"Welcome player"}</Typography>)}
          {user===0&&(<Typography>{"Welcome dealer"}</Typography>)}
          {user===-1&&(<Typography>{"Welcome dealer"}</Typography>)}
          {user===null&&(<Typography>{"Welcome"}</Typography>)}
        </DialogTitle>
        <DialogContent>
          
          <DialogContentText id="alert-dialog-description" >
           {user===null&&(<div><Typography>{`Dealer is ${dealer}`}</Typography><Typography>{`This is your current address: ${account}`}</Typography></div>)}
            {user===0&&(<Typography>{"Waiting for player joing game..."}</Typography>)}
            {user===1&&(<Typography>{"Waiting for dealer starting game..."}</Typography>)}
            {(isJoin&&user===-1)&&(<Typography>{`Player ${player} is waiting...` }</Typography>)}

            
          </DialogContentText>
         
        </DialogContent>
        <DialogActions>
          {(isJoin&&user===-1)&&<Button onClick={()=>
          {
            startGameHandler()
            setIsOpen(false)
            //setisDealerStartHandler()
            //console.log(isDealerStart)

            }} >
            start game
          </Button>}
          
          {user===null&&<Button onClick={()=>
          {
            joinGameHandler()
            }} >
            join
          </Button>}
          {isGO&&<Button onClick={()=>
          {
            setHandHandler()
            setIsOpen(false)

            }} >
            go
          </Button>}
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default StartDialog