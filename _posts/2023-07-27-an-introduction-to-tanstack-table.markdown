---
title: An Introduction to TanStack Table
date: 2023-07-27 08:00:00 Z
categories:
- Tech
summary: 'There are a plethora of datagrid and table solutions available for JavaScript
  applications, but it can still be tough to find one that does exactly what you need.
  In this post, I provide an introduction to an option you might not have considered:
  using the table library that doesn''t actually provide a table at all.'
author: jmacdonald
---

There is no particular shortage of datagrid and table libraries for JavaScript projects. From powerful enterprise solutions like [Ag Grid](https://www.ag-grid.com/), to the spreadsheet-like [Handsontable](https://handsontable.com/), to stylish components like [MUI's Table](https://mui.com/material-ui/react-table/).

## Why are there so many?

There are so many solutions because every table library represents a compromise of some kind or another. For instance, on a recent project, I found myself in a position where I wanted to get a datagrid up and running quickly with a couple of standard features (row grouping and multiple nested header rows), but the design I was working to was extremely unique.

Ag Grid seemed like a good choice due to its support for seemingly every grid feature a user could think of, but the design I was working to presented significant challenges to replicate using Ag Grid due to how far the design deviated from the library's default look and feel.

While researching alternate grid libraries, I stumbled across [TanStack Table](https://tanstack.com/table/v8) (formerly React Table). I found its unique approach to be a great fit for my project, and I'm here to explain how it might be a good fit for yours too.

## What is TanStack Table?

TanStack Table is an open-source JavaScript datagrid library with adapters for React, Vue, Svelte, and Solid. It supports many of the same features as other popular grid libraries, such as:

* Filtering and sorting

* Aggregation

* Nested/Grouped Headers

* Custom cell rendering

* Server-side data

So what makes it different from any of the other libraries I've mentioned? TanStack Table is a **headless** table library.

## What is a headless table library?

A headless table library is one which provides no components or markup whatsoever. To explain what that means, let's look at a basic Ag Grid example, written in React:

~~~ tsx
return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}>
    </AgGridReact>
)
~~~
[Working Example](https://codesandbox.io/s/ag-grid-react-hello-world-9pnf3n?file=/src/App.js)

Ag Grid provides a grid **component** which we pass data and column definitions to. The same basic React example written with TanStack Table would look something like this:

~~~ tsx
return (
    <table>
        <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                    <th key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </th>
                    ))}
                </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
            ))}
        </tbody>
        <tfoot>
            {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                    {footerGroup.headers.map(header => (
                    <th key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                            )}
                    </th>
                    ))}
                </tr>
            ))}
        </tfoot>
    </table>
)
~~~
[Working Example](https://tanstack.com/table/v8/docs/examples/react/basic)

## Hey, that's way more complicated!

Good point: the TanStack version seems much more complicated. However, if we break it down a little we can start to see what this unique approach provides. Starting from the top, the first thing you'll notice is that, as promised, there are no library-provided components here. This is just a vanilla HTML `<table>`. That means there are no built-in styles to override, and we can customise the markup in whichever way we choose.

Of course, theoretically we could use any elements we like here as Tanstack Table doesn't have an opinion. However, using a `<table>` allows us to be more clear about the component's content, and does mean we get to take advantage of automatic cell and header aligning.

The value of TanStack Table is that it provides functions and data structures we can use to render our own table components. Let's take a closer look at the row rendering:

~~~ tsx
return (
    <tbody>
        {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                ))}
            </tr>
        ))}
    </tbody>
)
~~~

`table` is the Tanstack-provided representation of our table (we'll look at how this object is created later). All we're doing here is getting all the rows to be rendered by calling `getRowModel`, looping through them, and rendering a `<tr>` element for each row. Then, within each row, we're looping through all the cells which should be visible by calling `getVisibleCells`, and rendering them as `<td>` elements.

Within each `<td>` you'll see that we're calling a function called `flexRender`. To explain how this works, we need to go back a step, to the creation of our column definitions:

~~~ tsx
const columns = [
  columnHelper.accessor('firstName', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    cell: info => <MyCustomCell>{info.getValue()}</MyCustomCell>,
  }),
]
~~~

