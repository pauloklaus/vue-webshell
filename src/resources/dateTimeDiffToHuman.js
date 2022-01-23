const oneSec = 1000;
const oneMinute = 60 * oneSec;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;

const dateTimeDiffToHuman = (startTime) => {
  const diff = new Date - startTime;
  const days = diff < oneDay ? 0 : parseInt(diff / oneDay);
  const hours = diff < oneHour ? 0 : parseInt((diff - (days * oneDay)) / oneHour);
  const minutes = diff < oneMinute ? 0 : parseInt((diff - (days * oneDay) - (hours * oneHour)) / oneMinute);
  const seconds = parseInt((diff - (days * oneDay) - (hours * oneHour) - (minutes * oneMinute)) / oneSec);

  return (days ? days  + " day"    + ( days > 1 ? "s" : "")    + (hours || minutes || seconds ? ", " : "") : "") +
    (hours   ? hours   + " hour"   + ( hours > 1 ? "s" : "")   + (minutes || seconds ? ", " : "") : "") +
    (minutes ? minutes + " minute" + ( minutes > 1 ? "s" : "") + (seconds ? ", " : "") : "") +
    (seconds ? seconds + " second" + ( seconds > 1 ? "s" : "") : "");
}

export default dateTimeDiffToHuman;
