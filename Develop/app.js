const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
let currentEmployeeQuestion; 
let currentEmployee;
let newEmployee;
let allEmployees = [];
const managerQuestion = [
    {
        type: 'input',
        name: 'officeNumber',
        message: 'Please enter your office number.',
    }
]
const engineerQuestion = [
    {
        type: 'input',
        name: 'gitHub',
        message: 'Please enter your GitHub username.',
    },
]
const internQuestion = [
    {
        type: 'input',
        name: 'school',
        message: 'Please enter the name of your school.',
    },
]
function teamMembers(){
    inquirer    
        .prompt([
            {
                type: 'list',
                name: 'position',
                message: 'Please select your position with the company',
                choices: ['Engineer', 'Intern', 'Manager', 'Quit']
            },
        ]).then((response) => {
            if (response.position === 'Quit') {
                try {
                    fs.writeFileSync(outputPath, render(allEmployees))
                    console.log('Congrats you made a team!');
                    return;
                } catch(err) {
                    console.error(err);
                }
            }
            else {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is your name?.',
                    },
                    {
                        type: 'input',
                        name: 'id',
                        message: 'Please enter your ID number.',
                    },
                    {
                        type: 'input',
                        name: 'email',
                        message: 'Please enter your email address.',
                    },
                ]).then(response2 => {
                    currentEmployee = {
                        ...response,
                        ...response2
                    }
                    switch (response.position){
                        case 'Engineer': 
                            currentEmployeeQuestion = engineerQuestion;
                            continuePrompt();
                            break;
                        case 'Intern':
                            currentEmployeeQuestion = internQuestion;
                            continuePrompt();
                            break;
                        case 'Manager':
                            currentEmployeeQuestion = managerQuestion;
                            continuePrompt();
                            break;
                    }
                })
            }
        })
}
function continuePrompt() {
    inquirer    
    .prompt(currentEmployeeQuestion).then((response) => {
        switch (currentEmployee.position){
            case 'Engineer': 
                newEmployee =  new Engineer(currentEmployee.name, currentEmployee.id, currentEmployee.email, response.gitHub);                
                break;
            case 'Intern':
                newEmployee = new Intern(currentEmployee.name, currentEmployee.id, currentEmployee.email, response.school)              
                break;
            case 'Manager':
                newEmployee = new Manager(currentEmployee.name, currentEmployee.id, currentEmployee.email, response.officeNumber)                    
                break;
        }
        console.log(newEmployee)
        allEmployees.push(newEmployee);
        console.log(allEmployees);
    }).then( () => teamMembers());
}
teamMembers();


