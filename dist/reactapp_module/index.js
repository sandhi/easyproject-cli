"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_reactapp = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const Listr = require("listr");
const prompt_name = {
    react_app_name: "react_app_name",
    react_app_template: "react_app_template",
    react_app_dependency: "react_app_dependency",
};
const list_dependency = ["react-router-dom", "bootstrap@4.5.3", "axios", "node-sass"];
const list_template = ["typescript"];
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
        {
            type: "list",
            name: prompt_name.react_app_template,
            message: "template apa yang anda inginkan (enter untuk tidak menggunakan)",
            choices: list_template,
        },
    ])
        .then(async (res) => {
        // if (res.react_app_name) {
        //     console.log("==================================================");
        //     console.log(chalk.blue("menginstall aplikasi react dengan nama " + res.react_app_name + "\n"));
        //     await do_create_react_app(res);
        // }
        if (res.react_app_dependency) {
            console.log("==================================================");
            console.log(chalk_1.default.blue("menginstall dependecy : ", res.react_app_dependency.join(" ")));
            await do_install_dep(res);
        }
    });
}
exports.create_reactapp = create_reactapp;
async function do_create_react_app(data) {
    let arg_list = [];
    arg_list.push("create-react-app");
    arg_list.push(data.react_app_name);
    if (data.react_app_template != undefined) {
        arg_list.push("--template");
        arg_list.push(data.react_app_template);
    }
    let tasks = new Listr([
        {
            title: "installing react app",
            task: () => {
                return execa_1.default("npx", arg_list);
            },
        },
    ]);
    await tasks.run();
}
async function do_install_dep(data) {
    let proc = [];
    data.react_app_dependency.map((value) => {
        proc.push({
            title: "installing " + value,
            task: (ctx, task) => {
                return execa_1.default("npm", ["install", "--save", value], {
                    cwd: process.cwd() + "/" + data.react_app_name,
                }).catch((err) => {
                    console.log(chalk_1.default.red(err));
                    task.skip("failed install " + value);
                });
            },
        });
    });
    let tasks = new Listr(proc);
    await tasks.run();
}
