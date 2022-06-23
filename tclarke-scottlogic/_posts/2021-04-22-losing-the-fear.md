---
published: true
author: tclarke-scottlogic
title: C++ for Java Programmers - Losing the Fear
layout: default_post
categories:
  - Tech
summary: >-
  Follow-up article to "Why Java Developers Should Learn C++". If you are interested in picking up C++, or enjoyed my previous post, this can help you get started.
---

> Also, my next planned post is going to be on some of the best introductory functionality of C++, how it relates to equivalents in Java, and some advice about how to interact with it when learning C++. So hopefully that'll be helpful. - [Thomas Clarke, July 2019]({{ site.baseurl }}/2019/07/19/why-java-developers-should-learn-c++.html)

Look, stuff happened, okay? There was a complicated project and a global pandemic, I didn't *forget* about this. I'm *sorry*.

Anyway.

So, you've got some experience with Java and you'd like to learn some of the basics of C++?

This article attempts to introduce some of the fundamental features, distinctions and, to be honest, traps that you will encounter when first picking up the language. Note that I do mean fundamental. These are very much the low-hanging fruit of a very complex language. But these are the main hurdles I expect Java programmers to encounter early on.

### Object Construction

Consider the following example of classic "Java dev new to C++ code"

~~~C++
#include <iostream>

class Thing {
public:   // Defines everything until the next accessor 
    Thing(int val) : m_val(val) {    // Uses the initialiser list, which runs before the constructor body
        std::cout << "Create Thing " << m_val << "\n";
    }
    
    void doStuff() {
        std::cout << "Doing Stuff " << m_val << "\n";
    }

private:
    int m_val;
};

int main()
{
    Thing* thing = new Thing(5); // "Why do I have a pointer?"  
    (*thing).doStuff();          // Go away, pointer
    delete thing;                // I know I'm supposed to delete this, I hope I did it right
    return 0; // 0 = EXIT_SUCCESS
}
~~~

This example, while perfectly valid code that will execute correctly, is wildly bad practice. And it can get a lot worse. Java programmers new to C++ tend to get very confused as to why they've got a pointer when they didn't want one, and try to get rid of it as quickly as possible, leading to code that memory leaks like a sieve. Or they simply forget to delete the pointer, or delete it too early.

So what should that main method look like?

~~~C++
int main()
{
  Thing thing(5);  // Will be automatically deconstructed when out of scope 
  thing.doStuff();
  return 0;
}
~~~

That's it. That's all you need in 99% of cases. Note that there are no pointers. No need for a delete. No frameworks. 

There's some really interesting stuff going on here with respect to where memory is allocated, which I'll delve into in a following article*, but in almost every case you come across, what you want to happen here will be exactly what happens.

### Destructors

Every modern language has one key feature that defines it,so much so that other languages have tried to port that concept into their own languages with varying levels of success.

For Java, it's probably the JVM. For C#, I'd argue it's LINQ.

For C++, it's inarguably the destructor.

~~~C++
#include <iostream>

using namespace std;

class TestToDestruction {
    int m_index;
    
    public:
    TestToDestruction(int value) : m_index(value) {
        cout << "Created " << m_index << "\n";
    }

    ~TestToDestruction() {
        cout << "Destroyed " << m_index << "\n";
    }
};

/*
Running this main method gives the following output:

Created 0
Created 1
Destroyed 1
Created 2
Destroyed 2
Created 3
Destroyed 3
Destroyed 0
*/
int main() {
    TestToDestruction longlived(0); // Will live till the end of main
    for(int i = 1; i <= 3; ++i) {
        TestToDestruction shortlived(i); // Will live only until the } below
    }
}
~~~

