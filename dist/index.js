#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require("inquirer");
var chalk = require("chalk");
const commander_1 = require("commander");
commander_1.program.version("1.0.0", "-v, --version", "show cli version");
commander_1.program.parse(process.argv);
inquirer
    .prompt([
    {
        type: "list",
        name: "project",
        message: "project apa yang ingin ada buat ?",
        choices: ["ionic 4", "ionic 5", "loopback 4"],
    },
])
    .then((res) => console.log("project yang akan anda buat adalah " + chalk.blue(res.project)));
