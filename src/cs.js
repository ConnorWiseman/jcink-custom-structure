/**
 * @file
 * A DOM manipilation utility library for the version of IPB running on the
 * free forum hosting service, Jcink, that reads table information and accepts
 * a user-defined template for text replacement. Allows for the structuring
 * of forums in nontraditional, table-less layouts. Visible credits are not
 * required provided this entire comment block remains intact.
 * @author      Connor Wiseman
 * @copyright   2012-2015 Connor Wiseman
 * @version     1.5.14 (November 2015)
 * @license
 * Copyright (c) 2012-2015 Connor Wiseman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

 // Enforce strict interpretation for compatibility reasons.
'use strict';


/**
 * @namespace
 */
var $cs = $cs || {
    /**
     * Extends the prototype of a child object given a parent object to
     * inherit from.
     * @arg {object} child
     * @arg {object} parent
     * @readonly
     */
    extendModule: function(child, parent) {
        child.prototype = new parent;
        child.prototype.constructor = child.prototype.myParent;
    },


    /**
     * @namespace
     * @property {object} module
     * @property {object} module.Default
     * @property {object} module.Index
     * @property {object} module.Stats
     * @property {object} module.Profile
     * @property {object} module.Topics
     * @property {object} module.Posts
     * @readonly
     */
    module: {
        Default: function() {},
        Index:   function() {},
        Stats:   function() {},
        Profile: function() {},
        Topics:  function() {},
        Posts:   function() {}
    }
};


/**
 * @property {boolean} time     - Whether or not to run performance timers on script execution.
 */
$cs.module.Default.prototype.time = false;


/**
 * @property {string} html      - User-defined HTML markup for replacement.
 */
$cs.module.Default.prototype.html = '';


/**
 * @property {object} values    - Script-defined keys mapped to user-defined values for replacement.
 */
$cs.module.Default.prototype.values = {};


/**
 * Retrieves the value of the specified key from the existing values.
 * @arg {string} key            - The name of the key to retrieve.
 * @return {string}             - The value associated with the key.
 * @readonly
 */
$cs.module.Default.prototype.getValue = function(key) {
    var key = this.config.keyPrefix + key + this.config.keySuffix;
    return this.values[key];
};


/**
 * Checks the existing values for the presence of a specified key.
 * @arg {string} key            - The name of the key to check for.
 * @return {boolean}            - True if value exists, false otherwise.
 * @readonly
 */
$cs.module.Default.prototype.hasValue = function(key) {
    var key = this.config.keyPrefix + key + this.config.keySuffix;
    return (this.values[key] && this.values[key] !== '');
};


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Default.prototype.initialize = function(settings) {
    // Make sure we have an object to work with.
    settings = settings || {};

    // If we have an empty settings object, display an error message and return false.
    if (!Object.keys(settings).length) {
        console.error(this.name + ': init method missing required argument "settings"');
        return false;
    }

    /*
        For each key in our settings object, if it's not in the list of reserved names,
        overwrite the properties (and methods, I suppose) in the module.
     */
    for (var key in settings) {
        if (this.reserved.indexOf(key) === -1) {
            // Go one level deeper if one of the properties is an object.
            if (typeof settings[key] === 'object') {
                for (var subkey in settings[key]) {
                    if (key in this) {
                        this[key][subkey] = settings[key][subkey];
                    }
                }
            } else if (key in this) {
                this[key] = settings[key];
            }
        }
    }

    /*
        If this.html isn't null or empty, execute the script. Otherwise, display an
        error message and return false.
     */
    if (this.html && this.html !== '') {
        // Execution timers.
        if (this.time) {
            console.time(this.name);
        }

        // Reinitialize the values object so it's blank for the next pass.
        this.values = {};
        this.execute();

        // Execution timers.
        if (this.time) {
            console.timeEnd(this.name);
        }
    } else {
        console.error(this.name + ': required property "html" is undefined');
        return false;
    }
};


/**
 * String replacement function.
 * @arg {string} string         - A text string for replacement.
 * @arg {object} object         - An object of keys and values to use during replacement.
 * @return {string}
 * @readonly
 */
$cs.module.Default.prototype.replaceValues = function(string, object) {
    // Join the keys with the pipe character for regular expression matching.
    var regex = new RegExp(Object.keys(object).join('|'), 'g');
    // Find and replace the keys with their associated values, then return the string.
    return string.replace(regex, function(matched) {
        return object[matched];
    });
};


/**
 * Sets a specified key to a specified value.
 * @arg {string} key            - The key to set.
 * @arg {*}      value          - The value to be set.
 * @readonly
 */
$cs.module.Default.prototype.setValue = function(key, value) {
    this.values[this.config.keyPrefix + key + this.config.keySuffix] = value;
}


// Extend the custom index module with the default properties and methods.
$cs.extendModule($cs.module.Index, $cs.module.Default);


/**
 * @namespace
 * @property {object} config                   - Default configuration values.
 * @property {string} config.target            - The default container element.
 * @property {string} config.keyPrefix         - The default prefix for value keys.
 * @property {string} config.keySuffix         - The default suffix for value keys.
 * @property {string} config.insertBefore      - The default content to be inserted before a new category.
 * @property {string} config.insertAfter       - The default content to be inserted after a new category.
 * @property {string} config.subforumSeparator - The default subforum separator.
 * @property {string} config.subforumsNone     - The default indicator for no subforums.
 * @property {string} config.moderatorsNone    - The default indicator for no moderators.
 * @property {string} config.dateDefault       - The default date for last posts.
 * @property {string} config.titleDefault      - The default title for last posts.
 * @property {string} config.urlDefault        - The default URL for last posts.
 * @property {string} config.authorDefault     - The default author for last posts.
 * @property {string} config.passwordTitle     - The default title of topics in password-protected forums.
 */
$cs.module.Index.prototype.config = {
    target:             'board',
    keyPrefix:          '{{',
    keySuffix:          '}}',
    insertBefore:       '',
    insertAfter:        '',
    viewingDefault:     '0',
    subforumSeparator:  ', ',
    subforumsNone:      '',
    moderatorsNone:     '',
    dateDefault:        '--',
    titleDefault:       '----',
    urlDefault:         '#',
    authorDefault:      '',
    passwordTitle:      'Protected Forum'
};


/**
 * @property {string} name      - The name of this module.
 */
$cs.module.Index.prototype.name = '$cs.module.Index';


/**
 * @property {object} reserved  - An array of reserved names.
 */
