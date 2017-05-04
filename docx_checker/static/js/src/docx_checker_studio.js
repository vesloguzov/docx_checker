/* Javascript for DocxCheckerXBlock. */
function DocxCheckerXBlockEdit(runtime, element) {

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

  $(document).ready(function () {
      $('.group').hide();
      $('#'+$('.select-lab').val()).show();
      $('.select-lab').change(function () {
          $('.group').hide();
          $('#'+$(this).val()).show();
      })
  });

    $(element).find(".save-button").bind("click", function() {

        var handlerUrl = runtime.handlerUrl(element, "studio_submit"),
            data = {
                "display_name": $(element).find("input[name=display_name]").val(),
                "question": $(element).find("textarea[name=question]").val(),
                "weight": $(element).find("input[name=weight]").val(),
                "max_attempts": $(element).find("input[name=max_attempts]").val(),
                "lab_scenario": $(element).find("select[name=lab_scenario]").val(),
            };

        $.post(handlerUrl, JSON.stringify(data)).done(function (response) {

            window.location.reload(true);

        });

    });


    $(element).find(".cancel-button").bind("click", function () {

        runtime.notify("cancel", {});

    });
}
