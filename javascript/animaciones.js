// jQuery animaciones

// nav
$(() => {
    $(`#divBotones`).hide()
    $(`#pokeBalls`).hide()
    $(`#berries`).hide()
    $(`#medicina`).hide()
    $(`#batalla`).hide()
    $(`#nav`).mouseover(() => {
        $(`#img1`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#img2`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#img3`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#img4`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#divBotones`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#pokeBalls`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#berries`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#medicina`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#batalla`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
    })
    $(`#nav`).mouseleave(() => {
        $(`#img1`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#img2`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#img3`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#img4`).css({
            "display": "block",
        }).animate({
            opacity: "1"
        })
        $(`#divBotones`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#pokeBalls`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#berries`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#medicina`).css({
            "display": "none",
            "opacity": "0",
        })
        $(`#batalla`).css({
            "display": "none",
            "opacity": "0",
        })
    })
    // tema
    if (localStorage.getItem(`theme`)) {
        theme = localStorage.getItem(`theme`)
    } else {
        theme = "light"
    }
    localStorage.setItem(`theme`, theme)
    if (localStorage.getItem(`theme`) == "dark") {
        $(`body`).addClass(`body__dark`)
        $(`*`).css({
            "color": "white",
        })
        $(`nav`).css({
            "background-color": "#242424",
        })
        $(`footer`).css({
            "background-color": "#242424",
        })
        $(`#botonThemeD`).hide()
    } else {
        $(`#botonThemeL`).hide()
    }
    $(`#botonThemeD`).click(() => {
        $(`#botonThemeD`).hide()
        $(`#botonThemeL`).show()
        $(`body`).removeClass(`body__light`)
        $(`body`).addClass(`body__dark`)
        $(`*`).css({
            "color": "white",
        })
        $(`nav`).css({
            "background-color": "#242424",
        })
        $(`footer`).css({
            "background-color": "#242424",
        })
        theme = "dark"
        localStorage.setItem(`theme`, theme)
    })
    $(`#botonThemeL`).click(() => {
        $(`#botonThemeD`).show()
        $(`#botonThemeL`).hide()
        $(`body`).removeClass(`body__dark`)
        $(`body`).addClass(`body__light`)
        $(`*`).css({
            "color": "black",
        })
        $(`nav`).css({
            "background-color": "#c5c5c5",
        })
        $(`footer`).css({
            "background-color": "#c5c5c5",
        })
        theme = "light"
        localStorage.setItem(`theme`, theme)
    })
})