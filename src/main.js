require('./prototype.creep');
require('./prototype.spawn');
require('./prototypeflag');
let autodeployerstructure = require('./autodeployer.structure');
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
    autodeployerstructure.run();
    for (let name in Memory.creeps)
    {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined)
        {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    for(let flagname in Game.flags)
    {
        Game.flags[flagname].run();
    }
    // for each creeps
    for (let name in Game.creeps)
    {
        // run creep logic
        Game.creeps[name].runRole();
    }

    for (let spawnName in Game.spawns)
    {
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }
}
