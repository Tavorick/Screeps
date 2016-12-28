var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var populater = require('populater');
var autodeployerstructure = require('autodeployer.structure');
var rolerepairer = require('role.repairer');
var roleSentryDrone = require('role.centrydrone');
module.exports.loop = function () 
{
    
    var towers = Game.rooms.W49N71.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    var tower = towers[0];
    if(tower == STRUCTURE_TOWER) 
    {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    autodeployerstructure.run();
    populater.run();
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
        {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') 
        {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') 
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
