---
title: 'Learning Through Doing: From one language to another'
date: 2025-08-22 00:00:00 Z
categories:
- Tech
tags:
- rust
- C#
- learning
- deep dive
summary: When I wanted to learn a new programming language and a new programming paradigm,
  I decided to cut my teeth on a practical problem.
author: csalt
---

Although I'm an experienced developer, there is always new technology to learn.  It's impossible for one person, after all, to learn every possible tech stack and every possible language.  A few months ago, in a gap between projects, I decided to spend some time experimenting with a language that I'd heard was getting some interesting attention, which I'd heard a few of my friends and colleagues talking about.  The Rust programming language.  This is a deep dive into my first attempt to learn Rust, in a very hands-on way.

## What's different about Rust?

Despite being possibly the only programming language to be named after a fungal infection, Rust has become widely-used in the ten years since Version 1.0 of the language was released.  Moreover, it's extremely popular among its users, is known for having a very friendly and welcoming user community, and has been measured to be [one of the most power-efficient modern programming languages](https://www.technologyreview.com/2023/02/14/1067869/rust-worlds-fastest-growing-programming-language/), increasing the speed of code and literally using less power than functionally-equivalent code written in other languages.  Why is that, and why does that make it popular?

Rust is a fully compiled language, meaning that its code is compiled down to machine code binary files which a computer's CPU can run directly.  This is the same as the languages C and C++, but very different to, say, C# or Java.  Although those languages are compiled, they compile to "bytecode", binary files to run on an imaginary CPU, and the language runtime then has to either interpret that bytecode at runtime, or recompile it there and then to run on the specific machine, a process called "Just In Time" compilation.  A lot of work has been done over the twenty or thirty years that those languages have been around, to try to optimise the runtime process, but it still adds overhead.  Python and JavaScript, similarly, are interpreted and often JIT-compiled at runtime, although this can vary a bit between implementations.

C and C++ both have a reputation for being fast but difficult, because they leave most of the memory management aspects of coding to the developer.  Because of this, it's very easy for a developer to introduce subtle bugs to a program.  Memory leaks, for example, where a running process slowly bloats over time; or crashes when the program tries to access memory that it hasn't asked for.  Situations where the developer frees up memory, but then refers back to it again, can be written in C/C++ and, although they're not legal, won't prevent your program compiling.  This can create nasty bugs that don't behave predictably at runtime, or which occur in production but not in the debugger.  In short: when writing in a low level language like this, there are lots of dragons to beware of.

The other languages I mentioned above, on the other hand, are all memory-managed.  They all feature runtime "garbage collectors", which track what memory is in use, and don't free any parts of it up until it definitely can't be accessed any more.  You just can't have some of the classes of bugs I mentioned above in a memory-managed language, because the runtime does that management for you.

Developers who only ever use memory-managed languages---including me, most of the time---get used to never really having to worry about their memory.  In the modern world, we just always assume that the memory will be there, we can use as much of it as we want, and we never have to worry about throwing it away because the garbage collector will still clean up afterwards.  Most of the time, this works!  We don't really need to think about it.  However, at the edges, we can start to hit problems purely because we're not used to thinking about it.  I've had developers come ask me for help with code which crashes on a dataset a fraction of their available memory in size, or a web front-end which runs fine for half an hour than randomly falls over, all because they're accidentally forgetting to clean things up, or leaving dangling references that are stopping the garbage collector from cleaning up.  The higher-level abstraction of memory hides the problem away, right up until it becomes a bigger problem.  Moreover, because the garbage collector is a runtime task, it takes processing time itself.  For some workloads, this can become significant and make a noticeable difference to performance; and again, when the developer becomes used to having memory abstracted away, it's easy to accidentally write code which will potentially generate a large garbage collection load.

Like C and C++, Rust doesn't have a garbage collector.  Unlike them, it promises that it won't suffer from memory bugs.  How?

Instead, Rust has a compiler feature called the "borrow checker".  This statically analyses the code for potential memory issues at compile time.  In some ways, you can think of it as being like a compile-time garbage collector.  At places in the code where it spots a piece of memory can no longer be used, it inserts the sort of calls that a garbage collector would have to work out it could make at runtime, the sort of calls that a C/C++ developer needs to make manually.  And if it spots a construction that might cause a bug, it refuses to compile.  It does this in a way that would also prevent race conditions in multithreaded code: at any point in execution, only one block of code can have the right to change any particular value in memory.  If there's any ambiguity about which block of code that is, the code won't compile.

