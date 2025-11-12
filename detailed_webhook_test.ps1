# Detailed PowerShell script to test the webhook endpoint
Write-Host "Detailed webhook endpoint test" -ForegroundColor Green

# Test 1: Simple message
Write-Host "`n=== Test 1: Simple weekly request ===" -ForegroundColor Yellow
$body1 = @{
    message = "what are the classes this week?"
    userId = "test_user_123"
    platform = "manychat"
} | ConvertTo-Json

try {
    Write-Host "Sending: $($body1)" -ForegroundColor Gray
    $response1 = Invoke-RestMethod -Uri "https://openai-o3ba.onrender.com/make/webhook" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body1
        
    Write-Host "Response:" -ForegroundColor Cyan
    $response1 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Different weekly request
Write-Host "`n=== Test 2: Different weekly request ===" -ForegroundColor Yellow
$body2 = @{
    message = "show me the weekly schedule"
    userId = "test_user_123"
    platform = "manychat"
} | ConvertTo-Json

try {
    Write-Host "Sending: $($body2)" -ForegroundColor Gray
    $response2 = Invoke-RestMethod -Uri "https://openai-o3ba.onrender.com/make/webhook" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body2
        
    Write-Host "Response:" -ForegroundColor Cyan
    $response2 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Direct tool call to see what the tool returns
Write-Host "`n=== Test 3: Direct tool call ===" -ForegroundColor Yellow
$toolBody = @{
    tool_name = "get_schedule_public"
    tool_args = @{
        date_from = (Get-Date).ToString("yyyy-MM-dd")
    }
} | ConvertTo-Json

try {
    Write-Host "Sending direct tool call: $($toolBody)" -ForegroundColor Gray
    $toolResponse = Invoke-RestMethod -Uri "https://openai-o3ba.onrender.com/tool-call" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $toolBody
        
    Write-Host "Direct tool response:" -ForegroundColor Cyan
    $toolResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}