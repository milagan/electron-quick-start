$ConnectionString=$args[0]

Write-Output "Provisioning EFLOW..."
Write-Output "$ConnectionString"
Provision-EflowVm -provisioningType ManualConnectionString -devConnString "$ConnectionString"