$cs.module.Index.prototype.reserved = [
    'values',
    'makeLink',
    'execute',
    'getValue',
    'hasValue',
    'initialize',
    'readTable',
    'replaceValues',
    'setValue'
];


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Index.prototype.execute = function() {
    /*
        Acquire the container, if one is specified, and then see which kind
        of page we're looking at.
     */
    var container = document.getElementById(this.config.container),
        subforumlist = document.getElementById('subforum-list'),
        categories = (container || document).getElementsByClassName('category');
    if (categories.length) {
        /*
            If there are categories, we're looking at the forum index.
            Loop through each category's table individually.
         */
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i].lastChild.previousSibling,
                table = category.firstElementChild;
            this.readTable(table, i)
        }
    } else if (subforumlist) {
        /*
            If there's a subforumlist, we're inside a forum with only
            one category and table to deal with. No looping necessary.
         */
        var table = subforumlist.firstElementChild;
        this.readTable(table, 0);
    }
};


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Index.prototype.initialize = function(settings) {
    // Call $cs.module.Default's initialize method instead.
    $cs.module.Default.prototype.initialize.call(this, settings);
};


/**
 * Converts an anchor element to flat HTML markup.
 * @arg {object} element
 * @return {string}
 * @readonly
 */
$cs.module.Index.prototype.makeLink = function(element) {
    return '<a href=\'' + element + '\'>' + element.innerHTML + '<\/a>';
};


/**
 * Reads the rows from a supplied table, generates a new category from the user-defined HTML template, and
 * injects the new category into the page.
 * @arg {object} table          - A reference to an HTML table object.
 * @arg {number} index          - The numerical index of the current category.
 * @readonly
 */
$cs.module.Index.prototype.readTable = function(table, index) {
    // Acquire all the rows in the table.
    var rows = table.getElementsByTagName('tr');

    // Temporarily hide the table. It will be removed altogether later on.
    table.style.display = 'none';

    // Create a variable to store the HTML output of the following loop.
    var categoryContent = '';

    // Add any content intended to be inserted before every category.
    if (this.config.insertBefore && this.config.insertBefore !== '') {
        categoryContent += '<div class="new-category-before">' + this.config.insertBefore + '</div>';
    }

    /*
        Loop through each row in the table except the first and the last,
        which are only used for layout and are useless for this script.
     */
    for (var j = 1, numRows = rows.length - 1; j < numRows; j++) {
        // Acquire all the cells in the row, then begin reading in the necessary values.
        var cells = rows[j].getElementsByTagName('td');
        this.setValue('forumMarker', cells[0].innerHTML);
        this.setValue('forumTitle', cells[1].firstElementChild.innerHTML);

        // If "(X Viewing)" is enabled, make sure to account for it.
        var viewing = cells[1].getElementsByClassName('x-viewing-forum')[0];
        if (viewing) {
            this.setValue('forumViewing', viewing.innerHTML.split('(')[1].split(' Vi')[0]);
        } else {
            this.setValue('forumViewing', this.config.viewingDefault);
        }

        this.setValue('forumId', this.values['{{forumTitle}}'].split('showforum=')[1].split('" alt="')[0]);
        this.setValue('forumDescription', cells[1].getElementsByClassName('forum-desc')[0].innerHTML);

        // Subforums need a bit of extra processing.
        var subforums = cells[1].getElementsByClassName('subforums')[0],
            subforumList = '';
        if (subforums) {
            /*
                If this row contains subforums acquire all the anchors in the subforum
                element and loop over them to build a list. For some reason Jcink tosses
                in empty links here, so skip every other link.
             */
            var subforumLinks = subforums.getElementsByTagName('a');
            for (var k = 1, numLinks = subforumLinks.length; k < numLinks; k += 2) {
                // Build an HTML string out of the anchor object.
                var link = this.makeLink(subforumLinks[k]);

                /*
                    If this is the last link in the list (not counting the extra empty link),
                    then don't add the separator. Otherwise, the separator is necessary.
                 */
                if(k === numLinks - 1) {
                    subforumList += link;
                } else {
                    subforumList += link + this.config.subforumSeparator;
                }
            }
            this.setValue('subforums', subforumList);
        } else {
            // If this row does not contain any subforums, use the default instead.
            this.setValue('subforums', this.config.subforumsNone);
        }

        // Moderators also get processed a little differently.
        var moderators = cells[1].getElementsByClassName('forum-led-by')[0];
        if (moderators && moderators.textContent) {
            // If this row contains moderators, acquire everything after the useless intro string.
            this.setValue('moderators', moderators.innerHTML.split('Forum Led by:  ')[1]);
            this.setValue('redirectHits', 0);
        } else if (moderators) {
            // If it doesn't, but it could, set the number of redirects to zero.
            this.setValue('redirectHits', 0);
        } else {
            // If it doesn't, use the default instead.
            this.setValue('moderators', this.config.moderatorsNone);
            // Moderators are never shown on redirect forms, so it's convenient to do this:
            this.setValue('redirectHits', cells[4].textContent.split('Redirected Hits: ')[1]);
        }

        this.setValue('topicCount', cells[2].textContent);
        this.setValue('replyCount', cells[3].textContent);

        /*
            Last post content is processed together in a batch. If the cell contains a link,
            there's last post information. If not, use the default values.
         */
        var lastPost = cells[4],
            lastPostLinks = lastPost.getElementsByTagName('a');
        if (lastPostLinks.length > 0) {
            // If there are links, read the values on the page.
            this.setValue('lastPostDate', lastPost.childNodes[0].nodeValue);
            if (lastPost.textContent.indexOf('Protected Forum') === -1) {
                // If there are no italics, this forum is not password-protected.
                this.setValue('lastPostTitle', this.makeLink(lastPostLinks[1]));
                this.setValue('lastPostURL', lastPostLinks[1].href.slice(0, -16));
                if (lastPostLinks[2]) {
                    this.setValue('lastPostAuthor', this.makeLink(lastPostLinks[2]));
                } else {
                    this.setValue('lastPostAuthor', lastPost.textContent.split('By: ')[1]);
                }
            } else {
                // If there are italics, this forum is password-protected.
                this.setValue('lastPostTitle', this.config.passwordTitle);
                this.setValue('lastPostURL', this.config.urlDefault);
                this.setValue('lastPostAuthor', this.makeLink(lastPostLinks[0]));
            }
        } else {
            // If there are no links, use the default values.
            this.setValue('lastPostDate', this.config.dateDefault);
            this.setValue('lastPostTitle', this.config.titleDefault);
            this.setValue('lastPostURL', this.config.urlDefault);
            this.setValue('lastPostAuthor', this.config.authorDefault);
        }

        // If the forum marker contains a link, prepare to append a useful utility class to the output.
        var newPosts = '';
        if(this.values['{{forumMarker}}'].indexOf('<a ') !== -1) {
            newPosts = ' has-new-posts';
        }

        // Replace the keys in the user-defined HTML with the values read in by the script.
        categoryContent += '<div id="row-' + this.values['{{forumId}}'] + '" class="new-row' + newPosts + '">' +
                           this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values) + '<\/div>';
    }

    // Add any content intended to be inserted after every category.
    if (this.config.insertAfter && this.config.insertAfter !== '') {
        categoryContent += '<div class="new-category-after">' + this.config.insertAfter + '</div>';
    }

    // Create a new HTML element, set the appropriate attributes, and inject it into the page.
    var newCategory = document.createElement('div');
    newCategory.innerHTML = categoryContent;
    newCategory.id = 'category-' + (index + 1);
    newCategory.className = 'new-category';
    table.parentNode.appendChild(newCategory);

    // Remove the original table.
    table.parentNode.removeChild(table);
};


