// ==UserScript==
// @name         YouTube Ad Skipper
// @version      1.7
// @description  Two-step precise timestamp skip
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    const skipButton = document.createElement('button');
    skipButton.innerHTML = '>';
    skipButton.style.cssText = `
        position: absolute;
        bottom: 70px;
        right: 5px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;

    let storedTime = 0;

    const reloadVideo = () => {
        const player = document.querySelector('video');
        const videoId = new URLSearchParams(window.location.search).get('v');
        
        if (player && videoId) {
            // Step 1: Store the exact time
            storedTime = player.currentTime;
            
            // Step 2: Reload video
            const moviePlayer = document.getElementById('movie_player');
            if (moviePlayer) {
                moviePlayer.loadVideoById(videoId);
                
                // Step 3: Set exact time after a brief moment
                const setStoredTime = () => {
                    moviePlayer.seekTo(storedTime, true);
                    player.currentTime = storedTime;
                };

                // Wait for player to be ready
                const checkAndSetTime = setInterval(() => {
                    if (player.readyState >= 3) { // HAVE_FUTURE_DATA or better
                        setStoredTime();
                        clearInterval(checkAndSetTime);
                    }
                }, 50);
            }
        }
    };

    skipButton.addEventListener('click', reloadVideo);

    const initializeButton = () => {
        const player = document.querySelector('video');
        if (player) {
            const playerContainer = player.closest('.html5-video-player');
            if (playerContainer && !playerContainer.querySelector('.skip-button')) {
                skipButton.classList.add('skip-button');
                playerContainer.appendChild(skipButton);
            }
        } else {
            setTimeout(initializeButton, 1000);
        }
    };

    GM_addStyle(`
        .skip-button:hover {
            background: rgba(0, 0, 0, 0.9) !important;
        }
    `);

    initializeButton();
})();
