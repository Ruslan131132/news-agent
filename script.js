function imgOnHover(block) {
    $(block).parent().css({
        display: 'inline-block', /* Строчно-блочный элемент */
        overflow: 'hidden' /* Скрываем всё за контуром */
    });

    $(block).css({
        transition: '1s', /* Время эффекта */
        display: 'block' /* Убираем небольшой отступ снизу */
    });

    $(document).on({
        mouseenter: function () {
            $(this).css('transform', 'scale(1.2)')
        },
        mouseleave: function () {
            $(this).css('transform', 'scale(1)')
        }
    }, block);
}

function jumpBlock(block) {

    // $(block).children().each(function () {
    //     block = $(document).find(block).children()
        $(document).on({
            mouseenter: function () {
                console.log(this)

                $(this).animate({
                    top: "-=10px",
                    iterations: 1
                    // height: "toggle"
                }, 200);
            },
            mouseleave: function () {
                console.log(this)
                $(this).animate({
                    top: "+=10px",
                    iterations: 1
                    // height: "toggle"
                }, 200);
            }
        }, block);

    // })

    // $(block).children().animate([
    //     // keyframes
    //     { transform: 'translate3D(0, 0, 0)' },
    //     { transform: 'translate3D(0, +30px, 0)' }
    // ], {
    //     // timing options
    //     duration: 1000,
    //     iterations: Infinity
    // })
}

//Quick two hour pen 😅
//Text from http://www.fillerama.io/
//Only IE & Edge don't support clip-path - but the switching still works, they just don't see an animation.



function getTemperature(){
    $.get( "https://api.openweathermap.org/data/2.5/weather?q=Kazan&appid=67c3779054b853851ebeb7be3e2c8980", function( data ) {
        console.log(Math.trunc(data.main.temp - 273.15));

        $('.current-weather-text').text( (data.main.temp > 273.15 ? " +" : " ") +  Math.trunc(data.main.temp - 273.15).toString() + "℃");
    });
}

function setTemperature(){
    getTemperature();
    setInterval(function (){
        getTemperature();
    },  600000);
}
function pad2(n) {
    return (n < 10 ? '0' : '') + n;
}

function setDate(){
    setInterval( function (){
        let d = new Date();
        $('.date-time').html(pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + " " + pad2(d.getDate()) + "." + pad2(d.getMonth()+1) + "." + d.getFullYear());
        $('.date-now-day').html(pad2(d.getDate()) + "." + pad2(d.getMonth()+1) + "." + d.getFullYear());
        $('.date-now-time').html(pad2(d.getHours()) + ":" + pad2(d.getMinutes()));
    },  1000);
}

function setCourse(){

        $.get( "http://data.fixer.io/api/latest?access_key=d48e4375caa5c47449487074509c14c0", function( data ) {
            // console.log(Math.trunc(data.main.temp - 273.15));

            $('div.course').html(`
                <p>RUB/EUR - ${data.rates.RUB.toFixed(2)}</p>
                <p>RUB/USD - ${(data.rates.RUB / data.rates.USD).toFixed(2)}</p>`
            );
        });
}



$(function (){

    setDate();
    setTemperature();

    // setInterval(setCourse(),  1000);



    imgOnHover('#column-right img');
    imgOnHover('#top-block');
    imgOnHover('#left-block-main');


    jumpBlock('.news-bar-block-1');
    jumpBlock('.news-bar-block-2');


    let isDark = false
    let buttonenabled = true, scroll = 0;
    $(document).on("click", ".darkmode", function(){
        if(!buttonenabled) return;
        buttonenabled = false;
        $(".clip").html($("body >.container")[0].outerHTML); //Copy container to inside clip
        scrollbind($(".clip .container"));
        $(".clip .container").toggleClass("dark").scrollTop(scroll); //Toggle dark mode and set scroll
        $(".clip .darkmode").toggleClass("fa-moon").toggleClass("fa-sun"); //Make changes: change button icon
        $(".clip").addClass("anim"); //Animate the clip
        setTimeout(function(){
            $("body >.container").replaceWith($(".clip").html()) //Replace container with clip html
            scrollbind($("body >.container")); //bind scroll with new container
            $("body >.container").scrollTop(scroll); //Set scroll position
            $(".clip").html("").removeClass("anim"); //Hide clip
            buttonenabled = true;
        }, 1000); //Slightly before animation finishes but when the circle will have covered the screen, gives us 500ms to make the changes we need which is plenty. Slower computers will not see a flash, but elements may not have loaded - if it really is an issue delay line 19 a little
        isDark = !isDark;
        $(document).find('#popup-choose-city').css({
            'background': isDark ? '#1c1b20' : '#fcfbfe',
            'color': isDark ? '#fcfbfe' : '#1c1b20'
        });
        $(document).find('#popup-choose-city button').css({
            'background': isDark ? '#1c1b20' : '#fcfbfe',
            'color': isDark ? '#2997fe' : '#2778c4',
            'border-color': isDark ? '#2997fe' : '#2778c4'
        });

    });

    const scrollbind = el => el.bind("scroll", function(){
        scroll = $(this).scrollTop();
        if($(".container").length > 1) //No point setting it if there is only 1
            $(".container").scrollTop(scroll);
        //This will set the scroll position of the container inside the clip so it scrolls while the animation is being carried out
    });
    scrollbind($(".container"));

    $(document).on("click", "#choose-city-button, .choose-city-mobile", function(){
        $('div.popup-container').fadeIn(300);
    });

    $(document).on("click", "#close-modal", function(){
        $('div.popup-container').fadeOut(500);

    })

    $(document).on("click", ".menu-links-bar", function(){
        let changeIcon = $(this);
        $('.menu-nav-mobile').toggleClass('active')

        if ($('.menu-nav-mobile').hasClass('active')) {

            $('.menu-nav-mobile').fadeIn(300, function(){
                changeIcon
                    .html('&#65794;')
                    .css({
                    'font-size': '49px',
                    'margin-top': '-=8.5px',
                    'margin-left': '+=4px'

                    });
            });

        } else {
            $('.menu-nav-mobile').fadeOut(300, function(){
                changeIcon
                    .html('&#9776;')
                    .css({
                        'font-size': '40px',
                        'margin-top': '+=8.5px',
                        'margin-left': '-=4px'
                    });
            });
        }
    })


});

