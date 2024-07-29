$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
        function getCookie(name) {
            let cookieValue = null;


            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i += 1) {
                    const cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    },
});

$(document).on("click", ".js-toggle-modal", function(e) {
    e.preventDefault()
    $(".js-modal").toggleClass("hidden")
})
.on("click", ".js-submit", function(e) {
    e.preventDefault()
    const text = $(".js-post-text").val().trim()
    const $btn = $(this)

    /*tomar el texto y chequear si no es vacio
     */
    if(!text.length) {
        return false
    }
    /*seleccionar el boton, desactivarlo y cambiar su texto */
    $btn.prop("disabled", true).text("Posting!")
    /*seleccionar un ajax que coincide con post en views */
    $.ajax({
        type: 'POST',
        /*textarea es del base.html y este text area tiene un link de django */
        url: $(".js-post-text").data("post-url"),
        data: {
            text: text
        },
        /*enviqr el texto, si es exito, retornar datos html, que hara un render del includes post.html utilizando el link django del textarea */
        success: (dataHtml) => {
            $(".js-modal").addClass("hidden");
            /*esconder el modal */
            /*poner al tope de la lista el post actual creado */
            $("#posts-container").prepend(dataHtml);
            $btn.prop("disabled", false).text("New Post");
            $(".js-post-text").val('')
        },
        error: (error) => {
            console.warn(error)
            $btn.prop("disabled", false).text("Error");
        }
    });
})
.on("click",".js-follow",function(e){
    e.preventDefault()
    const action= $(this).attr("data-action")
    $.ajax({
        type: 'POST',
        /*textarea es del base.html y este text area tiene un link de django */
        url: $(this).data("url"),
        data: {
            action:action, /* follow o unfollow */
            username: $(this).data("username")
        },
        /*enviqr el texto, si es exito, retornar datos html, que hara un render del includes post.html utilizando el link django del textarea */
        success: (data) => {
            $(".js-follow-text").text(data.wording)
            if(action=="follow"){
                $(this).attr("data-action","unfollow")
            }

            else {
                $(this).attr("data-action","follow")
            }
        },
        error: (error) => {
            console.warn(error)
        }
    });
})