// Extend the custom stats module with the default properties and methods.
$cs.extendModule($cs.module.Stats, $cs.module.Default);


/**
 * @namespace
 * @property {object} config                   - Default configuration values.
 * @property {string} config.keyPrefix         - The default prefix for value keys.
 * @property {string} config.keySuffix         - The default suffix for value keys.
 */
$cs.module.Stats.prototype.config = {
    keyPrefix:          '{{',
    keySuffix:          '}}'
};


/**
 * @property {string} name      - The name of this module.
 */
$cs.module.Stats.prototype.name = '$cs.module.Stats';


/**
 * @property {object} reserved  - An array of reserved names.
 */
$cs.module.Stats.prototype.reserved = [
    'values',
    'execute',
    'getValue',
    'hasValue',
    'initialize',
    'replaceValues',
    'setValue'
];


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Stats.prototype.execute = function() {
    var boardStats = document.getElementById('boardstats');
    if (boardStats) {
        var table = boardStats.lastElementChild;
        // Hide the original table.
        table.style.display = 'none';

        // Acquire all the cells in the table.
        var cells = table.getElementsByTagName('td');

        /*
            Loop through all of the cells in the table in groups of three and read
            in the values. The order of the statistics can be arbitrary thanks to
            feature bloat, so a switch statement is used inside the loop to check
            which set of cells we're working with before proceeding. This does mean,
            unfortunately, that some of these case expressions are checked more than
            once. The redundant execution overhead is a small price to pay for
            accuracy.
         */
        for (var i = 0, numCells = cells.length; i < numCells; i += 3) {
            switch (true) {
                case (cells[i].textContent.indexOf('active in the past') !== -1):
                    // Total number of users online.
                    this.setValue('totalUsers', cells[i].textContent.split(' user')[0]);

                    // Individual online totals are divided into three parts.
                    var individualTotals = cells[i + 2].getElementsByTagName('b');
                    this.setValue('totalUsersGuests', individualTotals[0].textContent);
                    this.setValue('totalUsersRegistered', individualTotals[1].textContent);
                    this.setValue('totalUsersAnonymous', individualTotals[2].textContent);

                    // List of online users.
                    var onlineList = cells[i + 2].getElementsByClassName('thin')[0];
                    this.setValue('onlineList', onlineList.innerHTML.split('<br><br>')[0]);

                    // Member legend.
                    this.setValue('onlineLegend', onlineList.innerHTML.split('<br><br>')[1]);

                    // Useful links.
                    this.setValue('activityLinkClick', '<a href="/?act=Online&amp;CODE=listall&amp;sort_key=click">Last Click</a>');
                    this.setValue('activityLinkMemberName', '<a href="?act=Online&amp;CODE=listall&amp;sort_key=name&amp;sort_order=asc&amp;show_mem=reg">Member Name</a>');
                    break;

                case (cells[i].textContent.slice(0, 7) === 'Today\'s'):
                    // Today's birthdays.
                    var numBirthdays = cells[i + 2].getElementsByTagName('b');
                    if (numBirthdays.length > 1) {
                        this.setValue('birthdays', numBirthdays[0].textContent);
                        this.setValue('birthdaysList', cells[i + 2].innerHTML.split('<br />')[1]);
                    } else {
                        this.setValue('birthdays', '0');
                        this.setValue('birthdaysList', cells[i + 2].textContent);
                    }
                    break;

                case (cells[i].textContent.slice(0, 11) === 'Forthcoming'):
                    // Forthcoming events.
                    this.setValue('events', cells[i + 2].innerHTML);
                    break;

                case (cells[i].textContent.slice(0, 5) === 'Board'):
                    // The post and member statistics.
                    var statisticsItems = cells[i + 2].getElementsByTagName('b');
                    this.setValue('totalPosts', statisticsItems[0].textContent);
                    this.setValue('totalMembers', statisticsItems[1].textContent);
                    this.setValue('newestMember', statisticsItems[2].innerHTML);
                    this.setValue('mostOnline', statisticsItems[3].textContent);
                    this.setValue('mostOnlineDate', statisticsItems[4].textContent);
                    break;

                case (cells[i].textContent.slice(0, 7) === 'Members'):
                    // Online today total.
                    this.setValue('onlineToday', cells[i].textContent.split(': ')[1].split(' [')[0]);

                    // Members online today list.
                    this.setValue('onlineTodayList', cells[i + 2].innerHTML.split(':</span><br>')[1]);

                    // Members online today statistics.
                    var membersOnlineItems = cells[i + 2].getElementsByTagName('b');
                    this.setValue('mostOnlineOneDay', membersOnlineItems[0].textContent);
                    this.setValue('mostOnlineDateOneDay', membersOnlineItems[1].textContent);
                    break;

                case (cells[i].textContent.slice(0, 7) === 'IBStore'):
                    // IBStore totals.
                    var ibstoreItems = cells[i + 2].getElementsByTagName('b');
                    this.setValue('storeProducts', ibstoreItems[0].textContent);
                    this.setValue('storeValue', ibstoreItems[1].textContent);
                    this.setValue('moneyTotal', ibstoreItems[2].textContent);
                    this.setValue('moneyBanked', ibstoreItems[3].textContent);
                    this.setValue('moneyCirculating', ibstoreItems[4].textContent);
                    this.setValue('richestMember', ibstoreItems[5].innerHTML);
                    this.setValue('richestMemberValue', ibstoreItems[6].textContent);
                    break;
            }
        }

        // Create a new HTML element, set the appropriate attributes, and inject it into the page.
        var newStats = document.createElement('div');
        newStats.innerHTML = this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values);
        newStats.id = 'new-statistics';
        table.parentNode.appendChild(newStats);

        // Remove the original table.
        table.parentNode.removeChild(table);
    }
};


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Stats.prototype.initialize = function(settings) {
    // Call $cs.module.Default's initialize method instead.
    $cs.module.Default.prototype.initialize.call(this, settings);
};


