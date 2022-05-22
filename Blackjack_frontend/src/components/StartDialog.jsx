import { React, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getDealer } from '../Web3Client';


const StartDialog=({startHandler,initializeContract,dealer,getDealerHandler,joinGameHandler})=>{

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
          {"Welcome"}
        </DialogTitle>
        <DialogContent>
          {dealer!==null?
          (<DialogContentText id="alert-dialog-description">
            {`This game is deployed by ${dealer}`}
          </DialogContentText>):(<DialogContentText id="alert-dialog-description">
              {"No dealer, please initialize the contract!"}
          </DialogContentText>)}
          
        <TextField
          id="outlined-number"
          label="bet"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>
          {
            //startHandler()

            initializeContract()
            }} autoFocus>
            Deploy
          </Button>
          <Button onClick={()=>
          {
            //startHandler()
            getDealerHandler()
           
          }} autoFocus>
           next
          </Button>
          <Button onClick={()=>
          {
            joinGameHandler()
           
            }} autoFocus>
            join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default StartDialog