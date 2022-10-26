---
title: Jenny from the blockchain
date: 2016-04-04 00:00:00 Z
categories:
- jhill
- Tech
tags:
- Bitcoin
- Cryptocurrency
- Altcoin
- Blockchain
- Scottcoin
author: jhill
layout: default_post
title-short: Jenny from the blockchain
summary: Over the past several years there has been a lot of talk about cryptocurrencies, such as bitcoin, and the blockchain technology that underpins them. However it can be difficult to understand how the blockchain actually works in practice, and why it is such a clever method for currency exchange. Two of our graduates are currently developing our own cryptocurrency for use within Scott Logic, as an attempt to better understand the practical uses of the blockchain. In this blog post, we aim to explain the inner workings of the blockchain and help people to understand how it manages to keep transactions both secure and anonymous. This post will go into the low level algorithms of blockchain and provide verified examples alongside each algorithm; this post is not for the faint of heart!
---

Over the past several years there has been a lot of talk about cryptocurrencies, such as bitcoin, and the blockchain technology that underpins them. However it can be difficult to understand how the blockchain actually works in practice, and why it is such a clever method for currency exchange. Two of our graduates are currently developing our own cryptocurrency for use within Scott Logic, as an attempt to better understand the practical uses of the blockchain. In this blog post, we aim to explain the inner workings of the blockchain and help people to understand how it manages to keep transactions both secure and anonymous. This post will go into the low level algorithms of blockchain and provide verified examples alongside each algorithm; this post is not for the faint of heart!

