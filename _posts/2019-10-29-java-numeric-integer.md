---
title: JVM numeric types - Integer types
date: 2019-10-29 00:00:00 Z
categories:
- Tech
tags:
- Java,
- JVM,
- numbers,
- numerics,
- integers,
- binary,
- featured
author: mamos
layout: default_post
summary: I am constantly amazed at how unfamiliar otherwise competent developers can be with numeric types. In a series of two blog posts I will explain what you need to know to understand the JVM's numeric types. This first installment covers the integer types.
---

I am constantly amazed at how unfamiliar otherwise competent developers can be with numeric types. Without understanding the representation of numbers used by computers, developers cannot anticipate the issues that may arise and avoid them. Working on the JVM brings additional quirks to be careful of too.

Floating point numbers cause the most confusion, but integer types are often not understood either. In **a series of two blog posts** I will explain what you need to know to understand the JVM's numeric types. I'll point out those JVM specific quirks too. 

This **first installment** covers the JVMs **integer types**, the next will cover floating point.

# Integer types

The integer types are types that represent "whole" numbers e.g. `0`, `1` or `1023`, and not e.g. `1.23`. On the JVM all integer types are signed, i.e. they can represent positive and negative numbers e.g. `4` and `-15`.

<p><img src="{{ site.baseurl }}/mamos/assets/line.png" alt="A number line"></p>

## Number systems

There have been many concepts of "number" throughout time and cultures. Things probably started with people making notches in sticks to represent numbers, but more advanced systems evolved. Some more unusual number systems you may have encountered:

