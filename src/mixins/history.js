const history = {
  data() {
    return {
      historyCommands: [],
      historyIndex: 0,
      historyBrowsing: false,
    }
  },

  methods: {
    appendToHistory(input) {
      this.historyBrowsing = false;

      if (input === this.historyCommands[this.historyCommands.length - 1]) {
        return;
      }

      this.historyCommands.push(input);
      this.historyIndex = this.historyCommands.length - 1;
    },

    getHistoryList() {
      return [...this.historyCommands]
    },

    clearHistory() {
      this.historyCommands = [];
      this.historyIndex = 0;
      this.historyBrowsing = false;
    },

    historyPrevious() {
      if (!this.historyBrowsing)
        this.historyBrowsing = true;
      else if (this.historyIndex > 0)
        this.historyIndex--;

      return this.historyCommands[this.historyIndex];
    },

    historyNext() {
      if (!this.historyBrowsing)
        this.historyBrowsing = true;
      else if (this.historyIndex < this.historyCommands.length - 1)
        this.historyIndex++;

      return this.historyCommands[this.historyIndex];
    },
  },
}

export default history;
