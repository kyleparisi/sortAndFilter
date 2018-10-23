const _ = require("lodash");

function sortAndFilter(key) {
  // reset everything if there is no key or filters
  if (!key && !_.size(this.filters)) {
    this.sortKey = "";
    this.reverse = false;
    this.sortCounter = 0;
    this.sortedData = this.data;
    return false;
  }

  // if key is supplied, sorting needs to be updated
  if (this.sortKey) {
    this.reverse = !this.reverse;
    this.sortCounter++;
  }

  // different sort key selected from previous sort
  if (this.sortKey && this.sortKey !== key) {
    this.reverse = false;
    this.sortCounter = 0;
  }

  this.sortKey = key;
  this.sortedData = _.sortBy(this.data, [o => _.get(o, this.sortKey)]);

  // reset sorting settings
  if (this.sortCounter >= 3) {
    this.sortedData = this.data;
    this.sortKey = "";
    this.reverse = false;
    this.sortCounter = 0;
  }

  if (this.reverse) {
    this.sortedData = _.reverse(this.sortedData);
  }

  // done sorting, apply filters

  if (!_.size(this.filters)) {
    return false;
  }

  // filter.value(s) will always be strings
  this.filters.map(filter => {
    switch (filter.type) {
      case "enumerated":
        this.sortedData = _.filter(this.sortedData, data => {
          return filter.values.includes(
            String(_.get(data, this.mapping[filter.name]))
          );
        });
        break;
      case "number":
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
        this.sortedData = _.filter(this.sortedData, data => {
          const regex = new RegExp(filter.value, "i");
          return (
            String(_.get(data, this.mapping[filter.name])).search(regex) !== -1
          );
        });
        break;
    }
  });
}

module.exports = sortAndFilter;
