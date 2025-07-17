---
title: What are JWTs/Jots/JSON Web Tokens?
date: 2023-09-19 00:00:00 Z
categories:
- Tech
tags:
- Tech
summary: JSON Web Tokens are a secure way of transmitting information between two
  parties. This article explores what they are, how they are made, the kinds of JWTs
  that are commonly used and their key benefits.
author: colive
image: "/uploads/What%20are%20WebTokens_.png"
layout: default_post
---

## Introduction

JSON Web Tokens, commonly written in shorthand as JWTs and pronounced "Jots",  are encoded JSON objects which can be used to securely transmit information between two parties. The RFC-7519 standard definition is "a compact, URL-safe means of representing claims to be transferred between two parties". JWT.io describes them as "a compact and self-contained way for securely transmitting information between parties as a JSON object". When I first discovered them, I knew them just by the way they looked and little else. When I was first told about a "Jot", this is what I thought of

~~~
	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiQ2hhcmxpZSBPbGl2ZSIsImV4cCI6NDEyOTgzMzYwMCwibXNnIjoiSGVsbG8gd29ybGQhIn0.5oCzt5DZl-2LtKaBkNMz1YFlIu7iLSBU6eSUyqwIGk0
~~~

Random letters, numbers, and always 2 full stops roughly one and two thirds into the string. JWTs (like all encrypted strings) may be ugly to look at, but in conjunction with some standard cryptography they can be very powerful for secure communication.


## Creating a JWT

JSON web tokens are maps of key-value pairs and are separated into 3 parts by full stops ("."). These components are the Header, the Payload and the Signature. The header contains the algorithm that was used to generate the signature for the JWT and what type of JWT the token is (typically in that order). The payload is an map of key value pairs called Claims, and can be visualised as the message of the JWT. Whatever is being conveyed in this token can be found in the payload. Finally the Signature is an encoded string (using a Base46url Encoding algorithm) of the Header and Payload. 

The type of encoding as mentioned before is specified in the Header. This is done separately after the first two sections are encoded. A pseudocode algorithm of this process would look something like this:

~~~
	encodedHeader = base64UrlEncode(header);
	encodedPayload = base64UrlEncode(payload);
	signedEncodedSignature = HMACSHA256((encodedHeader + "." + encodedPayload), secret);

	jwt = encodedHeader + "." + encodedPayload + "." + signedEncodedSignature
~~~

## Claims

Claims can be registered, public or private. Registered claims serve common purposes like expiration time (exp), issuer (iss), subject (sub), and more. Private claims are specific to the application or organisation using the JWT and are not standardised. These are meant for custom data. Public claims are standardised, but they are not mandatory, allowing for extended usage while maintaining compatibility.


| type       | guidance                                                                        | options                                  |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------------------- |
| registered | Not mandatory but recommended                                                   | iss, exp, sub, aud, nbf, iat, jti        |
| public     | Can be anything but should align with the [IANA "JSON Web Token Claims" registry](https://www.iana.org/assignments/jwt/jwt.xhtml) | Anything, but should follow the standard |
| private    | Can be any unregistered claim (use with caution)                                | Anything, exercise caution               | 


Packages that encode JWTs are technically able to generate a JWT with any shape or length Payload as long as it's valid JSON, however it's recommended to use claims that are 3 characters long. As the encoding follows a base64 algorithm the size of the JWT will grow linearly with the size of the content.


## Are you a JWS or a JWE?
Although a JWT's header, payload and signature can each be written essentially in any form that is valid JSON, they typically adhere to the rules of one of two JWT variants. One specialises in authenticity with a signature, one in privacy with encryption.

- A JWS (JSON Web Signature ([RFC-7515](https://datatracker.ietf.org/doc/html/rfc7515))) is a token that contains a digital signature or MAC. They always specify a JOSE (JSON Object Signing and Encryption) header with an "alg" key that defines what algorithm was used to secure the JWS. JWS tokens with no digital signature are used, typically with the "alg" set to "none". 
	- As these tokens are signed they guarantee the data integrity and authenticity that the intended issuer indeed created the token
	- As these tokens are base64 encoded and not encrypted, anyone who can see it can decode it and read the claims in plain text.

- A JWE (Json Web Encryption ([RFC-7516](https://datatracker.ietf.org/doc/html/rfc7516))) is a token that is encrypted. It is the standardised way to represent encoded data. They have 5 sections (including the "ciphertext" containing the encrypted payload) and list in the JOSE header the "enc" key that specifies the encryption algorithm used.
	- These tokens are encrypted and therefore cannot be decoded without a private key. This guarantees privacy in the transmitted information
	- As there is no signature on these tokens it is not confirmed who issued it

It is standard to set the ciphertext of a JWE with the JWS if you wish to ensure both authenticity and privacy in a JWT. Some systems use this technique multiple times over to guarantee the identity of multiple issuers - this is known as JWT chaining.


## Confidentiality and Integrity

JWTs' most effective application is in secure communication. If an issuer (user, server, etc.) sends a request with an attached JWT that is signed with their private key, the recipient can confirm that issuer using it's public key. As with all hashing algorithms, any middle-man hijacking the JWT mid flight, decoding it, adjusting the claims or header and then re-signing it will be evident. The signature will no longer verify with the initial issuer's public key and the recipient can reject the request. 

Earlier I stated the 3 components of the JWT are encoded separately. It is possible therefore for an attacker to simply change the claims and preserve the header and importantly the signature of the JWT. However, as the Signature is an encoded string of the Header and Payload *itself* the recipient will spot the difference and can again reject the request.


## JWT Applications

JSON web tokens are used extensively in Open Banking and a lot of other RESTful services too (for example, you'll be receiving JWTs from Spotify if you want to use their API!). They are frequent in back end systems and understanding them well can help understand any new system you are changing. In a lot of ways they are the metadata of a request, saying when and where something came from, along with lots of other useful information.

To see the logic outlined above I'd recommend visiting [jwt.io](https://jwt.io/) where you can encode and decode your own JWTs in the browser. Example case studies can also be found at the end of the IETF's documentation on JWEs and JWSs.
