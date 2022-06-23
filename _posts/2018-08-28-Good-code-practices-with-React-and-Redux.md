---
title: Good code practices with React and Redux
date: 2018-08-28 00:00:00 Z
categories:
- garora
- Tech
author: garora
layout: default_post
summary: React and Redux are 2 tools that together make it simpler to create functional
  UIs. However there are many potential pitfalls when it comes to using them. In this
  blog I will walk you through some practices to keep in mind as you write your own
  code.
---

This summer I completed an internship at Scott Logic, in their Newcastle office. Having little experience of real software projects, I found I have learnt a lot from this experience. We worked on a kiosk for the honesty.store. The honesty.store is the office tuck shop, it is based on the idea that people pay for the items on the website and just take the item. The kiosk would allow users to send themselves a Slack reminder to pay for the item.

For this we used React/Redux for UI, TensorFlow to create a machine learning model to identify the products and cloud-based services provided by Google’s Firebase for hosting, cloud functions and storage. In this blog I will discuss code practices for use with React and Redux.

## Top Tips

[React](https://reactjs.org/) as you probably know, is a javascript library. It is efficient, simplifies complex UIs with the help of smaller code blocks called components and can walk your dog (one of those is a lie). [Redux](https://redux.js.org/basics/usagewithreact) can be used with React to share state information amongst components without having it pass it through others.

### Functional components

First we will compare 2 different bases to create components, this is all about keeping your code as simple as possible. And not letting it do something you wouldn't want it to, it's like using `const` instead of `let`.

Let's create a `ShoppingList` Component. This component should take in an array as a prop like so,
`<ShoppingList items={["Wand", "Robes", "Owl", "Bertie Bott's Every Flavour Beans"]} />`, and display it as a list. We can make it as a fully-blown React Component like so,

{% highlight JSX %}
class ShoppingList extends Component {
  render() {
    return (
      <div className="shopping-list">
        <ul>
          {this.props.items.map(item => (<li>{item}</li>))}
        </ul>
      </div>
    );
  }
}
{% endhighlight %}

Or we can create a state-less functional component like this,

{% highlight JSX %}
const ShoppingList = ({ items }) => (
      <div className="shopping-list">
        <ul>
          {items.map(item => (<li>{item}</li>))}
        </ul>
      </div>
    )
{% endhighlight %}

Both of these give the same output, so which is better? A functional component can't have any state or make use of [lifecycle methods](https://reactjs.org/docs/react-component.html), this makes the code simpler to follow as the reader would instantly be able to tell what the function can't do. You might use a fully-blown component if you wanted to use a lifecycle method such as `componentWillUnmount`. This is a lifecycle method that is called just before a component unmounts (is no longer rendered). This should be used to clean up, such as clearing timeouts and intervals.

### Avoiding redundant information in Redux

This tip is about minimising the information you store in Redux, making it easier to read and update.

Let's say we want to store user information in Redux, we could store it like this,

{% highlight JSON %}
{
  "age": 15,
  "isAdult": false
}
{% endhighlight %}

However the 2nd property is completely redundant. It might mean you don't have to do a `state.age > 17` check after fetching the age, but it also means you need to do that check every time you set the age. It will also become cumbersome to expand this system, for example if you want to check if they are a toddler and/or a teenager.

Let's take another example, say we want to store information of multiple pets available to buy, and have one that's selected,

{% highlight JSON %}
{
  "pets": {
    "Hedwig": {"type": "owl", "gender": "female"},
    "Scabbers": {"type": "Rat", "gender": "male"},
    "Trevor": {"type": "Toad", "gender": "male"},
    "Crookshanks": {"type": "Cat", "gender": "male"}
  },
    "selectedPet": {"name": "Hedwig", "type": "owl", "gender": "female"}
}
{% endhighlight %}

Here instead of storing an object in `"selectedPet"` we can store an identifier like so,

{% highlight JSON %}
{
  "pets": {
    "Hedwig": {"type": "owl", "gender": "female"},
    "Scabbers": {"type": "Rat", "gender": "male"},
    "Trevor": {"type": "Toad", "gender": "male"},
    "Crookshanks": {"type": "Cat", "gender": "male"}
  },
    "selectedPet": "Hedwig"
}
{% endhighlight %}

If we want all the information on the selected pet we can use `state.pets[state.selectedPet]`.

How does this relate to the behaviour of your components? Let's say we have a component `Checkout`, that needs the information about the selected pet. You might be tempted to pass in `state.selectedPet` and `state.pets` to the component like so,

{% highlight JSX %}
import Checkout from './Checkout';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
    pets: state.pets,
    selectedPet: state.selectedPet
});

export default connect(
  mapStateToProps,
)(Checkout);
{% endhighlight %}

But here you are passing too much information to the component, meaning it's code has to be more complicated and its not dumb. Dumb components are useful as they tend to be more reusable. Now look at,

{% highlight JSX %}
import Checkout from './Checkout';
import {connect} from 'react-redux';

const getSelectedPet = state => ({
  ...state.pets[state.selectedPet],
  name: state.selectedPet
});

const mapStateToProps = state => ({
  pet: getSelectedPet(state)
});

export default connect(mapStateToProps)(Checkout);
{% endhighlight %}

Where we have made use of the [spread notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). This means that the prop never sees information it doesn't need.

### Passing functions as props

Finally a simple change you can make to increase the efficiency of your code.

Let's make a `School` Component, where we can add students at the click of a button. We could use this,

{% highlight JSX %}
class School extends Component {
  state = {students: []};

  addStudent() {
    //get student info
    //add student to state
  }

  render() {
    return (
      <div>
        <p>Students: {this.state.students}</p>
        <button onClick={() => this.addStudent()}>Add Student</button>
      </div>
    );
  }
}
{% endhighlight %}

As you might already know `onClick={() => this.addStudent()}` isn't very efficient, because it creates a new function. In React it can be worse because it would generate a new function on each render. Now let's try,

{% highlight JSX %}
class School extends Component {
  state = {students: []};

  addStudent = () => {
    //get student info
    //add student to state
  };

  render() {
    return (
      <div>
        <p>Students: {this.state.students}</p>
        <button onClick={this.addStudent}>Add Student</button>
      </div>
    );
  }
}
{% endhighlight %}

This is much nicer. Notice the change in the definition of `addStudent`. This is because of the nature of the keyword `this`. By using an arrow function in one of the 2 places we ensure that `this` refers to the instance of the Component `School` that we clicked. Alternatively what `this` refers to depends on how the function was called. To learn more click [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).

### Bonus tip - Get dev tools

The dev tools for [React](https://github.com/facebook/react-devtools) and [Redux](https://github.com/zalmoxisus/redux-devtools-extension) are very useful. React giving you information on what components have been rendered, their state and props. Redux lets you see the action history, with the full state and the action at each stage. You can also change the state of components and Redux store.

## Conclusion

To conclude React and Redux, are very useful but not magical. I started this project with no knowledge of React and these tips are the less obvious pieces of information I learnt. They are not essential to creating a working app which makes them easy to avoid/miss but they are very useful to make your code easier to deal with and cleaner to read.
