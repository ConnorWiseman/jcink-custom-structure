# Jcink Custom Structure
A DOM manipulation library specifically designed for the Jcink hosted forum service.

## Major Changes
* Inbuilt support for legacy browsers has been dropped.
* The behavior of absent values has been changed.
* The majority of the replacement keys have been renamed.
* The Custom Index module no longer relies on `<!-- |input_act| -->`.
* The `target` configuration property is no longer required for any module.
* A module for customizing the appearance of posts in a topic list has been added.

## Basic Usage
```javascript
<script>
customIndex.initialize({
    html: 'Testing the spacing here'
});
</script>
```