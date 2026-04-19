// Function for Home Page button
function addToWatchlist() {
    alert("Inception added to your watchlist!");
}

// Function for Watchlist Page remove button
function removeMovie(buttonElement) {
    // Ye line button ke parent container (watchlist-item) ko dhund kar use delete karti hai
    let movieRow = buttonElement.parentElement.parentElement;
    movieRow.remove();
    
    alert("Movie removed from watchlist.");
}