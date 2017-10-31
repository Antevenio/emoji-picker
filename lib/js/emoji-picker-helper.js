window.emojiPickerHelper = (function($, window) {
    var WYSIWYGClass = 'emoji-wysiwyg-editor',
        options = {
            generalErrorClass: 'error',
            requiredErrorClass: 'error-required',
            generalSuccessClass: 'validate-success'
        };

    var validateFields = function () {
        var $fields = $(this).find('[data-emojiable]'),
            errors = false;

        $fields.each( function () {
            errors = validateField({ type: 'submit' }, $(this));
        } );

        return !errors;
    };

    var validateField = function (e, $emojiContainer) {
        var $editor = getEditor($emojiContainer),
            $parentForm = getParentForm($emojiContainer),
            $emojiContainerLabel = getEmojiLabel($emojiContainer, $parentForm),
            content = $editor.text(),
            inputContent = $emojiContainer.val(),
            errorClasses = options.generalErrorClass + ' ' + options.requiredErrorClass;

        if (e.type === 'focus') {
            $emojiContainerLabel.removeClass(errorClasses);
        }

        // By the moment, only a 'required' validation is implemented
        if (!content && !inputContent) {
            $editor.add($emojiContainerLabel).addClass(errorClasses)
                .removeClass(options.generalSuccessClass);

            if (e) {
                if (e.type === 'submit') {
                    $parentForm.addClass(options.requiredErrorClass);
                    return true;
                }

                return false;
            }
        }

        clearValidation($emojiContainer);
        $editor.add($emojiContainerLabel).addClass(options.generalSuccessClass);
    };

    var clearValidation = function ($emojiContainer) {
        var $editor = getEditor($emojiContainer),
            $parentForm = getParentForm($emojiContainer),
            $emojiContainerLabel = getEmojiLabel($emojiContainer, $parentForm),
            classes = options.generalErrorClass + ' ' +
                options.requiredErrorClass + ' ' +
                options.generalSuccessClass;

        $editor
            .add($parentForm).add($emojiContainerLabel)
            .removeClass(classes);
    };

    var init = function (options) {
        window.emojiPicker = new EmojiPicker(options);
        var $emojiContainers = window.emojiPicker.discover();

        $emojiContainers
            .parent().addClass(WYSIWYGClass + '-wrapper').end()
            .each(initEvents);
    };

    var getEditor = function ($emojiContainer) {
        return $emojiContainer.next('.' + WYSIWYGClass);
    };

    var getParentForm = function ($emojiContainer) {
        return $emojiContainer.parents('form');
    };

    var getEmojiLabel = function ($emojiContainer, $parentForm) {
        return $parentForm.find('[for=' + $emojiContainer.attr('name') + ']');
    };

    var initEvents = function () {
        var $emojiContainer = $(this),
            $editor = getEditor($emojiContainer),
            $parentForm = getParentForm($emojiContainer);

        if ($emojiContainer.attr('required')) {
            $emojiContainer
                .removeAttr('required')
                .siblings('.emoji-picker').on('click', function (e) {
                    validateField(e, $emojiContainer);
                });

            $parentForm.on('submit formValidation', validateFields);

            $editor
                .on('click focus change keyup validateEmojis', function (e) {
                    validateField(e, $emojiContainer);
                })
                .on('blur clearValidation', function () {
                    clearValidation($emojiContainer);
                });
        }
    };

    return {
        init: init
    }
})(jQuery, window, document);
