export async function fetchBooks(
  query: string,
  type: string,
  page: number,
  maxResults: number
) {
  if (!query) {
    return null;
  }

  if (type) {
    query = `${type}:${query}`;
  }
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&startIndex=${page * maxResults}&maxResults=${maxResults}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}
