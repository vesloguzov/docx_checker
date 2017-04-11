/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlockEdit(runtime, element) {

    function successLoadCorrectFile(result) {
        console.log(result)
    }
    
    function successLoadSourceFile(result) {
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