// Extend the custom profile module with the default properties and methods.
$cs.extendModule($cs.module.Profile, $cs.module.Default);


/**
 * @namespace
 * @property {object}  config                       - Default configuration values.
 * @property {boolean} config.htmlEnabled           - Whether or not HTML is enabled in the interests field.
 * @property {string}  config.keyPrefix             - The default prefix for value keys.
 * @property {string}  config.keySuffix             - The default suffix for value keys.
 * @property {string}  config.emailDefault          - The default email link content.
 * @property {string}  config.messageDefault        - The default personal message link content.
 * @property {string}  config.reputationIncrease    - The default increase reputation link content.
 * @property {string}  config.reputationDecrease    - The default decrease reputation link content.
 * @property {string}  config.warnIncrease          - The default increase warning link content.
 * @property {string}  config.warnDecrease          - The default decrease warning link content.
 * @property {string}  config.reputationDetails     - The default reputation details link content.
 * @property {string}  config.avatarDefault         - The URL of a default avatar.
 * @property {string}  config.userPhotoDefault      - The URL of a default user photo.
 * @property {string}  config.onlineActivityDefault - The default online activity text.
 */
$cs.module.Profile.prototype.config = {
    htmlEnabled:           false,
    keyPrefix:             '{{',
    keySuffix:             '}}',
    emailDefault:          'Click here',
    messageDefault:        'Click here',
    reputationIncrease:    '+',
    reputationDecrease:    '-',
    warnIncrease:          '+',
    warnDecrease:          '-',
    reputationDetails:     '[details >>]',
    avatarDefault:         '',
    userPhotoDefault:      '',
    onlineActivityDefault: ''
};


/**
 * @property {string} name      - The name of this module.
 */
$cs.module.Profile.prototype.name = '$cs.module.Profile';


/**
 * @property {object} reserved  - An array of reserved names.
 */
