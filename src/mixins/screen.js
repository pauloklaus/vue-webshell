const screen = {
  data() {
    return {
      screen: [],
    }
  },

  methods: {
    appendToScreen(html, style = "") {
      if (typeof html === "object" && html.length)
        html.forEach(row => this.screen.push({ html: row, style }));
      else
        this.screen.push({ html, style });
    },
  
    appendSpaceToScreen() {
      this.appendToScreen("", "webshell-linespace");
    },
  },
}

export default screen;
