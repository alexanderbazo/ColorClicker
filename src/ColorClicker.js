/**
 * @fileOverview ColorClicker
 * @author Alexander Bazo <alexanderbazo@googlemail.com>
 * @version 1.1
 */
var ColorClicker = ColorClicker || {};
(function () {
    "use strict";
    ColorClicker.start = function () {
        var game = ColorClicker.GameController,
            view = ColorClicker.ViewController,
            config = {
                highscoreStorageKey: "COLOR_CLICKER_HIGHSCORE",
                defaultBoxDeviation: 60,
                defaultBoxCount: 3,
                minimalDeviation: 3,
                deviationFactor: 2,
                boxesPerLevel: [3, 4, 6, 9, 9, 9, 12, 15, 16, 16, 20, 24, 25, 30, 36, 36, 36, 49]
            };
        game.init(config, view);
        game.start();
    };
}());

(function () {
    "use strict";
    ColorClicker.Color = function (red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    };

    ColorClicker.Color.prototype.toCSS = function () {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    };

    ColorClicker.Color.prototype.getDeviationColor = function (deviation) {
        var red = this.red - deviation,
            green = this.green - deviation,
            blue = this.blue - deviation;
        return new ColorClicker.Color(red, green, blue);
    };


    /*
     * Generates and return a random pastel color, represented in RGB
     */
    ColorClicker.Color.getRandomColor = function () {
        var red = Math.floor((Math.random() * 255) + 1),
            green = Math.floor((Math.random() * 255) + 1),
            blue = Math.floor((Math.random() * 255) + 1);

        red = Math.floor((red + 255) / 2);
        green = Math.floor((green + 255) / 2);
        blue = Math.floor((blue + 255) / 2);

        return new ColorClicker.Color(red, green, blue);
    };

}());
