"use strict";
// var fs = require('fs');
var webdriver = require('selenium-webdriver');

var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
// var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'phantomjs' }).build();

var github_username='';
var github_pass='';
var app_name='test';
var app_description='desk';
var app_lang='uk';

createWitApp( github_username, github_pass, app_name, app_description, app_lang);

function screenshot (scr_name) {
    browser.takeScreenshot().then(
        function(image, err) {
            require('fs').writeFile(scr_name, image, 'base64', function(err) {
                console.log(scr_name, err);
            });
        }
    );
}

function createWitApp( github_username, github_pass, app_name, app_description, app_lang, callback){

    browser.get('https://wit.ai');
    screenshot('home.png');
    browser.findElement(webdriver.By.className("btn-login btn-fold btn btn-lg")).click();

    browser.getAllWindowHandles().then(function (handles) {
        browser.sleep(1000);
        // console.log(handles);
        browser.switchTo().window(handles[1]); // switch to the popup
        browser.wait(webdriver.until.elementLocated(webdriver.By.id("password")), 15 * 1000).then(function(elm) {
            elm.sendKeys(github_pass);
        });
        browser.findElement(webdriver.By.id("login_field")).sendKeys(github_username);
        screenshot('gh.png');
        browser.findElement(webdriver.By.name("commit")).click();
        // browser.findElement(webdriver.By.name("authorize")).click();
        browser.switchTo().window(handles[0]); //switch back
    });

    browser.wait(webdriver.until.elementLocated(webdriver.By.className("avatar header-pic")), 15 * 1000).then(function(elm) {
        elm.click();
    });
    browser.findElement(webdriver.By.className("create-instance")).click();
    browser.findElement(webdriver.By.className("form-control new-instance-input new-instance-name")).sendKeys(app_name);
    browser.findElement(webdriver.By.className("form-control new-instance-input new-instance-desc")).sendKeys(app_description);
    browser.findElement(webdriver.By.name("pr")).click(); // make privat app
    browser.findElement(webdriver.By.className("form-control new-instance-input new-instance-lang")).click();
    browser.findElement(webdriver.By.css("option[value='"+app_lang+"']")).click();
    screenshot('newapp.png');
    browser.findElement(webdriver.By.className("btn btn-info create-instance")).click();
    browser.quit();
};