Originally, this was intended to simplify memory management. You could `new` a pointer in the constructor and `delete` in the destructor. It took a surprisingly long time for the standard library to [encapsulate this behaviour into a specific class](https://en.cppreference.com/w/cpp/memory/auto_ptr), and even longer amount of time for them to [fix the bugs in that class](https://en.cppreference.com/w/cpp/memory/unique_ptr), but now we have std::unique_ptr and std::shared_ptr, and [C++ developers can go through their entire careers without having to worry about safely allocating and de-allocating memory at all](https://www.modernescpp.com/index.php/no-new-new).

But you know what you *do* have to thoughtfully allocate and de-allocate though? Sockets, File Handles, Database Connections, Mutexes, Sessions, basically any finite shared resource. As someone who has failed to correctly release a database connection in his application... don't do that. It ends poorly and only QA will save you.

There's a reason that C# has the Dispose pattern, and Java has "finalize" and "try-with-resources". Setting the lifetime of a resource to the lifetime of a particular object is a fantastic tool for solving *lots* of problems. It provides that intuitive feeling of "if I can get hold of it, it will work, when it won't work, I can't get hold of it". But in a garbage-collected language, you're not *really* in control of the lifetime of an object. The garbage collector can leave it hanging around, which is a problem when it's deadlocking your database.

C++, not being garbage-collected, can have "Resource Acquisition Is Initialisation" as a base-level concept. [Indeed, "RAII" is the thing that C++ developers tend to miss most when away from the language.](https://stackoverflow.com/a/18054738/14250).

But in that case, what if you want to pass stuff around *without* initialising and shutting down extraneous copies? Are you stuck with (*gulp*) pointers...?

### References

If the destructor is the biggest concept C++ brought to all other languages, the reference is biggest one it brought to C.

In many ways, a reference is a "fixed pointer". Unlike a pointer, [it doesn't suffer from the billion-dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/); C++ references cannot be null**. You have to assign it with something to refer to at the time of creation, and it will always refer to that thing. The most common use is to prevent unnecessary copying of objects.

> Technical Note: Yes, you can [shamefully abuse the casting system](https://stackoverflow.com/a/42520025/14250) to create a null reference, but you can also not do that, and live a less pointlessly destructive existence.

Let's take an example:

~~~C++
#include <iostream>

class Thing {
public:
    Thing(int val) : m_val(val) {
        std::cout << "Create Thing " << m_val << "\n";
    }

    // Copy Constructor
    Thing(const Thing& thing) : m_val(thing.m_val) {
        std::cout << "Copy Thing " << m_val << "\n";
    }
    
    ~Thing() {
        cout << "Destroy Thing " << m_val << "\n";
    }

    void doStuff() {
        std::cout << "Doing Stuff " << m_val << "\n";
    }

private:
    int m_val;
};

void doStuffToThing(Thing thing) {
    thing.doStuff();
}

void doStuffToReferenceToThing(Thing& thing) {
    thing.doStuff();
}

int main() {
    Thing thing1(1);
    Thing thing2(2);
    doStuffToThing(thing1);
    doStuffToReferenceToThing(thing2);
}
~~~

Gives us the output:

~~~
Create Thing 1
Create Thing 2
Copy Thing 1
Doing Stuff 1
Destroy Thing 1
Doing Stuff 2
Destroy Thing 2
Destroy Thing 1
~~~

Note that thing1 is being copied, whereas thing2 is not. In C++, not paying for stuff you don't want to use is a key tenet of the language, so avoiding incidental copies is a valuable feature.

It's important to note that the relationships between parameters and references are interesting in Java. In Java, everything is pass-by-**value**, so is copied, but because any non-simple type is a reference, the reference is what's being copied, so while anything you do directly the original object (for example reassignment) doesn't affect the object passed in.

In C++, you can pass-by-reference, which means that anything you do to the parameter, you do to the original object; for example:

~~~C++
#include <iostream>

void incrementIt(int& val)
{
    ++val;
}

void setToSeven(int& val)
{
    val = 7;
}

int main()
{
    int value = 0;
    incrementIt(value);
    std::cout << value << "\n"; // Displays 1
    setToSeven(value);
    std::cout << value << "\n"; // Displays 7
}
~~~

Of course, a lot of the time you will want to pass an object into a function and ensure it *doesn't* mess with your own object. For that, we have `const`.

### Const

To me, const is one of the most interesting and powerful parts of the C++ language.

It's *sort* of like final in Java, but far more powerful. Fundamentally, it allows C++ to have immutability as a compile-time concept, something that is NotImplementedException in Java.

[Consider a simple object](https://onlinegdb.com/Bk4oBxsId).

~~~C++
#include <iostream>

class Thing {
public:
    // A: constructor taking reference to const integer
    Thing(const int& val) : m_val(val) {
    }
    
    // B: const function - can't change values of internal variables
    void printValue() const {
        std::cout << "Value is " << getValue() << "\n";
    }

    // C: const function returning const reference to member variable
    const int& getValue() const {
        return m_val;
    }

    // D: non-const function taking reference to const object
    void setValue(const Thing& value) {
        m_val = value.getValue();
    }

private:
    int m_val;
};

int main()
{
    Thing thing1(1);
    const Thing thing2(2);
    const Thing thing3(3);

    // Print original
    thing1.printValue();
    thing2.printValue();
    thing3.printValue();
    
    // Set items
    thing1.setValue(thing2);
    // thing3.setValue(thing2);  // Will not compile

    // Print updated
    thing1.printValue();
    thing2.printValue();
    thing3.printValue();

    return 0; // 0 = EXIT_SUCCESS
}
~~~

Note that `setValue(...)` cannot be made a const function, because you assign a new value to m_val within it.

It's instructive to establish [what happens if we make `getValue()` a non-const function](https://onlinegdb.com/rkWaIZiUO):

~~~C++
#include <iostream>

class Thing {
public:
    // A: unchanged
    Thing(const int& val) : m_val(val) {
    }
    
    // B: calls getValue(), can't be const
    void printValue() {
        std::cout << "Value is " << getValue() << "\n";
    }

    // C: non-const function can still return const reference to members
    const int& getValue() {
        return m_val;
    }

    // D: calling getValue on parameter, thus parameter can't be const
    void setValue(Thing& value) {
        m_val = value.getValue();
    }

private:
    int m_val;
};

int main()
{
    Thing thing1(1);
    Thing thing2(2);    // Passed to non-const function, can't be const
    Thing thing3(3);    // Calls non-const functions, can't be const

    // Print original
    thing1.printValue();
    thing2.printValue();
    thing3.printValue();
    
    // Set items
    thing1.setValue(thing2);
    thing3.setValue(thing2);

    // Print updated
    thing1.printValue();
    thing2.printValue();
    thing3.printValue();

    return 0; // 0 = EXIT_SUCCESS
}
~~~

Note that the constness has to completely unravel, right up to the declaration of the variables. You simply can't call a non-const function on a const object, nor pass that object as a non-const reference.

This makes it *incredibly* useful [when it comes to threading](https://youtu.be/2yXtZ8x7TXw?t=379), because if you pass a const object around a parallelised system, it's an immutable object; you can be sure it won't change.

You can also use a const reference to a non-const object, but you need a little more care here; obviously you can still mutate the state via the original object and any non-const references to it, but const helps you to confirm the coding standard of *not* doing that at compile-time.

> Technical Note: You can actually deliberately choose to convert a const reference into a non-const reference using `const_cast`, but again, see previous note about being pointlessly self-destructive.
>
> "tl;dr: const_cast is likely something you should never use. If you do use it, understand the dangers!" - Aaron Ballman, "[When Should You Use const_cast?](https://blog.aaronballman.com/2011/06/when-should-you-use-const_cast/)"

### Vectors

> [Almost always use std::vector, Andy Bohn](http://andybohn.com/almostalwaysvector/)

~~~C++
MyClass* arr = new MyClass[5];
// ... Use the array for various things ...
delete[] arr; // Hope you remembered to do this.
~~~

One of the things I hate most to see in C/C++ code is an asterisk (`*`) followed by `new` and a set of square brackets `[n]`. There's just something about them that reminds me of bad bugs and late evenings dealing with things don't quite behave the way I expect and now my program's seg-faulting, or it's leaking memory like a sieve, if it'll ever compile at all.

Which is why `std::vector` exists.

~~~C++
std::vector<MyClass> vec;
// Use the vector for various things
~~~

The std::vector is a clean, efficient, standard way of creating an extensible, resizable unordered collection of items.

Under the hood, it's normally an array that, once it runs out of space, gets deleted and recreated as a larger array. As far as a Java developer's concerned it's just a nice clean ArrayList equivalent.

### Overriding operators

>I left out operator overloading [from Java] as a fairly personal choice because I had seen too many people abuse it in C++.
> * James Gosling, Java's Lead Designer, [The C Family of Languages](http://www.gotw.ca/publications/c_family_interview.htm)

> When writing code in Java, I have to say that I miss being able to overload operators as in C++. This is not a critical issue, but I am disappointed.
> * Robert C. Martin, [Java Gems: Jewels from Java Report](https://www.amazon.co.uk/Java-Gems-Jewels-Reference-Library/dp/0521648246)

One of the fascinating things, when researching an article like this, is the stuff you discover people find weird or off-putting that you'd never considered.

Consider the following code:

~~~C++
	Price p1(1);
	Price p2(2);
	Price p3 = p1 + p2;
  
  cout << p1 << "+" << p2 << "=" << p3 << "\n";
~~~

This is entirely valid C++ code, no different in function than a Java (or C++) equivalent:

~~~Java
Price p1 = new Price(1);
Price p2 = new Price(2);
Price p3 = p1.add(p2);
System.out.println(p1 + "+" + p2 + "=" + p3);
~~~

Being able to treat any operator as a mere function is neat. The C++ code above is clean, clear and in more intuitive.

The main problem is one of semantics; what does `+` or `/` or `<<` mean for your class? This is the abuse that James Gosling is discussing in the quote above. Once you see something like `p << x + n ^ 2` where those are all non-numeric objects, and you have to guess what each operator means in context, I can fully understand why you might take a prejudice against the practice.

But there are many cases where it can be used to produce clear and intuitive code; and it's syntactic sugar that I do miss when working in Java.

### Exceptions

C++ has support for exception specifications.

Do not use exception specifications in C++.

C++ has no concept of "checked vs unchecked" specifications. If you include an exception specification, the program will compile fine even if the wrong exception is thrown in the function. It will then crash when that exception is thrown.

Do not use exception specifications in C++.

There are interesting reasons for the above, but you don't have to care about them.

Do not use exception specifications in C++.

So simply [treat all exceptions as unchecked exceptions](http://www.gotw.ca/publications/mill22.htm).

> Moral #1: Never write an exception specification.
> 
> Moral #2: Except possibly an empty one, but if I were you I’d avoid even that.
>
> C/C++ Users Journal, 20(7), July 2002

Do not use exception specifications in C++.

### Inheritance

I think the biggest thing Java programmers will struggle with when it comes to C++ is the way inheritance, possibly the most common architectural tool in Java, is far more awkward to work with in C++. However, in some ways, this is less a bug than a feature.

Firstly, [inheritance is traditionally overused in every language](https://en.wikipedia.org/wiki/Composition_over_inheritance). Having it be more inconvenient, pushes you towards composition, which is often a far better pattern.

Secondly, polymorphism is inherently inefficient. There's a run-time lookup cost to working out which class you're really working with. In C++ you're more exposed to this, as you have to explicitly state that your functions are overriddable. Java, as any fule kno, goes the other way, requiring you to explicitly declare methods final. As someone from a C++/C# background, I have *[views](https://softwareengineering.stackexchange.com/q/245393/366)* on this.

If you are comfortable with Java's boxing and unboxing of objects, in many ways this is of a similar form. In order to get the powerful features of inheritance, you have to jump through a few hoops. The difference is, because you're more in control of it, you don't automatically inherit a chunk of cruft in your classes. You can be really clear *at point of use* if you want to engage with inheritance or not.

Note that inheritance in C++ only works via pointer or reference lookup. If you try and access an inherited class via a non-reference to the base class, you get a weird effect called "[slicing](https://www.geeksforgeeks.org/object-slicing-in-c/)", where derived aspects are simply wiped out of existence. Java dodges this by making every object a reference, but this would be wildly inefficient by C++ standards (AFAIK, opinion is divided on how inefficient it is by Java standards).

Inheritance-based code tends to be fairly pointer-heavy, but as established above, the case of function parameters (e.g. passing a derived class into a function that takes the base class) this is unnecessary; a reference will work perfectly well, and is less troublesome to work with.

### But what about...?

The above are core C++ concepts that I think Java programmers will either find unexpectedly useful, or "just different enough to be annoying". There's tons of stuff that I've deliberately avoided; the most obvious being almost anything to do with pointers, which I plan to pick up on in a future article.*

C++ is a 30 year old language that is going through a period of renewed vitality. I genuinely think that the pressure from the existence of similar but modern languages like Rust will help drive it in a good direction.

The above should help smooth you, as a Java developer, over some of the speedbumps of learning this ridiculous and fascinating language. And as always, I'm fascinated to learn what you think of both my article and the language.

----

*: This line of text will come back to haunt me.