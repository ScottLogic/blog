/*jslint devel: true, bitwise: true, browser: true, white: true,
         nomen: true, plusplus: true, maxerr: 50, maxlen: 100, indent: 4 */

/* 
 * Blake512 Javascript implementation.
 *
 * @author Mark Rhodes
 */

(function() {
    "use strict";

    //Word is a light-weight class to represent a 64 bit binary number..

    //Constructor..
    function Word(high, low) {
        //note: doing "or 0", truncates to 32 bit signed
        //big-endian 2's complement int..
        this._high = high | 0;
        this._low = low | 0;
    }
    //Given another word add it to this one..
    Word.prototype.add = function(oWord) {
        var lowest, lowMid, highMid, highest; //four parts of the whole 64 bit number..

        //need to add the respective parts from each number and the carry if on is present..
        lowest = (this._low & 0XFFFF) + (oWord._low & 0XFFFF);
        lowMid = (this._low >>> 16) + (oWord._low >>> 16) + (lowest >>> 16);
        highMid = (this._high & 0XFFFF) + (oWord._high & 0XFFFF) + (lowMid >>> 16);
        highest = (this._high >>> 16) + (oWord._high >>> 16) + (highMid >>> 16);
        
        //now set the hgih and the low accordingly..
        this._low = (lowMid << 16) | (lowest & 0XFFFF);
        this._high = (highest << 16) | (highMid & 0XFFFF); 

        return this; //for chaining..
    };
    //Shifts this word by the given number of bits (max 32)..
    Word.prototype.shiftLeft = function(bits) {
        var toMoveUp = this._low >>> 32 - bits;
        this._low = this._low << bits;
        this._high = (this._high << bits) | toMoveUp;
        return this; //for chaining..
    };
    //Shifts this word by the given number of bits to the right (max 32)..
    Word.prototype.shiftRight = function(bits) {
        var bitsOff32 = 32 - bits,
            toMoveDown = this._high << bitsOff32 >>> bitsOff32;
        this._high = this._high >>> bits;
        this._low = this._low >>> bits | toMoveDown;
        return this; //for chaining..
    };
    //Rotates the bits of this word round to the left (max 32)..
    Word.prototype.rotateLeft = function(bits) {
        var newHigh;
         if(bits === 32){ //just switch high and low over in this case..
            newHigh = this._low;
            this._low = this._high;
            this._high = newHigh;
        } else {
            newHigh = (this._high << bits) | (this._low >>> (32-bits)); 
            this._low = (this._low << bits) | (this._high >>> (32-bits));
            this._high = newHigh;
        }
        return this; //for chaining..
    };
    //Rotates the bits of this word round to the right (max 32)..
    Word.prototype.rotateRight = function(bits) {
        var newHigh;
        if(bits === 32){ //just switch high and low over in this case..
            newHigh = this._low;
            this._low = this._high;
            this._high = newHigh;
        } else {
            newHigh = (this._low << (32-bits)) | (this._high >>> bits); 
            this._low = (this._high << (32-bits)) | (this._low >>> bits);
            this._high = newHigh;
        }
        return this; //for chaining..
    };
    //Xors this word with the given other..
    Word.prototype.xor = function(oWord) {
        this._high = this._high ^ oWord._high;
        this._low = this._low ^ oWord._low;
        return this; //for chaining..
    };
    //Ands this word with the given other..
    Word.prototype.and = function(oWord) {
        this._high = this._high & oWord._high;
        this._low = this._low & oWord._low;
        return this; //for chaining..
    };
    //Converts this word to a string representing it's encoding as 4 UTF2 16 bit
    //characters..
    Word.prototype.toString = function () {
        var str = "", high = this._high, low = this._low;
        str += String.fromCharCode(high >>> 16);
        str += String.fromCharCode(high << 16 >>> 16);
        str += String.fromCharCode(low >>> 16);
        str += String.fromCharCode(low << 16 >>> 16);
        return str;
    };
    //Creates a deep copy of this Word..
    Word.prototype.clone = function () {
        return new Word(this._high, this._low);
    };
    //Given a string a a starting index, returns a new Word which encodes the
    //four characters starting from index up to index + 3.
    Word.fromChars = function(str, index) {
        var low, high;
        //pairs of UTF2 chars need to be stored as one 32 bit int..
        high = (str.charCodeAt(index) << 16) + str.charCodeAt(index + 1);
        low = (str.charCodeAt(index + 2) << 16) + str.charCodeAt(index + 3);
        return new Word(high, low);
    };

    //Converts the given string treated as a UCS-2 encoded binary sequence
    //to a string of hexidecimal character representing that sequence..  
    function stringToHex(str){
        //Gets the hex encoding of the given character..
        function hexStrForChar(c){
            var hex = c.charCodeAt(0).toString(16).toUpperCase();
            while (hex.length < 4) {
                hex = "0" + hex;
            }
            return hex;
        }
        var hex = "", i , len;
        for(i = 0, len = str.length; i < len; ++i){
            hex += hexStrForChar(str.charAt(i));
        }
        return hex;
    }
    
    //Public..
    window.blake512 = (function () {
        var constants, permutations, initialValues;

        constants = [
            new Word(0X243F6A88, 0X85A308D3),
            new Word(0X13198A2E, 0X03707344),
            new Word(0XA4093822, 0X299F31D0),
            new Word(0X082EFA98, 0XEC4E6C89),
            new Word(0X452821E6, 0X38D01377),
            new Word(0XBE5466CF, 0X34E90C6C),
            new Word(0XC0AC29B7, 0XC97C50DD),
            new Word(0X3F84D5B5, 0XB5470917),
            new Word(0X9216D5D9, 0X8979FB1B),
            new Word(0XD1310BA6, 0X98DFB5AC),
            new Word(0X2FFD72DB, 0XD01ADFB7),
            new Word(0XB8E1AFED, 0X6A267E96),
            new Word(0XBA7C9045, 0XF12C7F99),
            new Word(0X24A19947, 0XB3916CF7),
            new Word(0X0801F2E2, 0X858EFC16),
            new Word(0X636920D8, 0X71574E69)
        ];

        permutations = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
            [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
            [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
            [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
            [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
            [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
            [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
            [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
            [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]
        ];

        initialValues = [
            new Word(0X6A09E667, 0XF3BCC908),
            new Word(0XBB67AE85, 0X84CAA73B),
            new Word(0X3C6EF372, 0XFE94F82B),
            new Word(0XA54FF53A, 0X5F1D36F1),
            new Word(0X510E527F, 0XADE682D1),
            new Word(0X9B05688C, 0X2B3E6C1F),
            new Word(0X1F83D9AB, 0XFB41BD6B),
            new Word(0X5BE0CD19, 0X137E2179)
        ];

        //Obtains the message blocks from the original string message..
        function getMessageBlocks(strMessage) {
            var len, startLength, messageBlocks, words, numBlocks, i, j, L,
                totalCharsSoFar;

            //- phase 1 - pad the message..
    
            //each char is 16 number (surrogate pairs are 2 chars).. 
            len = startLength = strMessage.length; 
            //padding works by adding a 1, then zeros until length is
            //895 % 1024, then adding another 1, then the length of
            //message as a 128 bit binary number..

            //special case that it's just 16 bits short..
            if (len % 64 === 55) {
                strMessage += '\u8001'; //16 bit number with 100...001 i.e. the padding..
            } else {
                //add the first 1, followed by 15 zeros..
                strMessage += '\u8000';
                while (++len % 64 !== 55) { //TODO: could simplify to make it quicker..
                    //then padd with zeros..
                    strMessage += '\u0000';
                }
                strMessage += '\u0001'; //add the final zeros and 1..
            }

            //add 128 bit representation of the original length in bits..
            //note: string.length returns 32 bit unsigned int, so max length
            //      in bits is 2^(32) * 16 = 2^36.
            for (i = 0; i < 4; ++i) {
                //this implementation can't encode anything within this range..
                strMessage += '\u0000';
            }
            strMessage += new Word(0, startLength).shiftLeft(4).toString();

            //- phase 2- break padded message into blocks of 16, 64 bit Words..
            
            messageBlocks = [];
            totalCharsSoFar = 0; //number of chars of padded str message we've encoded so far..
            for (i = 0, numBlocks = strMessage.length/64; i < numBlocks; ++i) {
                //get the words for this block of 16..
                words = [];
                for (j = 0; j < 64; j += 4) {
                    words.push(Word.fromChars(strMessage, totalCharsSoFar + j));
                }
                totalCharsSoFar += 64;

                //L is a counter, which is set to the number of chars of original
                //message encoded up to the end of  the block (see spec for details)..
                L = Math.min(startLength, totalCharsSoFar);
                if (i === numBlocks - 1 && numBlocks > 1 && messageBlocks[i-1].L === L) {
                    //special case occurs when last block doesn't hold any bits
                    //of the original message - therefore no two "L"'s are the same..
                    L = 0;
                }

                //convert length to 128 bit representation, then swap parts round..
                //note: L can not be more that message length and then < 2^36..
                //        shift is because each char is 16 bits..
                L = [new Word(0, L).shiftLeft(4), new Word(0,0)];

                messageBlocks.push({
                    words: words,
                    L: L
                });
            }

            return messageBlocks;
        }

        //The 'G' function from the spec, except that the parameters are
        //changed so as globals are not required..
        //Note: this function returns nothing but alters the given state..
        function g(state, i, blockWords, round) {
            var permutation = permutations[round % 10], twoI = i << 1, 
                perm2i = permutation[twoI], perm2iPlus1 = permutation[twoI+1],
                constP2i = constants[perm2i], constP2iPlus1 =constants[perm2iPlus1] ,
                wordP2i = blockWords[perm2i], wordP2IPlus1 = blockWords[perm2iPlus1],
                a,b,c,d;
                
            a = i % 4;
            if (i < 4) {
                b = a + 4; c = b + 4; d = c + 4; 
            } else {
                b = 4 + ((i+1) % 4);
                c = 8 + ((i+2) % 4);
                d = 12 + ((i+3) % 4);
            }

            state[a].add(state[b]).add(wordP2i.clone().xor(constP2iPlus1));
            state[d].xor(state[a]).rotateRight(32);
            state[c].add(state[d]);
            state[b].xor(state[c]).rotateRight(25);
            state[a].add(state[b]).add(wordP2IPlus1.clone().xor(constP2i));
            state[d].xor(state[a]).rotateRight(16);
            state[c].add(state[d]);
            state[b].xor(state[c]).rotateRight(11);
        }

        //Compresses the single given message block using the given salt, returns the generated hash
        //as an 8 element array of words.  
        //This function is as described in the specification, with 3 phases
        // - initialisation,  rounds then finalisation..
        function compress(chain, blockWords, salt, counter) {
            var state, i, round, newChain;

            //initialise 16 word state..
            state = [];
            for (i = 0; i < 8; ++i) {
                state.push(chain[i].clone());   
            }
            for (i = 0; i < 4; ++i) {
                state.push(salt[i].clone().xor(constants[i]));
            }
            for (i = 4; i < 8; ++i) {
                state.push(counter[i < 6 ? 0 : 1].clone().xor(constants[i]));
            }

            //rounds..
            for (round = 0; round < 16; round++) {
                for (i = 0; i < 8; i++) {
                    g(state, i, blockWords, round); 
                }
            }
            
            //finalise (combines original input and salt with final state)..
            newChain = [];
            for (i = 0; i < 8; i++) {
                newChain.push(chain[i].clone().xor(salt[i%4]).xor(state[i]).xor(state[i+8]));
            }
            return newChain;
        }
        
        //the hashing function - takes the string message to hash which is treated as a binary
        //sequence encoded as UTF-2 characters and an optional salt which, if defined, should be
        //a binary sequence encoded as 16 UTF-2 characters, finally outputHex should be set to
        //get the output as a hex number (encoded as a string), otherwise the output is a string
        //encoded in the same manner as the input..
        return function(string, saltStr, outputHex) {
            var blocks, numBlocks, i, chain, len, block, hash, salt;

            //set the  message up for hashing..
            blocks = getMessageBlocks(string);
            numBlocks = blocks.length;

            //set the salt if not provided and the counter..
            if (!saltStr) {
                // use the default salt...
                salt = [new Word(0,0), new Word(0,0), new Word(0,0), new Word(0,0)];
            } else {
                //assume that salt is a 16 character string..
                salt = []; 
                for(i = 0; i < 16; i+=4){
                     salt.push(Word.fromChars(saltStr, i));
                 }
            }
            
            //set up the initial chain values..
            chain = [];
            for (i = 0, len = initialValues.length; i < len; ++i) {
                chain.push(initialValues[i].clone());
            }

            //each block is done separately..
            for (i = 0; i < numBlocks; ++i) {
                block = blocks[i];
                chain = compress(chain, block.words, salt, block.L);
            }
            
            //convert from array of Words to a string..
            hash = "";
            for(i = 0, len = chain.length; i < len; ++i){
                hash += chain[i].toString();
            }

            return outputHex ? stringToHex(hash) : hash;
        };

    }());  
        
}());

