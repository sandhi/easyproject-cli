#!/usr/bin/env node

var inquirer = require("inquirer");

inquirer
    .prompt([
        {
            type: "list",
            name: "project",
            message: "project apa yang ingin ada buat ?",
            choices: ["ionic 4", "ionic 5", "loopback 4"],
        },
    ])
    .then((res: any) => console.log("project yang akan anda buat adalah " + res.project));
