document.addEventListener('DOMContentLoaded', function() {
    const fileLinks = document.querySelectorAll('.file-link');
    const progressBar = document.getElementById('progress-bar');

    fileLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior (navigation)
            const fileUrl = this.getAttribute('data-url');
            downloadFile(fileUrl);
        });
    });

    function downloadFile(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = getFileNameFromUrl(url);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a); // Clean up
            }
        };

        xhr.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
            }
        });

        xhr.send();
    }

    function getFileNameFromUrl(url) {
        const startIndex = url.lastIndexOf('/') + 1;
        const endIndex = url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.length;
        return decodeURIComponent(url.substring(startIndex, endIndex));
    }
});
