"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_reactapp = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const child_process_1 = require("child_process");
var ncmd = require("node-cmd");
function create_reactapp() {
    inquirer_1.default
        .prompt([
        {
            type: "input",
            name: "react_app_name",
            message: "masukkan nama aplikasi react anda?",
            filter: (input) => {
                return new Promise((resolve, reject) => {
                    if (input == "") {
                        reject("invalid");
                    }
                    else {
                        resolve(input);
                    }
                });
            },
        },
    ])
        .then((res) => {
        let name = res.react_app_name;
        console.log("anda akan membuat applikasi reactjs dengan nama " + name + "\n");
        const create_app = child_process_1.spawn("npx", ["create-react-app", name], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
        });
        create_app.on("exit", () => {
            console.log("exit create process \n");
            console.log("begin remove dir \n");
            child_process_1.spawn("rm", ["-rf", name], {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit",
            });
        });
    });
}
exports.create_reactapp = create_reactapp;
