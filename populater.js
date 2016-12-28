var populater =
{
    
    run: function()
    {
        for(var i in Memory.creeps) 
        {
             if(!Game.creeps[i])
             {
                 delete Memory.creeps[i];
             }
        }
        var rooms = Game.rooms;
        for (var roomname in rooms) 
        {
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            var energyAvaileble = Game.rooms[roomname].energyAvailable;
            var energyCapasity = Game.rooms[roomname].energyCapacityAvailable;
            var requiredharvesters = 0;
            
            for (var roomname in rooms)
            {
               
                requiredharvesters += rooms[roomname].find(FIND_SOURCES).length;
            }
            
            if(harvesters.length < requiredharvesters * 2  ) 
            {
                var name = this.CreateCreep('harvester',roomname)
                if (name =! 6) 
                {
                    console.log('Spawning new harvester: ' + name);
                }
            }
            else
            {
                if(upgraders.length < 3 && energyAvaileble == energyCapasity) 
                {
                    console.log('Spawning new upgrader: ' + this.CreateCreep('upgrader', roomname));
                }
                else
                {
                    if(builders.length < 3 && energyAvaileble == energyCapasity) 
                    {
                        console.log('Spawning new builder: ' + this.CreateCreep('builder', roomname));
                    }
                }
            }
        }
    },
        
    
   CreateCreep:function(role, roomname)
   {
       return Game.spawns['Home'].createCreep(this.GetBodyParts(roomname), undefined, {role: role, spawnroom: roomname});
   },
   
   GetBodyParts:function(roomname)
    {
        var energyCapasity = Game.rooms[roomname].energyAvailable;
        if (energyCapasity < 550) 
        {
            return [WORK,CARRY,MOVE];    
        }
        else
        {
            return [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
        }
    } 
};

module.exports = populater;