$cs.module.Profile.prototype.reserved = [
    'values',
    'execute',
    'getValue',
    'hasValue',
    'initialize',
    'replaceValues',
    'setValue',
    'stringToMarkup'
];


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Profile.prototype.execute = function() {
    var portalStyle = document.getElementById('profile-heading'),
        defaultStyle = document.getElementById('profilename');
    // Check for personal portal style profiles first, since those are the default.
    if (portalStyle) {
        var table = portalStyle.parentNode.parentNode.parentNode.parentNode;

        // Acquire the elements needed to read the values in.
        var personalInfo = document.getElementById('profile-personalinfo'),
            customFields = document.getElementById('profile-customfields'),
            statistics   = document.getElementById('profile-statistics'),
            contactInfo  = document.getElementById('profile-contactinfo'),
            signature    = document.getElementById('sig_popup'),
            profileTop   = document.getElementById('profile-header');

        // Hide the original profile.
        table.style.display = 'none';

        // Get the user's id.
        var userId = location.href.split("?showuser=")[1];
        this.setValue('userId', userId);

        // personalInfo
        var personalInfoDivs = personalInfo.getElementsByTagName('div'),
            userPhoto = personalInfoDivs[2].getElementsByTagName('img')[0];
        if (userPhoto) {
            this.setValue('userPhoto', userPhoto.src);
        } else {
            this.setValue('userPhoto', this.config.userPhotoDefault);
        }
        var warnLevel = personalInfoDivs[4].textContent.split('%')[0];
        if (warnLevel !== '') {
            this.setValue('warnLevel', warnLevel);
            this.setValue('warnLevelIncrease', '<a href="/?act=warn&type=add&mid=' + userId + '">' + this.config.warnIncrease + '</a>');
            this.setValue('warnLevelDecrease', '<a href="/?act=warn&type=minus&mid=' + userId + '">' + this.config.warnDecrease + '</a>');
        }

        /*
            Reputation was wrapped in a div of its own for some reason between
            versions 1.5.3 and 1.5.4, so another offset is required here.
         */
        var reputationOffset = 0;
        if (personalInfoDivs[5].textContent !== 'Options') {
            reputationOffset = 1;
            var reputationTotal = personalInfoDivs[5].textContent.split('] ')[1].split(' pts')[0];
            if (reputationTotal !== '') {
                this.setValue('reputationTotal', reputationTotal);
                this.setValue('reputationIncrease', '<a href="/?act=rep&CODE=01&mid=' + userId + '&t=p">' + this.config.reputationIncrease + '</a>');
                this.setValue('reputationDecrease', '<a href="/?act=rep&CODE=02&mid=' + userId + '&t=p">' + this.config.reputationDecrease + '</a>');
                this.setValue('reputationDetails', '<a href="/?act=rep&CODE=03&mid=' + userId +'">' + this.config.reputationDetails + '</a>');
            }
        }
        this.setValue('userTitle', personalInfoDivs[10 + reputationOffset].textContent);
        this.setValue('location', personalInfoDivs[12 + reputationOffset].textContent.split('Location: ')[1]);
        this.setValue('birthday', personalInfoDivs[13 + reputationOffset].textContent.split('Born: ')[1]);
        this.setValue('homePage', personalInfoDivs[14 + reputationOffset].innerHTML.split('Website: ')[1]);
        if (this.config.htmlEnabled) {
            this.setValue('interests', this.stringToMarkup(personalInfoDivs[16 + reputationOffset].innerHTML));
        } else {
            this.setValue('interests', personalInfoDivs[16 + reputationOffset].innerHTML);
        }

        // customFields
        var customFieldsDivs = customFields.getElementsByTagName('div');
        for (var i = 1, numCustomFieldsDivs = customFieldsDivs.length; i < numCustomFieldsDivs; i++) {
            this.setValue('customField' + i, customFieldsDivs[i].textContent.split(': ')[1]);
        }

        // statistics
        var statisticsDivs = statistics.getElementsByTagName('div');
        this.setValue('joinDate', statisticsDivs[1].textContent.split('Joined: ')[1]);
        this.setValue('onlineStatus', statisticsDivs[2].textContent.split('(')[1].split(')')[0]);
        if (statisticsDivs[2].textContent.split('(')[1].split(')')[0].indexOf('Offline') === -1) {
            this.setValue('onlineActivity', statisticsDivs[2].textContent.split(') (')[1].split(')')[0]);
        } else {
            this.setValue('onlineActivity', this.config.onlineActivityDefault);
        }
        this.setValue('lastActivity', statisticsDivs[3].textContent.split(': ')[1]);
        this.setValue('localTime', statisticsDivs[4].textContent.split(': ')[1]);
        this.setValue('postCount', statisticsDivs[5].textContent.split('posts')[0]);
        this.setValue('postsPerDay', statisticsDivs[5].textContent.split('(')[1].split(' per')[0]);

        // Create a new HTML element, set the appropriate attributes, and inject it into the page.

        // contactInfo
        var contactInfoDivs = contactInfo.getElementsByTagName('div');
        this.setValue('userAIM', contactInfoDivs[1].textContent);
        this.setValue('userYahoo', contactInfoDivs[2].textContent);
        this.setValue('userGtalk', contactInfoDivs[3].textContent);
        this.setValue('userMSN', contactInfoDivs[4].textContent);
        this.setValue('userSkype', contactInfoDivs[5].textContent);
        if (contactInfoDivs[6].textContent.indexOf('Click') !== -1) {
            this.setValue('sendMessage', '<a href="/?act=Msg&amp;CODE=00&amp;MID=' + userId + '">' + this.config.messageDefault + '</a>');
        } else {
            this.setValue('sendMessage', 'Private');
        }
        if (contactInfoDivs[7].textContent.indexOf('Click') !== -1) {
            this.setValue('sendEmail', '<a href="/?act=Mail&amp;CODE=00&amp;MID=' + userId + '">' + this.config.emailDefault + '</a>');
        } else {
            this.setValue('sendEmail', 'Private');
        }

        // signature
        var signatureContainer = signature.getElementsByTagName('td');
        this.setValue('signature', signatureContainer[2].innerHTML);

        // profileTop
        var usernameContainer = profileTop.getElementsByTagName('h3');
        this.setValue('userName', usernameContainer[0].textContent);
        var groupContainer = profileTop.getElementsByTagName('strong');
        this.setValue('userGroup', groupContainer[0].textContent);
        var avatar =  profileTop.previousElementSibling.getElementsByTagName('img')[0];
        if (avatar) {
            this.setValue('avatar', avatar.src);
        } else {
            this.setValue('avatar', this.config.avatarDefault);
        }

        // Create a new HTML element, set the appropriate attributes, and inject it into the page.
        var newProfile = document.createElement('div');
        newProfile.innerHTML = this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values);
        newProfile.id = 'new-profile';
        table.parentNode.appendChild(newProfile);

        // Remove the original profile.
        table.parentNode.removeChild(table);
    }
    else if (defaultStyle) {
        // Acquire the elements needed to read the values in.
        var topTable = defaultStyle.parentNode.parentNode.parentNode.parentNode,
            lineBreak = topTable.nextElementSibling,
            middleTable = lineBreak.nextElementSibling,
            bottomTable = middleTable.nextElementSibling,
            finalDiv = bottomTable.nextElementSibling;

        // Hide the original profile.
        topTable.style.display = 'none';
        lineBreak.style.display = 'none';
        middleTable.style.display = 'none';
        bottomTable.style.display = 'none';
        finalDiv.style.display = 'none';

        // Get the user's id.
        var userId = location.href.split("?showuser=")[1];
        this.setValue('userId', userId);

        // Read the values from the top table.
        var topTableCells = topTable.getElementsByTagName('td'),
            userPhoto = topTableCells[0].getElementsByTagName('img')[0],
            topTableDivs = topTableCells[1].getElementsByTagName('div');
        if (userPhoto) {
            this.setValue('userPhoto', userPhoto.src);
        } else {
            this.setValue('userPhoto', this.config.userPhotoDefault);
        }
        this.setValue('userName', topTableDivs[0].textContent);
        /*
            Profile links don't appear on the personal portal style profiles,
            so it's been commented out for compatibility between the two halves
            of this module.

        this.setValue('profileLinks', topTableDivs[1].innerHTML);
         */

        // Read the values from the middle table.
        var middleTables = middleTable.getElementsByTagName('table'),
            topLeftTable = middleTables[0],
            topRightTable = middleTables[1],
            bottomLeftTable = middleTables[2],
            bottomRightTable = middleTables[3];

        // Read the values in the top left table.
        var topLeftCells = topLeftTable.getElementsByTagName('td');
        this.setValue('postCount', topLeftCells[2].textContent.split('(')[0]);
        this.setValue('postsPerDay', topLeftCells[4].textContent);
        this.setValue('joinDate', topLeftCells[6].textContent);
        this.setValue('localTime', topLeftCells[8].textContent);
        var onlineStatus = topLeftCells[10].textContent;
        this.setValue('onlineStatus', onlineStatus.split('(')[1].split(')')[0]);
        if (onlineStatus.split('(')[1].split(')')[0].indexOf('Offline') === -1) {
            this.setValue('onlineActivity', onlineStatus.split(') (')[1].split(')')[0]);
        } else {
            this.setValue('onlineActivity', this.config.onlineActivityDefault);
        }

        // Read the values in the top right table.
        var topRightCells = topRightTable.getElementsByTagName('td');
        if (topRightCells[2].textContent.indexOf('Click') !== -1) {
            this.setValue('sendEmail', '<a href="/?act=Mail&amp;CODE=00&amp;MID=' + userId + '">Click here</a>');
        } else {
            this.setValue('sendEmail', 'Private');
        }
        this.setValue('userSkype', topRightCells[4].textContent);
        this.setValue('userAIM', topRightCells[6].textContent);
        this.setValue('userGtalk', topRightCells[8].textContent);
        this.setValue('userYahoo', topRightCells[10].textContent);
        this.setValue('userMSN', topRightCells[12].textContent);
        if (topRightCells[14].textContent.indexOf('Click') !== -1) {
            this.setValue('sendMessage', '<a href="/?act=Msg&amp;CODE=00&amp;MID=' + userId + '">Click here</a>');
        } else {
            this.setValue('sendMessage', 'Private');
        }

        // Read the values in the bottom left table.
        var bottomLeftCells = bottomLeftTable.getElementsByTagName('td');
        this.setValue('homePage', bottomLeftCells[2].innerHTML);
        this.setValue('birthday', bottomLeftCells[4].textContent);
        this.setValue('location', bottomLeftCells[6].textContent);

        // If HTML in the interests field is enabled, make sure to parse it correctly.
        if (this.config.htmlEnabled) {
            this.setValue('interests', this.stringToMarkup(bottomLeftCells[8].innerHTML));
        } else {
            this.setValue('interests', bottomLeftCells[8].innerHTML);
        }

        /*
            More trouble caused by feature bloat. Awards get inserted at this point,
            but instead of using a switch statement here it's more efficient to
            declare an offset and watch it carefully since the rows following this
            one are not presented in an arbitrary order.
         */
        var awardOffset = 0;
        if (bottomLeftCells[9].textContent.indexOf('Awards') !== -1) {
            awardOffset = 2;
            this.setValue('awards', bottomLeftCells[10].innerHTML);
        }

        // Wrap up the default profile fields.
        /*
            Last post doesn't appear on the personal portal style profiles,
            so it's been commented out for compatibility between the two halves
            of this module.

        this.setValue('lastPost', bottomLeftCells[10 + awardOffset].textContent);
         */
        this.setValue('lastActivity', bottomLeftCells[12 + awardOffset].textContent);

        // Custom profile fields are simple- just iterate over the remainder in a loop.
        for (var i = 14 + awardOffset, fieldNum = 1; i < bottomLeftCells.length; i += 2, fieldNum++) {
            this.setValue('customField' + fieldNum, bottomLeftCells[i].textContent);
        }

        // Read the values in the bottom right table.
        var bottomRightCells = bottomRightTable.getElementsByTagName('td');
        this.setValue('userGroup', bottomRightCells[2].textContent);
        this.setValue('userTitle', bottomRightCells[4].textContent);
        var avatar =  bottomRightCells[6].getElementsByTagName('img')[0];
        if (avatar) {
            this.setValue('avatar', avatar.src);
        } else {
            this.setValue('avatar', this.config.avatarDefault);
        }

        /*
            Another switch statement is used for the final potential three rows.
            Their order may be arbitrary, so it's required.
         */
        for (var i = 7; i < bottomRightCells.length; i++) {
            switch (true) {
                case (bottomRightCells[i].textContent === 'Rep:'):
                    var reputation = bottomRightCells[i + 1].textContent;
                    if (reputation.indexOf('pts') !== -1) {
                        this.setValue('reputationTotal', reputation.split('pts [')[0]);
                    } else {
                        this.setValue('reputationTotal', '0');
                    }
                    this.setValue('reputationIncrease', '<a href="/?act=rep&CODE=01&mid=' + userId + '&t=p">' + this.config.reputationIncrease + '</a>');
                    this.setValue('reputationDecrease', '<a href="/?act=rep&CODE=02&mid=' + userId + '&t=p">' + this.config.reputationDecrease + '</a>');
                    this.setValue('reputationDetails', '<a href="/?act=rep&CODE=03&mid=' + userId +'">' + this.config.reputationDetails + '</a>');
                    break;
                case (bottomRightCells[i].textContent === 'Warn Level'):
                    this.setValue('warnLevel', bottomRightCells[i + 1].textContent.split('%')[0]);
                    this.setValue('warnLevelIncrease', '<a href="/?act=warn&type=add&mid=' + userId + '">' + this.config.warnIncrease + '</a>');
                    this.setValue('warnLevelDecrease', '<a href="/?act=warn&type=minus&mid=' + userId + '">' + this.config.warnDecrease + '</a>');
                    break;
                /*
                    Moderator notes don't appear on the personal portal style profiles,
                    so they've been commented out for compatibility between the two halves
                    of this module.

                case (bottomRightCells[i].textContent === 'Moderator Notes:'):
                    this.setValue('moderatorNotes', bottomRightCells[i + 1].getElementsByTagName('textarea')[0].value);
                    break;
                 */
            }
        }

        // Get the user's signature.
        var bottomTableCells = bottomTable.getElementsByTagName('td');
        this.setValue('signature', bottomTableCells[2].innerHTML);

        // Create a new HTML element, set the appropriate attributes, and inject it into the page.
        var newProfile = document.createElement('div');
        newProfile.innerHTML = this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values);
        newProfile.id = 'new-profile';
        topTable.parentNode.appendChild(newProfile);

        // Remove the original profile.
        topTable.parentNode.removeChild(topTable);
        lineBreak.parentNode.removeChild(lineBreak);
        middleTable.parentNode.removeChild(middleTable);
        bottomTable.parentNode.removeChild(bottomTable);
        finalDiv.parentNode.removeChild(finalDiv);
    }
};


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Profile.prototype.initialize = function(settings) {
    // Call $cs.module.Default's initialize method instead.
    $cs.module.Default.prototype.initialize.call(this, settings);
};


