// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = slides.length;

function showSlide(index: number) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => {
        dot.classList.remove('bg-opacity-100');
        dot.classList.add('bg-opacity-50');
    });

    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.remove('bg-opacity-50');
    dots[index].classList.add('bg-opacity-100');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}



// Navigation smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('nav button');
    
    // Add click event listeners to each button
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const buttonText = target.textContent?.trim().toLowerCase();
            
            if (buttonText === 'home') {
                // Scroll to top of page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (buttonText === 'tours') {
                // Scroll to tours section
                const toursSection = document.getElementById('tours');
                if (toursSection) {
                    toursSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (buttonText === 'contact') {
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Initialize dark mode
    initDarkMode();
});



// Search functionality
const searchInput = document.getElementById('locationSearch') as HTMLInputElement;
const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const locationCards = document.getElementById('locationCards')?.children;
const searchResultsCount = document.getElementById('searchResultsCount');
const searchCategories = document.querySelectorAll('.search-category');

// Define categories for each location
const locationCategories: { [key: string]: string[] } = {
    'Colosseum': ['ancient'],
    'Vatican City': ['religious'],
    'Trevi Fountain': ['modern'],
    'Roman Forum': ['ancient'],
    'Pantheon': ['ancient', 'religious'],
    'Spanish Steps': ['modern'],
    'Piazza Navona': ['modern'],
    'Trastevere': ['modern'],
    'Villa Borghese': ['modern'],
    'Castel Sant\'Angelo': ['ancient', 'religious'],
    'St. Peter\'s Basilica': ['religious']
};

let currentCategory = 'all';
let searchTimeout: number | undefined;

// Category selection
searchCategories.forEach(category => {
    category.addEventListener('click', () => {
        // Update active state
        searchCategories.forEach(cat => {
            cat.classList.remove('bg-black', 'text-white');
            cat.classList.add('bg-gray-100', 'text-gray-700');
        });
        category.classList.remove('bg-gray-100', 'text-gray-700');
        category.classList.add('bg-black', 'text-white');
        
        // Update current category
        currentCategory = (category as HTMLElement).dataset.category || 'all';
        
        // Reapply current search with new category
        if (searchInput) {
            filterLocations(searchInput.value);
        }
    });
});

// Search button click handler
searchButton?.addEventListener('click', () => {
    if (searchInput) {
        filterLocations(searchInput.value);
    }
});

// Enhanced search functionality with debouncing
searchInput?.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value;
    
    // Clear previous timeout
    if (searchTimeout) {
        window.clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    searchTimeout = window.setTimeout(() => {
        filterLocations(searchTerm);
    }, 300);
});

// Add enter key handler for search input
searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        filterLocations(searchInput.value);
    }
});

function filterLocations(searchTerm: string) {
    if (!locationCards) return;
    
    let visibleCount = 0;
    const searchTermLower = searchTerm.toLowerCase();
    
    Array.from(locationCards).forEach(card => {
        const title = card.querySelector('h4')?.textContent || '';
        const description = card.querySelector('p')?.textContent || '';
        const address = card.querySelector('.text-sm')?.textContent || '';
        
        // Check if location matches current category
        const matchesCategory = currentCategory === 'all' || 
            locationCategories[title]?.includes(currentCategory);
        
        // Check if location matches search term
        const matchesSearch = searchTermLower === '' ||
            title.toLowerCase().includes(searchTermLower) ||
            description.toLowerCase().includes(searchTermLower) ||
            address.toLowerCase().includes(searchTermLower);
        
        // Show/hide based on both category and search term
        if (matchesCategory && matchesSearch) {
            (card as HTMLElement).style.display = 'block';
            visibleCount++;
        } else {
            (card as HTMLElement).style.display = 'none';
        }
    });
    
    // Update results count
    if (searchResultsCount) {
        if (visibleCount === 0) {
            searchResultsCount.textContent = 'No attractions found matching your search.';
        } else {
            searchResultsCount.textContent = `Showing ${visibleCount} attraction${visibleCount !== 1 ? 's' : ''}`;
        }
    }
}

