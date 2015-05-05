/**
 * @fileOverview ColorClicker GameController
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.1
 */

/**
 * @namespace ColorClicker
 */
var ColorClicker = ColorClicker || {};

/**
 * @namespace GameController
 * @memberof ColorClicker
 */
ColorClicker.GameController = (function () {
    "use strict";
    /* eslint-env browser */
    var config,
        currentLevel,
        view;

    /**
     * @private
     * @function loadHighscore
     * @memberof ColorClicker.GameController
     * @description Loads the current highscore from localstorage into the highscore member
     */
    function loadHighscore() {
        return localStorage.getItem(config.highscoreStorageKey);
    }

    /**
     * @private
     * @function saveHighscore
     * @memberof ColorClicker.GameController
     * @description Saves the current highscore from the currentLevel member to localstorage and the highscore member
     */
    function saveHighscore() {
        var highscore = loadHighscore();
        if (currentLevel > highscore) {
            localStorage.setItem(config.highscoreStorageKey, currentLevel);
        }
    }

    /**
     * @private
     * @function initGame
     * @memberof ColorClicker.GameController
     * @description Initializes a new game round
     * @param {Number} startLevel Level-Index to start with
     * @param {Number} boxCount Number of boxes displayed in this round
     * @param {Object} color Color used to draw the boxes in this round
     * @param {Number} deviation Color deviation for this round
     */
    function initGame(startLevel, boxCount, color, deviation) {
        var highscore = loadHighscore();
        view.clearBoxes();
        view.setScore(startLevel, highscore);
        view.addBoxes(boxCount, color, deviation);
    }

    /**
     * @function startNextRound
     * @memberof ColorClicker.GameController
     * @description Starts a new round by initializing the next level
     */
    function startNextRound() {
        var boxCount = config.defaultBoxCount,
            color = ColorClicker.Color.getRandomColor(),
            deviation = config.defaultBoxDeviation - (currentLevel * config.deviationFactor);

        currentLevel++;

        if (currentLevel < config.boxesPerLevel.length) {
            boxCount = config.boxesPerLevel[currentLevel];
        } else {
            boxCount = config.boxesPerLevel[config.boxesPerLevel.length - 1];
        }

        if (deviation <= config.minimalDeviation) {
            deviation = config.minimalDeviation;
        }

        initGame(currentLevel, boxCount, color, deviation);
    }

    /**
     * @private
     * @function resetGame
     * @memberof ColorClicker.GameController
     * @description Resets the game by setting the current level to 0
     */
    function resetGame() {
        currentLevel = 0;
    }

    /**
     * @public
     * @function startNewGame
     * @memberof ColorClicker.GameController
     * @description Starts a new game by initializing the first level
     */
    function startNewGame() {
        var color = ColorClicker.Color.getRandomColor();
        saveHighscore();
        resetGame();
        initGame(currentLevel, config.defaultBoxCount, color, config.defaultBoxDeviation);
    }

    function onTargetBoxClicked() {
        startNextRound();
    }

    function onNonTargetBoxClicked() {
        view.revealTarget(startNewGame);
    }

    /**
     * @public
     * @function init
     * @memberof ColorClicker.GameController
     * @param {Object} gameConfig Configuration object
     * @param gameConfig.highscoreStorageKey Access key to get/store the highscore in local storage
     * @param gameConfig.defaultBoxDeviation Default rgb deviation between box color and target color
     * @param gameConfig.defaultBoxCount Default number of boxes
     * @param gameConfig.minimalDeviation Minimal color deviation
     * @param gameConfig.deviationFactor Factor used to calculate color deviation decrease for each level
     * @param gameConfig.boxesPerLevel Array with number of boxes for each level
     * @param {Object} viewController ViewController to be used by this module
     */
    function init(gameConfig, viewController) {
        var viewConfig = {
            boxesPerRow: 8,
            restartDelay: 2000,
            onTargetClicked: onTargetBoxClicked,
            onTargetMissed: onNonTargetBoxClicked,
            boardView: document.querySelector("#board"),
            scoreView: document.querySelector("#info .score .current"),
            highscoreView: document.querySelector("#info .score .highscore")
        };
        config = gameConfig;
        view = viewController;
        view.init(viewConfig);
    }

    return {
        init: init,
        start: startNewGame
    };
})();