/**
 * Converts a string containing encoded HTML markup into actual HTML markup.
 * @arg {string} string         - A string containing encoded HTML markup.
 * @return {string}
 * @readonly
 */
$cs.module.Profile.prototype.stringToMarkup = function(string) {
    // Create a throwaway element and set its innerHTML.
    var temp = document.createElement('div');
    temp.innerHTML = string;
    var result = '';
    for(var i = 0, length = temp.childNodes.length; i < length; i++) {
        if(temp.childNodes[i].nodeValue) {
            result += temp.childNodes[i].nodeValue;
        }
    }
    temp = '';
    return result;
}


// Extend the custom topics module with the default properties and methods.
$cs.extendModule($cs.module.Topics, $cs.module.Default);


/**
 * @namespace
 * @property {object} config                      - Default configuration values.
 * @property {string} config.keyPrefix            - The default prefix for value keys.
 * @property {string} config.keySuffix            - The default suffix for value keys.
 * @property {string} config.announcementsDefault - The default title row text for announcements.
 * @property {string} config.pinnedDefault        - The default title row text for pinned topics.
 * @property {string} config.regularDefault       - The default title row text for regular topics.
 * @property {string} config.noTopics             - The default message displayed when a forum contains no topics.
 * @property {string} config.noActiveTopics       - The default message displayed when the active topics page is blank.
 * @property {string} config.paginationDefault    - The default text displayed when pagination is blank.
 */
$cs.module.Topics.prototype.config = {
    keyPrefix:              '{{',
    keySuffix:              '}}',
    announcementsDefault:   'Announcements',
    pinnedDefault:          'Important Topics',
    regularDefault:         'Forum Topics',
    noTopics:               'No topics were found. This is either because there are no topics in this forum, or the topics are older than the current age cut-off.',
    noActiveTopics:         'There were no active topics during those date ranges',
    paginationDefault:      ''
};


