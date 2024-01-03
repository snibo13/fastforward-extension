function changeSpeed(targetSpeed) {
    console.log("Changing speed")
    if (document.getElementsByTagName("video").length) {
        const videos = [...document.getElementsByTagName("video")];
        let currentSpeed = videos[0].playbackRate;
        videos.forEach(v => v.playbackRate = currentSpeed == targetSpeed ? 1 : targetSpeed);

        currentSpeed = videos[0].playbackRate;
    } else {
        console.log("Can't find a video.");
    }
}

function getCurrentSpeed() {
    if (document.getElementsByTagName("video").length) {
        const videos = [...document.getElementsByTagName("video")];
        let currentSpeed = videos[0].playbackRate;
        console.log("Current speed: " + currentSpeed)
        return currentSpeed;

    } else {
        console.log("Can't find a video.");
        return undefined
    }
}

async function getCurrentTab() {
    console.log("Getting current tab")
    let queryOptions = { active: true, lastFocusedWindow: true };
    let tab = await chrome.tabs.query(queryOptions);
    console.log(tab);
    return tab;
}

function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        if (chrome.runtime.lastError)
            console.error(chrome.runtime.lastError);
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        console.log(tab)
        // callback(tab);
    });
}

function changeSpeedWrapper() {
    targetSpeed = document.getElementById("number").value;
    console.log("Target speed: " + targetSpeed)
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: changeSpeed,
        args: [targetSpeed]
    })
        .then(() => console.log("injected script file"))

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: getCurrentSpeed,
    },
        (res) => {
            let speed = res[0].result;
            console.log(speed);
            document.getElementById("cs").innerHTML = speed;
        }
    )
}

function getTabs(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        callback(tabs);
    });
}




let tabId;
let targetSpeed = 1;
// Attach the function to the button click event
document.addEventListener('DOMContentLoaded', function () {
    getTabs(function (tabs) {
        let tab = tabs[0];
        let activeTabId = tab.id;
        console.log(activeTabId);
        // Set the constant tab id equal to the active tab id
        tabId = activeTabId;
    });
    document.getElementById('play').addEventListener('click', changeSpeedWrapper);
});