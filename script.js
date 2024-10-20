const API_URL = 'https://api.jsonbin.io/v3/b/66fabe03e41b4d34e43ab133';  // Reemplaza con el ID de tu bin
const API_KEY = '$2a$10$IySOsp8KPzkmNsT3HX4iOefVmsBhQm.V0KwP6k6sdeJflkVcqm1ry';  // Reemplaza con tu API Key de JSONBin

// Función para obtener los comentarios del bin
async function fetchComments() {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'X-Master-Key': API_KEY
        }
    });
    const data = await response.json();
    return data.record.comments;
}

// Función para subir un comentario
async function submitComment(comment) {
    const currentComments = await fetchComments();
    currentComments.push(comment);

    await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ comments: currentComments })
    });
}

// Mostrar los últimos 3 comentarios
function displayComments(comments) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '';  // Limpiar comentarios previos

    const latestComments = comments.slice(-3);  // Obtener los últimos 3

    latestComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.style.fontFamily = "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";

        // Estilos aplicados a las secciones individuales para separarlas
        commentDiv.innerHTML = `
            <div style="margin-bottom: 20px;">
                <strong style="font-size: 16px;">Nombre:</strong> 
                <span style="font-size: 14px;">${comment.username}</span>
            </div>
            <div style="margin-bottom: 20px;">
                <strong style="font-size: 16px;">Película Favorita:</strong> 
                <span style="font-size: 14px;">${comment.favoriteMovie}</span>
            </div>
            <div style="margin-bottom: 20px;">
                <strong style="font-size: 16px;">Comentario:</strong> <br>
                <span style="font-size: 14px;">${comment.message}</span>
            </div>
        `;
        commentsDiv.appendChild(commentDiv);
    });
}

// Función para validar los campos
function validateForm() {
    const username = document.getElementById('username').value;
    const favoriteMovie = document.getElementById('favoriteMovie').value;
    const genre = document.getElementById('genre').value;
    const newComment = document.getElementById('newComment').value;

    if (username.trim() === '' || favoriteMovie.trim() === '' || genre.trim() === '' || newComment.trim() === '') {
        return false;
    }
    return true;
}

// Cuando el documento cargue, obtenemos los comentarios y los mostramos
document.addEventListener('DOMContentLoaded', async () => {
    const comments = await fetchComments();
    displayComments(comments);
});

// Evento al enviar un nuevo comentario
document.getElementById('submitComment').addEventListener('click', async () => {
    const errorMessage = document.getElementById('errorMessage');

    if (validateForm()) {
        const username = document.getElementById('username').value;
        const favoriteMovie = document.getElementById('favoriteMovie').value;
        const genre = document.getElementById('genre').value;
        const newComment = document.getElementById('newComment').value;

        const comment = {
            username: username,
            favoriteMovie: favoriteMovie,
            genre: genre,  // Se guarda el género pero no se muestra
            message: newComment
        };

        await submitComment(comment);
        const comments = await fetchComments();
        displayComments(comments);  // Actualizar la lista de comentarios
        document.getElementById('newComment').value = '';  // Limpiar el textarea
        document.getElementById('username').value = '';
        document.getElementById('favoriteMovie').value = '';
        document.getElementById('genre').value = '';

        errorMessage.style.display = 'none';  // Ocultar el mensaje de error
    } else {
        errorMessage.style.display = 'block';  // Mostrar el mensaje de error si los campos están vacíos
    }
});

// Evento para filtrar comentarios por género
document.getElementById('filterButton').addEventListener('click', async () => {
    const selectedGenre = document.getElementById('filterGenre').value;
    const comments = await fetchComments();

    if (selectedGenre) {
        const filteredComments = comments.filter(comment => comment.genre === selectedGenre);
        if (filteredComments.length > 0) {
            displayComments(filteredComments);  // Mostrar los comentarios filtrados
        } else {
            const commentsDiv = document.getElementById('comments');
            commentsDiv.innerHTML = "<p>No hay películas con ese filtro.</p>";
        }
    } else {
        displayComments(comments);  // Mostrar todos los comentarios si no hay filtro
    }
});




