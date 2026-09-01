$base = "http://localhost:3000"

function Check($name, $url, $expectStatus, $expectText) {
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
    $status = $res.StatusCode
    $body = $res.Content
    $textOk = "n/a"
    if ($expectText -ne "") {
      $textOk = if ($body.Contains($expectText)) { "OK" } else { "MISSING" }
    }
    $statusOk = if ($status -eq $expectStatus) { "OK" } else { "WRONG" }
    Write-Output ("{0}: status={1}({2}) text='{3}'({4})" -f $name, $status, $statusOk, $expectText, $textOk)
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq $expectStatus) {
      Write-Output ("{0}: status={1}(OK)" -f $name, $code)
    } else {
      Write-Output ("{0}: ERROR {1}" -f $name, $code)
    }
  }
}

Check "Landing"        "$base/" 200 "Build websites by describing what you want"
Check "Dashboard"      "$base/dashboard" 200 "Your Projects"
Check "Restaurant"     "$base/project/restaurant-booking" 200 "Restaurant Booking"
Check "SaaS"           "$base/project/saas-analytics" 200 "SaaS Analytics"
Check "Portfolio"      "$base/project/personal-portfolio" 200 "Personal Portfolio"
Check "E-commerce"     "$base/project/ecommerce-store" 200 "E-commerce Store"
Check "Fitness"        "$base/project/fitness-landing" 200 "Fitness Landing"
Check "Demo"           "$base/project/demo" 200 "New project"
Check "Unknown-404"    "$base/project/nope" 404 ""
Check "Random-404"     "$base/does-not-exist" 404 ""

# Cross-contamination check: restaurant workspace must NOT contain SaaS name and vice versa
$rest = (Invoke-WebRequest -Uri "$base/project/restaurant-booking" -UseBasicParsing -TimeoutSec 15).Content
$saas = (Invoke-WebRequest -Uri "$base/project/saas-analytics" -UseBasicParsing -TimeoutSec 15).Content
Write-Output ("Restaurant page leak-check (should be CLEAN): " + $(if ($rest.Contains("SaaS Analytics")) {"LEAK"} else {"CLEAN"}))
Write-Output ("SaaS page leak-check (should be CLEAN): " + $(if ($saas.Contains("Restaurant Booking")) {"LEAK"} else {"CLEAN"}))

# Logo link checks: dashboard and workspace header must link logo to "/"
$dash = (Invoke-WebRequest -Uri "$base/dashboard" -UseBasicParsing -TimeoutSec 15).Content
Write-Output ("Dashboard logo->home link: " + $(if ($dash.Contains('href="/"')) {"PRESENT"} else {"MISSING"}))
Write-Output ("Workspace logo->home link: " + $(if ($rest.Contains('href="/"')) {"PRESENT"} else {"MISSING"}))
