'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
}
if (overlay) {
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Check if element has data-target attribute, otherwise use innerHTML
    const targetPage = this.dataset.target || this.innerHTML.toLowerCase();

    for (let i = 0; i < pages.length; i++) {
      if (targetPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Gallery Slideshow functionality
function initSlideshows() {
  const slideshows = document.querySelectorAll('.slideshow .slides');
  
  slideshows.forEach(slidesContainer => {
    const slides = slidesContainer.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideInterval = 7000; // 7 seconds per slide for images
    let isVideoPlaying = false;
    let slideshowTimer = null;
    let dots = [];
    let pendingSlide = null; // Track pending slide change while loading
    
    // Get the media container to check loading state
    const mediaContainer = slidesContainer.closest('.media-container');
    
    // Check if loading is complete
    function isLoadingComplete() {
      return mediaContainer && mediaContainer.classList.contains('loaded');
    }
    
    // Create dots indicator if more than 1 slide
    if (slides.length > 1) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'slideshow-dots';
      
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'slideshow-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
      
      // Insert dots after the slides container
      slidesContainer.parentElement.appendChild(dotsContainer);
    }
    
    // Update dots
    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    // Function to go to specific slide
    function goToSlide(index, force = false) {
      if (index === currentSlide) return;
      
      // If loading is not complete, don't switch slides automatically
      // But store the pending slide to switch to after loading
      if (!force && !isLoadingComplete()) {
        pendingSlide = index;
        // Restart timer to try again later
        startImageTimer();
        return;
      }
      
      // Hide current slide
      slides[currentSlide].style.opacity = '0';
      slides[currentSlide].classList.remove('active');
      
      // Pause video if it's a video
      if (slides[currentSlide].tagName === 'VIDEO') {
        slides[currentSlide].pause();
        slides[currentSlide].currentTime = 0;
      }
      
      // Move to target slide
      currentSlide = index;
      pendingSlide = null;
      
      // Show target slide
      slides[currentSlide].style.opacity = '1';
      slides[currentSlide].classList.add('active');
      updateDots();
      
      // Auto-play video if it's a video (muted)
      if (slides[currentSlide].tagName === 'VIDEO') {
        slides[currentSlide].muted = true;
        slides[currentSlide].play().catch(() => {});
      } else {
        // For images, set timer for next slide
        startImageTimer();
      }
    }
    
    // Function to go to next slide
    function goToNextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }
    
    // Start timer for image slides
    function startImageTimer() {
      if (slideshowTimer) clearTimeout(slideshowTimer);
      if (slides.length > 1) {
        slideshowTimer = setTimeout(goToNextSlide, slideInterval);
      }
    }
    
    // Function to handle pending slides after loading completes
    function onLoadingComplete() {
      if (pendingSlide !== null) {
        goToSlide(pendingSlide, true);
      } else if (slides[currentSlide].tagName === 'VIDEO') {
        // If current slide is video, play it now
        slides[currentSlide].muted = true;
        slides[currentSlide].play().catch(() => {});
      }
    }
    
    // Watch for loading complete
    if (mediaContainer) {
      // Use MutationObserver to watch for 'loaded' class
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class' && mediaContainer.classList.contains('loaded')) {
            onLoadingComplete();
            observer.disconnect();
          }
        });
      });
      observer.observe(mediaContainer, { attributes: true });
      
      // Also check if already loaded
      if (isLoadingComplete()) {
        onLoadingComplete();
      }
    }
    
    // Initialize all slides
    slides.forEach((slide, index) => {
      slide.style.opacity = index === 0 ? '1' : '0';
      
      // Setup videos
      if (slide.tagName === 'VIDEO') {
        slide.muted = true;
        slide.loop = false; // Don't loop - we'll handle cycling
        
        if (index !== 0) {
          slide.pause();
          slide.currentTime = 0;
        }
        
        // Track video play state
        slide.addEventListener('play', () => {
          isVideoPlaying = true;
          if (slideshowTimer) clearTimeout(slideshowTimer);
        });
        
        slide.addEventListener('pause', () => {
          isVideoPlaying = false;
        });
        
        // When video ends, go to next slide
        slide.addEventListener('ended', () => {
          isVideoPlaying = false;
          if (slides.length > 1) {
            goToNextSlide();
          } else {
            // Single video - restart it
            slide.currentTime = 0;
            slide.play().catch(() => {});
          }
        });
      }
    });
    
    // Mark first slide as active
    slides[0].classList.add('active');
    
    // Auto-play first slide if it's a video, otherwise start image timer
    if (slides[0].tagName === 'VIDEO') {
      slides[0].muted = true;
      // Try to play immediately
      slides[0].play().catch(() => {});
      // Also try when video is ready to play
      slides[0].addEventListener('canplay', function onCanPlay() {
        if (this.classList.contains('active')) {
          this.muted = true;
          this.play().catch(() => {});
        }
        this.removeEventListener('canplay', onCanPlay);
      });
    } else if (slides.length > 1) {
      startImageTimer();
    }
  });
}

