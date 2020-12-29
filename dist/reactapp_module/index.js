"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_reactapp = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
var ncmd = require("node-cmd");
const prompt_name = {
    react_app_name: "react_app_name",
    react_app_dependency: "react_app_dependency",
};
const list_dependency = ["react-router-dom", "bootstrap@4.5.3", "axios"];
function create_reactapp() {
    inquirer_1.default
        .prompt([
        {
            type: "input",
            name: prompt_name.react_app_name,
            message: "masukkan nama aplikasi react anda?",
            filter: (input) => {
                return new Promise((resolve, reject) => {
                    if (input == "") {
                        reject("invalid");
                    }
                    else if (input.indexOf(" ") !== -1) {
                        reject("tidak boleah ada spasi");
                    }
                    else {
                        resolve(input);
                    }
                });
            },
        },
        {
            type: "checkbox",
            name: prompt_name.react_app_dependency,
            message: "pilih library yang akan di install?",
            choices: list_dependency,
        },
    ])
        .then(async (res) => {
        if (res.react_app_name) {
            console.log("==================================================");
            console.log(chalk_1.default.blue("menginstall aplikasi react dengan nama " + res.react_app_name + "\n"));
            await do_create_react_app(res.react_app_name);
            child_process_1.exec("cd " + res.react_app_name, () => {
                console.log("\n");
                console.log("masuk ke directory " + res.react_app_name);
                console.log("\n");
            });
        }
        if (res.react_app_dependency) {
            console.log("==================================================");
            console.log(chalk_1.default.blue("menginstall dependecy : ", res.react_app_dependency.join(" ")));
            await do_install_dep(res.react_app_dependency);
        }
    });
}
exports.create_reactapp = create_reactapp;
function do_create_react_app(name) {
    return new Promise((resolve, reject) => {
        const create_app = child_process_1.spawn("npx", ["create-react-app", name], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
        });
        create_app.on("exit", () => {
            resolve(true);
        });
    });
}
function do_install_dep(dep) {
    let list_dep = [];
    list_dep.push("install");
    dep.map((val) => {
        list_dep.push(val);
    });
    console.log(chalk_1.default.cyanBright("package yang akan di install : ", list_dep));
    return new Promise((resolve, reject) => {
        if (dep.length > 0) {
            const install_dep = child_process_1.spawn("npm", list_dep, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit",
            });
            install_dep.on("exit", () => {
                resolve(true);
            });
        }
        else {
            resolve(true);
        }
    });
}
