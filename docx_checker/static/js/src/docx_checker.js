/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlock(runtime, element, data) {

   var lab_scenario = data["lab_scenario"];
   var student_docx_name = data["student_docx_name"];
   var docx_analyze = data["docx_analyze"];

   if(!jQuery.isEmptyObject(docx_analyze)){
        showBlockAnalyze(docx_analyze);
   }
   else{
       $('.block-analyze', element).hide();
   }
   
   if(student_docx_name){
        $('.current-student-file', element).show();
   }
   else{
        $('.current-student-file', element).hide();
   }

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


    function showLab1FullAnalyze(analyze_object){
        analyze = analyze_object;
        $('.analyze-all', element).empty();
                Object.keys(analyze).map(function(item, i, arr) {

                if (item!="errors"){
                var one_obj = analyze[item]
                var criterion_all = document.createElement("div");
                criterion_all.className = item + " criterion-block";    
                var criterion_header = document.createElement("div");

                if (item == "custom_header_style"){
                        criterion_header.innerHTML = "Пользовательский стиль заголовка";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "custom_main_style"){
                        criterion_header.innerHTML = "Пользовательский стиль основной";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "document_header"){
                        criterion_header.innerHTML = "Верхний колонтитул";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }


                if (item == "document_margins"){
                        criterion_header.innerHTML = "Поля документа";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "document_numbering"){
                        criterion_header.innerHTML = "Нумерация страниц";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "footnote"){
                        criterion_header.innerHTML = "Сноска";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "table_of_contents"){
                        criterion_header.innerHTML = "Оглавление";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "headers_style"){
                        criterion_header.innerHTML = "Применение стиля к заголовкам";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }
                
                $('.analyze-all', element).append(criterion_all);
            }
            });
        
    }

    function showLab2FullAnalyze(analyze_object){
        analyze = analyze_object;
        $('.analyze-all', element).empty();
        console.log(analyze);
                        Object.keys(analyze).map(function(item, i, arr) {

                if (item!="errors"){
                var one_obj = analyze[item]
                var criterion_all = document.createElement("div");
                criterion_all.className = item + " criterion-block";    
                var criterion_header = document.createElement("div");

                if (item == "cells_alignment"){
                        criterion_header.innerHTML = "Выравнивание в ячейках";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                if (item == "table_format"){
                        criterion_header.innerHTML = "Форматирование таблицы";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                 if (item == "table_title"){
                        criterion_header.innerHTML = "Заголовок таблицы";
                        criterion_all.appendChild(criterion_header);

                        var criterion_element_all = document.createElement("p");
                        criterion_element_all.innerHTML = one_obj["message"];
                        criterion_element_all.className = 'one-criterion criterion-complete-'+one_obj["status"];
                        criterion_all.appendChild(criterion_element_all);
                }

                
                $('.analyze-all', element).append(criterion_all);
            }
            });
    }

    function showLabErrors(errors){
        $('.analyze-errors', element).empty();
        errors.forEach(function(item, i, arr) {
            var error = document.createElement("p");
            error.innerHTML = item;
            error.className = 'one-criterion criterion-complete-false';
            $('.analyze-errors', element).append(error);
        });
    }

    function showBlockAnalyze(analyze_object){
        $('.full-analyze', element).hide();
        $('.errors-analyze', element).hide();
        console.log(analyze_object);

        if(lab_scenario == 1){
            if(analyze_object["errors"].length == 0){
                showLab1FullAnalyze(analyze_object);
                $('.full-analyze', element).show();
            }
            else{
                showLabErrors(analyze_object["errors"]);
                $('.errors-analyze', element).show();
            }
        }
        
        if(lab_scenario == 2){
            if(analyze_object["errors"].length == 0){
                showLab2FullAnalyze(analyze_object);
                $('.full-analyze', element).show();
            }
            else{
                showLabErrors(analyze_object["errors"]);
                $('.errors-analyze', element).show();
            }
        }

        $('.block-analyze', element).show(300);
    }

    function successCheck(result) {
        updatePointsAttempts(result);
        analyze_object = result["docx_analyze"];
        showBlockAnalyze(analyze_object);
    }

    $(element).find('.Check').bind('click', function() {
        $.ajax({
            type: "POST",
            url: student_submit,
            data: JSON.stringify({"picture": "resultImage" }),
            success: successCheck
        });

    });

    function updatePointsAttempts(result) {
        $('.attempts', element).text(result.attempts);
        $(element).find('.weight').html('Набрано баллов: <me-span class="points"></span>');
        $('.points', element).text(result.points + ' из ' + result.weight);

        if (result.max_attempts && result.max_attempts <= result.attempts) {
            $('.Check', element).remove();
            $('.Save', element).remove();
        };
    };
    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
   
}