The `columnHelper` here is just providing a typesafe way of creating column definitions based on the data model being used. The property on each column I want to focus on here is the **cell** property. You can see that TanStack allows us to pass a function that takes an `info` object. This object is basically just a set of props which can be used to inform how the cell should be rendered; for instance, the function `info.getValue` will return the cell's underlying value, and so the `firstName` cells will simply display the value of the `firstName` property of the row's data. The `lastName` column, on the other hand, provides a function that returns the value enclosed by our own React component `MyCustomCell`.

This `cell` property of the column is what's being passed to `flexRender`, along with the props (as `info`). The `flexRender` function is then responsible for rendering this cell, irrespective of whether it is a single value or a custom React component.

## What does this all add up to?

With TanStack Table we have **complete control** over our markup and styles - we can render our table as a basic html `<table>` (should we so desire), and we can easily pass custom components to be rendered. In addition, you'll likely wrap a TanStack Table implementation in your own component, making it easy to define a simple Ag Grid-like API for it (just passing data and column definitions for a basic implementation) that can be reused across a codebase, while retaining the flexibility a headless library provides.

For my project (the one with the extremely unique styling) this was *ideal*; the ability to build the table's markup from scratch, rather than starting with an existing component as a base and gradually replacing and/or overriding pieces of it, allowed us to quickly build a completely custom table with a simple DOM structure.

## Is TanStack Table the right choice for {INSERT PROJECT HERE}?

Maybe! As previously mentioned, every table library represents some kind of compromise. For our project, we needed the total flexibility that a headless library provided. Need good-looking (if generic) styling quickly? You might be better-served by a different library.

In addition, with TanStack table there's often quite a bit more work which goes in to *actually implementing* a grid feature that it supports the use of. For instance, maybe you want to turn on per-column sorting that toggles between 'ascending', 'descending', and 'none' when the user clicks on a header? Well, in Ag Grid just make sure you've set `sortable` to `true` in your default column definition.

Want to do the same thing in TanStack Table? Well, you might need to change the column definitions too, but then you need to actually implement this feature in your grid. So, for every header that's not a placeholder you'll want to toggle the sorting for that column when the user clicks the header. You'll then need to supply your own arrow icon that points up or down (or disappears entirely) depending on the sorting. Before you know it you've got a header that looks like:
{% raw %}
~~~ tsx
return (
    <thead>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                    return (
                        <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                                <div
                                    {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none'
                                            : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: ' 🔼',
                                        desc: ' 🔽',
                                    }[header.column.getIsSorted() as string] ?? null}
                                </div>
                            )}
                        </th>
                    )
                })}
            </tr>
        ))}
    </thead>
)
~~~
{% endraw %}
[Working Example](https://tanstack.com/table/v8/docs/examples/react/sorting)

TanStack Table does help you out a little here by giving you easy access to a sorting toggle callback via the `getToggleSortingHandler` function, but it's still significantly more long-winded than just changing a property in the column definition.

Would this extra work be appropriate for your project? If you need absolute control over the styling and behaviour of the headers, then maybe. If not? Maybe try a different library.

## In summary

There isn't an easy answer to the question of which grid framework to use. Every project has a different set of requirements, and it's difficult for any table library to become a one-size-fits-all solution; developers are often in a position where they have to trade flexibility for out-of-the-box styling, or to balance their need for powerful features with the desire to get basic features working quickly.

Consider using TanStack Table if you:

* Want a lightweight solution

* Want total control over the markup and styling

Consider using something else if you:

* Want to easily turn on more advanced grid features

* Want a table that looks 'good' immediately

If you're trying to figure out which grid to choose, I recommend checking out TanStack Table. Yes, total control over markup is a double-edged sword, but depending on your use case it may be exactly what you need.