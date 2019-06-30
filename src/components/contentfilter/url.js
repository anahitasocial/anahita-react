const contentfilterURL = (props) => {
  const { text, classes } = props;
  const regext = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#/%?=~_()|!:,.;]*[-a-z0-9+&@#/%=~_()|])/ig;
  return text.replace(regext, (match, leftParens, url) => {
    let rParens = '';
    const lParens = leftParens || '';

    // Try to strip the same number of right parens from url
    // as there are left parens.  Here, lParenCounter must be
    // a RegExp object.  You cannot use a literal
    //     while (/\(/g.exec(lParens)) { ... }
    // because an object is needed to store the lastIndex state.
    const lParenCounter = /\(/g;
    while (lParenCounter.exec(lParens)) {
      // We want m[1] to be greedy, unless a period precedes the
      // right parenthesis.  These tests cannot be simplified as
      //     /(.*)(\.?\).*)/.exec(url)
      // because if (.*) is greedy then \.? never gets a chance.
      const m = /(.*)(\.\).*)/.exec(url) || /(.*)(\).*)/.exec(url);

      if (m) {
        url = m[1];
        rParens = m[2] + rParens;
      }
    }
    return `${lParens}<a class="${classes}" target="_blank" href="${url}">${url}</a>${rParens}`;
  });
};

export default contentfilterURL;
