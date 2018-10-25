const assert = require("assert");
const sortAndFilter = require("./sortAndFilter");
const _ = require("lodash");

const unOrderedSet1 = [{ id: 1 }, { id: 3 }, { id: 2 }];
const orderedSet1 = [{ id: 3 }, { id: 2 }, { id: 1 }];

const unOrderedSet2 = [
  { id: 1, status: 1 },
  { id: 3, status: 1 },
  { id: 2, status: 0 }
];
const orderedSet2 = [
  { id: 3, status: 1 },
  { id: 2, status: 0 },
  { id: 1, status: 1 }
];

const unOrderedSet3 = [
  { id: 1, name: "Lorem", status: 1 },
  { id: 3, name: "ipsum", status: 1 },
  { id: 2, name: "dolor", status: 0 }
];

const unOrderedSet4 = [
  { id: 1, child: { id: 3 } },
  { id: 3, child: { id: 8 } },
  { id: 2, child: { id: 5 } }
];

describe("sortAndFilter", function() {
  it("should do nothing if nothing supplied in context", function() {
    const ctx = {};
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.data, ctx.sortedData);
  });

  it("should return sortedData", function() {
    const ctx = {
      data: [{}],
      sortedData: [{}]
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.data, ctx.sortedData);
  });

  it("should order data when given key", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "id",
      sortedData: [{}]
    };
    sortAndFilter.call(ctx, "id");
    assert.deepEqual(ctx.sortedData, orderedSet1);
  });

  it("should reverse the order if called 2x", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "id",
      sortedData: [{}],
      reverse: false
    };
    sortAndFilter.call(ctx, "id");
    assert.deepEqual(ctx.sortedData, orderedSet1);
    assert.equal(ctx.reverse, true);
    sortAndFilter.call(ctx, "id");
    assert.deepEqual(ctx.sortedData, _.reverse(orderedSet1));
    assert.equal(ctx.reverse, false);
  });

  it("should set sortedData = data if key is dot path", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "id.test",
      sortedData: [{}],
      filters: [],
      reverse: false
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.sortedData, unOrderedSet1);
  });

  it("should set sortedData if it doesn't exit and the sortKey is invalid", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "blah",
      sortedData: false,
      reverse: false
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.sortedData, unOrderedSet1);
  });

  it("should set sortedData = data if key is dot path and sortedData exists", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "id.test",
      sortedData: [{ msg: "test" }],
      reverse: false,
      filters: [{}]
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.sortedData, [{ id: 1 }, { id: 3 }, { id: 2 }]);
  });

  it("should reset the sort settings if run 2x", function() {
    const ctx = {
      data: unOrderedSet1,
      sortKey: "id",
      sortedData: [{}],
      reverse: false,
      sortCounter: 0
    };
    sortAndFilter.call(ctx, "id");
    sortAndFilter.call(ctx, "id");
    assert.deepEqual(ctx.sortedData, ctx.data);
    assert.equal(ctx.sortKey, "");
    assert.equal(ctx.reverse, false);
    assert.equal(ctx.sortCounter, 0);
  });

  it("should reset some sort settings when a different sort key is called after the first run", function() {
    const ctx = {
      data: unOrderedSet2,
      sortKey: "id",
      sortedData: [{}],
      reverse: true,
      sortCounter: 0
    };
    sortAndFilter.call(ctx, "id");
    assert.equal(ctx.reverse, false);
    sortAndFilter.call(ctx, "status");
    assert.equal(ctx.reverse, false);
    assert.equal(ctx.sortCounter, 0);
  });

  it("should set the data back to unordered if no key or filters active", function() {
    const ctx = {
      data: unOrderedSet2,
      sortKey: "",
      sortedData: orderedSet2,
      reverse: true,
      sortCounter: 0,
      filters: []
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.sortedData, unOrderedSet2);
  });

  it("should handle enumerated filters and no sort key", function() {
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
    assert.deepEqual(ctx.sortedData, [
      { id: 1, status: 1 },
      { id: 3, status: 1 }
    ]);
  });

  it("should handle number filters and no sort key", function() {
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
    assert.deepEqual(ctx.sortedData, [
      { id: 1, status: 1 },
      { id: 2, status: 0 }
    ]);
  });

  it("should handle search filters and no sort key", function() {
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
    assert.deepEqual(ctx.sortedData, [
      { id: 1, name: "Lorem", status: 1 },
      { id: 2, name: "dolor", status: 0 }
    ]);
  });

  it("should handle dot path keys", function() {
    const ctx = {
      data: unOrderedSet4,
      sortKey: "",
      sortedData: false,
      reverse: false
    };
    sortAndFilter.call(ctx, "child.id");
    assert.deepEqual(ctx.sortedData, [
      { id: 1, child: { id: 3 } },
      { id: 2, child: { id: 5 } },
      { id: 3, child: { id: 8 } }
    ]);
  });

  it("should keep the current sort if the filters are removed", function () {
    // the only time the sortKey is removed is when clicking the same column > 2 times
    const ctx = {
      data: unOrderedSet3,
      sortKey: "id",
      sortedData: [{}],
      reverse: false,
      sortCounter: 0,
      filters: [],
      mapping: {
        Name: "name"
      }
    };
    sortAndFilter.call(ctx);
    assert.deepEqual(ctx.sortedData, [
      { id: 1, name: "Lorem", status: 1 },
      { id: 2, name: "dolor", status: 0 },
      { id: 3, name: "ipsum", status: 1 }
    ]);
  });
});
