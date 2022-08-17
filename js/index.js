$(document).ready(function () {
    $(document).on("keyup", "#text", function () {
        $("#card-result").html($(this).val());
    });


    $(document).on("change", "#background-color, #text-color, #weight, #font-family", function () {
        var style = $(this).attr("data-style");
        $("#card-result").css(style, $(this).val());
    });

    $(document).on("change", "#padding, #font-size, #height", function () {
        var style = $(this).attr("data-style");
        $("#card-result").css(style, $(this).val() + "rem");
    });

    $(document).on("click", "#btn-copy", function () {
        domtoimage.toPng(document.getElementById('card-result'))
            .then(function (dataUrl) {
                copyImage(dataUrl);
                toastr.success("Image copied to clipboard.", "")
            });
    });

    initializeToastr();
});

function initializeToastr() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": true,
        "onclick": null,
        "timeOut": 3000,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

async function copyImage(dataUrl) {
    if (canWriteToClipboard) {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        await setToClipboard(blob)
    }
}

async function askWritePermission() {
    try {
        const {
            state
        } = await navigator.permissions.query({
            name: 'clipboard-write'
        })
        return state === 'granted'
    } catch (error) {
        return false
    }
}

const setToClipboard = async blob => {
    const data = [new ClipboardItem({
        [blob.type]: blob
    })]
    await navigator.clipboard.write(data)
}

const canWriteToClipboard = askWritePermission()