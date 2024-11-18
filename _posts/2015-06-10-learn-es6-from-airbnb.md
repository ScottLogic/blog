---
title: Learn ES6 from Airbnb's coding standards
date: 2015-06-10 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
summary: Airbnb's JavaScript coding standards are now based around ES6 and contain many guidelines to help you take advantage of its features. In this blog post I'll present some resources I created to help you learn ES6 through their guidelines.
---

I really like [Airbnb's coding standards][the standards] and as I've been trying to master ES6 ([also named EcmaScript 2015][es2015]) I've found that they offer many helpful hints on how to use ES6 functionality. Further, its really useful when learning to play around with the syntax and see what the equivalent is in ES5, in order to see what is and is-not possible. One of the best ways of doing that is using [babel js' REPL environment][babel repl].

So, I've created a set of links which open examples from the coding standards in babel, so you can see what the examples compile to and try editing the examples to learn more. I've also included links against each section to the MDN or other documentation which explains what is happening in more depth.

If you'd prefer to try out the code in the browser, check out the [kangax compatibility table][kangax] to see which browser you might be able to try something in.

### The links

[References 2.1][2.1] - `const` [Further reading][const].

[References 2.2][2.2] - `let` [Further reading][let].

[References 2.3][2.3] - `let`, `const`

[Objects 3.4][3.4] - Object literal computed property names. [Further reading][Object literal ES6].

[Objects 3.5][3.5] - Object literal shorthand method name. [Further reading][Object literal ES6].

[Objects 3.6][3.6] - Object literal shorthand property name. [Further reading][Object literal ES6].

[Objects 3.7][3.7] - Object literal shorthand property name.

[Arrays 4.3][4.3] - Array spread operator. [Further reading][Spread operator].

[Arrays 4.4][4.4] - `Array.from` [Further reading][Array.from].

[Destructuring 5.1][5.1] - Object destructuring assignment. [Further reading][destructuring].

[Destructuring 5.2][5.2] - Array destructuring assignment. [Further reading][destructuring].

[Destructuring 5.3][5.3] - Object vs Array destructuring assignment.

[Strings 6.4][6.4] - Template strings. [Further reading][template strings].

[Functions 7.2][7.2] - Arrow functions. [Further reading][arrow functions].

[Functions 7.6][7.6] - Rest parameters. [Further reading][rest parameters].

[Functions 7.7][7.7] - Default parameters. [Further reading][default parameters].

[Functions 7.8][7.8] - Default parameters.

[Functions 8.1][8.1] - Arrow functions. [Further reading][arrow functions].

[Functions 8.2][8.2] - Arrow functions.

[Constructors 9.1][9.1] - Classes. [Further reading][classes].

[Constructors 9.2][9.2] - Classes.

[Constructors 9.3][9.3] - Classes.

[Constructors 9.4][9.4] - Classes.

[Modules 10.1][10.1] - Modules. [Further reading][modules].

[Modules 10.2][10.2] - Modules.

[Modules 10.3][10.3] - Modules.

[Iterators and Generators 11.1][11.1] - Iterators. [Further reading][iterators].

[Iterators and Generators 11.2][11.2] - Generators. [Further reading][generators].

