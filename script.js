let books = []

//function to load books
async function loadBooksFromFile() {
    try {
        const response = await fetch('./data/books.json'); // path to my JSON file
        books = await response.json();

        console.log("Books loaded:", books);

    } catch (error) {
        console.error("Failed to load books:", error);
    }
}

loadBooksFromFile(); //loads books

let row = document.querySelector('.books-row .row')

function render(books) {
    books.forEach(book => {
        let cardContainer = document.createElement('div')
            cardContainer.className = "col-md-3 d-flex justify-content-center"
        row.append(cardContainer)

        let card = document.createElement('div')
            card.className = "card"
        cardContainer.append(card)

        let cardBody = document.createElement('div')
            cardBody.className = "card-body d-flex flex-column justify-content-start align-items-center p-2"
        card.append(cardBody)

        let bookImg = document.createElement("img")
            bookImg.src = book.image
        cardBody.append(bookImg)

        let titleDiv = document.createElement('div')
            titleDiv.style.height = "50px"
            titleDiv.className = "d-flex align-items-center my-1"
        cardBody.append(titleDiv)

        let bookTitle = document.createElement('h6')
            bookTitle.innerHTML = book.title
            bookTitle.className = "text-center p-2"
        titleDiv.append(bookTitle)

        let bookAuthor = document.createElement('p')
            bookAuthor.innerHTML = `<small>${book.author}</small>`
            bookAuthor.className = "text-center my-0 mb-4"
        cardBody.append(bookAuthor)

        let infoDiv = document.createElement('div')
            infoDiv.className = "w-100 d-flex justify-content-between"
        cardBody.append(infoDiv)

        let viewMoreDiv = document.createElement('div')
            viewMoreDiv.className = 'btn btn-dark'
        infoDiv.append(viewMoreDiv)

        let eyeIcon = document.createElement('i')
            eyeIcon.className = "bi bi-eye-fill"
        viewMoreDiv.append(eyeIcon)

        let viewMoreText = document.createElement('p')
            viewMoreText.className = "m-0 d-inline ps-1"
            viewMoreText.innerHTML =  `<small>View</small>`
        viewMoreDiv.append(viewMoreText)

        let addToCartDiv = document.createElement('div')
            addToCartDiv.className = 'btn btn-dark'
        infoDiv.append(addToCartDiv)

        let cartIcon = document.createElement('i')
            cartIcon.className = "bi bi-cart-check-fill"
        addToCartDiv.append(cartIcon)

        let cartText = document.createElement('p')
            cartText.className = "m-0 d-inline ps-1"
            cartText.innerHTML =  `<small>Add to Cart</small>`
        addToCartDiv.append(cartText)
    })
}

setTimeout(()=> {
    render(books)
}, 1000)