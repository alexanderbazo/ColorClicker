/**
 * @fileOverview ColorClicker ViewController
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.1
 */

/**
 * @namespace ColorClicker
 */
var ColorClicker = ColorClicker || {};

/**
 * @namespace ViewController
 * @memberof ColorClicker
 */
ColorClicker.ViewController = (function () {
    "use strict";
    /* eslint-env browser */
    var config;

    /*
     * Calculates the number of boxes per row depending on the total number of boxes
     * and the maximum number visible in one row
     * @private
     * @returns {Number} Number of boxes to render in one row.
     */
    function calculateBoxesPerRow(count) {
        var boxesPerRow = config.boxesPerRow,
            tmp;

        for (var i = 1; i < config.boxesPerRow; i++) {
            tmp = count / i;
            if (tmp % 1 === 0) {
                boxesPerRow = i;
            }
        }

        if (boxesPerRow === 1) {
            boxesPerRow = count;
        }
        return boxesPerRow;
    }

    /*
     * Centers the visible boxes depending on the number of boxes per row.
     * @private
     */
    function pack() {
        var boxes = config.boardView.querySelectorAll(".box"),
            boxesPerRow = calculateBoxesPerRow(boxes.length),
            margin = parseInt(window.getComputedStyle(boxes[0]).marginTop.replace("px", "")),
            boardWidth = boxesPerRow * (boxes[0].offsetWidth + 2 * margin);

        if (boxesPerRow === 1) {
            boxesPerRow = boxes.length;
        }

        config.boardView.style.width = boardWidth + "px";
    }

    function onBoxClicked() {
        var isTarget = event.target.getAttribute("isTarget");
        if (isTarget === "true") {
            config.onTargetClicked();
        } else {
            config.onTargetMissed();
        }
    }

    /*
     * Adds a number of boxes to the user interface.
     * @public
     * @param {Number} count The number of boxes to be added (including the deviating target).
     * @param {Object} color The color used to draw the added boxes.
     * @param {Number} deviation Color deviation of the target box towards the other boxes.
     * This number is subtracted from all three color channels.
     */
    function addBoxes(count, color, deviation) {
        var boxes = [],
            box,
            targetIndex;

        for (var i = 0; i < count; i++) {
            box = document.createElement("span");
            box.classList.add("box");
            box.style.setProperty("background-color", color.toCSS());
            box.setAttribute("isTarget", false);
            box.addEventListener("click", onBoxClicked);
            boxes.push(box);
        }

        targetIndex = Math.floor((Math.random() * count));
        boxes[targetIndex].style.setProperty("background-color", color.getDeviationColor(deviation).toCSS());
        boxes[targetIndex].setAttribute("isTarget", true);

        boxes.forEach(function (newBox) {
            config.boardView.appendChild(newBox);
        });

        pack();

    }

    /*
     * Removes all boxes.
     * @public
     */
    function clearBoxes() {
        var boxes = config.boardView.querySelectorAll(".box");
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].remove();
        }
    }

    /*
     * Reveals the current target by fading out all other boxes.
     * @public
     * @param {startNewGameCallback} The callback to be executed after revealing the targets
     */
    function revealTarget(callback) {
        var box;
        for (var i = config.boardView.childNodes.length - 1; i >= 0; i--) {
            box = config.boardView.childNodes[i];
            box.removeEventListener("click", onBoxClicked);
            if (box.getAttribute("isTarget") === "false") {
                box.classList.add("reveal");
            }
        }
        setTimeout(callback, config.restartDelay);

    }

    /*
     * Updates the user interface wiht the current score and the highscore.
     * @public
     * @param {Number} newScore The current score.
     * @param {Number} newHighscore The current highscore.
     */
    function setScore(newScore, newHighscore) {
        config.scoreView.innerHTML = newScore;
        if (newHighscore > 0) {
            config.highscoreView.innerHTML = "Best: " + newHighscore;
        }
    }

    function init(viewConfig) {
        config = viewConfig;
    }

    return {
        init: init,
        setScore: setScore,
        revealTarget: revealTarget,
        clearBoxes: clearBoxes,
        addBoxes: addBoxes
    };
}());