// Initialize search state
filterLocations('');

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    // Initialize first slide
    showSlide(0);
    
    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // Reset the interval
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Pause carousel on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
});



// Dark mode functionality
function initDarkMode(): void {
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.remove('light');
    html.classList.add('dark');
}

// Toggle dark mode
darkModeToggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    html.classList.toggle('light');
    localStorage.setItem('darkMode', html.classList.contains('dark').toString());
});
}



// Contact form functionality
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    newsletter: boolean;
}

interface ApiResponse {
    status: 'success' | 'error';
    message?: string;
    [key: string]: any;
}

// Simple form submission function
async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    // Store original button text
    const originalButtonText = submitButton.textContent;
    
    try {
        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(form);
        
        // Add timestamp
        formData.append('timestamp', new Date().toISOString());
        
        // Log the form data for debugging
        console.log('Form data being sent:', Object.fromEntries(formData));
        
        // Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyCCMWS7u39z76S7-DypDfdb-cbM9MVhdfZA5b8DV5nQFXuMhnteEsztEu1lzp6Zcmu/exec';
        
        // Send data using fetch
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // This is important for Google Apps Script
        });
        
        console.log('Form submitted successfully');
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset the form
        form.reset();
        
    } catch (error) {
        console.error('Submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Re-enable button and restore original text
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Function to show notifications
function showNotification(message: string, type: 'success' | 'error'): void {
    // Remove any existing notifications
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Initialize carousel
function initCarousel(): void {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    
    // Function to show a specific slide
    function showSlide(index: number): void {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('bg-opacity-100'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('bg-opacity-100');
        currentSlide = index;
    }
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        showSlide((currentSlide + 1) % slides.length);
    }, 5000);
}

// Initialize search functionality
function initSearch(): void {
    const searchInput = document.getElementById('locationSearch') as HTMLInputElement;
    const searchButton = document.getElementById('searchButton');
    const locationCards = document.querySelectorAll('#locationCards > div');
    const searchResultsCount = document.getElementById('searchResultsCount');
    
    if (searchInput && searchButton && searchResultsCount) {
        // Function to filter locations
        function filterLocations(): void {
            const searchTerm = searchInput.value.toLowerCase();
            let visibleCount = 0;
            
            locationCards.forEach(card => {
                const title = card.querySelector('h4')?.textContent?.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent?.toLowerCase() || '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    (card as HTMLElement).style.display = '';
                    visibleCount++;
                } else {
                    (card as HTMLElement).style.display = 'none';
                }
            });
            
            // Update results count
            if (searchResultsCount) {
                searchResultsCount.textContent = `Showing ${visibleCount} of ${locationCards.length} locations`;
            }
        }
        
        // Add event listeners
        searchButton.addEventListener('click', filterLocations);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterLocations();
            }
        });
    }
}

// Location details data
interface LocationDetails {
    title: string;
    description: string;
    address: string;
    images: string[];
    comments: string[];
    shortDescription: string;
}

