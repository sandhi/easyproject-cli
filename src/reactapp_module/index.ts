import inquirer from "inquirer";
import chalk from "chalk";
import { exec, execSync, spawn } from "child_process";

type dep = "react-router-dom" | "bootstrap@4.5.3" | "axios";

const prompt_name = {
    react_app_name: "react_app_name",
    react_app_dependency: "react_app_dependency",
};

interface IPromptValue {
    react_app_name: string;
    react_app_dependency: dep[];
}

const list_dependency: dep[] = ["react-router-dom", "bootstrap@4.5.3", "axios"];

export function create_reactapp() {
    inquirer
        .prompt([
            {
                type: "input",
                name: prompt_name.react_app_name,
                message: "masukkan nama aplikasi react anda?",
                filter: (input) => {
                    return new Promise((resolve, reject) => {
                        if (input == "") {
                            reject("invalid");
                        } else if (input.indexOf(" ") !== -1) {
                            reject("tidak boleah ada spasi");
                        } else {
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
        .then(async (res: IPromptValue) => {
            if (res.react_app_name) {
                console.log("==================================================");
                console.log(chalk.blue("menginstall aplikasi react dengan nama " + res.react_app_name + "\n"));
                await do_create_react_app(res.react_app_name);
            }

            if (res.react_app_dependency) {
                console.log("==================================================");

                console.log(chalk.blue("menginstall dependecy : ", res.react_app_dependency.join(" ")));
                await do_install_dep(res);
            }
        });
}

function do_create_react_app(name: string) {
    return new Promise((resolve) => {
        const create_app = spawn("npx", ["create-react-app", name], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
        });

        create_app.on("exit", () => {
            resolve(true);
        });
    });
}

function do_install_dep(data: IPromptValue) {
    let list_dep: any[] = [];

    list_dep.push("install");

    data.react_app_dependency.map((val) => {
        list_dep.push(val);
    });

    return new Promise((resolve) => {
        if (data.react_app_dependency.length > 0) {
            const install_dep = spawn("npm", list_dep, {
                cwd: process.cwd() + "/" + data.react_app_name,
                detached: true,
                stdio: "inherit",
            });

            install_dep.on("exit", () => {
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
}
