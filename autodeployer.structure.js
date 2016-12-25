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
                    var spawn = spawns[spawnName]
                    
                    if (!spawn.memory.deployed && room.controller.level == 2) 
                    {
                        var startpoint = spawn.pos;
                        for (var sourceid in sources) 
                        {
                            var source = sources[sourceid];
                            var path = PathFinder.search(startpoint, { pos: source.pos, range: 1 });
                            
                            for (var positionid in path.path) 
                            {
                                var position = path.path[positionid];
                                
                                room.createConstructionSite(position, 'road')
                            }
                        }
                    }
                    spawn.memory.deployed = true;
                } 
            }
         }
    }
};

module.exports = autodeployerstructure;
