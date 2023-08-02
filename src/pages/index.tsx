import { Inter } from 'next/font/google'
import Demo from './components/demo'
import { transfer } from '@/middleware/send1'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  // @ts-ignore
  function onToChange(e){
    setTo(e.target.value)
  }


  // @ts-ignore
  function onAmountChange(e){
    setAmount(e.target.value)
  }

  async function tx(){
    await transfer("p2yd1Cz5xEnkY9sKPQQvHvjMtSUeDqAksyfWKkT8ifY",to, amount * 10**9);
  }


  return (
    <>
    <div>
    <h1>Enter destination address</h1>
    <div>
      <input type="text" name="" id="" onChange={(e) => onToChange(e) }/>
    </div>
    </div>
    <div>
    <h1>Enter Amount</h1>
    <div>
      <input type="Number" name="" id="" onChange={(e) => onAmountChange(e)}/>
    </div>
    </div>
    <button onClick={tx}>Send</button>
    </>
  )
}
