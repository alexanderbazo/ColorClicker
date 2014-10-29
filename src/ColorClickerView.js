/**
 * @fileOverview ColorClicker View
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.0
 */
ColorClicker.View = (function () {
    var that = {},
        MAX_BOXES_PER_ROW = 8,
        REVEAL_DURATION = 1500,
        REVEAL_DELAY = 1000,
        board = null,
        clickCallback = null,
        score = null,
        highscore = null,


        init = function (newCallback, newBoard, newScore, newHighscore) {
            clickCallback = newCallback;
            board = newBoard;
            score = newScore;
            highscore = newHighscore;
            board.delegate('.box', 'click', clickCallback);
            return that;
        },

        /*
         * Updates the user interface wiht the current score and the highscore.
         * @public
         * @param {Number} newScore The current score.
         * @param {Number} newHighscore The current highscore.
         */
        setScore = function (newScore, newHighscore) {
            score.html(newScore);
            if (newHighscore > 0) {
                highscore.html('Best: ' + newHighscore);
            }
        },

         /*
         * Reveals the current target by fading out all other boxes. 
         * @public
         * @param {startNewGameCallback} The callback to be executed after revealing the targets
         */
        revealTarget = function (callback) {
            board.children().each(function (key, value) {
                var box = $(value);
                if (box.data('isTarget') === false) {
                    box.unbind('click');
                    box.animate({
                        opacity: 0
                    }, REVEAL_DURATION).delay(REVEAL_DELAY).queue(callback);
                }
            });

        },

        /*
         * Removes all boxes from the user interface.
         * @public
         */
        clearBoxes = function () {
            board.empty();
        },

        /*
         * Adds a number of boxes to the user interface. 
         * @public
         * @param {Number} count The number of boxes to be added (including the deviating target).
         * @param {Object} color The color used to draw the added boxes.
         * @param {Number} color.red R channel of the color.
         * @param {Number} color.green G channel of the color.
         * @param {Number} color.blue B channel of the color.
         * @param {Number} deviation Color deviation of the target box towards the other boxes. 
         * This number is subtracted from all three color channels.
         */
        addBoxes = function (count, color, deviation) {
            var boxes = [],
                targetIndex,
                cssColor = 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')',
                cssTargetColor = 'rgb(' + (color.red - deviation) + ',' + (color.green - deviation) + ',' + (color.blue - deviation) + ')';

            for (var i = 0; i < count; i++) {
                var box = $('<span class="box" />');
                box.data('isTarget', false);
                box.css('background-color', cssColor);
                boxes.push(box);
            }


            targetIndex = Math.floor((Math.random() * count));
            boxes[targetIndex].css('background-color', cssTargetColor);
            boxes[targetIndex].data('isTarget', true);

            board.append(boxes);

            _pack();

        },

         /*
         * Centers the visible boxes depending on the number of boxes per row. 
         * @private
         */
        _pack = function () {
            var boxes = board.children(),
                boxesPerRow = _calculateBoxesPerRow(boxes.size());

            if (boxesPerRow == 1) {
                boxesPerRow = boxes.size();
            }

            board.width(boxesPerRow * $(boxes[0]).outerWidth(true));


        },

         /*
         * Calculates the number of boxes per row depending on the total number of boxes 
         * and the maximum number visible in one row
         * @private
         * @returns {Number} Number of boxes to render in one row.
         */
        _calculateBoxesPerRow = function (count) {
            var boxesPerRow = MAX_BOXES_PER_ROW;

            for (var i = 1; i < MAX_BOXES_PER_ROW; i++) {
                var tmp = count / i;
                if (tmp % 1 === 0) {
                    boxesPerRow = i;
                }
            }

            if (boxesPerRow == 1) {
                boxesPerRow = count;
            }

            return boxesPerRow;

        };


    that.init = init;
    that.setScore = setScore;
    that.clearBoxes = clearBoxes;
    that.addBoxes = addBoxes;
    that.revealTarget = revealTarget;


    return that;
})();