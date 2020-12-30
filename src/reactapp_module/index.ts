import inquirer from "inquirer";
import chalk from "chalk";
import execa from "execa";
const Listr = require("listr");
import Table from "cli-table";
import { Observable } from "rxjs";

type dep = "react-router-dom" | "bootstrap@4.5.3" | "axios" | "node-sass";
type template = "default" | "typescript";

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
const list_template: template[] = ["default", "typescript"];

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
                        } else if (input.length > 30) {
                            reject("nama terlalu panjang");
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
                message: "template apa yang anda inginkan",
                choices: list_template,
            },
        ])
        .then(async (res: IPromptValue) => {
            try {
                if (res.react_app_name) {
                    console.log("==================================================");
                    console.log(
                        chalk.blueBright("menginstall aplikasi react dengan nama " + res.react_app_name + "\n")
                    );
                    await do_create_react_app(res);
                }

                if (res.react_app_dependency) {
                    console.log("==================================================");

                    console.log(chalk.blueBright("menginstall dependency : ", res.react_app_dependency.join(" ")));
                    await do_install_dep(res);
                }

                await do_finish_message(res);
            } catch (e) {
                console.log(chalk.red("Process gagal, silahkan coba lagi"));
            }
        });
}

async function do_create_react_app(data: IPromptValue) {
    let arg_list: any = [];

    arg_list.push("create-react-app");
    arg_list.push(data.react_app_name);

    if (data.react_app_template != undefined && data.react_app_template != "default") {
        arg_list.push("--template");
        arg_list.push(data.react_app_template);
    }

    let tasks = new Listr([
        {
            title:
                data.react_app_template != undefined && data.react_app_template != "default"
                    ? "installing react app dengan template " + chalk.blueBright(data.react_app_template)
                    : "installing react app",
            task: () => {
                // return execa("npx", arg_list);

                return new Observable((observable) => {
                    try {
                        let proc = execa("npx", arg_list);

                        proc.stdout?.on("data", (data) => {
                            observable.next(data.toString());
                        });

                        proc.on("exit", () => {
                            observable.complete();
                        });
                    } catch (e) {
                        observable.error("error create app");
                    }
                });
            },
        },
    ]);

    await tasks.run();
}

async function do_install_dep(data: IPromptValue) {
    let proc: any = [];

    let list_dep: any[] = data.react_app_dependency;

    if (data.react_app_dependency.includes("bootstrap@4.5.3")) {
        list_dep.push("jquery");
        list_dep.push("popper.js");
    }

    list_dep.map((value) => {
        proc.push({
            title: "installing " + value,
            task: (ctx: any, task: any) => {
                return execa("npm", ["install", "--save", value], {
                    cwd: process.cwd() + "\\" + data.react_app_name,
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

async function do_finish_message(data: IPromptValue) {
    console.log(
        chalk.greenBright("berhasil membuat app pada directory : " + process.cwd() + "\\" + data.react_app_name)
    );
    console.log(
        chalk.greenBright(
            "untuk memulai silahkan masuk ke dalam directory tersebut dan jalankan perintah " +
                chalk.blueBright("npm start")
        )
    );

    let dep =
        data.react_app_dependency.length > 3
            ? data.react_app_dependency.slice(0, 3).join(" ,") + " dll."
            : data.react_app_dependency;

    const table = new Table();

    table.push(
        { "Nama App": data.react_app_name },
        { Directory: process.cwd() + "\\" + data.react_app_name },
        { "Installed dependency": dep },
        { Template: data.react_app_template }
    );

    console.log(table.toString());
}
