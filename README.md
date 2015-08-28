# Jcink Custom Structure
A DOM manipulation library specifically designed for the Jcink hosted forum service.

## Table of Contents
1. [Major Changes](#major-changes)
2. [Basic Usage](#basic-usage)
3. [Modules](#modules)
  1. [Custom Index](#custom-index)
  2. [Custom Statistics](#custom-statistics)
  3. [Custom Profile](#custom-profile)
  4. [Custom Topics](#custom-topics)
  5. [Custom Posts](#custom-posts)

## Major Changes
* Inbuilt support for legacy browsers has been dropped.
* The script has been rewritten to take advantage of prototypal inheritance.
* The majority of the replacement keys have been renamed.
* The behavior of absent values has been changed.
* The Custom Index module no longer relies on `<!-- |input_act| -->`.
* The `target` configuration property is no longer required for any module.
* A module for customizing the appearance of posts in a topic list has been added.

## Basic Usage
1. Place [cs.min.js](https://github.com/ConnorWiseman/jcink-custom-structure/blob/master/src/cs.min.js) in the page header inside your Board Wrappers.

   ```html
   <head>
       <script src="https://raw.githubusercontent.com/ConnorWiseman/jcink-custom-structure/master/src/cs.min.js"></script>
   </head>
   ```

2. Call the desired `initialize` methods after the `<% BOARD %>` wrapper tag.

   ```html
   <% BOARD %>
   <script>
   module.initialize({
       html: 'Your markup here!'
   });
   </script>
   ```

3. Read this documentation. The new `cs.js` is incompatible with previous versions by design.

## Modules
### Custom Index
Reads each category on the forum index, each forum inside a subcategory, and the list of subforums inside a forum for important values, then performs replacement and insertion.  As noted in the major changes section, the `target` configuration property is not required but including it can provide a minor boost to performance. Consider using it an official recommendation.
#### Without `target`
    ```html
    <% BOARD %>
    <script>
    customIndex.initialize({
        html: 'Your markup here!'
     });
     </script>
     ```
#### With `target`
    ```html
    <div id="board-container"><% BOARD %></div>
    <script>
    customIndex.initialize({
        config: {
            target: 'board-container'
        },
        html: 'Your markup here!'
     });
     </script>
     ```
### Custom Statistics
### Custom Profile
### Custom Topics
### Custom Posts