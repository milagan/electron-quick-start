function Setup-Firewall {
    $Data = Get-EflowVmAddr
    $IpAddress = $Data[1]

    Write-Output "Allowing Checkpoint Services TCP port in Windows Firewall..."
    netsh advfirewall firewall delete rule name="Checkpoint Services"
    netsh advfirewall firewall delete rule name="Checkpoint Background Services"
    netsh advfirewall firewall add rule name="Checkpoint Services" dir=in action=allow protocol=TCP localport=53,80,443,4200
    netsh advfirewall firewall add rule name="Checkpoint Background Services" dir=in action=allow protocol=UDP localport=53
    Write-Output "Allowing Checkpoint Services TCP port forwarding..."
    netsh interface portproxy add v4tov4 listenport=53 listenaddress=0.0.0.0 connectport=53 connectaddress=$IpAddress
    netsh interface portproxy add v4tov4 listenport=80 listenaddress=0.0.0.0 connectport=80 connectaddress=$IpAddress
    netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=443 connectaddress=$IpAddress
    netsh interface portproxy add v4tov4 listenport=4200 listenaddress=0.0.0.0 connectport=4200 connectaddress=$IpAddress

    Setup-Host-File($IpAddress)
}

function Setup-Host-File($IpAddress) {
    $HostFile = "$($Env:WinDir)\system32\drivers\etc\hosts"

    # Create a backup copy of the Hosts file
    $dateFormat = (Get-Date).ToString('dd-MM-yyyy hh-mm-ss')
    $FileCopy = $HostFile + '.' + $dateFormat + '.copy'
    Copy-Item $HostFile -Destination $FileCopy

    #Hosts to Add
    $Hosts = @("app-dashboard.checkpoint-service.com",
    "app-docker.checkpoint-service.com",
    "app-ssh.checkpoint-service.com",
    "app-rfid-capture-tool.checkpoint-service.com",
    "app-monitoring-tool.checkpoint-service.com",
    "app-visualization-tool.checkpoint-service.com",
    "app-driver.checkpoint-service.com",
    "app-apollo-driver.checkpoint-service.com")

    # write the Entries to hosts file, if it doesn't exist.
    foreach ($HostFileEntry in $Hosts) {
        Write-Output "Removing Host File Entry for $HostFileEntry"
        Start-Sleep -s 1
        Remove-Host-File-Item($HostFileEntry)
        Write-Output "Adding Host File Entry for $HostFileEntry"
        Start-Sleep -s 1
        Add-content -path $HostFile -value "$IpAddress $HostFileEntry"
    }
}

function Remove-Host-File-Item($HostName)
{
    $HostFilePath = "$($Env:WinDir)\system32\Drivers\etc\hosts"
    $HostFile = Get-Content $HostFilePath
    $EscapedHostname = [Regex]::Escape($Hostname)
    If (($HostFile) -match ".*\s+$EscapedHostname.*")  {
        $HostFile -notmatch ".*\s+$EscapedHostname.*" | Out-File $HostFilePath
    }
}

Setup-Firewall
