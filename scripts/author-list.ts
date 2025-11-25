declare const BASE_URL: string;

export function loadAuthorList() {
  fetch(BASE_URL + "/authors.json", {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    .then((postCounts: Author[]) => {
      const activeAuthors = postCounts.filter((author) => author.isActive);
      displayCarousel(activeAuthors);
      displayLetterFilter(activeAuthors);
      localStorage.setItem("activeAuthors", JSON.stringify(activeAuthors));
    });
}

const PAGE_SIZE = 12;

function loadAuthorListForLetter(letter: string) {
  const activeAuthors: Author[] = JSON.parse(
    localStorage.getItem("activeAuthors") ?? "",
  );
  const filteredAuthors = activeAuthors.filter(
    (author) =>
      author.name.charAt(0).toLocaleLowerCase() == letter.toLocaleLowerCase(),
  );
  clearCarousel();
  displayCarousel(filteredAuthors);
}

function displayCarousel(authorList: Author[]) {
  authorList.sort(compareAuthor);

  const pageCount = Math.floor(authorList.length / PAGE_SIZE);
  const remainder = authorList.length % PAGE_SIZE;

  for (let i = 0; i < pageCount; i++) {
    const start = i * PAGE_SIZE;
    const end = (i + 1) * PAGE_SIZE;

    const authorsForPage = authorList.slice(start, end);
    displayPage(i, authorsForPage);
  }

  if (remainder) {
    const start = pageCount * PAGE_SIZE;
    const end = authorList.length;

    const authorsForPage = authorList.slice(start, end);
    displayPage(pageCount, authorsForPage);
  }
}

function displayPage(pageNumber: number, authors: Author[]) {
  const carouselDiv = document.getElementById("author-carousel");
  if (!carouselDiv) {
    throw Error("Cannot find element with id: 'author-carousel'");
  }
  const carouselPage = carouselDiv.appendChild(document.createElement("div"));
  const pageId = `author-grid${pageNumber}`;
  carouselPage.id = pageId;
  carouselPage.classList.add("cell");
  carouselPage.classList.add("author-grid");

  addScrollMarker(carouselPage, pageNumber);

  for (const author of authors) {
    displayAuthor(carouselPage, author);
  }
}

function displayAuthor(element: HTMLElement, author: Author) {
  const authorIcon = element.appendChild(document.createElement("a"));
  authorIcon.classList.add("author-icon");
  authorIcon.href = BASE_URL + `/${author.authorId}`;
  const avatar = authorIcon.appendChild(document.createElement("div"));
  avatar.classList.add("author-list-avatar");
  const image = avatar.appendChild(document.createElement("img"));
  image.role = "presentation";
  image.alt = author.name ?? "";
  image.loading = "lazy";
  if (author.picture) {
    image.src = BASE_URL + `/${author.authorId}/${author.picture}`;
  } else {
    image.src = BASE_URL + `/assets/avatar.png`;
  }

  const name = authorIcon.appendChild(document.createElement("div"));
  name.classList.add("author-name");
  name.textContent = author.name;

  const postCountText = authorIcon.appendChild(document.createElement("div"));
  postCountText.classList.add("author-post-count");
  postCountText.textContent =
    author.postCount == 1
      ? `${author.postCount} Blog post`
      : `${author.postCount} Blog posts`;
}

function addScrollMarker(targetElement: HTMLElement, pageNumber: number) {
  const pageSelector = document.getElementById("scroll-marker-group");
  if (!pageSelector) {
    throw Error("Cannot find element with id: 'scroll-marker-group'");
  }
  const pageMarker = pageSelector.appendChild(document.createElement("button"));
  pageMarker.classList.add("scroll-marker");
  if (pageNumber == 0) {
    pageMarker.classList.add("active");
  }
  pageMarker.onclick = () => {
    const scrollMarkers = pageSelector.querySelectorAll(".scroll-marker");
    for (const marker of scrollMarkers) {
      marker.classList.remove("active");
    }
    targetElement.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
    pageMarker.classList.add("active");
  };
}

function clearCarousel() {
  const carouselDiv = document.getElementById("author-carousel");
  if (!carouselDiv) {
    throw Error("Cannot find element with id: 'author-carousel'");
  }
  carouselDiv.innerHTML = "";
  clearScrollMarkers();
}

function clearScrollMarkers() {
  const pageSelector = document.getElementById("scroll-marker-group");
  if (!pageSelector) {
    throw Error("Cannot find element with id: 'scroll-marker-group'");
  }
  pageSelector.innerHTML = "";
}

function displayLetterFilter(authors: Author[]) {
  for (const letter of alphabet) {
    if (
      authors.find((author) =>
        author.name.toLocaleLowerCase().startsWith(letter.toLocaleLowerCase()),
      )
    ) {
      const letterGroup = document.getElementById("letter-group");
      if (!letterGroup) {
        throw Error("Cannot find element with id: 'letter-group'");
      }
      const aButton = letterGroup.appendChild(document.createElement("button"));
      aButton.innerText = letter;
      aButton.onclick = () => {
        loadAuthorListForLetter(letter);
      };
    }
  }
}

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

interface Author {
  name: string;
  picture: string;
  authorId: string;
  postCount: number;
  isActive: boolean;
}

/*
 * Sort by number of posts descending, then by name
 */
function compareAuthor(a: Author, b: Author) {
  if (a.postCount > b.postCount) {
    return -1;
  }
  if (a.postCount < b.postCount) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}
