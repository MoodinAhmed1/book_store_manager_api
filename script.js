let books = []

//function to load books
async function loadBooksFromFile() {
    try {
        const response = await fetch('./books.JSON'); // path to my JSON file
        books = await response.json();

        console.log("Books loaded:", books);

    } catch (error) {
        console.error("Failed to load books:", error);
    }
}

loadBooksFromFile(); //loads books

let currentPage = 1;
const booksPerPage = 8;
let currentBookList = []; // Will hold filtered or full books

function paginate(array, page = 1, perPage = booksPerPage) {
    const start = (page - 1) * perPage;
    return array.slice(start, start + perPage);
}

function renderPagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Prev button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-link";
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            render(paginate(currentBookList, currentPage));
            renderPagination(currentBookList.length);
        }
    });
    prevLi.appendChild(prevBtn);
    pagination.appendChild(prevLi);

    // Numbered buttons
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        const btn = document.createElement("button");
        btn.className = "page-link";
        btn.innerText = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            render(paginate(currentBookList, currentPage));
            renderPagination(currentBookList.length);
        });
        li.appendChild(btn);
        pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-link";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            render(paginate(currentBookList, currentPage));
            renderPagination(currentBookList.length);
        }
    });
    nextLi.appendChild(nextBtn);
    pagination.appendChild(nextLi);
}


let row = document.querySelector('.books-row .row')

function render(bookArray) {
    row.innerHTML = "";

    if (bookArray.length === 0) {
        row.innerHTML = "<p>No books found.</p>";
        return;
    }

    bookArray.forEach(book => {
        let cardContainer = document.createElement('div')
            cardContainer.className = "col-xl-3 col-lg-6 col-md-12 d-flex justify-content-center"
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

        let viewMoreDiv = document.createElement('div');
            viewMoreDiv.className = 'btn btn-dark';
            viewMoreDiv.setAttribute('data-bs-toggle', 'modal');
            viewMoreDiv.setAttribute('data-bs-target', '#bookModal');
            viewMoreDiv.addEventListener('click', () => {
                document.getElementById('bookModalLabel').textContent = book.title;
                document.getElementById('modalImage').src = book.image;
                document.getElementById('modalAuthor').textContent = `by ${book.author}`;
                document.getElementById('modalDescription').textContent = book.description;
                document.getElementById('modalGenre').textContent = book.genre;
                document.getElementById('modalPrice').textContent = book.price.toFixed(2);
                document.getElementById('modalISBN').textContent = book.isbn;
                document.getElementById('modalStock').textContent = book.inStock;
                document.getElementById('add-to-cart').onclick = () => addToCart(book);
            });
        infoDiv.append(viewMoreDiv);


        let eyeIcon = document.createElement('i')
            eyeIcon.className = "bi bi-eye-fill"
        viewMoreDiv.append(eyeIcon)

        let viewMoreText = document.createElement('p')
            viewMoreText.className = "m-0 d-inline ps-1"
            viewMoreText.innerHTML =  `<small>View</small>`
        viewMoreDiv.append(viewMoreText)

        let addToCartDiv = document.createElement('div')
            addToCartDiv.className = 'btn btn-dark'
            addToCartDiv.onclick = () => addToCart(book);
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
    
function filterBooks() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const genre = document.getElementById("genreSelect").value;
    const inStockOnly = document.getElementById("inStock").checked;
    const minPrice = parseFloat(document.getElementById("minPrice").value);
    const maxPrice = parseFloat(document.getElementById("maxPrice").value);

    const filtered = books.filter(book => {
        const matchesQuery = [book.title, book.author, book.genre, book.isbn]
            .some(field => field.toLowerCase().includes(query));
        const matchesGenre = genre ? book.genre === genre : true;
        const matchesStock = inStockOnly ? book.inStock : true;
        const matchesPrice = (!isNaN(minPrice) ? book.price >= minPrice : true) &&
                                (!isNaN(maxPrice) ? book.price <= maxPrice : true);

        return matchesQuery && matchesGenre && matchesStock && matchesPrice;
    });

    currentPage = 1;
    currentBookList = filtered;
    render(paginate(filtered, currentPage));
    renderPagination(filtered.length);
}

function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("genreSelect").value = "";
    document.getElementById("inStock").checked = false;
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    currentPage = 1;
    currentBookList = books;
    render(paginate(books, currentPage));
    renderPagination(books.length);
}

// Event Listeners
document.getElementById("searchInput").addEventListener("input", filterBooks);
document.getElementById("genreSelect").addEventListener("change", filterBooks);
document.getElementById("inStock").addEventListener("change", filterBooks);
document.getElementById("minPrice").addEventListener("input", filterBooks);
document.getElementById("maxPrice").addEventListener("input", filterBooks);


function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;

    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';     

    cart.forEach((item,i) => {
        let div = document.createElement('div');            
            div.className = 'd-flex align-items-center justify-content-between border-bottom mb-2 bg-light rounded p-2';
            div.style.width = '100%';
            div.style.maxWidth = '500px';
            div.style.margin = '0 auto';
            div.style.borderRadius = '5px'; // Rounded corners for a cleaner look
            div.style.border = '1px solid #dee2e6'; // Subtle border for separation
            div.style.marginBottom = '10px'; // Spacing between items
        
            div.innerHTML = `
                <div class="d-flex align-items-center justify-content-between w-100">
                    <div>
                        <strong>${item.title}</strong><br>
                        <small>by ${item.author}</small>
                    </div>
                    <div class="text-end me-3">
                        <strong>$${item.price.toFixed(2)}</strong>
                    </div>
                </div>
            `;

        let deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Remove';
        deleteButton.onclick = () => {
            cart.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        };
        div.appendChild(deleteButton);      
        cartItems.appendChild(div);
    });

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    document.getElementById('totalPrice').textContent = `Total: $${totalPrice.toFixed(2)}`;

    const checkoutButton = document.getElementById('checkoutButton');
    if (cart.length > 0) {
        checkoutButton.style.display = 'block';
        checkoutButton.onclick = () => checkout();
    } else {
        checkoutButton.style.display = 'none';
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    }
}

function addToCart(book) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function checkout() {
  alert('Proceeding to checkout...');
}

updateCartUI();

setTimeout(() => {
currentBookList = books;
render(paginate(books, currentPage));
renderPagination(books.length);
}, 1000);
