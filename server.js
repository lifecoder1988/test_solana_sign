const express = require("express");
const { Keypair, Connection ,Transaction} = require("@solana/web3.js");

const app = express();
app.use(express.json());

// Signer2's private key (securely stored on the server)
const signer2 = Keypair.fromSecretKey(
  Uint8Array.from([151,170,186,99,110,234,221,77,219,172,51,228,80,62,191,244,24,239,43,125,233,191,241,123,69,123,196,8,58,177,64,135,122,174,30,233,160,175,180,141,13,16,96,103,7,19,100,149,113,104,23,182,249,249,66,220,80,7,211,232,30,234,128,53])
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
