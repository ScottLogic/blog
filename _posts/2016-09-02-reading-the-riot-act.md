---
title: 'Reading the Riot Act: Exploring a Lightweight React Alternative'
date: 2016-09-02 00:00:00 Z
categories:
- Tech
author: dmiley
title-short: 'Riot: A React Alternative'
layout: default_post
summary: Migrating a Knockout project to a webpack redux application using Riot, and
  why I didn't use React.
---

<img style="display:block; margin: auto" src='{{ site.baseurl }}/dmiley/assets/riot-act.jpg' title="The Riot Act" />

In contrast to the above tome, Riot is a exceptionally lightweight javascript framework billed as a React alternative. I recently used it on a project of my own devising in order to explore its relative merits compared to its more illustrious cousin. The project as is is hosted [here](https://drewmiley.github.io/PoolLeague/). As you can see, it is a fairly unadorned data-display with several elements of interactivity.

### Invoking De Bono: Creating a Specification

If you followed the link above, you should be able to discern that I enjoy cuesports. The local league I compete in currently stores their data on one spreadsheet on one computer with no external access, with results reprinted and displayed every couple of weeks. There must be a better way!

Fed up with this needless bureaucracy, I set myself the task of improving this system. Putting my client hat on, I drew up a specification and set to work...

## Going for the knockout: Initial Implementation

In my initial implementation, I decided that I should try and get the system working as quickly and plainly as possible. Out of the front-end technologies I had worked with up until that point (Angular, d3, Knockout), there was one standout candidate. Its syntax seemed ready-made for the task I was attempting to accomplish. Here, the most challenging aspect was constructing my mental model of the data. This is the folder structure of the logic that I devised.

    +-- calculator
    |   +-- leagueFixtures.js
    |   +-- leagueTable.js
    +-- data
    |   +-- fixtures.js
    |   +-- gameWeek.js
    |   +-- matches.js
    |   +-- players.js
    +-- modify
    |   +-- fixtureFilter.js
    |   +-- fixtureGridFormatter.js
    |   +-- leagueSort.js
    |   +-- util.js
    +-- viewModel.js

This, along with implementing the data binding in the index.html [file](https://github.com/drewmiley/PoolLeague/blob/93ca232f32250999959fa2a3622e8e99525fc07b/index.html), was enough to get me a minimum viable product that conformed to my initial specifications.

## Moving on up: Migrating to a new technology stack

Having completed this; I started looking into React, and developed some ES6 projects using this alongside Redux and Webpack. My thoughts returned to my dormant application, and, given that I had gained working knowledge of more frameworks, I resolved to update it to use a set of new technologies. Looking at React, I could have gone for a vanilla implementation of the framework, however I decided to explore other options that were more suited to the scale, data and event structure of my project.  

### Running Riot: Selecting a javascript framework

Fairly quickly, I discovered [Riot](https://github.com/riot/riot). Its main selling points seemed to be it was simple to use and develop in, which was ideal for the scale of my application, and its approach to data binding, which seemed most reminiscent of Knockout.

Exploring various options, I selected Redux and Webpack as companion technologies to work with. This would make it easier to directly compare Riot with React.

### Quiet Riot: Clear syntax and intuitive tag structure

I found the syntax in Riot to be far less mysterious than it would be in a React component. Compare and contrast the following files:

`league-fixtures.tag`

    <league-fixtures>

        <table>
            <thead>
                <tr>
                    <th>Week</th>
                    <th>Home</th>
                    <th></th>
                    <th>V</th>
                    <th></th>
                    <th>Away</th>
                </tr>
            </thead>
            <tbody>
                <tr each={state.leagueFixturesFilter.filtered()}>
                    <td>{gameWeek}</td>
                    <td>{homePlayer}</td>
                    <td>{homeScore}</td>
                    <td>V</td>
                    <td>{awayPlayer}</td>
                    <td>{awayScore}</td>
                </tr>    
            </tbody>
        </table>

        <script>

            let store = this.opts.store;

            this.state = store.getState();

            store.subscribe(() => {
                this.state = store.getState();
                this.update();
            });

        </script>

    </league-fixtures>

`leagueFixtures.jsx`

    import React from 'react';

    import LeagueFixture from './LeagueFixture';

    export default class LeagueFixtures extends React.Component {
        constructor(props) {
            super(props);
            this.shouldComponentUpdate = function(nextProps, nextState) {
                return this.props.leagueFixtures !== nextProps.leagueFixtures;
            };
        }
        render() {
            return <table>
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Home</th>
                        <th></th>
                        <th>V</th>
                        <th></th>
                        <th>Away</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.leagueFixtures.filtered().map((leagueFixture) =>
                        <LeagueFixture key={leagueFixture.get('id')}
                            gameWeek={leagueFixture.get('gameWeek')}
                            homePlayer={leagueFixture.get('homePlayer')}
                            homeScore={leagueFixture.get('homeScore')}
                            awayPlayer={leagueFixture.get('awayPlayer')}
                            awayScore={leagueFixture.get('awayScore')} />
                    )}    
                </tbody>
            </table>
        }
    };

The first is my initial implementation in Riot of the league fixtures table list, and the second is my attempt at rewriting that in React. To me, it seems that that the `each` attribute offers a better way of looping over basic elements without being too heavily involved in the structure of the parameters required. Using this allowed me to avoid bloating my components folder (called 'tags' in Riot), and this allowed me to develop a knowledge of the code base quicker than in a similar-sized React application.

As you can see from the structure of the two files, the Riot tag appears to be an inverted React component. (Or alternatively, React components appear to be inverted Riot tags!) Personally, I found this structure much clearer to work with, as it gave greater exposure to the visual layout of a component, rather than the business logic. This choice is in keeping with Riot's ethos of usage in lightweight contexts similar to mine, but it does require strong discipline to keep logic out of the tags, as they would become unmanageable in a short space of lines. This was not a problem for me, as I was able to directly port my logic from the knockout implementation into my new src folder, and the only logic required was that of dispatching events to the Redux store.

### I predict a Riot: State mismanagement and lack of test support

Now for the bad news. Two main problems quickly became apparent when developing with Riot.

For someone spoilt on React's integration with [Immutable](https://github.com/facebook/immutable-js), Riot's lack of support for this was glaring. The structural ease offered by `each`, `if` and other attributes was significantly weakened by their inability to cope with accessing object properties in a way that React does not even blink at. In the end, I decided not to implement Immutable, as it would have had to have been diluted considerably in order to work. Again, this makes Riot fairly unsuitable for working with anything but simple data structures.

Along with this, Riot has little support for unit testing of tags. In this age of development, this is a major weakness. It led to me conducting most of my tests visually which, due to my intuition of the app, were seemingly sufficient. In any other circumstance, the confidence in the project would have been severely dented, and would most certainly have led to an unmanageable bug count.

## Retrospection

### The Secrets of the Masters: Why React?

<img style="display:block; margin: auto" src='{{ site.baseurl }}/dmiley/assets/catching-flies-with-chopsticks.png' title="A famous scene from the film The Karate Kid" />

In initially developing the app using Riot, I achieved a lot of success in writing my initial tags by imagining them as React components first, begging the question of what need I had for Riot. As I added features to the app, Riot's uses became apparent, but the analysis I arrived at was that React could do all that Riot could do, but the reverse cannot be said. In addition, as the more popular framework, React has far greater library support, significantly including the previously mentioned Immutable and Airbnb's [Enzyme](http://github.com/airbnb/enzyme), which both solve what Riot currently lacks.

Given that, I would suggest that if scalability is a priority, or if working in a fluid team environment, then React is the far better framework to use.

### Vive La Revolution: Why Riot?

<img style="display:block; margin: auto" src='{{ site.baseurl }}/dmiley/assets/vive-la-revolution.jpg' title="Liberté, égalité, fraternité" />

Having explored the Riot framework, it certainly has its relative merits over React. I wouldn't consider it to be a direct alternative to React however. In common with innumerable literary figures, I would regard Riot's biggest strength as its biggest weakness. The ease of syntax and shallow learning curve allow quick development of working applications in a relatively small space of time, however this comes at a cost. Attempting to turn such small-scale briefs into larger projects is very likely to lead to obfuscation of the code base and lengthy script tag, if rigid discipline is not enforced.

My conclusion would be that Riot is ideal for use with sites serving static data where user interactivity and the site's visual display are key, and, in such circumstances, I would not hesitate to pick this library again.
