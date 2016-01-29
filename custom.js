
$(document).ready(function() {
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

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
    var ran_tex = randomString(12);
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
            // var href = "http://tbc-python.fossee.in/comments/get/?book={0}&chapter={1}&example={2}&page={3}";
            var href = "#disqus_thread";
            href = href.format(book, chapter_number);
            $link.attr({
                href: href,
                class: "question",
                // target: "_blank",
                title: "create/view comments for this example"
	
            });
            $(this).prepend($link);
            count++;
        } catch(e) {
            return;
        }
    });    


//*** disqus functions. Do not play with it until you have to. Added by Mahesh on 28th Jan, 2016.***//
//**************************************************************************************************//
   $(document.body).append('<div id="disqus_thread"></div>');
    //<script type="text/javascript">
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */

    
    var disqus_shortname = 'pythontbc'; // required: replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

console.log(book+chapter_number)

var disqus_config = function () {

this.page.identifier = (book+chapter_number)
} 

    //</script>




//****************************************************************************************************//

 
    var $branding = $("<a href='http://fossee.in' class='branding' target='_blank'></a>");
    $("body").prepend($branding);
    var $edit_btn = $("<a id='edit-btn' target='_blank'>Edit examples of this chapter</a>");
    $edit_btn.attr({
        href: 'https://try.fossee.in/user/' + ran_tex + '/notebooks/Python-Textbook-Companions' + strings[0],
        class: 'btn btn-primary'
    });
    $first_text_cell.append($edit_btn);
});

/* Added analytics code by srikant on 22-9-2014 
<script> */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-55019298-1', 'auto');
  ga('send', 'pageview');

// </script>