This compile-time safety is why some well-respected people have said that [companies writing low-level code should stop creating new projects in C or C++, and should move to safer languages like Rust instead](https://www.theregister.com/2022/09/20/rust_microsoft_c/).  It's also why Rust is [often considered hard to learn](https://ntietz.com/blog/rust-resources-learning-curve/): there are lots of subtle semantics, there are situations where the developer needs to explicitly bring in Rust-specific constructs such as "lifetime specifiers", and these things are *impossible to avoid* when you're just starting out learning the language.

My question was, then: what would be the easiest way for *me* to learn it?  Would I be able to write a program in it easily, in my spare time, or is the learning curve just too steep?  And, almost as importantly, Rust has a reputation for being one of the languages that's most-beloved by its users.  They actively enjoy coding in it.  So, would I find this exercise *fun*?

## Tackling that steep learning curve

Because I'm a developer, I've naturally built up a collection of scripts and small programs to help me with specific tasks.  Most of them are written in C#, because it's usually my language of choice.  I decided to pick the simplest one, and see if I could learn how to turn that into Rust, ideally into idiomatic Rust.

The app I chose was a very simple file manipulation app, for renaming all the files in a directory so they all have a name that starts with the same prefix and ends in a monotonically-increasing number.  This might sound like a strange requirement; it was an app I coded up quickly in my spare time to help me with a workflow for producing stop-motion animations.  You could say this is a strange choice of app to convert into Rust; it doesn't really benefit from Rust's improved performance, and doing file manipulation isn't necessarily its strongpoint.  To be fair, you could say the same about C#; a lot of developers would think this better as a shell script.  The big benefit of this app, for a first attempt at Rust, is that it's very simple.  It lists all the files (and only the files) in a directory, and renames them all according to its command-line arguments, quitting if anything would accidentally be overwritten.  You can [see the full code for it on Github](https://github.com/csalt-scottlogic/block-rename).

## First things first

The first thing our script has to do is to get an ordered list of files in a directory.  In .NET, there's a static helper method for this.  It doesn't sort the output for us, and naturally we should think about error handling, but it's still fairly simple, taking a path and returning a list of file names as strings:

~~~ c#
private static IEnumerable<string> GetInputFiles(string folder)
{
    try
    {
        var inputFiles = Directory.GetFiles(folder).ToList();
        inputFiles.Sort();
        return inputFiles;
    }
    catch (IOException ex)
    {
        Console.Error.WriteLine(ex.Message);
        return [];
    }
}
~~~

In Rust, however, there's a catch.  The `read_dir()` function is a bit more low-level, so it doesn't just give us files.  Because of that, we have to peek into each directory entry, see if it's a file or not, and if it is then get its path.

~~~ rust
fn get_sorted_files(dir: &PathBuf) -> Result<Vec<PathBuf>, anyhow::Error> {
    let dir_iter = fs::read_dir(dir)
        .with_context(|| format!("Could not read contents of folder '{}'", dir.display()))?;
    let mut dir_entries = dir_iter
        .collect::<Result<Vec<_>, io::Error>>()
        .context("Error reading folder contents details")?
        .iter()
        .filter(|e| {
            e.metadata().is_ok_and(|f| f.is_file())
        })
        .map(|e| e.path())
        .collect::<Vec<PathBuf>>();
    
    dir_entries.sort();

    Ok(dir_entries)
}
~~~

There is a bit of extra clutter here compared to C#, but in general it's not that bad.  The biggest difference is probably the way that the error-handling code is intermingled with the logic, rather than being in a separate catch block.  I'm using the popular [Anyhow](https://docs.rs/anyhow/latest/anyhow/) crate to make error handling a little bit nicer and let us wrap errors with a human-readable message, which is definitely an improvement on my original approach.

One reason for additional code, other than having to insert the filtering step, is that in C# arrays and the `List<T>` type are inherently iterable.  In Rust, arrays and the equivalent `Vec<T>` type are not iterable, because you have to choose whether or not your iterator takes ownership of the contents or merely borrows them.  That's the purpose of the `iter()` call, which creates a borrowing iterator over the vector returned by `fs::read_dir()`.

On the other hand, this function doesn't have the `return` statement which the C# has.  Although Rust does have `return`, it's normally only used to return early from a function.  If your function runs to completion, it will return the value of its final expression, which in this case constructs an `Ok<T>` instance of the `Result<T, E>` enum to show that our function succeeded.

Aside from that, though, this code really isn't very different to what we'd write in C# if we needed to filter the output, using a LINQ chain in a very similar way.  It's worth noting that if we'd used NodeJS to do this in JavaScript, we'd also have to do this filtering, because Node also only implements a non-filtering `readdir()` function.  And, of course, in either Rust or Node, there's probably a library out there to handle this for us already.  My main point, though, is that we haven't really had to add anything into the code to handle memory management, or distinguish between values and references, just as we don't have to in C#.

## The meat of the code

The important "business logic" of this small program is the generation of each new filename, based on its position in the sorted list of files.  This is how I did it in the C# version:

~~~ c#
private static List<string> MangleAndCheckNames(IList<string> inputFiles, string newBaseName, int startingCount)
{
    List<string> outputFiles = inputFiles
        .Select(
            (n, i) => 
                Path.Combine(
                    Path.GetDirectoryName(n) ?? "", 
                    Path.ChangeExtension(
                        $"{newBaseName}_{i + startingCount,4:D4}", 
                        Path.GetExtension(n)
                    )
                )
        )
        .ToList();
    if (outputFiles.Where((f, i) => inputFiles.Skip(i).Contains(f)).Any())
    {
        Console.Error.WriteLine(
            "ERROR: Naming clash.  Proceeding would overwrite one or more files.  Please rename to a different base name first."
        );
        return new List<string>();
    }
    return outputFiles;
}
~~~

Generating the filenames itself is straightforward, using a single `Select()` call, specifically the two-parameter lambda overload of `Select()` so we have access to both the list element and its index within the lambda.  I've used `Path.ChangeExtension()` to set both the filename and extension at the same time, which might be confusing if you weren't aware you could do that, but hopefully it's fairly clear what's going on.  After the filenames are generated, we check that renaming the files in order won't result in any overwrites.  The LINQ `Any()` call doesn't have an overload which gives you access to the element index, so we chain it with `Where()`.

Converting this to Rust gave me problems, I have to admit, because I struggled to properly handle the ownership of the various `PathBuf`s I was passing around in my code.  

Rust's main mechanism for ensuring memory safety is the "borrow checker", which maintains a concept of the "ownership" of any particular allocated piece of memory, at the code level---essentially, what variable it's currently assigned to.  When an object is assigned to a variable, or passed as a parameter that's not a reference, its ownership is transferred and the previous owning variable becomes invalid to use.  Passing a reference, on the other hand, "borrows" ownership of that object.

My first attempt was this:

~~~ rust
fn generate_filenames(
    orig_names: Vec<PathBuf>, 
    name_base: &str, 
    counter: u32,
) -> Result<Vec<TransformedName>, anyhow::Error> {
    let mut counter = counter;
    orig_names
        .clone()
        .into_iter()
        .map(move |n| {
            let dest_name = format!("{}_{:04}", name_base, counter);
            let mut new_name = n.clone();
            new_name.set_file_name(dest_name);
            match n.extension() {
                Some(ext) => new_name.set_extension(ext),
                None => new_name.set_extension("")
            };
            if orig_names.contains(&new_name) && orig_names.iter().find(|x| **x == new_name && **x > n).is_some() {
                return Err(anyhow::Error::msg(format!(
                    "File naming clash!  File {} would be overwritten if we continued.", 
                    new_name.display()
                )));
            }
            counter += 1;
            Ok(TransformedName::new(n, new_name))
        })
        .collect::<Result<Vec<_>, anyhow::Error>>()
}
~~~

I felt, though, as if I was doing something wrong.  There are two `clone()` calls in the code, and using `clone()` to duplicate things in memory just to get around ownership problems was something that gave me a code smell, even as a beginner.  The second one is there partly because I couldn't find an equivalent of `Path.GetDirectory()` and partly because of my level of Rust API knowledge: I didn't know that the `PathBuf` type also has a `with_file_name()` method that combines the meanings of `clone()` and `set_file_name()`.

The reason I needed to clone the `orig_names` vector is because `into_iter()` takes ownership of the vector's data, but I wanted to use the vector again later in the function.  However, why is ownership needed?  Surely if we didn't take ownership then we wouldn't need to copy it; after all, we don't mutate the original names at any point.  That change gave me this:

~~~ rust
fn generate_filenames(
    orig_names: Vec<PathBuf>, 
    name_base: &str, 
    counter: u32,
) -> Result<Vec<TransformedName>, anyhow::Error> {
    let mut counter = counter;
    orig_names
        .iter()
        .map(|n| {
            let dest_name = format!("{}_{:04}", name_base, counter);
            let mut new_name = n.with_file_name(dest_name);
            match n.extension() {
                Some(ext) => new_name.set_extension(ext),
                None => new_name.set_extension("")
            };
            if orig_names.iter().any(|x| **x > *n && **x == new_name) {
                return Err(anyhow::Error::msg(format!(
                    "File naming clash!  File {} would be overwritten if we continued.", 
                    new_name.display()
                )));
            }
            counter += 1;
            Ok(TransformedName::new(*n, new_name))
        })
        .collect::<Result<Vec<_>, anyhow::Error>>()
}
~~~

The only other changes I've had to make are an extra level of dereferencing in the overwrite check, which I've also made a little bit more efficient whilst I was in that part of the code.  

However...this doesn't compile.

The reason?  I'm using a struct as a convenience type to store each pair of old and new names, so that to do the rename itself, we just need a map over the return vector.  However, that convenience type is defined like this:

~~~ rust
struct TransformedName {
    from: PathBuf,
    to: PathBuf
}

impl TransformedName {
    fn new(from: PathBuf, to: PathBuf) -> TransformedName {
        TransformedName { from, to }
    }
}
~~~

It owns that `from` field, so needs to be able to take ownership of the first `TransformedName::new()` parameter.  However the line that calls `TransformedName::new()` isn't in a position to give ownership, because in this version of the code it only holds a shared, borrowed reference to it.

We could fix that by cloning the value of the borrowed reference, but that feels unnecessarily wasteful too.  Why not convert the `from` field to be an immutable reference?  Then that value can have multiple owners at once.

~~~ rust
struct TransformedName {
    from: &PathBuf,
    to: PathBuf
}
// and the same change in the new() function, to match
~~~

This doesn't compile either!  We need, the compiler tells us, an explicit lifetime parameter.

Lifetime parameters are a Rust feature that tell the compiler how long a particular piece of data has to stay valid and accessible for.  Normally, an object's lifetime ends when its owner goes out of scope.  In this case, however, the compiler needs to know that the value that the `from` field references has to stay alive for at least as long as the `TransformedName` itself, so that it never becomes a dangling reference.  The syntax for them can take a bit of getting used to, because in some places they look like type parameters but in other places they don't, but this is what we get if we add them to our `TransformedName` struct:

~~~ rust
struct TransformedName<'a> {
    from: &'a PathBuf,
    to: PathBuf
}

impl TransformedName<'_> {
    fn new<'a>(from: &'a PathBuf, to: PathBuf) -> TransformedName<'a> {
        TransformedName { from, to }
    }
}
~~~

