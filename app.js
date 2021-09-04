const shortcodeEndpoint = 'https://api.shrtco.de/v2/shorten?url=';
let answer;

const progressHTML = `<div class="shortened-link">

<div class="link-progress">
  <div class="inner-progress"></div>
</div>

</div>`;

async function getShortenedLink(oldLink) {
    try {
        const response = await fetch(shortcodeEndpoint + oldLink);
        if (response.ok) {
            const jsonResponse = await response.json();
            answer = jsonResponse;
        }
    } catch (error) {
        console.log(error);
    }
}

const addProgress = value => {
    let prevValue = $('.inner-progress').css('width').slice(0, -1).slice(0, -1);
    $('.inner-progress').css({'width': (prevValue + value) + '%'});
}

function moveProgressBar() {
    setInterval(() => {
        addProgress(15);
    }, 6000);
}

function copyText(e) {
    $(e.target).text('Copied!');
    $(e.target).css({'background-color': 'hsl(257, 27%, 26%)'});
}

function onSubmit(e) {
    let linkValue = $('.url-input').val();

    e.preventDefault();

    if (linkValue != '') {
        getShortenedLink(linkValue);
        let prevHTML = $('.shortener-container').html();
        $('.shortener-container').html(prevHTML + progressHTML);
        $('.url-input').val('');
        moveProgressBar();

        let intervalId = setInterval(() => {
            if (answer) {
                let finishedHTML = `<div class="shortened-link">

                <p>${answer.result.original_link}</p>
        
                <div class="shortened-right">
                  <a href="${answer.result.full_short_link}" target="_blank" class="final-link">${answer.result.full_short_link}</a>
                  <button class="copy-button">Copy</button>
                </div>
                
              </div>`;

                $('.shortener-container').html(prevHTML + finishedHTML);
                $('.copy-button').click(copyText);
                answer = undefined;
                clearInterval(intervalId);
            }
        }, 500);
    }
}

$('.url-shortener').submit(onSubmit);

$('.mobile-menu').click(() => {
    if ($('.mobile-nav').css('display') == 'none') {
        $('.mobile-nav').css({'display': 'flex'});
    }
    else {
        $('.mobile-nav').css({'display': 'none'});
    }
});