Bitcoin is just one implementation of the blockchain. While all cryptocurrencies are based on the blockchain algorithms, there are subtle differences between the implementations. To illustrate the differences here is a contrast between bitcoin and litecoin; The first is that litecoin aims to mine a block every 2.5 minutes, as opposed to bitcoins 10 minute processing rate. This speeds up the time it takes for a transaction to be confirmed in the network, providing protection to users against certain kinds of attack/mistake (such as double spending). A second difference is the inclusion of [scrypt](https://en.wikipedia.org/wiki/Scrypt) in the proof-of-work algorithm, a memory intensive function compared to bitcoin's [sha256](https://en.wikipedia.org/wiki/SHA-2). This makes it much harder to parallelise the mining of litecoins. Litecoin supports mining of up to 84 million litecoins, four times as many as bitcoin provides.

In this post we will focus our explanations on the inner works of bitcoin, since all other cryptocurrencies share similar implementations. During our time constructing our own bitcoin network, we spent a lot of time researching exactly how bitcoin works, and so included in this blog is a selection of the core algorithms with step by step examples. We hope to help other people wanting to learn about bitcoin by assembling the information they need into a single source. We did this, so you don't have to share in the difficulty of traversing the web looking for clues as to how the system works. The language of this blog is aimed at people who have a basic understanding of computer science, and will go into some detail with how these algorithms work and some of the data structures are made. For anyone wanting to write their own code, we have included worked examples which can serve as test data for your algorithms.

## Where's your header at?

Let us first go through some common terminology which is useful to know when reading into bitcoin and should help everything make a little more sense:

* An address is a hash of a public key, which is used as a destination to send bitcoins. A participant in the network often owns multiple addresses.
* A transaction is an exchange of bitcoins encoded into a block
* A block is a collection of transactions and other information. It includes the hash of the previous block and this forms a chain of blocks. Below is a diagram of a block and its contents
* A node is a server that is able to relay information between other peers in the network
* A miner is someone who works to find the hash of the next block

<img src="{{ site.baseurl }}/jhill/assets/blockchain_connection_between_block_headers.png" alt="connections between blocks in the blockchain" title="connections between blocks in the blockchain"/>

The blockchain, as the name suggests, is a chain of individual blocks, where each block consists of a header and a body. The main body is a list of all transactions which occurred between the creation of a given block, and its predecessor in the chain. The header of a block contains identification information used to prove the authenticity of both the block and the transactions contained. Blocks are being added to the chain all the time at an average rate of one every ten minutes. Each time a block is created, whoever created it is paid a reward, currently standing at 25BTC (10809 USD). So what is stopping everyone from minting money? Well firstly everyone in the bitcoin network (5000 major registered nodes) are racing each other to mine the next block. Secondly, in order to claim a block, you need to solve a very difficult maths problem, known as the proof of work (more on this later). This problem would take an individual miner working on an average spec PC thousands (if not millions) of years to compute. Before we explain how the maths puzzle is solved, we need to know what the six fields which comprise the header are, how they relate to the rest of the block and how they are used to create the block hash.

    variable   | bytes |  description
               |       |
    version    |  4    |  version of the bitcoin protocol used to create the block
    prevHash   |  32   |  hash of the previous block
    merkleRoot |  32   |  root of a sha256 hash tree where the leaves are transactions
    time       |  4    |  time of block creation in seconds since 1970-01-01T00:00 UTC
    bits       |  4    |  difficulty of block hash in compressed form
    nonce      |  4    |  field used in mining

The order in which bytes are stored (most to least significant or vice versa) is referred to as big or [little](https://en.wikipedia.org/wiki/Endianness) endian notation. Each value in the header is stored in big endian, specified by the official bitcoind node implementation documentation. When they are used in the block hash calculation they are converted to little endian hexadecimal encoding. Below we take the same sample header components and construct a block hash from them.

    1. Determine block header components;
    
      version    = 1
      prevHash   = 02c1fe8644d8558cf354a074ad19f6a39c385764ee84084e28febec38ab861ab
      merkleRoot = 672bf003ed02a6d8eb76f9bf24c8497d63f0a7698ca33decb923494ca5ac02d9
      timestamp  = 1231006505
      bits       = 486604799
      nonce      = 2083236893
    
    
    2. Convert the components to hexadecimal little endian;
    
      version    = 01000000
      prevHash   = ab61b88ac3befe284e0884ee6457389ca3f619ad74a054f38c55d84486fec102
      merkleRoot = d902aca54c4923b9ec3da38c69a7f0637d49c824bff976ebd8a602ed03f02b67
      time       = 29ab5f49
      bits       = ffff001d
      nonce      = 1eac2b7c
    
    
    3. Concatenate block header from components into a single hex string;
    
      01000000ab61b88ac3befe284e0884ee6457389ca3f619ad74a054f38c55d84486fec102d902aca54c4
      923b9ec3da38c69a7f0637d49c824bff976ebd8a602ed03f02b6729ab5f49ffff001d1eac2b7c
    
    
    4. Perform sha256 on raw hex to find first hash;
    
      1eeab40993721c73fc8e0a4050ae8a3fbf8e57aacd5115637f13c3dacd67007f
    
    
    5. Perform sha256 on first hash to find second (and final) hash;
    
      fdb4085e02a63586bf27fd3a9b7138bbf82ce390344edbbb6ccc4a534423b351
    
    
    6. Return in little endian form for storage in block;
    
      51b32344534acc6cbbdb4e3490e32cf8bb38719b3afd27bf8635a6025e08b4fd

Now we know how a block hash is made let's look at how difficult it is to solve the block maths puzzle we mentioned earlier. The problem users need to solve involves producing the 32 byte hash that, when interpreted as a decimal number, is smaller than a predefined number (the difficulty). The official bitcoind node has a very simple mining algorithm, where it repeatedly increments the nonce and calculates the hash until a valid hash is found. Due to the entropy of sha256, it is very difficult (nigh impossible) to formulate an efficient algorithm to calculate this. Optimisations do exist however, but they still run in exponential time.

In calculating a valid block hash, the sha256 hash step takes more computing power than any other (appending header bytes / verifying a hash / calculating the merkle root). Hashing power is used to describe how many times a block hash can be calculated and checked. The hashing power of the bitcoin network has grown substantially over the past few years. This is attributed to an increase in the size of the network and improvements in hardware, such as introduction of ASICs (hardware specially designed to perform SHA256 hashes for bitcoin mining). As of December 31st. the hashing power of the network stood at around 745,000 THs-1 (745,000,000,000,000,000 hashes every second).

We mentioned the term proof of work earlier. This is the first valid hash of a block found by bitcoin miners and broadcast to other peers on the network. Whoever calculates this hash first gets the 25BTC reward, and once the hash and nonce used to find it is shared on the network, it can very quickly be verified. The difficulty of mining has grown proportionally with the hashing power of the network, to ensure that the amount of coins in circulation does not grow too quickly. Every 2016 blocks, bitcoin calculates a new difficulty (adjusts the current difficulty slightly). There is a total limit of 21 million bitcoins that can ever be mined, but by increasing the difficulty to maintain a constant mining rate, this limit should not be reached until the year 2140.

Proof of work involves creating a valid hash of a block that can be quickly verified by other users on the network to prove that you, as a miner, have put time into calculating the nonce. The `nonce` is the pseudo-random number that is a component of a block hash. A valid hash exists only if the numerical interpretation of the hash (as a 256-bit number) is smaller than a predetermined difficulty. The hash must be smaller than the difficulty in order to be accepted into the blockchain.

Verifying the block hash is very simple and quick to do, shown below is a hash from the blockchain which has been accepted. Also included is the value of bits from the block header. The bits are passed into a simple formula in order to generate a number, which the block hash is compared to. If the hash is smaller, the block is accepted, if the hash is not smaller, the hash is invalid. Here is a worked example with values taken from the live bitcoin blockchain.

    1. Take a hash to check and a value of bits to compare it to;
    
      hash   = 0000000000000000033d76d1979cbf908abbd9e94a5a7a84aedc51dd3aa0d022
      bits   = 1806b99f
    
    
    2. Take the first byte from the bits value to use as an exponent and the remaining
       bytes as the mantissa;
    
      exponent   = 18
      mantissa   = 06b99f
    
    
    3. Plug the values into a formula to create the target;
    
      target = (0x)mantissa * 2^( 8 * ( (0x) exponent - 3 ))
      target = 0x06b99f * 2^( 8 * ( 0x18 - 3 ))
      target = 000000000000000006b99f000000000000000000000000000000000000000000
      
      N.B. exponent-3 is the number of bytes to the right of the mantissa
    
      
    4. Is the hash smaller or equal to the difficulty?
    
      hash   = 0000000000000000033d76d1979cbf908abbd9e94a5a7a84aedc51dd3aa0d022
      target = 000000000000000006b99f000000000000000000000000000000000000000000
    
      hash < target --> hash is valid.

Looking at the same data as in the block generation example, here is the nonce and the resulting block hash. We have changed the difficulty, for the purposes of the demonstration, to be much lower than the actual bitcoin value. This will allow us to accept a larger number of valid hashes.

    nonce       | 2083236893
    blockhash   | 51b32344534acc6cbbdb4e3490e32cf8bb38719b3afd27bf8635a6025e08b4fd

If the nonce is only slightly different, as seen below, then this completely changes the resulting hash value. This shows how it is virtually impossible to guess what value the nonce may be, and why brute force (possibly with negligible optimisations) is the only method of mining bitcoins. The same goes for any other data involved in the block hash. Changing any transaction data (resultantly changing the merkle root) would result in a completely invalid block hash, thus showing the inherent security in the blockchain.

    nonce        | 2083236894
    block hash   | 2298ab2601f17e1c61c4ca7476f91d562ed436c50ef22687bc8425fddb9b7b75

With the difficulty of the proof of work being so high, it is very rare for a single miner to work alone. Most mining is done by mining pools, which are effectively syndicates of miners. These pools usually work on a "divide and conquer" technique, mining different ranges of possible values to reduce the time in which a valid hash is found. The number of calculations done is stored by each member of these pools, and this is how their share of the reward is calculated. The reward is paid to the pool owner in the standard reward transaction, and every month (or however often) a transaction is made to pay miners for their share of work. The reward transaction is the very first transaction in a block and is added by miners when they attempt to calculate the nonce. Since the reward is in the form of minted coins, this transaction has no inputs.

We've described how difficult it is to mine blocks but some among you may be thinking: "With a 4 byte nonce there are only 4.3x10^9 values to check and a network with a hash rate of 7.5x10^16 hashes per second, surely blocks will be found very quickly?". You would be correct!

It is possible to have a header where no matter what the value of the nonce is, there will not be a valid block hash. Miners calculate every valid value for the four byte nonce, until they either find a valid block hash, or there are no more values for the nonce they can try. The miner now knows that any value they choose for the nonce will not create a valid block hash; something else in the header must be changed to produce a valid hash.

There are two common values changed in the header when the nonce has been exhausted. They are the timestamp and the extra nonce. The timestamp can be updated by a few milliseconds, creating a whole new combination of hashes which can be produced when the nonce is altered. Transactions within the block, identified by hashes of their contents, combine to produce the merkle root, another item in the header which can be altered. Adding an input to the reward transaction is another popular way of changing items in the header. The reward transaction has no inputs, and so including a dummy input will adjust the hash of the reward transaction and this change will alter the value of the merkle root. The dummy input information included in the reward transaction is called the extra nonce.

##Let the Body(s) Hit the Floor

The body of a block consists of all transactions which occurred between two given blocks. Every transaction has an associated hash, where the hash is comprised of key transaction information passed into a sha256 hash function. Transactions contain a set of inputs and outputs. Outputs are the addresses to which a transaction's bitcoins are sent.

Outputs have two main fields; the amount to send and the script. When an output is created, the recipient of the bitcoins provides an address to which the bitcoins will be sent. This address is derived from a public key owned by the recipient, which in turn is derived from a private key that only the recipient has access to. Output scripts are effectively finite state machines which will process the signature, found in a transaction input, as an input for the machine. Several types of common script exist, each type includes different requirements which must be met in order to spend the coins located at an address. Pay-to-PubKeyHash is the most common form of script for an output. It only allows the owner of an address to spend the bitcoins located there and is comprised of the following concatenation;

    OP_DUP    OP_HASH160    <address/pubKeyHash>    OP_EQUALVERIFY    OP_CHECKSIG

Inputs are references to the outputs of other transactions. They identify an output by providing the transaction hash and index of the output the spender wishes to redeem. The script of this output is treated like a finite state machine. The input scripts are passed into the finite state machine as values and executed in order to prove the spender owns the right to spend the bitcoins. The input script for a Pay-to-PubKeyHash (output script) is the following concatenation;

    <sig>    <pubKey>

The pubKey value is the public key used to make the address of the spenders bitcoins. The "sig" field is a signature created from the sender's private key which proves they are the person who owns the address/public key. Exactly how the keys are generated and redeemed is a tricky process using ECDSA (and the bitcoin curve secp256k1) and would make this blog post even longer! So we think it's best saved for a later date. A walkthrough of the basic signing algorithm for ECDSA can be found on [Wikipedia](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm). The essence of the signing process is as follows; that a transaction is constructed, identifying values of the transaction are selected, the values collected are concatenated into a byte sequence, the byte sequence is then signed using the senders private key with ecdsa using the secp256k1 curve. 

    variable                | bytes |  description
                            |       |
    nVersion                |  4    |  protocol version used to construct tx
    inputCount              |  1    |  number of tx inputs
    input[]prevHash         |  32   |  hash corresponding to the hash of the tx 
                                    |  containing output being spent
    input[]index            |  4    |  index of an output to-be-used transaction
    input[]scriptSigLen     |  1    |  index of the output in the tx being spent
    input[]scriptSig        |  -    |  signature and private key proving ownership of 
                                    |  address being spent
    input[]sequence         |  4    |  ignored and set to ffffffff unless blockLockTime is 
                                    |  used. Allows for various forms of a tx to be 
                                    |  submitted
    outputCount             |  1    |  number of tx outputs
    output[]value           |  8    |  the amount in satoshi to be spent
    output[]scriptPubKeyLen |  1    |  length of the PubKeyScript
    output[]scriptPubKey    |  -    |  script containing instructions which must be met in
                                    |  order to spend bitcoins at this output
    blockLockTime           |  4    |  number of txs which must exist before this tx can be 
                                    |  spent

So let's work through creating a transaction. First we will look at how you create outputs and then how you take an output and sign it as an input. We have a scenario where Angelina owes Brad 20 satoshi (1 BTC = 100,000,000 satoshi - named after the creator of bitcoin). From past transactions Angelina has a collection of bitcoin addresses where her money is located, for each address she has the corresponding private key kept somewhere safe.

    17pA4nZbtivWZVkkaEUEGjLT5DVnH5Gbr1							8 satoshi
    17vKrNtHoNR5BKtvBuVPhFfjdu5gFQJaFA							4 satoshi
    1Q5oGFD2PwAnkHZxx9Fbas5fvucU3c523u							6 satoshi
    1EVUprVsqL1Hw7Uj4DhCUAPhSLQ6Hhbfrx							7 satoshi
    ---------------------------------------------------------------------------------------
    Total											25 satoshi

We can see that Angelina has more than 20 satoshi in her wallet in total, but no single address which holds exactly 20 satoshi. What she must do here is pick some addresses totalling 20 or more satoshi which we can spend in this transaction. They will be sent to two outputs; one is to an address Brad has provided her, the other is to a new address she will make (for her change). Here we have the two new addresses they made.

    1LU8w6o1xF6qxgG72g2CPsq49muH7EqDNE					Brad's provided address
    1KWtwinyjbexk3BrU695ByGWbJYhNLN2bZ					Angelina's change address
    
    Here are the addresses which Angelina has chosen to use in this transaction.
    
    17pA4nZbtivWZVkkaEUEGjLT5DVnH5Gbr1							8 satoshi
    1Q5oGFD2PwAnkHZxx9Fbas5fvucU3c523u							6 satoshi
    1EVUprVsqL1Hw7Uj4DhCUAPhSLQ6Hhbfrx							7 satoshi
    ---------------------------------------------------------------------------------------
    Total											21 satoshi

Angelina now calculates the pubKeyScript from the address above (using the form Pay-to-PubKeyHash mentioned above and copied below for ease of reading) and, along with the value to be sent to each address, creates the output objects. Below shows how Brad's address is converted into a pubKeyScript. Addresses are stored in a variant of [base58](https://en.wikipedia.org/wiki/Base58) called [base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding).

    OP_DUP    OP_HASH160    <address/pubKeyHash>    OP_EQUALVERIFY    OP_CHECKSIG
    
    1. Input address (commonly provided in base58Check) to send 20 satoshi to;
    
      1LU8w6o1xF6qxgG72g2CPsq49muH7EqDNE				Brad's provided address
    
    
    2. Address reformatted to hexadecimal from bitcoin's modified base58check string;
    
      00 d58c3e279b8431d6e61b64b414a5b39ee93d638d d683a38f
    
    
    3. OPCode value are recorded in hexadecimal;
    
      OP_DUP               = 76 (118)                 OP_HASH160           = a9 (169)
      OP_EQUALVERIFY       = 88 (136)                 OP_CHECKSIG          = ac (172)
    
    
    4. The address is separated from the 1 byte version and 4 byte checksum;
    
      d58c3e279b8431d6e61b64b414a5b39ee93d638d 
    
    
    5. The OPCodes are added and a byte is included before the hash to state its length;
    
      76 a9 14 d58c3e279b8431d6e61b64b414a5b39ee93d638d 88 ac
    
    
    6. The concatenated result is the final scriptPubKey;
    
      76a914d58c3e279b8431d6e61b64b414a5b39ee93d638d88ac
    
    
    7. Calculate the length (in bytes where 1 byte = 2 hex characters) of the scriptPubKey 
       and convert it to hexadecimal;
    
      50 characters   ->   25 bytes (dec)   ->   19 bytes (hex)
    
    
    8. Convert the amount to send to this address (20 satoshi) into an eight byte little 
       endian hexadecimal number;
    
      20 (dec)   ->   0000000000000014 (hex)   ->   1400000000000000 (little endian)
    
    
    9. Concatenate into a raw output or keep separated for later use;
    
    satoshi             |  1400000000000000
    scriptLength        |  19
    scriptPubKey        |  76a914d58c3e279b8431d6e61b64b414a5b39ee93d638d88ac
    
    raw                 |  14000000000000001976a914d58c3e279b8431d6e61b64b414a5b39ee93d63
                        |  8d88ac

She then starts creating the inputs for this transaction. Initially, inputs only have three of the five values found in every input; prevHash, index and sequence. These three identify what bitcoins to spend and in what manner to spend them. Once all inputs have been created like this, identifiers of an input are taken and amended in a byte-stream. For each input in turn, the corresponding scriptPubKey from the output is signed along with the identifier byte stream. This produces a set of signatures which validate the spending of each input's to-be-used output. The signatures are also tied into the transaction through the identifying byte stream and prevent people tampering with the transaction, as this will invalidate the signatures. The process of signing involves some tricky maths and new definitions for adding, doubling and multiplying that are specific to Elliptic Curve Cryptography. I've included a link at the end for more information, but I won't cover this process in details here.

Below is a worked example of what Angelina had to compute in order to redeem bitcoins from her first address (17pA4nZbtivWZVkkaEUEGjLT5DVnH5Gbr1). She takes the scriptPubKey referenced in the input in order to create the script to redeem the bitcoins at this address.

    1. Locate the existing scriptPubKey;
    
      76a9144abbdf494156759c3bbf13718efad0c0c68e429088ac
    
    
    2. Split the scriptPubKey into the OPCodes and address;
    
      OP_DUP OP_HASH160 76a9144abbdf494156759c3bbf13718efad0c0c68e429088ac OP_EQUALVERIFY OP_CHECKSIG
    
    
    3. Find the public key corresponding to this address;
    
      02b9d9c6b95f29709562dc8b285ca5951f718d904b61c17a60f4f6cd65bf8aa628
      
    
    4. In this case the script used to redeem these bitcoins requires a public key, which
       when converted to an address, is equal to the script address. A signature for
       the public key is created using the private key. It is an ECDSA signature
       formatted with DER and will be used to verify ownership of the public key provided.
       The script structure is as follows;
    
      48                         |  Length of signature
      30                         |  Byte marking start of header structure
      45                         |  Length of header
      02                         |  Byte marking integer object
      21                         |  Length of R component of signature
      00b9fe0b1b099e3a9e942f49   |  R component of signature
        6b50b56ef6830752d233e5   |  
        2132a92353cc6436108e     |  
      02                         |  Byte marking integer object
      20                         |  Length of S component of signature
      3c03771ed6501a8ac2376089   |  S component of signature
        3ebac7193754fe329ce783   |  
        7086ee562528463a16       |  
      01                         |  ?
      21                         |  Length of public key
      02b9d9c6b95f29709562dc8b   |  Compressed public key (found above)
        285ca5951f718d904b61c1   |  
        7a60f4f6cd65bf8aa628     |  

Angelina now takes all the inputs and outputs and puts them into the order below. She needs to calculate or state a few extra values for the bitcoin protocol to accept this transaction.

    version          (le) |  01000000
    inputCount            |  03
    [1]prevHash      (le) |  76187db8c360fdbc054c42bec9dd390dce33ac6d9e8f8a321179fd3ce3a9
                          |  1dd4
    [1]prevIndex     (le) |  00000000
    [1]scriptLength       |  6b
    [1]scriptSig          |  483045022100b9fe0b1b099e3a9e942f496b50b56ef6830752d233e52132
                          |  a92353cc6436108e02203c03771ed6501a8ac23760893ebac7193754fe32
                          |  9ce7837086ee562528463a16012102b9d9c6b95f29709562dc8b285ca595
                          |  1f718d904b61c17a60f4f6cd65bf8aa628
    [1]sequence      (le) |  ffffffff
    [2]prevHash      (le) |  98c02933a347040d5f6e374a7aa72a42c690ec8490eafb1d9c5aac91c6ff
                          |  ed59
    [2]prevIndex     (le) |  00000000
    [2]scriptLength       |  6a
    [2]scriptSig          |  4730440220219f9275abe4887b4b86a1dd20e1cd252e181e660ad79debd7
                          |  f4ea41895c9c7202206b8a997918124e36864b68e35457166a662ca82cc9
                          |  c065b111c3c5dbcfc949b50121036406e0b5c3dc6e30f8cb650637591278
                          |  417e32f9a2d3667566a69f661a773a45
    [2]sequence      (le) |  ffffffff
    [3]prevHash      (le) |  c4fd8b4c5d9a793e1ca654a81514c197335c5f00b3e864b3bb69a5eef4ca
                          |  13a0
    [3]prevIndex     (le) |  00000000
    [3]scriptLength       |  64
    [3]scriptSig          |  473044022074262cdfe36ec86b329aba348e04ec8dceb1ae27e31923c6a5
                          |  f92f5032d427c1022035909dd1780e61fe656c4d6d73d5d06574ccb47948
                          |  d46cb78619fbb5f1ec3bad0121021be9fcb54b056252bba241f9a7b950a7
                          |  1a96b9d63b29fa7e91e0f9974fa51f6a
    [3]sequence      (le) |  ffffffff
    outputCount           |  02
    [1]satoshi       (le) |  1400000000000000
    [1]scriptLength       |  19
    [1]scriptPubKey       |  76a914d58c3e279b8431d6e61b64b414a5b39ee93d638d88ac
    [2]satoshi       (le) |  0100000000000000
    [2]scriptLength       |  19
    [2]scriptPubKey       |  76a914cb19afed52e12daaf83fd503aa214209921ee07288ac
    blockLockTime    (le) |  00000000

When looking at the transaction structure above you can notice several of the values have their bytes inverted into little endian form. Where a value is stored in little endian I have annotated the field (le). All of these bytes are concatenated before being passed into a SHA256 function for two rounds of hashing. This produces the final transaction hash which can be used as a reference by other inputs at a later time.

    1. Concatenated transaction;
    
      010000000376187db8c360fdbc054c42bec9dd390dce33ac6d9e8f8a321179fd3ce3a91dd4000000006b
      483045022100b9fe0b1b099e3a9e942f496b50b56ef6830752d233e52132a92353cc6436108e02203c03
      771ed6501a8ac23760893ebac7193754fe329ce7837086ee562528463a16012102b9d9c6b95f29709562
      dc8b285ca5951f718d904b61c17a60f4f6cd65bf8aa628ffffffff98c02933a347040d5f6e374a7aa72a
      42c690ec8490eafb1d9c5aac91c6ffed59000000006a4730440220219f9275abe4887b4b86a1dd20e1cd
      252e181e660ad79debd7f4ea41895c9c7202206b8a997918124e36864b68e35457166a662ca82cc9c065
      b111c3c5dbcfc949b50121036406e0b5c3dc6e30f8cb650637591278417e32f9a2d3667566a69f661a77
      3a45ffffffffc4fd8b4c5d9a793e1ca654a81514c197335c5f00b3e864b3bb69a5eef4ca13a000000000
      6a473044022074262cdfe36ec86b329aba348e04ec8dceb1ae27e31923c6a5f92f5032d427c102203590
      9dd1780e61fe656c4d6d73d5d06574ccb47948d46cb78619fbb5f1ec3bad0121021be9fcb54b056252bb
      a241f9a7b950a71a96b9d63b29fa7e91e0f9974fa51f6affffffff0214000000000000001976a914d58c
      3e279b8431d6e61b64b414a5b39ee93d638d88ac01000000000000001976a914cb19afed52e12daaf83f
      d503aa214209921ee07288ac00000000
    
    
    2. First hash result;
    
      4198263063942af5c0931808de30532005cdbaa0bb9d6c59e01611691429166b
    
    
    3. Second hash result (final tx hash);
    
      d246963f71bbc26ab1c75c5911344cb7a2daafc8291756851ebbc627ab738166

When a new block is being mined, the transactions it will contain have been locked in. The transactions are laid out and hashed together in pairs to create a new SHA256 hash. This is recursively done until a single hash remains; the merkle root. Below is a diagram showing how the hashes are made on each level of recursion. On any given level, there may not be an even number of hashes, if this is the case the last hash to be processed is hashed with itself.

*(Angela) Merkle Root Diagram*

<img src="{{ site.baseurl }}/jhill/assets/blockchain_merkle_root_comparison.png" alt="merkle root composition" title="merkleroot composition"/>

##In the End (ian)

So far we've explained what actually goes into a bitcoin transaction, and how those transactions are added to the blockchain and verified by miners. We hope this is helpful for anyone trying to understand cryptocurrencies on a lower level. For the next post in this series we'll dive into the security and encryption in bitcoin, focusing on the Elliptical Curve Cryptography (ECC) in signing of transactions, the generation of addresses and other forms of output signature such as Multisig or Escrow scripts.

##Further Reading and a Brief Aside

Below are a few interesting links you might wish to look into. They are relevant to the material of the blog. If you found this blog interesting, I'd suggest reading into the functionality of the Ethereum and Ripple; two currencies recognised as the second generation of cryptocurrency. They benefit from hindsight, being able to avoid mistakes made by the first generation and match the successes. Here is a little information on Ethereum to hopefully whet your whistle.

Ethereum: This currency has evolved from the underlying blockchain algorithms to become more than just a currency. The network itself is effectively a single decentralized virtual machine capable to executing programs contained within transactions. Ethereum is a hybrid network with its currency, Ether, being used as payment for execution of programs. Ethereum also supports smart contracts (buzzword of 2016/17??) which are a payment and program hybrid. Using Ethereum it would be possible to set up standing orders or trust funds which could only be accessed on set dates. This currency has received a large amount of attention recently from major tech companies, such as Microsoft, announcing that they will be implementing Ethereum as a Service on Azure.

[https://blockchain.info/](https://blockchain.info/) - *really nice browser of the blockchain containing all data relating to every block or transaction which has/is on the network*

[https://en.bitcoin.it/wiki/Main_Page](https://en.bitcoin.it/wiki/Main_Page) - *wiki which explains (without going into too much depth) lots of aspects of bitcoin*

[https://bitnodes.21.co/](https://bitnodes.21.co/) - *number of bitcoin nodes currently active*

[https://bitcoinwisdom.com/bitcoin/difficulty](https://bitcoinwisdom.com/bitcoin/difficulty) - *graph illustrating the change in the bitcoin mining difficulty*

[http://www.coindesk.com/new-bitcoin-asic-to-be-most-power-efficient-on-public-market/](http://www.coindesk.com/new-bitcoin-asic-to-be-most-power-efficient-on-public-market/) - *ASIC news article giving a nice overview of ASIC's and what role the play in mining*

[http://bitcoin.stackexchange.com/questions/36634/how-do-i-get-to-the-value-in-the-scriptpubkey-part-of-the-transaction](http://bitcoin.stackexchange.com/questions/36634/how-do-i-get-to-the-value-in-the-scriptpubkey-part-of-the-transaction) - *base58Check encoding description*

[https://www.cryptocompare.com/wallets/guides/how-do-digital-signatures-in-bitcoin-work/](https://www.cryptocompare.com/wallets/guides/how-do-digital-signatures-in-bitcoin-work/) - *detailed explanation of using ECDSA with bitcoin*

[https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses) - *constructing a bitcoin address from a public key*

[http://bitcoin.stackexchange.com/questions/12554/why-the-signature-is-always-65-13232-bytes-long](http://bitcoin.stackexchange.com/questions/12554/why-the-signature-is-always-65-13232-bytes-long) - *format of scriptSig found in the answer of a stack exchange question. An answer with this information but in a simple enough language was difficult, nay impossible to find on the web!*

[http://coinmarketcap.com/currencies/bitcoin/](http://coinmarketcap.com/currencies/bitcoin/) - *bitcoin (and other cryptocurrency) statistics*
