steps
-----
create new app in heroku cloud
add postgreSql addon in that app
install pgAdmin [postgreSql UI] and connect to the cloud hosted db with heroku db credentials
install docker desktop and run it
install global prisma

prisma init with required option to generate 3 files
	datamodel.prisma
	docker-compose.yml
	prisma.yml

open prisma folder
	cd prisma
start prisma docker server
	docker-compose up -d
deploy prisma service
	prisma deploy
