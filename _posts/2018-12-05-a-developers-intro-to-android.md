---
title: A Developer's Intro to Android
date: 2018-12-05 00:00:00 Z
categories:
- jporter
- Tech
tags:
- Android
- Intro
summary: Hi, I'm James. I recently worked on an Android project for Scott Logic and
  want to share with you some of my tips for starting out as an app developer. If
  you are a developer wanting to learn how to code Android apps then this article
  is for you.
author: jporter
layout: default_post
---

## Introduction

Hi, I'm James. I recently worked on an Android project for Scott Logic and want to share with you some of my tips for starting out as an app developer. If you are a developer wanting to learn how to code Android apps, then this article is for you.

Android devices now account for [85% of the global mobile market](https://www.idc.com/promo/smartphone-market-share/os), and mobile has recently overtaken desktop as the platform of choice for users. Android is here to stay and will become far more prominent in future as more users shift to mobile for the [majority of their computing needs](https://edubirdie.com/blog/mobile-vs-desktop-usage-study). The rise of challenger banks has shifted the focus of personal banking to mobile-first solutions, a trend which is reflected in most other industries. It is vital therefore that developers learn how to code Android apps well so that the increase in demand for the platform can be met. This article is an overview of some of the key points that I wish I had known when starting out learning Android, and I hope it is helpful for you.

Android is undergoing a period of rapid development and Google is showing no signs of slowing down. This is illustrated by the annual releases of Android, which are named in alphabetical order after sweets and desserts. The most recent version is Android 9, Pie. This rapid pace of development means that there is a lack of good (or any) documentation for the most recent Android features, even on Stack Overflow, which can mean a frustrating experience for developers. Unit testing is also difficult; however, the development experience is being continuously improved though regular changes to the Android ecosystem.

Android Jetpack is one of those improvements. Released in 2018, Jetpack is Google’s way of giving developers direction in how to write apps. It used to be the case that you were given free rein to code in whichever way you thought best, but understandably Google has realised that giving developers direction and a recommended architecture means shorter lead times and higher developer productivity.

The code examples given in this article are all written in [Kotlin](https://kotlinlang.org/), which is Google's recommended language for Android development. Personally, I can highly recommend Kotlin for Android development as it has significant benefits over Java. If you are interested in exploring new technologies, then [have a look at the differences between Kotlin and Java](https://www.netguru.co/blog/kotlin-java-which-one-you-should-choose-for-your-next-android-app) so you can weigh the pros and cons of using it.

## Architecture Overview

### Recommended Structure

You can design an Android app any way you like, however Google has published several guides on what they consider to be the optimal app design. This diagram shows my interpretation of these guides.

![Android Architecture Overview](%7B%7Bsite.baseurl%7D%7D/jporter/assets/ArchitectureOverview.png)

At the top there is an activity. Only one of these can be active at once, and they serve as entry points to the app. Next there are fragments, which are reusable layouts like activities, but differ in that they can be embedded within activities, or other fragments. As activities and fragments are very similar (they are both essentially a page), there is some discussion online about where a single-activity (and multiple fragment) or multi-activity (and single fragment) app is best. The conclusion I have come to is that you should have one activity for every entry point to the app that you need and use fragments for all other use cases. On my first Android project, my team and I designed our app to have two activities; a login activity and a main app activity. The latter contained fragments for various pages, and each of these in turn contained more fragments for smaller components of the UI.

The next level down from a fragment is a view. Every component on the screen is a view, from text boxes to lists to buttons. These views are controlled from within an activity or fragment and receive their data from view models. Each fragment or activity that needs to display data in views has a corresponding view model to provide that data. The distinction between view and view model comes from the [Model-View-Controller (MVC)](https://www.tutorialspoint.com/design_pattern/mvc_pattern.htm) design pattern and is especially important in Android for effective testing. Unit testing cannot easily be done on Android views and components, so separating out view model code is essential. I will discuss this in more detail in a future article.

While each activity or fragment corresponds to one view model, each view model can depend on many repositories. A repository is a standard and consistent interface between the data layer (which can change between versions of the app) and the view models. It can assemble data from a range of sources such as an SQL database, in-memory cache or API requests, and present these data with a consistent interface for their view models. Therefore, you as a developer can change the data layer without affecting the rest of the app.

### Lifecycle

A key concept when working with activities and fragments is [lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle). The lifecycle of an activity or fragment, or sometimes views (lifecycle owners) comprises 6 states, and a number of method calls that run at specific points after their creation or before their destruction. These states are; `CREATED`, `STARTED`, `RESUMED`, `PAUSED`, `STOPPED`, `DESTROYED`. The `onEvent(..)` methods run before their corresponding events and act as transitions between these states, as shown in the diagram below.

![Android Lifecycle Overview](%7B%7Bsite.baseurl%7D%7D/jporter/assets/LifecycleOverview.png)

Lifecycle aware components (such as views) will behave differently in each state. For example, LiveData will be ACTIVE only when the lifecycle owner is in the `STARTED` or `RESUMED` states. This is discussed further below, along with an explanation of what LiveData is.

It is very important to understand the lifecycle of [activities](https://developer.android.com/reference/android/app/Activity) and [fragments](https://developer.android.com/guide/components/fragments) in detail. One case from my own work that illustrates this is that I was initialising a view in the `onCreate()` method of a fragment. When the user navigated away from that fragment (page) it became `PAUSED`. However, its view was `DESTROYED`. When the user navigated back to that fragment, the view would be re-created but not re-initialised. This was because my initialisation code would only run once when the fragment itself was created, not when the view was created. This bug took a long time to understand and fix, but it could have been avoided by an in-depth understanding of the Android lifecycle. In this instance, I was using LiveData (discussed below), which is a lifecycle aware component. To make it work I had to associate it with the viewLifeCycleOwner (view) rather than the lifeCycleOwner (fragment). This problem took a long time to solve as there was no documentation online at all referring to this, except one line in a blog post. This illustrates my point that there is a lack of good Android documentation, especially for the newer features like this one which was released in 2018.

### Room Database

Android Jetpack contains the [Room persistence library](https://developer.android.com/topic/libraries/architecture/room), which allows access to an SQLite database. This library allows you to create a local cache of data on the user's device enabling the app to be used even when there is no internet connection. Each table within the database must have a Database Access Object (DAO) which contains the SQL queries needed to interact with it.

    @Dao
    interface UserDao {
        @Query("SELECT * FROM User")
        fun getAll(): LiveData<List<User>>
    
        @Query("SELECT * FROM User WHERE id IN (:userIds) LIMIT 1")
        fun loadById(userId: Int): LiveData<User>
    
        @Insert
        fun insertAll(vararg users: User)
    
        @Delete
        fun delete(user: User)
    }

These query methods can return either standard data types or LiveData wrappers, which are discussed below.

This code example defines the data structure for each row of the table; the entity. It has a primary key, and each row has a column name equal to its variable name unless otherwise specified.

    @Entity
    data class User(
        @PrimaryKey
        val id: String,
        val username: String,
        @ColumnInfo(name = "first_name")
        val firstName: String,
        val surname: String,
        val balance: Float
    )

The `data class` in this example is a [feature of the Kotlin language](https://kotlinlang.org/docs/reference/data-classes.html). The compiler automatically generates several functions, such as an `equals()` and `hashCode()` pair that will evaluate two `User` instances with the same field values to be equal.

## Resources

All the content for your app should be stored within [XML files in the resources package](https://developer.android.com/guide/topics/resources/providing-resources). This includes UI layouts, colours, fonts and strings, and other resources. Layout files can correspond to an activity, fragment or view, or can be included within other layout files. [Android Studio has a visual layout editor](https://developer.android.com/studio/write/layout-editor) that you can use to design these layouts, which is a lot easier than editing the XML directly.

![Layout Editor](%7B%7Bsite.baseurl%7D%7D/jporter/assets/ResourceLayoutFile.PNG)

One reason resources are abstracted out of the code into separate XML files is so that different resources can be provided for different builds of the app. For example, using this system it is easy to translate your app into French or to cater to different screen sizes. In the past, all these different variants would be installed on every user's phone, but now you can publish your app as a "bundle", which allows Google Play to install only the necessary resources on a device. This can significantly reduce the size of your published app.

An issue I have found when designing these layouts is the vast number of possible layouts that can be used, all of which behave differently; positioning views on the screen can be difficult if you have no experience with Android. I found it useful spending a lot of time understanding these different layouts and views, and how they interact, so I recommend that if you are starting out with Android you do the same.

## Key Components

### LiveData

Data container that will push updates to subscribers when the data changes.
The LiveData object needs to reference to these subscribers – other objects will “observe” the LiveData
This Observer function will run each time the value of `mLiveData` changes, if it is in the ACTIVE state.

    mLiveData.observe(this, Observer {
        when (it) {
            0 -> zero()
            1 -> one()
            null -> mLiveData.postValue(0)  //Initialise
            else -> many()
        }
    })

#### Lifecycle-aware

As discussed above, there are 6 lifecycle states of any activity, fragment or view. To observe a LiveData object you need to provide a lifecycle owner (`this` in the above example), which could be an activity, fragment or a special viewLifeCycleOwner object. The LiveData will be `ACTIVE` when the lifecycle owner is either `STARTED` or `RESUMED`, but it will be `INACTIVE` in any of the other four states. What this means is that the LiveData object will only notify its observers of any changes when it is `ACTIVE`, or once it becomes `ACTIVE`. Consequently, these observer callbacks can be written in the `onCreate()` method of a lifecycle owner even if they depend on code written in the `onStart()` method (which comes afterwards) because they will not run until after `onStart()` has run and the state is `STARTED`.

#### MutableLiveData

LiveData objects are inherently immutable, however there is a child class called MutableLiveData that can be mutated at run time. This is the most useful form of LiveData as it can be easily manipulated by the developer. MutableLiveData can be converted to LiveData (immutable) when returning it from a getter function, which is good because it forces a greater degree of modularity in your app.

    fun getLiveData(): LiveData<Int> = mLiveData

#### MediatorLiveData

Another child class of LiveData is MediatorLiveData, which enables the developer to combine two LiveData sources into one. This is useful if you have a LiveData with a username, and another with a display name, but you want to combine them into one "User" object without altering the rest of the codebase.

#### State Machine UI

LiveData becomes especially useful when designing stateful user interfaces. If an enumerator is used as the LiveData type, a when statement can be written inside of the observable callback that can control different UI states. If this LiveData comes from a single source of truth, this is a powerful tool for controlling the states of an application and avoiding bugs. A stateful approach to app design, using LiveData, can simplify complex problems and reduce frustration surrounding debugging; the following example illustrates how to do this.

    enum class UIState {
        INIT,
        LOADING,
        ERROR,
        SUCCESS
    }
    
    private val loginState: MutableLiveData<UIState> = MutableLiveData()
    
    loginState.observe(this, Observer {
        loadingSpinner.visibility = if (it == UIState.INIT) View.VISIBLE else View.GONE
        errorMessage.visibility = if (it == UIState.ERROR) View.VISIBLE else View.GONE
        successMessage.visibility = if (it == UIState.SUCCESS) View.VISIBLE else View.GONE
    })

#### Transformations

LiveData can be transformed using the Transformations library. This allows the developer to modify the value of the LiveData every time it changes, before pushing those changes to the observers.

In this example, the function `getLiveData()` uses `Transformations.map()` to filter out all odd values from `mLiveData` before it is returned in the function.

    fun getLiveData(): LiveData<Int> = Transformations.map(mLiveData) {
        when {
            it % 2 == 0 -> it
            else -> null
        }
    }

#### Resource

*Not to be confused with XML resources.*

There are many components which are recommended by Google but are not a part of Android. One of these is the Resource class. A Resource (distinct from resources, which are XML files including layout and strings) is a data wrapper, which contains the state of the data in addition to the data itself. Resources can be in one of three states: `LOADING`, `ERROR` and `SUCCESS`, and are immutable by design, so a new `LOADING` resource must be created by the developer if they want to convert an `ERROR` resource into the `LOADING` state. Combined with LiveData this is a powerful tool for informing a fragment when to display a loading spinner, and when to display data (and what to display). Therefore, the ideal type for a data object is as follows.

    val mLiveData: LiveData<Resource<Int>>

### RecyclerView

Recycler views are essentially optimised lists. They are highly configurable and can form grids, simple lists, lists of cards and tabs. They are optimised such that only the items on screen (and those just off screen) are loaded, everything else is removed from memory. This allows you to set a recycler view to display a list of 1000 album covers without there being a large drop in performance.

To do anything complex or unique with the recycler view is a complex task, and often requires an in-depth understanding of the component. There is little official, and limited unofficial documentation, that can be found to explain how to fully customise a recycler view which is a big disadvantage of the component.

## Challenges and Learnings

The main challenge I have faced when developing for Android is dealing with the rapid pace of change within the platform. Although it is good that Android is continuously improving, these changes have not been properly documented by Google, occasionally resulting in a frustrating development experience. Additionally, examples are lacking for the newer and more complex components, even on Stack Overflow, which slows down the pace of development. However, I expect that once these newer features are adopted by the Android community the amount of useful information available online will increase dramatically.

Unit testing is currently difficult on Android, which is why it is important to separate out your untestable Android-specific view code from your testable model code and business logic. The distinction between view and view model is very helpful for this purpose.

I discovered that personally I prefer Kotlin to Java, as it has significant improvements over its predecessor. While most code examples online are written in Java, Android Studio has a useful feature where it can convert this code to Kotlin when you paste it into the editor. This was very helpful in my development work and enables Java developers to easily transition to using Kotlin.

## Conclusion

I hope you have enjoyed this article and that it has proved a useful starting point on your journey as an Android app developer. Android is a very dominant platform and the ability to code apps is only becoming more valuable over time, so I encourage you to learn this important skill.

## Further Reading

Have a look at these links if you would like to learn more about Android.

[Android Developer Guides](https://developer.android.com/guide/) -
[MVC Design Pattern](www.tutorialspoint.com/design_pattern/mvc_pattern.htm) -
[Activities](https://developer.android.com/reference/android/app/Activity) -
[Fragments](https://developer.android.com/guide/components/fragments) -
[Room Persistence Library](https://developer.android.com/topic/libraries/architecture/room) -
[Lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle) -
[Kotlin](https://kotlinlang.org/) -
[XML Resources](https://developer.android.com/guide/topics/resources/providing-resources) -
[Android Studio Layout Editor](https://developer.android.com/studio/write/layout-editor)