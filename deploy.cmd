cd client\user
call npm run build
cd ..\admin
call npm run build
cd ..\..\server\client
rmdir /S /Q admin
rmdir /S /Q user
xcopy /E ..\..\client\admin\dist admin\
xcopy /E ..\..\client\user\dist user\
cd ..\..
flyctl deploy