const locationDetails: Record<string, LocationDetails> = {
    'Colosseum': {
        title: 'Colosseum',
        description: 'The Colosseum, also known as the Flavian Amphitheatre, is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff (volcanic rock), and brick-faced concrete, it was the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
        address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ],
        comments: [
            'Absolutely breathtaking! The history here is palpable.',
            'A must-visit when in Rome. The guided tour was informative and fascinating.',
            'The architecture is incredible. It\'s hard to believe it\'s still standing after all these years.',
            'I was amazed by the size and grandeur of this ancient structure.',
            'The underground chambers (hypogeum) were the highlight of my visit.'
        ],
        shortDescription: 'The iconic amphitheater that once hosted gladiatorial contests and public spectacles.'
    },
    'Vatican City': {
        title: 'Vatican City',
        description: 'Vatican City, officially the Vatican City State, is the smallest country in the world by both area and population. Located within Rome, Italy, it is the headquarters of the Roman Catholic Church and home to the Pope. The Vatican Museums house some of the world\'s most important art collections, including the Sistine Chapel with Michelangelo\'s famous ceiling frescoes.',
        address: 'Vatican City, 00120 Vatican City',
        images: [
            'https://images.unsplash.com/photo-1566438480900-0609be27a4be',
            'https://images.unsplash.com/photo-1566438480900-0609be27a4be'
        ],
        comments: [
            'The Sistine Chapel is even more impressive in person than in photos.',
            'The Vatican Museums are a treasure trove of art and history.',
            'St. Peter\'s Basilica is magnificent. The architecture and artwork are stunning.',
            'I was moved by the spiritual atmosphere of this holy place.',
            'The Vatican Gardens are a peaceful escape from the crowds.'
        ],
        shortDescription: 'The world\'s smallest independent state, home to St. Peter\'s Basilica and the Sistine Chapel.'
    },
    'Trevi Fountain': {
        title: 'Trevi Fountain',
        description: 'The Trevi Fountain is the largest Baroque fountain in the city and one of the most famous fountains in the world. Standing 26.3 metres high and 49.15 metres wide, it is the largest Baroque fountain in the city and one of the most famous fountains in the world. The fountain has appeared in several notable films, including Federico Fellini\'s La Dolce Vita.',
        address: 'Piazza di Trevi, 00187 Roma RM, Italy',
        images: [
            'https://plus.unsplash.com/premium_photo-1661962915628-cb4f8dddcca5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1661962915628-cb4f8dddcca5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1661962915628-cb4f8dddcca5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        comments: [
            'The fountain is even more beautiful at night when it\'s lit up.',
            'I threw a coin in the fountain and made a wish. Fingers crossed it comes true!',
            'The crowds can be overwhelming, but it\'s worth it to see this masterpiece.',
            'The details in the sculptures are incredible. Each figure tells a story.',
            'I recommend visiting early in the morning to avoid the crowds.'
        ],
        shortDescription: 'The largest Baroque fountain in Rome, famous for its coin-throwing tradition.'
    },
    'Pantheon': {
        title: 'Pantheon',
        description: 'The Pantheon is a former Roman temple and, since 609 AD, a Catholic church, in Rome, Italy, on the site of an earlier temple commissioned by Marcus Agrippa during the reign of Augustus. It was rebuilt by the emperor Hadrian and probably dedicated about 126 AD. Its date of construction is uncertain, because Hadrian chose not to inscribe the new temple but rather to retain the inscription of Agrippa\'s older temple, which had burned down.',
        address: 'Piazza della Rotonda, 00186 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1565357177333-0a9625c87f4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFudGhlb258ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1565357177333-0a9625c87f4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFudGhlb258ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1565357177333-0a9625c87f4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFudGhlb258ZW58MHx8MHx8fDA%3D'
        ],
        comments: [
            'The dome is an engineering marvel. The oculus lets in beautiful natural light.',
            'I was amazed by the perfect proportions of this ancient building.',
            'The Pantheon has survived for almost 2000 years - a testament to Roman engineering.',
            'The interior is surprisingly spacious and peaceful.',
            'I recommend visiting during a rain shower to see the oculus in action!'
        ],
        shortDescription: 'A former Roman temple, now a church, known for its perfect proportions and massive dome.'
    },
    'Roman Forum': {
        title: 'Roman Forum',
        description: 'The Roman Forum, also known by its Latin name Forum Romanum, is a rectangular forum surrounded by the ruins of several important ancient government buildings at the center of the city of Rome. Citizens of the ancient city referred to this space, originally a marketplace, as the Forum Magnum, or simply the Forum.',
        address: 'Via della Salara Vecchia, 5/6, 00186 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1643759435882-29d5f3674c54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1643759435882-29d5f3674c54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1643759435882-29d5f3674c54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        comments: [
            'Walking through the Forum is like stepping back in time to ancient Rome.',
            'The guided tour helped me understand the significance of each building.',
            'I was amazed by how much of the original structures are still standing.',
            'The Temple of Saturn is particularly impressive with its columns still intact.',
            'I recommend visiting early in the morning to avoid the crowds and heat.'
        ],
        shortDescription: 'The heart of ancient Rome, featuring ruins of important government buildings and temples.'
    },
    'Spanish Steps': {
        title: 'Spanish Steps',
        description: 'The Spanish Steps are a set of steps in Rome, Italy, climbing a steep slope between the Piazza di Spagna at the base and Piazza Trinità dei Monti at the top, dominated by the Trinità dei Monti church. The stairway of 135 steps was built between 1723 and 1725 to link the Bourbon Spanish Embassy and the Trinità dei Monti church.',
        address: 'Piazza di Spagna, 00187 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        comments: [
            'The view from the top of the steps is spectacular, especially at sunset.',
            'I enjoyed people-watching while sitting on the steps.',
            'The Barcaccia Fountain at the base is beautiful and historic.',
            'The steps are a great meeting point in the heart of Rome.',
            'I recommend visiting in the spring when the steps are decorated with flowers.'
        ],
        shortDescription: 'A famous staircase connecting the Piazza di Spagna with the Trinità dei Monti church.'
    },
    'Piazza Navona': {
        title: 'Piazza Navona',
        description: 'Piazza Navona is a public open space in Rome, Italy. It is built on the site of the Stadium of Domitian, built in 1st century AD, and follows the form of the open space of the stadium. The ancient Romans came there to watch the agones ("games"), and hence it was known as "Circus Agonalis".',
        address: 'Piazza Navona, 00186 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1662398885856-cf2ab6e981b2?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1662398885856-cf2ab6e981b2?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1662398885856-cf2ab6e981b2?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        comments: [
            'The fountains are magnificent, especially the Fontana dei Quattro Fiumi.',
            'I enjoyed the street performers and artists in the square.',
            'The restaurants around the piazza offer great people-watching opportunities.',
            'The church of Sant\'Agnese in Agone is beautiful and worth a visit.',
            'I recommend visiting in the evening when the piazza comes alive with activity.'
        ],
        shortDescription: 'A beautiful square featuring three magnificent fountains and Baroque architecture.'
    },
    'Trastevere': {
        title: 'Trastevere',
        description: 'Trastevere is the 13th rione of Rome: it is identified by the initials R. XIII and it is located within Municipio I. Its name comes from the Latin trans Tiberim, meaning literally "beyond the Tiber". Its logo is a golden head of a lion on a red background, the meaning of which is uncertain.',
        address: 'Trastevere, Rome, Italy',
        images: [
            'https://media.istockphoto.com/id/1406990536/photo/rome-italy-at-basilica-of-our-lady-in-trastevere.jpg?s=612x612&w=0&k=20&c=2MgXXDku6UEwQUaLW3wj5napIUZSWAQL3rbIvwUgyQA=',
            'https://media.istockphoto.com/id/1406990536/photo/rome-italy-at-basilica-of-our-lady-in-trastevere.jpg?s=612x612&w=0&k=20&c=2MgXXDku6UEwQUaLW3wj5napIUZSWAQL3rbIvwUgyQA=',
            'https://media.istockphoto.com/id/1406990536/photo/rome-italy-at-basilica-of-our-lady-in-trastevere.jpg?s=612x612&w=0&k=20&c=2MgXXDku6UEwQUaLW3wj5napIUZSWAQL3rbIvwUgyQA='
        ],
        comments: [
            'The narrow streets and colorful buildings give Trastevere a village feel.',
            'I loved the authentic restaurants and trattorias in this neighborhood.',
            'The Basilica of Santa Maria in Trastevere is beautiful, especially at night.',
            'Trastevere has a great nightlife scene with lots of bars and pubs.',
            'I recommend exploring the neighborhood on foot to discover hidden gems.'
        ],
        shortDescription: 'A charming neighborhood known for its narrow streets, restaurants, and nightlife.'
    },
    'Villa Borghese': {
        title: 'Villa Borghese',
        description: 'Villa Borghese is a landscape garden in Rome, containing a number of buildings, museums and attractions. It is the third largest public park in Rome (80 hectares or 197.7 acres) after the ones of the Villa Doria Pamphili and Villa Ada.',
        address: 'Piazzale Scipione Borghese, 00197 Roma RM, Italy',
        images: [
            'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_XO_wbMzmGMxaWrbd5X-G506xoBeScGSsffSXrfh1zV5cyWXpHsVSE43JE4TZihn3n-xiN2OvjgbePN8diAc_WLSSAMFIiXKdLcIovEmC6_XK0m7iA8VGtR5nuMf2sWydX0upV=s680-w680-h510',
            'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_XO_wbMzmGMxaWrbd5X-G506xoBeScGSsffSXrfh1zV5cyWXpHsVSE43JE4TZihn3n-xiN2OvjgbePN8diAc_WLSSAMFIiXKdLcIovEmC6_XK0m7iA8VGtR5nuMf2sWydX0upV=s680-w680-h510',
            'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_XO_wbMzmGMxaWrbd5X-G506xoBeScGSsffSXrfh1zV5cyWXpHsVSE43JE4TZihn3n-xiN2OvjgbePN8diAc_WLSSAMFIiXKdLcIovEmC6_XK0m7iA8VGtR5nuMf2sWydX0upV=s680-w680-h510'
        ],
        comments: [
            'The Borghese Gallery houses an incredible collection of Bernini sculptures.',
            'I enjoyed renting a bike and exploring the park\'s many paths.',
            'The view of Rome from the Pincio Terrace is breathtaking.',
            'The park is a peaceful escape from the busy city center.',
            'I recommend visiting the Bioparco di Roma (zoo) with children.'
        ],
        shortDescription: 'A large public park featuring museums, gardens, and beautiful views of Rome.'
    },
    'Castel Sant\'Angelo': {
        title: 'Castel Sant\'Angelo',
        description: 'The Mausoleum of Hadrian, usually known as Castel Sant\'Angelo, is a towering cylindrical building in Parco Adriano, Rome, Italy. It was initially commissioned by the Roman Emperor Hadrian as a mausoleum for himself and his family. The building was later used by the popes as a fortress and castle, and is now a museum.',
        address: 'Lungotevere Castello, 50, 00193 Roma RM, Italy',
        images: [
            'https://images.unsplash.com/photo-1619787007549-c5ef089619ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1619787007549-c5ef089619ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1619787007549-c5ef089619ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        comments: [
            'The view from the top terrace is one of the best in Rome.',
            'I was fascinated by the history of this building as both a mausoleum and a fortress.',
            'The Passetto di Borgo, the secret passage to the Vatican, is a highlight of the tour.',
            'The museum inside has interesting exhibits about the castle\'s history.',
            'I recommend visiting at sunset for the best views and photos.'
        ],
        shortDescription: 'A towering cylindrical building that was originally built as a mausoleum for Emperor Hadrian.'
    }
};

