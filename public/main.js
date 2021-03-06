var subtitles = document.getElementById('subtitles');

var subinc = document.getElementById('subinc');
var subdec = document.getElementById('subdec');

var videoContainer = document.getElementById('videoContainer');
var video = document.getElementById('video');
var videoControls = document.getElementById('video-controls');

for (var i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = 'hidden';
}


var subtitleMenuButtons = [];
var createMenuItem = function (id, lang, label) {
    var listItem = document.createElement('li');
    var button = listItem.appendChild(document.createElement('button'));
    button.setAttribute('id', id);
    button.className = 'subtitles-button';
    if (lang.length > 0) button.setAttribute('lang', lang);
    button.value = label;
    button.setAttribute('data-state', 'inactive');
    button.appendChild(document.createTextNode(label));
    button.addEventListener('click', function (e) {
        subtitleMenuButtons.map(function (v, i, a) {
            subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
        });
        var lang = this.getAttribute('lang');
        for (var i = 0; i < video.textTracks.length; i++) {
            if (video.textTracks[i].language == lang) {
                video.textTracks[i].mode = 'showing';
                this.setAttribute('data-state', 'active');
            }
            else {
                video.textTracks[i].mode = 'hidden';
            }
        }
        subtitlesMenu.style.display = 'none';
    });
    subtitleMenuButtons.push(button);
    return listItem;
}

var subtitlesMenu;
if (video.textTracks) {
    var subtitlesMenu = videoControls.appendChild(document.createElement('ul'));
    subtitlesMenu.className = 'subtitles-menu';
    subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
    for (var i = 0; i < video.textTracks.length; i++) {
        subtitlesMenu.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
    }
    videoControls.appendChild(subtitlesMenu);
}

var i = 30;

var altersub = function (dir) {
    var s = document.createElement("style");
    if (dir === '+' && i < 70) {
        i += 1;
        s.type = "text/css";
        s.innerHTML = "::cue  {"
            + `font-size: ${i + 1}px;`
            + "}";
        i += 1;
    } else if (dir === '-' && i > 16) {
        i -= 1;
        s.type = "text/css";
        s.innerHTML = "::cue  {"
            + `font-size: ${i - 1}px;`
            + "}";
        i -= 1;
    }
    document.head.appendChild(s);
}


subinc.addEventListener('click', function (e) {
    altersub('+');
});
subdec.addEventListener('click', function (e) {
    altersub('-');
});


subtitles.addEventListener('click', function (e) {
    if (subtitlesMenu) {
        subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
    }
});

var dialogueTimings = [0, 34, 36, 39, 43, 45, 47, 51, 57, 62, 67, 73, 76, 78, 82, 85, 88, 91, 96, 102, 106, 110, 154, 156, 158, 160, 165, 168, 170, 175, 180, 187, 201, 204, 208, 213, 218, 224];
var dialogues = document.querySelectorAll('#transcript>li');
var transcriptWrapper = document.querySelector('#transcriptWrapper');
var audio = document.querySelector('#audio');
var previousDialogueTime = -1;

function playTranscript() {
    var currentDialogueTime = Math.max.apply(Math, dialogueTimings.filter(function (v) { return v <= audio.currentTime }));

    if (previousDialogueTime !== currentDialogueTime) {
        previousDialogueTime = currentDialogueTime;
        var currentDialogue = dialogues[dialogueTimings.indexOf(currentDialogueTime)];
        transcriptWrapper.scrollTop = currentDialogue.offsetTop - 50;
        var previousDialogue = document.getElementsByClassName('speaking')[0];
        if (previousDialogue !== undefined)
            previousDialogue.className = previousDialogue.className.replace('speaking', '');
        currentDialogue.className += ' speaking';
    }
}