/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element, data) {

   var docx_lab_scenario = data["lab_scenario"];
   var student_docx_name = data["student_docx_name"];


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
                $('.current-student-file', element).show();
                $('input[name="studentFile"]', element).val("");
            }

        });
    }

    $(':button.upload-student-file', element).on('click', function() {
        var file = $('input[name="studentFile"]', element).val().trim();
        if(file){
            $.ajax({
                url: upload_student_file,
                type: 'POST',
                data: new FormData($('form.student', element)[0]),
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
        }
        else{
            alert("Необходимо  выбрать документ!");
        }
    });

    function successCheck(result) {
        console.log(result);
    }

    $(element).find('.Check').bind('click', function() {
        $.ajax({
            type: "POST",
            url: student_submit,
            data: JSON.stringify({"picture": "resultImage" }),
            success: successCheck
        });

    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
   
}
