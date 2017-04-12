/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlockEdit(runtime, element) {
 $("#file-analyse-result", element).hide()
    function successLoadCorrectFile(result) {
        alert('Файл успешно загружен');
        console.log(result)
 $("#file-analyse-result", element).show()
        $("#file-analyse-result", element).empty()
        $("#file-analyse-result", element).append( "<h3>Анализ файла</h3>")
        $("#file-analyse-result", element).append( "<p>"+"Автор документа: " + result["general_properties"]["author"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Последнее изменение пользователем: " + result["general_properties"]["last_modified_by"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Дата последнего изменения: " + result["general_properties"]["modified"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Меню создано: " + (result["menu_item_count"]>0)+ "</p>")
        if(result["custom_styles"]["header_style"]){
        $("#file-analyse-result", element).append( "<p>"+"Стиль заголовка: " + result["custom_styles"]["header_style"]["name"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Стиль заголовка. Шрифт полужирный: " + result["custom_styles"]["header_style"]["font_bold"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Стиль заголовка. Шрифт наклонный: " + result["custom_styles"]["header_style"]["font_italic"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Стиль заголовка. Имя шрифта: " + result["custom_styles"]["header_style"]["font_name"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Стиль заголовка. Выравнивание: " + result["custom_styles"]["header_style"]["alignment"]+ "</p>")
        }
        else{
            $("#file-analyse-result", element).append( "<p>"+"Пользовательского стиля заголовка нет!"+ "</p>")
        }
        $("#file-analyse-result", element).append( "<p>"+"Верхний колонтитул: " + result["document_header"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Заголовки: " + result["document_headers_texts"].join(", ")+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Нумерация страниц: " + result["document_page_numbering"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Отступ слева: " + result["margins"]["left"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Отступ справа: " + result["margins"]["right"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Отступ верх: " + result["margins"]["top"]+ "</p>")
        $("#file-analyse-result", element).append( "<p>"+"Отступ низ: " + result["margins"]["bottom"]+ "</p>")

        
    }
    
    function successLoadSourceFile(result) {
        alert('Файл успешно загружен');
        console.log(result)
    }

    var correctFileUrl = runtime.handlerUrl(element, 'upload_correct_file');
    var sourceFileUrl = runtime.handlerUrl(element, 'upload_source_file');

    //console.log(downloadUrl);
    $(':button.upload-correct-file').on('click', function() {
        $.ajax({
            url: correctFileUrl,
            type: 'POST',
            data: new FormData($('form.correct')[0]),
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
            success: successLoadCorrectFile

        });
    });

    $(':button.upload-source-file').on('click', function() {
        $.ajax({
            url: sourceFileUrl,
            type: 'POST',
            data: new FormData($('form.source')[0]),
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
            success: successLoadSourceFile

        });
    });



 

    var tabList = "<li class=\"action-tabs is-active-tabs\" id=\"main-settings-tab\">Файлы</li><li class=\"action-tabs\" id=\"scenario-settings-tab\">Основные</li><li class=\"action-tabs\" id=\"advanced-settings-tab\">Расширенные</li>";
  document.getElementsByClassName("editor-modes action-list action-modes")[0].innerHTML = tabList;

  document.querySelector("#main-settings-tab").onclick = function () {

    document.querySelector("#main-settings-tab").classList.add("is-active-tabs");
    document.querySelector("#scenario-settings-tab").classList.remove("is-active-tabs");
    document.querySelector("#advanced-settings-tab").classList.remove("is-active-tabs");

    document.querySelector("#main-settings").removeAttribute("hidden");
      document.querySelector("#scenario-settings").setAttribute("hidden", "true");
      document.querySelector("#advanced-settings").setAttribute("hidden", "true");

  };

  document.querySelector("#scenario-settings-tab").onclick = function () {

    document.querySelector("#main-settings-tab").classList.remove("is-active-tabs");
    document.querySelector("#scenario-settings-tab").classList.add("is-active-tabs");
    document.querySelector("#advanced-settings-tab").classList.remove("is-active-tabs");

    document.querySelector("#main-settings").setAttribute("hidden", "true");
      document.querySelector("#scenario-settings").removeAttribute("hidden");
      document.querySelector("#advanced-settings").setAttribute("hidden", "true");

  };

  document.querySelector("#advanced-settings-tab").onclick = function () {

    document.querySelector("#main-settings-tab").classList.remove("is-active-tabs");
    document.querySelector("#scenario-settings-tab").classList.remove("is-active-tabs");
    document.querySelector("#advanced-settings-tab").classList.add("is-active-tabs");

    document.querySelector("#main-settings").setAttribute("hidden", "true");
      document.querySelector("#scenario-settings").setAttribute("hidden", "true");
      document.querySelector("#advanced-settings").removeAttribute("hidden");

  };


    $(element).find(".save-button").bind("click", function() {

        var handlerUrl = runtime.handlerUrl(element, "studio_submit"),
            data = {
                "display_name": $(element).find("input[name=display_name]").val(),
                "question": $(element).find("textarea[name=question]").val(),
                "weight": $(element).find("input[name=weight]").val(),
                "max_attempts": $(element).find("input[name=max_attempts]").val(),
            };

        $.post(handlerUrl, JSON.stringify(data)).done(function (response) {

            window.location.reload(true);

        });

    });


    $(element).find(".cancel-button").bind("click", function () {

        runtime.notify("cancel", {});

    });
}
