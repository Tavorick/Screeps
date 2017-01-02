let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let populater = require('./autodeployer.creeps');
let autodeployerstructure = require('./autodeployer.structure');
let rolerepairer = require('./role.repairer');
let roleSentryDrone = require('./role.sentrydrone');
let roletower = require('./role.tower');
module.exports.loop = function ()
{
    for (let roomname in Game.rooms)
    {
        let towers = Game.rooms[roomname].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for (let towerid in towers)
        {
            roletower.run(towers[towerid]);
        }
    }
    //test
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