/**
 * @property {string} name      - The name of this module.
 */
$cs.module.Topics.prototype.name = '$cs.module.Topics';


/**
 * @property {object} reserved  - An array of reserved names.
 */
$cs.module.Topics.prototype.reserved = [
    'values',
    'execute',
    'getValue',
    'hasValue',
    'initialize',
    'replaceValues',
    'setValue',
];


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Topics.prototype.execute = function() {
    var topicList = document.getElementById('topic-list');
    // If we couldn't find the default topic list, check what page we're on.
    if (!topicList) {
        if (window.location.href.indexOf('act=Search&CODE=getactive') > -1) {
            var forms = document.getElementsByTagName('form');
            for (var i = 0; i < forms.length; i++) {
                if (forms[i].action.indexOf('act=Search&CODE=getactive') > -1) {
                    topicList = forms[i].nextElementSibling.nextElementSibling;
                }
            }

            // I don't like flags, but this is the best way to handle this here.
            var activeTopics = true;
        }
    }
    if (topicList) {
        /*
            Acquire the elements needed to read the values in and initialize some variables
            for formatting the script output.
         */
        var table = topicList.getElementsByTagName('table')[0],
            rows = [],
            topicsContent = '',
            rowClass = ' regular-topic';

        /*
            Loop through the direct children of the table to get the correct row count.
            This is necessary due to extraneous tables on the active topics view.
         */
        for (var t = 0; t < table.firstElementChild.childNodes.length; t++) {
            if (table.firstElementChild.childNodes[t].nodeType === 1 && table.firstElementChild.childNodes[t].tagName === 'TR') {
                rows.push(table.firstElementChild.childNodes[t]);
            }
        }

        // Hide the original table.
        table.style.display = 'none';

        // Loop through each row and either read the values or output a title row.
        for (var i = 1, numRows = rows.length; i < numRows; i++) {
            // Get all the cells in each row. If a fourth cell exists, read the values in.
            var cells = rows[i].getElementsByTagName('td');
            if (cells[3]) {
                // Regular topic listing.
                if (!activeTopics) {
                    this.setValue('folder', cells[0].innerHTML);
                    this.setValue('marker', cells[1].innerHTML);
                    var topicTitle = cells[2].getElementsByTagName('a')[0];
                    if (!topicTitle.getAttribute('title')) {
                        topicTitle = cells[2].getElementsByTagName('a')[1];
                    }
                    this.setValue('topicId', topicTitle.getAttribute('href').split('showtopic=')[1]);
                    this.setValue('topicTitle', '<a href="' + topicTitle + '">' + topicTitle.textContent + '</a>');
                    var topicSpans = cells[2].getElementsByTagName('span');
                    if (topicSpans[0].textContent.indexOf('(Pages ') !== -1) {
                        this.setValue('pagination', topicSpans[0].innerHTML);
                        this.setValue('topicDescription', topicSpans[1].textContent);
                    } else {
                        this.setValue('pagination', this.config.paginationDefault);
                        this.setValue('topicDescription', topicSpans[0].textContent);
                    }
                    this.setValue('topicAuthor', cells[3].innerHTML);
                    this.setValue('replyCount', cells[4].textContent);
                    this.setValue('viewCount', cells[5].textContent);

                    this.setValue('lastReplyDate', cells[6].getElementsByTagName('span')[0].firstChild.nodeValue);
                    this.setValue('lastReplyAuthor', cells[6].getElementsByTagName('b')[0].innerHTML);
                    this.setValue('moderatorCheckbox', cells[7].innerHTML);
                }
                // Active topics search page listing.
                else {
                    this.setValue('folder', cells[0].innerHTML);
                    this.setValue('marker', cells[1].innerHTML);
                    var topicTitleLinks = cells[2].getElementsByTagName('a');
                    if (topicTitleLinks[0].href.indexOf('view=getnewpost') === -1) {
                        var topicTitle = topicTitleLinks[0];
                    } else {
                        var topicTitle = topicTitleLinks[1];
                    }
                    this.setValue('topicId', topicTitle.getAttribute('href').split('showtopic=')[1].split('&')[0]);
                    this.setValue('topicTitle', '<a href="' + topicTitle + '">' + topicTitle.textContent + '</a>');
                    var topicSpans = cells[2].getElementsByTagName('span');
                    if (topicSpans[0].textContent.indexOf('(Pages ') !== -1) {
                        this.setValue('pagination', topicSpans[0].innerHTML);
                        this.setValue('topicDescription', topicSpans[1].textContent);
                    } else {
                        this.setValue('pagination', this.config.paginationDefault);
                        this.setValue('topicDescription', topicSpans[0].textContent);
                    }
                    this.setValue('topicAuthor', cells[6].innerHTML);
                    this.setValue('replyCount', cells[7].textContent);
                    this.setValue('viewCount', cells[8].textContent);

                    this.setValue('lastReplyDate', cells[9].firstChild.nodeValue);
                    this.setValue('lastReplyAuthor', cells[9].getElementsByTagName('b')[1].innerHTML);
                    this.setValue('moderatorCheckbox', '');
                }

                // Perform string replacement and append the new row to the output.
                topicsContent += '<div class="topic-row' + rowClass + '">' +
                                 this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values) +
                                 '</div>';
            } else if (i !== numRows - 1 && !activeTopics) {
                // Output the appropriate title row for the topics that follow.
                var titleContents = cells[2].getElementsByTagName('b')[0].textContent;
                switch (titleContents) {
                    case 'Announcements':
                        rowClass = ' announcement-topic';
                        topicsContent += '<div class="topic-title-row">' + this.config.announcementsDefault + '</div>';
                        break;
                    case 'Important Topics':
                        rowClass = ' pinned-topic';
                        topicsContent += '<div class="topic-title-row">' + this.config.pinnedDefault + '</div>';
                        break;
                    default:
                        rowClass = ' regular-topic';
                        topicsContent += '<div class="topic-title-row">' + this.config.regularDefault + '</div>';
                        break;
                }
            } else {
                if (!activeTopics) {
                    // This forum contains no topics. Display a message and call it good.
                    topicsContent += '<div class="no-topics">' + this.config.noTopics + '</div>';
                } else {
                    // This active topics list is blank. Display a message and call it good.
                    topicsContent += '<div class="no-topics">' + this.config.noActiveTopics + '</div>';
                }
            }
        }

        // Create a new HTML element, set the appropriate attributes, and inject it into the page.
        var newTopics = document.createElement('div');
        newTopics.id = 'new-topics';
        newTopics.innerHTML = topicsContent;
        table.parentNode.insertBefore(newTopics, table);

        table.parentNode.removeChild(table);
        // Hide that last, useless search element down below.
        if (activeTopics) {
            topicList.removeChild(topicList.lastElementChild);
        }
    }
}


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Topics.prototype.initialize = function(settings) {
    // Call $cs.module.Default's initialize method instead.
    $cs.module.Default.prototype.initialize.call(this, settings);
};