| System| Description|
|---|---|
| [Roman numerals](https://en.wikipedia.org/wiki/Roman_numerals) | Often seen on monuments and films to specify dates |
| [Sexagesimal numbers](https://en.wikipedia.org/wiki/Sexagesimal) | Initially used by the Sumerians, this system based on symbols for the numbers 1 to 59, i.e. **base 60**. It still has a legacy on our clocks and the measurement of angles. |

## Decimal numbers

When you are taught to do arithmetic at school, you use the [Arabic-Hindu](https://en.wikipedia.org/wiki/Hindu%E2%80%93Arabic_numeral_system) number system. This system is based on symbols for the numbers `0 to 9`, i.e. **base 10**. It has thrived because we have ten fingers, and because it includes the concept of [zero](https://en.wikipedia.org/wiki/0).
 
 You are taught to think in terms of columns of **units, tens, hundreds, thousands** etc.. This is a positional number system. Units can be any number from `0 to 9`. Tens are worth 10 times the value of the column. Hundreds 10 x 10 times the value. Thousands 10 x 10 x 10 times the value. Each column is worth 10 times the previous one. 

| Thousands | Hundreds | Tens | Units | Total in Decimal                                     |
|:---------:|:--------:|:----:|:-----:|:----------------------------------------------------:|
|          1|         2|     0|      1|(1&nbsp;x&nbsp;1000)&nbsp;+&nbsp;(2&nbsp;x&nbsp;100)&nbsp;+&nbsp;(0&nbsp;x&nbsp;10)&nbsp;+&nbsp;(1&nbsp;x&nbsp;1)&nbsp;=&nbsp;**1201**|

When performing addition, the process can be defined as a series of operations on the columns, from the least significant up to the most significant. First add the units, then add the tens along with any carry over from the units, and repeat the process for the hundreds, thousands etc.

## Binary numbers

Computers are digital electronic systems, based around the bit. A bit can be a `0` or a `1`, so computers use a [binary](https://en.wikipedia.org/wiki/Binary_number) number system, i.e. **base 2**.

It is no more complex than the base 10 system and is simple enough to be covered in [GCSE computing](https://www.aqa.org.uk/subjects/computer-science-and-it/gcse/computer-science-8520/subject-content/fundamentals-of-data-representation).

 Binary numbers are no different from decimals both being positional systems, one using a base of 2 and the other 10. In binary the value in each column can range from `0 to 1`, and each column is worth two times the previous one e.g. **units, twos, fours, eights**.
 
 | Eights | Fours | Twos | Ones | Total in Decimal                             |
 |:------:|:-----:|:----:|:----:|:--------------------------------------------:|
 |       1|      0|     1|     1|(1&nbsp;x&nbsp;8)&nbsp;+&nbsp;(0&nbsp;x&nbsp;4)&nbsp;+&nbsp;(1&nbsp;x&nbsp;2)&nbsp;+&nbsp;(1&nbsp;x&nbsp;1)&nbsp;=&nbsp;**11**|

### Confusion One - Integers don't have a sign bit

The binary number system described so far doesn't include any way to specify a **negative number**. In other languages, e.g. C/C++, there are separate types for signed and unsigned integers. In Java we only have signed types.

How would you represent a signed number?

Most people think the obvious is to use 1 bit to represent the sign e.g.:

| Minus | Fours | Twos | Ones | Total in Decimal                            |
|:-----:|:-----:|:----:|:----:|:-------------------------------------------:|
|      -|      0|     1|     1| -1&nbsp;x&nbsp;((0&nbsp;x&nbsp;4)&nbsp;+&nbsp;(1&nbsp;x&nbsp;2)&nbsp;+&nbsp;(1&nbsp;x&nbsp;1))&nbsp;=&nbsp;**-3**|
|      +|      0|     1|     1| 1&nbsp;x&nbsp;((0&nbsp;x&nbsp;4)&nbsp;+&nbsp;(1&nbsp;x&nbsp;2)&nbsp;+&nbsp;(1&nbsp;x&nbsp;1))&nbsp;=&nbsp;**3**  |

The presence of a sign bit is a common belief, but it is not the case. The Java Language Specification [JLS - Primitive Types and Values](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.2) states that a system called **[two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)** is used for integer types.

Two's complement can cause a few quirky corner cases e.g. `-Integer.MAX_VALUE` is `Integer.MAX_VALUE`, see [JLS - Unary Minus Operator](https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.15.4).

#### Why do we use two's complement? 

The algorithms/hardware needed to do arithmetic, like addition, subtraction and multiplication are identical for signed numbers in this format and for unsigned numbers. This means half the circuitry is required in the cpu's [ALU](https://en.wikipedia.org/wiki/Arithmetic_logic_unit).

#### Treating signed integers as unsigned ones

Since Java 8 **[unsigned arithmetic](https://docs.oracle.com/javase/8/docs/technotes/guides/lang/enhancements.html#jdk8)** support has been added to the standard library to help you use the Java types as unsigned values.

The following code prints the binary representation of a series of numbers and how they can be interpreted as both signed and unsigned numbers. Note the differing behaviour as the integers roll over the `0` boundary, and the `Integer.MAX_VALUE` boundary:

{% highlight java %}

public class IntegerRepresentations {

  public static void main(String[] args) {
    for (int i = -2; i <= 2; i++) {
      int j = Integer.MAX_VALUE + i;
      System.out.println("binary representation = "+toBits(j)+", signed int value = "+j+", unsigned int value = "+Integer.toUnsignedString(j));
    }
    System.out.println("...");
    for (int i = -2; i <= 2; i++) {
      System.out.println("binary representation = "+toBits(i)+", signed int value = "+i+", unsigned int value = "+Integer.toUnsignedString(i));
    }
  }

  private static String toBits(int i) {
    return String.format("%32s", Integer.toBinaryString(i)).replace(' ', '0');
  }
}

{% endhighlight %}

Outputs:

{% highlight plaintext %}

binary representation = 01111111111111111111111111111101, signed int value = 2147483645, unsigned int value = 2147483645
binary representation = 01111111111111111111111111111110, signed int value = 2147483646, unsigned int value = 2147483646
binary representation = 01111111111111111111111111111111, signed int value = 2147483647, unsigned int value = 2147483647
binary representation = 10000000000000000000000000000000, signed int value = -2147483648, unsigned int value = 2147483648
binary representation = 10000000000000000000000000000001, signed int value = -2147483647, unsigned int value = 2147483649
...
binary representation = 11111111111111111111111111111110, signed int value = -2, unsigned int value = 4294967294
binary representation = 11111111111111111111111111111111, signed int value = -1, unsigned int value = 4294967295
binary representation = 00000000000000000000000000000000, signed int value = 0, unsigned int value = 0
binary representation = 00000000000000000000000000000001, signed int value = 1, unsigned int value = 1
binary representation = 00000000000000000000000000000010, signed int value = 2, unsigned int value = 2

{% endhighlight %}

#### A quirk - Java has two shift operators

The **right shift** operator is often used as a quick way to divide by 2. Moving the digits of a signed number to the right reduces the value each contributes by a factor of 2.

In languages like C the way that the shift works is determined by whether the value shifted if signed or unsigned.
 
For unsigned numbers the left hand side of the number shifted is filled with `0` values. `32 >>> 1` is `2147483632` (`01111111111111111111111111110000`).

For signed numbers the left hand side of the number is filled with the left most column's value before the shift. I.e. if you start with the integer `11111111111111111111111111100000` i.e. `-32` and you do `-32 >> 1`, you end up with `11111111111111111111111111110000` or `-16`. Whereas `32` (`00000000000000000000000000100000`) shifted once to the right will yield `16` (`00000000000000000000000000010000`).

**Instead of Java having separate signed and unsigned types. It has two separate right shift operators.**

The unsigned shift is the `>>>` operator. It can be useful in applications where you are using the the integer to represent a [bitmask](https://en.wikipedia.org/wiki/Mask_%28computing%29)).

The signed shift is the `>>` operator and is useful when using the shift to do cheap division by powers of 2.

### Confusion 2 - The result of the `%` operator can be negative

Those who have some familiarity with [modular arithmetic](https://en.wikipedia.org/wiki/Modular_arithmetic) assume that the `%` operator on integers will always return a positive value. In modular arithmetic e.g. `1` would be considered congruent to `-2 mod 3`, but the integer remainder of `-2` w.r.t. `3` is `-2`.

{% highlight java %}
      // This won't work when n is a negative odd value e.g. -3 % 2 is -1
      boolean isOdd(int n) { return n % 2 == 1; }
{% endhighlight %}

The important equality is given in the [JLS - Remainder Operator %](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.17.3):

*The remainder operation for operands that are integers ... produces a result value such that **(a/b)&#42;b+(a%b) is equal to a.***

The correct code should have been:

{% highlight java %}
      // Works for positive and negative values
      boolean isOdd(int n) { return n % 2 != 0; }
{% endhighlight %}

## Hexadecimal & Octal Numbers

Often in computing [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) and [octal](https://en.wikipedia.org/wiki/Octal) representations of numbers are used. They use a number bases that are a power of 2, this means they can more **compactly represent binary numbers**, and can be more natural to use than a decimal number in some applications.

### Java literals

The [JLS - Integer Literals](https://docs.oracle.com/javase/specs/jls/se8/html/jls-3.html#jls-3.10.1) allows you to write code using binary, octal, hexadecimal or decimal forms. Since Java 8 decimals can use an `_` separator to make longer numbers more readable. Some examples are given here. 

Whatever representation you use in your source code, the JVM processes all numbers as binary numbers.


{% highlight java %}

    int i = 1234;                  // decimal literal
    int iHex = 0x4D2;              // hexadecimal
    int iOctal = 02322;            // octal
    int iBinary = 0b10011010010;   // binary
    long l = 1_234_567_8901L;      // long literal using underscore notation from Java 8
    long lHex = 0x4D2FFFFFFL;      // long hex literal
	
{% endhighlight %}

## Sizes of integer types on the JVM

There are an infinite number of integers, you can always add 1 to the biggest you know about. In a computer space to store numbers is typically limited to a fixed size. There are different sizes of "integer" types, each of which uses a fixed number of bits to represent the number.

The [JLS - Integral Types and Values](https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.2.1) states that we have the following integer primitive types. The more bits used to represent the number, the more columns we have in our binary representation and a wider range of numbers can be represented, a `byte` covering the numbers `-128` to `127` and a `long` covering `-9223372036854775808` to `9223372036854775807`.

| type | size in bits | 
|:-----|-------------:|
|byte  |8             |
|short|16             |
|int  |32             |
|long |64             |

### JVM Quirk - bytes and shorts actually use 32 bits

Look at the list of [JVM instructions](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5), you will see that there are **no instructions for adding, subtracting etc. bytes or shorts**. Bytes and shorts are automatically widened to the int type when they are pushed onto the stack. Operations like addition are performed as 32 bit int additions. 

In the following code, an explicit cast is required to assign the result of adding 2 bytes together to a byte variable.


{% highlight java %}
public class ByteAdding {
  public static void main(String[] args) {
      byte a = 19, b = 20;
      // This cast is required, because of auto widening
      byte c = (byte) (a + b);
  }
}
{% endhighlight %}

The cast can be seen as an explicit [i2b](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2b) instruction in the decompiled code.

{% highlight plaintext %}
 bipush 19
 istore_1
 bipush 20
 istore_2
 iload_1
 iload_2
 iadd
 i2b
 istore_3
 return
{% endhighlight %}

## BigInteger

[java.math.BigInteger](https://docs.oracle.com/javase/8/docs/api/java/math/BigInteger.html) is an **arbitary precision** integer type for the JVM. In theory it can represent any integer number. It abstracts away the internal representation, but allows you to specify and retreive the number in terms of `byte[]`s in [big-endian](https://en.wikipedia.org/wiki/Endianness) order, in two's complement.

This code shows creating a number that requires more accuracy than that available in a `long`:


{% highlight java %}
public class BigIntegerPrinter {
  public static void main(String[] args) {
    BigInteger i = BigInteger.valueOf(Long.MAX_VALUE);
    printNumberAndNumBytes(i);
    printNumberAndNumBytes(i.multiply(BigInteger.valueOf(4)));
  }
  private static void printNumberAndNumBytes(BigInteger i){
    System.out.println(
        "Size in bytes = "+i.toByteArray().length+", i in bits = "+i.toString(2)
    );
  }
}
{% endhighlight %}

It will show you that instead of rolling a bigger number requires more space to store.:

{% highlight plaintext %}
Size in bytes = 8, i in bits = 111111111111111111111111111111111111111111111111111111111111111
Size in bytes = 9, i in bits = 11111111111111111111111111111111111111111111111111111111111111100
{% endhighlight %}

## Auto boxing and unboxing

One final JVM quirk comes from the autoboxing of integers. Look at the test below:


{% highlight java %}
public class IntegerAutoBoxingTests {
  @ParameterizedTest
  @ValueSource(ints = {12345, 128, 127, 0})
  public void testBoxCompare(int i){
    assertTrue(box(i) == box(i), () -> "Failed equality check for "+i);
  }
  public static Integer box(int i){
    return i;
  }
}
{% endhighlight %}

This test passes for the numbers `127` and `0`. It fails for the numbers `128` and `12345`. Why is this?

The [JLS - Boxing Conversion](https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html#jls-5.1.7) states:

*If the value p being boxed is true, false, a byte, or a char in the range \u0000 to \u007f, or an int or short number between -128 and 127 (inclusive), then let r1 and r2 be the results of any two boxing conversions of p. **It is always the case that r1 == r2.***

I.e. there is a **pool of number objects** that `Integer.valueOf` will return for e.g. `127`, but for numbers outside that pool a fresh object is created for each boxing.
