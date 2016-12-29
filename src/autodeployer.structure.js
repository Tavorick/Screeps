let autodeployerstructure =

    {
        run: function ()
        {
            if (Memory.autodeploy)
            {
                for (let roomName in Game.rooms)
                {
                    let room = Game.rooms[roomName];
                    let spawns = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                    for (let spawnName in spawns)
                    {
                        this.DeployExtentions(room, spawns[spawnName]);
                        this.DeployRoads(room, spawns[spawnName]);
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
                for (let sourceid in sources)
                {
                    let source = sources[sourceid];
                    let path = PathFinder.search(startpoint, {pos: source.pos, range: 1});

                    for (let positionid in path.path)
                    {
                        let position = path.path[positionid];
                        room.createConstructionSite(position, 'road');
                    }
                }
                spawn.memory.deployed = true;
            }
        },

        DeployExtentions: function (room, spawn)
        {
            let pos = spawn.pos;

            room.createConstructionSite(pos.x + 2, pos.y + 2, STRUCTURE_EXTENSION);
            room.createConstructionSite(pos.x + 2, pos.y, STRUCTURE_EXTENSION);
            room.createConstructionSite(pos.x + 2, pos.y - 1, STRUCTURE_EXTENSION);
            room.createConstructionSite(pos.x - 2, pos.y + 1, STRUCTURE_EXTENSION);
            room.createConstructionSite(pos.x - 2, pos.y, STRUCTURE_EXTENSION);
        }
    };

module.exports = autodeployerstructure;
