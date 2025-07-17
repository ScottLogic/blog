const paragraphTimes = Array.from(
    document.querySelectorAll('[id^="timestamp-"]')
  ).map(elem => elem.id)
  .map(id => id.slice(10))
  .filter(id => id.length)
  .map(id => parseFloat(id))
  .sort((a, b) => b - a) // Reverse sort
  .map(time => time.toFixed(3));

const audio = document.getElementById("narration");

audio.onplay = function () {
  audio.style = "width: 100%; position: sticky; top: 69px;";
}

let lastParagraph = null;

audio.ontimeupdate = function() {
  const time = audio.currentTime;
  const paragraph = paragraphTimes.find(paragraphTime => time > paragraphTime);
  if (paragraph !== undefined && !audio.paused) {
    if (lastParagraph === null || paragraph !== lastParagraph) {
      if (lastParagraph !== null) {
        const oldMarker = document.getElementById(`timestamp-${lastParagraph}`);
        const oldReadingElement = oldMarker.nextElementSibling;
        oldReadingElement.style = "";
      }

      const marker = document.getElementById(`timestamp-${paragraph}`);
      const readingElement = marker.nextElementSibling;
      readingElement.style = "border-radius: 4px; background-color: #fef9ef;";
      readingElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });

      lastParagraph = paragraph;
    }
  }
}