// Location data interface
interface LocationData {
    title: string;
    description: string;
    images: string[];
    comments: {
        user: string;
        text: string;
        date: string;
    }[];
}

interface Locations {
    [key: string]: LocationData;
}

// Location data
const locations: Locations = {
    'colosseum': {
        title: 'Colosseum',
        description: 'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
        images: [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5'
        ],
        comments: [
            { user: 'John', text: 'Amazing historical site!', date: '2024-03-15' },
            { user: 'Maria', text: 'A must-visit in Rome!', date: '2024-03-14' }
        ]
    },
    'vatican': {
        title: 'Vatican City',
        description: 'Vatican City is the headquarters of the Roman Catholic Church and the Pope\'s residence. It is the smallest independent state in the world by both area and population.',
        images: [
            'https://images.unsplash.com/photo-1566438480900-0609be27a4be',
            'https://images.unsplash.com/photo-1566438480900-0609be27a4be'
        ],
        comments: [
            { user: 'Peter', text: 'Beautiful architecture!', date: '2024-03-13' },
            { user: 'Sarah', text: 'The art is incredible!', date: '2024-03-12' }
        ]
    },
    'trevi': {
        title: 'Trevi Fountain',
        description: 'The Trevi Fountain is the largest Baroque fountain in the city and one of the most famous fountains in the world. Standing 26.3 metres high and 49.15 metres wide, it is the largest Baroque fountain in the city and one of the most famous fountains in the world.',
        images: [
            'https://plus.unsplash.com/premium_photo-1661962915628-cb4f8dddcca5',
            'https://plus.unsplash.com/premium_photo-1661962915628-cb4f8dddcca5'
        ],
        comments: [
            { user: 'Alex', text: 'Beautiful fountain! The crowds can be overwhelming though.', date: '2024-03-11' },
            { user: 'Emma', text: 'I threw a coin in and made a wish!', date: '2024-03-10' }
        ]
    },
    'pantheon': {
        title: 'Pantheon',
        description: 'The Pantheon is a former Roman temple and, since 609 AD, a Catholic church, in Rome, Italy, on the site of an earlier temple commissioned by Marcus Agrippa during the reign of Augustus.',
        images: [
            'https://images.unsplash.com/photo-1565357177333-0a9625c87f4c',
            'https://images.unsplash.com/photo-1565357177333-0a9625c87f4c'
        ],
        comments: [
            { user: 'Michael', text: 'The dome is an engineering marvel!', date: '2024-03-09' },
            { user: 'Sophia', text: 'I was amazed by the perfect proportions.', date: '2024-03-08' }
        ]
    },
    'forum': {
        title: 'Roman Forum',
        description: 'The Roman Forum, also known by its Latin name Forum Romanum, is a rectangular forum surrounded by the ruins of several important ancient government buildings at the center of the city of Rome.',
        images: [
            'https://images.unsplash.com/photo-1643759435882-29d5f3674c54',
            'https://images.unsplash.com/photo-1643759435882-29d5f3674c54'
        ],
        comments: [
            { user: 'David', text: 'Walking through history!', date: '2024-03-07' },
            { user: 'Olivia', text: 'The guided tour was very informative.', date: '2024-03-06' }
        ]
    },
    'spanish-steps': {
        title: 'Spanish Steps',
        description: 'The Spanish Steps are a set of steps in Rome, Italy, climbing a steep slope between the Piazza di Spagna at the base and Piazza Trinità dei Monti at the top, dominated by the Trinità dei Monti church.',
        images: [
            'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f',
            'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f'
        ],
        comments: [
            { user: 'James', text: 'Great place to people watch!', date: '2024-03-05' },
            { user: 'Isabella', text: 'Beautiful view from the top.', date: '2024-03-04' }
        ]
    },
    'navona': {
        title: 'Piazza Navona',
        description: 'Piazza Navona is a public open space in Rome, Italy. It is built on the site of the Stadium of Domitian, built in 1st century AD, and follows the form of the open space of the stadium.',
        images: [
            'https://images.unsplash.com/photo-1662398885856-cf2ab6e981b2',
            'https://images.unsplash.com/photo-1662398885856-cf2ab6e981b2'
        ],
        comments: [
            { user: 'Robert', text: 'The fountains are magnificent!', date: '2024-03-03' },
            { user: 'Sophie', text: 'Great place for street performers.', date: '2024-03-02' }
        ]
    },
    'trastevere': {
        title: 'Trastevere',
        description: 'Trastevere is the 13th rione of Rome: it is identified by the initials R. XIII and it is located within Municipio I. Its name comes from the Latin trans Tiberim, meaning literally "beyond the Tiber".',
        images: [
            'https://media.istockphoto.com/id/1406990536/photo/rome-italy-at-basilica-of-our-lady-in-trastevere.jpg',
            'https://media.istockphoto.com/id/1406990536/photo/rome-italy-at-basilica-of-our-lady-in-trastevere.jpg'
        ],
        comments: [
            { user: 'William', text: 'Charming neighborhood with great restaurants!', date: '2024-03-01' },
            { user: 'Charlotte', text: 'I loved the narrow streets and colorful buildings.', date: '2024-02-29' }
        ]
    },
    'borghese': {
        title: 'Villa Borghese',
        description: 'Villa Borghese is a landscape garden in Rome, containing a number of buildings, museums and attractions. It is the third largest public park in Rome (80 hectares or 197.7 acres) after the ones of the Villa Doria Pamphili and Villa Ada.',
        images: [
            'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_XO_wbMzmGMxaWrbd5X-G506xoBeScGSsffSXrfh1zV5cyWXpHsVSE43JE4TZihn3n-xiN2OvjgbePN8diAc_WLSSAMFIiXKdLcIovEmC6_XK0m7iA8VGtR5nuMf2sWydX0upV=s680-w680-h510',
            'https://lh3.googleusercontent.com/gps-cs-s/AB5caB_XO_wbMzmGMxaWrbd5X-G506xoBeScGSsffSXrfh1zV5cyWXpHsVSE43JE4TZihn3n-xiN2OvjgbePN8diAc_WLSSAMFIiXKdLcIovEmC6_XK0m7iA8VGtR5nuMf2sWydX0upV=s680-w680-h510'
        ],
        comments: [
            { user: 'Thomas', text: 'Beautiful park with great views of Rome!', date: '2024-02-28' },
            { user: 'Amelia', text: 'The Borghese Gallery is a must-visit.', date: '2024-02-27' }
        ]
    },
    'castel': {
        title: 'Castel Sant\'Angelo',
        description: 'The Mausoleum of Hadrian, usually known as Castel Sant\'Angelo, is a towering cylindrical building in Parco Adriano, Rome, Italy. It was initially commissioned by the Roman Emperor Hadrian as a mausoleum for himself and his family.',
        images: [
            'https://images.unsplash.com/photo-1619787007549-c5ef089619ea',
            'https://images.unsplash.com/photo-1619787007549-c5ef089619ea'
        ],
        comments: [
            { user: 'Daniel', text: 'The view from the top is spectacular!', date: '2024-02-26' },
            { user: 'Victoria', text: 'Interesting history as both a mausoleum and a fortress.', date: '2024-02-25' }
        ]
    }
};

