document.getElementById('search-bar').addEventListener('input', function() {
    var filter = this.value.toLowerCase();
    var posts = document.querySelectorAll('.foto');

    posts.forEach(function(post) {
        var title = post.querySelector('h2 a').textContent.toLowerCase();
        if (title.includes(filter)) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
});