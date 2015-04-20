/**
 * Determine if led can be updated.
 *
 * @param {jQuery} $el
 * @returns {boolean}
 */
function canBeUpdate($el) {
    return !(/none/.exec($el.css("border")));
}

/**
 * Transform `rgb(255, 200, 120)` to `ffc878`
 *
 * @param {string} rbgString
 * @returns {string}
 */
function rgb2hex(rbgStrinq) {
    var a = rbgStrinq.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var rgb = a[3] | (a[2] << 8) | (a[1] << 16);
    return (0x1000000 + rgb).toString(16).slice(1);
}

$(document).ready(function () {
    var $workspace = $("#workspace");
    var $color = $(".color");
    var $currentColor = $color.first();

    // Add color wheel
    var colorWheel = Raphael.colorwheel($("#color-wheel")[0], 150);
    colorWheel.onchange(function () {
        $currentColor.css("backgroundColor", colorWheel.color());
    });

    colorWheel.color("white");

    // Generate LEDs
    var ledNum = 0;
    var html = "";
    for (var line = 0; line < 8; line++) {
        for (var column = 0; column < 8; column++) {
            if (ledNum % 8 === 0) html += '<div class="line line' + line + '">';
            html += '<div class="led led' + ledNum + '"></div>';
            if (ledNum % 8 === 7) html += '</div>';
            ledNum++;
        }
    }
    $workspace.append(html);

    // Painter
    $(".led").on("click", function (e) {
        var $target = $(e.target);
        if (!canBeUpdate($target)) return;
        $target.css("backgroundColor", $currentColor.css("backgroundColor"));
        $target.data("color", $currentColor.css("backgroundColor"));
    });

    // Color selector
    $color.on("click", function (e) {
        $currentColor = $(e.target);

        // Set currentColor style
        $color.css("border", "1px dashed gray");
        $currentColor.css("border", "1px solid black");

        // Set color wheel
        var color = $currentColor.css("backgroundColor");
        colorWheel.color(color ? "#" + rgb2hex(color) : "#000000")
    });

    // Export
    $("[data-ui=export]").on("click", function () {
        var output = "";
        var color;
        for (var i = 0; i < 64; i++) {
            color = $(".led" + i).data("color");
            if (i % 8 === 0) output += "{";
            output += color ? "0x" + rgb2hex(color) : "0x000000";
            output += (i % 8 === 7) ? "},\n" : ",";
        }
        // Remove last comma
        output = output.substring(0, output.length - 2);

        // Output this into console
        console.log(output);
    });

    // Reset
    $("[data-ui=reset]").on("click", function () {
        for (var i = 0; i < 64; i++) {
            var $led = $(".led" + i);
            if (!canBeUpdate($led)) continue;
            $led.css("backgroundColor", "black");
            $led.data("color", null);
        }
    });
});