// DOM Elements for modal
const modal = document.getElementById('locationModal');
const modalTitle = document.getElementById('modalTitle');
const modalImages = document.getElementById('modalImages');
const modalDescription = document.getElementById('modalDescription');
const modalComments = document.getElementById('modalComments');
const closeModal = document.getElementById('closeModal');

// Modal Functions
function openModal(locationId: string): void {
    const location = locations[locationId];
    if (!location || !modalTitle || !modalDescription || !modalImages || !modalComments || !modal) return;

    // Update modal content
    modalTitle.textContent = location.title;
    modalDescription.textContent = location.description;

    // Update images
    modalImages.innerHTML = location.images.map(img => `
        <img src="${img}" alt="${location.title}" class="w-full h-64 object-cover rounded-lg">
    `).join('');

    // Update comments
    modalComments.innerHTML = location.comments.map(comment => `
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="font-semibold">${comment.user}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">${comment.date}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">${comment.text}</p>
        </div>
    `).join('');

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModalHandler(): void {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Add modal event listeners to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {

    // Add click event listeners to all "More" buttons
    document.querySelectorAll('.more-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const locationId = target.dataset.location;
            if (locationId) {
                openModal(locationId);
            }
        });
    });

    // Close modal when clicking the close button
    closeModal?.addEventListener('click', closeModalHandler);

    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModalHandler();
        }
    });
});

// Mobile navigation and theme switch functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavButtons = mobileMenu?.querySelectorAll('button');

    mobileMenuButton?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a nav button
    mobileNavButtons?.forEach(button => {
        button.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
        });
    });

    // Theme switch functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }

    // Function to toggle theme
    function toggleTheme() {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Add event listeners to both theme toggle buttons
    darkModeToggle?.addEventListener('click', toggleTheme);
    mobileDarkModeToggle?.addEventListener('click', toggleTheme);
});
