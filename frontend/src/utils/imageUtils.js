// Fonction pour compresser une image
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        // Vérifier la taille du fichier (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            reject(new Error('Image size must be less than 5MB'));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculer les nouvelles dimensions
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            // Redimensionner l'image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir en base64 avec compression
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // Vérifier la taille du résultat compressé
            const base64Size = compressedDataUrl.length * 0.75; // Approximation de la taille en bytes
            if (base64Size > maxSize) {
                reject(new Error('Image is still too large after compression. Please choose a smaller image.'));
                return;
            }

            resolve(compressedDataUrl);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(file);
    });
};

// Fonction pour valider le type de fichier
export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
    }

    if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
    }

    return true;
};

// Fonction pour obtenir la taille du fichier en format lisible
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 