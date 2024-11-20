import * as anchor from "@coral-xyz/anchor";
import { Transaction, PublicKey, Keypair, Connection } from "@solana/web3.js";
import * as fs from 'node:fs';

import BN from "bn.js";

import idl from "./idl.json" assert { type: "json" };

console.log(idl);
async function clientWorkflow() {
  const connection = new Connection("https://api.devnet.solana.com");

  const programId = new PublicKey(
    "5tBeqTQRrMqnPX8QKSYmmdVKUBHufgAVe5h62dWcsHKd"
  );

  console.log(programId);



  const keypairData = JSON.parse(fs.readFileSync("./new_account.json", "utf8"));

  const newAccount = Keypair.fromSecretKey(
    Uint8Array.from(keypairData)
  );

  console.log("New Account Public Key:", newAccount.publicKey.toString());


  const wallet = new anchor.Wallet(newAccount);

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  console.log("AAA")

  const program = new anchor.Program(idl, programId,provider);

  // Create the new account and prepare signer1

  const signer2 = provider.wallet.payer; // Use the connected wallet

  // Derive signer2's public key (server-side key)
  const signer1PublicKey = new anchor.web3.PublicKey(
    "9FtjUoc91HTyBCE9RfJt5gP6uoC9VPrxDe66SwuCdsnk"
  );

  // Create the transaction

  const tx = await program.methods
    .initialize(new BN(42)) // Initial value
    .accounts({
      newAccount: newAccount.publicKey,
      signer1: signer1PublicKey,
      signer2: signer2.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .transaction();

  // Set the fee-payer and blockhash
  tx.feePayer = signer1PublicKey;
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;

  // Partially sign the transaction with signer1 and the new account
  tx.partialSign(newAccount);
  //await provider.wallet.signTransaction(tx); // Sign with signer1's wallet

  // Send the partially signed transaction to the server

  const response = await fetch("http://localhost:3000/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: tx.serialize({requireAllSignatures: false}).toString("base64") }),
  });

  const result = await response.json();
  console.log("Transaction Signature:", result.signature);
}

clientWorkflow().catch(console.error);
