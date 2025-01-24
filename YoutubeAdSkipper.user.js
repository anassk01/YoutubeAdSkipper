// ==UserScript==
// @name         YouTube Ad Skipper
// @version      1.4
// @description  Simple ad skip button for YouTube
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @author       anassk
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

    const reloadVideo = () => {
        const player = document.querySelector('video');
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (player && videoId) {
            const videoTime = player.currentTime;
            const moviePlayer = document.getElementById('movie_player');
            if (moviePlayer) {
                moviePlayer.loadVideoById(videoId, videoTime);
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
