let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let populater = require('./populater');
let autodeployerstructure = require('./autodeployer.structure');
let rolerepairer = require('./role.repairer');
let roleSentryDrone = require('./role.centrydrone');
module.exports.loop = function ()
{

    let towers = Game.rooms.E61S78.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    let tower = towers[0];
    if (tower == STRUCTURE_TOWER)
    {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure)
        {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile)
        {
            tower.attack(closestHostile);
        }
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
        if (creep.memory.role == 'centrydrone')
        {
            roleSentryDrone.run(creep);
        }
    }
}
