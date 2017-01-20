export let PageController = {
  index: function* () {
    this.body = `version ${require('../../package').version}\n`;
  }
};
