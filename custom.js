// leave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file
 * (and should create it if it does not exist).
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 * Example :
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    $([IPython.events]).on('app_initialized.NotebookApp', function(){
 *        IPython.toolbar.add_buttons_group([
 *            {
 *                 'label'   : 'run qtconsole',
 *                 'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                 'callback': function () {
 *                     IPython.notebook.kernel.execute('%qtconsole')
 *                 }
 *            }
 *            // add more button here if needed.
 *            ]);
 *    });
 *
 * Example :
 *
 *  Use `jQuery.getScript(url [, success(script, textStatus, jqXHR)] );`
 *  to load custom script into the notebook.
 *
 *    // to load the metadata ui extension example.
 *    $.getScript('/static/notebook/js/celltoolbarpresets/example.js');
 *    // or
 *    // to load the metadata ui extension to control slideshow mode / reveal js for nbconvert
 *    $.getScript('/static/notebook/js/celltoolbarpresets/slideshow.js');
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */

$([IPython.events]).on('notebook_loaded.Notebook', function(){
    /* first, checks if it isn't implemented yet */
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }

    $code_cell = $(".code_cell");

    var regex = /[+-]?\d*\.*\d+/g;
    var path_regex = /\/([^\/]*)\/[^/]*\.ipynb$/;
    var count = 1;

    /* fetching book name from path */
    var pathname = window.location.pathname;
    var strings = pathname.match(path_regex);
    var book = strings[1];
    console.log("Book:" + book);

    /* fetching chapter number */
    var $first_text_cell = $(".text_cell:first");
    var chapter_name = $first_text_cell.find("h1").attr("id");
    var numbers = chapter_name.match(regex).map(function(v) { return parseFloat(v); });
    var chapter_number = Math.abs(numbers[0]);
    console.log("Chapter:" + chapter_number);

    $code_cell.each(function(index, element) {
        /* fetching example and page number */
        var $current_text_cell = $(this).prev();
        var $heading = $current_text_cell.find("h2");
        var heading_text = $heading.html();
        var numbers = heading_text.match(regex).map(function(v) { return parseFloat(v); });
        var example_no = Math.abs(numbers[0]);
        var page_no = Math.abs(numbers[1]);
        console.log("Exp:" + example_no + ", Pg:" + page_no);
        
        /* creating the link */
        var $link = $("<a>?</a>");
        href = "http://example.com/?book={0}&chapter={1}&example={2}&page={3}";
        href = href.format(book, chapter_number, example_no, page_no);
        $link.attr({
            href: href,
            target: "_blank",
            class: "question"
        });
        $(this).prepend($link);
        count++;
    });
});
