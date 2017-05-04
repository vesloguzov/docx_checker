/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element) {
   var docx_downloadUrl = runtime.handlerUrl(element, 'download_assignment');
   $('#download-file', element).attr('href', docx_downloadUrl);

   var docx_upload_student_file = runtime.handlerUrl(element, 'upload_student_file');

   var docx_download_student_file = runtime.handlerUrl(element, 'download_student_file');
   $('.docx_download_student_file', element).attr('href', docx_download_student_file);
   
   var docx_student_filename = runtime.handlerUrl(element, 'student_filename');

   var docx_student_submit = runtime.handlerUrl(element,'student_submit');

    function successLoadStudentFile(result) {
        $.ajax({
            url: docx_student_filename,
            type: 'GET',
            success: function(result){
                $('.docx_download_student_file', element).html(result["student_filename"]);
            }

        });
    }

    $(':button.upload-student-file').on('click', function() {
        $.ajax({
            url: docx_upload_student_file,
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
            url: docx_student_submit,
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
