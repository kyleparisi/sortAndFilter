const _ = require("lodash");

function sortAndFilter(key) {
  let log = "";

  if (!key && !_.size(this.filters)) {
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

  this.sortKey = key;
  log += "Sorting.\n";
  this.sortedData = _.sortBy(this.data, [o => _.get(o, this.sortKey)]);

  if (this.sortCounter >= 2) {
    log += "Sort counter exceeded 2 sorts.  Reset sorting settings.\n";
    this.sortedData = this.data;
    this.sortKey = "";
    this.reverse = false;
    this.sortCounter = 0;
  }

  if (this.reverse) {
    log += "Reverse sort.\n";
    this.sortedData = _.reverse(this.sortedData);
  }

  if (!_.size(this.filters)) {
    log += "No filters.  Done sorting.\n";
    return log;
  }

  log += "Done sorting, apply filters\n";

  // filter.value(s) will always be strings
  this.filters.map(filter => {
    switch (filter.type) {
      case "enumerated":
        log += "Apply enumerated filter.\n";
        this.sortedData = _.filter(this.sortedData, data => {
          return filter.values.includes(
            String(_.get(data, this.mapping[filter.name]))
          );
        });
        break;
      case "number":
        log += "Apply number filter.\n";
        this.sortedData = _.filter(this.sortedData, data => {
          switch (filter.operator) {
            case ">":
              return _.get(data, this.mapping[filter.name]) > filter.value;
            case "<":
              return _.get(data, this.mapping[filter.name]) < filter.value;
            case "=":
              return _.get(data, this.mapping[filter.name]) == filter.value;
            default:
              return false;
          }
        });
        break;
      case "search":
        log += "Apply search filter.\n";
        this.sortedData = _.filter(this.sortedData, data => {
          const regex = new RegExp(filter.value, "i");
          return (
            String(_.get(data, this.mapping[filter.name])).search(regex) !== -1
          );
        });
        break;
    }
  });

  return log;
}

module.exports = sortAndFilter;
