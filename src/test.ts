const fs = require('fs');

// tableau des orientations possibles
let Orietation_g: string[] =['N','E','S','W']

// retourne la nouvelle direction aprés avoir tourné à gauche ou à droite

function getDirection(currentDirection: string, turnDirection: string) {
    let x: number = Orietation_g.indexOf(currentDirection);
    let length : number = Orietation_g.length;
    if(turnDirection === 'L') {
        x = ((x - 1) + length) % length;
    } else if(turnDirection === 'R') {
        x = (x + 1) % length;
    }

    return Orietation_g[x];
}

// retourne les nouvelles coordonnées aprés un mouvement dans la direction donnée

function move(Xi: number, Yi: number, Orietation: string) {
    switch (Orietation) {
        case 'N':
          Yi = Yi + 1;
            break;
        case 'E':
          Xi = Xi + 1;
            break;
        case 'S':
          Yi = Yi - 1;
            break;
        case 'W':
          Xi = Xi - 1;
            break;
    }
    return {Xi, Yi};
}

// function principale qui excute les instructions pour une tondeuse donnée

function f(Xi: number, Yi: number, i_orientation: string, Xf: number, Yf: number, instructions: string[]) {
return new Promise((resolve) =>{
    for(var i = 0; i < instructions.length; i++){
        // si l'instruction est un changement de direction, on change l'orientation de la tondeuse
        if (instructions[i] === 'L' || instructions[i] === 'R') {
            i_orientation = getDirection(i_orientation, instructions[i]);
            // si l'instruction est un mouvement en avant, on bouge la tondeuse
        } else if(instructions[i] === 'F') {
            let newCoordinates = move(Xi, Yi, i_orientation);
            // on vérifie que la tondeuse ne sort pas de la pelouse
            if( (newCoordinates.Xi >= 0) && (newCoordinates.Xi <= Xf) && (newCoordinates.Yi >= 0) && (newCoordinates.Yi <= Yf)) {
                Xi = newCoordinates.Xi;
                Yi = newCoordinates.Yi;   
            }
        }
    }    
    resolve(Xi + ' ' + Yi + ' ' + i_orientation);
  });
}
// interface pour stocker les informations de chaque tondeuse
interface Mower {
  x: number;
  y: number;
  orientation: string;
  instructions: string[];
}

// lis le contenu du fichier input.txt 
const fileContent = fs.readFileSync('./src/input.txt', 'utf8');
// sépare le contenu du fichier par ligne
const lines = fileContent.split('\n');
// récupére la taille de la pelouse
const lawnSize = lines[0].split(' ').map(Number);

const mowers: Mower[] = [];

// récupére les informations de chaque tondeuse
for(let i=1; i < lines.length; i+=2) {
    // split la premiére ligne pour avoir la position et l'orientation
    const position = lines[i].split(' ');
    // split la deuxiéme ligne pour avoir les instructions
    const instructions = lines[i+1].split('').filter(char => char !== '\r' && char !== '\n');

    // ajoute les informations de la tondeuse dans la liste mowers

    mowers.push({
      x: Number(position[0]),
      y: Number(position[1]),
      orientation: position[2].trim(),
      instructions
    });
    }

// excute les instructions pour chaque tondeuse sequentiellment
async function run(){
  for(const mower of mowers) {
  const result = await f(mower.x, mower.y, mower.orientation, lawnSize[0], lawnSize[1], mower.instructions);
  // affiche le résultat
  console.log(result);
}}

run();