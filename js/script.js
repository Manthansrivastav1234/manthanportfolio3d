// Wait for the document to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js background
    initThreeJsBackground();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize skills tabs
    initSkillsTabs();
    
    // Initialize progress bars
    initProgressBars();
    
    // Initialize contact form
    initContactForm();
    
    // Animate elements when scrolled into view
    initScrollAnimations();
});

// Three.js 3D Background
function initThreeJsBackground() {
    const canvasContainer = document.getElementById('canvas-container');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);  // Adjusted far plane to 500 for better performance
    camera.position.z = 50;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio * 0.6); // Lower resolution, smoother performance

    renderer.setClearColor(0x2c3e50, 1);
    canvasContainer.appendChild(renderer.domElement);
    
    // Create a group to hold all particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Create particles
    const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
    
    // Add multiple particles
    for (let i = 0; i < 150; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position
        particle.position.x = Math.random() * 100 - 50;
        particle.position.y = Math.random() * 100 - 50;
        particle.position.z = Math.random() * 50 - 25;
        
        // Store initial position for animation
        particle.userData = {
            initialX: particle.position.x,
            initialY: particle.position.y,
            initialZ: particle.position.z,
            speed: Math.random() * 0.02 + 0.01,
            amplitude: Math.random() * 0.5 + 0.5
        };
        
        particlesGroup.add(particle);
    }
    
    // Create connections between particles
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.2 });
    const connections = [];
    
    function updateConnections() {
        // Remove old connections
        connections.forEach(connection => {
            scene.remove(connection);
        });
        connections.length = 0;
        
        // Find particles that are close to each other
        const particles = particlesGroup.children;
        const connectionDistance = 15;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const particleA = particles[i];
                const particleB = particles[j];
                
                const distance = particleA.position.distanceTo(particleB.position);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        particleA.position,
                        particleB.position
                    ]);
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial.clone());
                    line.material.opacity = opacity * 0.2;
                    
                    scene.add(line);
                    connections.push(line);
                }
            }
        }
    }
    
    // Mouse interaction
    const mouse = new THREE.Vector2();
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the entire particle group
        particlesGroup.rotation.y += 0.002;
        
        // Animate individual particles
        const particles = particlesGroup.children;
        const time = Date.now() * 0.001;
        
        particles.forEach(particle => {
            const { initialX, initialY, initialZ, speed, amplitude } = particle.userData;
            
            particle.position.x = initialX + Math.sin(time * speed) * amplitude;
            particle.position.y = initialY + Math.cos(time * speed) * amplitude;
            particle.position.z = initialZ + Math.sin(time * speed) * amplitude;
            
            // React to mouse position
            const mouseInfluence = 0.05;
            particle.position.x += (mouse.x * 20 - particle.position.x) * mouseInfluence;
            particle.position.y += (mouse.y * 20 - particle.position.y) * mouseInfluence;
        });
        
        // Update connections
        if (time % 0.1 < 0.01) {
            updateConnections();
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Skills tabs
function initSkillsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            const target = button.getAttribute('data-target');
            document.getElementById(`${target}-skills`).classList.add('active');
        });
    });
}

// Progress bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    }
    
    // Initial animation
    setTimeout(animateProgressBars, 500);
    
    // Animate on scroll
    window.addEventListener('scroll', () => {
        const skillsSection = document.getElementById('skills');
        const skillsPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (skillsPosition < screenPosition) {
            animateProgressBars();
        }
    });
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loader
            const loader = document.createElement('div');
            loader.className = 'loader';
            contactForm.appendChild(loader);
            
            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                // Remove loader
                contactForm.removeChild(loader);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `Thank you, ${formData.get('name')}! Your message has been sent.`;
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Enable submit button
                submitBtn.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    contactForm.removeChild(successMessage);
                }, 5000);
            }, 1500);
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .skill-item, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('tilt-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}
