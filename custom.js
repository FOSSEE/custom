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
    /* chapter name string either in id or innerHTML */
    var chapter_name = "";
    chapter_name = $first_text_cell.find("h1").attr("id");
    if(!chapter_name) {
        chapter_name = $first_text_cell.find("h1").html();
    }
    var numbers = chapter_name.match(regex).map(function(v) { return parseFloat(v); });
    var chapter_number = Math.abs(numbers[0]);
    console.log("Chapter:" + chapter_number);

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
            $link.attr({
                href: "#",
                class: "question",
                "data-book": book,
                "data-chapter": chapter_number,
                "data-example": example_no,
                "data-page": page_no,
            });
            $(this).prepend($link);
            count++;
        } catch(e) {
            return;
        }
    });

    /* appending modal skeleton */
    var $comment_modal = $("<div id='commentModal' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button> <h3 id='myModalLabel'>Python TBC Comments</h3> </div> <div class='modal-body'> <p>One fine body…</p> </div></div>");
    $("#site").append($comment_modal);

    $(".question").on("click", function() {
        $comment_frame = $("<iframe></iframe>");
        var book = $(this).data("book");
        var chapter = $(this).data("chapter");
        var example = $(this).data("example");
        var page = $(this).data("page");
        var src = "http://tbc-python.fossee.in/comments/get/?book={0}&chapter={1}&example={2}&page={3}";
        src = src.format(book, chapter, example, page);
        $comment_frame.attr({
            class: "comment-frame",
            src: src,
        });
        $comment_modal.find(".modal-body").html($comment_frame);
        $comment_modal.modal("show");
    });

});

/* hiding running/clusters links */
$("#tabs a").each(function(index, element) {
    var href = $(this).attr("href");
    console.log($(this).attr("href"));
    if(href == "#running" || href == "#clusters") {
        $(this).hide();
    }
});

var $branding = $("<a href='http://fossee.in' class='branding pull-right' target='_blank'></a>");
$("#ipython_notebook").after($branding);
