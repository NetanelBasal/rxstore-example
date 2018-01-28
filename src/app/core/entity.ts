export function Entity() {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    /**
     * When we peforming update we want to keep the entity type,
     * otherwise it will be a plain object
     * @param {{}} props
     * @returns {{}}
     */
    constructor.prototype.assign = function (props = {}) {
      const instance = new constructor();
      Object.assign(instance, this, props);
      return instance;
    };

    /**
     * TODO: add support for custom names and exluded props
     * @returns {string}
     */
    constructor.prototype.toJSON = function () {
      return JSON.stringify(this);
    };
  };
}
