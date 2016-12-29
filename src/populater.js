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
            var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
            var centryDrones = _.filter(Game.creeps, (creep) => creep.memory.role == 'centrydrone');
            var energyAvaileble = Game.rooms[roomname].energyAvailable;
            var energyCapasity = Game.rooms[roomname].energyCapacityAvailable;
            
            var requiredharvesters = 0;
            var requiredcentrydrones = 2;
            var requiredupgraders = 4;
            var requiredbuilders = 3;
            var requiredrepairers = 0;
            
            var hostiles = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) 
            {
                requiredcentrydrones = 4;
                requiredupgraders = 1;
                requiredbuilders = 1;
            }
            
            for (var roomname in rooms)
            {
                requiredharvesters += rooms[roomname].find(FIND_SOURCES).length;
            }
            
            if(harvesters.length < requiredharvesters * 2 &&  requiredcentrydrones < 4) 
            {
                this.CreateCreep('harvester',roomname);
            }
            
            if (centryDrones.length < requiredcentrydrones) 
            {
                this.CreateCreep('centrydrone',roomname);
            }
           
            if(upgraders.length < 3) 
            {
                this.CreateCreep('upgrader', roomname);
            }
               
            if(builders.length < 2) 
            {
                this.CreateCreep('builder', roomname);
            }
                  
            if(repairers.length < 2)
            {
                //this.CreateCreep('repairer', roomname);
            }               
        }
    },
    
   CreateCreep:function(role, roomname)
   {
        var creep = Game.spawns['Home'].createCreep(this.GetBodyParts(roomname, role), undefined, {role: role, spawnroom: roomname});
        console.log(creep);
       if (creep =! -6) 
       {
           console.log('Spawning new ' + role + ': ' + creep);
       }
       
   },
   
   GetBodyParts:function(roomname, role)
    {
        var body = [WORK,CARRY,MOVE];
        var energycost = 300;
        var desiredpart = '';
        var energyCapasity = Game.rooms[roomname].energyAvailable;
        var partcost = 100;
        switch (role) 
        {
            case 'transporter':
                desiredpart = 'CARRY';
                break;
                
            case 'centrydrone':
                desiredpart = 'attack';
                partcost = 70;
                body = [MOVE, MOVE, TOUGH, ATTACK];
                energycost = 290;
                break;
            
            default:
                desiredpart = 'work';
        }
       while(energycost <= energyCapasity)
       {
           energycost += partcost;
           body.push(desiredpart);
       }
        return body;
    } 
};

module.exports = populater;
