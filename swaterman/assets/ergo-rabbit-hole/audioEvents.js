const paragraphTimes = Array.from(
    document.querySelectorAll('[id^="audio_book_paragraph_"]')
  ).map(elem => elem.id)
  .map(id => id.slice(21))
  .filter(id => id.length)
  .map(id => parseFloat(id))
  .sort((a, b) => b - a); // Reverse sort

const audio = document.getElementById("audio_book");

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
        const oldMarker = document.getElementById(`audio_book_paragraph_${lastParagraph}`);
        const oldReadingElement = oldMarker.nextElementSibling;
        oldReadingElement.style = "";
      }

      const marker = document.getElementById(`audio_book_paragraph_${paragraph}`);
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

function skip() {
  const marker = document.getElementById(`audio_book_paragraph_1924`);
  const conclusion = marker.nextElementSibling;
  conclusion.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center"
  });

  if (!audio.paused) {
    audio.currentTime = 1924;
  }
}
