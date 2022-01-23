<template>
  <div
    @keydown.esc="clearScreenCommand"
    @click.stop="clickAction"
    class="webshell"
  >
    <div class="webshell-screen">
      <div
        v-for="(item, index) in screen"
        :key="index"
        :class="item.style"
        v-html="item.html"
      />
    </div>

    <div class="flex webshell-command" v-if="loaded">
      <div class="webshell-prompt">{{ promptSignal }}</div>

      <input
        class="webshell-input"
        ref="inputFocus"
        v-model="userInput"
        @keyup.prevent.enter="evalCommand"
        @keyup.prevent.up="historyPreviousAction"
        @keyup.prevent.down="historyNextAction"
        @keydown.prevent.tab="autoCompleteAction"
        autofocus
      />
    </div>

    <span :class="styles.textInverse" ref="focus">_</span>
  </div>
</template>

<script>
import dateTimeDiffToHuman from '@/resources/dateTimeDiffToHuman';
import { buildInput, commandsAsLink } from '@/resources/helpers';
import history from '@/mixins/history';
import screen from '@/mixins/screen';
import styles from '@/constants/styles';
import ignoredCommands from '@/constants/ignoredCommands';

export default {
  props: {
    projectUrl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "vue-webshell",
    },
    promptSignal: {
      type: String,
      default: "$",
    },
    queryIpUrl: {
      type: String,
      default: "",
    },
    dockerhubProfile: {
      type: String,
      default: "",
    },
    githubProfile: {
      type: String,
      default: "",
    },
    linkedinProfile: {
      type: String,
      default: "",
    },
    npmjsProfile: {
      type: String,
      default: "",
    },
    twitterProfile: {
      type: String,
      default: "",
    },
  },
  mixins: [
    history,
    screen,
  ],
  data() {
    return {
      startTime: new Date,
      loaded: false,
      styles,
      userInput: "",
      validDestinations: {
        docker: this.dockerhubProfile ? `https://hub.docker.com/u/${this.dockerhubProfile}` : null,
        github: this.githubProfile ? `https://github.com/${this.githubProfile}` : null,
        linkedin: this.linkedinProfile ? `https://linkedin.com/in/${this.linkedinProfile}` : null,
        npmjs: this.npmjsProfile ? `https://npmjs.com/~${this.npmjsProfile}` : null,
        twitter: this.twitterProfile ? `https://twitter.com/${this.twitterProfile}` : null,
      },
      validCommands: [
        { command: "about", action: this.aboutCommand, description: "webshell project informations" },
        { command: "clear", action: this.clearScreenCommand, description: "clear screen (or just press esc key)." },
        { command: "help", action: this.helpCommand, description: "list available commands. (same as man)" },
        { command: "history", action: this.historyCommand, description: "display history command list." },
        { command: "ls", action: this.lsCommand, description: "list files." },
        { command: "man", action: this.helpCommand, description: "list available commands (same as help)." },
        { command: "now", action: this.nowCommand, description: "display current date and time." },
        { command: "reboot", action: this.rebootCommand, description: "system reboot." },
        { command: "uptime", action: this.uptimeCommand, description: "elapsed time since your access." },
      ],
      validFiles: [
        "linux-command-references.md",
        "push-your-docker-to-hub.md",
      ],
    }
  },
  methods: {
    focusOnInput() {
      setTimeout(() => {
        if (this.loaded && this.$refs.inputFocus)
          this.$refs.inputFocus.focus();
      }, 500);
    },
    scrollToEnd() {
      setTimeout(() => {
        if (this.$refs.focus)
          this.$refs.focus.scrollIntoView();
      }, 200);
    },
    aboutCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.appendToScreen('fork me at <a href="' + this.projectUrl + '">' + this.projectUrl + "</a>");
      return true;
    },
    clearScreenCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.screen = [];
      return true;
    },
    gotoCommand(args = []) {
      if (args.length !== 1) {
        return false;
      }

      const destiny = this.validDestinations[args[0]];

      if (destiny) {
        window.location = destiny;
        return true;
      }

      return false;
    },
    helpCommand(args = []) {
      if (args.length > 1) {
        return false;
      }

      if (args.length === 1) {
        const validCommand = this.validCommands.find(item => item.command == args[0]);

        if (validCommand) {
          this.appendToScreen(validCommand.description);
          return true;
        }
      }

      this.appendToScreen([
        "valid commands: " + commandsAsLink(this.validCommands),
        "or type <strong>help [command]</strong>",
      ]);
      return true;
    },
    historyCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.appendToScreen(this.getHistoryList());
      return true;
    },
    async myIpAddressCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      try {
        this.appendToScreen("querying...");
        const response = await fetch(this.queryIpUrl);
        const ipAddress = await response.text();

        if (!ipAddress) {
          throw new Error("sorry, there was an error.");
        }

        this.appendToScreen(`your ip address is ${ipAddress}`);
      } catch(error) {
        this.appendToScreen(error.message, styles.textDanger);
      }

      return true;
    },
    lsCommand() {
      this.validFiles.forEach((file) => {
        this.appendToScreen(file);
      });

      return true;
    },
    nowCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.appendToScreen(new Date());
      return true;
    },
    uptimeCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.appendToScreen(dateTimeDiffToHuman(this.startTime));
      return true;
    },
    batchCommandList(commands) {
      const command = commands.shift();

      setTimeout(() => {
        command.action();

        if (commands.length) {
          this.batchCommandList(commands);
        }
      }, command.timeout);
    },
    boot() {
      const bootSteps = [
        { timeout: 500, action: () => this.appendToScreen(this.title) },
        { timeout: 500, action: this.nowCommand },
        { timeout: 100, action: this.aboutCommand },
        { timeout: 100, action: this.appendSpaceToScreen },
        { timeout: 500, action: () => this.appendToScreen("welcome!", styles.textWarning) },
        { timeout: 500, action: this.helpCommand },
        { timeout: 100, action: this.appendSpaceToScreen },
        { timeout: 1000, action: () => this.appendToScreen("system ready.", styles.textLigth) },
        { timeout: 500, action: () => this.loaded = true },
        { timeout: 100, action: this.focusOnInput },
      ];

      this.batchCommandList(bootSteps);
    },
    rebootCommand(args = []) {
      if (args.length > 0) {
        return false;
      }

      this.loaded = false;
      this.clearScreenCommand();
      this.clearHistory();
      this.startTime = new Date;

      this.boot();
      return true;
    },
    async evalCommand() {
      const { input, inputCommand, inputArgs } = buildInput(this.userInput);

      if (input === "") {
        this.appendToScreen("$");
        this.scrollToEnd();
        this.focusOnInput();
        return;
      }

      this.userInput = "";
      this.appendToHistory(input);

      const command = this.validCommands.find((item) => item.command === inputCommand);
      
      if (command) {
        this.appendToScreen(`$ ${input}`, styles.textLigth);
        if (!await command.action(inputArgs)) {
          this.appendToScreen(`invalid arguments. type <strong>help ${inputCommand}</strong>.`, styles.textWarning);
        }

        if (this.screen.length) {
          this.appendSpaceToScreen();
        }
      }
      else {
        if (ignoredCommands[inputCommand]) {
          this.appendToScreen(`$ ${input}`, styles.textDanger);
          this.appendToScreen("hey, this is not allowed here! ;]", styles.textDanger);
          this.appendSpaceToScreen();
        }
        else {
          this.appendToScreen(`$ ${input}`, styles.textWarning);
          this.appendToScreen("sorry, unknown command!", styles.textWarning);
          this.appendSpaceToScreen();
        }
      }

      this.scrollToEnd();
      this.focusOnInput();
    },
    async clickAction(event) {
      const clickedText = event.target.textContent;
      const test = clickedText.split(" ")[0];

      const found = this.validCommands.find((item) => item.command == test);

      if (found) {
        this.userInput = found.command;
        await this.evalCommand();
      }
      else {
        this.focusOnInput();
      }
    },
    autoCompleteAction() {
      const { inputCommand, inputArgs } = buildInput(this.userInput);

      if (inputCommand === "" || inputArgs.length > 0) {
        return;
      }

      const available = this.validCommands.filter(
        (item) => item.command.substring(0, inputCommand.length) == inputCommand
      );

      if (available.length === 1) {
        this.userInput = available[0].command;
        return;
      }

      if (available.length) {
        this.appendToScreen("available commands: " + commandsAsLink(available));
      }
      else {
        this.appendToScreen("command not found.", styles.textWarning);
      }
    },
    historyPreviousAction() {
      this.userInput = this.historyPrevious();
    },
    historyNextAction() {
      this.userInput = this.historyNext();
    },
    releaseMyIpAddressCommand() {
      if (this.queryIpUrl !== "") {
        this.validCommands.push({
          command: "ip",
          action: this.myIpAddressCommand,
          description: "display your ip address.",
        });
      }
    },
    releaseGotoCommand() {
      const myLinks = Object.entries(this.validDestinations);

      if (myLinks.length > 0) {
        this.validCommands.push({
          command: "goto",
          action: this.gotoCommand,
          description: "go to one of my links: "
            + myLinks.map((link) => link[1] ? link[0] : false).filter(Boolean).join(", "),
        });
      }
    },
    sortValidCommands() {
      this.validCommands = this.validCommands.sort((a, b) => a.command > b.command);
    },
  },
  beforeMount() {
    this.releaseMyIpAddressCommand();
    this.releaseGotoCommand();
    this.sortValidCommands();
  },
  mounted() {
    this.boot();
  },
};
</script>

<style>
.webshell {
  height: calc(100% - 5px);
  overflow-y: auto;
}
.webshell-prompt {
  padding-right: 11px;
}
.webshell-input {
  width: 100%;
}
.webshell-linespace {
  margin-bottom: 10px;
}
</style>
