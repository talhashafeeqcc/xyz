const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }));

  eleventyConfig.addPassthroughCopy('/_docs/**/*.png');

  eleventyConfig.addCollection('posts', collection => {

    const _collection = collection.getFilteredByGlob('**/*.md').sort((a, b) => {
      if (a.inputPath < b.inputPath) return -1;
      else if (a.inputPath > b.inputPath) return 1;
      else return 0;
    })

    let currentGroup;
    _collection.forEach(entry => {
      let path = entry.inputPath.split('/');
      let group = path[path.length - 2];
      entry.data.level = path.length;
      if (group !== currentGroup) entry.data.class = '__' + entry.data.level;
      currentGroup = group;
    })

    _collection.forEach(entry => entry.data.tag = entry.data.tags[0])

    return _collection;
  });

};