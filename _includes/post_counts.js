fetch("/authors.json", {
  method: "GET",
  headers: { Accept: "application/json" },
})
  .then((response) => response.json())
  .then((postCounts) => {
    for (key in postCounts) {
      const postCountDiv = document.getElementById(`${key}-post-count`);
      const count = postCounts[key]?.post_count;

      if (postCountDiv && count > 0) {
        if (count == 1) {
          postCountDiv.textContent = `${postCounts[key].post_count} Blog post`;
        } else {
          postCountDiv.textContent = `${postCounts[key].post_count} Blog posts`;
        }
      }
    }
  });
