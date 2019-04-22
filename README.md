# sortAndFilter

A library to modify local context of a vuejs table component.  Please read the `test.js` file for the appropriate context needed.

## Features

- string path selection sorting (e.g. "child.id")
- filter types: enumerated, number, search, and custom filters
- sorting resets when clicking column 3x

## Sorting Usage

```js
// standard
const sortKey = "id";
sortAndFilter(sortKey);

// nested sort key
const sortKey = "child.id";
sortAndFilter(sortKey);

// only apply filters from context (see tests)
sortAndFilter();
```

## Testing

```js
npm test
```