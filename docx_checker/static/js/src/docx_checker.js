/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element) {

   // var downloadUrl = runtime.handlerUrl(element, 'download_assignment');
    //console.log(downloadUrl)
    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    $('p', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"hello": "world"}),
            success: updateCount
        });
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
