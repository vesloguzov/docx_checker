/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlockEdit(runtime, element) {

    function updateCount(result) {
        console.log(result)
    }

    var correctFileUrl = runtime.handlerUrl(element, 'upload_correct_file');

    $(':button').on('click', function() {
    $.ajax({
        // Your server script to process the upload
        url: correctFileUrl,
        type: 'POST',

        // Form data
        data: new FormData($('form.correct')[0]),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
    });
});



    // $('button.correct', element).click(function(eventObject) {
    //     //Correct file form
    //     var correctFD = new FormData();
    //     correctFD.set('correctFile', $('input.correct-file')[0].files[0], $('input.correct-file')[0].files[0].name);

    //    // var formData = correctFD.serialize();

    //     console.log(correctFD.getAll('correctFile'));
    //     $.ajax({
    //         type: "POST",
    //         url: correctFileUrl,
    //         data: correctFD,
    //         success: updateCount,
    //         processData: false

    //     });
    // });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
