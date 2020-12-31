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
const rxjs_1 = require("rxjs");
const ora_1 = __importDefault(require("ora"));
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
        try {
            await do_validation();
            // if (res.react_app_name) {
            //     console.log("==================================================");
            //     console.log(
            //         chalk.blueBright("menginstall aplikasi react dengan nama " + res.react_app_name + "\n")
            //     );
            //     await do_create_react_app(res);
            // }
            // if (res.react_app_dependency) {
            //     console.log("==================================================");
            //     console.log(chalk.blueBright("menginstall dependency : ", res.react_app_dependency.join(" ")));
            //     await do_install_dep(res);
            // }
            await do_finish_message(res);
        }
        catch (e) {
            console.log(chalk_1.default.red("Process gagal, silahkan coba lagi"));
        }
    });
}
exports.create_reactapp = create_reactapp;
async function do_validation() {
    // check untuk versi npm
    let loading = ora_1.default("checking npm").start();
    try {
        const { stdout, stderr } = await execa_1.default("npm", ["-v"]);
        if (stdout && stdout.indexOf(".") !== -1) {
            let version = parseInt(stdout.slice(0, 1));
            if (version < 6) {
                throw "tolong update versi npm anda ke version 6 atau lebih";
            }
        }
        if (stderr) {
            console.log(chalk_1.default.red(stderr));
            throw "npm belum terinstall";
        }
        loading.succeed("npm tersedia version " + stdout);
    }
    catch (e) {
        loading.fail(e.toString());
        return Promise.reject("gagal");
    }
}
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
                // return execa("npx", arg_list);
                return new rxjs_1.Observable((observable) => {
                    var _a;
                    try {
                        let proc = execa_1.default("npx", arg_list);
                        (_a = proc.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                            observable.next(data.toString());
                        });
                        proc.on("exit", () => {
                            observable.complete();
                        });
                    }
                    catch (e) {
                        observable.error("error create app");
                    }
                });
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
    let dep = data.react_app_dependency.length > 3
        ? data.react_app_dependency.slice(0, 3).join(" ,") + " dll."
        : data.react_app_dependency;
    const table = new cli_table_1.default();
    table.push({ "Nama App": data.react_app_name }, { Directory: process.cwd() + "\\" + data.react_app_name }, { "Installed dependency": dep }, { Template: data.react_app_template });
    console.log(table.toString());
}
