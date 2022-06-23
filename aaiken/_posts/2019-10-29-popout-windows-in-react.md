---
author: aaiken
title: Popout Windows in React
summary: >-
  In a React app, opening and sharing data with a new (non-modal) window might seem like a challenge, but it's possible - and I've provided a component to make it even simpler.
tags:
  - react
categories:
  - Tech
layout: default_post
---

As part of a project I'm working on, I recently needed to open a new (non-modal) window to display some information to the user. If this was desktop development, which I'm generally more familiar with, this would be easy, but I didn't think there was any way to do it in a single-page React app.

As it turns out, it's actually very simple - as long as you're using React v16 or higher.

React 16 introduced Portals. Whereas a typical React component renders its HTML as a child of its parent node, a component which uses a Portal allows you to render the HTML *anywhere*. You'd usually use this to create a floating tooltip or menu somewhere else in the DOM hierarchy, which is pretty clever in itself, but *anywhere* can also encompass a totally separate DOM - which is what we're going to do here.

Let's cut to the chase - here's the source code for a component I've put together that you can add into your project more or less as-is. Quick caveat: I'm using typescript rather than plain javascript but I'm sure you can make any adjustments you need.

{% highlight typescript %}
import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
    title: string;                          // The title of the popout window
    closeWindow: () => void;                // Callback to close the popout
}

interface State {
    externalWindow: Window | null;          // The popout window
    containerElement: HTMLElement | null;   // The root element of the popout window
}

export default class Popout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            externalWindow: null,
            containerElement: null
        };
    }

    // When we create this component, open a new window
    public componentDidMount() {
        const features = 'width=800, height=500, left=300, top=200';
        const externalWindow = window.open('', '', features);

        let containerElement = null;
        if (externalWindow) {
            containerElement = externalWindow.document.createElement('div');
            externalWindow.document.body.appendChild(containerElement);

            // Copy the app's styles into the new window
            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach(stylesheet => {
                const css = stylesheet as CSSStyleSheet;

                if (stylesheet.href) {
                    const newStyleElement = document.createElement('link');
                    newStyleElement.rel = 'stylesheet';
                    newStyleElement.href = stylesheet.href;
                    externalWindow.document.head.appendChild(newStyleElement);
                } else if (css && css.cssRules && css.cssRules.length > 0) {
                    const newStyleElement = document.createElement('style');
                    Array.from(css.cssRules).forEach(rule => {
                        newStyleElement.appendChild(document.createTextNode(rule.cssText));
                    });
                    externalWindow.document.head.appendChild(newStyleElement);
                }
            });

            externalWindow.document.title = this.props.title;

            // Make sure the window closes when the component unloads
            externalWindow.addEventListener('beforeunload', () => {
                this.props.closeWindow();
            });
        }

        this.setState({
            externalWindow: externalWindow,
            containerElement: containerElement
        });
    }

    // Make sure the window closes when the component unmounts
    public componentWillUnmount() {
        if (this.state.externalWindow) {
            this.state.externalWindow.close();
        }
    }

    public render() {
        if (!this.state.containerElement) {
            return null;
        }

        // Render this component's children into the root element of the popout window
        return ReactDOM.createPortal(this.props.children, this.state.containerElement);
    }
}
{% endhighlight %}

Your first question will probably be 'How do I use this?' I've got you covered. Here are the relevant bits of a component that uses the `Popout` component.

{% highlight typescript %}
// We need a state field to govern whether the popout is shown or not
constructor() {
    this.state = {
        showPopout: false
    };
}

// This sets the above state variable
private setPopoutOpen(open: boolean) {
    this.setState({
        showPopout: open
    });
}

// When this component is unloaded, make sure we close the popout
public componentDidMount() {
    window.addEventListener('beforeunload', () => {
        this.setPopoutOpen(false);
    });
}

// This returns the HTML for the popout, or null if the popout isn't visible
private getPopout() {
    if (!this.state.showPopout) {
        return null;
    }

    return (
        <Popout title='Your Popout Title' closeWindow={() => this.setPopoutOpen(false)}>
            <div>YOUR POPOUT CONTENT HERE</div>
        </Popout>
    );
}

// Render the popout and a button to show / hide it
public render() {
    return (
        <div>
            {this.getPopout()}
            <button onClick={() => this.setPopoutOpen(!this.state.showPopout)}>
                toggle popout
            </button>
        </div>
    );
}
{% endhighlight %}

I imagine most of that is self-explanatory if you've worked with React before - it's more or less just a state variable, a setter for it, and a `render()` method.

The two things I want to draw your attention to are:

* The content for the popout window all lives in the component that controls the popout, and not in the `Popout` component itself.
* Leading on from this, the owner component and the popout window share the same state. This is huge - you don't need to do any work to sync anything.

It's at about this point that the word 'popout' no longer looks like a real word to me.

Hopefully that's been useful!
