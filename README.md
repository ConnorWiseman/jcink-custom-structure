# Jcink Custom Structure
A DOM manipulation library specifically designed for the Jcink hosted forum service.


## Table of Contents
1. [Changes](#changes)
2. [Installation](#installation)
3. [Custom Index](#custom-index)
  1. [Custom Index Configuration Reference](#custom-index-configuration-reference)
  2. [Custom Index Key Reference](#custom-index-key-reference)
4. [Custom Statistics](#custom-statistics)
5. [Custom Profile](#custom-profile)
6. [Custom Topics](#custom-topics)
7. [Custom Posts](#custom-posts)


## Changes
* Inbuilt support for legacy browsers has been dropped.
* The script has been rewritten to take advantage of prototypal inheritance.
* The majority of the replacement keys have been renamed.
* The behavior of absent values has been changed.
* The Custom Index module no longer relies on `<!-- |input_act| -->`.
* The `target` configuration property is no longer required for any module.
* A module for customizing the appearance of posts in a topic list has been added.


## Installation
Place [cs.min.js](https://github.com/ConnorWiseman/jcink-custom-structure/blob/master/src/cs.min.js) in the page header inside your Board Wrappers.
```html
<head>
    <script src="https://raw.githubusercontent.com/ConnorWiseman/jcink-custom-structure/master/src/cs.min.js"></script>
</head>
```


## Custom Index
Reads each category on the forum index, each category inside a subcategory, and the list of subforums inside a forum for important values, then performs replacement and insertion.
```html
<% BOARD %>
<script>
customIndex.initialize({
    html: 'Your markup here!'
});
</script>
```


### Custom Index Configuration Reference
|Property|Description|Default|
|--------|-----------|-------|
|`target`|The `id` attribute of the element that contains the `<% BOARD %>` wrapper tag. As noted in the major changes section, the `target` configuration property is no longer required but including it can provide a minor boost to performance. Consider using it, or wrapping `<% BOARD %>` in an element with an `id` of `board`, to be an official recommendation.|`board|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`insertBefore`|Content to be inserted before a new category. Does nothing if left blank.|Blank.|
|`insertAfter`|Content to be inserted after a new category. Does nothing if left blank.|Blank.|
|`viewingDefault`|The default number of people viewing a given forum([X members are viewing](http://jcink.com/main/wiki/jfb-acp-system-settings#cpu_saving)).|`0`|
|`subforumSeparator`|The default subforum separator.|`, `|
|`subforumsNone`|The default indicator for no subforums.|Blank.|
|`moderatorsNone`|The default indicator for no moderators.|Blank.|
|`dateDefault`|The default date for last posts.|`--`|
|`titleDefault`|The default title for last posts.|`----`|
|`urlDefault`|The default URL for last posts.|`#`|
|`authorDefault`|The default author for last posts.|Blank.|
|`passwordTitle`|The default title of topics in password-protected forums.|`Protected Forum`|


### Custom Index Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.
* `{{forumMarker}}` - The forum's marker, including the "Mark this forum as read?" link if available.
* `{{forumTitle}}` - A link to the forum, containing the forum's title.
* `{{forumViewing}}` - The number of people viewing the forum.
* `{{forumId}}` - The forum's numerical id.
* `{{forumDescription}}` - The forum's description.
* `{{subforums}}` - The list of subforums the forum contains.
* `{{moderators}}` - The list of users and user groups assigned to moderate the forum.
* `{{topicCount}}` - The number of topics in the forum.
* `{{replyCount}}` - The number of replies in the forum.
* `{{lastPostDate}}` - The date of the last post in the forum.
* `{{lastPostTitle}}` - A link to the last post in the forum, containing the title of the topic the last post was made in.
* `{{lastPostURL}}` - The URL pointing to the last post made in the forum.
* `{{lastPostAuthor}}` - A link to the author of the last post in the forum if available; otherwise, a string containing the name of the guest who made the post.


## Custom Statistics
Reads the forum statistics for important values, then performs replacement and insertion.
```html
<% BOARD %>
<script>
customStats.initialize({
    html: 'Your markup here!'
});
</script>
```


## Custom Profile
Reads a user profile page for important values, then performs replacement and insertion. The Custom Profile module reads both the default IPB profile and the personal portal style profiles the same way.
```html
<% BOARD %>
<script>
customProfile.initialize({
    html: 'Your markup here!'
});
</script>
```


## Custom Topics
Reads the topic list inside a forum for important values, then performs replacement and insertion.
```html
<% BOARD %>
<script>
customTopics.initialize({
    html: 'Your markup here!'
});
</script>
```


## Custom Posts
Reads the posts in a topic for important values, then performs replacement and insertion. The Custom Posts module is new in this release.
```html
<% BOARD %>
<script>
customPosts.initialize({
    html: 'Your markup here!'
});
</script>
```