import inquirer from "inquirer";
import commander from "commander";
import { stdout } from "process";
import { stderr } from "chalk";
import { exec, spawn } from "child_process";

var ncmd = require("node-cmd");

export function create_reactapp() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "react_app_name",
                message: "masukkan nama aplikasi react anda?",
                filter: (input) => {
                    return new Promise((resolve, reject) => {
                        if (input == "") {
                            reject("invalid");
                        } else {
                            resolve(input);
                        }
                    });
                },
            },
        ])
        .then((res) => {
            let name = res.react_app_name;
            console.log("anda akan membuat applikasi reactjs dengan nama " + name + "\n");

            const create_app = spawn("npx", ["create-react-app", name], {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit",
            });

            create_app.on("exit", () => {
                console.log("exit create process \n");

                console.log("begin remove dir \n");

                spawn("rm", ["-rf", name], {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit",
                });
            });
        });
}
