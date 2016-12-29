let autodeployerstructure =

    {
        run: function ()
        {
            if (Memory.autodeploy)
            {
                for (let room of Game.rooms)
                {
                    let spawns = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                    for (let spawn of spawns)
                    {
                        this.DeployExtentions(room, spawns[spawn]);
                        this.DeployRoads(room, spawn);
                    }
                }
            }
        },

        DeployRoads: function (room, spawn)
        {
            if (!spawn.memory.deployed && room.controller.level == 2)
            {
                let sources = room.find(FIND_SOURCES);
                let startpoint = spawn.pos;
                for (let source of sources)
                {
                    let source = sources[source];
                    let path = PathFinder.search(startpoint, {pos: source.pos, range: 1});
                    for (let position of path.path)
                    {
                        room.createConstructionSite(position, 'road');
                    }
                }
                spawn.memory.deployed = true;
            }
        },

        DeployExtentions: function (room, spawn)
        {
            let position = spawn.pos;
            room.createConstructionSite(position.x + 2, position.y + 2, 'extention');
            room.createConstructionSite(position.x + 2, position.y, 'extention');
            room.createConstructionSite(position.x + 2, position.y - 1, 'extention');
            room.createConstructionSite(position.x - 2, position.y + 1, 'extention');
            room.createConstructionSite(position.x - 2, position.y, 'extention');
        }
    };

module.exports = autodeployerstructure;
