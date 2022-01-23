import styles from '../constants/styles';

const buildInput = (rawInput) => {
  const input = `${rawInput.trim().toLowerCase()}`;
  const inputArgs = input.split(" ");
  const inputCommand = inputArgs.shift();

  return { input, inputCommand, inputArgs };
};

const commandAsLink = (command = "") =>
  '<span class="' + styles.textLink + '">' + command + "</span>";

const commandsAsLink = (commands = []) => commands.map(
  (item) => commandAsLink(item.command)
).join(", ");

export {
  buildInput,
  commandAsLink,
  commandsAsLink,
}
