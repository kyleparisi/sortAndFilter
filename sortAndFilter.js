const _ = require("lodash");

function sortAndFilter(key) {
  let log = "";

  if (!key && !_.size(this.filters) && !this.sortKey) {
    log += "Reset everything if there is no key or filters.\n";
    this.sortKey = "";
    this.reverse = false;
    this.sortCounter = 0;
    this.sortedData = this.data;
    return log;
  }

  if (this.sortKey) {
    log += "Sort key is supplied, sorting needs to be updated.\n";
    this.reverse = !this.reverse;
    this.sortCounter++;
  }

  if (this.sortKey && this.sortKey !== key) {
    log += "Different sort key selected from previous sort.\n";
    this.reverse = false;
    this.sortCounter = 0;
  }

  this.sortKey = key || this.sortKey;
  log += "Sorting.\n";
  let sortedData = _.sortBy(this.data, [o => _.get(o, this.sortKey)]);

  if (this.sortCounter >= 2) {
    log += "Sort counter exceeded 2 sorts.  Reset sorting settings.\n";
    sortedData = this.data;
    this.sortKey = "";
    this.reverse = false;
    this.sortCounter = 0;
  }

  if (this.reverse) {
    log += "Reverse sort.\n";
    sortedData = _.reverse(sortedData);
  }

  if (!_.size(this.filters)) {
    log += "No filters.  Done sorting.\n";
    this.sortedData = sortedData;
    return log;
  }

  log += "Done sorting, apply filters\n";

  log += "Reset page to 1 to apply filters.\n";
  _.set(this, "page", 1);

  // filter.value(s) will always be strings
  this.filters.map(filter => {
    const key = filter.key || filter.name;
    switch (filter.type) {
      case "enumerated":
        log += "Apply enumerated filter.\n";
        sortedData = _.filter(sortedData, data => {
          return filter.values.includes(
            String(_.get(data, this.mapping[key]))
          );
        });
        break;
      case "number":
        log += "Apply number filter.\n";
        sortedData = _.filter(sortedData, data => {
          switch (filter.operator) {
            case ">":
              return _.get(data, this.mapping[key]) > filter.value;
            case "<":
              return _.get(data, this.mapping[key]) < filter.value;
            case "=":
              return _.get(data, this.mapping[key]) == filter.value;
            default:
              return false;
          }
        });
        break;
      case "search":
        log += "Apply search filter.\n";
        sortedData = _.filter(sortedData, data => {
          const regex = new RegExp(filter.value, "i");
          return (
            String(_.get(data, this.mapping[key])).search(regex) !== -1
          );
        });
        break;
      case "custom":
        if (!filter.filter) {
          return false;
        }
        log += "Apply custom filter.\n";
        sortedData = _.filter(sortedData, data => filter.filter(data, filter.value));
        break;
    }
  });

  this.sortedData = sortedData;

  return log;
}

module.exports = sortAndFilter;
