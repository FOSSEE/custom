$(document).ready(function() {
    /* first, checks if it isn't implemented yet */
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined' ? args[number] : match ;
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
    var $first_text_cell = $(".text_cell_render:first");
    /* chapter name string either in id or innerHTML */
    var chapter_name = "";
    chapter_name = $first_text_cell.find("h1").attr("id");
    if(!chapter_name) {
        chapter_name = $first_text_cell.find("h1").html();
    }
    var numbers = chapter_name.match(regex).map(function(v) { return parseFloat(v); });
    var chapter_number = Math.abs(numbers[0]);
    console.log("Chapter:" + chapter_number);

    document.title = chapter_name + " - " + book;
    $code_cell.each(function(index, element) {
        try {
            /* fetching example and page number */
            var $current_text_cell = $(this).prev();
            /* code headings can be h2 or h3 */
            var $heading;
            $heading = $current_text_cell.find("h2");
            if(!$heading.html())  {
                $heading = $current_text_cell.find("h3").first();
                console.log("########## Head" + $heading.html());
            }
            var heading_text = $heading.html();
            var numbers = heading_text.match(regex).map(function(v) { return parseFloat(v); });
            var example_no = Math.abs(numbers[0]);
            var page_no = Math.abs(numbers[1]);
            console.log("########## Exp:" + example_no + ", Pg:" + page_no);
            
            /* creating the link */
            var $link = $("<a></a>");
            var href = "localhost:8000/comments/get/?book={0}&chapter={1}&example={2}&page={3}";
            //var href = "#disqus_thread";
            href = href.format(book, chapter_number, example_no, page_no);
            $link.attr({
                href: href,
                class: "question",
            });
            $(this).prepend($link);
            count++;
        } catch(e) {
            return;
        }
    });
    
    var $branding = $("<a href='http://fossee.in' class='branding' target='_blank'></a>");
    $("body").prepend($branding);
    var $edit_btn = $("<a id='edit-btn' target='_blank'>Edit examples of this chapter</a>");
    $edit_btn.attr({
        href: 'https://ipynb.fossee.in/notebooks' + strings[0],
        class: 'btn btn-primary'
    });
    $first_text_cell.append($edit_btn);
});
