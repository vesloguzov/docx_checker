/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element) {
   var downloadUrl = runtime.handlerUrl(element, 'download_assignment');
   $('#download-file', element).attr('href', downloadUrl);

   var upload_student_file = runtime.handlerUrl(element, 'upload_student_file');

   var download_student_file = runtime.handlerUrl(element, 'download_student_file');
   $('.download_student_file', element).attr('href', download_student_file);
   
   var student_filename = runtime.handlerUrl(element, 'student_filename');

   var student_submit = runtime.handlerUrl(element,'student_submit');

    function successLoadStudentFile(result) {
        $.ajax({
            url: student_filename,
            type: 'GET',
            success: function(result){
                $('.download_student_file', element).html(result["student_filename"]);
            }

        });
    }

    $(':button.upload-student-file').on('click', function() {
        $.ajax({
            url: upload_student_file,
            type: 'POST',
            data: new FormData($('form.student')[0]),
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            //Сделать лоадер
                        }
                    } , false);
                }
                return myXhr;
            },
            success: successLoadStudentFile

        });
    });


    $(element).find('.Check').bind('click', function() {
        $.ajax({
            type: "POST",
            url: student_submit,
            data: JSON.stringify({"picture": "resultImage" }),
            success: function(result){
                console.log(result)
            }
        });

    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
   
}
