let $ = require('jquery')  // jQuery now loaded and assigned to $
let count = 0
$('#click-counter').text(count.toString())
$('#countbtn').on('click', () => {
    count++
    $('#click-counter').text(count)
})

function showNotification(textTitle, textBody, textClickMessage) {
    new Notification(textTitle, { body: textBody })
        .onclick = () => console.log(textClickMessage)
}

$('#notificationbtn').on('click', () => {
    const NOTIFICATION_TITLE = 'Title'
    const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
    const CLICK_MESSAGE = 'Notification clicked'

    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY, CLICK_MESSAGE)
})

$('#hyperv-btn').on('click', () => {
    $('#hyperv-status').empty();
    $('<br><small>Hyper-V installation started...</small>').appendTo('#hyperv-status');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/hyperv.ps1');
    const fullCommand = policyCommand + ';' + hypervCommand;

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#hyperv-status');
    });
    child.stderr.on("data", function (data) {
        showNotification("Hyper-V Installation Error", data, "")
        $('<br><small>' + data + '</small>').appendTo('#hyperv-status');
    });
    child.on("exit", function () {
        showNotification("Hyper-V Installation", "Installation completed...", "")
        $('<br><small>Hyper-V installation ended...</small>').appendTo('#hyperv-status');
    });
    child.stdin.end(); //end input
})

$('#iotedge-btn').on('click', () => {
    $('#iotedge-status').empty();
    $('<br><small>IoT Edge installation started...</small>').appendTo('#iotedge-status');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/iotedge.ps1');
    const fullCommand = policyCommand + ';' + hypervCommand;

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#iotedge-status');
    });
    child.stderr.on("data", function (data) {
        showNotification("IoT Edge Installation Error", data, "")
        $('<br><small>' + data + '</small>').appendTo('#iotedge-status');
    });
    child.on("exit", function () {
        showNotification("IoT Edge Installation", "Installation completed...", "")
        $('<br><small>IoT Edge installation ended...</small>').appendTo('#iotedge-status');
    });
    child.stdin.end(); //end input
})

$('#deploy-btn').on('click', () => {
    $('#deploy-status').empty();
    $('<br><small>EFLOW deployment started...</small>').appendTo('#deploy-status');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/deploy.ps1');
    const fullCommand = policyCommand + ';' + hypervCommand;

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#deploy-status');
    });
    child.stderr.on("data", function (data) {
        showNotification("EFLOW Deployment Error", data, "")
        $('<br><small>' + data + '</small>').appendTo('#deploy-status');
    });
    child.on("exit", function () {
        showNotification("EFLOW Deployment", "Installation completed...", "")
        $('<br><small>EFLOW deployment ended...</small>').appendTo('#deploy-status');
    });
    child.stdin.end(); //end input
})

$('#firewall-btn').on('click', () => {
    $('#firewall-status').empty();
    $('<br><small>Network setup started...</small>').appendTo('#firewall-status');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/firewall.ps1');
    const fullCommand = policyCommand + ';' + hypervCommand;

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#firewall-status');
    });
    child.stderr.on("data", function (data) {
        showNotification("Network Setup Error", data, "")
        $('<br><small>' + data + '</small>').appendTo('#firewall-status');
    });
    child.on("exit", function () {
        showNotification("Network Setup", "Installation completed...", "")
        $('<br><small>Network setup ended...</small>').appendTo('#firewall-status');
    });
    child.stdin.end(); //end input
})

$('#provision-btn').on('click', () => {
    $('#provision-status').empty();
    $('<br><small>EFLOW provisioning started...</small>').appendTo('#provision-status');

    const path = require('path');
    const policyCommand = 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass';
    const hypervCommand = path.join(__dirname, 'scripts/provision.ps1');
    const connString = $('#connection-string').val();
    const fullCommand = policyCommand + ';' + hypervCommand + ' "' + connString + '"';

    var spawn = require("child_process").spawn, child;
    child = spawn("powershell.exe", [fullCommand]);
    child.stdout.on("data", function (data) {
        $('<br><small>' + data + '</small>').appendTo('#provision-status');
    });
    child.stderr.on("data", function (data) {
        showNotification("EFLOW Provisioning Error", data, "")
        $('<br><small>' + data + '</small>').appendTo('#provision-status');
    });
    child.on("exit", function () {
        showNotification("EFLOW Provisioning", "EFLOW Provisioning completed...", "")
        $('<br><small>EFLOW provisioning ended...</small>').appendTo('#provision-status');
    });
    child.stdin.end(); //end input
})

var shell = require('electron').shell;
//open links externally by default
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});
