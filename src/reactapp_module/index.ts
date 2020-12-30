import inquirer from "inquirer";
import chalk from "chalk";
import execa from "execa";
const Listr = require("listr");

type dep = "react-router-dom" | "bootstrap@4.5.3" | "axios" | "node-sass";
type template = "typescript";

const prompt_name = {
    react_app_name: "react_app_name",
    react_app_template: "react_app_template",
    react_app_dependency: "react_app_dependency",
};

interface IPromptValue {
    react_app_name: string;
    react_app_dependency: dep[];
    react_app_template: template;
}

const list_dependency: dep[] = ["react-router-dom", "bootstrap@4.5.3", "axios", "node-sass"];
const list_template: template[] = ["typescript"];

export function create_reactapp() {
    inquirer
        .prompt([
            {
                type: "input",
                name: prompt_name.react_app_name,
                message: "masukkan nama aplikasi react anda?",
                filter: (input: any) => {
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
            {
                type: "list",
                name: prompt_name.react_app_template,
                message: "template apa yang anda inginkan (enter untuk tidak menggunakan)",
                choices: list_template,
            },
        ])
        .then(async (res: IPromptValue) => {
            if (res.react_app_name) {
                console.log("==================================================");
                console.log(chalk.blueBright("menginstall aplikasi react dengan nama " + res.react_app_name + "\n"));
                await do_create_react_app(res);
            }

            if (res.react_app_dependency) {
                console.log("==================================================");

                console.log(chalk.blueBright("menginstall dependecy : ", res.react_app_dependency.join(" ")));
                await do_install_dep(res);
            }
        });
}

async function do_create_react_app(data: IPromptValue) {
    let arg_list: any = [];

    arg_list.push("create-react-app");
    arg_list.push(data.react_app_name);

    if (data.react_app_template != undefined) {
        arg_list.push("--template");
        arg_list.push(data.react_app_template);
    }

    let tasks = new Listr([
        {
            title:
                "installing react app" + (data.react_app_template != undefined)
                    ? " dengan template " + chalk.blueBright(data.react_app_template)
                    : "",
            task: () => {
                return execa("npx", arg_list);
            },
        },
    ]);

    await tasks.run();
}

async function do_install_dep(data: IPromptValue) {
    let proc: any = [];

    data.react_app_dependency.map((value) => {
        proc.push({
            title: "installing " + value,
            task: (ctx: any, task: any) => {
                return execa("npm", ["install", "--save", value], {
                    cwd: process.cwd() + "/" + data.react_app_name,
                }).catch((err) => {
                    console.log(chalk.red(err));
                    task.skip("failed install " + value);
                });
            },
        });
    });

    let tasks = new Listr(proc);
    await tasks.run();
}
