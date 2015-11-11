# Jcink Custom Structure
A DOM manipulation library specifically designed for the Jcink hosted forum service.


## Table of Contents
1. [Changes](#changes)
2. [Installation](#installation)
3. [Configuration](#configuration)
  1. [Execution Timers](#execution-timers)
4. [Custom Index](#custom-index)
  1. [Custom Index Configuration Reference](#custom-index-configuration-reference)
  2. [Custom Index Key Reference](#custom-index-key-reference)
  3. [Custom Index Output Reference](#custom-index-output-reference)
5. [Custom Statistics](#custom-statistics)
  1. [Custom Statistics Configuration Reference](#custom-statistics-configuration-reference)
  2. [Custom Statistics Key Reference](#custom-statistics-key-reference)
  3. [Custom Statistics Output Reference](#custom-statistics-output-reference)
6. [Custom Profile](#custom-profile)
  1. [Custom Profile Configuration Reference](#custom-profile-configuration-reference)
  2. [Custom Profile Key Reference](#custom-profile-key-reference)
    1. [Custom Profile Fields](#custom-profile-fields)
  3. [Custom Profile Output Reference](#custom-profile-output-reference)
7. [Custom Topics](#custom-topics)
  1. [Custom Topics Configuration Reference](#custom-topics-configuration-reference)
  2. [Custom Topics Key Reference](#custom-topics-key-reference)
  3. [Custom Topics Output Reference](#custom-topics-output-reference)
8. [Custom Posts](#custom-posts)
  1. [Custom Posts Configuration Reference](#custom-posts-configuration-reference)
  2. [Custom Posts Key Reference](#custom-posts-key-reference)
  3. [Custom Posts Output Reference](#custom-posts-output-reference)
9. [Advanced Usage](#advanced-usage)
  1. [String and Function Comparison](#string-and-function-comparison)
  2. [hasValue Method](#hasvalue-method)
  3. [getValue Method](#getValue-method)
  4. [Example](#example)


## Changes
* Multiple bugfixes and optimization tweaks.
* Inbuilt support for legacy browsers has been dropped.
* The script has been rewritten to take advantage of prototypal inheritance.
* The majority of the replacement keys have been renamed.
* The behavior of absent values has been changed.
* The Custom Index module doesn't require `<!-- |input_act| -->`.
* The Custom Stats module now supports IBStore statistics.
* The Custom Profile module no longer supports friends, comments, or visitors.
* The `target` configuration property is no longer required for any module.
* A module for customizing the appearance of posts inside a topic has been added.


## Installation
Host a copy of [cs.min.js](https://github.com/ConnorWiseman/jcink-custom-structure/blob/master/src/cs.min.js) and place it in the page header inside your Board Wrappers.
```html
<head>
    <script src="cs.min.js"></script>
</head>
```
A hosted copy is available for free courtesy of Elegant Expressions:
* [http://elegantexpressions.us/black/cs.min.js](http://elegantexpressions.us/black/cs.min.js)


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
    html: '{{forumTitle}}<br />This will be inserted for every forum.'
});
</script>
```
The accepted configuration properties are detailed for each module in their respective sections below.

### Execution Timers
Each module also accepts an optional `time` property that, if set to true, will log the execution time of the module to the browser console.
```html
<% BOARD %>
<script>
customIndex.initialize({
    time: true,
    html: 'Your markup here!'
});
</script>
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
|`{{redirectHits}}`|The number of hits a redirect forum has received.|
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

            <div id="row-#" class="new-row has-new-posts">
                <!--
                    If a forum contains new posts, it will have the class name
                    .has-new-posts automatically added to its output.
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
|`htmlEnabled`|If `true`, Custom Structure will parse the user's interests field for HTML and output it accordingly. Although the Jcink service does not parse the interests field for malicious code on its own, the parsing method used here is [XSS-safe](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet#RULE_.236_-_Populate_the_DOM_using_safe_JavaScript_functions_or_properties). Script and style tags in the interests field will not affect the page.|`false`|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`emailDefault`|The default text used in the user's email link.|`Click here`|
|`messageDefault`|The default text used in the user's personal message link.|`Click here`|
|`reputationIncrease`|The default text used in the user's reputation increase link.|`+`|
|`reputationDecrease`|The default text used in the user's reputation decrease link.|`-`|
|`reputationDetails`|The default text used in the user's reputation details link.|`[details >>]`|
|`warnIncrease`|The default text used in the user's warning increase link.|`+`|
|`warnDecrease`|The default text used in the user's warning decrease link.|`-`|
|`avatarDefault`|An image URL to use in place of the user's avatar if the user does not have an avatar.|Blank.|
|`userPhotoDefault`|An image URL to use in place of the user's photo if the user does not have a photo.|Blank.|
|`onlineActivityDefault`|The default text used to describe a user's online activity when they are currently offline.|Blank.|


### Custom Profile Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.

|Key|Description|
|---|-----------|
|`{{userId}}`|The user's numerical id.|
|`{{userPhoto}}`|The URL of the user's photo. Not an image.|
|`{{userName}}`|The user's name.|
|`{{postCount}}`|The user's post count.|
|`{{postsPerDay}}`|The number of posts made per day.|
|`{{joinDate}}`|The date the user joined.|
|`{{localTime}}`|The user's local time.|
|`{{onlineStatus}}`|Online or offline.|
|`{{onlineActivity}}`|If the user is online, what they were doing last.|
|`{{sendEmail}}`|A link to send the user an email.|
|`{{userSkype}}`|The user's Skype.|
|`{{userAIM}}`|The user's AIM.|
|`{{userGtalk}}`|The user's Gtalk.|
|`{{userYahoo}}`|The user's YIM.|
|`{{userMSN}}`|The user's MSN.|
|`{{sendMessage}}`|A link to send the user a personal message.|
|`{{homePage}}`|A link to the user's home page.|
|`{{birthday}}`|The user's birthday.|
|`{{location}}`|The user's location.|
|`{{interests}}`|The user's interests. May contain HTML.|
|`{{lastActivity}}`|The time when the user was last active.|
|`{{userGroup}}`|The user's group name.|
|`{{userTitle}}`|The user's member title.|
|`{{avatar}}`|The URL of the user's avatar. Not an image.|
|`{{reputationTotal}}`|The user's reputation count.|
|`{{reputationIncrease}}`|A link to increase the user's reputation.|
|`{{reputationDecrease}}`|A link to decrease the user's reputation.|
|`{{reputationDetails}}`|A link to the user's reputation details.|
|`{{warnLevel}}`|The user's warn level.|
|`{{warnLevelIncrease}}`|A link to increase the user's warn level.|
|`{{warnLevelDecrease}}`|A link to decrease the user's warn level.|
|`{{signature}}`|The user's signature.|


#### Custom Profile Fields
Custom Structure cannot read the database that powers the Jcink service and it is not aware which custom profile fields are assigned which id internally. Instead, it reads them in the order they appear on the user's profile. Therefore, hiding certain custom profile fields from everyone but staff members will have an impact on the appearance of your custom profiles. If you intend to use custom profile fields please keep this in mind.

|Key|Description|
|---|-----------|
|`{{customFieldn}}`|The nth custom profile field visible on the user's profile.|

```html
<% BOARD %>
<script>
customProfile.initialize({
    html: 'First custom field: {{customField1}}<br />Second custom field: {{customField2}}'
});
</script>
```


### Custom Profile Output Reference
```html
<!-- The default markup generated by IPB 1.3.1 begins here. -->
<div id="innerwrapper">
    <script type="text/javascript" language="Javascript">...</script>
    <!-- The markup generated by Custom Structure begins here. -->
    <div id="new-profile">
        <!--
            The user-defined value passed to 'html' will be used for
            key replacement to determine what is inserted here.
         -->
    </div>
    <!-- The markup generated by Custom Structure ends here. -->
</div>
```


## Custom Topics
Reads both topic lists inside forums and the active topics search page for important values, then performs replacement and insertion.
```html
<% BOARD %>
<script>
customTopics.initialize({
    html: 'Your markup here!'
});
</script>
```


### Custom Topics Configuration Reference
|Property|Description|Default|
|--------|-----------|-------|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`announcementsDefault`|The default text used for the announcements row.|`Announcements`|
|`pinnedDefault`|The default text used for the pinned topics row.|`Important Topics`|
|`regularDefault`|The default text used for the regular topics row.|`Forum Topics`|
|`noTopics`|The text displayed when a forum contaions no topics.|`No topics were found. This is either because there are no topics in this forum, or the topics are older than the current age cut-off.`|
|`noActiveTopics`|The text displayed when the active topics list is blank.|`There were no active topics during those date ranges`|
|`paginationDefault`|The text displayed when there are no pagination options.|Blank.|


### Custom Topics Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.

|Key|Description|
|---|-----------|
`{{folder}}`|The topic's folder (new replies, locked, etc).|
`{{marker}}`|The topic's marker (pinned).|
`{{topicId}}`|The topic's numerical id.|
`{{topicTitle}}`|A link to the topic, including the topic's title.|
`{{pagination}}`|The topic's pagination links.|
`{{topicDescription}}`|The topic's description.|
`{{topicAuthor}}`|A link to the topic's author.|
`{{replyCount}}`|The number of replies to this topic.|
`{{viewCount}}`|The number of views this topic has received.|
`{{lastReplyDate}}`|The date of the last reply to this topic.|
`{{lastReplyAuthor}}`|A link to the author of the last reply to this topic.|
`{{moderatorCheckbox}}`|The checkbox used for moderating this topic. Invisible to regular members and guests. If you forget to include it somewhere, the topic moderation options form below the topic list will be useless.|


### Custom Topics Output Reference
```html
<!-- The default markup generated by IPB 1.3.1 begins here. -->
<div id="topic-list" class="tableborder">
    <div class="maintitle">Forum Title</div>
    <form method="POST" name="mod_topics" action="...">
        <input id="tact" type="hidden" value="close" name="tact" />
        <!-- The markup generated by Custom Structure begins here. -->
        <div id="new-topics">
            <div class="topic-title-row">Announcements</div>
            <div class="topic-row announcement-topic">
                <!--
                    One of these will be inserted for each announcement.
                    The user-defined value passed to 'html' will be used for
                    key replacement to determine what is inserted here.
                -->
            </div>
            <div class="topic-title-row">Important Topics</div>
            <div class="topic-row pinned-topic">
                <!--
                    One of these will be inserted for each pinned topic.
                    The user-defined value passed to 'html' will be used for
                    key replacement to determine what is inserted here.
                -->
            </div>
            <div class="topic-title-row">Forum Topics</div>
            <div class="topic-row regular-topic">
                <!--
                    One of these will be inserted for each regular topic.
                    The user-defined value passed to 'html' will be used for
                    key replacement to determine what is inserted here.
                -->
            </div>
        </div>
        <!-- The markup generated by Custom Structure ends here. -->
        <div class="darkrow2" style="padding:6px"># User(s) are browsing this forum</div>
        <div class="row2" style="padding:6px"></div>
    </form>
    ...
</div>
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


### Custom Posts Configuration Reference
|Property|Description|Default|
|--------|-----------|-------|
|`keyPrefix`|The default prefix for replacement keys.|`{{`|
|`keySuffix`|The default suffix for replacement keys.|`}}`|
|`permaLinkDefault`|The default text used in post permalinks.|`Permalink`|
|`postSignatureDefault`|The default text used for signatures.|Blank.|


### Custom Posts Key Reference
**Note:** The keys will be different if the `keyPrefix` or `keySuffix` configuration properties have been overridden with user-defined values.

|Key|Description|
|---|-----------|
|`{{postId}}`|The post's numerical id.|
|`{{postAuthor}}`|A link to the post's author, or a string with the name of the guest who made the post.|
|`{{permaLink}}`|A permanent link to the post.|
|`{{postDate}}`|The date the post was made.|
|`{{postButtonsTop}}`|The buttons above the post.|
|`{{postCheckbox}}`|The checkbox used for moderating this post. Invisible to regular members and guests. If you forget to include it somewhere, the topic moderation options form below the topic list will be useless.|
|`{{postMiniprofile}}`|The miniprofile to the left of the post.|
|`{{postContent}}`|The main post content.|
|`{{postSignature}}`|The signature below the post.|
|`{{postIp}}`|The IP address associated with the post. Invisible to regular members and guests.|
|`{{postButtonsBottom}}`|The buttons below the post.|


### Custom Posts Output Reference
```html
<!-- The default markup generated by IPB 1.3.1 begins here. -->
<div class="tableborder">
    <div class="maintitle">Topic Title</div>
    <div class="postlinksbar" align="right"></div>
    <!-- The markup generated by Custom Structure begins here. -->
    <div id="new-posts">
        <div id="entry#" class="new-post" name="entry#">
        <!--
            One of these will be inserted for each post.
            The user-defined value passed to 'html' will be used for
            key replacement to determine what is inserted here.
        -->
        </div>
    </div>
    <!-- The markup generated by Custom Structure ends here. -->
    <div class="activeuserstrip"># User(s) are reading this topic</div>
    <div class="row2" style="padding:6px;"></div>
    <div class="activeuserstrip" align="center"></div>
    <div align="center" style="margin-bottom:3px;"></div>
</div>
```

## Advanced Usage
The `html` property passed to any of the modules can be either a string or a function that returns a string. Although the use of a function will provide additional flexibility, they are somewhat slower. This performance overhead is compounded in the Custom Index, Custom Topics, and Custom Posts modules because they perform multiple reads and inserts. Functions are useful when more fine-tuned behavior is desired, since pure JavaScript can be added to introduce user-defined behavior based on the values provided by the modules.

### String and Function Comparison
The following two examples will produce equivalent output.
```html
<% BOARD %>
<script>
customIndex.initialize({
    html: 'Your markup here!'
});
</script>
```

```html
<% BOARD %>
<script>
customIndex.initialize({
    html: function() {
        return 'Your markup here!';
    }
});
</script>
```

### hasValue Method
Each module includes a built-in method for checking whether a specified value exists if users wish to define additional behavior or should the default defaulting options prove restrictive. The argument passed to `hasValue` should not include `keySuffix` or `keyPrefix`.
```html
<% BOARD %>
<script>
customIndex.initialize({
    html: function() {
        var output = 'Your markup here! ';
        if (this.hasValue('forumMarker')) {
            output += 'This forum has a marker.';
        } else {
            /*
                All forums will always have a marker by default, but if
                the macros for forum markers have been left blank this
                should appear for forums that contain no posts in them.
             */
            output += 'This forum has no marker.';
        }
        return output;
    }
});
</script>
```

### getValue Method
Each module also includes a method for retrieving the value of a specific key for direct manipulation. The argument passed to `getValue` should not include `keySuffix` or `keyPrefix`. The following two examples will produce equivalent output.
```html
<% BOARD %>
<script>
customIndex.initialize({
    html: function() {
        var output = 'Your markup here! ';
        if (this.hasValue('forumMarker')) {
            output += '{{forumMarker}}';
        }
        return output;
    }
});
</script>
```

```html
<% BOARD %>
<script>
customIndex.initialize({
    html: function() {
        var output = 'Your markup here! ';
        if (this.hasValue('forumMarker')) {
            /*
                It is possible to access values this way, but it is not
                advised. Relying on the built-in replacement functions,
                as in the previous example, is a better option.
             */
            output += this.getValue('forumMarker');
        }
        return output;
    }
});
</script>
```

### Example
Because the internal values are all strings, they can be manipulated via [JavaScript's string methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_instances) once they are retrieved.
```html
<% BOARD %>
<script>
customIndex.initialize({
    html: function() {
        var output = '{{forumTitle}}<br />',
            title = this.getValue('forumTitle');
        if (title.indexOf('Example') !== -1) {
            output += 'This forum\'s title contains the word "Example"';
        }
        return output;
    }
});
</script>
```