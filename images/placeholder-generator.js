// Placeholder Image Generator Script
// Run this in browser console to generate placeholder images for the gallery

const images = [
    { name: 'protest-1.jpg', text: 'Student Protests', color: '#006A4E' },
    { name: 'protest-2.jpg', text: 'University March', color: '#004d38' },
    { name: 'yunus.jpg', text: 'Dr. Muhammad Yunus', color: '#0066cc' },
    { name: 'celebration.jpg', text: 'Victory', color: '#F42A41' },
    { name: 'youth.jpg', text: 'Youth Power', color: '#9932CC' },
    { name: 'interim-govt.jpg', text: 'New Government', color: '#8B4513' }
];

images.forEach(img => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = img.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(img.text, canvas.width / 2, canvas.height / 2);
    
    // Download
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = img.name;
        a.click();
    });
});

console.log('Placeholder images generated!');
