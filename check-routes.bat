@echo off
rem Quick status check of every mock project route
for %%i in (restaurant-booking saas-analytics personal-portfolio ecommerce-store fitness-landing demo) do (
  curl -s -o nul -w "%%i -> HTTP %%{http_code}\n" http://localhost:3000/project/%%i
)