// Custom Video Player functionality
function initVideoPlayers() {
  const videos = document.querySelectorAll('.media-container video');
  
  videos.forEach(video => {
    // Ensure video is muted
    video.muted = true;
    video.removeAttribute('controls');
    
    // Create wrapper if not already wrapped
    if (!video.parentElement.classList.contains('video-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-wrapper';
      video.parentNode.insertBefore(wrapper, video);
      wrapper.appendChild(video);
      
      // Create play overlay
      const playOverlay = document.createElement('div');
      playOverlay.className = 'video-play-overlay';
      playOverlay.innerHTML = '<ion-icon name="play"></ion-icon>';
      wrapper.appendChild(playOverlay);
      
      // Create custom controls
      const controls = document.createElement('div');
      controls.className = 'video-controls';
      controls.innerHTML = `
        <button class="video-play-btn" aria-label="Play/Pause">
          <ion-icon name="play" class="play-icon"></ion-icon>
          <ion-icon name="pause" class="pause-icon" style="display:none;"></ion-icon>
        </button>
        <div class="video-progress">
          <div class="video-progress-bar"></div>
        </div>
      `;
      wrapper.appendChild(controls);
      
      const playBtn = controls.querySelector('.video-play-btn');
      const playIcon = controls.querySelector('.play-icon');
      const pauseIcon = controls.querySelector('.pause-icon');
      const progressBar = controls.querySelector('.video-progress-bar');
      const progress = controls.querySelector('.video-progress');
      
      // Play/Pause button
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
      
      // Click on wrapper to play/pause
      wrapper.addEventListener('click', () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
      
      // Update icons on play/pause
      video.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        wrapper.classList.add('playing');
        playOverlay.style.display = 'none';
      });
      
      video.addEventListener('pause', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        wrapper.classList.remove('playing');
        playOverlay.style.display = 'flex';
      });
      
      // Update progress bar
      video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percent + '%';
      });
      
      // Click on progress bar to seek
      progress.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
      });
      
      // Auto-play video when it becomes visible (muted)
      video.muted = true;
      
      // For non-slideshow videos, auto-play
      if (!video.closest('.slideshow')) {
        video.play().catch(() => {});
        wrapper.classList.add('playing');
        playOverlay.style.display = 'none';
      }
      
      // For slideshow videos, check if it's the active slide
      if (video.closest('.slide.active')) {
        video.play().catch(() => {});
        wrapper.classList.add('playing');
        playOverlay.style.display = 'none';
      }
    }
  });
}

// Gallery loading bar functionality
function initGalleryLoading() {
  const mediaContainers = document.querySelectorAll('.gallery .media-container');
  
  mediaContainers.forEach(container => {
    // Add loading bar
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'media-loading';
    loadingDiv.innerHTML = `
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
      </div>
      <div class="loading-text">Loading...</div>
    `;
    container.appendChild(loadingDiv);
    
    const loadingBar = loadingDiv.querySelector('.loading-bar');
    const loadingText = loadingDiv.querySelector('.loading-text');
    
    // Get all media elements
    const images = container.querySelectorAll('img');
    const videos = container.querySelectorAll('video');
    
    let loadedCount = 0;
    const totalMedia = images.length + videos.length;
    
    // Update progress bar
    function updateProgress() {
      const percent = totalMedia > 0 ? Math.round((loadedCount / totalMedia) * 100) : 100;
      loadingBar.style.width = percent + '%';
      loadingText.textContent = percent + '%';
    }
    
    function checkAllLoaded() {
      loadedCount++;
      updateProgress();
      
      if (loadedCount >= totalMedia) {
        container.classList.add('loaded');
        // Auto-play active video after loading completes
        const activeVideo = container.querySelector('.slide.active');
        if (activeVideo && activeVideo.tagName === 'VIDEO') {
          activeVideo.muted = true;
          activeVideo.play().catch(() => {});
        }
      }
    }
    
    // Handle image loading
    images.forEach(img => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded); // Also mark as loaded on error
      }
    });
    
    // Handle video loading with progress tracking
    videos.forEach(video => {
      // Track video download progress
      video.addEventListener('progress', () => {
        if (video.buffered.length > 0 && video.duration) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const videoPercent = (bufferedEnd / video.duration) * 100;
          // Update individual video progress contribution
          const basePercent = (loadedCount / totalMedia) * 100;
          const videoContribution = (videoPercent / 100) * (100 / totalMedia);
          loadingBar.style.width = Math.min(basePercent + videoContribution, 100) + '%';
        }
      });
      
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
        checkAllLoaded();
      } else {
        video.addEventListener('loadeddata', checkAllLoaded);
        video.addEventListener('canplay', checkAllLoaded);
        video.addEventListener('error', checkAllLoaded); // Also mark as loaded on error
      }
    });
    
    // Fallback: remove loading after 10 seconds regardless
    setTimeout(() => {
      container.classList.add('loaded');
      // Try to play active video on fallback too
      const activeVideo = container.querySelector('.slide.active');
      if (activeVideo && activeVideo.tagName === 'VIDEO') {
        activeVideo.muted = true;
        activeVideo.play().catch(() => {});
      }
    }, 10000);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGalleryLoading();
  initSlideshows();
  initVideoPlayers();
});