Here, we're declaring that `TransformedName::new()` returns an instance which must be at least as long-lived as its first parameter, and which has ownership of its second parameter.  Incidentally, lifetime parameters are only relevant on references.  If you take ownership of a value, then either you hand ownership off elsewhere at some point, or it gets dropped when it falls out of scope in the place where it's owned.

Now we're just using a reference for that `from` field, everything is going to be hunky-dory.  Isn't it?

## Or so she thought...

As soon as I popped that in, the entire `generate_filenames()` function gained a big fat red underline in my editor.  Why?  Well, what did I say a moment ago?

> If you take ownership of a value...it gets dropped when it falls out of scope in the place where it's owned.

The original declaration of `generate_filenames()` was, I'll remind you:

~~~ rust
fn generate_filenames(
    orig_names: Vec<PathBuf>, 
    name_base: &str, 
    counter: u32,
) -> Result<Vec<TransformedName>, anyhow::Error>
~~~

The function is taking ownership of that first parameter, which contains the paths which will be used later.  However, because of this, it will be dropped at the end of the function, and this would leave all the returned references dangling.

This is slowly bringing us towards a loose design pattern that I'm assuming most experienced Rust developers apply by instinct.  *Borrow your parameters by default* by taking a reference, and only take ownership if your code really needs it.  I changed the definition of `generate_filenames()` to take a reference to a `PathBuf` collection slice, and did the necessary changes to reference and dereference where needed.  I could have used a reference to a `Vec<PathBuf>`, because the current version of the calling code passes a reference to an entire `Vec` as the parameter, but using a slice here makes our code that little bit more generalised.  This is what we now have:

