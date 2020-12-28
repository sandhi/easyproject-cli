#!/usr/bin/env node

var inquirer = require("inquirer");
var chalk = require("chalk");
import { program } from "commander";

program.version("1.0.0", "-v, --version", "show cli version");
program.parse(process.argv);
inquirer
    .prompt([
        {
            type: "list",
            name: "project",
            message: "project apa yang ingin ada buat ?",
            choices: ["ionic 4", "ionic 5", "loopback 4"],
        },
    ])
    .then((res: any) => console.log("project yang akan anda buat adalah " + chalk.blue(res.project)));
