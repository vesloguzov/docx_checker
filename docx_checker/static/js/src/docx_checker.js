/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element) {
   var downloadUrl = runtime.handlerUrl(element, 'download_assignment');
   console.log()
   var studentFileUrl = runtime.handlerUrl(element, 'upload_student_file');

   $('#download-file', element).attr('href',downloadUrl);

   
    function successLoadStudentFile(result) {
        alert('Файл успешно загружен');
    }

    $(':button.upload-student-file').on('click', function() {
        $.ajax({
            url: studentFileUrl,
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

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
   
}
