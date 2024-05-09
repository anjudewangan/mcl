(function ($) {
    "use strict";
    var fomr_wizard_two = {
        init: function () {
            var navListItems = $('div.setup-panel-other div a'),
                allWells = $('.setup-content-other'),
                allNextBtn = $('.nextBtn');
            allWells.hide();
            navListItems.click(function (e) {
                e.preventDefault();
                var $target = $($(this).attr('href')),
                    $item = $(this);
                if (!$item.hasClass('disabled')) {
                    navListItems.removeClass('btn btn-primary').addClass('btn btn-light');
                    $item.addClass('btn btn-primary');
                    allWells.hide();
                    $target.show();
                    $target.find('input:eq(0)').focus();
                }
            }), allNextBtn.click(function () {
                var curStep = $(this).closest(".setup-content-other"),
                    curStepBtn = curStep.attr("id"),
                    nextStepWizard = $('div.setup-panel-other div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                    curInputs = curStep.find("input[type='text'],input[type='number'],input[type='date'],input[type='email'],input[type='password'],input[type='url']"),
                    isValid = true;
                $(".form-group").removeClass("has-error");
                for (var i = 0; i < curInputs.length; i++) {
                    if (!curInputs[i].validity.valid) {
                        isValid = false;
                        $(curInputs[i]).closest(".form-group").addClass("has-error");
                    }
                }
                if (isValid)
                    nextStepWizard.removeAttr('disabled').trigger('click');
            }), $('div.setup-panel-other div a.btn-primary').trigger('click');
        }
    };
    (function ($) {
        "use strict";
        fomr_wizard_two.init();
    })(jQuery);
})(jQuery);


