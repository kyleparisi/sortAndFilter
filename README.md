# sortAndFilter

A library to modify local context of a vuejs table component.  Please read the `test.js` file for the appropriate context needed.

## Features

- string path selection sorting (e.g. "child.id")
- filter types: enumerated, number, search, and custom filters
- sorting resets when clicking column 3x

## Usage

[![npm version](https://badge.fury.io/js/sort-and-filter.svg)](https://badge.fury.io/js/sort-and-filter)

or

```html
<script src="https://unpkg.com/sort-and-filter@1.0.0/sortAndFilter.min.js"></script>
```

### Sorting Usage

```js
// standard
const ctx = {
  data: unOrderedSet1,
  sortKey: "id",
  sortedData: [{}],
  reverse: false,
  sortCounter: 0
};
sortAndFilter.call(ctx, "id");

// nested sort key
const ctx = {
  data: unOrderedSet1,
  sortKey: "id.test",
  sortedData: [{}],
  filters: [],
  reverse: false
};
sortAndFilter.call(ctx);

// only apply filters from context (see tests)
sortAndFilter();
```

### Filter Usage

```js
// enumerated filter
const ctx = {
  data: unOrderedSet2,
  sortKey: "",
  sortedData: [{}],
  reverse: false,
  sortCounter: 0,
  filters: [
    {
      name: "Id",
      type: "enumerated",
      values: ["1", "3"]
    }
  ],
  mapping: {
    Id: "id"
  }
};
sortAndFilter.call(ctx);

// numeric filter
const ctx = {
  data: unOrderedSet2,
  sortKey: "",
  sortedData: [{}],
  reverse: false,
  sortCounter: 0,
  filters: [
    {
      name: "Id",
      type: "number",
      operator: "<",
      value: "3"
    }
  ],
  mapping: {
    Id: "id"
  }
};
sortAndFilter.call(ctx);

// search filter
const ctx = {
  data: unOrderedSet3,
  sortKey: "",
  sortedData: [{}],
  reverse: false,
  sortCounter: 0,
  filters: [
    {
      name: "Name",
      type: "search",
      value: "o"
    }
  ],
  mapping: {
    Name: "name"
  }
};
sortAndFilter.call(ctx);

// can do custom filter as well...
```

## Testing

```js
npm test
```