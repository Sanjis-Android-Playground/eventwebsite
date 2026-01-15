// Red Particles Animation - Optimized for low CPU usage
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.isMobile = this.detectMobile();
        this.particleCount = this.isMobile ? 25 : 50; // Reduced from 40/80
        this.animationId = null;
        this.isVisible = true;
        this.fps = 30; // Limit to 30fps instead of 60fps
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        
        this.resize();
        this.init();
        this.setupEventListeners();
        this.setupVisibilityCheck();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth < 768;
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isMobile = this.detectMobile();
        
        // Adjust particle count on resize
        const newCount = this.isMobile ? 40 : 80;
        if (newCount !== this.particleCount) {
            this.particleCount = newCount;
            this.particles = [];
            this.init();
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Throttled mouse move for desktop (only update every 50ms)
        let mouseTimeout;
        this.canvas.addEventListener('mousemove', (e) => {
            if (mouseTimeout) return;
            mouseTimeout = setTimeout(() => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                mouseTimeout = null;
            }, 50);
        });
        
        // Mouse leave - reset mouse position
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Throttled touch events for mobile
        let touchTimeout;
        this.canvas.addEventListener('touchmove', (e) => {
            if (touchTimeout) return;
            touchTimeout = setTimeout(() => {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                if (touch) {
                    this.mouse.x = touch.clientX - rect.left;
                    this.mouse.y = touch.clientY - rect.top;
                }
                touchTimeout = null;
            }, 50);
        }, { passive: true });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            if (touch) {
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
            }
        });
    }
    
    setupVisibilityCheck() {
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isVisible = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            } else {
                this.isVisible = true;
                this.animate();
            }
        });
        
        // Pause animation when hero section is not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.animationId && this.isVisible) {
                        this.animate();
                    }
                } else {
                    if (this.animationId) {
                        cancelAnimationFrame(this.animationId);
                        this.animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.isMobile));
        }
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Limit to 30fps
        const now = Date.now();
        const elapsed = now - this.then;
        
        if (elapsed < this.fpsInterval) {
            return;
        }
        
        this.then = now - (elapsed % this.fpsInterval);
        
        // Clear and draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        this.connectParticles();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    connectParticles() {
        const maxDistance = this.isMobile ? 100 : 150; // Shorter connections on mobile
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(244, 42, 65, ${opacity})`;
                    this.ctx.lineWidth = this.isMobile ? 0.5 : 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas, isMobile) {
        this.canvas = canvas;
        this.isMobile = isMobile;
        this.baseSpeed = isMobile ? 0.3 : 0.5; // Slower on mobile for smoother performance
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * this.baseSpeed;
        this.vy = (Math.random() - 0.5) * this.baseSpeed;
        this.radius = Math.random() * (this.isMobile ? 2 : 3) + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        
        // Red color variations (Bangladesh flag red)
        const redShades = [
            'rgba(244, 42, 65, 0.8)',   // Primary red
            'rgba(220, 38, 58, 0.7)',   // Darker red
            'rgba(255, 60, 80, 0.6)',   // Lighter red
            'rgba(200, 30, 50, 0.75)',  // Deep red
        ];
        this.color = redShades[Math.floor(Math.random() * redShades.length)];
    }
    
    update(mouse) {
        // Base movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction - particles move away from cursor
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceRadius = this.isMobile ? 100 : mouse.radius;
            
            if (distance < forceRadius) {
                const force = (forceRadius - distance) / forceRadius;
                const angle = Math.atan2(dy, dx);
                const moveDistance = force * (this.isMobile ? 3 : 5); // Less movement on mobile
                
                this.x += Math.cos(angle) * moveDistance;
                this.y += Math.sin(angle) * moveDistance;
            }
        }
        
        // Bounce off edges with damping
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx *= -0.9;
            this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.vy *= -0.9;
            this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        }
        
        // Gradual return to normal speed if slowed
        if (Math.abs(this.vx) < this.baseSpeed) {
            this.vx += (Math.random() - 0.5) * 0.05;
        }
        if (Math.abs(this.vy) < this.baseSpeed) {
            this.vy += (Math.random() - 0.5) * 0.05;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect (reduced on mobile for performance)
        if (!this.isMobile) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(244, 42, 65, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const particleSystem = new ParticleSystem(canvas);
        particleSystem.animate();
    }
});
