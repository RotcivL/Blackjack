import { React, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const StartDialog=({startHandler})=>{

const [isOpen, setIsOpen] =useState(true);




  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={()=>{setIsOpen(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Welcome mate!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is the frond end part of our black jack Dapp, the current 
            version can perfrom deal cards and control all player's hit or 
            stay for simulation purpose (In the completed version, current user should only have his/her own 
            hit and stay button.) The timer function is also implemented for allowing players to decide within 15 second.
            Lastly, the hit or stay function for dealer cannot not be implemented prior contract development.   
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>
          {startHandler()
          setIsOpen(false)}} autoFocus>
            START
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default StartDialog