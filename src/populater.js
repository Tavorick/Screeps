let populater =
{
    
    run: function()
    {
        for(let i in Memory.creeps)
        {
             if(!Game.creeps[i])
             {
                 delete Memory.creeps[i];
             }
        }
        const rooms = Game.rooms;
        for (let roomname in rooms)
        {
            let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
            let centryDrones = _.filter(Game.creeps, (creep) => creep.memory.role == 'centrydrone');
            let requiredharvesters = 0;
            let requiredcentrydrones = 2;
            let requiredupgraders = 4;
            let requiredbuilders = 3;
            let requiredrepairers = 0;

            let hostiles = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) 
            {
                requiredcentrydrones = 4;
                requiredupgraders = 1;
                requiredbuilders = 1;
            }
            
            for (let roomname in rooms)
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
       let creep = Game.spawns['Home'].createCreep(this.GetBodyParts(roomname, role), undefined, {role: role, spawnroom: roomname});
        console.log(creep);
       if (creep =! -6)
       {
           console.log('Spawning new ' + role + ': ' + creep);
       }
       
   },
   
   GetBodyParts:function(roomname, role)
    {
        let body = [WORK,CARRY,MOVE];
        let energycost = 300;
        let desiredpart = '';
        let energyCapasity = Game.rooms[roomname].energyAvailable;
        let partcost = 100;
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
