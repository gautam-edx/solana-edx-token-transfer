import * as splToken from "@solana/spl-token";
import { web3, Wallet } from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import * as Web3 from '@solana/web3.js';



export async function transfer(tokenMintAddress: string, to: string, amount: number) {
  
  const connection = new web3.Connection("https://api.devnet.solana.com");
  // @ts-ignore
  const provider = window.phantom.solana;
  const resp = await provider.request({ method: "connect" });
  let publicKey  =  new web3.PublicKey(resp.publicKey.toString());
  let mintAddress  =  new web3.PublicKey(tokenMintAddress.toString());
  const destPublicKey = new web3.PublicKey(to.toString());
  const mintPublicKey = new web3.PublicKey(tokenMintAddress);  
  const {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} = splToken;





  const instructions: web3.TransactionInstruction[] = [];  


  const associatedTokenFrom = await splToken.getAssociatedTokenAddress(
    mintAddress,
    publicKey
  );
  const fromAccount = await splToken.getAccount(connection, associatedTokenFrom);
  const associatedTokenTo = await splToken.getAssociatedTokenAddress(
    mintAddress,
    destPublicKey
  );
  if (!(await connection.getAccountInfo(associatedTokenTo))) {
    instructions.push(
      splToken.createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenTo,
        destPublicKey,
        mintAddress
      )
    );
  }
  instructions.push(
    splToken.createTransferInstruction(
      fromAccount.address, // source
      associatedTokenTo, // dest
      publicKey,
      amount // transfer 1 USDC, USDC on solana devnet has 6 decimal
    )
  );

  const transaction = new Transaction().add(...instructions);
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;


  let transactionSignature = await provider.signAndSendTransaction(transaction);
  console.log(transactionSignature.signature)
  console.log(await connection.getTransaction(transactionSignature.signature))

}