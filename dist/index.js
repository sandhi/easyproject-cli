#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pkg = require("../package.json");
var inquirer = require("inquirer");
var chalk = require("chalk");
const commander_1 = require("commander");
const package_list = ["ionic3", "ionic4", "loopback4", "reactapp"];
commander_1.program.version(pkg.version, "-v, --version", "show cli version");
commander_1.program.parse(process.argv);
inquirer
    .prompt([
    {
        type: "list",
        name: "project",
        message: "project apa yang ingin ada buat ?",
        choices: package_list,
    },
])
    .then((res) => console.log("project yang akan anda buat adalah " + chalk.blue(res.project)));
