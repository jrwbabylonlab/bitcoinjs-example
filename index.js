const ecc = require('@bitcoin-js/tiny-secp256k1-asmjs');
const bitcoin = require('bitcoinjs-lib');
const ECPair = require('ecpair');

bitcoin.initEccLib(ecc);
const ec = ECPair.ECPairFactory(ecc);

const createPsbt = (utxo, publicKeyNoCoord) => {
  const network = bitcoin.networks.bitcoin;
  const psbt = new bitcoin.Psbt({ network });

  psbt.setVersion(2);

  psbt.addInput({
    hash: utxo.txid,
    index: utxo.vout,
    sequence: 0xffffffff,
    witnessUtxo: {
      script: Buffer.from(utxo.scriptPubKey, 'hex'),
      value: utxo.value
    },
    tapInternalKey: Buffer.from(publicKeyNoCoord, "hex"),
    sequence: 0xfffffffd,
    sighashType: bitcoin.Transaction.SIGHASH_DEFAULT
  });

  // add output
  psbt.addOutput({
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    value: utxo.value
  });
  return psbt;
}

const utxoExample = {
  txid: 'af249aacb475fa0706ed2b4c3b3431ad63ce341cc48043ee58b2fbe088b07582',
  vout: 4,
  scriptPubKey: '00143a0c7d4f2d25d576a7e6035544638f3fb7e34c1b',
  value: 2307027
};

const generatePublicKeyNoCoord = () => {
  const keyPair = ec.makeRandom({ network: this.network });
    const { privateKey, publicKey } = keyPair;
    if (!privateKey || !publicKey) {
      throw new Error("Failed to generate random key pair");
    }
    let pk = publicKey.toString("hex");
    return pk.slice(2);
};

// main to run the program

const publicKeyNoCoord = generatePublicKeyNoCoord();

const psbt = createPsbt(utxoExample, publicKeyNoCoord);
// The signhashType shall be 0 (bitcoin.Transaction.SIGHASH_DEFAULT)
console.log(psbt.data.inputsp[0].sighashType);