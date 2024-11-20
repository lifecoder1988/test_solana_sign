const express = require("express");
const fs = require("node:fs")
const { Keypair, Connection ,Transaction} = require("@solana/web3.js");

const app = express();
app.use(express.json());

// Signer2's private key (securely stored on the server)

const keypairData = JSON.parse(fs.readFileSync("./server_account.json", "utf8"));

const signer2 = Keypair.fromSecretKey(
  Uint8Array.from(keypairData)
);

// Solana connection
const connection = new Connection("https://api.devnet.solana.com");

app.post("/sign", async (req, res) => {
  try {
    const { transaction } = req.body;

    // Decode the partially signed transaction
    const tx = Transaction.from(Buffer.from(transaction, "base64"));

    // Sign the transaction with signer2
    tx.partialSign(signer2);

    // Send the transaction to the Solana network
    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    console.log("Transaction Signature:", signature);
    res.json({ signature });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
