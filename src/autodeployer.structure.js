var autodeployerstructure =

{
    run:function()
    {
         if (Memory.autodeploy) 
         {
            for (var roomName in Game.rooms)
            {
                var room = Game.rooms[roomName];
                var spawns = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                var sources = room.find(FIND_SOURCES);
                for (var spawnName in spawns) 
                {
                    this.DeployExtentions(room, spawns[spawnName]);
                    this.DeployRoads(room,spawns[spawnName]);
                } 
            }
         }
    },
    
    DeployRoads:function(room, spawn)
    {
        if (!spawn.memory.deployed && room.controller.level == 2) 
        {
            var sources = room.find(FIND_SOURCES);
            var startpoint = spawn.pos;
            for (var sourceid in sources) 
            {
                var source = sources[sourceid];
                var path = PathFinder.search(startpoint, { pos: source.pos, range: 1 });
                            
                for (var positionid in path.path) 
                {
                    var position = path.path[positionid];
                    room.createConstructionSite(position, 'road');
                }
            }
            spawn.memory.deployed = true;
        } 
    },
    
    DeployExtentions:function(room, spawn)
    {
        pos = spawn.pos;
        room.createConstructionSite(pos.x +2, pos.y +2, 'extention');
        room.createConstructionSite(pos.x +2, pos.y, 'extention');
        room.createConstructionSite(pos.x +2, pos.y -1, 'extention');
        room.createConstructionSite(pos.x -2, pos.y +1, 'extention');
        room.createConstructionSite(pos.x -2, pos.y, 'extention');
    }
};

module.exports = autodeployerstructure;
