require('./prototype.creep');
let populater = require('./autodeployer.creeps');
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
    populater.run();
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }
}
