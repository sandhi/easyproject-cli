#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pkg = require("../package.json");
var inquirer = require("inquirer");
const commander_1 = require("commander");
const reactapp = __importStar(require("./reactapp_module"));
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
    .then((res) => {
    switch (res.project) {
        case "ionic3":
            break;
        case "ionic4":
            break;
        case "loopback4":
            break;
        case "reactapp":
            reactapp.create_reactapp();
            break;
        default:
            console.log("salah pilih");
            break;
    }
});
