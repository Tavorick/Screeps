var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var populater = require('populater');
var autodeployerstructure = require('autodeployer.structure');
module.exports.loop = function () 
{
    var tower = Game.getObjectById('585c571bbadd410834158e2f');
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
    }
}
