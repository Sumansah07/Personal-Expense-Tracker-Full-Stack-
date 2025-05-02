@echo off
echo Viewing MongoDB Data in JSON Format
echo ================================

echo.
echo Expenses Collection:
echo -------------------
docker-compose exec mongo mongosh expense-tracker --eval "JSON.stringify(db.expenses.find().toArray(), null, 2)" --quiet

echo.
echo Users Collection:
echo ---------------
docker-compose exec mongo mongosh expense-tracker --eval "JSON.stringify(db.users.find().toArray(), null, 2)" --quiet

echo.
echo Done!
pause
