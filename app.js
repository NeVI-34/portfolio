/**
 * Nevin Reji Portfolio JavaScript (Aesthetic Glassmorphic CyberPortal Edition)
 * Theme controls, Mobile Navigation, Intersection Observers, and Dual-Orb Canvas Mesh Aura.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME SWITCHER LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark mode
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); 
    htmlElement.setAttribute('data-theme', initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update mesh colors when theme changes
        if (typeof updateMeshColors === 'function') {
            updateMeshColors();
        }
    });

    // --- 2. MOBILE NAVIGATION DRAWERS ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // --- 3. ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER) ---
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- 3.5 REVEAL ON SCROLL OBSERVER ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. DUAL-ORB CANVAS AURA MESH BACKGROUND ---
    const canvas = document.getElementById('cyber-bg');
    const ctx = canvas.getContext('2d');

    let accentRGB = '';
    let accent2RGB = '';
    let glowRadius = 400;
    let opacity = 0.05; // Base opacity for dark theme mesh

    // Coordinate States
    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isMouseActive = false;

    // Orb 1 (Cyan)
    const orb1 = { x: cursor.x, y: cursor.y, vx: 0, vy: 0 };
    // Orb 2 (Violet)
    const orb2 = { x: cursor.x + 100, y: cursor.y - 100, vx: 0, vy: 0 };

    // Harmonic float variables for idle state
    let angle1 = 0;
    let angle2 = Math.PI;

    // Read colors from CSS custom properties
    function getThemeAuraColors() {
        const styles = getComputedStyle(document.documentElement);
        const hex1 = styles.getPropertyValue('--color-accent').trim() || '#00f0ff';
        const hex2 = styles.getPropertyValue('--color-accent-2').trim() || '#a855f7';
        const theme = htmlElement.getAttribute('data-theme');

        // Setup opacity & sizes based on active theme
        opacity = theme === 'light' ? 0.025 : 0.06;
        glowRadius = theme === 'light' ? 320 : 420;

        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };

        accentRGB = hexToRgb(hex1) || '0, 240, 255';
        accent2RGB = hexToRgb(hex2) || '168, 85, 247';
    }

    window.updateMeshColors = function() {
        getThemeAuraColors();
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update Target coordinates based on cursor or float orbits
        if (isMouseActive) {
            // Orb 1: Eases directly toward the mouse
            orb1.x += (cursor.x - orb1.x) * 0.04;
            orb1.y += (cursor.y - orb1.y) * 0.04;

            // Orb 2: Orbitally rotates around Orb 1 with easing lag
            angle2 += 0.01;
            const targetOrb2X = orb1.x + Math.cos(angle2) * 150;
            const targetOrb2Y = orb1.y + Math.sin(angle2) * 150;
            orb2.x += (targetOrb2X - orb2.x) * 0.03;
            orb2.y += (targetOrb2Y - orb2.y) * 0.03;
        } else {
            // Idle Floating: Dual Lissajous Orbits around center
            angle1 += 0.0025;
            angle2 -= 0.002;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const floatTarget1X = centerX + Math.cos(angle1) * (canvas.width * 0.22);
            const floatTarget1Y = centerY + Math.sin(angle1 * 1.5) * (canvas.height * 0.12);

            const floatTarget2X = centerX + Math.sin(angle2 * 1.2) * (canvas.width * 0.18);
            const floatTarget2Y = centerY + Math.cos(angle2) * (canvas.height * 0.15);

            orb1.x += (floatTarget1X - orb1.x) * 0.02;
            orb1.y += (floatTarget1Y - orb1.y) * 0.02;

            orb2.x += (floatTarget2X - orb2.x) * 0.02;
            orb2.y += (floatTarget2Y - orb2.y) * 0.02;
        }

        // Draw Orb 1 (Cyan Gradient)
        const grad1 = ctx.createRadialGradient(orb1.x, orb1.y, 0, orb1.x, orb1.y, glowRadius);
        grad1.addColorStop(0, `rgba(${accentRGB}, ${opacity})`);
        grad1.addColorStop(0.5, `rgba(${accentRGB}, ${opacity * 0.3})`);
        grad1.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.arc(orb1.x, orb1.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Orb 2 (Violet Gradient)
        const grad2 = ctx.createRadialGradient(orb2.x, orb2.y, 0, orb2.x, orb2.y, glowRadius * 0.9);
        grad2.addColorStop(0, `rgba(${accent2RGB}, ${opacity * 0.95})`);
        grad2.addColorStop(0.5, `rgba(${accent2RGB}, ${opacity * 0.28})`);
        grad2.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(orb2.x, orb2.y, glowRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(animate);
    }

    // Event hooks
    window.addEventListener('mousemove', (e) => {
        isMouseActive = true;
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        isMouseActive = false;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Start Up
    getThemeAuraColors();
    resizeCanvas();
    animate();
});