[the standards]: https://github.com/airbnb/javascript
[Spread operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
[Array.from]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[Object literal ES6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_6
[const]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
[let]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
[destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[es2015]: https://esdiscuss.org/topic/javascript-2015
[babel repl]: http://babeljs.io/repl/
[template strings]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
[arrow functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[rest parameters]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
[kangax]: https://kangax.github.io/compat-table/es6/
[default parameters]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
[classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[modules]: http://www.2ality.com/2014/09/es6-modules-final.html
[iterators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
[generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
[2.1]: http://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&code=%2F%2F%20References%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%232.1%0A%0A%2F%2F%20Use%20const%20for%20all%20of%20your%20references%3B%20avoid%20using%20var.%0A%2F%2F%20%20%20Why%3F%20This%20ensures%20that%20you%20can%27t%20reassign%20your%20references%20(mutation)%2C%20which%20can%20lead%20to%20bugs%20and%20difficult%20to%20comprehend%20code.%0A%0A%2F%2F%20bad%0Avar%20a%20%3D%201%3B%0Avar%20b%20%3D%202%3B%0A%0A%2F%2F%20good%0Aconst%20c%20%3D%201%3B%0Aconst%20d%20%3D%202%3B%0A
[2.2]: http://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&code=%2F%2F%20References%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%232.2%0A%0A%2F%2F%20If%20you%20must%20mutate%20references%2C%20use%20let%20instead%20of%20var.%0A%2F%2F%20%20%20Why%3F%20let%20is%20block-scoped%20rather%20than%20function-scoped%20like%20var.%0A%20%20%0A%2F%2F%20bad%0Avar%20counta%20%3D%201%3B%0Aif%20(true)%20%7B%0A%20%20counta%20%2B%3D%201%3B%0A%7D%0A%0A%2F%2F%20good%2C%20use%20the%20let.%0Alet%20countb%20%3D%201%3B%0Aif%20(true)%20%7B%0A%20%20countb%20%2B%3D%201%3B%0A%7D%0A
[2.3]: http://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&code=%2F%2F%20References%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%232.3%0A%0A%2F%2F%20Note%20that%20both%20let%20and%20const%20are%20block-scoped.%0A%0A%2F%2F%20const%20and%20let%20only%20exist%20in%20the%20blocks%20they%20are%20defined%20in.%0A%7B%0A%20%20let%20e%20%3D%201%3B%0A%20%20const%20f%20%3D%201%3B%0A%7D%0Aconsole.log(e)%3B%20%2F%2F%20ReferenceError%0Aconsole.log(f)%3B%20%2F%2F%20ReferenceError
[3.4]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&code=%2F%2F%20Objects%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%233.4%0A%0A%2F%2F%20Use%20computed%20property%20names%20when%20creating%20objects%20with%20dynamic%20property%20names.%0A%2F%2F%20%20%20Why%3F%20They%20allow%20you%20to%20define%20all%20the%20properties%20of%20an%20object%20in%20one%20place.%0A%0A%20%20function%20getKey(k)%20%7B%0A%20%20%20%20return%20%60a%20key%20named%20%24%7Bk%7D%60%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20bad%0A%20%20const%20obja%20%3D%20%7B%0A%20%20%20%20id%3A%205%2C%0A%20%20%20%20name%3A%20%27San%20Francisco%27%2C%0A%20%20%7D%3B%0A%20%20obja%5BgetKey(%27enabled%27)%5D%20%3D%20true%3B%0A%0A%20%20%2F%2F%20good%0A%20%20const%20objb%20%3D%20%7B%0A%20%20%20%20id%3A%205%2C%0A%20%20%20%20name%3A%20%27San%20Francisco%27%2C%0A%20%20%20%20%5BgetKey(%27enabled%27)%5D%3A%20true%2C%0A%20%20%7D%3B
[3.5]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&code=%2F%2F%20Objects%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%233.5%0A%0A%2F%2F%20Use%20object%20method%20shorthand.%0A%0A%2F%2F%20bad%0Aconst%20atoma%20%3D%20%7B%0A%20%20value%3A%201%2C%0A%0A%20%20addValue%3A%20function%20(value)%20%7B%0A%20%20%20%20return%20atom.value%20%2B%20value%3B%0A%20%20%7D%2C%0A%7D%3B%0A%0A%2F%2F%20good%0Aconst%20atomb%20%3D%20%7B%0A%20%20value%3A%201%2C%0A%0A%20%20addValue(value)%20%7B%0A%20%20%20%20return%20atom.value%20%2B%20value%3B%0A%20%20%7D%2C%0A%7D%3B
[3.6]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&code=%2F%2F%20Objects%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%233.6%0A%0A%2F%2F%20Use%20property%20value%20shorthand.%0A%2F%2F%20%20%20Why%3F%20It%20is%20shorter%20to%20write%20and%20descriptive.%0A%0A%20%20const%20lukeSkywalker%20%3D%20%27Luke%20Skywalker%27%3B%0A%0A%20%20%2F%2F%20bad%0A%20%20const%20obja%20%3D%20%7B%0A%20%20%20%20lukeSkywalker%3A%20lukeSkywalker%0A%20%20%7D%3B%0A%0A%20%20%2F%2F%20good%0A%20%20const%20objb%20%3D%20%7B%0A%20%20%20%20lukeSkywalker%0A%20%20%7D%3B
[3.7]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=false&spec=false&code=%2F%2F%20Objects%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%233.7%0A%0A%2F%2F%20Group%20your%20shorthand%20properties%20at%20the%20beginning%20of%20your%20object%20declaration.%0A%2F%2F%20%20%20Why%3F%20It%27s%20easier%20to%20tell%20which%20properties%20are%20using%20the%20shorthand.%0A%0Aconst%20anakinSkywalker%20%3D%20%27Anakin%20Skywalker%27%3B%0Aconst%20lukeSkywalker%20%3D%20%27Luke%20Skywalker%27%3B%0A%0A%2F%2F%20bad%0Aconst%20obja%20%3D%20%7B%0A%20%20episodeOne%3A%201%2C%0A%20%20twoJedisWalkIntoACantina%3A%202%2C%0A%20%20lukeSkywalker%2C%0A%20%20episodeThree%3A%203%2C%0A%20%20mayTheFourth%3A%204%2C%0A%20%20anakinSkywalker%2C%0A%7D%3B%0A%0A%2F%2F%20good%0Aconst%20objb%20%3D%20%7B%0A%20%20lukeSkywalker%2C%0A%20%20anakinSkywalker%2C%0A%20%20episodeOne%3A%201%2C%0A%20%20twoJedisWalkIntoACantina%3A%202%2C%0A%20%20episodeThree%3A%203%2C%0A%20%20mayTheFourth%3A%204%2C%0A%7D%3B
[4.3]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrays%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%234.3%0A%0A%2F%2F%20Use%20array%20spreads%20...%20to%20copy%20arrays.%0A%0A%2F%2F%20bad%0Aconst%20len%20%3D%20items.length%3B%0Aconst%20itemsCopy%20%3D%20%5B%5D%3B%0Alet%20i%3B%0A%0Afor%20(i%20%3D%200%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%0A%20%20itemsCopy%5Bi%5D%20%3D%20items%5Bi%5D%3B%0A%7D%0A%0A%2F%2F%20good%0Aconst%20itemsCopyb%20%3D%20%5B...items%5D%3B
[4.4]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrays%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%234.4%0A%0A%2F%2F%20To%20convert%20an%20array-like%20object%20to%20an%20array%2C%20use%20Array%23from.%0A%0Aconst%20foo%20%3D%20document.querySelectorAll(%27.foo%27)%3B%0Aconst%20nodes%20%3D%20Array.from(foo)%3B
[5.1]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrays%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%235.1%0A%0A%2F%2F%20Use%20object%20destructuring%20when%20accessing%20and%20using%20multiple%20properties%20of%20an%20object.%0A%2F%2F%20%20%20Why%3F%20Destructuring%20saves%20you%20from%20creating%20temporary%20references%20for%20those%20properties.%0A%0A%20%20%2F%2F%20bad%0A%20%20function%20getFullName(user)%20%7B%0A%20%20%20%20const%20firstName%20%3D%20user.firstName%3B%0A%20%20%20%20const%20lastName%20%3D%20user.lastName%3B%0A%0A%20%20%20%20return%20%60%24%7BfirstName%7D%20%24%7BlastName%7D%60%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20good%0A%20%20function%20getFullName(obj)%20%7B%0A%20%20%20%20const%20%7B%20firstName%2C%20lastName%20%7D%20%3D%20obj%3B%0A%20%20%20%20return%20%60%24%7BfirstName%7D%20%24%7BlastName%7D%60%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20best%0A%20%20function%20getFullName(%7B%20firstName%2C%20lastName%20%7D)%20%7B%0A%20%20%20%20return%20%60%24%7BfirstName%7D%20%24%7BlastName%7D%60%3B%0A%20%20%7D
[5.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrays%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%235.2%0A%0A%2F%2F%20Use%20array%20destructuring.%0A%0Aconst%20arr%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%3B%0A%0A%2F%2F%20bad%0Aconst%20firsta%20%3D%20arr%5B0%5D%3B%0Aconst%20seconda%20%3D%20arr%5B1%5D%3B%0A%0A%2F%2F%20good%0Aconst%20%5Bfirst%2C%20second%5D%20%3D%20arr%3B
[5.3]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrays%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%235.3%0A%0A%2F%2F%20Use%20object%20destructuring%20for%20multiple%20return%20values%2C%20not%20array%20destructuring.%0A%2F%2F%20%20%20Why%3F%20You%20can%20add%20new%20properties%20over%20time%20or%20change%20the%20order%20of%20things%20without%20breaking%20call%20sites.%0A%0A%2F%2F%20bad%0A%0Afunction%20processInput(input)%20%7B%0A%20%20%2F%2F%20then%20a%20miracle%20occurs%0A%20%20return%20%5Bleft%2C%20right%2C%20top%2C%20bottom%5D%3B%0A%7D%0A%0A%2F%2F%20the%20caller%20needs%20to%20think%20about%20the%20order%20of%20return%20data%0Aconst%20%5Bleft%2C%2C%2C%20bottom%5D%20%3D%20processInput(input)%3B%0A%0A%2F%2F%20good%0Afunction%20processInput(input)%20%7B%0A%20%20%2F%2F%20then%20a%20miracle%20occurs%0A%20%20return%20%7B%20left%2C%20right%2C%20top%2C%20bottom%20%7D%3B%0A%7D%0A%0A%2F%2F%20the%20caller%20selects%20only%20the%20data%20they%20need%0Aconst%20%7B%20left%2C%20right%20%7D%20%3D%20processInput(input)%3B%0A
[6.4]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Strings%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%236.4%0A%0A%2F%2F%20When%20programmatically%20building%20up%20strings%2C%20use%20template%20strings%20instead%20of%20concatenation.%0A%2F%2F%20%20%20Why%3F%20Template%20strings%20give%20you%20a%20readable%2C%20concise%20syntax%20with%20proper%20newlines%20and%20string%20interpolation%20features.%0A%0A%2F%2F%20bad%0Afunction%20sayHi(name)%20%7B%0A%20%20return%20%27How%20are%20you%2C%20%27%20%2B%20name%20%2B%20%27%3F%27%3B%0A%7D%0A%0A%2F%2F%20bad%0Afunction%20sayHi(name)%20%7B%0A%20%20return%20%5B%27How%20are%20you%2C%20%27%2C%20name%2C%20%27%3F%27%5D.join()%3B%0A%7D%0A%0A%2F%2F%20good%0Afunction%20sayHi(name)%20%7B%0A%20%20return%20%60How%20are%20you%2C%20%24%7Bname%7D%3F%60%3B%0A%7D
[7.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%237.2%0A%0A%2F%2F%20Function%20expressions%3A%0A%0A%2F%2F%20immediately-invoked%20function%20expression%20(IIFE)%0A(()%20%3D%3E%20%7B%0A%20%20console.log(%27Welcome%20to%20the%20Internet.%20Please%20follow%20me.%27)%3B%0A%7D)()%3B
[7.6]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%237.6%0A%0A%2F%2F%20Never%20use%20arguments%2C%20opt%20to%20use%20rest%20syntax%20...%20instead.%0A%2F%2F%20%20%20Why%3F%20...%20is%20explicit%20about%20which%20arguments%20you%20want%20pulled.%20Plus%20rest%20arguments%20are%20a%20real%20Array%20and%20not%20Array-like%20like%20arguments.%0A%0A%2F%2F%20bad%0Afunction%20concatenateAll()%20%7B%0A%20%20const%20args%20%3D%20Array.prototype.slice.call(arguments)%3B%0A%20%20return%20args.join(%27%27)%3B%0A%7D%0A%0A%2F%2F%20good%0Afunction%20concatenateAll(...args)%20%7B%0A%20%20return%20args.join(%27%27)%3B%0A%7D
[7.7]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%237.7%0A%0A%2F%2F%20Use%20default%20parameter%20syntax%20rather%20than%20mutating%20function%20arguments.%0A%0A%2F%2F%20really%20bad%0Afunction%20handleThings(opts)%20%7B%0A%20%20%2F%2F%20No!%20We%20shouldn%27t%20mutate%20function%20arguments.%0A%20%20%2F%2F%20Double%20bad%3A%20if%20opts%20is%20falsy%20it%27ll%20be%20set%20to%20an%20object%20which%20may%0A%20%20%2F%2F%20be%20what%20you%20want%20but%20it%20can%20introduce%20subtle%20bugs.%0A%20%20opts%20%3D%20opts%20%7C%7C%20%7B%7D%3B%0A%20%20%2F%2F%20...%0A%7D%0A%0A%2F%2F%20still%20bad%0Afunction%20handleThings(opts)%20%7B%0A%20%20if%20(opts%20%3D%3D%3D%20void%200)%20%7B%0A%20%20%20%20opts%20%3D%20%7B%7D%3B%0A%20%20%7D%0A%20%20%2F%2F%20...%0A%7D%0A%0A%2F%2F%20good%0Afunction%20handleThings(opts%20%3D%20%7B%7D)%20%7B%0A%20%20%2F%2F%20...%0A%7D%0A
[7.8]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%237.8%0A%0A%2F%2F%20Avoid%20side%20effects%20with%20default%20parameters%0A%2F%2F%20%20%20Why%3F%20They%20are%20confusing%20to%20reason%20about.%0A%0Avar%20b%20%3D%201%3B%0A%2F%2F%20bad%0Afunction%20count(a%20%3D%20b%2B%2B)%20%7B%0A%20%20console.log(a)%3B%0A%7D%0Acount()%3B%20%20%2F%2F%201%0Acount()%3B%20%20%2F%2F%202%0Acount(3)%3B%20%2F%2F%203%0Acount()%3B%20%20%2F%2F%203
[8.1]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrow%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%238.1%0A%0A%2F%2F%20When%20you%20must%20use%20function%20expressions%20(as%20when%20passing%20an%20anonymous%20function)%2C%20use%20arrow%20function%20notation.%0A%2F%2F%20%20%20Why%3F%20It%20creates%20a%20version%20of%20the%20function%20that%20executes%20in%20the%20context%20of%20this%2C%20which%20is%20usually%20what%20you%20want%2C%20and%20is%20a%20more%20concise%20syntax.%0A%2F%2F%20%20%20Why%20not%3F%20If%20you%20have%20a%20fairly%20complicated%20function%2C%20you%20might%20move%20that%20logic%20out%20into%20its%20own%20function%20declaration.%0A%0A%2F%2F%20bad%0A%5B1%2C%202%2C%203%5D.map(function%20(x)%20%7B%0A%20%20return%20x%20*%20x%3B%0A%7D)%3B%0A%0A%2F%2F%20good%0A%5B1%2C%202%2C%203%5D.map((x)%20%3D%3E%20%7B%0A%20%20return%20x%20*%20x%3B%0A%7D)%3B
[8.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Arrow%20Functions%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%238.1%0A%0A%2F%2F%20If%20the%20function%20body%20fits%20on%20one%20line%20and%20there%20is%20only%20a%20single%20argument%2C%20feel%20free%20to%20omit%20the%20braces%20and%20parentheses%2C%20and%20use%20the%20implicit%20return.%20Otherwise%2C%20add%20the%20parentheses%2C%20braces%2C%20and%20use%20a%20return%20statement.%0A%2F%2F%20%20%20Why%3F%20Syntactic%20sugar.%20It%20reads%20well%20when%20multiple%20functions%20are%20chained%20together.%0A%2F%2F%20%20%20Why%20not%3F%20If%20you%20plan%20on%20returning%20an%20object.%0A%0A%2F%2F%20good%0A%5B1%2C%202%2C%203%5D.map(x%20%3D%3E%20x%20*%20x)%3B%0A%0A%2F%2F%20good%0A%5B1%2C%202%2C%203%5D.reduce((total%2C%20n)%20%3D%3E%20%7B%0A%20%20return%20total%20%2B%20n%3B%0A%7D%2C%200)%3B
[9.1]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Constructors%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%239.1%0A%0A%2F%2F%20Always%20use%20class.%20Avoid%20manipulating%20prototype%20directly.%0A%2F%2F%20%20%20Why%3F%20class%20syntax%20is%20more%20concise%20and%20easier%20to%20reason%20about.%0A%0A%2F%2F%20bad%0Afunction%20QueueA(contents%20%3D%20%5B%5D)%20%7B%0A%20%20this._queue%20%3D%20%5B...contents%5D%3B%0A%7D%0AQueueA.prototype.pop%20%3D%20function()%20%7B%0A%20%20const%20value%20%3D%20this._queue%5B0%5D%3B%0A%20%20this._queue.splice(0%2C%201)%3B%0A%20%20return%20value%3B%0A%7D%0A%0A%2F%2F%20good%0Aclass%20Queue%20%7B%0A%20%20constructor(contents%20%3D%20%5B%5D)%20%7B%0A%20%20%20%20this._queue%20%3D%20%5B...contents%5D%3B%0A%20%20%7D%0A%20%20pop()%20%7B%0A%20%20%20%20const%20value%20%3D%20this._queue%5B0%5D%3B%0A%20%20%20%20this._queue.splice(0%2C%201)%3B%0A%20%20%20%20return%20value%3B%0A%20%20%7D%0A%7D
[9.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Constructors%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%239.2%0A%0A%2F%2F%20Use%20extends%20for%20inheritance.%0A%2F%2F%20%20%20Why%3F%20It%20is%20a%20built-in%20way%20to%20inherit%20prototype%20functionality%20without%20breaking%20instanceof.%0A%0A%2F%2F%20bad%0Aconst%20inherits%20%3D%20require(%27inherits%27)%3B%0Afunction%20PeekableQueueA(contents)%20%7B%0A%20%20Queue.apply(this%2C%20contents)%3B%0A%7D%0Ainherits(PeekableQueueA%2C%20Queue)%3B%0APeekableQueueA.prototype.peek%20%3D%20function()%20%7B%0A%20%20return%20this._queue%5B0%5D%3B%0A%7D%0A%0A%20%20%2F%2F%20good%0Aclass%20PeekableQueue%20extends%20Queue%20%7B%0A%20%20peek()%20%7B%0A%20%20%20%20return%20this._queue%5B0%5D%3B%0A%20%20%7D%0A%7D
[9.3]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Constructors%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%239.3%0A%0A%2F%2F%20Methods%20can%20return%20this%20to%20help%20with%20method%20chaining.%0A%0A%2F%2F%20bad%0AJedi.prototype.jump%20%3D%20function()%20%7B%0A%20%20this.jumping%20%3D%20true%3B%0A%20%20return%20true%3B%0A%7D%3B%0A%0AJedi.prototype.setHeight%20%3D%20function(height)%20%7B%0A%20%20this.height%20%3D%20height%3B%0A%7D%3B%0A%0Aconst%20luke%20%3D%20new%20Jedi()%3B%0Aluke.jump()%3B%20%2F%2F%20%3D%3E%20true%0Aluke.setHeight(20)%3B%20%2F%2F%20%3D%3E%20undefined%0A%0A%2F%2F%20good%0Aclass%20Jedi%20%7B%0A%20%20jump()%20%7B%0A%20%20%20%20this.jumping%20%3D%20true%3B%0A%20%20%20%20return%20this%3B%0A%20%20%7D%0A%0A%20%20setHeight(height)%20%7B%0A%20%20%20%20this.height%20%3D%20height%3B%0A%20%20%20%20return%20this%3B%0A%20%20%7D%0A%7D%0A%0Aconst%20luke%20%3D%20new%20Jedi()%3B%0A%0Aluke.jump()%0A%20%20.setHeight(20)%3B
[9.4]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Constructors%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%239.4%0A%0A%2F%2F%20It%27s%20okay%20to%20write%20a%20custom%20toString()%20method%2C%20just%20make%20sure%20it%20works%20successfully%20and%20causes%20no%20side%20effects.%0A%0Aclass%20Jedi%20%7B%0A%20%20contructor(options%20%3D%20%7B%7D)%20%7B%0A%20%20%20%20this.name%20%3D%20options.name%20%7C%7C%20%27no%20name%27%3B%0A%20%20%7D%0A%0A%20%20getName()%20%7B%0A%20%20%20%20return%20this.name%3B%0A%20%20%7D%0A%0A%20%20toString()%20%7B%0A%20%20%20%20return%20%60Jedi%20-%20%24%7Bthis.getName()%7D%60%3B%0A%20%20%7D%0A%7D
[10.1]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Modules%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2310.1%0A%0A%2F%2F%20Always%20use%20modules%20(import%2Fexport)%20over%20a%20non-standard%20module%20system.%20You%20can%20always%20transpile%20to%20your%20preferred%20module%20system.%0A%2F%2F%20%20%20Why%3F%20Modules%20are%20the%20future%2C%20let%27s%20start%20using%20the%20future%20now.%0A%0A%20%2F%2F%20bad%0Aconst%20AirbnbStyleGuide%20%3D%20require(%27.%2FAirbnbStyleGuide%27)%3B%0Amodule.exports%20%3D%20AirbnbStyleGuide.es6%3B%0A%0A%2F%2F%20ok%0Aimport%20AirbnbStyleGuide2%20from%20%27.%2FAirbnbStyleGuide%27%3B%0Aexport%20default%20AirbnbStyleGuide2.es6%3B%0A%0A%2F%2F%20best%0Aimport%20%7B%20es6%20%7D%20from%20%27.%2FAirbnbStyleGuide%27%3B%0Aexport%20default%20es6%3B
[10.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Modules%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2310.2%0A%0A%2F%2F%20Do%20not%20use%20wildcard%20imports.%0A%2F%2F%20%20%20Why%3F%20This%20makes%20sure%20you%20have%20a%20single%20default%20export.%0A%0A%20%20%2F%2F%20bad%0A%20%20import%20*%20as%20AirbnbStyleGuide%20from%20%27.%2FAirbnbStyleGuide%27%3B%0A%0A%20%20%2F%2F%20good%0A%20%20import%20AirbnbStyleGuide2%20from%20%27.%2FAirbnbStyleGuide%27%3B
[10.3]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Modules%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2310.3%0A%0A%2F%2F%20And%20do%20not%20export%20directly%20from%20an%20import.%0A%2F%2F%20%20%20Why%3F%20Although%20the%20one-liner%20is%20concise%2C%20having%20one%20clear%20way%20to%20import%20and%20one%20clear%20way%20to%20export%20makes%20things%20consistent.%0A%0A%20%2F%2F%20bad%0A%2F%2F%20filename%20es6.js%0Aexport%20%7B%20es6%20as%20default%20%7D%20from%20%27.%2FairbnbStyleGuide%27%3B%0A%0A%2F%2F%20good%0A%2F%2F%20filename%20es6.js%0Aimport%20%7B%20es6%20%7D%20from%20%27.%2FAirbnbStyleGuide%27%3B%0Aexport%20default%20es6%3B
[11.1]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Iterators%20%26%20Generators%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2311.1%0A%0A%2F%2F%20Don%27t%20use%20iterators.%20Prefer%20JavaScript%27s%20higher-order%20functions%20like%20map()%20and%20reduce()%20instead%20of%20loops%20like%20for-of.%0A%2F%2F%20%20%20Why%3F%20This%20enforces%20our%20immutable%20rule.%20Dealing%20with%20pure%20functions%20that%20return%20values%20is%20easier%20to%20reason%20about%20than%20side-effects.%0A%0Aconst%20numbers%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0A%0A%2F%2F%20bad%0Alet%20suma%20%3D%200%3B%0Afor%20(let%20num%20of%20numbers)%20%7B%0A%20%20suma%20%2B%3D%20num%3B%0A%7D%0A%0Asuma%20%3D%3D%3D%2015%3B%0A%0A%2F%2F%20good%0Alet%20sumb%20%3D%200%3B%0Anumbers.forEach((num)%20%3D%3E%20sumb%20%2B%3D%20num)%3B%0Asumb%20%3D%3D%3D%2015%3B%0A%0A%2F%2F%20best%20(use%20the%20functional%20force)%0Aconst%20sumc%20%3D%20numbers.reduce((total%2C%20num)%20%3D%3E%20total%20%2B%20num%2C%200)%3B%0Asumc%20%3D%3D%3D%2015%3B
[11.2]: http://babeljs.io/repl/#?experimental=false&evaluate=true&loose=true&spec=false&code=%2F%2F%20Iterators%20%26%20Generators%20-%20https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2311.1%0A%0A%2F%2F%20Don%27t%20use%20generators%20for%20now.%0A%2F%2F%20%20%20Why%3F%20They%20don%27t%20transpile%20well%20to%20ES5.%0A%0A%2F%2F%20bad%0A%0Afunction*%20argumentsGenerator()%20%7B%0A%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20arguments.length%3B%20i%20%2B%3D%201)%20%7B%0A%20%20%20%20yield%20arguments%5Bi%5D%3B%0A%20%20%7D%0A%7D























