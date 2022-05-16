import { React, useState, useEffect } from 'react';

const Chips=({bet})=>{
    const [chipsImage,setChipsImage]=useState(null)

useEffect(()=>{
    const fetchChipImage= async () => {
        try{
                const res= await import(`../cards/${value}-${type}.png`)
                setChipsImage(res.default) 
            
            
        }catch(err){
            setError("can't find such chip")
        }

    }
    fetchChipImage()
},[bet])



return (
    <div>
        {chipsImage}
    </div>

)


}
export default Chips 