~~~ rust
fn generate_filenames<'a>(
    orig_names: &'a [PathBuf], 
    name_base: &str, 
    counter: u32,
) -> Result<Vec<TransformedName<'a>>, anyhow::Error> {
    let mut counter = counter;
    orig_names
        .iter()
        .map(|n| {
            let dest_name = format!("{}_{:04}", name_base, counter);
            let mut new_name = n.with_file_name(dest_name);
            match n.extension() {
                Some(ext) => new_name.set_extension(ext),
                None => new_name.set_extension("")
            };
            if orig_names.iter().any(|x| *x > *n && *x == new_name) {
                return Err(anyhow::Error::msg(format!(
                    "File naming clash!  File {} would be overwritten if we continued.", 
                    new_name.display()
                )));
            }
            counter += 1;
            Ok(TransformedName::new(n, new_name))
        })
        .collect::<Result<Vec<_>, anyhow::Error>>()
}
~~~

This change, honestly, also made me realise there was another code smell elsewhere I was overlooking.  In all the unit tests of this function, I was creating a vector of sample data, then immediately cloning it to be the function parameter, so I could also still access it in my assertions at the end of the test.  That, itself, should have been a sign that the function could have a better signature.

This function has also needed to acquire lifetime parameters, which makes sense: the returned vector will contain references to the elements of the first parameter, so they need to have their lifetime linked.  An experienced Rust developer could probably make this more idiomatic still, but I'm happy with where I've got to.  You can [see the full code for yourself over on GitHub](https://github.com/csalt-scottlogic/sequential_rename) if you'd like.

## Other little bits and pieces

I decided this would work better as a single blog post than as a whole series, so there's lots of things that were new to me about Rust that I haven't really gone into in depth; this might be a deep dive, but you can only go so deep with one tank of air.  There are a whole host of other differences, such as how the Rust ecosystem recompiles your dependencies rather than downloading a binary.  One nice feature is that you can use conditional compilation to stub functions for testing, enabling me to stub out file renaming for unit testing like this:

~~~ rust
#[cfg(not(test))]
fn rename_file(from: &PathBuf, to: &PathBuf) -> Result<(), std::io::Error> {
    fs::rename(from, to)
}

#[cfg(test)]
fn rename_file(_from: &PathBuf, _to: &PathBuf) -> Result<(), std::io::Error> {
    Ok(())
}
~~~

Testing itself is a little bit different to C#, where the convention is that tests go in their own assemblies.  In Rust, the convention is that unit tests go in the same file as the code they're testing, in a specific module which is compiled conditionally.  Integration tests go into separate crates, under a `tests` directory, which by convention is also compiled conditionally.  Is this better or worse than the C# convention?  Honestly, I think it's largely just a matter of taste.

I did also benefit from using VS Code's rust-analyzer plugin.  This not only gives you syntax and error highlighting, but also annotates the code with inferred types.

![Screenshot of the get_sorted_files() function in VS Code, showing how the rust-analyzer plugin has annotated the code with the types of many of the expressions.]({{ site.github.url }}/csalt/assets/learning-through-doing/type-annotations.png "Screenshot of the get_sorted_files() function in VS Code, showing how the rust-analyzer plugin has annotated the code with the types of many of the expressions.")

Each piece of grey text is not part of the file content, it's an annotation added by the plugin to show the inferred type of each declaration or expression.  If I was experienced I might think this was too much clutter; as a newcomer to Rust, I found it really helpful.

## Conclusions

Implementing this little console app in Rust was certainly an experience, and certainly took me a lot longer than it did originally to do the job in C#.  It wasn't, arguably, the right tool for the job, because this isn't a task that particularly plays to Rust's strengths.  It was, however, a relatively straightforward job to do, and finding out the implications of borrowing and ownership in practice helped me much more than reading it in a book ever would.

Am I going to use Rust more in the future?  I still have a long way to go, because there were definitely pain points here where a stronger working knowledge of the standard API would have helped me a lot.  It might be a while before I am recommending Rust-to-WASM for a front end project!  I certainly feel that it's something I can put into my personal toolbox, though, and that it's something that's worth considering when I do need to write something that plays to its strengths, such as requiring high performance or low energy use.

For this project, to be fair only a small, simple one, I didn't find the learning curve particularly steep.  I've come across articles which write off Rust because, they say, it's bad at implementing certain patterns.  Maybe it is, but maybe that's a sign that if you're wedded to those patterns, Rust isn't the right tool for you.

The ultimate question, though: the claim that Rust is enjoyable to code in.  Did I find it fun?  Well...at times, I have to admit, I found it highly frustrating.  At times, when it seemed as if following one compiler suggestion for fixing a compilation error only led inexerobly to another, bigger compilation error, I definitely didn't find it fun.  In the end, though, once I looked at the program holistically and realised the design error I'd made, instead of just chasing one compilation error to the next, it all slotted together remarkably fast.  And any time I program something and all the parts of it feel like they come together, that it feels like everything is meshing and just fits like it's meant to be?  That, always for me, is what makes software development fun.
