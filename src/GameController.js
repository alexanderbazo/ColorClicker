/**
 * @fileOverview ColorClicker GameController
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.1
 */
var ColorClicker = ColorClicker || {};
ColorClicker.GameController = (function () {
    "use strict";
    /* eslint-env browser */
    var config,
        currentLevel,
        view;

    /*
     * Loads the current highscore from localstorage into the highscore member
     * @private
     */
    function loadHighscore() {
        return localStorage.getItem(config.highscoreStorageKey);
    }

    /*
     * Saves the current highscore from the currentLevel member to localstorage and the highscore member
     * @private
     */
    function saveHighscore() {
        var highscore = loadHighscore();
        if (currentLevel > highscore) {
            localStorage.setItem(config.highscoreStorageKey, currentLevel);
        }
    }

    /*
     * Initializes a new game round.
     * @private
     * @param {Number} currentLevel
     * @param {Number} boxCount Number of boxes displayed in this round.
     * @param {Object} color The color used to draw the boxes in this round.
     * @param {Number} deviation Color deviation for this round.
     */
    function initGame(startLevel, boxCount, color, deviation) {
        var highscore = loadHighscore();
        view.clearBoxes();
        view.setScore(startLevel, highscore);
        view.addBoxes(boxCount, color, deviation);
    }

    /**
     * Starts a new round by initializing the next level, based on the current value of currentLevel
     * @callback startNewGameCallback
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

    /*
     * Resets the game by setting the current level to 0
     * @private
     */
    function resetGame() {
        currentLevel = 0;
    }

    /**
     * Starts a new game by initializing the first level
     * @callback startNewGameCallback
     * @private
     */
    function startNewGame() {
        var color = ColorClicker.Color.getRandomColor();
        saveHighscore();
        resetGame();
        initGame(currentLevel, config.defaultBoxCount, color, config.defaultBoxDeviation);
    }

    /**
     * @callback onTargetBoxClicked
     */
    function onTargetBoxClicked() {
        startNextRound();
    }

    /**
     * @callback onNonTargetBoxClicked
     */
    function onNonTargetBoxClicked() {
        view.revealTarget(startNewGame);
    }

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
