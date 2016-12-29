let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let populater = require('./populater');
let autodeployerstructure = require('./autodeployer.structure');
let rolerepairer = require('./role.repairer');
let roleSentryDrone = require('./role.sentrydrone');
let roletower = require('./role.tower;')
module.exports.loop = function ()
{

    let towers = Game.rooms.E61S78.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (towerid in towers)
    {
        let tower = towers[towerid];
        roletower.run(tower);
    }

    autodeployerstructure.run();
    populater.run();
    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'harvester')
        {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader')
        {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder')
        {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer')
        {
            rolerepairer.run(creep);
        }
        if (creep.memory.role == 'sentrydrone')
        {
            roleSentryDrone.run(creep);
        }
    }
}
