# Jinnmail Dashboard

## Project Created From

npx create-react-app dash-pwa --template cra-template-pwa

## Component Hierarchy
```
Error Boundary
  Provider
    App
      BrowserRouter
        CreateAccount
        Login
          Dashboard
            MaterialTable
              ConfirmAliasDeletion
              MultipleSelect
              AliasForm
```

## Development
```
npm install
npm start
```

## Deploy
```
git push origin main
```

## First Deployment
```
create new ubuntu 20.04 g1 small instance 1.7GB, 
bigger because more libraries built in build process
sudo apt update
sudo apt install apache2
cd /var/www/html
sudo rm index.html
sudo git clone x . 
check environment variables in .env file are correct production values
install node which comes with npm 
https://cloud.google.com/nodejs/docs/setup
says install nvm
exit out of terminal and come back in
nvm install 12.17.0 
instead of nvm install stable
sudo chown -R $USER /var/www/html
npm install
sudo vim /etc/apache2/sites-available/000-default.conf
add two new lines to the bottom of the VirtualHost tag
        ProxyPass / http://127.0.0.1:5000/
        ProxyPassReverse / http://127.0.0.1:5000/
enable proxy mode too,
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_balancer
sudo a2enmod proxy_http
npm run build
npm install -g serve
screen
press enter
serve -s build
detach from screen
ctrl a d
sudo service apache2 restart
follow certbot instructions for using https
https://certbot.eff.org/lets-encrypt/ubuntufocal-apache
exit
```

## Subsequent Deployments
```
increase version number in package.json
git push origin main
screen -x tab
ctrl c
git pull && npm run build && serve -s build
detach from screen
ctrl a d
exit
```