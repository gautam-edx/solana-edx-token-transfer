import * as splToken from "@solana/spl-token";
import { web3, Wallet } from "@project-serum/anchor";


export async function transfer(tokenMintAddress: string, to: string, amount: number) {
  
  const connection = new web3.Connection("https://api.devnet.solana.com");
  // @ts-ignore
  const provider = window.phantom.solana;


  const resp = await provider.request({ method: "connect" });






  let publicKey  =  new web3.PublicKey(resp.publicKey.toString());
  let mintAddress  =  new web3.PublicKey(tokenMintAddress.toString());
  const destPublicKey = new web3.PublicKey(to);
  const mintPublicKey = new web3.PublicKey(tokenMintAddress);  
  const {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} = splToken



  const fromTokenAccount = await splToken.getAssociatedTokenAddress(
    mintPublicKey,
    publicKey
  )
  

  const toTokenAddress = await splToken.getAssociatedTokenAddress(
    mintPublicKey,
    destPublicKey
  )

  // console.log(toTokenAddress.toString(),"<<<<,,from account")

        
  const instructions: web3.TransactionInstruction[] = [];  

  
  instructions.push(
    splToken.createTransferInstruction(
      new web3.PublicKey(fromTokenAccount),
      new web3.PublicKey(toTokenAddress),
      publicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const transaction = new web3.Transaction().add(...instructions);
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;


  let transactionSignature = await provider.signAndSendTransaction(transaction);


  await connection.confirmTransaction(transactionSignature);
}