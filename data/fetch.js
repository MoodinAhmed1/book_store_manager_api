let categories = [
    "fiction", "science", "history", "fantasy", "romance",
    "biography", "philosophy", "art", "psychology", "technology",
    "mystery", "horror", "adventure", "poetry", "children",
    "comics", "travel", "religion", "education", "health"
];

let allBooks = []

async function getPopularBooksByCategory(subject) {
    let data = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=50`)
        .then(result => result.json());

    // Filter books with covers, sort descending & get top 10
    let sortedBooks = data.works
        .filter(book => book.cover_edition_key)
        .sort((a, b) => b.edition_count - a.edition_count)
        .slice(0, 10);

    // For each book, fetch the description from the work endpoint
    let formattedBooks = await Promise.all(sortedBooks.map(async (book) => {
        const isbn = book.cover_edition_key;
        const workKey = book.key; // e.g., "/works/OL12345W"

        let description = "No description available";
        try {
            let workData = await fetch(`https://openlibrary.org${workKey}.json`).then(res => res.json());

            if (workData.description) {
                description = typeof workData.description === "string"
                    ? workData.description
                    : workData.description.value;
            }
        } catch (e) {
            // Silently ignore errors and keep default description
        }

        return {
            title: book.title,
            author: book.authors?.[0]?.name || "Unknown",
            genre: subject,
            isbn,
            image: `https://covers.openlibrary.org/b/olid/${isbn}-M.jpg`,
            price: +(Math.floor(Math.random() * 20 + 5) + 0.99).toFixed(2),
            inStock: Math.random() > 0.4,
            description
        };
    }));

    return formattedBooks;
}


async function getAllBooks() {
    for(category of categories){
        let books = await getPopularBooksByCategory(category)
        allBooks.push(books)
        allBooks = allBooks.flat();
    }
    document.getElementById("output").textContent = JSON.stringify(allBooks, null, 2);
}

getAllBooks();