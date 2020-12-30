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
const cli_table_1 = __importDefault(require("cli-table"));
const prompt_name = {
    react_app_name: "react_app_name",
    react_app_template: "react_app_template",
    react_app_dependency: "react_app_dependency",
};
const list_dependency = ["react-router-dom", "bootstrap@4.5.3", "axios", "node-sass"];
const list_template = ["default", "typescript"];
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
                    else if (input.length > 30) {
                        reject("nama terlalu panjang");
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
            message: "template apa yang anda inginkan",
            choices: list_template,
        },
    ])
        .then(async (res) => {
        if (res.react_app_name) {
            console.log("==================================================");
            console.log(chalk_1.default.blueBright("menginstall aplikasi react dengan nama " + res.react_app_name + "\n"));
            await do_create_react_app(res);
        }
        if (res.react_app_dependency) {
            console.log("==================================================");
            console.log(chalk_1.default.blueBright("menginstall dependecy : ", res.react_app_dependency.join(" ")));
            await do_install_dep(res);
        }
        await do_finish_message(res);
    });
}
exports.create_reactapp = create_reactapp;
async function do_create_react_app(data) {
    let arg_list = [];
    arg_list.push("create-react-app");
    arg_list.push(data.react_app_name);
    if (data.react_app_template != undefined && data.react_app_template != "default") {
        arg_list.push("--template");
        arg_list.push(data.react_app_template);
    }
    let tasks = new Listr([
        {
            title: data.react_app_template != undefined && data.react_app_template != "default"
                ? "installing react app dengan template " + chalk_1.default.blueBright(data.react_app_template)
                : "installing react app",
            task: () => {
                return execa_1.default("npx", arg_list);
            },
        },
    ]);
    await tasks.run();
}
async function do_install_dep(data) {
    let proc = [];
    let list_dep = data.react_app_dependency;
    if (data.react_app_dependency.includes("bootstrap@4.5.3")) {
        list_dep.push("jquery");
        list_dep.push("popper.js");
    }
    list_dep.map((value) => {
        proc.push({
            title: "installing " + value,
            task: (ctx, task) => {
                return execa_1.default("npm", ["install", "--save", value], {
                    cwd: process.cwd() + "\\" + data.react_app_name,
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
async function do_finish_message(data) {
    console.log(chalk_1.default.greenBright("berhasil membuat app pada directory : " + process.cwd() + "\\" + data.react_app_name));
    console.log(chalk_1.default.greenBright("untuk memulai silahkan masuk ke dalam directory tersebut dan jalankan perintah " +
        chalk_1.default.blueBright("npm start")));
    const table_options = {
        head: [
            chalk_1.default.blueBright("Nama App"),
            chalk_1.default.blueBright("Directory"),
            chalk_1.default.blueBright("Installed Dependency"),
            chalk_1.default.blueBright("Template"),
        ],
    };
    const table = new cli_table_1.default(table_options);
    let dep = data.react_app_dependency.length > 3
        ? data.react_app_dependency.slice(0, 3).join(" ,") + " dll."
        : data.react_app_dependency;
    table.push([data.react_app_name, process.cwd() + "\\" + data.react_app_name, dep, data.react_app_template]);
    console.log(table.toString());
}
