let $ = require('jquery')  // jQuery now loaded and assigned to $
let count = 0
$('#click-counter').text(count.toString())
$('#countbtn').on('click', () => {
    count++
    $('#click-counter').text(count)
})

$('#notificationbtn').on('click', () => {
    const NOTIFICATION_TITLE = 'Title'
    const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
    const CLICK_MESSAGE = 'Notification clicked'

    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => console.log(CLICK_MESSAGE)
})

$('#powershellbtn').on('click', () => {
    $('#powershell').empty();
    $('<br><small>Powershell started...</small>').appendTo('#powershell');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/hyperv.ps1');
    const fullCommand = policyCommand + ';' + hypervCommand;

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#powershell');
    });
    child.stderr.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#powershell');
    });
    child.on("exit", function () {
        $('<br><small>Powershell ended...</small>').appendTo('#powershell');
    });
    child.stdin.end(); //end input
})