// Extend the custom posts module with the default properties and methods.
$cs.extendModule($cs.module.Posts, $cs.module.Default);


/**
 * @namespace
 * @property {object}  config                      - Default configuration values.
 * @property {string}  config.keyPrefix            - The default prefix for value keys.
 * @property {string}  config.keySuffix            - The default suffix for value keys.
 * @property {string}  config.permaLinkDefault     - The default text used in permalinks.
 * @property {string}  config.postSignatureDefault - The default text used for signatures.
 */
$cs.module.Posts.prototype.config = {
    keyPrefix:              '{{',
    keySuffix:              '}}',
    permaLinkDefault:       'Permalink',
    postSignatureDefault:   ''
};


/**
 * @property {string} name      - The name of this module.
 */
$cs.module.Posts.prototype.name = '$cs.module.Posts';


/**
 * @property {object} reserved  - An array of reserved names.
 */
$cs.module.Posts.prototype.reserved = [
    'values',
    'execute',
    'getValue',
    'hasValue',
    'initialize',
    'replaceValues',
    'setValue',
];


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Posts.prototype.queryString = function(url, query) {
    query = query.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + query + '=([^&#]*)'),
        result = regex.exec(url);
    return (result === null) ? '' : decodeURIComponent(result[1].replace(/\+/g, ' '));
}


/**
 * Executes the checks and loops needed to complete the script. 
 * @readonly
 */
$cs.module.Posts.prototype.execute = function() {
    // Make sure we're viewing a topic before executing.
    if (window.location.href.indexOf('showtopic') !== -1 || window.location.href.indexOf('ST') !== -1) {
        var posts = document.getElementsByClassName('post-normal');
    
        // Create a new HTML element and set the appropriate attributes.
        var newPosts = document.createElement('div');
        newPosts.id = 'new-posts';

        // Loop through each post being displayed.
        for (var i = 0, numPosts = posts.length; i < numPosts; i++) {
            // Hide each post.
            posts[i].style.display = 'none';

            // Acquire the elements necessary to read in the values.
            var table = posts[i].firstElementChild,
                rows = table.getElementsByTagName('tr'),
                cells = [];

            /*
                To avoid collisions with doHTML and custom miniprofiles, we need to
                check the direct children of each row. This takes some extra work.
             */
            for (var j = 0, numRows = rows.length; j < numRows; j++) {
                var directChildrenOfRow = rows[j].childNodes;
                for (var k = 0, numCells = directChildrenOfRow.length; k < numCells; k++) {
                    var child = directChildrenOfRow[k];
                    if (child.nodeType === 1 && child.tagName === 'TD') {
                        if (child.parentNode.parentNode.parentNode === table) {
                            cells.push(child);
                        }
                    }
                }
            }

            // Read the values in.
            var postLinks = cells[0].getElementsByTagName('a'),
                postId = postLinks[0].name.split('entry')[1],
                topicId;

            /*
                IPB 1.3.1 has two different ways of displaying topics using URL query strings.
                If we don't have a match for the usual one, check the other possible URL query.
                Internally consistent, IPB 1.3.1 ain't.
             */
            if (window.location.search.indexOf('showtopic') !== -1) {
                topicId = this.queryString(window.location.search, 'showtopic');
            } else {
                topicId = this.queryString(window.location.search, 't');
            }

            this.setValue('postId', postId);

            // The author names for guests and users have to be read differently.
            if (postLinks.length > 1) {
                this.setValue('postAuthor', cells[0].innerHTML.split('normalname">')[1].slice(0, -7));
            } else {
                this.setValue('postAuthor', cells[0].innerHTML.split('unreg">')[1].slice(0, -7));
            }
            this.setValue('permaLink', '<a href="/?showtopic=' + topicId + '&amp;view=findpost&amp;p=' + postId + '">' + this.config.permaLinkDefault + '</a>');
            this.setValue('postDate', cells[1].firstElementChild.textContent.split('Posted: ')[1]);
            this.setValue('postButtonsTop', cells[1].lastElementChild.innerHTML);

            /*
                The topic starter will always be missing the checkbox, so use an offset to
                properly count the cells from this point onward.
             */
            var cellOffset = 0;
            if (cells[2].innerHTML.indexOf('input') !== -1) {
                this.setValue('postCheckbox', cells[2].innerHTML);
                cellOffset = 1;
            } else {
                this.setValue('postCheckbox', '');
            }
            this.setValue('postMiniprofile', cells[2 + cellOffset].firstElementChild.innerHTML);

            this.setValue('postContent', cells[3 + cellOffset].firstElementChild.innerHTML);

            var postSignature = cells[3 + cellOffset].lastElementChild;
            if (postSignature.previousElementSibling) {
                this.setValue('postSignature', postSignature.innerHTML);
            } else {
                this.setValue('postSignature', this.config.postSignatureDefault);
            }
            this.setValue('postIp', cells[4 + cellOffset].textContent);
            this.setValue('postButtonsBottom', cells[5 + cellOffset].firstElementChild.innerHTML);

            // Create a new element for this post and append it to the new posts container.
            var newPost = document.createElement('div');
            newPost.id = 'entry' + postId;
            newPost.innerHTML = this.replaceValues((typeof this.html === 'function') ? this.html() : this.html, this.values);
            newPosts.appendChild(newPost);
        }

        // Inject the new posts container into the page.
        posts[0].parentNode.insertBefore(newPosts, posts[0]);

        // Hide the original posts container.
        table.parentNode.removeChild(table);
    }
};


/**
 * Initialization function. Reads user-defined settings in for processing and begins script execution.
 * @arg {object} settings       - An object with user-defined settings as properties.
 * @readonly
 */
$cs.module.Posts.prototype.initialize = function(settings) {
    // Call $cs.module.Default's initialize method instead.
    $cs.module.Default.prototype.initialize.call(this, settings);
};


// Expose some familiar, user-friendly objects for public use.
var customIndex   = new $cs.module.Index(),
    customStats   = new $cs.module.Stats(),
    customProfile = new $cs.module.Profile(),
    customTopics  = new $cs.module.Topics(),
    customPosts   = new $cs.module.Posts();