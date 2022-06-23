---
title: Better React Components with TypeScript Union Types
date: 2021-07-27 00:00:00 Z
categories:
- pburgess
- Tech
tags:
- TypeScript
author: pburgess
layout: default_post
summary: TypeScript can enhance the experience of developing React components. However
  to fully represent the types of some dynamic components, we need to harness the
  power of union types. This article examines an example where union types improves
  our component typing.
---

In a previous article I explained how [TypeScript union types could lead to us writing better code](https://blog.scottlogic.com/2021/06/28/union-types.html) by explicitly representing the types of variables. If you are not familiar with union types I recommend reading that article first. In this article I'm going to extend the use of union types to React to see how we can get the same benefits extended to React components.

React works very well with TypeScript. The type system from TypeScript also extends to React components and assigning properties in JSX. Union types let us better represent some more complex components we may write, and extend that type information to achieve some very smart components.

## Typing a form field component

I'm going to look at a relatively simple scenario here. I would like a generic form, with a structure I could easily serialise and store server side, to allow a user to write their own forms in my system. Therefore I need some sort of component that will render the correct form field for me. We'll keep it simple for now, and have three form fields I support: single line text, number, or checkbox.

~~~typescript
interface CheckboxProps {
  checked: boolean;
  onChange(newValue: boolean): void;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label}) => {
  ...
}

interface NumberInputProps {
  value: number;
  onChange(newValue: number): void;
  label: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, label}) => {
  ...
}

interface TextInputProps {
  value: string;
  onChange(newValue: string): void;
  label: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, label}) => {
  ...
}
~~~

Three fairly simple components with a few properties, nicely typed. I haven't displayed the implementation of any of the components, as the implementation detail doesn't matter here. You can just assume they render simple inputs of the correct type on the page, and do all the validation they need to of the user input (this could be a separate blog post in itself).

Now I need to render the correct component based on an array of inputs:

~~~tsx
interface Input {
  id: string;
  type: 'text' | 'number' | 'checkbox';
  value: string | number | boolean;
  label: string;
  onChange(newValue: string | number | boolean) => void;
}

const inputs: Input[] = [
  ...
]

return <form>
  {inputs.map(i => {
    switch(i.type) {
      case 'text':
        return <TextInput
                      key={i.id}
                      value={i.value as string}
                      onChange={i.onChange as (newValue: string) => void}
                      label={i.label}
                    />;
      case 'number':
        return <NumberInput
                  key={i.id}
                  value={i.value as number}
                  onChange={i.onChange as (newValue: number) => void}
                  label={i.label}
                />;
      case 'checkbox':
        return <Checkbox
                  key={i.id}
                  checked={i.value as boolean}
                  onChange={i.onChange as (newValue: boolean) => void}
                  label={i.label}
                />;
    }
  })}
</form>;
~~~

This is not at all pretty, just look at all of those type assertions! Every time we use a type assertion, we aren't using TypeScript's type checking very well. We are filling in missing information and enforcing our own rules that TypeScript isn't enforcing elsewhere, potentially leading to errors in our application. So ideally we wouldn't use a type assertion for anything. There's also another glaring issue here. The onChange function has to handle all three types of input like so:

~~~typescript
const inputs: Input[] = [
  {
    type: 'text',
    onChange: (newValue: string | number | boolean) => { ... }; // allowed, but not correct for text input
    ...
  },
  {
    type: 'text',
    onChange: (newValue: string) => { ... }; // wanted, but throws TypeScript error
  }
]
~~~

Let me fix that first:

~~~typescript
type StringChangeHandler = (newValue: string) => void;
type NumberChangeHandler = (newValue: number) => void;
type BooleanChangeHandler = (newValue: boolean) => void;

interface Input {
  id: string;
  type: 'text' | 'number' | 'checkbox';
  value: string | number | boolean;
  label: string;
  onChange: StringChangeHandler | NumberChangeHandler | BooleanChangeHandler;
}
~~~

That's better. A simple union type between the three change handlers now means we can provide a change function handling any one of the types:

~~~typescript
const inputs: Input[] = [
  {
    type: 'text',
    onChange: (newValue: string) => { ... }; // OK
    ...
  }
]
~~~

We have bigger issues though. First we still don't enforce a relationship between the `type` property and the `onChange` property, so it would be valid for me to pass an `onChange` handler accepting a number to a text field. Secondly, we still have our type assertions everywhere. If I take those out, everything will start complaining, as we don't correctly describe the relationships from our properties on Input. Fixing that looks like the following:

~~~typescript
interface BaseInputDefinition {
  id: string;
  label: string;
}

interface TextInputDefinition extends BaseInputDefinition {
  type: 'text';
  value: string;
  onChange: StringChangeHandler;
}

interface NumberInputDefinition extends BaseInputDefinition {
  type: 'number';
  value: number;
  onChange: NumberChangeHandler;
}

interface CheckboxInputDefinition extends BaseInputDefinition {
  type: 'checkbox';
  value: boolean;
  onChange: BooleanChangeHandler;
}

type Input = TextInputDefinition | NumberInputDefinition | CheckboxInputDefinition;
~~~

Now we have better encapsulated the 'or' in our logic. The Input is one of three types, rather than before when we were using one type to try and represent all three. The power of the union type allows us to better represent our type, and we can now get rid of all those messy type assertions:

~~~tsx
return <form>
  {inputs.map(i => {
    switch(i.type) {
      case 'text':
        return <TextInput
                  key={i.id}
                  value={i.value}
                  onChange={i.onChange}
                  label={i.label}
                />;
      case 'number':
        return <NumberInput
                  key={i.id}
                  value={i.value}
                  onChange={i.onChange}
                  label={i.label}
                />;
      case 'checkbox':
        return <Checkbox
                  key={i.id}
                  checked={i.value}
                  onChange={i.onChange}
                  label={i.label}
                />;
      }
  })}
</form>
~~~

One quick thing to note here, if I deconstruct inside my map:

~~~tsx
return <form>
  {inputs.map(({ id, type, ...inputProps}) => {
    ...
  })}
</form>
~~~

I lose the connection between `type` and `inputProps` and TypeScript can no longer infer the type of `inputProps` from the value of `type` (and this is correct, I can now independently change those two values as it infers the potential types at the point of deconstruction). Therefore we have to leave the whole object intact to allow the value of type to infer the type of the rest of the properties, and allow us to get rid of the type assertions.

You may have noticed something else here. I've essentially written the same types twice. All we are doing is redeclaring the props for my components, with one more property id, and they become a possible type for Input. So I can save myself a lot of rewriting by reusing these types (and better represent intent). However making them extend my BaseInputDefinition would be wrong, as they shouldn't have id on them. Here is where I can use another excellent tool, the Intersection type `&`, and a generic type.

~~~typescript
interface WithIdAndType<T extends 'text' | 'number' | 'checkbox'> {
  id: string;
  type: T;
}

type TextInputDefinition = TextInputProps & WithIdAndType<'text'>;

type NumberInputDefinition = NumberInputProps & WithIdAndType<'number'>;

type CheckboxInputDefinition = CheckboxProps & WithIdAndType<'checkbox'>

type Input = TextInputDefinition | NumberInputDefinition | CheckboxInputDefinition;
~~~

The intersection type tells us the type is the properties from the two types combined, therefore it has both `id` and `type` from `WithIdAndType` and the properties from the component property type.

Now everything is typed in such a way it represents the intent we have with our variables and components. This is key to how we should think about TypeScript. It is very good at allowing us to fully capture our intent, and often we need to break out of the OOP mindset when doing so.

Be sure to fully utilise union and intersection types when writing TypeScript, particularly with React. This sort of pattern is not uncommon in React, and incorrect types can make your life a lot more difficult. You will find the quality of the code you write increases (avoiding type assertions as much as possible), you will avoid potential mistakes more often, and you better document the code by describing the true types of variables, properties and components.