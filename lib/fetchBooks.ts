export async function fetchBooks(query: string, type: string) {
  if (!query) {
    return null;
  }

  if (type) {
    query = `${type}:${query}`;
  }
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

// types : inauthor - intitle

// Data : title, authors[0], description, imageLinks.thumbnail
