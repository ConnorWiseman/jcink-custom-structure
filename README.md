# Jcink Custom Structure
A DOM manipulation library specifically designed for the Jcink hosted forum service.


## Table of Contents
1. [Changes](#changes)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Custom Index](#custom-index)
  1. [Custom Index Configuration Reference](#custom-index-configuration-reference)
  2. [Custom Index Key Reference](#custom-index-key-reference)
  3. [Custom Index Output Reference](#custom-index-output-reference)
5. [Custom Statistics](#custom-statistics)
  1. [Custom Statistics Configuration Reference](#custom-statistics-configuration-reference)
  2. [Custom Statistics Key Reference](#custom-statistics-key-reference)
  3. [Custom Statistics Output Reference](#custom-statistics-output-reference)
6. [Custom Profile](#custom-profile)
7. [Custom Topics](#custom-topics)
8. [Custom Posts](#custom-posts)


## Changes
* Inbuilt support for legacy browsers has been dropped.
* The script has been rewritten to take advantage of prototypal inheritance.
* The majority of the replacement keys have been renamed.
* The behavior of absent values has been changed.
* The Custom Index module doesn't require `<!-- |input_act| -->`.
* The Custom Stats module now supports IBStore statistics.
* The Custom Profile module no longer supports friends, comments, or visitors.
* The `target` configuration property is no longer required for any module.
* A module for customizing the appearance of posts in a topic list has been added.


## Installation
Place [cs.min.js](https://github.com/ConnorWiseman/jcink-custom-structure/blob/master/src/cs.min.js) in the page header inside your Board Wrappers.
```html
<head>
    <script src="https://raw.githubusercontent.com/ConnorWiseman/jcink-custom-structure/master/src/cs.min.js"></script>
</head>
```


## Configuration
Configuration is handled on a per-module basis by passing in an optional object, `config`, as a property in each module's `initialize` method argument. For reference, all objects used by the Custom Structure script are [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Creating_objects).

Here, a brief usage demonstration is provided to point users in the right direction.
```html
<% BOARD %>
<script>
customIndex.initialize({
    config: {
        insertBefore: 'This will be inserted before every category.',
        insertAfter: 'This will be inserted after every category.'
    },
    html: 'Your markup here!'
});
</script>
```
The accepted configuration properties are detailed for each module in their respective sections below.


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
|`target`|The `id` attribute of the `<% BOARD %>` wrapper tag's container element. As noted in the changes section, the `target` configuration property is no longer required but including it can provide a minor boost to performance. Consider using it to be an official recommendation.|`board`|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`insertBefore`|Content to be inserted before a new category. Does nothing if left blank.|Blank.|
|`insertAfter`|Content to be inserted after a new category. Does nothing if left blank.|Blank.|
|`viewingDefault`|The default number of people viewing a given forum([X members are viewing](http://jcink.com/main/wiki/jfb-acp-system-settings#cpu_saving) must be enabled).|`0`|
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

|Key|Description|
|---|-----------|
|`{{forumMarker}}`|The forum's marker, including the "Mark this forum as read?" link if available.|
|`{{forumTitle}}`|A link to the forum, containing the forum's title.|
|`{{forumViewing}}`|The number of people viewing the forum.|
|`{{forumId}}`|The forum's numerical id.|
|`{{forumDescription}}`|The forum's description.|
|`{{subforums}}`|The list of subforums the forum contains.|
|`{{moderators}}`|The list of users and user groups assigned to moderate the forum.|
|`{{topicCount}}`|The number of topics in the forum.|
|`{{replyCount}}`|The number of replies in the forum.|
|`{{lastPostDate}}`|The date of the last post in the forum.|
|`{{lastPostTitle}}`|A link to the last post in the forum, containing the title of the topic the last post was made in.|
|`{{lastPostURL}}`|The URL pointing to the last post made in the forum.|
|`{{lastPostAuthor}}`|A link to the author of the last post in the forum if available; otherwise, a string containing the name of the guest who made the post.|


### Custom Index Output Reference
```html
<!-- The default markup generated by IPB 1.3.1 begins here. -->
<div id="cat-#" class="tableborder category">
    <div class="maintitle" align="left">Category Title</div>
    <div id="cat_#" style="">
        <!-- The markup generated by Custom Structure begins here. -->
        <div id="category-#" class="new-category">
            <div class="new-category-before">
                <!-- Will only be inserted if 'insertBefore' is defined in 'config'. -->
            </div>

            <div id="row-#" class="new-row">
                <!--
                    One of these will be inserted for each row. It will use the
                    user-defined value passed to 'html' for key replacement.
                 -->
            </div>

            <div class="new-category-after">
                <!-- Will only be inserted if 'insertBefore' is defined in 'config'. -->
            </div>
        </div>
        <!-- The markup generated by Custom Structure ends here. -->
    </div>
</div>
```


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


### Custom Statistics Configuration Reference
|Property|Description|Default|
|--------|-----------|-------|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|


### Custom Statistics Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.

|Key|Description|
|---|-----------|
|`{{totalUsers}}`|The total number of users online.|
|`{{totalUsersGuests}}`|The number of guests online.|
|`{{totalUsersRegistered}}`|The number of registered users online.|
|`{{totalUsersAnonymous}}`|The number of anonymous users online.|
|`{{onlineList}}`|A comma-separated list of online users.|
|`{{onlineLegend}}`|The built-in [user group legend](http://jcink.com/main/wiki/member_legend).|
|`{{activityLinkClick}}`|A link to the online list, sorted by last click.|
|`{{activityLinkMemberName}}`|A link to the online list, sorted by member name.|
|`{{birthdays}}`|The number of birthdays being celebrated today.|
|`{{birthdaysList}}`|A list of users celebrating their birthday today, including their age.|
|`{{events}}`|A list of events being observed.|
|`{{totalPosts}}`|The total number of posts on the forum.|
|`{{totalMembers}}`|The total number of members on the forum.|
|`{{newestMember}}`|A link to the newest member.|
|`{{mostOnline}}`|The most users ever online at once.|
|`{{mostOnlineDate}}`|The date when the most users were on.|
|`{{onlineToday}}`|The number of users online today.|
|`{{onlineTodayList}}`|A comma-separated list of the users who have been online today.|
|`{{mostOnlineOneDay}}`|The most users ever online in one day.|
|`{{mostOnlineDateOneDay}}`|The date when the most users ever online in one day occurred.|
|`{{storeProducts}}`|The number of products in the store.|
|`{{storeValue}}`|The total value of all the products in the store.|
|`{{moneyTotal}}`|The total amount of money on the forum.|
|`{{moneyBanked}}`|The amount of money in the forum's bank.|
|`{{moneyCirculating}}`|The amount of money outside the forum's bank.|
|`{{richestMember}}`|A link to the wealthiest member.|
|`{{richestMemberValue}}`|The value of the wealthiest member.|


### Custom Statistics Output Reference
```html
<!-- The default markup generated by IPB 1.3.1 begins here. -->
<div id="boardstats" class="tableborder">
    <div class="maintitle">Board Statistics</div>
    <!-- The markup generated by Custom Structure begins here. -->
    <div id="new-statistics">
        <!--
            The user-defined value passed to 'html' will be used for
            key replacement to determine what is inserted here.
         -->
    </div>
    <!-- The markup generated by Custom Structure ends here. -->
</div>
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


### Custom Profile Configuration Reference
|Property|Description|Default|
|--------|-----------|-------|
|`htmlEnabled`||`false`|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`emailDefault`||`'Click here'`|
|`messageDefault`||`'Click here'`|
|`reputationIncrease`||`'+'`|
|`reputationDecrease`||`'-'`|
|`warnIncrease`||`'+'`|
|`warnDecrease`||`'-'`|
|`reputationDetails`||`[details &gt;&gt;]'`|
|`avatarDefault`||`''`|
|`userPhotoDefault`||`''`|


### Custom Profile Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.

|Key|Description|
|---|-----------|
|`{{userId}}`||
|`{{userPhoto}}`||
|`{{userName}}`||
|`{{postCount}}`||
|`{{postsPerDay}}`||
|`{{joinDate}}`||
|`{{localTime}}`||
|`{{onlineStatus}}`||
|`{{onlineActivity}}`||
|`{{sendEmail}}`||
|`{{userSkype}}`||
|`{{userAIM}}`||
|`{{userGtalk}}`||
|`{{userYahoo}}`||
|`{{userMSN}}`||
|`{{sendMessage}}`||
|`{{homePage}}`||
|`{{birthday}}`||
|`{{location}}`||
|`{{interests}}`||
|`{{lastActivity}}`||
|`{{customField1}}`||
|`{{memberGroup}}`||
|`{{memberTitle}}`||
|`{{avatar}}`||
|`{{reputationTotal}}`||
|`{{reputationIncrease}}`||
|`{{reputationDecrease}}`||
|`{{reputationDetails}}`||
|`{{warnLevel}}`||
|`{{warnLevelIncrease}}`||
|`{{warnLevelDecrease}}`||
|`{{signature}}`||

### Custom Profile Output Reference
```html

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