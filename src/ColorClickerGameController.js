/**
 * @fileOverview ColorClicker GameController
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.0
 */
ColorClicker.GameController = (function () {
    var that = {},
        STORAGE_KEY_HIGHSCORE = 'COLOR_CLICKER_HIGHSCORE',
        DEFAULT_COLOR_DEVIATION = 60,
        DEFAULT_BOX_COUNT = 3,
        MIN_DEVIATION = 3,
        DEVIATION_FACTOR = 2,
        BOXES_PER_LEVEL = [3, 4, 6, 9, 9, 9, 12, 15, 16, 16, 20, 24, 25, 30, 36, 36, 36, 49],
        view = null,
        currentLevel = null,
        highscore = 0,

        init = function () {
            view = ColorClicker.View.init(_onBoxClicked, $('#board'), $('#info .score .current'), $('#info .score .highscore'));
            return that;
        },

        start = function () {
            _loadHighscore();
            _startNewGame();
        },

        /**
         * @callback onBoxClicked
         */
        _onBoxClicked = function (event) {
            if ($(event.target).data('isTarget') === true) {
                _startNextRound();
            } else {
                view.revealTarget(_startNewGame);
            }
        },


        /**
         * Starts a new game by initializing the first level
         * @callback startNewGameCallback
         * @private
         */
        _startNewGame = function () {
            var color = _getRandomColor();
            _saveHighscore();
            _resetGame();
            _initGame(currentLevel, DEFAULT_BOX_COUNT, color, DEFAULT_COLOR_DEVIATION);
        },

        /**
         * Starts a new round by initializing the next level, based on the current value of currentLevel
         * @callback startNewGameCallback
         */
        _startNextRound = function () {
            var boxCount = DEFAULT_BOX_COUNT,
                color = _getRandomColor(),
                deviation = DEFAULT_COLOR_DEVIATION - (currentLevel * DEVIATION_FACTOR);

            currentLevel++;

            if (currentLevel < BOXES_PER_LEVEL.length) {
                boxCount = BOXES_PER_LEVEL[currentLevel];
            } else {
                boxCount = BOXES_PER_LEVEL[BOXES_PER_LEVEL.length - 1];
            }

            if (deviation <= MIN_DEVIATION) {
                deviation = MIN_DEVIATION;
            }

            _initGame(currentLevel, boxCount, color, deviation);
        },


         /*
         * Initializes a new game round.
         * @private
         * @param {Number} currentLevel
         * @param {Number} boxCount Number of boxes displayed in this round.
         * @param {Object} color The color used to draw the boxes in this round.
         * @param {Number} color.red R channel of the color.
         * @param {Number} color.green G channel of the color.
         * @param {Number} color.blue B channel of the color. 
         * @param {Number} deviation Color deviation for this round. 
         */
        _initGame = function (currentLevel, boxCount, color, deviation) {
            view.clearBoxes();
            view.setScore(currentLevel, highscore);
            view.addBoxes(boxCount, color, deviation);
        },

         /*
         * Resets the game by setting the current level to 0
         * @private
         */
        _resetGame = function() {
            currentLevel = 0;
        },
        
        /*
         * Saves the current highscore from the currentLevel member to localstorage and the highscore member
         * @private
         */
        _saveHighscore = function() {
            if(currentLevel > highscore) {
                highscore = currentLevel;
                localStorage.setItem(STORAGE_KEY_HIGHSCORE, highscore);
            }
        },
        
         /*
         * Loads the current highscore from localstorage into the highscore member
         * @private
         */
        _loadHighscore = function() {
            highscore = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
        },

         /*
         * Generates and return a random pastel color, represented in RGB
         * @private
         * @returns {{red: Number, green: Number, blue: Number}}
         */
        _getRandomColor = function () {
            var r = Math.floor((Math.random() * 255) + 1),
                g = Math.floor((Math.random() * 255) + 1),
                b = Math.floor((Math.random() * 255) + 1);

            r = Math.floor((r + 255) / 2);
            g = Math.floor((g + 255) / 2);
            b = Math.floor((b + 255) / 2);

            return {
                red: r,
                green: g,
                blue: b
            };
        };

    that.init = init;
    that.start = start;


    return that;
})();